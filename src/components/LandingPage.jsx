import { useState } from 'react';
import Hero from './landing/Hero';
import StatsBar from './landing/StatsBar';
import FeatureGrid from './landing/FeatureGrid';
import CtaBand from './landing/CtaBand';
import HostMap from './landing/HostMap';
import DestinationFilters from './landing/DestinationFilters';
import DestinationGrid from './landing/DestinationGrid';
import ActivationPreviewStrip from './landing/ActivationPreviewStrip';
import { useReveal } from '../hooks/useReveal';

export default function LandingPage({ onSelectCity }) {
  const [filter, setFilter] = useState('all');
  const destReveal = useReveal();

  return (
    <div className="view-landing">
      <Hero onOpenPlanner={() => onSelectCity(null, null)} />
      <StatsBar />

      <main>
        <FeatureGrid />
        <CtaBand onOpenPlanner={() => onSelectCity(null, null)} />

        <div ref={destReveal.ref} className={`destinations-section ${destReveal.className}`}>
          <div className="section-label">— DESTINATIONS</div>
          <h2 className="serif">
            Sixteen cities. <em>One ecosystem.</em>
          </h2>
          <p>Click a city on the map, or use the filters below — every host city is ready to go straight into the planner.</p>

          <HostMap activeFilter={filter} onSelectCity={onSelectCity} />

          <DestinationFilters active={filter} onChange={setFilter} />
          <DestinationGrid filter={filter} onSelectCity={onSelectCity} />
          <div className="dest-footnote">
            *Indicative pricing based on published market averages for World Cup travel plus a typical 2-round golf
            add-on — not a live quote.
          </div>
        </div>

        <ActivationPreviewStrip onSelectCity={onSelectCity} />
      </main>

      <footer>GOLF TRAVEL GROUP — GTG WORLD CUP — INTERNAL PROTOTYPE</footer>
    </div>
  );
}
