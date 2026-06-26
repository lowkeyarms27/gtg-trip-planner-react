import { useReveal } from '../../hooks/useReveal';

export default function CtaBand({ onOpenPlanner }) {
  const { ref, className } = useReveal();
  return (
    <div ref={ref} className={`cta-band ${className}`}>
      <h3 className="serif">
        Ready to build your first trip? <em>Takes about ten seconds.</em>
      </h3>
      <button className="btn-filled" onClick={onOpenPlanner}>
        Open the planner →
      </button>
    </div>
  );
}
