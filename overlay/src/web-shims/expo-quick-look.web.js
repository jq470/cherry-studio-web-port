/**
 * Web shim for `@magrinj/expo-quick-look` (native file preview / Quick Look).
 *
 * There is no browser equivalent; the native module is not registered on web,
 * so importing it at module top level would throw. This stub exposes the same
 * default-object shape with no-op async methods; preview calls resolve to a
 * no-op on web.
 */
const noop = async () => undefined;

const QuickLook = {
  previewFile: noop,
  previewFiles: noop,
  dismissPreview: noop,
};

export default QuickLook;
