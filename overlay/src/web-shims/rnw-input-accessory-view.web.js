/**
 * Replacement for `react-native-web/dist/exports/InputAccessoryView`.
 *
 * react-native-web 0.21.4 resolves InputAccessoryView as a directory entry that
 * Metro fails to find under some pnpm layouts, which aborts the web bundle.
 *
 * IMPORTANT: this shim must NOT import anything from react-native /
 * react-native-web. The shim is itself required from inside react-native-web's
 * bundle, so a reverse `import { View } from 'react-native'` creates a circular
 * dependency: react-native-web is still initializing at that point and its View
 * export is undefined, which crashes on mount with
 *   TypeError: Cannot read properties of undefined (reading 'default')
 * Render children through a plain DOM node instead.
 */
import React from 'react';

export default function InputAccessoryView(props) {
  const { children } = props || {};
  return React.createElement('div', null, children);
}
