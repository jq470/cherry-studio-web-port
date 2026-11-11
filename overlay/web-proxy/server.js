/**
 * 极简本地 CORS 代理（零依赖，Node 原生 http/https）。
 *
 * 用途：浏览器里的 Cherry Studio Web 直连模型官方接口会被 CORS 拦截，
 * 由本代理转发请求并补上跨域响应头。仅建议本机 / 内网自用，不要裸奔公网。
 *
 * 转发规则（二选一）：
 *  1. 路径方式（推荐，直接填进 Provider 的 Base URL）：
 *       http://localhost:8787/<上游Origin>/<剩余路径>
 *     例：http://localhost:8787/https://api.openai.com/v1/chat/completions
 *     在 App 的 Provider Base URL 填：http://localhost:8787/https://api.openai.com/v1
 *
 *  2. 请求头方式：
 *       给请求加 `x-upstream: https://api.openai.com/v1`，代理按原路径转发。
 *
 * 转发的请求头：authorization、x-api-key、content-type、accept、
 * anthropic-version、anthropic-beta、openai-organization。
 * 流式（SSE）响应原样透传。
 *
 * 启动：node server.js   （端口可用环境变量 PORT 覆盖，默认 8787）
 */

const http = require('http');
const https = require('https');
const { URL } = require('url');

const PORT = Number(process.env.PORT || 8787);

// 可选：逗号分隔的上游 origin 白名单，留空表示不限制（仅本机自用）。
const ALLOWLIST = (process.env.UPSTREAM_ALLOWLIST || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

const FORWARD_REQUEST_HEADERS = [
  'authorization',
  'x-api-key',
  'content-type',
  'accept',
  'anthropic-version',
  'anthropic-beta',
  'openai-organization',
  'openai-beta',
  'x-stainless-*',
];

function corsHeaders(req) {
  return {
    'Access-Control-Allow-Origin': req.headers.origin || '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers':
      'Content-Type, Authorization, X-Api-Key, Accept, Anthropic-Version, Anthropic-Beta, OpenAI-Organization, OpenAI-Beta, X-Upstream',
    'Access-Control-Max-Age': '86400',
  };
}

function resolveUpstream(req, pathname) {
  // 方式 2：请求头优先
  const headerUpstream = req.headers['x-upstream'];
  if (headerUpstream) return { base: headerUpstream, rest: pathname };

  // 方式 1：路径里第一段是 http(s)://origin
  const m = pathname.match(/^\/(https?:\/\/[^/]+)(\/.*)?$/);
  if (m) {
    return { base: m[1], rest: m[2] || '/' };
  }
  return null;
}

function isAllowed(origin) {
  if (!ALLOWLIST.length) return true;
  return ALLOWLIST.some((a) => origin === a || origin.startsWith(a));
}

const server = http.createServer((req, res) => {
  // 预检
  if (req.method === 'OPTIONS') {
    res.writeHead(204, corsHeaders(req));
    return res.end();
  }

  const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  const upstream = resolveUpstream(req, pathname);

  if (!upstream) {
    res.writeHead(400, { ...corsHeaders(req), 'Content-Type': 'application/json' });
    return res.end(
      JSON.stringify({
        error: 'Missing upstream. Use path /<https://origin>/<path> or x-upstream header.',
      }),
    );
  }

  let base;
  try {
    base = new URL(upstream.base);
  } catch {
    res.writeHead(400, { ...corsHeaders(req), 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ error: 'Invalid upstream URL.' }));
  }

  if (!isAllowed(base.origin)) {
    res.writeHead(403, { ...corsHeaders(req), 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ error: 'Upstream not allowed by proxy allowlist.' }));
  }

  // 组装目标 URL：base 可能已带 /v1 之类前缀
  const basePath = base.pathname === '/' ? '' : base.pathname.replace(/\/$/, '');
  const targetPath = upstream.rest.startsWith('/') ? upstream.rest : `/${upstream.rest}`;
  const target = new URL(`${base.origin}${basePath}${targetPath}`);
  const query = new URL(req.url, 'http://localhost').search;
  if (query) target.search = query;

  // 挑选要转发的请求头
  const headers = {};
  for (const [k, v] of Object.entries(req.headers)) {
    const lk = k.toLowerCase();
    if (FORWARD_REQUEST_HEADERS.some((h) => (h.endsWith('*') ? lk.startsWith(h.slice(0, -1)) : lk === h))) {
      headers[lk] = v;
    }
  }
  headers.host = base.host;

  const proxyReq = https.request(
    {
      protocol: base.protocol,
      hostname: base.hostname,
      port: base.port || (base.protocol === 'https:' ? 443 : 80),
      path: target.pathname + target.search,
      method: req.method,
      headers,
    },
    (proxyRes) => {
      res.writeHead(proxyRes.statusCode, {
        ...corsHeaders(req),
        'Content-Type': proxyRes.headers['content-type'] || 'application/json',
        'Cache-Control': proxyRes.headers['cache-control'] || 'no-store',
      });
      // SSE / 普通响应都直接透传流
      proxyRes.pipe(res);
    },
  );

  proxyReq.on('error', (err) => {
    res.writeHead(502, { ...corsHeaders(req), 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: `Proxy upstream error: ${err.message}` }));
  });

  req.pipe(proxyReq);
});

server.listen(PORT, () => {
  console.log(`[cherry-web-proxy] listening on http://localhost:${PORT}`);
  console.log(`  例: http://localhost:${PORT}/https://api.openai.com/v1/chat/completions`);
});
