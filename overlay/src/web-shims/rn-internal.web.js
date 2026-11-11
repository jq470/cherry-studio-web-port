/**
 * Generic web shim for react-native internal subpaths
 * (`react-native/Libraries/...`, `react-native/src/...`).
 *
 * On web the react-native bare specifier resolves to react-native-web; those RN
 * internal files do not exist there. They only leak in when a native dependency
 * or a polyfill reaches for an RN-internal path, and transitively pull the native
 * RN core (TurboModuleRegistry / UIManager / BatchedBridge) into the web bundle,
 * which throws the `__fbBatchedBridgeConfig` error.
 *
 * The value is a callable Proxy: any property read resolves back to the same
 * no-op proxy, calls constructors return the proxy, so both `.default` and
 * named/constructor usages degrade to a silent no-op instead of throwing.
 */
const noop = function () {};

const proxy = new Proxy(noop, {
  get: (target, prop) => (prop === '__esModule' ? true : proxy),
  apply: () => undefined,
  construct: () => proxy,
});

export default proxy;
