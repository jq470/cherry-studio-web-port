/**
 * Web shim for the RN internal module
 * `react-native/Libraries/promiseRejectionTrackingOptions`.
 *
 * On web that internal file transitively pulls in the native RN core
 * (ExceptionsManager -> UIManager/NativeUIManager), which throws the
 * `__fbBatchedBridgeConfig` error because the web build resolves react-native
 * to react-native-web. The tracking callbacks are Hermes-only and never run on
 * web, so this stub just exposes the same two no-op handlers the caller reads
 * off `.default`.
 */
export default {
  onUnhandled() {},
  onHandled() {},
};
