import { useState } from 'react';
import { config, saveConfig, IS_ENV_LOCKED } from '../config';
import { testWebhook } from '../lib/api';

export default function ConnectionSettings({ open }) {
  const [coursesUrl, setCoursesUrl] = useState(config.coursesWebhookUrl);
  const [itineraryUrl, setItineraryUrl] = useState(config.itineraryWebhookUrl);
  const [photosUrl, setPhotosUrl] = useState(config.photosWebhookUrl);
  const [googleKey, setGoogleKey] = useState(config.googleMapsApiKey);
  const [sendEmailUrl, setSendEmailUrl] = useState(config.sendEmailWebhookUrl);
  const [airtableUrl, setAirtableUrl] = useState(config.airtableWebhookUrl);
  const [useMock, setUseMock] = useState(config.useMockData);
  const [status, setStatus] = useState({ text: '', type: 'info' });
  const [testing, setTesting] = useState(false);

  const [locked, setLocked] = useState(config.settingsLocked);
  const [mode, setMode] = useState(null); // 'unlocking' | 'locking' | null
  const [pinInput, setPinInput] = useState('');
  const [newPin, setNewPin] = useState('');

  function handleUnlock() {
    if (!config.adminPin || pinInput === config.adminPin) {
      saveConfig({ settingsLocked: false });
      setLocked(false);
      setMode(null);
      setPinInput('');
      setStatus({ text: '', type: 'info' });
    } else {
      setStatus({ text: 'Incorrect PIN.', type: 'err' });
    }
  }

  function handleLock() {
    saveConfig({ settingsLocked: true, adminPin: newPin.trim() });
    setLocked(true);
    setMode(null);
    setNewPin('');
    setStatus({ text: 'Settings locked.', type: 'ok' });
  }

  async function handleSaveAndTest() {
    saveConfig({ useMockData: useMock });

    if (useMock) {
      setStatus({ text: 'Saved — using sample data.', type: 'info' });
      return;
    }

    saveConfig({
      photosWebhookUrl: photosUrl.trim(),
      googleMapsApiKey: googleKey.trim(),
      sendEmailWebhookUrl: sendEmailUrl.trim(),
      airtableWebhookUrl: airtableUrl.trim(),
    });

    if (!coursesUrl.trim() || !itineraryUrl.trim()) {
      setStatus({ text: 'Enter both the courses and itinerary webhook URLs.', type: 'err' });
      return;
    }

    saveConfig({ coursesWebhookUrl: coursesUrl.trim(), itineraryWebhookUrl: itineraryUrl.trim() });
    setTesting(true);
    setStatus({ text: 'Testing both connections…', type: 'info' });

    const [coursesResult, itineraryResult] = await Promise.all([
      testWebhook(coursesUrl.trim(), { country: 'USA', city: 'Test' }),
      testWebhook(itineraryUrl.trim(), {
        country: 'USA',
        city: 'Test',
        venue: 'Test',
        match: 'Connection test',
        selectedCourses: ['Test Course'],
      }),
    ]);

    setTesting(false);

    if (coursesResult.ok && itineraryResult.ok) {
      setStatus({ text: '✓ Both webhooks connected successfully.', type: 'ok' });
    } else {
      setStatus({
        text: `Courses: ${coursesResult.ok ? 'OK' : coursesResult.message} · Itinerary: ${
          itineraryResult.ok ? 'OK' : itineraryResult.message
        }`,
        type: 'err',
      });
    }
  }

  return (
    <div className={`connect-panel ${open ? 'open' : ''}`}>
      <div className="connect-inner">

        {/* Env-var lock — production mode, no unlock possible */}
        {IS_ENV_LOCKED && (
          <div className="connect-status connect-status--info" style={{ marginBottom: 8 }}>
            🔒 Settings are managed by the account owner via Vercel. Contact them to make changes.
          </div>
        )}

        {/* PIN lock — local dev mode only */}
        {!IS_ENV_LOCKED && (
          <div className="connect-row connect-row--toggle" style={{ marginBottom: 4 }}>
            <span className="field-label" style={{ fontWeight: 600 }}>
              {locked ? '🔒 Locked — admin only' : '🔓 Unlocked'}
            </span>
            {locked && mode !== 'unlocking' && (
              <button className="connect-save" onClick={() => { setMode('unlocking'); setStatus({ text: '', type: 'info' }); }}>
                Unlock
              </button>
            )}
            {!locked && mode !== 'locking' && (
              <button className="connect-save" onClick={() => setMode('locking')}>
                Lock Settings
              </button>
            )}
          </div>
        )}

        {/* PIN unlock prompt */}
        {mode === 'unlocking' && (
          <div className="connect-row">
            <span className="field-label">Admin PIN</span>
            <input
              type="password"
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleUnlock()}
              placeholder={config.adminPin ? 'Enter PIN' : 'No PIN set — click Unlock'}
              autoFocus
            />
            <button className="connect-save" onClick={handleUnlock} style={{ marginLeft: 8 }}>
              Unlock
            </button>
            <button className="connect-save" onClick={() => { setMode(null); setPinInput(''); }} style={{ marginLeft: 4, opacity: 0.55 }}>
              Cancel
            </button>
          </div>
        )}

        {/* PIN lock prompt */}
        {mode === 'locking' && (
          <div className="connect-row">
            <span className="field-label">Set admin PIN (leave blank for no PIN)</span>
            <input
              type="password"
              value={newPin}
              onChange={(e) => setNewPin(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLock()}
              placeholder="New PIN or leave blank"
              autoFocus
            />
            <button className="connect-save" onClick={handleLock} style={{ marginLeft: 8 }}>
              Lock & Save
            </button>
            <button className="connect-save" onClick={() => { setMode(null); setNewPin(''); }} style={{ marginLeft: 4, opacity: 0.55 }}>
              Cancel
            </button>
          </div>
        )}

        <div className="connect-row">
          <span className="field-label">Courses Webhook URL</span>
          <input
            type="text"
            value={coursesUrl}
            disabled={IS_ENV_LOCKED || locked || useMock}
            onChange={(e) => setCoursesUrl(e.target.value)}
            placeholder="https://your-instance/webhook/golf-courses"
          />
        </div>
        <div className="connect-row">
          <span className="field-label">Itinerary Webhook URL</span>
          <input
            type="text"
            value={itineraryUrl}
            disabled={IS_ENV_LOCKED || locked || useMock}
            onChange={(e) => setItineraryUrl(e.target.value)}
            placeholder="https://your-instance/webhook/golf-trip-planner"
          />
        </div>
        <div className="connect-row">
          <span className="field-label">Google Places API Key (requires "Places API (New)" enabled in Google Cloud)</span>
          <input
            type="text"
            value={googleKey}
            disabled={IS_ENV_LOCKED || locked}
            onChange={(e) => setGoogleKey(e.target.value)}
            placeholder="Paste your Google Places API Key here"
          />
        </div>
        <div className="connect-row">
          <span className="field-label">Photos Webhook URL (optional — n8n proxy for key-free browser requests)</span>
          <input
            type="text"
            value={photosUrl}
            disabled={IS_ENV_LOCKED || locked || useMock}
            onChange={(e) => setPhotosUrl(e.target.value)}
            placeholder="https://your-instance/webhook/course-photo"
          />
        </div>
        <div className="connect-row">
          <span className="field-label">Send Email Webhook URL (n8n → SendGrid)</span>
          <input
            type="text"
            value={sendEmailUrl}
            disabled={IS_ENV_LOCKED || locked || useMock}
            onChange={(e) => setSendEmailUrl(e.target.value)}
            placeholder="https://your-instance/webhook/send-itinerary-email"
          />
        </div>
        <div className="connect-row">
          <span className="field-label">Log Webhook URL (n8n → Discord / Sheets)</span>
          <input
            type="text"
            value={airtableUrl}
            disabled={IS_ENV_LOCKED || locked || useMock}
            onChange={(e) => setAirtableUrl(e.target.value)}
            placeholder="https://your-instance/webhook/log-itinerary"
          />
        </div>
        <div className="connect-row connect-row--toggle">
          <label className="toggle-label">
            <input type="checkbox" checked={useMock} disabled={IS_ENV_LOCKED || locked} onChange={(e) => setUseMock(e.target.checked)} />
            <span>Use sample data (no live workflow needed)</span>
          </label>
          <button className="connect-save" onClick={handleSaveAndTest} disabled={IS_ENV_LOCKED || locked || testing}>
            {testing ? 'Testing…' : 'Save & Test'}
          </button>
        </div>
        {status.text && <div className={`connect-status connect-status--${status.type}`}>{status.text}</div>}
      </div>
    </div>
  );
}
