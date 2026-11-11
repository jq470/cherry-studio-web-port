/**
 * Web shim for `expo-intent-launcher` (Android system intent bridge).
 *
 * Opening native system screens from the browser is not supported; the
 * launcher action constant is retained and startActivityAsync resolves as a
 * no-op.
 */
export const ActivityAction = {
  APP_NOTIFICATION_SETTINGS: 'android.settings.APP_NOTIFICATION_SETTINGS',
  APP_DETAILS_SETTINGS: 'android.settings.APPLICATION_DETAILS_SETTINGS',
  ACTION_MANAGE_ALL_APPLICATIONS: 'android.settings.MANAGE_APPLICATIONS_SETTINGS',
};

export async function startActivityAsync() {}

export default { ActivityAction, startActivityAsync };
