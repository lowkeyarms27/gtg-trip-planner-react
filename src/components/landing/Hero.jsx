import { useEffect, useState, useRef } from 'react';

// HD golf course photos — Wikimedia Commons originals (2000px–8000px wide)
const SLIDES = [
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/0/0d/Early_morning_at_the_Golf_Course_%2830290143146%29.jpg',
    caption: 'Dawn breaks over the fairway',
  },
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/3/3b/TPC_at_Sawgrass_%283423935615%29.jpg',
    caption: 'TPC Sawgrass — Stadium Course',
  },
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/7th_hole%2C_Pebble_Beach_Golf_Course%2C_Del_Monte%2C_Calif._LCCN98509583.jpg',
    caption: 'Pebble Beach Golf Links — 7th Hole',
  },
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/d/d0/Praia_D%27El_Rey_Golf_%26_Country_Club_-_Portugal_%284131743574%29.jpg',
    caption: 'Praia D\'El Rey Golf & Country Club — Portugal',
  },
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/b/b2/Bethpage_Golf_Course.jpg',
    caption: 'Bethpage Black — New York',
  },
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/2/24/DZ6_2470_Perfect_day_on_the_green_-_calm_skies_crisp_fairways_and_a_flag_waiting_for_the_next_putt.jpg',
    caption: 'Perfect skies, perfect fairways',
  },
];

export default function Hero({ onOpenPlanner }) {
  const [active, setActive] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setActive((i) => (i + 1) % SLIDES.length);
    }, 6000);
    return () => clearInterval(intervalRef.current);
  }, []);

  function goTo(i) {
    clearInterval(intervalRef.current);
    setActive(i);
    intervalRef.current = setInterval(() => {
      setActive((n) => (n + 1) % SLIDES.length);
    }, 6000);
  }

  return (
    <section className="hero hero--photo">
      {/* Background slideshow */}
      <div className="hero-slides">
        {SLIDES.map((slide, i) => (
          <div
            key={slide.url}
            className={`hero-slide ${i === active ? 'hero-slide--active' : ''}`}
            style={{ backgroundImage: `url(${slide.url})` }}
          />
        ))}
        <div className="hero-slide-overlay" />
      </div>

      {/* Slide indicators */}
      <div className="hero-dots">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            className={`hero-dot ${i === active ? 'hero-dot--active' : ''}`}
            onClick={() => goTo(i)}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>

      <div className="hero-inner">
        <div className="eyebrow">GTG WORLD CUP · BY GOLF TRAVEL GROUP</div>
        <h1 className="serif">
          Every fixture is a trip waiting to be built.
          <br />
          <em>We build it in seconds.</em>
        </h1>
        <p className="hero-sub">
          Select a 2026 World Cup host city. We pair the fixture with the best golf courses nearby and draft a
          three-day itinerary instantly — ready for your team to refine and send to a client.
        </p>
        <div className="hero-how">
          <div className="hero-how-step">
            <span className="serif">I</span> Pick a city
          </div>
          <div className="hero-how-arrow">→</div>
          <div className="hero-how-step">
            <span className="serif">II</span> We find the courses
          </div>
          <div className="hero-how-arrow">→</div>
          <div className="hero-how-step">
            <span className="serif">III</span> Drafted itinerary, instantly
          </div>
        </div>
        <div className="hero-ctas">
          <button className="btn-filled" onClick={onOpenPlanner}>
            Open the planner →
          </button>
        </div>
      </div>

      <div className="hero-tag">
        <span className="hero-tag-dot" /> LIVE · 2026 FIXTURE DATA
      </div>
    </section>
  );
}
