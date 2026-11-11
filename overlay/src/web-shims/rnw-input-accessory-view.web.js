/**
 * Replacement for `react-native-web/dist/exports/InputAccessoryView`.
 *
 * react-native-web 0.21.4 ships this export as a directory-style entry, and in
 * some pnpm installs Metro fails to resolve it from `dist/index.js`:
 *   Unable to resolve "./exports/InputAccessoryView" from react-native-web/dist/index.js
 * which aborts the whole web bundle. The component is an iOS-only keyboard
 * accessory anyway, so on web it renders children as a plain View.
 */
import React from 'react';
import { View } from 'react-native';

export default function InputAccessoryView(props) {
  const { children, style, ...rest } = props || {};
  return React.createElement(View, { ...rest, style }, children);
}
