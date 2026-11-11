/**
 * Web shim for `react-native-nitro-theme-transition`.
 *
 * The native module plays a GPU snapshot theme-transition animation on
 * device. On web there is no nitro native module; the wrapper just invokes
 * the theme callback directly (the comment in constants.ts already notes the
 * theme itself commits instantly, so the transition is purely cosmetic).
 */
export function withThemeTransition(callback) {
  return callback();
}

export default { withThemeTransition };
