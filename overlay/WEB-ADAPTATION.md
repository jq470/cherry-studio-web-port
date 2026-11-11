# Web 版适配改动记录（最小改动）

> 基于官方 `CherryHQ/cherry-studio-app` v0.5.4 @ `a0cddfa51026675abe69b7a7b9ee37a529ac4e32`。
> 所有改动只在两个配置补丁、独立桩文件和一个本地代理里，**业务代码零改动**。
> 原生构建（android/ios）走原有解析路径，不受 web 桩影响。

## 一、改动总览

### 1. `app.json` —— 只改 `expo.web` 这一段
上游本来就有 `web` 段：
```json
"web": { "output": "static", "favicon": "./assets/icon.png" }
```
`scripts/patch-app-json.js` 在**原地**合并键，不新增第二个 `web` 块：
```json
"web": {
  "output": "single",
  "favicon": "./assets/icon.png",
  "bundler": "metro",
  "name": "Cherry Studio Web"
}
```

`output` 从上游的 `static` 改成 `single`：`static` 会在导出阶段用 Node 预渲染每个路由，而这套代码按原生写，模块顶层大量访问 `window`/`document`/`localStorage`，预渲染必崩。`single` 是纯客户端渲染的 SPA。

> 注意：JSON 里重复的 `web` 键会让后者覆盖前者，`bundler` 会丢。脚本会先检查重复键，发现就报错退出。

### 2. `metro.config.js` —— 只插一段 resolver 重定向
`scripts/patch-metro.js` 以 `config.resolver.resolveRequest = (context, moduleName, platform) => {` 为锚点，在其上方插入 `webShimMap`，在函数开头加 `platform === 'web'` 分支。上游原有的 libp2p browser 字段重定向、MCP shims、Expo 运行时锁定逻辑全部保留。

**不改 `maxWorkers`**：GitHub runner 资源充足，让 Metro 用默认并行度跑得更快。

### 3. `src/web-shims/` —— 16 个浏览器桩

#### 启动链 / 存储 / 核心
| 桩文件 | 替代模块 | Web 行为 |
|---|---|---|
| `react-native-mmkv.web.js` | MMKV 原生 KV | localStorage 持久化（按实例 id 前缀），存储被禁时降级内存 Map |
| `react-native-quick-crypto.web.js` | quick-crypto | `subtle` 走浏览器 WebCrypto；`Buffer` 薄封装；原生专用 AES/哈希调用抛明确错误 |
| `expo-glass-effect.web.js` | iOS 液态玻璃 | 可用性返回 false；GlassView/GlassContainer 透传 children |
| `react-native-nitro-theme-transition.web.js` | 主题切换动画 | `withThemeTransition` 直接执行回调 |
| `react-native-keyboard-controller.web.js` | 键盘避让/动画 | Provider/布局组件透传 RNW 原语；钩子返回零值默认；控制器/事件空操作 |

#### 语音 / 相机 / 相册 / 图片
| 桩文件 | 替代模块 | Web 行为 |
|---|---|---|
| `expo-camera.web.js` | 相机扫码 | CameraView 占位；权限返回 denied |
| `expo-image-picker.web.js` | 相机/相册选择 | 权限 denied；launch 返回 canceled |
| `expo-media-library.web.js` | 保存到相册 | 权限 denied；Asset.create 空操作 |
| `react-native-view-shot.web.js` | 原生截图 | captureRef/captureScreen 抛 unsupported；releaseCapture 空操作 |
| `expo-audio.web.js` | 录音/音频会话 | 权限 denied；setAudioModeAsync 空操作 |
| `expo-speech.web.js` | 文字转语音 | speak/stop 空操作；声音列表为空 |
| `expo-speech-recognition.web.js` | 离线语音识别 | 模块方法空操作；不可用；权限 denied |

#### 系统集成 / 分享 / 布局 / WebView
| 桩文件 | 替代模块 | Web 行为 |
|---|---|---|
| `react-native-reserved-regions.web.js` | 折叠屏分区 | Provider 透传；ready 返回 true；分区列表为空 |
| `expo-intent-launcher.web.js` | Android 系统意图 | 常量保留；startActivityAsync 空操作 |
| `react-native-share.web.js` | 原生分享面板 | `Share.open` 抛 unavailable |
| `react-native-webview.web.js` | 原生 WebView | 渲染 `<iframe>`，支持 `source.uri` / `source.html`；ref 方法空操作 |

