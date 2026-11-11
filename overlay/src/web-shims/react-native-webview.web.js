/**
 * Web shim for `react-native-webview`.
 *
 * The native webview renders an <iframe> in the browser. Supports the common
 * `source={{ uri }}` / `source={{ html }}` inputs, `style`, and a no-op ref
 * handle. The postMessage bridge is left as a stub (iframe↔parent messaging
 * can be wired with window.postMessage later if a feature needs it).
 */
import React, { forwardRef, useImperativeHandle, useRef } from 'react';

function toCss(style) {
  if (!style || typeof style !== 'object') return {};
  const css = {};
  if (style.flex != null) css.flex = style.flex;
  if (style.position) css.position = style.position;
  if (style.top != null) css.top = style.top;
  if (style.left != null) css.left = style.left;
  if (style.right != null) css.right = style.right;
  if (style.bottom != null) css.bottom = style.bottom;
  if (style.width != null) css.width = typeof style.width === 'number' ? `${style.width}px` : style.width;
  if (style.height != null) css.height = typeof style.height === 'number' ? `${style.height}px` : style.height;
  css.border = style.borderWidth != null ? `${style.borderWidth}px solid transparent` : 'none';
  css.backgroundColor = style.backgroundColor || 'transparent';
  return css;
}

const WebView = forwardRef(function WebView(props, ref) {
  const { source, style, onMessage, javaScriptEnabled, ...rest } = props || {};
  const iframeRef = useRef(null);

  let src;
  let srcDoc;
  if (source) {
    if (typeof source === 'string') src = source;
    else if (source.uri) src = source.uri;
    else if (source.html) srcDoc = source.html;
  }

  useImperativeHandle(ref, () => ({
    injectJavaScript: () => {},
    reload: () => {},
    postMessage: () => {},
    clearCache: () => {},
    requestFocus: () => {},
  }));

  return React.createElement('iframe', {
    ref: iframeRef,
    src,
    srcDoc,
    style: { width: '100%', height: '100%', ...toCss(style) },
    sandbox: 'allow-scripts allow-same-origin',
    ...rest,
  });
});

export { WebView };
export default { WebView };
