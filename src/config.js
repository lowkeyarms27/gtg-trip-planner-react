// Config priority:
//   1. Vercel environment variables (VITE_*) — set in Vercel dashboard, baked
//      at build time, identical for every device. Only the Vercel account
//      owner can change these. This is the production admin lock.
//   2. localStorage — used in local dev when no env vars are set.
//
// When env vars are present the settings panel is fully read-only for all
// users. No PIN, no device check needed — Vercel account access IS the auth.

const STORAGE_KEY = 'gtg-trip-planner-config';

function loadStored() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

const stored = loadStored();
const env = import.meta.env;

// True when at least one webhook URL is baked in via Vercel env vars.
// In this mode the UI is read-only for everyone.
export const IS_ENV_LOCKED = !!(
  env.VITE_COURSES_WEBHOOK_URL || env.VITE_ITINERARY_WEBHOOK_URL
);

export const config = {
  coursesWebhookUrl:    env.VITE_COURSES_WEBHOOK_URL    || stored.coursesWebhookUrl    || '',
  itineraryWebhookUrl:  env.VITE_ITINERARY_WEBHOOK_URL  || stored.itineraryWebhookUrl  || '',
  sendEmailWebhookUrl:  env.VITE_SEND_EMAIL_WEBHOOK_URL || stored.sendEmailWebhookUrl  || '',
  airtableWebhookUrl:   env.VITE_AIRTABLE_WEBHOOK_URL   || stored.airtableWebhookUrl   || '',
  photosWebhookUrl:     env.VITE_PHOTOS_WEBHOOK_URL     || stored.photosWebhookUrl     || '',
  googleMapsApiKey:     env.VITE_GOOGLE_MAPS_API_KEY    || stored.googleMapsApiKey     || '',
  useMockData: stored.useMockData !== undefined ? stored.useMockData : !IS_ENV_LOCKED,
  // PIN lock — only used in local dev (when IS_ENV_LOCKED is false)
  settingsLocked: stored.settingsLocked || false,
  adminPin: stored.adminPin || '',
  requestTimeoutMs: 30000,
};

export function saveConfig(partial) {
  if (IS_ENV_LOCKED) return; // env vars are immutable at runtime
  Object.assign(config, partial);
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        coursesWebhookUrl:  config.coursesWebhookUrl,
        itineraryWebhookUrl: config.itineraryWebhookUrl,
        sendEmailWebhookUrl: config.sendEmailWebhookUrl,
        airtableWebhookUrl:  config.airtableWebhookUrl,
        photosWebhookUrl:    config.photosWebhookUrl,
        googleMapsApiKey:    config.googleMapsApiKey,
        useMockData:         config.useMockData,
        settingsLocked:      config.settingsLocked,
        adminPin:            config.adminPin,
      })
    );
  } catch {
    // localStorage unavailable — config still works for this page load
  }
}
