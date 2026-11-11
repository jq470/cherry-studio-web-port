/**
 * Web shim for `expo-media-library`.
 *
 * Saving to the device photo library is a native-only action. On web the
 * permission reports denied and `Asset.create` is a no-op; the export flow
 * should fall back to a browser download instead.
 */
const denied = { granted: false, canAskAgain: false, status: 'denied' };

export async function getPermissionsAsync() {
  return denied;
}

export async function requestPermissionsAsync() {
  return denied;
}

export const Asset = {
  async create() {
    return null;
  },
};

export const MediaType = { photo: 'photo', video: 'video', unknown: 'unknown' };

export default { getPermissionsAsync, requestPermissionsAsync, Asset, MediaType };
