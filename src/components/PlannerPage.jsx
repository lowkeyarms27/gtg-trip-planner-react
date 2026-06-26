import { useState, useEffect } from 'react';
import WizardSteps from './planner/WizardSteps';
import HistoryPanel from './planner/HistoryPanel';
import CitySelector from './planner/CitySelector';
import CourseSelector from './planner/CourseSelector';
import ActivationResult from './planner/ActivationResult';
import WeatherWidget from './planner/WeatherWidget';
import CompareTray from './planner/CompareTray';
import CompareView from './planner/CompareView';
import { CITY_DATA, findCityInfo } from '../data/cityData';
import { fetchCourses, buildItinerary, normaliseResponse, logToAirtable } from '../lib/api';
import { useSessionHistory } from '../hooks/useSessionHistory';
import { useCompareTrips } from '../hooks/useCompareTrips';

export default function PlannerPage({ initialCountry, initialCity }) {
  const [country, setCountry] = useState(initialCountry || '');
  const [city, setCity] = useState(initialCity || '');
  const [step, setStep] = useState(1);

  const [courses, setCourses] = useState(null);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [selectedCourses, setSelectedCourses] = useState([]);

  const [activationData, setActivationData] = useState(null);
  const [building, setBuilding] = useState(false);
  const [buildError, setBuildError] = useState(null);
  const [statusMessage, setStatusMessage] = useState(null);

  const [weatherContext, setWeatherContext] = useState(null);

  const { history, push: pushHistory } = useSessionHistory();
  const compare = useCompareTrips();

  const cityInfo = country && city ? CITY_DATA[country]?.find((c) => c.city === city) : null;

  // If a city was pre-selected from the landing page, kick off the course
  // search automatically so the click-through feels immediate.
  useEffect(() => {
    if (initialCountry && initialCity) {
      handleFindCourses(initialCountry, initialCity);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function resetFromStep1() {
    setCourses(null);
    setSelectedCourses([]);
    setActivationData(null);
    setBuildError(null);
    setStep(1);
  }

  function handleCountryChange(value) {
    setCountry(value);
    setCity('');
    resetFromStep1();
  }

  function handleCityChange(value) {
    setCity(value);
    setWeatherContext(null);
    resetFromStep1();
  }

  function showTransientStatus(text, ms = 2600) {
    setStatusMessage(text);
    setTimeout(() => setStatusMessage(null), ms);
  }

  async function handleFindCourses(countryArg, cityArg) {
    const c = countryArg || country;
    const ci = cityArg || city;
    if (!c || !ci) {
      showTransientStatus('Please select a country and city first.');
      return;
    }
    setLoadingCourses(true);
    setCourses(null);
    setSelectedCourses([]);
    try {
      const result = await fetchCourses(c, ci);
      setCourses(result);
      setStep(2);
    } catch (err) {
      showTransientStatus(`Couldn't fetch courses (${err.message})`);
      setCourses([]);
    } finally {
      setLoadingCourses(false);
    }
  }

  function toggleCourse(name) {
    setSelectedCourses((prev) => {
      if (prev.includes(name)) return prev.filter((n) => n !== name);
      if (prev.length >= 2) return prev;
      return [...prev, name];
    });
  }

  async function handleBuildItinerary() {
    if (!cityInfo || selectedCourses.length === 0) {
      showTransientStatus('Select at least one course first.');
      return;
    }
    setBuilding(true);
    setBuildError(null);
    try {
      const raw = await buildItinerary(country, cityInfo, selectedCourses, weatherContext);
      const normalised = normaliseResponse(raw, country, cityInfo, selectedCourses);
      setActivationData(normalised);
      pushHistory(normalised);
      logToAirtable(normalised);
      setStep(4);
    } catch (err) {
      setBuildError(err.message);
    } finally {
      setBuilding(false);
    }
  }

  function handleReopenHistory(index) {
    setActivationData(history[index]);
    setStep(4);
  }

  return (
    <div className="view-planner">
      <main className="planner-main">
        <div className="section-head">
          <div className="section-label">— HOW IT WORKS</div>
          <h2 className="serif">
            Three fields. <em>One drafted trip.</em>
          </h2>
          <p>
            Select a host nation and city — we'll pair the fixture with nearby courses and draft a three-day
            itinerary, the same way every activation in the GTG ecosystem moves from brief to booking.
          </p>
        </div>

        <HistoryPanel history={history} onReopen={handleReopenHistory} />

        <WizardSteps step={step} />

        <CitySelector
          country={country}
          city={city}
          onCountryChange={handleCountryChange}
          onCityChange={handleCityChange}
          cityInfo={cityInfo}
          onFindCourses={() => handleFindCourses()}
          loading={loadingCourses}
        />

        <WeatherWidget city={city} onWeatherLoaded={setWeatherContext} />

        {statusMessage && (
          <div className="status-row visible">
            <div className="spinner" />
            <span>{statusMessage}</span>
          </div>
        )}

        <CourseSelector
          courses={courses}
          loadingCourses={loadingCourses}
          selected={selectedCourses}
          onToggle={toggleCourse}
          onBuild={handleBuildItinerary}
          building={building}
        />

        {!activationData && !building && !buildError && step < 2 && (
          <div className="empty-state">
            <div className="empty-state-eyebrow">Awaiting selection</div>
            <p>
              Choose a host country and city above to generate a bespoke three-day itinerary, drafted the same way
              every GTG activation moves from brief to booking.
            </p>
          </div>
        )}

        <ActivationResult
          data={activationData}
          loading={building}
          error={buildError}
          onSaveToCompare={compare.save}
        />

        <CompareTray
          savedTrips={compare.savedTrips}
          onRemove={compare.remove}
          onClear={compare.clear}
          onOpenCompare={compare.openCompare}
        />

        {compare.isCompareOpen && (
          <CompareView savedTrips={compare.savedTrips} onRemove={compare.remove} onClose={compare.closeCompare} />
        )}
      </main>
    </div>
  );
}
