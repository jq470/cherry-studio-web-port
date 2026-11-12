// Web shim for expo-observe (native ExpoObserve performance/observability SDK).
//
// configureObserve only requires it when the native ExpoObserve module is
// present, which never happens on web; Metro still bundles the static require,
// so map it to a no-op namespace. ObserveRoot.wrap must be an identity
// passthrough so the reporting-root wrapper does not replace the React component
// with a non-component proxy.

const noop = () => {};

const Observe = {
  configure: noop,
  setTag: noop,
  setTags: noop,
  addBreadcrumb: noop,
  startTrace: noop,
};

const ObserveRoot = {
  wrap: (component) => component,
};

export { Observe, ObserveRoot };

export default {
  Observe,
  ObserveRoot,
};
