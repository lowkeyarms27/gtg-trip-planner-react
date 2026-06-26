import { DESTINATIONS, findCityInfo } from '../../data/cityData';

export default function DestinationGrid({ filter, onSelectCity }) {
  return (
    <div className="dest-grid">
      {DESTINATIONS.map((d) => {
        const match = findCityInfo(d.city);
        const visible = filter === 'all' || d.tags.includes(filter);
        return (
          <div
            key={d.city}
            className={`dest-card ${visible ? 'visible' : ''}`}
            onClick={() => onSelectCity(d.country, d.city)}
          >
            <div className="dest-card-city serif">{d.city}</div>
            <div className="dest-card-country">{d.country}</div>
            <div className="dest-card-tags">
              {d.tags.map((t) => (
                <span className="dest-card-tag" key={t}>
                  {t === 'final' ? 'Bucket List' : t === 'value' ? 'Best Value' : t}
                </span>
              ))}
            </div>
            <div className="dest-card-value serif">{match ? `From ${match.info.estValue} pp*` : ''}</div>
          </div>
        );
      })}
    </div>
  );
}
