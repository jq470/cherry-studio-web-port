/**
 * Headless runtime smoke test for the exported web bundle.
 *
 * Serves nothing itself; expects a static server already listening at SMOKE_URL
 * (the workflow starts `python3 -m http.server` against dist-web). Launches
 * headless Chromium, loads the page, waits for the client bundle to settle,
 * then records: console errors/warnings, uncaught page errors, failed network
 * requests, title, root mount state, and a body-text excerpt.
 *
 * This is evidence gathering: it never exits non-zero, so a runtime issue
 * surfaces in runtime-smoke.md instead of aborting the green build.
 */
const fs = await import('node:fs');
const path = await import('node:path');
const os = await import('node:os');

const URL = process.env.SMOKE_URL || 'http://127.0.0.1:8099/';
const OUT = process.env.SMOKE_REPORT || path.join(process.env.GITHUB_WORKSPACE || '.', 'runtime-smoke.md');

const fsExists = (p) => {
  try { fs.statSync(p); return true; } catch { return false; }
};

const chromeCandidates = [
  '/usr/bin/google-chrome',
  '/usr/bin/google-chrome-stable',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
];

// GitHub runners preinstall Playwright Chromium under ~/.cache/ms-playwright or /ms-playwright.
function findPlaywrightChrome() {
  const roots = [
    path.join(os.homedir(), '.cache/ms-playwright'),
    '/ms-playwright',
  ];
  for (const root of roots) {
    if (!fsExists(root)) continue;
    let entries = [];
    try { entries = fs.readdirSync(root); } catch { continue; }
    for (const e of entries) {
      if (!/^chromium/.test(e)) continue;
      const exe = path.join(root, e, 'chrome-linux', 'chrome');
      if (fsExists(exe)) return exe;
    }
  }
  return undefined;
}

const executablePath = chromeCandidates.find(fsExists) || findPlaywrightChrome();

function section(title, lines) {
  return `## ${title}\n\n${lines.length ? lines.map((l) => `- ${l}`).join('\n') : '_(none)_'}\n`;
}

let report = `# Runtime smoke report\n\n- url: ${URL}\n- time: ${new Date().toISOString()}\n\n`;

if (!executablePath) {
  report += section('browser', ['no Chromium binary found on runner; skipped runtime smoke']);
  fs.writeFileSync(OUT, report);
  console.log(report);
  process.exit(0);
}

let puppeteer;
try {
  puppeteer = (await import('puppeteer-core')).default;
} catch (e) {
  report += section('browser', [`puppeteer-core unavailable: ${e.message}`]);
  fs.writeFileSync(OUT, report);
  console.log(report);
  process.exit(0);
}

const errors = [];
const warnings = [];
const failedRequests = [];
let browser;

