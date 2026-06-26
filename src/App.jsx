import { useState } from 'react';
import Nav from './components/Nav';
import ConnectionSettings from './components/ConnectionSettings';
import LandingPage from './components/LandingPage';
import PlannerPage from './components/PlannerPage';

export default function App() {
  const [view, setView] = useState('landing');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [initialCity, setInitialCity] = useState({ country: null, city: null });
  const [plannerKey, setPlannerKey] = useState(0);

  function openPlannerWithCity(country, city) {
    setInitialCity({ country, city });
    setPlannerKey((k) => k + 1); // force remount so PlannerPage re-initialises cleanly
    setView('planner');
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  function backToLanding() {
    setView('landing');
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  return (
    <>
      <Nav view={view} onBack={backToLanding} onToggleSettings={() => setSettingsOpen((o) => !o)} />
      <ConnectionSettings open={settingsOpen} />

      {view === 'landing' ? (
        <LandingPage onSelectCity={openPlannerWithCity} />
      ) : (
        <PlannerPage key={plannerKey} initialCountry={initialCity.country} initialCity={initialCity.city} />
      )}
    </>
  );
}
