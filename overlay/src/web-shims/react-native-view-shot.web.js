/**
 * Web shim for `react-native-view-shot`.
 *
 * Native view capture is unavailable in the browser. Capture helpers reject
 * with a clear unsupported error; `releaseCapture` is a no-op.
 */
function unsupported(name) {
  return () => Promise.reject(new Error(`[web-shim] ${name} is not supported in the browser build.`));
}

export const captureRef = unsupported('captureRef');
export const captureScreen = unsupported('captureScreen');
export function releaseCapture() {}

export default { captureRef, captureScreen, releaseCapture };
