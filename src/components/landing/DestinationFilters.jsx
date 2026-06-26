const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'usa', label: 'USA' },
  { key: 'canada', label: 'Canada' },
  { key: 'mexico', label: 'Mexico' },
  { key: 'final', label: 'Bucket List' },
  { key: 'value', label: 'Best Value' },
];

export default function DestinationFilters({ active, onChange }) {
  return (
    <div className="dest-filters">
      {FILTERS.map((f) => (
        <button
          key={f.key}
          className={`dest-chip ${active === f.key ? 'active' : ''}`}
          onClick={() => onChange(f.key)}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}
