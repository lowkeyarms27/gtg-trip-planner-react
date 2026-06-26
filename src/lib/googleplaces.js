import { config } from '../config';

// Fetches a real photo for a golf course.
//
// Preferred path: POST to photosWebhookUrl — n8n receives {courseName, cityName}
// and returns {photoUrl}. The Google API key stays server-side and never
// appears in browser network traffic.
//
// Fallback: direct Google Places API call using googleMapsApiKey. Only use
// this for local dev where the network is trusted — the key is visible in
// DevTools and network logs.
export async function fetchCoursePhotoGoogle(courseName, cityName) {
  const webhookUrl = config.photosWebhookUrl;
  const key = config.googleMapsApiKey;

  if (webhookUrl) {
    try {
      const res = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseName, cityName }),
      });
      if (!res.ok) return null;
      const data = await res.json();
      return data.photoUrl || null;
    } catch {
      return null;
    }
  }

  if (!key) return null;

  try {
    const searchRes = await fetch(
      `https://places.googleapis.com/v1/places:searchText?key=${key}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-FieldMask': 'places.photos',
        },
        body: JSON.stringify({
          textQuery: `${courseName} ${cityName || ''} golf course`,
          maxResultCount: 1,
        }),
      }
    );

    if (!searchRes.ok) return null;
    const data = await searchRes.json();

    const photoName = data.places?.[0]?.photos?.[0]?.name;
    if (!photoName) return null;

    return `https://places.googleapis.com/v1/${photoName}/media?maxWidthPx=1200&key=${key}`;
  } catch {
    return null;
  }
}
