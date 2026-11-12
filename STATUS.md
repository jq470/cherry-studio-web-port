# 当前状态（STATUS）

> 最近一次 CI：run `43206967386`（commit `f6817a7`）。静态打包稳定成功；浏览器运行时仍卡在 SQLite worker。

## 已完成（编译期，CI 绿）

- 覆盖层仓库：克隆上游 `CherryHQ/cherry-studio-app@a0cddfa`，套桩 + 锚点补丁脚本，业务源码零改动。
- `expo export --platform web` 可稳定产出静态包（`dist-web/`，约 163M / 684 文件），artifact `cherry-studio-web`。
- 已解决的编译期问题：`output: single`（SPA，避免 Node 预渲染崩溃）、`wasm` 入 `assetExts`、RNW `InputAccessoryView` 目录导出接管、`--frozen-lockfile`、26 个原生模块桩、RN 内部子路径兜底重定向、COOP/COEP 隔离头静态服务器。
- CI 已加 pnpm store 与 Metro 缓存以缩短后续构建时间。

## 运行时阻塞（未解决）

启动链路：`DbService.onInit → openDatabaseSync → NativeDatabase.initSync → invokeWorkerSync`，主线程在 SharedArrayBuffer 上 `Atomics` 忙等 worker 回包，超时抛 `Error: Sync operation timeout`，应用落到 `StartupFailureScreen` 兜底页。

已排除/已确认的事实（来自 build-report / runtime-smoke）：

- 隔离环境正常：`crossOriginIsolated=true`、`SharedArrayBuffer=true`、`Worker=true`、`WebAssembly=true`、4 核。
- wa-sqlite.wasm 已被 Metro 导出到 `assets/.../expo-sqlite/web/wa-sqlite/wa-sqlite.<hash>.wasm`。
- 独立 worker chunk `worker-d41d8….js` 已导出，**383KB，内含真实代码**：`onmessage`、`postMessage`、`wa-sqlite`、`wa-sqlite.wasm`、`Atomics`、`SharedArrayBuffer` 符号齐全。
- 运行时实际用的是 **`blob:` URL** 构造 Worker（`new Worker(workerUrl, workerOpts)`），浏览器没有再去拉独立 chunk；worker 内部报错未被冒烟脚本捕获（blob worker 的 error/pageerror 未透传到 puppeteer）。
- 无 worker/wasm 404；失败请求只有首页 `GET / net::ERR_ABORTED`。

### worker 包装机制（本轮本地源码确认）

`expo/build/async-require/asyncRequireModule.js` 的 `unstable_createWorker`：当 `crossOriginIsolated` 为真时，把真实 worker chunk URL 包成一个 `Blob` 内联脚本再 `new Worker(blobUrl)`。内联脚本里：

- `self.fetch`、`self.importScripts` 被重写到以真实 chunk URL 为 base 的 `fromBaseURL`；
- **`XMLHttpRequest` 没有被重写**（源码注释明确列出该限制：blob 下 `self.location` 是 blob URL，`new URL`/XHR/WebSocket 相对解析都不会落到真实源）；
- 内联脚本 `importScripts(真实chunkURL)` 加载 383KB 的 worker bundle。

wa-sqlite.js 在 worker 下优先用 `fetch`（streaming → ArrayBuffer）加载 wasm，仅兜底走同步 XHR。因此 fetch 路径理论上被重写覆盖；仍需在产物里确认：① wasm 资产 URL 是绝对路径还是相对路径（相对路径在 blob worker 下会解析到 blob 源）；② worker chunk 是否缺主包 `__common` 里的共享模块，导致 `importScripts` 引导期抛错、`self.onmessage` 未注册。

### 次级问题：未知模块 `4109`（id 在 4913/4896/4146/4109 间漂移）

`Requiring unknown module "4109"`，在主线程启动早期抛出，被 CrashTelemetry 接住后应用继续；父模块尚未定位。冒烟脚本已修：`document.scripts` 需在浏览器 `evaluate` 内取（此前在 Node 侧访问 `document` 报 `document is not defined`，导致映射中断）；下一轮报告把缺失 id 映射到源码路径与调用方。

## 下一步排查顺序（需要能看到 runner 日志 / 下载 artifact 的环境）

1. 从 artifact 取 `worker-*.js`，确认 blob 注入的源码与磁盘 chunk 一致；检查 chunk 内 wa-sqlite.wasm 的 URL 是绝对路径还是相对路径（blob worker 下相对路径会解析到 `blob:` 源导致 wasm 加载失败）。
2. 在 worker 内包一层 `self.onerror` / `addEventListener('error')` 并 `postMessage` 回主线程，把 worker 侧初始化异常（wasm 加载失败 / 未注册模块）透出到主线程 console。
3. 定位未知模块 4109：在导出包里解析 `__d(id, [deps], "path")`，把缺失 id 映射到源码路径与调用方；候选仍未核验 web 入口的原生包见 `WEB-ADAPTATION.md` 清单。
4. 真链打通后，把导出命令从诊断用的 `--dev --no-minify --source-maps external` 切回压缩生产包。

## 临时降级路径（非持久化，仅供先看到壳）

`overlay/src/web-shims/expo-sqlite.web.js` 是内存假库桩。把 `scripts/patch-metro.js` 里 `'expo-sqlite'` 映射恢复到该桩即可跳过 worker；但假库不回写 `RETURNING` 行，种子阶段 `insertWithOrderKey: insert returned no rows` 会报错，需要桩按绑定参数回显一行才能继续。**此路径不提供持久化，仅作降级演示。**

## 部署注意

wa-sqlite / SharedArrayBuffer 要求静态托管同时下发：

- `Cross-Origin-Opener-Policy: same-origin`
- `Cross-Origin-Embedder-Policy: require-corp`（Expo 文档示例用 `credentialless`）

SPA 路由需回退到 `index.html`。详见 `README.md` 部署段。
