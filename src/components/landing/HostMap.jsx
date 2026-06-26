import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';
import { allHostCities, findCityInfo, MAP_COUNTRY_COLOR, DESTINATIONS } from '../../data/cityData';
import { useReveal } from '../../hooks/useReveal';

export default function HostMap({ activeFilter, onSelectCity }) {
  const svgRef = useRef(null);
  const wrapRef = useRef(null);
  const [tooltip, setTooltip] = useState(null);
  const [loadError, setLoadError] = useState(false);
  const [mapReady, setMapReady] = useState(false);
  const { ref: revealRef, className } = useReveal();

  // Loads the map once. Deliberately has no dependency on activeFilter —
  // the second effect below handles filter changes on the already-rendered
  // pins, so this effect doesn't need to re-run (and re-fetch topology)
  // every time the filter changes.
  useEffect(() => {
    let cancelled = false;

    const svg = d3.select(svgRef.current);
    const countriesG = svg.select('.map-countries');
    const pinsG = svg.select('.map-pins');

    const projection = d3
      .geoAlbers()
      .rotate([96, 0])
      .center([0, 38])
      .parallels([29.5, 45.5])
      .scale(750)
      .translate([340, 230]);

    const path = d3.geoPath(projection);

    d3.json('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json')
      .then((world) => {
        if (cancelled) return;
        const countries = topojson.feature(world, world.objects.countries);
        const target = countries.features.filter((f) =>
          ['United States of America', 'Canada', 'Mexico'].includes(f.properties.name)
        );

        countriesG
          .selectAll('path')
          .data(target)
          .join('path')
          .attr('d', path)
          .attr('fill', 'rgba(255,255,255,0.06)')
          .attr('stroke', 'rgba(255,255,255,0.18)')
          .attr('stroke-width', 0.75)
          .style('transition', 'fill 0.25s ease')
          .on('mouseenter', function () {
            d3.select(this).attr('fill', 'rgba(255,255,255,0.1)');
          })
          .on('mouseleave', function () {
            d3.select(this).attr('fill', 'rgba(255,255,255,0.06)');
          });

        const cities = allHostCities();

        const pins = pinsG
          .selectAll('g.map-pin')
          .data(cities)
          .join('g')
          .attr('class', 'map-pin')
          .attr('transform', (d) => {
            const p = projection([d.lng, d.lat]);
            return p ? `translate(${p[0]},${p[1]})` : 'translate(-100,-100)';
          })
          .attr('data-city', (d) => d.city)
          .style('cursor', 'pointer')
          .style('opacity', 0);

        pins
          .append('circle')
          .attr('class', 'pin-pulse')
          .attr('r', 5)
          .attr('fill', 'none')
          .attr('stroke', (d) => MAP_COUNTRY_COLOR[d.country])
          .attr('stroke-width', 1.2)
          .attr('opacity', 0.55)
          .style('animation', (d, i) => `mapPulse 2.6s ease-out ${(i % 6) * 0.35}s infinite`);

        pins
          .append('circle')
          .attr('class', 'pin-dot')
          .attr('r', 5)
          .attr('fill', (d) => MAP_COUNTRY_COLOR[d.country])
          .attr('stroke', '#0B1F16')
          .attr('stroke-width', 1);

        pins.transition().delay((d, i) => i * 45).duration(350).style('opacity', 1);

        pins.on('mouseenter', function (event, d) {
          const wrapRect = wrapRef.current.getBoundingClientRect();
          const circle = this.querySelector('.pin-dot');
          const cRect = circle.getBoundingClientRect();
          const matchInfo = findCityInfo(d.city);
          const value = matchInfo ? matchInfo.info.estValue : '';
          setTooltip({
            x: cRect.left - wrapRect.left + cRect.width / 2,
            y: cRect.top - wrapRect.top,
            city: d.city,
            match: d.match,
            venue: d.venue,
            value,
          });
          d3.select(this).select('.pin-dot').transition().duration(120).attr('r', 7);
        });

        pins.on('mouseleave', function () {
          setTooltip(null);
          if (!d3.select(this).classed('selected')) {
            d3.select(this).select('.pin-dot').transition().duration(120).attr('r', 5);
          }
        });

        pins.on('click', function (event, d) {
          pinsG.selectAll('.map-pin').classed('selected', false).select('.pin-dot').attr('r', 5);
          d3.select(this).classed('selected', true).select('.pin-dot').attr('r', 7);
          onSelectCity(d.country, d.city);
        });

        // Signal that pins now exist in the DOM — the activeFilter effect
        // below is gated on this, instead of reading a stale closure value
        // captured when this effect first ran.
        setMapReady(true);
      })
      .catch(() => {
        if (!cancelled) setLoadError(true);
      });

    return () => {
      cancelled = true;
      // StrictMode mounts every component twice in development (mount →
      // cleanup → mount again) specifically to surface effect bugs like
      // this. Without clearing here, the second real mount's d3 .join()
      // would have to reconcile against leftover nodes from the first,
      // which can briefly show duplicate or stale pins.
      countriesG.selectAll('*').remove();
      pinsG.selectAll('*').remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-applies whenever the filter changes OR once the map finishes its
  // initial load — covers the case where the user changes the filter
  // before the topology fetch has resolved.
  useEffect(() => {
    if (!mapReady) return;
    const svg = d3.select(svgRef.current);
    const pinsG = svg.select('.map-pins');
    applyFilter(pinsG, activeFilter);
  }, [activeFilter, mapReady]);

  if (loadError) {
    return (
      <div ref={revealRef} className={`map-wrap ${className}`}>
        <div className="map-error">Map data could not load — use the filters below to browse destinations instead.</div>
      </div>
    );
  }

  return (
    <div ref={revealRef} className={`map-wrap ${className}`}>
      <div className="map-svg-wrap" ref={wrapRef}>
        <svg
          ref={svgRef}
          width="100%"
          viewBox="0 0 680 460"
          role="img"
          aria-label="Map of the 16 FIFA World Cup 2026 host cities across the USA, Canada and Mexico"
        >
          <title>2026 World Cup host cities</title>
          <desc>An interactive map showing all 16 official host cities. Click any pin to open that city in the planner.</desc>
          <g className="map-countries" />
          <g className="map-pins" />
        </svg>
        {tooltip && (
          <div className="map-tooltip visible" style={{ left: tooltip.x, top: tooltip.y }}>
            <strong className="serif">{tooltip.city}</strong>
            {tooltip.match}
            <br />
            {tooltip.venue}
            {tooltip.value ? ` · from ${tooltip.value} pp` : ''}
          </div>
        )}
      </div>
      <div className="map-legend">
        <div className="map-legend-item">
          <span className="map-legend-dot" style={{ background: '#DDAE6B' }} />
          USA
        </div>
        <div className="map-legend-item">
          <span className="map-legend-dot" style={{ background: '#8FBFA3' }} />
          Canada
        </div>
        <div className="map-legend-item">
          <span className="map-legend-dot" style={{ background: '#D4537E' }} />
          Mexico
        </div>
      </div>
    </div>
  );
}

function applyFilter(pinsG, filter) {
  pinsG.selectAll('.map-pin').each(function (d) {
    const tagsMatch = filter === 'all' || cityMatchesFilter(d.city, filter);
    d3.select(this)
      .style('opacity', tagsMatch ? 1 : 0.22)
      .style('pointer-events', tagsMatch ? 'auto' : 'none');
  });
}

function cityMatchesFilter(city, filter) {
  // Mirrors the DESTINATIONS tag set used by the filter chips below the map
  const dest = DESTINATIONS.find((d) => d.city === city);
  return dest ? dest.tags.includes(filter) : false;
}
