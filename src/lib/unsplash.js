import { config } from '../config';

export async function fetchCoursePhotoUnsplash(courseName, cityName) {
  const key = config.unsplashAccessKey;
  if (!key) return null;

  try {
    const query = encodeURIComponent(`${courseName} golf course ${cityName || ''}`);
    const res = await fetch(
      `https://api.unsplash.com/search/photos?query=${query}&per_page=1&orientation=landscape&client_id=${key}`
    );
    if (!res.ok) return null;
    const json = await res.json();
    const photo = json.results && json.results[0];
    return photo ? photo.urls.regular : null;
  } catch {
    return null;
  }
}
