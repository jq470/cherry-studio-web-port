# Cherry Studio App → Web 版（最小改动移植）

把官方移动端 [CherryHQ/cherry-studio-app](https://github.com/CherryHQ/cherry-studio-app)（Expo + React Native）移植成可在浏览器运行的 Web 应用。

**业务代码零改动**：所有适配都是两个锚点配置补丁 + 独立 `.web.js` 桩文件，通过 Metro 解析器重定向，原生 android/ios 构建不受影响。

## 这个仓库是什么

一个**覆盖层（overlay）仓库**，不含上游源码。CI 会：

1. 克隆官方仓库到 `upstream/`
2. 检出到钉住的 commit `a0cddfa`（本覆盖层适配的基线）
3. 用 `scripts/apply-overlay.sh` 把覆盖层应用进去
4. `pnpm install` → `npx expo export --platform web`
5. 把 `dist-web/` 作为 artifact 上传

> 之所以不在本地打：本地沙箱句柄上限锁死 2048，Metro 并行读几千个文件必崩 EMFILE。GitHub Actions runner 是标准 Ubuntu，没有这个限制。

## 目录结构

```
overlay/
  src/web-shims/*.js          # 16 个原生模块的浏览器桩
  web-proxy/                  # 零依赖本地 CORS 代理（开发用）
  WEB-ADAPTATION.md           # 完整改动记录 + 待观察清单 + Web 天生限制
scripts/
  apply-overlay.sh            # 总装脚本
  patch-app-json.js           # 往 app.json 的 expo.web 合并 bundler/output/name（幂等、查重键）
  patch-metro.js              # 往 metro.config.js 的 resolver 注入 web 桩映射（幂等）
.github/workflows/
  web-build.yml               # 安装依赖 + 导出 web 包 + 上传 artifact（失败时把日志回写仓库）
```

## 16 个 Web 桩覆盖的原生模块

**核心/存储**：`react-native-mmkv`（→ localStorage）、`react-native-quick-crypto`（→ WebCrypto）、`expo-glass-effect`、`react-native-nitro-theme-transition`、`react-native-keyboard-controller`

**语音/相机/相册**：`expo-camera`、`expo-image-picker`、`expo-media-library`、`react-native-view-shot`、`expo-audio`、`expo-speech`、`expo-speech-recognition`

**系统/分享/WebView**：`react-native-reserved-regions`、`expo-intent-launcher`、`react-native-share`、`react-native-webview`（→ iframe）

详见 `overlay/WEB-ADAPTATION.md`。

## 拿产物

CI 跑完后到 **Actions → web-build → 最新运行 → Artifacts** 下载 `cherry-studio-web.zip`，解压即静态站点。

产物是 **SPA（`output: single`）**：一个 `index.html` + JS/CSS 资源，路由在客户端解析。部署时记得开 **SPA 回退**（所有未匹配路径都返回 `index.html`）：

- Cloudflare Pages：默认支持，无需配置
- Vercel：`{"rewrites":[{"source":"/all","destination":"/index.html"}]}`
- Netlify：`[[redirects]]  from = "/*"  to = "/index.html"  status = 200`
- Nginx：`try_files $uri $uri/ /index.html;`

> 为什么不是 `output: static`：那会在导出时用 Node 预渲染每个路由，而这套代码是给原生写的，大量 `window`/`document`/`localStorage` 在模块顶层访问，预渲染必崩。`single` 完全在浏览器里渲染，绕开这一类问题。

## 本地跑（可选）

```bash
git clone https://github.com/CherryHQ/cherry-studio-app.git upstream
cd upstream && git checkout a0cddfa51026675abe69b7a7b9ee37a529ac4e32
cd ..
bash scripts/apply-overlay.sh
cd upstream
pnpm install
PROFILE=production npx expo export --platform web
```

开发预览：`PROFILE=development npx expo start --web`

### 跨域问题

浏览器直连模型官方接口会被 CORS 拦。启动本地代理：

```bash
cd upstream/web-proxy
node server.js
```

App 里 Provider 的 Base URL 填 `http://localhost:8787/https://<上游域名>/v1`。

## 已知限制

- **本地模型**（Ollama / GGUF）：浏览器无法直连本地原生推理
- **MCP stdio / 后台任务 / 桌面小组件**：浏览器沙箱不支持，仅保留远程 HTTP/SSE 类型 MCP
- **数据持久化**：OPFS（SQLite）+ localStorage（KV 桩）；隐私模式下 OPFS 可能不持久
- **首次启动待观察**：Skia 画布、iframe 消息桥、Markdown 渲染、SSE 流式

## 协议

覆盖层代码用于适配 [Cherry Studio App](https://github.com/CherryHQ/cherry-studio-app)，上游为 **AGPL-3.0**。若分发修改后的应用，需遵守 AGPL 的开源义务。
