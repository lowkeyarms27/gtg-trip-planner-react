export default function CompareTray({ savedTrips, onRemove, onClear, onOpenCompare }) {
  if (savedTrips.length === 0) return null;

  return (
    <div className="compare-tray visible">
      <div className="compare-tray-head">
        <div className="section-label">— SAVED FOR COMPARISON</div>
        <button className="btn-small" onClick={onClear}>
          Clear all
        </button>
      </div>
      <div className="compare-list">
        {savedTrips.map((t, i) => (
          <div className="compare-chip" key={i}>
            <span className="compare-chip-name serif">{t.city}</span>
            <span>{t.estValue || ''}</span>
            <button className="compare-chip-remove" onClick={() => onRemove(i)} aria-label={`Remove ${t.city} from comparison`}>
              ✕
            </button>
          </div>
        ))}
        {savedTrips.length >= 2 ? (
          <button className="plan-btn compare-launch-btn" onClick={onOpenCompare}>
            Compare {savedTrips.length} trips →
          </button>
        ) : (
          <div className="compare-hint">Save at least one more trip to compare</div>
        )}
      </div>
    </div>
  );
}
