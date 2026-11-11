/**
 * Web shim for `expo-speech` (text-to-speech).
 *
 * Conservative no-op: TTS is not wired up on web. speak/stop resolve,
 * getAvailableVoicesAsync returns an empty list, and the input-length constant
 * mirrors a safe browser chunk size.
 */
export const maxSpeechInputLength = 200;

export async function speak() {}
export async function stop() {}
export async function pause() {}
export async function resume() {}
export async function getAvailableVoicesAsync() {
  return [];
}

export default { speak, stop, pause, resume, getAvailableVoicesAsync, maxSpeechInputLength };
