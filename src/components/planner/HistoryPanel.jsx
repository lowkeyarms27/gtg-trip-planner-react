import { timeAgo } from '../../lib/format';

export default function HistoryPanel({ history, onReopen }) {
  if (history.length === 0) return null;
  return (
    <div className="history-panel visible">
      <div className="history-label">Recently built this session</div>
      <div className="history-list">
        {history.map((t, i) => (
          <button key={i} className="history-chip" onClick={() => onReopen(i)}>
            <span className="history-chip-city">{t.city}</span>
            <span className="history-chip-time">{timeAgo(t._builtAt)}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
