run: 43035542486
commit: ddedefa2a6ffa196ddc71aeee10111c334639346

```
Using src/app as the root directory for Expo Router.
React Compiler enabled
Experimental react-native-worklets Bundle Mode is enabled.
Bundle mode is currently unstable, not recommended for production use, and may cause unexpected behavior.
Starting Metro Bundler

 WARN  The package /home/runner/work/cherry-studio-web-port/cherry-studio-web-port/upstream/node_modules/.pnpm/uniwind@1.6.5_patch_hash=213f8447857f3cff31d055e780bf91ad29321417598c5170ea882503b728f9_87352c40e8e457b47b4bde1fbd977885/node_modules/uniwind contains an invalid package.json configuration. Consider raising this issue with the package maintainer(s).
Reason: The resolution for "/home/runner/work/cherry-studio-web-port/cherry-studio-web-port/upstream/node_modules/uniwind/components/InputAccessoryView" defined in "exports" is /home/runner/work/cherry-studio-web-port/cherry-studio-web-port/upstream/node_modules/.pnpm/uniwind@1.6.5_patch_hash=213f8447857f3cff31d055e780bf91ad29321417598c5170ea882503b728f9_87352c40e8e457b47b4bde1fbd977885/node_modules/uniwind/dist/module/components/web/InputAccessoryView.js, however this file does not exist. Falling back to file-based resolution.
 WARN  The package /home/runner/work/cherry-studio-web-port/cherry-studio-web-port/upstream/node_modules/.pnpm/uniwind@1.6.5_patch_hash=213f8447857f3cff31d055e780bf91ad29321417598c5170ea882503b728f9_87352c40e8e457b47b4bde1fbd977885/node_modules/uniwind contains an invalid package.json configuration. Consider raising this issue with the package maintainer(s).
Reason: The resolution for "/home/runner/work/cherry-studio-web-port/cherry-studio-web-port/upstream/node_modules/uniwind/components/InputAccessoryView" defined in "exports" is /home/runner/work/cherry-studio-web-port/cherry-studio-web-port/upstream/node_modules/.pnpm/uniwind@1.6.5_patch_hash=213f8447857f3cff31d055e780bf91ad29321417598c5170ea882503b728f9_87352c40e8e457b47b4bde1fbd977885/node_modules/uniwind/dist/module/components/web/InputAccessoryView.js, however this file does not exist. Falling back to file-based resolution.
 WARN  The package /home/runner/work/cherry-studio-web-port/cherry-studio-web-port/upstream/node_modules/.pnpm/uniwind@1.6.5_patch_hash=213f8447857f3cff31d055e780bf91ad29321417598c5170ea882503b728f9_87352c40e8e457b47b4bde1fbd977885/node_modules/uniwind contains an invalid package.json configuration. Consider raising this issue with the package maintainer(s).
Reason: The resolution for "/home/runner/work/cherry-studio-web-port/cherry-studio-web-port/upstream/node_modules/uniwind/components/InputAccessoryView" defined in "exports" is /home/runner/work/cherry-studio-web-port/cherry-studio-web-port/upstream/node_modules/.pnpm/uniwind@1.6.5_patch_hash=213f8447857f3cff31d055e780bf91ad29321417598c5170ea882503b728f9_87352c40e8e457b47b4bde1fbd977885/node_modules/uniwind/dist/module/components/web/InputAccessoryView.js, however this file does not exist. Falling back to file-based resolution.
Web Bundling failed 144839ms index.ts (9158 modules)
Unable to resolve "./exports/InputAccessoryView" from "node_modules/.pnpm/react-native-web@0.21.4_encoding@0.1.13_react-dom@19.3.0_react@19.3.0__react@19.3.0/node_modules/react-native-web/dist/index.js"
[0m [90m 39 |[39m [36mexport[39m { [36mdefault[39m [36mas[39m [33mImage[39m } [36mfrom[39m [32m'./exports/Image'[39m[33m;[39m
 [90m 40 |[39m [36mexport[39m { [36mdefault[39m [36mas[39m [33mImageBackground[39m } [36mfrom[39m [32m'./exports/ImageBackground'[39m[33m;[39m
[31m[1m>[22m[39m[90m 41 |[39m [36mexport[39m { [36mdefault[39m [36mas[39m [33mInputAccessoryView[39m } [36mfrom[39m [32m'./exports/InputAccessoryView'[39m[33m;[39m
 [90m    |[39m                                                [31m[1m^[22m[39m
 [90m 42 |[39m [36mexport[39m { [36mdefault[39m [36mas[39m [33mKeyboardAvoidingView[39m } [36mfrom[39m [32m'./exports/KeyboardAvoidingView'[39m[33m;[39m
 [90m 43 |[39m [36mexport[39m { [36mdefault[39m [36mas[39m [33mModal[39m } [36mfrom[39m [32m'./exports/Modal'[39m[33m;[39m
 [90m 44 |[39m [36mexport[39m { [36mdefault[39m [36mas[39m [33mPicker[39m } [36mfrom[39m [32m'./exports/Picker'[39m[33m;[39m[0m

Import stack:

 node_modules/.pnpm/react-native-web@0.21.4_encoding@0.1.13_react-dom@19.3.0_react@19.3.0__react@19.3.0/node_modules/react-native-web/dist/index.js
 | import "./exports/InputAccessoryView"

 node_modules/.pnpm/expo-router@58.0.29_patch_hash=231e96fb0587925929e716eb079a37f4cd6f0bc8a9dad0bbb62cfece_ec17e538f314aca3a86b20b563c087eb/node_modules/expo-router/build/renderRootComponent.js
 | import "react-native-web/dist/index"

 node_modules/.pnpm/expo-router@58.0.29_patch_hash=231e96fb0587925929e716eb079a37f4cd6f0bc8a9dad0bbb62cfece_ec17e538f314aca3a86b20b563c087eb/node_modules/expo-router/entry-classic.js
 | import "expo-router/build/renderRootComponent"

 node_modules/.pnpm/expo-router@58.0.29_patch_hash=231e96fb0587925929e716eb079a37f4cd6f0bc8a9dad0bbb62cfece_ec17e538f314aca3a86b20b563c087eb/node_modules/expo-router/entry.js
 | import "expo-router/entry-classic"

 index.ts
 | import "expo-router/entry"

 
 | import "./index.ts"


Error: Unable to resolve module ./exports/InputAccessoryView from /home/runner/work/cherry-studio-web-port/cherry-studio-web-port/upstream/node_modules/.pnpm/react-native-web@0.21.4_encoding@0.1.13_react-dom@19.3.0_react@19.3.0__react@19.3.0/node_modules/react-native-web/dist/index.js: ./exports/InputAccessoryView could not be found within the project or in these directories:
  node_modules/.pnpm/react-native-web@0.21.4_encoding@0.1.13_react-dom@19.3.0_react@19.3.0__react@19.3.0/node_modules
  node_modules/.pnpm/node_modules
  node_modules
[0m [90m 39 |[39m [36mexport[39m { [36mdefault[39m [36mas[39m [33mImage[39m } [36mfrom[39m [32m'./exports/Image'[39m[33m;[39m
 [90m 40 |[39m [36mexport[39m { [36mdefault[39m [36mas[39m [33mImageBackground[39m } [36mfrom[39m [32m'./exports/ImageBackground'[39m[33m;[39m
[31m[1m>[22m[39m[90m 41 |[39m [36mexport[39m { [36mdefault[39m [36mas[39m [33mInputAccessoryView[39m } [36mfrom[39m [32m'./exports/InputAccessoryView'[39m[33m;[39m
 [90m    |[39m                                                [31m[1m^[22m[39m
 [90m 42 |[39m [36mexport[39m { [36mdefault[39m [36mas[39m [33mKeyboardAvoidingView[39m } [36mfrom[39m [32m'./exports/KeyboardAvoidingView'[39m[33m;[39m
 [90m 43 |[39m [36mexport[39m { [36mdefault[39m [36mas[39m [33mModal[39m } [36mfrom[39m [32m'./exports/Modal'[39m[33m;[39m
 [90m 44 |[39m [36mexport[39m { [36mdefault[39m [36mas[39m [33mPicker[39m } [36mfrom[39m [32m'./exports/Picker'[39m[33m;[39m[0m

Import stack:

 node_modules/.pnpm/react-native-web@0.21.4_encoding@0.1.13_react-dom@19.3.0_react@19.3.0__react@19.3.0/node_modules/react-native-web/dist/index.js
 | import "./exports/InputAccessoryView"

 node_modules/.pnpm/expo-router@58.0.29_patch_hash=231e96fb0587925929e716eb079a37f4cd6f0bc8a9dad0bbb62cfece_ec17e538f314aca3a86b20b563c087eb/node_modules/expo-router/build/renderRootComponent.js
 | import "react-native-web/dist/index"

 node_modules/.pnpm/expo-router@58.0.29_patch_hash=231e96fb0587925929e716eb079a37f4cd6f0bc8a9dad0bbb62cfece_ec17e538f314aca3a86b20b563c087eb/node_modules/expo-router/entry-classic.js
 | import "expo-router/build/renderRootComponent"

 node_modules/.pnpm/expo-router@58.0.29_patch_hash=231e96fb0587925929e716eb079a37f4cd6f0bc8a9dad0bbb62cfece_ec17e538f314aca3a86b20b563c087eb/node_modules/expo-router/entry.js
 | import "expo-router/entry-classic"

 index.ts
 | import "expo-router/entry"

 
 | import "./index.ts"

```
