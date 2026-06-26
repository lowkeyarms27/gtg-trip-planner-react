import { CITY_DATA } from '../../data/cityData';

export default function CitySelector({ country, city, onCountryChange, onCityChange, cityInfo, onFindCourses, loading }) {
  const cities = country ? CITY_DATA[country] : [];

  return (
    <div className="planner-card">
      <div className="planner-grid">
        <div className="field-col">
          <span className="field-label">Host Country</span>
          <div className="select-wrap">
            <select value={country} onChange={(e) => onCountryChange(e.target.value)}>
              <option value="">Choose country</option>
              <option value="USA">United States</option>
              <option value="Canada">Canada</option>
              <option value="Mexico">Mexico</option>
            </select>
          </div>
        </div>

        <div className="field-col">
          <span className="field-label">Host City</span>
          <div className="select-wrap">
            <select value={city} disabled={!country} onChange={(e) => onCityChange(e.target.value)}>
              <option value="">{country ? 'Choose city' : 'Choose country first'}</option>
              {cities.map((c) => (
                <option key={c.city} value={c.city}>{c.city}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="field-col">
          <span className="field-label">Estimated Trip Value</span>
          <div className="est-value-display serif">{cityInfo?.estValue ? `${cityInfo.estValue} pp` : '— pp'}</div>
          <div className="est-value-note">Indicative only — not a live quote</div>
        </div>

        <div className="plan-btn-col">
          <button className="plan-btn" onClick={onFindCourses} disabled={loading}>
            {loading ? 'Finding courses…' : 'Find Courses →'}
          </button>
        </div>
      </div>

      {cityInfo?.flightEstimate && (
        <div className="flight-estimate-bar">
          <span className="flight-estimate-icon">✈</span>
          <span className="flight-estimate-label">Flights from UK</span>
          <div className="flight-estimate-divider" />
          <span className="flight-estimate-value">{cityInfo.flightEstimate} pp</span>
          <span className="flight-estimate-note">return · economy · indicative</span>
        </div>
      )}
    </div>
  );
}
