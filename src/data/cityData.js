// All 16 official 2026 FIFA World Cup host cities (11 USA, 3 Mexico, 2 Canada).
// Venue coordinates sourced from published stadium location data.
// estValue combines real-world reported World Cup trip costs (ticket + 2
// nights hotel + flights/transfers) with a golf add-on (~£250-450 for 2
// rounds) — flagged as indicative throughout the UI, never shown as a live
// quote.

export const CITY_DATA = {
  USA: [
    { city: 'Dallas', venue: 'AT&T Stadium, Arlington', match: 'Semifinal · 14 July 2026', estValue: '£4,700', flightEstimate: '£520–£780', lat: 32.748138, lng: -97.093231 },
    { city: 'Miami', venue: 'Hard Rock Stadium', match: 'Quarterfinal · 11 July 2026', estValue: '£4,500', flightEstimate: '£480–£720', lat: 25.957830, lng: -80.239326 },
    { city: 'Los Angeles', venue: 'SoFi Stadium, Inglewood', match: 'Quarterfinal · 10 July 2026', estValue: '£4,900', flightEstimate: '£580–£860', lat: 33.953438, lng: -118.339447 },
    { city: 'Boston', venue: 'Gillette Stadium, Foxborough', match: 'Quarterfinal · 9 July 2026', estValue: '£6,400', flightEstimate: '£460–£690', lat: 42.090790, lng: -71.264404 },
    { city: 'New York', venue: 'MetLife Stadium', match: 'Final · 19 July 2026', estValue: '£15,000', flightEstimate: '£420–£650', lat: 40.813477, lng: -74.074951 },
    { city: 'Seattle', venue: 'Lumen Field', match: 'Group Stage · June 2026', estValue: '£3,000', flightEstimate: '£580–£820', lat: 47.595135, lng: -122.331917 },
    { city: 'Atlanta', venue: 'Mercedes-Benz Stadium', match: 'Semifinal · 15 July 2026', estValue: '£4,200', flightEstimate: '£500–£740', lat: 33.755371, lng: -84.401436 },
    { city: 'Houston', venue: 'NRG Stadium', match: 'Group Stage · June 2026', estValue: '£3,300', flightEstimate: '£520–£760', lat: 29.684702, lng: -95.410965 },
    { city: 'Kansas City', venue: 'GEHA Field at Arrowhead Stadium', match: 'Group Stage · June 2026', estValue: '£3,100', flightEstimate: '£560–£800', lat: 39.048855, lng: -94.484474 },
    { city: 'Philadelphia', venue: 'Lincoln Financial Field', match: 'Group Stage · June 2026', estValue: '£3,600', flightEstimate: '£440–£680', lat: 39.901325, lng: -75.167862 },
    { city: 'San Francisco Bay Area', venue: "Levi's Stadium, Santa Clara", match: 'Group Stage · June 2026', estValue: '£4,000', flightEstimate: '£620–£880', lat: 37.403297, lng: -121.969765 },
  ],
  Canada: [
    { city: 'Toronto', venue: 'BMO Field', match: 'Group Stage · June 2026', estValue: '£3,400', flightEstimate: '£480–£720', lat: 43.633087, lng: -79.418961 },
    { city: 'Vancouver', venue: 'BC Place', match: 'Round of 16 · June 2026', estValue: '£3,900', flightEstimate: '£620–£880', lat: 49.276646, lng: -123.112564 },
  ],
  Mexico: [
    { city: 'Mexico City', venue: 'Estadio Azteca', match: 'Opening Match · 11 June 2026', estValue: '£3,600', flightEstimate: '£620–£900', lat: 19.302837, lng: -99.150803 },
    { city: 'Guadalajara', venue: 'Estadio Akron', match: 'Group Stage · June 2026', estValue: '£3,100', flightEstimate: '£660–£940', lat: 20.681721, lng: -103.463135 },
    { city: 'Monterrey', venue: 'Estadio BBVA', match: 'Group Stage · June 2026', estValue: '£3,200', flightEstimate: '£660–£940', lat: 25.669132, lng: -100.244621 },
  ],
};

