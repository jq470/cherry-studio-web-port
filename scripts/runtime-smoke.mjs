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
  page.on('console', (msg) => {
    const loc = msg.location();
    const where = loc && loc.url ? ` @ ${loc.url}:${loc.lineNumber || ''}` : '';
    const text = `${msg.text()}${where}`.slice(0, 800);
    if (msg.type() === 'error') errors.push(text);
    else if (msg.type() === 'warning') warnings.push(text);
  });
  page.on('pageerror', (err) => {
    const stack = err && err.stack ? String(err.stack) : String(err);
    errors.push(`PAGEERROR: ${stack.slice(0, 1200)}`);
  });
  page.on('requestfailed', (req) => {
    const f = req.failure();
    failedRequests.push(`${req.method()} ${req.url()} ${f ? f.errorText : 'unknown'}`);
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
    };
  });

  report += section('page', [
    `title: ${stats.title}`,
    `#root children: ${stats.rootChildren}`,
    `html length: ${stats.htmlLength}`,
  ]);
  report += `\n## body excerpt\n\n\`\`\`\n${stats.bodyText || '(empty)'}\n\`\`\`\n\n`;
  report += `\n## root excerpt\n\n\`\`\`\n${stats.rootHtml}\n\`\`\`\n\n`;
  report += section('console errors', errors.slice(0, 25));
  report += section('console warnings', warnings.slice(0, 15));
  report += section('failed requests', failedRequests.slice(0, 25));
} catch (e) {
  report += section('fatal', [String(e && e.message || e).slice(0, 600)]);
} finally {
  if (browser) await browser.close().catch(() => {});
}

fs.writeFileSync(OUT, report);
console.log(report);
process.exit(0);
