const DAY_MARKERS = ['I', 'II', 'III', 'IV', 'V'];

export default function CompareView({ savedTrips, onRemove, onClose }) {
  return (
    <div className="compare-view visible">
      <div className="compare-view-head">
        <h2 className="serif">
          Comparing <em>{savedTrips.length}</em> trips
        </h2>
        <button className="btn-small" onClick={onClose}>
          ← Back to planner
        </button>
      </div>
      <div className="compare-grid">
        {savedTrips.map((t, i) => (
          <div className="compare-card" key={i}>
            <div className="compare-card-head">
              <div className="compare-card-city serif">
                {t.city}, <em>{t.country}</em>
              </div>
              <div className="compare-card-meta">
                {t.match}
                <br />
                {t.venue}
                <br />
                {t.courses.join(' · ')}
              </div>
              <div className="compare-card-value serif">{t.estValue || '—'} pp*</div>
            </div>
            <div className="compare-card-days">
              {t.days.map((d, j) => (
                <div className="compare-card-day" key={j}>
                  <div className="compare-card-day-title">
                    {DAY_MARKERS[j] || j + 1}. {d.title}
                  </div>
                  <div>
                    {d.text.slice(0, 140)}
                    {d.text.length > 140 ? '…' : ''}
                  </div>
                </div>
              ))}
            </div>
            <button className="compare-card-remove" onClick={() => onRemove(i)}>
              Remove from comparison
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
