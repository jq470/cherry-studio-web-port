/**
 * Web shim for `expo-image-picker`.
 *
 * Conservative no-op for the native camera/album picker. Permissions report
 * denied; launch methods resolve to a canceled result. (A future improvement
 * could back launchImageLibraryAsync with a hidden <input type="file">.)
 */
const denied = { granted: false, canAskAgain: false, status: 'denied' };
const canceled = { canceled: true, assets: null, canceledCount: 0 };

export async function getCameraPermissionsAsync() {
  return denied;
}
export async function requestCameraPermissionsAsync() {
  return denied;
}
export async function getMediaLibraryPermissionsAsync() {
  return denied;
}
export async function requestMediaLibraryPermissionsAsync() {
  return denied;
}
export async function launchCameraAsync() {
  return canceled;
}
export async function launchImageLibraryAsync() {
  return canceled;
}

export const MediaType = { images: 'images', videos: 'videos', all: 'all' };
export const UIImagePickerPreferredAssetRepresentationMode = { automatic: 'automatic', current: 'current' };

export default {
  getCameraPermissionsAsync,
  requestCameraPermissionsAsync,
  getMediaLibraryPermissionsAsync,
  requestMediaLibraryPermissionsAsync,
  launchCameraAsync,
  launchImageLibraryAsync,
  MediaType,
  UIImagePickerPreferredAssetRepresentationMode,
};
