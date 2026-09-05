import i18n from "../i18n";

// Turn a caught axios error into a translated, user-facing message.
// - If the backend sent a `msg`, translate it via the apiError map (falling
//   back to the raw message for anything not mapped).
// - If it's a network error (no response), show the server-unreachable message.
// - Otherwise use the caller's context-specific fallback key.
export function apiErrorMessage(err, fallbackKey) {
  const msg = err?.response?.data?.msg;
  if (msg) return i18n.t(`apiError.${msg}`, { defaultValue: msg });
  if (err?.request) return i18n.t("common.serverUnreachable");
  return i18n.t(fallbackKey);
}
