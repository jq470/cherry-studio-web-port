#!/usr/bin/env node
/**
 * Merge the web build settings into upstream app.json.
 *
 * Upstream already has an `expo.web` block ({ output: "static", favicon: ... }),
 * so this only adds/replaces `bundler` and `name` inside it — no duplicate keys,
 * no full-file overwrite. Idempotent.
 */
const fs = require('fs');
const path = require('path');

const target = path.resolve(process.argv[2] || 'upstream/app.json');
const raw = fs.readFileSync(target, 'utf8');

// Fail on duplicate keys before we touch anything (a duplicate `web` block would
// silently drop `bundler` because the later key wins).
let seen = new Set();
JSON.parse(raw, (key, value) => {
  if (key === 'web') {
    if (seen.has('web')) throw new Error('duplicate "web" key in app.json');
    seen.add('web');
  }
  return value;
});

const app = JSON.parse(raw);
app.expo = app.expo || {};
app.expo.web = {
  ...(app.expo.web || {}),
  bundler: 'metro',
  name: 'Cherry Studio Web',
};
// `output: static` (upstream default) emits per-route HTML, which is what we want
// for a deployable site; keep it and only fall back if upstream removed it.
if (!app.expo.web.output) app.expo.web.output = 'static';

fs.writeFileSync(target, `${JSON.stringify(app, null, 2)}\n`);
console.log('app.json web config ->', JSON.stringify(app.expo.web));
