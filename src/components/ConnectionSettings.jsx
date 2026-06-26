import { useState } from 'react';
import { config, saveConfig } from '../config';
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
        <div className="connect-row">
          <span className="field-label">Courses Webhook URL</span>
          <input
            type="text"
            value={coursesUrl}
            disabled={useMock}
            onChange={(e) => setCoursesUrl(e.target.value)}
            placeholder="https://your-instance/webhook/golf-courses"
          />
        </div>
        <div className="connect-row">
          <span className="field-label">Itinerary Webhook URL</span>
          <input
            type="text"
            value={itineraryUrl}
            disabled={useMock}
            onChange={(e) => setItineraryUrl(e.target.value)}
            placeholder="https://your-instance/webhook/golf-trip-planner"
          />
        </div>
        <div className="connect-row">
          <span className="field-label">Google Places API Key (requires "Places API (New)" enabled in Google Cloud)</span>
          <input
            type="text"
            value={googleKey}
            onChange={(e) => setGoogleKey(e.target.value)}
            placeholder="Paste your Google Maps API Key here"
          />
        </div>
        <div className="connect-row">
          <span className="field-label">Photos Webhook URL (optional — n8n proxy for key-free browser requests)</span>
          <input
            type="text"
            value={photosUrl}
            disabled={useMock}
            onChange={(e) => setPhotosUrl(e.target.value)}
            placeholder="https://your-instance/webhook/course-photo"
          />
        </div>
        <div className="connect-row">
          <span className="field-label">Send Email Webhook URL (n8n → SendGrid)</span>
          <input
            type="text"
            value={sendEmailUrl}
            disabled={useMock}
            onChange={(e) => setSendEmailUrl(e.target.value)}
            placeholder="https://your-instance/webhook/send-itinerary-email"
          />
        </div>
        <div className="connect-row">
          <span className="field-label">Log Webhook URL (n8n → Discord / Sheets)</span>
          <input
            type="text"
            value={airtableUrl}
            disabled={useMock}
            onChange={(e) => setAirtableUrl(e.target.value)}
            placeholder="https://your-instance/webhook/log-itinerary"
          />
        </div>
        <div className="connect-row connect-row--toggle">
          <label className="toggle-label">
            <input type="checkbox" checked={useMock} onChange={(e) => setUseMock(e.target.checked)} />
            <span>Use sample data (no live workflow needed)</span>
          </label>
          <button className="connect-save" onClick={handleSaveAndTest} disabled={testing}>
            {testing ? 'Testing…' : 'Save & Test'}
          </button>
        </div>
        {status.text && <div className={`connect-status connect-status--${status.type}`}>{status.text}</div>}
      </div>
    </div>
  );
}
