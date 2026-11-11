/**
 * Web shim for `expo-audio`.
 *
 * Recording / audio session configuration is native-only. Permission calls
 * report denied; mode setters are no-ops.
 */
const denied = { granted: false, canAskAgain: false, status: 'denied' };

export async function setAudioModeAsync() {}
export async function getRecordingPermissionsAsync() {
  return denied;
}
export async function requestRecordingPermissionsAsync() {
  return denied;
}

export default { setAudioModeAsync, getRecordingPermissionsAsync, requestRecordingPermissionsAsync };