export function findCityInfo(cityName) {
  for (const country of Object.keys(CITY_DATA)) {
    const found = CITY_DATA[country].find((c) => c.city === cityName);
    if (found) return { country, info: found };
  }
  return null;
}

export function allHostCities() {
  const list = [];
  for (const country of Object.keys(CITY_DATA)) {
    for (const c of CITY_DATA[country]) {
      list.push({ country, ...c });
    }
  }
  return list;
}

export const MAP_COUNTRY_COLOR = {
  USA: '#DDAE6B',
  Canada: '#8FBFA3',
  Mexico: '#D4537E',
};

// Destination metadata for the browsable grid — tags map to filter chips
export const DESTINATIONS = [
  { city: 'Dallas', country: 'USA', tags: ['usa', 'value'] },
  { city: 'Miami', country: 'USA', tags: ['usa'] },
  { city: 'Los Angeles', country: 'USA', tags: ['usa', 'final'] },
  { city: 'Boston', country: 'USA', tags: ['usa'] },
  { city: 'New York', country: 'USA', tags: ['usa', 'final'] },
  { city: 'Seattle', country: 'USA', tags: ['usa', 'value'] },
  { city: 'Atlanta', country: 'USA', tags: ['usa'] },
  { city: 'Houston', country: 'USA', tags: ['usa', 'value'] },
  { city: 'Kansas City', country: 'USA', tags: ['usa', 'value'] },
  { city: 'Philadelphia', country: 'USA', tags: ['usa'] },
  { city: 'San Francisco Bay Area', country: 'USA', tags: ['usa'] },
  { city: 'Toronto', country: 'Canada', tags: ['canada', 'value'] },
  { city: 'Vancouver', country: 'Canada', tags: ['canada'] },
  { city: 'Mexico City', country: 'Mexico', tags: ['mexico', 'value'] },
  { city: 'Guadalajara', country: 'Mexico', tags: ['mexico', 'value'] },
  { city: 'Monterrey', country: 'Mexico', tags: ['mexico', 'value'] },
];

// Verified real golf courses, used as mock data and as a frontend-side
// safety net if the backend ever returns nothing for a city.
export const MOCK_COURSES = {
  Dallas: [{ name: 'Dallas Country Club', address: 'Dallas, TX, USA' }, { name: 'Cedar Crest Golf Course', address: 'Dallas, TX, USA' }],
  Miami: [{ name: 'Miami Beach Golf Club', address: 'Miami Beach, FL, USA' }, { name: 'Miami Springs Golf Course', address: 'Miami Springs, FL, USA' }],
  'Los Angeles': [{ name: 'Los Angeles Country Club', address: 'Beverly Hills, CA, USA' }, { name: 'Rancho Park Golf Course', address: 'Los Angeles, CA, USA' }],
  Boston: [{ name: 'The Country Club, Brookline', address: 'Brookline, MA, USA' }, { name: 'Old Sandwich Golf Club', address: 'Plymouth, MA, USA' }],
  'New York': [{ name: 'Bethpage Black', address: 'Farmingdale, NY, USA' }, { name: 'Liberty National Golf Club', address: 'Jersey City, NJ, USA' }],
  Seattle: [{ name: 'Sahalee Country Club', address: 'Sammamish, WA, USA' }, { name: 'The Golf Club at Newcastle', address: 'Newcastle, WA, USA' }],
  Atlanta: [{ name: 'East Lake Golf Club', address: 'Atlanta, GA, USA' }, { name: 'Bobby Jones Golf Course', address: 'Atlanta, GA, USA' }],
  Houston: [{ name: 'Golf Club of Houston', address: 'Humble, TX, USA' }, { name: 'Memorial Park Golf Course', address: 'Houston, TX, USA' }],
  'Kansas City': [{ name: 'Swope Memorial Golf Course', address: 'Kansas City, MO, USA' }, { name: 'Hallbrook Country Club', address: 'Leawood, KS, USA' }],
  Philadelphia: [{ name: 'Pine Valley Golf Club', address: 'Pine Valley, NJ, USA' }, { name: 'The Golf Course at Glen Mills', address: 'Glen Mills, PA, USA' }],
  'San Francisco Bay Area': [{ name: 'Cypress Point Club', address: 'Pebble Beach, CA, USA' }, { name: 'Pasatiempo Golf Club', address: 'Santa Cruz, CA, USA' }],
  Toronto: [{ name: "St George's Golf and Country Club", address: 'Toronto, ON, Canada' }, { name: 'TPC Toronto at Osprey Valley', address: 'Caledon, ON, Canada' }],
  Vancouver: [{ name: 'Shaughnessy Golf & Country Club', address: 'Vancouver, BC, Canada' }, { name: 'Capilano Golf & Country Club', address: 'West Vancouver, BC, Canada' }],
  'Mexico City': [{ name: 'Club de Golf México', address: 'Mexico City, Mexico' }, { name: 'Club de Golf Bosques', address: 'Mexico City, Mexico' }],
  Guadalajara: [{ name: 'Guadalajara Country Club', address: 'Guadalajara, Mexico' }, { name: 'Santa Anita Golf Club', address: 'Guadalajara, Mexico' }],
  Monterrey: [{ name: 'Club Campestre Monterrey', address: 'Monterrey, Mexico' }, { name: 'Valle Alto Golf Club', address: 'Monterrey, Mexico' }],
};

