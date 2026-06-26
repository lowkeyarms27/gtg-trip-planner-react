// Fetches a real photo for a golf course via Wikipedia's free REST search
// API — no key required, no rate-limit concerns for this volume of use.
// Returns null (not a throw) on any failure so callers can render a quiet
// fallback instead of breaking.
function upscaleWikiThumb(url, targetWidth = 1200) {
  // Wikipedia thumb URLs end with /NNNpx-filename — bump the resolution.
  return url.replace(/\/\d+px-/, `/${targetWidth}px-`);
}

export async function fetchCoursePhoto(courseName) {
  try {
    const url = `https://en.wikipedia.org/w/rest.php/v1/search/page?q=${encodeURIComponent(
      courseName + ' golf course'
    )}&limit=1`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const json = await res.json();
    const page = json.pages && json.pages[0];
    const thumb = page && page.thumbnail && page.thumbnail.url;
    if (!thumb) return null;
    const full = thumb.startsWith('http') ? thumb : 'https:' + thumb;
    return upscaleWikiThumb(full);
  } catch {
    return null;
  }
}
