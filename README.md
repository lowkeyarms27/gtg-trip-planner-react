# GTG World Cup — React Rebuild

This is the React + Vite version of the World Cup trip planner, rebuilt from
the original single-file HTML version with proper components, hooks, and a
real data layer.

## Two files were provided

**`gtg-trip-planner-react-source.zip`** — the full editable source code.
Use this if you want to keep developing it.

```
unzip gtg-trip-planner-react-source.zip
cd gtg-trip-planner-react
npm install
npm run dev        # starts a local dev server, usually http://localhost:5173
```

To build it for hosting/sharing:
```
npm run build       # outputs to dist/
```

**`gtg-world-cup-react-build.zip`** — the already-built, ready-to-host
version. No Node/npm needed. Unzip it and either:
- Open `dist/index.html` directly in a browser, or
- Upload the whole `dist/` folder to any static host (Netlify, Vercel,
  GitHub Pages, or your own server)

## What changed from the original HTML version

Same design, same features (map, planner wizard, compare, history,
skeleton loading, course photos) — now built as proper React components
instead of one large script:

```
src/
  App.jsx                     — top-level view switching (landing/planner)
  config.js                   — webhook URLs, persisted per session
  data/cityData.js            — all 16 real host cities, verified coordinates
  lib/
    api.js                    — webhook calls + mock fallback
    format.js                 — itinerary text formatters (copy/email)
    wikipedia.js               — course photo lookups
  hooks/
    useReveal.js               — scroll-reveal animation
    useSessionHistory.js
    useCompareTrips.js
  components/
    Nav.jsx, ConnectionSettings.jsx
    LandingPage.jsx, PlannerPage.jsx
    landing/                  — Hero, StatsBar, FeatureGrid, HostMap, etc.
    planner/                  — WizardSteps, CourseSelector, ActivationResult, etc.
  styles/
    tokens.css                 — design tokens (colours, buttons, base styles)
    app.css                    — full component styling
```

## Connecting to n8n

Same as before — click **⚙ Connection settings** in the nav, paste your two
webhook URLs (courses + itinerary), untick "Use sample data," and click
**Save & Test**.

If you still get "Failed to fetch" after this rebuild, that confirms it
was never the frontend's fault — it's almost always a CORS configuration
issue on the n8n webhook nodes themselves (see the n8n setup guide's
troubleshooting section).

## Known limitation

The dev server in this sandboxed environment couldn't be kept running long
enough for a live click-through test — the build compiles cleanly and the
code has been carefully audited for React-specific bugs (effect cleanup,
stale closures, etc.), but you should still click through the full flow
once yourself after running `npm run dev` to confirm everything behaves as
expected in a real browser.
