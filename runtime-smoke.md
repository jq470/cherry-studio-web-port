# Runtime smoke report

- url: http://127.0.0.1:8099/
- time: 2026-11-11T16:00:35.626Z

## page

- title: Cherry Studio Web
- #root children: 0
- html length: 1634

## body excerpt

```
(empty)
```


## root excerpt

```
<div id="root"></div>
```

## console errors

- PAGEERROR: TypeError: Cannot read properties of undefined (reading 'default')
    at get (http://127.0.0.1:8099/_expo/static/js/web/index-bc4dcf698cc4de122a6a0ef4d908b0ad.js:153764:28)
    at <anonymous> (http://127.0.0.1:8099/_expo/static/js/web/index-bc4dcf698cc4de122a6a0ef4d908b0ad.js:199127:113)
    at loadModuleImplementation (http://127.0.0.1:8099/_expo/static/js/web/__expo-metro-runtime-dc52cf6a4fbca34d79190e0a1e582980.js:210:16)
    at guardedLoadModule (http://127.0.0.1:8099/_expo/static/js/web/__expo-metro-runtime-dc52cf6a4fbca34d79190e0a1e582980.js:139:14)
    at metroRequire (http://127.0.0.1:8099/_expo/static/js/web/__expo-metro-runtime-dc52cf6a4fbca34d79190e0a1e582980.js:71:75)
    at <anonymous> (http://127.0.0.1:8099/_expo/static/js/web/index-bc4dcf698cc4de122a6a0ef4d908b0ad.js:199096:30)
    at loadModuleImplementation (http://127.0.0.1:8099/_expo/static/js/web/__expo-metro-runtime-dc52cf6a4fbca34d79190e0a1e582980.js:210:16)
    at guardedLoadModule (http://127.0.0.1:8099/_expo/static/js/web/__expo-metro-runtime-dc52cf6a4fbca34d79190e0a1e582980.js:139:14)
    at metroRequire (http://127.0.0.1:8099/_expo/static/js/web/__expo-metro-runtime-dc52cf6a4fbca34d79190e0a1e582980.js:71
## console warnings

_(none)_
## failed requests

_(none)_

## source snippets

- http://127.0.0.1:8099/_expo/static/js/web/index-bc4dcf698cc4de122a6a0ef4d908b0ad.js:153764:28
```
153762:     enumerable: true,
153763:     get: function () {
153764:       return _exportsView2.default;
153765:     }
153766:   });
```

- http://127.0.0.1:8099/_expo/static/js/web/index-bc4dcf698cc4de122a6a0ef4d908b0ad.js:199127:113
```
199125:   module.exports = exports.View = undefined;
199126:   var _jsxRuntime = require(_dependencyMap[0]);
199127:   const View = exports.View = (0, require(_dependencyMap[1]).copyComponentProperties)(require(_dependencyMap[2]).View, props => {
199128:     return /* @__PURE__ */(0, _jsxRuntime.jsx)(require(_dependencyMap[2]).View, {
199129:       ...props,
```

- http://127.0.0.1:8099/_expo/static/js/web/__expo-metro-runtime-dc52cf6a4fbca34d79190e0a1e582980.js:210:16
```
208:       // metro/src/Resolver/index.js
209:       // and metro/src/ModuleGraph/worker.js
210:       factory?.(global, metroRequire, metroImportDefault, metroImportAll, moduleObject, moduleObject.exports, dependencyMap);
211:       // avoid removing factory in DEV mode as it breaks HMR
212:       {
```

- http://127.0.0.1:8099/_expo/static/js/web/__expo-metro-runtime-dc52cf6a4fbca34d79190e0a1e582980.js:139:14
```
137:       return returnValue;
138:     } else {
139:       return loadModuleImplementation(moduleId, module, moduleIdHint);
140:     }
141:   }
```

- http://127.0.0.1:8099/_expo/static/js/web/__expo-metro-runtime-dc52cf6a4fbca34d79190e0a1e582980.js:71:75
```
69:     }
70:     const module = modules.get(moduleId);
71:     return module && module.isInitialized ? module.publicModule.exports : guardedLoadModule(moduleId, module, moduleIdHint);
72:   }
73:   // We print require cycles unless they match a pattern in the
```

- http://127.0.0.1:8099/_expo/static/js/web/index-bc4dcf698cc4de122a6a0ef4d908b0ad.js:199096:30
```
199094:   var _react = require(_dependencyMap[0]);
199095:   var React = _interopDefault(_react);
199096:   var View = _interopDefault(require(_dependencyMap[1]));
199097:   /**
199098:    * Replacement for `react-native-web/dist/exports/InputAccessoryView`.
```
