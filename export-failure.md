run: 43036952732
commit: f46120c2f65bb95d2654a9014b05f9af9fecbf13

```
Using src/app as the root directory for Expo Router.
React Compiler enabled
Experimental react-native-worklets Bundle Mode is enabled.
Bundle mode is currently unstable, not recommended for production use, and may cause unexpected behavior.
Starting Metro Bundler

Web Bundling failed 127384ms index.ts (9197 modules)
Unable to resolve "./wa-sqlite/wa-sqlite.wasm" from "node_modules/.pnpm/expo-sqlite@58.0.15_expo@58.0.22_react-native@0.88.1_patch_hash=d90df58511c01aab1e2ce4f_f438f2f561bf606926c7d7903e38ac03/node_modules/expo-sqlite/web/worker.ts"
[0m [90m 21 |[39m [36mimport[39m [33mWaSQLiteFactory[39m [36mfrom[39m [32m'./wa-sqlite/wa-sqlite'[39m[33m;[39m
 [90m 22 |[39m [90m// @ts-expect-error wasm module is not typed[39m
[31m[1m>[22m[39m[90m 23 |[39m [36mimport[39m wasmModule [36mfrom[39m [32m'./wa-sqlite/wa-sqlite.wasm'[39m[33m;[39m
 [90m    |[39m                         [31m[1m^[22m[39m
 [90m 24 |[39m [36mimport[39m {
 [90m 25 |[39m   type [33mConfigureWorkerMessage[39m[33m,[39m
 [90m 26 |[39m   type [33mSQLiteWorkerMessage[39m[33m,[39m[0m

Import stack:

 node_modules/.pnpm/expo-sqlite@58.0.15_expo@58.0.22_react-native@0.88.1_patch_hash=d90df58511c01aab1e2ce4f_f438f2f561bf606926c7d7903e38ac03/node_modules/expo-sqlite/web/worker.ts
 | import "./wa-sqlite/wa-sqlite.wasm"

 node_modules/.pnpm/expo-sqlite@58.0.15_expo@58.0.22_react-native@0.88.1_patch_hash=d90df58511c01aab1e2ce4f_f438f2f561bf606926c7d7903e38ac03/node_modules/expo-sqlite/web/SQLiteModule.ts
 | import "./worker"

 node_modules/.pnpm/expo-sqlite@58.0.15_expo@58.0.22_react-native@0.88.1_patch_hash=d90df58511c01aab1e2ce4f_f438f2f561bf606926c7d7903e38ac03/node_modules/expo-sqlite/build/ExpoSQLite.web.js
 | import "../web/SQLiteModule"

 node_modules/.pnpm/expo-sqlite@58.0.15_expo@58.0.22_react-native@0.88.1_patch_hash=d90df58511c01aab1e2ce4f_f438f2f561bf606926c7d7903e38ac03/node_modules/expo-sqlite/build/WebConfiguration.js
 | import "./ExpoSQLite"

 node_modules/.pnpm/expo-sqlite@58.0.15_expo@58.0.22_react-native@0.88.1_patch_hash=d90df58511c01aab1e2ce4f_f438f2f561bf606926c7d7903e38ac03/node_modules/expo-sqlite/build/index.js
 | import "./WebConfiguration"

 src/backend/data/db/DbService.ts
 | import "expo-sqlite"

 src/backend/core/application/serviceRegistry.ts
 | import "@/backend/data/db/DbService"

 src/bootstrap/runtime/createAppBootstrapRuntime.ts
 | import "@/backend/core/application/serviceRegistry"

 src/bootstrap/runtime/AppBootstrapProvider.tsx
 | import "@/bootstrap/runtime/createAppBootstrapRuntime"

 src/bootstrap/runtime/AppBootstrapGate.tsx
 | import "./AppBootstrapProvider"

 src/bootstrap/index.ts
 | import "./runtime/AppBootstrapGate"

 src/app/_layout.tsx
 | import "@/bootstrap"

 src/app (require.context)


Error: Unable to resolve module ./wa-sqlite/wa-sqlite.wasm from /home/runner/work/cherry-studio-web-port/cherry-studio-web-port/upstream/node_modules/.pnpm/expo-sqlite@58.0.15_expo@58.0.22_react-native@0.88.1_patch_hash=d90df58511c01aab1e2ce4f_f438f2f561bf606926c7d7903e38ac03/node_modules/expo-sqlite/web/worker.ts: 

None of these files exist:
  * node_modules/.pnpm/expo-sqlite@58.0.15_expo@58.0.22_react-native@0.88.1_patch_hash=d90df58511c01aab1e2ce4f_f438f2f561bf606926c7d7903e38ac03/node_modules/expo-sqlite/web/wa-sqlite/wa-sqlite.wasm(.web.ts|.ts|.web.tsx|.tsx|.web.mjs|.mjs|.web.js|.js|.web.jsx|.jsx|.web.json|.json|.web.cjs|.cjs|.web.scss|.scss|.web.sass|.sass|.web.css|.css|.web.sql|.sql|.web.css|.css)
  * node_modules/.pnpm/expo-sqlite@58.0.15_expo@58.0.22_react-native@0.88.1_patch_hash=d90df58511c01aab1e2ce4f_f438f2f561bf606926c7d7903e38ac03/node_modules/expo-sqlite/web/wa-sqlite/wa-sqlite.wasm
[0m [90m 21 |[39m [36mimport[39m [33mWaSQLiteFactory[39m [36mfrom[39m [32m'./wa-sqlite/wa-sqlite'[39m[33m;[39m
 [90m 22 |[39m [90m// @ts-expect-error wasm module is not typed[39m
[31m[1m>[22m[39m[90m 23 |[39m [36mimport[39m wasmModule [36mfrom[39m [32m'./wa-sqlite/wa-sqlite.wasm'[39m[33m;[39m
 [90m    |[39m                         [31m[1m^[22m[39m
 [90m 24 |[39m [36mimport[39m {
 [90m 25 |[39m   type [33mConfigureWorkerMessage[39m[33m,[39m
 [90m 26 |[39m   type [33mSQLiteWorkerMessage[39m[33m,[39m[0m

Import stack:

 node_modules/.pnpm/expo-sqlite@58.0.15_expo@58.0.22_react-native@0.88.1_patch_hash=d90df58511c01aab1e2ce4f_f438f2f561bf606926c7d7903e38ac03/node_modules/expo-sqlite/web/worker.ts
 | import "./wa-sqlite/wa-sqlite.wasm"

 node_modules/.pnpm/expo-sqlite@58.0.15_expo@58.0.22_react-native@0.88.1_patch_hash=d90df58511c01aab1e2ce4f_f438f2f561bf606926c7d7903e38ac03/node_modules/expo-sqlite/web/SQLiteModule.ts
 | import "./worker"

 node_modules/.pnpm/expo-sqlite@58.0.15_expo@58.0.22_react-native@0.88.1_patch_hash=d90df58511c01aab1e2ce4f_f438f2f561bf606926c7d7903e38ac03/node_modules/expo-sqlite/build/ExpoSQLite.web.js
 | import "../web/SQLiteModule"

 node_modules/.pnpm/expo-sqlite@58.0.15_expo@58.0.22_react-native@0.88.1_patch_hash=d90df58511c01aab1e2ce4f_f438f2f561bf606926c7d7903e38ac03/node_modules/expo-sqlite/build/WebConfiguration.js
 | import "./ExpoSQLite"

 node_modules/.pnpm/expo-sqlite@58.0.15_expo@58.0.22_react-native@0.88.1_patch_hash=d90df58511c01aab1e2ce4f_f438f2f561bf606926c7d7903e38ac03/node_modules/expo-sqlite/build/index.js
 | import "./WebConfiguration"

 src/backend/data/db/DbService.ts
 | import "expo-sqlite"

 src/backend/core/application/serviceRegistry.ts
 | import "@/backend/data/db/DbService"

 src/bootstrap/runtime/createAppBootstrapRuntime.ts
 | import "@/backend/core/application/serviceRegistry"

 src/bootstrap/runtime/AppBootstrapProvider.tsx
 | import "@/bootstrap/runtime/createAppBootstrapRuntime"

 src/bootstrap/runtime/AppBootstrapGate.tsx
 | import "./AppBootstrapProvider"

 src/bootstrap/index.ts
 | import "./runtime/AppBootstrapGate"

 src/app/_layout.tsx
 | import "@/bootstrap"

 src/app (require.context)

```
