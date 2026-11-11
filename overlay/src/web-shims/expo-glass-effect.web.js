/**
 * Web shim for `expo-glass-effect`.
 *
 * Liquid Glass is an iOS-only native material. On web there is no corresponding
 * API: availability predicates return `false`, and GlassView/GlassContainer
 * render their children straight through without any blur/glass backdrop.
 */
import React from 'react';

export function isLiquidGlassAvailable() {
  return false;
}

export function isGlassEffectAPIAvailable() {
  return false;
}

export function GlassView(props) {
  const { children } = props || {};
  return React.createElement(React.Fragment, null, children);
}

export function GlassContainer(props) {
  const { children } = props || {};
  return React.createElement(React.Fragment, null, children);
}

export default { GlassView, GlassContainer, isLiquidGlassAvailable, isGlassEffectAPIAvailable };
