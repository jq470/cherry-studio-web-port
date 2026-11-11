#!/usr/bin/env node
/**
 * Insert the web-shim resolver into upstream metro.config.js.
 *
 * Anchored on the existing `config.resolver.resolveRequest = (...) => {` line so
 * the rest of upstream's resolver logic (libp2p browser maps, MCP shims, Expo
 * runtime pinning) stays untouched. Idempotent.
 */
const fs = require('fs');
const path = require('path');

const target = path.resolve(process.argv[2] || 'upstream/metro.config.js');
const MARKER = 'src/web-shims';
let src = fs.readFileSync(target, 'utf8');

if (src.includes(MARKER)) {
  console.log('metro.config.js already patched, skipping');
  process.exit(0);
}

const ANCHOR = 'config.resolver.resolveRequest = (context, moduleName, platform) => {';
if (!src.includes(ANCHOR)) {
  console.error(`::error::anchor not found in ${target}; upstream metro.config.js changed`);
  process.exit(1);
}

const SHIMS = {
  'react-native-mmkv': 'react-native-mmkv.web.js',
  'react-native-quick-crypto': 'react-native-quick-crypto.web.js',
  'expo-glass-effect': 'expo-glass-effect.web.js',
  'react-native-nitro-theme-transition': 'react-native-nitro-theme-transition.web.js',
  'react-native-keyboard-controller': 'react-native-keyboard-controller.web.js',
  'expo-camera': 'expo-camera.web.js',
  'expo-media-library': 'expo-media-library.web.js',
  'react-native-view-shot': 'react-native-view-shot.web.js',
  'expo-audio': 'expo-audio.web.js',
  'expo-speech': 'expo-speech.web.js',
  'expo-speech-recognition': 'expo-speech-recognition.web.js',
  'expo-image-picker': 'expo-image-picker.web.js',
  'react-native-reserved-regions': 'react-native-reserved-regions.web.js',
  'expo-intent-launcher': 'expo-intent-launcher.web.js',
  'react-native-share': 'react-native-share.web.js',
  'react-native-webview': 'react-native-webview.web.js',
};

const mapLiteral = Object.entries(SHIMS)
  .map(([mod, file]) => `      '${mod}': '${file}',`)
  .join('\n');

const injection = `// Native-only modules have a browser implementation under src/web-shims.
const webShimMap = {
${mapLiteral}
};
${ANCHOR}
  if (platform === 'web') {
    const shimFile = webShimMap[moduleName];
    if (shimFile) {
      return {
        type: 'sourceFile',
        filePath: path.join(__dirname, 'src/web-shims', shimFile),
      };
    }
  }
`;

src = src.replace(ANCHOR, injection);
fs.writeFileSync(target, src);
console.log(`patched ${target} with ${Object.keys(SHIMS).length} web shims`);
