import { useReveal } from '../../hooks/useReveal';

const FEATURES = [
  {
    num: 'I',
    title: 'Real fixture data',
    text: 'Every host city is tied to its actual 2026 World Cup fixture and venue — no guesswork, no placeholder dates.',
  },
  {
    num: 'II',
    title: 'Nearby courses, found automatically',
    text: 'The tool searches for golf courses near the host city the moment you select it — no manual lookup required.',
  },
  {
    num: 'III',
    title: 'A drafted itinerary, instantly',
    text: 'Match day plus two days of golf, written in a premium travel tone — ready to review and send to a client.',
  },
];

export default function FeatureGrid() {
  const head = useReveal();
  const grid = useReveal();

  return (
    <>
      <div ref={head.ref} className={`section-head ${head.className}`}>
        <div className="section-label">— WHAT IT DOES</div>
        <h2 className="serif">
          One brief. <em>A drafted trip at the end of it.</em>
        </h2>
        <p>
          Built the same way every activation in the GTG ecosystem works — a short brief in, a usable draft out,
          ready for your team to take from there.
        </p>
      </div>

      <div ref={grid.ref} className={`feature-grid ${grid.className}`}>
        {FEATURES.map((f) => (
          <div className="feature-card" key={f.num}>
            <div className="feature-num serif">{f.num}</div>
            <h3 className="serif">{f.title}</h3>
            <p>{f.text}</p>
          </div>
        ))}
      </div>
    </>
  );
}