try {
  browser = await puppeteer.launch({
    executablePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu'],
  });
  const page = await browser.newPage();
  page.on('console', async (msg) => {
    const loc = msg.location();
    const where = loc && loc.url ? ` @ ${loc.url}:${loc.lineNumber || ''}` : '';
    let extra = '';
    try {
      const args = await Promise.all(
        msg.args().map((a) =>
          a.evaluate((v) => {
            if (v instanceof Error) return `[Error] ${v.message}\n${v.stack || ''}`;
            if (v && typeof v === 'object') {
              try { return JSON.stringify(v).slice(0, 400); } catch { return String(v); }
            }
            return v == null ? String(v) : String(v);
          }),
        ),
      );
      extra = args.filter(Boolean).join(' | ');
    } catch {
      /* arg inspection is best-effort */
    }
    const text = `${msg.text()}${where}${extra ? ` || ${extra}` : ''}`.slice(0, 1200);
    if (msg.type() === 'error') errors.push(text);
    else if (msg.type() === 'warning') warnings.push(text);
  });
  page.on('pageerror', (err) => {
    const stack = err && err.stack ? String(err.stack) : String(err);
    errors.push(`PAGEERROR: ${stack.slice(0, 2400)}`);
  });
  page.on('requestfailed', (req) => {
    const f = req.failure();
    failedRequests.push(`${req.method()} ${req.url()} ${f ? f.errorText : 'unknown'}`);
  });
  page.on('workercreated', (worker) => {
    worker.on('error', (err) => errors.push(`WORKER ERROR: ${String(err).slice(0, 600)}`));
    worker.on('pageerror', (err) =>
      errors.push(`WORKER PAGEERROR: ${String((err && err.stack) || err).slice(0, 600)}`),
    );
  });

  await page.goto(URL, { waitUntil: 'networkidle0', timeout: 30000 }).catch((e) => {
    errors.push(`NAV: ${String(e.message).slice(0, 300)}`);
  });
  // Give the client router + bootstrap gate time to mount.
  await new Promise((r) => setTimeout(r, 6000));

  const stats = await page.evaluate(() => {
    const root = document.getElementById('root');
    return {
      title: document.title,
      rootChildren: root ? root.childElementCount : -1,
      bodyText: (document.body.innerText || '').trim().slice(0, 400),
      htmlLength: document.documentElement.outerHTML.length,
      rootHtml: root ? root.outerHTML.slice(0, 300) : '(no #root)',
      crossOriginIsolated: typeof crossOriginIsolated !== 'undefined' ? crossOriginIsolated : 'n/a',
      hasSharedArrayBuffer: typeof SharedArrayBuffer !== 'undefined',
      hasWorker: typeof Worker !== 'undefined',
      hasWebAssembly: typeof WebAssembly !== 'undefined',
      hardwareConcurrency: navigator.hardwareConcurrency,
    };
  });

  report += section('page', [
    `title: ${stats.title}`,
    `#root children: ${stats.rootChildren}`,
    `html length: ${stats.htmlLength}`,
    `crossOriginIsolated: ${stats.crossOriginIsolated}`,
    `SharedArrayBuffer: ${stats.hasSharedArrayBuffer}`,
    `Worker: ${stats.hasWorker}`,
    `WebAssembly: ${stats.hasWebAssembly}`,
    `hardwareConcurrency: ${stats.hardwareConcurrency}`,
  ]);
  report += `\n## body excerpt\n\n\`\`\`\n${stats.bodyText || '(empty)'}\n\`\`\`\n\n`;
  report += `\n## root excerpt\n\n\`\`\`\n${stats.rootHtml}\n\`\`\`\n\n`;
  report += section('console errors', errors.slice(0, 25));
  report += section('console warnings', warnings.slice(0, 15));
  report += section('failed requests', failedRequests.slice(0, 25));

  // Inspect any web workers Metro emitted (expo-sqlite wa-sqlite worker). Record
  // the worker URL, bundle size, key symbols present, and a head snippet so we
  // can tell whether the worker chunk actually contains the SQLite bootstrap.
  const workerInfo = [];
  try {
    const workers = await page.workers();
    for (const w of workers) {
      const url = w.url();
      let txt = '';
      try {
        txt = await page.evaluate(async (u) => (await fetch(u)).text(), url);
      } catch (e) {
        workerInfo.push({ url, fetchError: String(e && e.message || e) });
        continue;
      }
      const symbols = ['onmessage', 'postMessage', 'wa-sqlite', 'SharedArrayBuffer', 'importScripts', 'Atomics', 'wa-sqlite.wasm'].filter((s) => txt.includes(s));
      workerInfo.push({ url, bytes: txt.length, symbols, head: txt.slice(0, 300) });
    }
  } catch (e) {
    workerInfo.push({ error: String(e && e.message || e) });
  }
  if (workerInfo.length) {
    report += `\n## web workers\n\n${workerInfo.map((w) => {
      if (w.fetchError) return `- ${w.url}: fetch failed: ${w.fetchError}`;
      if (w.error) return `- error: ${w.error}`;
      return `- ${w.url}\n  - bytes: ${w.bytes}\n  - symbols: ${(w.symbols || []).join(', ') || '(none)'}\n  - head:\n\`\`\`\n${w.head}\n\`\`\``;
    }).join('\n\n')}\n`;
  } else {
    report += section('web workers', ['no worker created on page']);
  }

  // Resolve any Metro "unknown module <id>" against the actual bundle: parse
  // every __d(id, [deps], "sourcePath") header, map the missing id to its own
  // source path (if registered) and to the parent modules that require it, so
  // the originating package is named directly in the report.
  try {
    const missingIds = new Set();
    for (const e of errors) {
      const m = /unknown module "(\d+)"/.exec(e);
      if (m) missingIds.add(m[1]);
    }
    if (missingIds.size) {
      const scripts = await page.evaluate(() =>
        Array.from(document.scripts).map((s) => s.src).filter(Boolean),
      );
      for (const w of workerInfo) {
        if (w.url && !scripts.includes(w.url)) scripts.push(w.url);
      }
      const idToPath = new Map();
      const depUsers = new Map();
      for (const u of scripts) {
        const txt = await page.evaluate(async (x) => (await fetch(x)).text(), u);
        const hdr = /\},\s*(\d+)\s*,\s*\[([^\]]*)\]\s*,\s*"([^"]*)"/g;
        let h;
        while ((h = hdr.exec(txt))) {
          const [, id, deps, p] = h;
          idToPath.set(id, p);
          for (const d of deps.match(/\d+/g) || []) {
            if (!depUsers.has(d)) depUsers.set(d, new Set());
            depUsers.get(d).add(p);
          }
        }
      }
      const lines = [];
      for (const id of missingIds) {
        lines.push(`module ${id}: ${idToPath.get(id) || 'NOT registered'}`);
        const parents = [...(depUsers.get(id) || [])];
        if (parents.length) lines.push(`required by: ${parents.slice(0, 5).join('; ')}`);
      }
      report += section('unknown-module analysis', lines.slice(0, 20));
    }
  } catch (e) {
    report += section('unknown-module analysis', [`failed: ${e.message}`]);
  }

  // Pull a source snippet around every in-bundle stack frame so the failing
  // require/import is readable even without loading source maps in the browser.
  const snippets = [];
  const seenFrames = new Set();
  for (const err of errors) {
    const re = /(https?:\/\/\S+?):(\d+):(\d+)/g;
    let m;
    while ((m = re.exec(err))) {
      const [, url, lineStr, colStr] = m;
      const line = Number(lineStr);
      const key = `${url}:${line}:${colStr}`;
      if (seenFrames.has(key)) continue;
      seenFrames.add(key);
      try {
        const txt = await page.evaluate(async (u) => (await fetch(u)).text(), url);
        const lines = txt.split('\n');
        const i = Math.max(0, line - 1);
        const win = [];
        for (let k = i - 2; k <= i + 2; k++) {
          if (lines[k]) win.push(`${k + 1}: ${lines[k].slice(0, 320)}`);
        }
        snippets.push(`- ${key}\n\`\`\`\n${win.join('\n')}\`\`\``);
      } catch (e) {
        snippets.push(`- ${key} (fetch failed: ${e.message})`);
      }
    }
  }
  if (snippets.length) report += `\n## source snippets\n\n${snippets.join('\n\n')}\n`;
} catch (e) {
  report += section('fatal', [String(e && e.message || e).slice(0, 600)]);
} finally {
  if (browser) await browser.close().catch(() => {});
}

fs.writeFileSync(OUT, report);
console.log(report);
process.exit(0);
