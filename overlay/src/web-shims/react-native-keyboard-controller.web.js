/**
 * Web shim for `react-native-keyboard-controller`.
 *
 * The native module drives keyboard avoidance/animation on device. Browsers
 * handle their own soft keyboard behavior, so on web:
 *  - Provider / layout components pass children through to plain RNW primitives.
 *  - Hooks return safe zeroed defaults.
 *  - Static controller/events expose no-op methods.
 */
import React from 'react';
import { ScrollView, View } from 'react-native';

export function KeyboardProvider(props) {
  return React.createElement(React.Fragment, null, props && props.children);
}

export function KeyboardAwareScrollView(props) {
  const { children, ...rest } = props || {};
  return React.createElement(ScrollView, rest, children);
}

export function KeyboardAvoidingView(props) {
  const { children, ...rest } = props || {};
  return React.createElement(View, rest, children);
}

export function OverKeyboardView(props) {
  const { children, ...rest } = props || {};
  return React.createElement(View, rest, children);
}

export function KeyboardStickyView(props) {
  const { children, ...rest } = props || {};
  return React.createElement(View, rest, children);
}

export const KeyboardController = {
  dismiss: () => {},
  setFocus: () => {},
  setEnabled: () => {},
  setMode: () => {},
  setHandledEvents: () => {},
  blur: () => {},
  focus: () => {},
};

export const KeyboardEvents = {
  addListener: () => ({ remove: () => {} }),
};

export function useKeyboardState() {
  return { height: 0, state: 'unknown', duration: 0, target: undefined };
}

export function useReanimatedFocusedInput() {
  return { input: null };
}

export function useReanimatedKeyboardAnimation() {
  return { height: { value: 0 }, progress: { value: 0 } };
}

export function useGenericKeyboardHandler() {
  return {};
}

export default {
  KeyboardProvider,
  KeyboardAwareScrollView,
  KeyboardAvoidingView,
  OverKeyboardView,
  KeyboardStickyView,
  KeyboardController,
  KeyboardEvents,
  useKeyboardState,
  useReanimatedFocusedInput,
  useReanimatedKeyboardAnimation,
  useGenericKeyboardHandler,
};
