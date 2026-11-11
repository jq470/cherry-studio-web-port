/**
 * Web shim for `react-native-share`.
 *
 * Native system share sheet is unavailable in the browser. `Share.open`
 * rejects with an unavailable error; the caller already maps share failures
 * to its own error state.
 */
async function open() {
  throw new Error('[web-shim] Native share sheet is not available in the browser build.');
}

const Share = { open };

export { Share };
export default { Share, open };
