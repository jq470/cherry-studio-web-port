/**
 * Web shim for `expo-speech-recognition`.
 *
 * On-device speech recognition is native-only. The module object exposes the
 * same method surface as no-ops; availability reports false, permissions
 * denied, and listeners return an empty subscription.
 */
const denied = { granted: false, canAskAgain: false, status: 'denied' };

const ExpoSpeechRecognitionModule = {
  isRecognitionAvailable: async () => false,
  getDefaultRecognitionService: async () => null,
  getPermissionsAsync: async () => denied,
  requestPermissionsAsync: async () => denied,
  getMicrophonePermissionsAsync: async () => denied,
  requestMicrophonePermissionsAsync: async () => denied,
  getSpeechRecognizerPermissionsAsync: async () => denied,
  requestSpeechRecognizerPermissionsAsync: async () => denied,
  start: async () => {},
  stop: async () => {},
  abort: async () => {},
  addListener: () => ({ remove: () => {} }),
  removeListeners: () => {},
};

export { ExpoSpeechRecognitionModule };
export default { ExpoSpeechRecognitionModule };