### 4. `web-proxy/` —— 本地 CORS 代理（零依赖）
独立 Node 服务，解决浏览器直连模型接口跨域。详见 `web-proxy/README.md`。

## 二、已确认无需桩（官方自带 web 回退或纯 JS）

- **Expo 自带 web 回退**：`expo-sqlite`、`expo-file-system`、`expo-secure-store`、`expo-clipboard`、`expo-haptics`、`expo-sharing`、`expo-localization`、`expo-splash-screen`、`expo-notifications`（部分）。
- **纯 JS / RN 原语，RNW 可直接渲染**：`react-native-reanimated`、`react-native-worklets`、`react-native-streamdown`、`react-native-ui-datepicker`、`heroui-native`（provider 为上下文 + RN 原语）。
- **类型-only import，编译期擦除，无运行时依赖**：`react-native-anydoc`、`react-native-background-actions`、`ReservedRegion`（来自 `react-native-reserved-regions`，只在 `import type` 里出现）。
- **仅 `.ios.tsx` / `.android` 文件引用，web 不加载**：`expo-widgets`、`@expo/ui`、部分背景活动组件。
- **`@cherrystudio/*` 原生模块**：走 `requireOptionalNativeModule`，web 下自动返回 null。

## 三、出包步骤

CI 里（即本仓库的 workflow）：
```bash
git clone https://github.com/CherryHQ/cherry-studio-app.git upstream
cd upstream && git checkout a0cddfa51026675abe69b7a7b9ee37a529ac4e32
cd .. && bash scripts/apply-overlay.sh
cd upstream && pnpm install
PROFILE=production npx expo export --platform web --output-dir dist-web
```

本机开发预览：`PROFILE=development npx expo start --web`

### 启动本地代理（解决 CORS）

```bash
cd web-proxy
node server.js   # 默认 8787
```
App 的 Provider Base URL 填：`http://localhost:8787/https://<上游域名>/v1`。

## 四、仍需在浏览器实跑后观察的点

桩按源码用法保守实现，首次 web 启动后可能还有边角问题，按报错补：

1. **Skia 画布**（引导页动画、图片编辑、分享拼图）：`@shopify/react-native-skia`，先确认官方 web 构建能否渲染；不行则隐藏对应入口。
2. **iframe 消息桥**：WebView 桩目前只渲染 iframe，`onMessage`/`injectJavaScript` 是空操作；若 MCP webview / mermaid 预览需要父子通信，再补 `window.postMessage` 对接。
3. **Markdown / 代码块 / 公式 / 表格**：确认 streamdown、katex、markdown-it 在 web 下渲染正常。
4. **SSE 流式**：确认聊天流式返回正常（代理已透传流）。
5. **持久化**：刷新页面后聊天记录仍在（验证 OPFS SQLite + localStorage 桩）。

## 五、Web 天生限制（非代码问题）

- **CORS**：浏览器直连官方接口跨域，需走 `web-proxy` 或后端代理。
- **本地模型（Ollama / 本地 GGUF）**：浏览器无法直连本地原生推理，Web 版只走云端 API / OpenAI 兼容端点。
- **MCP stdio / 系统级集成 / 后台任务 / 桌面小组件**：浏览器沙箱不支持，仅保留远程 HTTP/SSE 类型 MCP。
- **数据持久化**：Web 落在 OPFS（SQLite）+ localStorage（KV 桩）；隐私模式下 OPFS 可能不持久。

## 六、验证状态

- 16 个桩通过语法检查；代理在 Node 18+ 实测通过（预检 / GET / POST / 鉴权头 / 查询串 / SSE 透传）。
- 两个配置补丁在上游原始文件上实测：补丁可打、幂等、metro 语法通过、app.json 无重复键。
- 整套 bundle 与浏览器运行时由本仓库的 GitHub Actions 验证。
