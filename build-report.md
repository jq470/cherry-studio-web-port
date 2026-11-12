# Web build report

- run: 43204442214
- commit: 2b8f22815e8728044cd8c6178099ef2ae2c21708
- upstream: CherryHQ/cherry-studio-app@a0cddfa + this overlay

## dist-web top level
```
total 40
drwxr-xr-x  4 runner runner  4096 Nov 12 10:57 .
drwxr-xr-x 23 runner runner  4096 Nov 12 10:57 ..
drwxr-xr-x  3 runner runner  4096 Nov 12 10:57 _expo
drwxr-xr-x  5 runner runner  4096 Nov 12 10:57 assets
-rw-r--r--  1 runner runner 14510 Nov 12 10:57 favicon.ico
-rw-r--r--  1 runner runner  3150 Nov 12 10:57 index.html
-rw-r--r--  1 runner runner    49 Nov 12 10:57 metadata.json
```

## sizes
```
163M	upstream/dist-web
142M	upstream/dist-web/_expo
files: 684
```

## asset count by extension
```
    473 webp
     67 png
     64 map
     64 js
      8 css
      3 html
      1 wasm
      1 svg
      1 json
      1 ico
      1 bin
```

## web worker / wasm inventory
```
--- wasm/bin assets ---
upstream/dist-web/assets/node_modules/.pnpm/expo-sqlite@58.0.15_expo@58.0.22_react-native@0.88.1_patch_hash=d90df58511c01aab1e2ce4f_f438f2f561bf606926c7d7903e38ac03/node_modules/expo-sqlite/web/wa-sqlite/wa-sqlite.5e61fe84c4a4f49e0b1a33661b45c791.wasm
upstream/dist-web/assets/packages/file-preview-webview/dist/pdf-resources.afb472a82cd0fee9edf5fa4bead075a7.bin
--- js chunks ---
upstream/dist-web/_expo/static/js/web/[connectionId]-d41d8cd98f00b204e9800998ecf8427e.js
upstream/dist-web/_expo/static/js/web/[fileEntryId]-d41d8cd98f00b204e9800998ecf8427e.js
upstream/dist-web/_expo/static/js/web/[marketplaceId]-d41d8cd98f00b204e9800998ecf8427e.js
upstream/dist-web/_expo/static/js/web/[paintingId]-d41d8cd98f00b204e9800998ecf8427e.js
upstream/dist-web/_expo/static/js/web/[permission]-d41d8cd98f00b204e9800998ecf8427e.js
upstream/dist-web/_expo/static/js/web/[reportId]-d41d8cd98f00b204e9800998ecf8427e.js
upstream/dist-web/_expo/static/js/web/[serverId]-d41d8cd98f00b204e9800998ecf8427e.js
upstream/dist-web/_expo/static/js/web/[skillId]-d41d8cd98f00b204e9800998ecf8427e.js
upstream/dist-web/_expo/static/js/web/__common-ce997bdf21cab8cc2270f8c79748fa1c.js
upstream/dist-web/_expo/static/js/web/__expo-metro-runtime-d41d8cd98f00b204e9800998ecf8427e.js
upstream/dist-web/_expo/static/js/web/_layout-5fd9111319b28ea5cb8a3a5ca47b67ef.js
upstream/dist-web/_expo/static/js/web/_layout-d41d8cd98f00b204e9800998ecf8427e.js
upstream/dist-web/_expo/static/js/web/about-d41d8cd98f00b204e9800998ecf8427e.js
upstream/dist-web/_expo/static/js/web/ai-usage-d41d8cd98f00b204e9800998ecf8427e.js
upstream/dist-web/_expo/static/js/web/appearance-d41d8cd98f00b204e9800998ecf8427e.js
upstream/dist-web/_expo/static/js/web/azure-openai-responses-d41d8cd98f00b204e9800998ecf8427e.js
upstream/dist-web/_expo/static/js/web/callback-d41d8cd98f00b204e9800998ecf8427e.js
upstream/dist-web/_expo/static/js/web/candidate-d41d8cd98f00b204e9800998ecf8427e.js
upstream/dist-web/_expo/static/js/web/catalog-d41d8cd98f00b204e9800998ecf8427e.js
upstream/dist-web/_expo/static/js/web/connect-d41d8cd98f00b204e9800998ecf8427e.js
upstream/dist-web/_expo/static/js/web/connection-d41d8cd98f00b204e9800998ecf8427e.js
upstream/dist-web/_expo/static/js/web/conversation-d41d8cd98f00b204e9800998ecf8427e.js
upstream/dist-web/_expo/static/js/web/data-d41d8cd98f00b204e9800998ecf8427e.js
upstream/dist-web/_expo/static/js/web/desktop-sync-d41d8cd98f00b204e9800998ecf8427e.js
upstream/dist-web/_expo/static/js/web/edit-d41d8cd98f00b204e9800998ecf8427e.js
upstream/dist-web/_expo/static/js/web/edit-reply-d41d8cd98f00b204e9800998ecf8427e.js
upstream/dist-web/_expo/static/js/web/fetch-urls-d41d8cd98f00b204e9800998ecf8427e.js
upstream/dist-web/_expo/static/js/web/font-size-d41d8cd98f00b204e9800998ecf8427e.js
upstream/dist-web/_expo/static/js/web/google-generative-ai-d41d8cd98f00b204e9800998ecf8427e.js
upstream/dist-web/_expo/static/js/web/google-vertex-d41d8cd98f00b204e9800998ecf8427e.js
upstream/dist-web/_expo/static/js/web/index-8be6aaf3afaf928efd06b2317a59f07f.js
upstream/dist-web/_expo/static/js/web/index-d41d8cd98f00b204e9800998ecf8427e.js
upstream/dist-web/_expo/static/js/web/kimi-coding-d41d8cd98f00b204e9800998ecf8427e.js
upstream/dist-web/_expo/static/js/web/md4c-d41d8cd98f00b204e9800998ecf8427e.js
upstream/dist-web/_expo/static/js/web/mermaid-diagram-d41d8cd98f00b204e9800998ecf8427e.js
upstream/dist-web/_expo/static/js/web/model-add-d41d8cd98f00b204e9800998ecf8427e.js
upstream/dist-web/_expo/static/js/web/model-d41d8cd98f00b204e9800998ecf8427e.js
upstream/dist-web/_expo/static/js/web/new-d41d8cd98f00b204e9800998ecf8427e.js
upstream/dist-web/_expo/static/js/web/node-d41d8cd98f00b204e9800998ecf8427e.js
upstream/dist-web/_expo/static/js/web/notifications-d41d8cd98f00b204e9800998ecf8427e.js
upstream/dist-web/_expo/static/js/web/oauth-callback-d41d8cd98f00b204e9800998ecf8427e.js
upstream/dist-web/_expo/static/js/web/officeText-d41d8cd98f00b204e9800998ecf8427e.js
upstream/dist-web/_expo/static/js/web/openai-codex-d41d8cd98f00b204e9800998ecf8427e.js
upstream/dist-web/_expo/static/js/web/openai-codex-responses-d41d8cd98f00b204e9800998ecf8427e.js
upstream/dist-web/_expo/static/js/web/openai-completions-d41d8cd98f00b204e9800998ecf8427e.js
upstream/dist-web/_expo/static/js/web/openai-responses-d41d8cd98f00b204e9800998ecf8427e.js
upstream/dist-web/_expo/static/js/web/pair-d41d8cd98f00b204e9800998ecf8427e.js
upstream/dist-web/_expo/static/js/web/piVertexAnthropic-d41d8cd98f00b204e9800998ecf8427e.js
upstream/dist-web/_expo/static/js/web/privacy-d41d8cd98f00b204e9800998ecf8427e.js
upstream/dist-web/_expo/static/js/web/profile-d41d8cd98f00b204e9800998ecf8427e.js
upstream/dist-web/_expo/static/js/web/provider-d41d8cd98f00b204e9800998ecf8427e.js
upstream/dist-web/_expo/static/js/web/provider-sync-d41d8cd98f00b204e9800998ecf8427e.js
upstream/dist-web/_expo/static/js/web/remote-d41d8cd98f00b204e9800998ecf8427e.js
upstream/dist-web/_expo/static/js/web/remoteCrypto-d41d8cd98f00b204e9800998ecf8427e.js
upstream/dist-web/_expo/static/js/web/scan-d41d8cd98f00b204e9800998ecf8427e.js
upstream/dist-web/_expo/static/js/web/search-d41d8cd98f00b204e9800998ecf8427e.js
upstream/dist-web/_expo/static/js/web/share-d41d8cd98f00b204e9800998ecf8427e.js
upstream/dist-web/_expo/static/js/web/share-destination-d41d8cd98f00b204e9800998ecf8427e.js
upstream/dist-web/_expo/static/js/web/templates-d41d8cd98f00b204e9800998ecf8427e.js
upstream/dist-web/_expo/static/js/web/trash-d41d8cd98f00b204e9800998ecf8427e.js
upstream/dist-web/_expo/static/js/web/voice-d41d8cd98f00b204e9800998ecf8427e.js
upstream/dist-web/_expo/static/js/web/web-search-d41d8cd98f00b204e9800998ecf8427e.js
upstream/dist-web/_expo/static/js/web/worker-d41d8cd98f00b204e9800998ecf8427e.js
upstream/dist-web/_expo/static/js/web/xai-d41d8cd98f00b204e9800998ecf8427e.js
--- main bundle: upstream/dist-web/_expo/static/js/web/index-8be6aaf3afaf928efd06b2317a59f07f.js ---
new Worker refs:
new Worker(workerUrl, workerOpts
new Worker(workerUrl, workerOpts
wa-sqlite refs:
worker chunk names referenced:
```
