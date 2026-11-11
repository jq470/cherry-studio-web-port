/**
 * Web shim for `expo-camera`.
 *
 * Camera scanning (device connection QR) is not wired up on web. CameraView
 * renders an empty placeholder; permission hooks report denied so the caller
 * falls back to its "unavailable" state instead of crashing.
 */
import React from 'react';
import { View, Text } from 'react-native';

export function CameraView(props) {
  return React.createElement(
    View,
    { style: { flex: 1, alignItems: 'center', justifyContent: 'center' } },
    React.createElement(Text, null, 'Camera unavailable on web'),
  );
}

export async function getCameraPermissionsAsync() {
  return { granted: false, canAskAgain: false, status: 'denied' };
}

export async function requestCameraPermissionsAsync() {
  return { granted: false, canAskAgain: false, status: 'denied' };
}

export const CameraType = { back: 'back', front: 'front' };
export const FlashMode = { off: 'off', on: 'on', auto: 'auto' };

export default { CameraView, getCameraPermissionsAsync, requestCameraPermissionsAsync, CameraType, FlashMode };
