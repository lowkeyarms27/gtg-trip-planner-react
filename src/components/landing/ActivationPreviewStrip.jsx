import { PREVIEW_ACTIVATIONS } from '../../data/cityData';
import { useReveal } from '../../hooks/useReveal';

export default function ActivationPreviewStrip({ onSelectCity }) {
  const { ref, className } = useReveal();
  return (
    <div ref={ref} className={`activation-preview-section ${className}`}>
      <div className="section-label">— RECENT DRAFTS</div>
      <h2 className="serif">
        What the planner has <em>already built.</em>
      </h2>
      <p>
        A few example activations drafted using real fixture and course data — click any one to jump straight into
        the planner.
      </p>
      <div className="activation-preview-strip">
        {PREVIEW_ACTIVATIONS.map((p) => (
          <div className="preview-card" key={p.city} onClick={() => onSelectCity(p.country, p.city)}>
            <div className="preview-card-tag">{p.tag}</div>
            <div className="preview-card-title serif">
              {p.city}, {p.country}
            </div>
            <div className="preview-card-meta">{p.desc}</div>
            <div className="preview-card-cta">Open in planner →</div>
          </div>
        ))}
      </div>
    </div>
  );
}