export const HOTEL_DATA = {
  Dallas: [
    { name: 'Rosewood Mansion on Turtle Creek', stars: 5, priceFrom: '£380', type: 'Boutique Luxury' },
    { name: 'The Ritz-Carlton Dallas', stars: 5, priceFrom: '£300', type: 'Classic Luxury' },
    { name: 'Omni Dallas Hotel', stars: 4, priceFrom: '£175', type: 'City Centre' },
  ],
  Miami: [
    { name: 'Faena Hotel Miami Beach', stars: 5, priceFrom: '£520', type: 'Design Hotel' },
    { name: '1 Hotel South Beach', stars: 5, priceFrom: '£440', type: 'Eco Luxury' },
    { name: 'The Setai Miami Beach', stars: 5, priceFrom: '£390', type: 'Oceanfront Luxury' },
  ],
  'Los Angeles': [
    { name: 'Hotel Bel-Air', stars: 5, priceFrom: '£620', type: 'Iconic Luxury' },
    { name: 'The Beverly Hills Hotel', stars: 5, priceFrom: '£560', type: 'Classic Hollywood' },
    { name: 'Shutters on the Beach', stars: 4, priceFrom: '£380', type: 'Beachfront' },
  ],
  Boston: [
    { name: 'The Newbury Boston', stars: 5, priceFrom: '£380', type: 'Heritage Luxury' },
    { name: 'Four Seasons Boston', stars: 5, priceFrom: '£420', type: 'Classic Luxury' },
    { name: 'The Langham Boston', stars: 5, priceFrom: '£320', type: 'Grand Hotel' },
  ],
  'New York': [
    { name: 'The Plaza Hotel', stars: 5, priceFrom: '£680', type: 'Iconic Landmark' },
    { name: 'Four Seasons New York', stars: 5, priceFrom: '£760', type: 'Classic Luxury' },
    { name: 'The Peninsula New York', stars: 5, priceFrom: '£580', type: 'Grand Luxury' },
  ],
  Seattle: [
    { name: 'Fairmont Olympic Hotel', stars: 5, priceFrom: '£320', type: 'Historic Landmark' },
    { name: 'Four Seasons Seattle', stars: 5, priceFrom: '£420', type: 'Waterfront Luxury' },
    { name: 'Hotel 1000', stars: 4, priceFrom: '£220', type: 'Boutique' },
  ],
  Atlanta: [
    { name: 'Four Seasons Atlanta', stars: 5, priceFrom: '£340', type: 'Classic Luxury' },
    { name: 'The Whitley', stars: 5, priceFrom: '£280', type: 'Buckhead Luxury' },
    { name: 'InterContinental Buckhead', stars: 4, priceFrom: '£200', type: 'Business Luxury' },
  ],
  Houston: [
    { name: 'The Post Oak Hotel', stars: 5, priceFrom: '£380', type: 'Ultra Luxury' },
    { name: 'Hotel ZaZa Houston', stars: 4, priceFrom: '£220', type: 'Boutique Design' },
    { name: 'Four Seasons Houston', stars: 5, priceFrom: '£320', type: 'Classic Luxury' },
  ],
  'Kansas City': [
    { name: 'The Raphael Hotel', stars: 4, priceFrom: '£180', type: 'Boutique Heritage' },
    { name: 'Hotel Phillips', stars: 4, priceFrom: '£160', type: 'Art Deco' },
    { name: '21c Museum Hotel', stars: 4, priceFrom: '£195', type: 'Art Hotel' },
  ],
  Philadelphia: [
    { name: 'Four Seasons Philadelphia', stars: 5, priceFrom: '£420', type: 'Classic Luxury' },
    { name: 'The Logan Hotel', stars: 4, priceFrom: '£240', type: 'Design Hotel' },
    { name: 'Loews Philadelphia Hotel', stars: 4, priceFrom: '£195', type: 'City Centre' },
  ],
  'San Francisco Bay Area': [
    { name: 'The Ritz-Carlton San Francisco', stars: 5, priceFrom: '£480', type: 'Classic Luxury' },
    { name: 'Fairmont San Francisco', stars: 5, priceFrom: '£380', type: 'Historic Landmark' },
    { name: 'Four Seasons San Francisco', stars: 5, priceFrom: '£520', type: 'Modern Luxury' },
  ],
  Toronto: [
    { name: 'Four Seasons Toronto', stars: 5, priceFrom: '£360', type: 'Classic Luxury' },
    { name: 'The Ritz-Carlton Toronto', stars: 5, priceFrom: '£400', type: 'Grand Luxury' },
    { name: 'Shangri-La Toronto', stars: 5, priceFrom: '£320', type: 'Asian Luxury' },
  ],
  Vancouver: [
    { name: 'Fairmont Hotel Vancouver', stars: 5, priceFrom: '£340', type: 'Historic Landmark' },
    { name: 'Four Seasons Vancouver', stars: 5, priceFrom: '£420', type: 'Classic Luxury' },
    { name: 'Rosewood Hotel Georgia', stars: 5, priceFrom: '£380', type: 'Heritage Luxury' },
  ],
  'Mexico City': [
    { name: 'Four Seasons Mexico City', stars: 5, priceFrom: '£280', type: 'Garden Luxury' },
    { name: 'Las Alcobas', stars: 5, priceFrom: '£320', type: 'Boutique Luxury' },
    { name: 'Sofitel Mexico City Reforma', stars: 5, priceFrom: '£220', type: 'French Luxury' },
  ],
  Guadalajara: [
    { name: 'Presidente InterContinental', stars: 5, priceFrom: '£180', type: 'Grand Hotel' },
    { name: 'Casa Fayette', stars: 5, priceFrom: '£240', type: 'Boutique Design' },
    { name: 'Hotel Morales', stars: 4, priceFrom: '£120', type: 'Historic Centre' },
  ],
  Monterrey: [
    { name: 'Westin Monterrey Valle', stars: 5, priceFrom: '£160', type: 'Modern Luxury' },
    { name: 'Camino Real Monterrey', stars: 5, priceFrom: '£150', type: 'Classic Luxury' },
    { name: 'NH Collection Monterrey', stars: 4, priceFrom: '£110', type: 'Business Hotel' },
  ],
};

// Example pre-built activations shown on the landing page
export const PREVIEW_ACTIVATIONS = [
  { city: 'Dallas', country: 'USA', tag: 'Semifinal Week', desc: 'Dallas National Golf Club · Royal Oaks Country Club' },
  { city: 'Vancouver', country: 'Canada', tag: 'Round of 16', desc: 'Shaughnessy Golf & Country Club · Capilano Golf & Country Club' },
  { city: 'Guadalajara', country: 'Mexico', tag: 'Group Stage', desc: 'Guadalajara Country Club · Santa Anita Golf Club' },
  { city: 'Boston', country: 'USA', tag: 'Quarterfinal', desc: 'TPC Boston · The Country Club, Brookline' },
];
