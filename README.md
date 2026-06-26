# GTG World Cup 2026 — Trip Planner

A luxury golf trip planner built for Golf Travel Group, designed around the 2026 FIFA World Cup. Clients pick a host city, choose golf courses, and receive a fully AI-generated 3-day itinerary combining the match experience with bespoke golf travel.

**Live site:** [gtgplanner.vercel.app](https://gtgplanner.vercel.app)

---

## What it does

1. **Explore host cities** — an interactive map shows all 16 World Cup 2026 host cities across the USA, Canada, and Mexico
2. **Pick a city & match** — select a fixture and see the stadium, estimated trip value, and flight cost from the UK
3. **Choose golf courses** — real courses near each host city are fetched and displayed with photos from Google Places
4. **Generate an itinerary** — an AI (Groq / LLaMA) writes a personalised 3-day luxury itinerary combining golf and the match
5. **Email the itinerary** — send the full trip plan directly to a client's inbox via SendGrid
6. **Compare & save** — compare multiple trip options side by side and review session history

---

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React 19 + Vite |
| Map | D3.js + TopoJSON |
| Automation | n8n (self-hosted via Docker) |
| AI | Groq — LLaMA 3.3 70B |
| Photos | Google Places API (New) |
| Email | SendGrid |
| Tunnel | ngrok (exposes local n8n publicly) |
| Hosting | Vercel |
| Source | GitHub — [lowkeyarms27/gtg-trip-planner-react](https://github.com/lowkeyarms27/gtg-trip-planner-react) |

---

## How it's connected

```
Browser (Vercel)
    │
    ├── Courses webhook  ──────────────────┐
    ├── Itinerary webhook ─────────────────┤
    ├── Email webhook ─────────────────────┤──► ngrok tunnel ──► n8n (local Docker)
    ├── Log webhook ───────────────────────┤         │
    └── Photos webhook ─────────────────────┘         ├── Calls Google Places API
                                                      ├── Calls Groq AI
                                                      └── Calls SendGrid
```

All API keys and credentials live inside n8n — nothing sensitive is exposed to the browser.

---

## Running locally

**Requirements:** Node 18+, Docker Desktop

```bash
# 1. Clone the repo
git clone https://github.com/lowkeyarms27/gtg-trip-planner-react.git
cd gtg-trip-planner-react

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
# Opens at http://localhost:5173
```

The app works without any webhooks — just tick **"Use sample data"** in Connection Settings to see the full flow with mock data.

---

## n8n workflows

All automation workflows are in the `n8n-workflows/` folder. Import them directly into your n8n instance:

| File | What it does |
|---|---|
| `gtg-enhanced-itinerary-groq.json` | Generates the 3-day itinerary using Groq AI |
| `gtg-airtable-lead-logger.json` | Logs each itinerary to Airtable / Sheets / Discord |
| `gtg-send-email-sendgrid.json` | Sends the itinerary to a client via SendGrid |
| `gtg-course-photo-proxy.json` | Proxies Google Places photo requests (keeps API key server-side) |

---

## Connection Settings

The settings panel in the app nav shows all configured webhook URLs. On the live site these are locked — only the account owner can change them via the Vercel dashboard environment variables.

| Vercel env var | Purpose |
|---|---|
| `VITE_COURSES_WEBHOOK_URL` | n8n endpoint that returns golf courses near a city |
| `VITE_ITINERARY_WEBHOOK_URL` | n8n endpoint that generates the AI itinerary |
| `VITE_SEND_EMAIL_WEBHOOK_URL` | n8n endpoint that sends the itinerary email |
| `VITE_AIRTABLE_WEBHOOK_URL` | n8n endpoint that logs the lead |
| `VITE_PHOTOS_WEBHOOK_URL` | n8n endpoint that proxies Google Places photos |
| `VITE_GOOGLE_MAPS_API_KEY` | Google Places API (New) key for course photos |

---

## Deploying changes

```bash
# Build
npm run build

# Deploy to Vercel
vercel --prod
```

Changes pushed to the `master` branch on GitHub trigger an automatic Vercel deployment.
