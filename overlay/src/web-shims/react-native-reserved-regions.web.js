/**
 * Web shim for `react-native-reserved-regions` (foldable-device display regions).
 *
 * Foldable screens do not apply on web. The provider passes children through,
 * the ready hook returns true, and the regions list is empty so the layout
 * treats the whole window as a single region.
 */
import React from 'react';

export function ReservedRegionsProvider(props) {
  return React.createElement(React.Fragment, null, props && props.children);
}

export function useReservedRegionsReady() {
  return true;
}

export function useReservedRegions() {
  return [];
}

export default { ReservedRegionsProvider, useReservedRegionsReady, useReservedRegions };
