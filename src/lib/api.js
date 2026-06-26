import { config } from '../config';
import { MOCK_COURSES } from '../data/cityData';

async function withTimeout(promiseFactory, ms) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), ms);
  try {
    return await promiseFactory(controller.signal);
  } finally {
    clearTimeout(timeout);
  }
}

export async function testWebhook(url, body) {
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    return res.ok ? { ok: true } : { ok: false, message: `status ${res.status}` };
  } catch (err) {
    return { ok: false, message: err.message };
  }
}

export async function fetchCourses(country, cityName) {
  if (config.useMockData) {
    return new Promise((resolve) =>
      setTimeout(() => {
        resolve(
          MOCK_COURSES[cityName] || [
            { name: 'Local championship course', address: cityName },
            { name: 'Regional country club', address: cityName },
          ]
        );
      }, 900)
    );
  }

  return withTimeout(async (signal) => {
    const res = await fetch(config.coursesWebhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal,
      body: JSON.stringify({ country, city: cityName }),
    });
    if (!res.ok) throw new Error(`status ${res.status}`);
    const data = await res.json();
    if (data.error) throw new Error(data.message || 'Request was rejected');
    return data.courses || [];
  }, config.requestTimeoutMs).catch((err) => {
    if (err.name === 'AbortError') throw new Error('Request timed out — check your n8n workflow is active.');
    throw err;
  });
}

function mockItinerary(cityInfo, courses) {
  return new Promise((resolve) =>
    setTimeout(
      () =>
        resolve({
          city: cityInfo.city,
          venue: cityInfo.venue,
          match: cityInfo.match,
          courses,
          days: [
            {
              title: 'Arrival & First Round',
              text: `Private transfer to your hotel, followed by an afternoon tee time at ${courses[0]} — a championship layout, the perfect start to your trip.`,
            },
            {
              title: `Match Day — ${cityInfo.match}`,
              text: `Premium hospitality access at ${cityInfo.venue}. Pre-match dining, in-seat service, and a guided send-off after the final whistle.`,
            },
            {
              title: 'Farewell Round',
              text: `A relaxed closing round at ${courses[courses.length - 1]}, followed by lunch on the clubhouse terrace before departure.`,
            },
          ],
        }),
      1400
    )
  );
}

export async function buildItinerary(country, cityInfo, selectedCourses, weatherContext) {
  if (config.useMockData) {
    return mockItinerary(cityInfo, selectedCourses);
  }

  const weather = weatherContext ? {
    temperature: Math.round(weatherContext.current.temperature),
    condition: weatherContext.condition,
    windspeed: Math.round(weatherContext.current.windspeed),
    high: Math.round(weatherContext.daily.temperature_2m_max[0]),
    low: Math.round(weatherContext.daily.temperature_2m_min[0]),
    rainChance: weatherContext.daily.precipitation_probability_max[0],
  } : null;

  return withTimeout(async (signal) => {
    const res = await fetch(config.itineraryWebhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal,
      body: JSON.stringify({
        country,
        city: cityInfo.city,
        venue: cityInfo.venue,
        match: cityInfo.match,
        estValue: cityInfo.estValue,
        flightEstimate: cityInfo.flightEstimate,
        selectedCourses,
        weather,
      }),
    });
    if (!res.ok) throw new Error(`n8n responded with status ${res.status}`);
    const data = await res.json();
    if (data.error) throw new Error(data.message || 'Request was rejected');
    return data;
  }, config.requestTimeoutMs).catch((err) => {
    if (err.name === 'AbortError') throw new Error('Request timed out — check your n8n workflow is active.');
    throw err;
  });
}

export function logToAirtable(itinerary) {
  const url = config.airtableWebhookUrl;
  if (!url) return;
  fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      city: itinerary.city,
      country: itinerary.country,
      match: itinerary.match,
      venue: itinerary.venue,
      courses: itinerary.courses.join(', '),
      estValue: itinerary.estValue,
      timestamp: new Date().toISOString(),
      source: 'GTG Trip Planner',
    }),
  }).catch(() => {});
}

// Normalises whatever the backend (or mock) returned into the shape the UI
// expects, always trusting the courses the user actually picked over
// anything the backend might echo back.
export function normaliseResponse(data, fallbackCountry, cityInfo, selectedCourses) {
  let days = data.days;
  if (data.itinerary && !days) {
    const chunks = data.itinerary
      .split(/Day\s*\d+[:.\-]?/i)
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, 3);
    days = chunks.map((text, i) => ({ title: `Day ${i + 1}`, text: text.replace(/[#*]/g, '').slice(0, 600) }));
  }

  return {
    city: data.city || cityInfo.city,
    country: data.country || fallbackCountry,
    match: data.match || cityInfo.match,
    venue: data.venue || cityInfo.venue,
    estValue: data.estValue || cityInfo.estValue,
    courses: selectedCourses,
    days: days && days.length ? days : [],
  };
}
