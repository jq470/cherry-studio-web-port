// Web shim for @sentry/react-native.
//
// The RN Sentry SDK wraps native crash-reporting bindings and has no browser
// entry; importing it on web pulls a native module that Metro does not bundle,
// which surfaces as "Requiring unknown module". On web the native crash-reporting
// bridge returns null, so only the JS scope/client/integration surface is needed
// to keep configureSentry from throwing. Reporting is disabled.

const noop = () => {};

const scope = {
  clearBreadcrumbs: noop,
  addBreadcrumb: noop,
  setTag: noop,
  setTags: noop,
  setUser: noop,
  setExtra: noop,
  clear: noop,
};

const noopIntegration = () => ({ name: 'noop-web', setup: noop });

export function init() {}
export function addBreadcrumb() {}
export function captureException() {}
export function captureMessage() {}
export function captureEvent() {}
// wrapReportingRoot wraps the root component; identity passthrough on web.
export function wrap(component) {
  return component;
}
export function getClient() {
  return null;
}
export function getCurrentScope() {
  return scope;
}
export function getIsolationScope() {
  return scope;
}
export function withScope(cb) {
  return cb && cb(scope);
}
export function reactNativeErrorHandlersIntegration() {
  return noopIntegration();
}
export function nativeLinkedErrorsIntegration() {
  return noopIntegration();
}
export function inboundFiltersIntegration() {
  return noopIntegration();
}
export function functionToStringIntegration() {
  return noopIntegration();
}
export function nativeReleaseIntegration() {
  return noopIntegration();
}
export function deviceContextIntegration() {
  return noopIntegration();
}
export function expoContextIntegration() {
  return noopIntegration();
}
export function sdkInfoIntegration() {
  return noopIntegration();
}
export function createReactNativeRewriteFrames() {
  return noopIntegration();
}

export default {
  init,
  addBreadcrumb,
  captureException,
  captureMessage,
  wrap,
  getClient,
  getCurrentScope,
  getIsolationScope,
  withScope,
  reactNativeErrorHandlersIntegration,
  nativeLinkedErrorsIntegration,
  inboundFiltersIntegration,
  functionToStringIntegration,
  nativeReleaseIntegration,
  deviceContextIntegration,
  expoContextIntegration,
  sdkInfoIntegration,
  createReactNativeRewriteFrames,
};
