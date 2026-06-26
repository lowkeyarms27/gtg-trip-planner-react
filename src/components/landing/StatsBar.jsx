import { useReveal } from '../../hooks/useReveal';

const STATS = [
  { num: '16', label: 'Host Cities Covered' },
  { num: '<10s', label: 'Draft Generation Time', italic: '<' },
  { num: '3', label: 'Courses Per Itinerary' },
  { num: '01', label: 'Team That Builds It' },
];

export default function StatsBar() {
  const { ref, className } = useReveal();
  return (
    <div ref={ref} className={`stats-bar ${className}`}>
      <div className="stats-inner">
        {STATS.map((s) => (
          <div className="stat" key={s.label}>
            <div className="stat-num serif">{s.num}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
