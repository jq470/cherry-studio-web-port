#!/usr/bin/env node
/**
 * Merge the web build settings into upstream app.json.
 *
 * Upstream already has an `expo.web` block ({ output: "static", favicon: ... }),
 * so this only adds/replaces keys inside it — no duplicate keys, no full-file
 * overwrite. Idempotent.
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
  // Upstream defaults to `static`, which prerenders every route in Node during
  // export. This codebase is written for native (window/document/localStorage at
  // module scope), so prerendering is where it breaks. `single` emits one
  // client-rendered index.html and routes on the client instead.
  output: 'single',
  name: 'Cherry Studio Web',
};

fs.writeFileSync(target, `${JSON.stringify(app, null, 2)}\n`);
console.log('app.json web config ->', JSON.stringify(app.expo.web));
