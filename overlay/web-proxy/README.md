# Cherry Studio Web 本地 CORS 代理

零依赖 Node 代理，解决浏览器直连模型接口的跨域问题。

## 启动

```bash
cd web-proxy
node server.js
# 默认端口 8787，可用 PORT=9000 node server.js 改端口
```

## 在 App 里怎么填

在 Cherry Studio Web 的 Provider 配置里，**Base URL** 填代理地址 + 上游 Origin：

| 上游 | App 里填的 Base URL |
|---|---|
| OpenAI | `http://localhost:8787/https://api.openai.com/v1` |
| OpenAI 兼容（DeepSeek 等） | `http://localhost:8787/https://api.deepseek.com/v1` |
| Anthropic | `http://localhost:8787/https://api.anthropic.com/v1` |

API Key 照常填到 App 的密钥栏，代理会把 `Authorization: Bearer ...` / `x-api-key` 原样转发。

## 转发规则

- 路径方式：`http://localhost:8787/<https://上游Origin>/<剩余路径>`
- 或请求头方式：加 `x-upstream: https://上游Origin`
- 自动转发：`authorization`、`x-api-key`、`content-type`、`accept`、`anthropic-version`、`anthropic-beta`、`openai-organization` 等
- SSE 流式响应原样透传

## 安全注意

- **仅供本机 / 内网自用**。代理默认不限制上游，不要直接暴露到公网。
- 如需限制可访问的上游，设置环境变量白名单：
  ```bash
  UPSTREAM_ALLOWLIST="https://api.openai.com,https://api.deepseek.com" node server.js
  ```
- 代理只做转发，不存储任何 Key 或对话内容。

## 部署到公网（可选）

如果要把 Web 版部署到线上，代理需要一起部署（Node 服务），不要在浏览器端硬编码上游 Key。Cloudflare Workers / Vercel Edge / 自建 Node 均可照搬这套转发逻辑。
