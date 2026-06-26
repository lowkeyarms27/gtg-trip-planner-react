// Central runtime config. Values are persisted to localStorage so settings
// survive tab/browser close. Nothing here is committed to the repo or shared
// across users — no secrets ever touch the source files.
//
// SECURITY NOTE: webhook URLs are safe to store here (they're just endpoints).
// API keys (Google, Unsplash) should NOT be entered directly — use the
// photosWebhookUrl instead so the key stays server-side in n8n.

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

export const config = {
  coursesWebhookUrl: stored.coursesWebhookUrl || '',
  itineraryWebhookUrl: stored.itineraryWebhookUrl || '',
  sendEmailWebhookUrl: stored.sendEmailWebhookUrl || '',
  airtableWebhookUrl: stored.airtableWebhookUrl || '',
  // Proxy webhook: n8n receives {courseName, cityName} and returns {photoUrl}.
  // Use this instead of a direct API key so credentials stay server-side.
  photosWebhookUrl: stored.photosWebhookUrl || '',
  // Direct key fallback — only use for local dev where network traffic is trusted.
  googleMapsApiKey: stored.googleMapsApiKey || '',
  useMockData: stored.useMockData !== undefined ? stored.useMockData : true,
  requestTimeoutMs: 30000,
};

export function saveConfig(partial) {
  Object.assign(config, partial);
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        coursesWebhookUrl: config.coursesWebhookUrl,
        itineraryWebhookUrl: config.itineraryWebhookUrl,
        sendEmailWebhookUrl: config.sendEmailWebhookUrl,
        airtableWebhookUrl: config.airtableWebhookUrl,
        photosWebhookUrl: config.photosWebhookUrl,
        googleMapsApiKey: config.googleMapsApiKey,
        useMockData: config.useMockData,
      })
    );
  } catch {
    // localStorage unavailable — config still works for this page load
  }
}
