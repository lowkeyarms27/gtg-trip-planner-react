import { useState } from 'react';
import CoursePhotoStrip from './CoursePhotoStrip';
import { formatItineraryAsText, formatItineraryForClient } from '../../lib/format';
import { HOTEL_DATA } from '../../data/cityData';
import { config } from '../../config';

const DAY_MARKERS = ['I', 'II', 'III', 'IV', 'V'];

function ActivationSkeleton() {
  return (
    <div className="skeleton-activation">
      <div className="skeleton-head">
        <div className="skeleton" style={{ height: 11, width: '30%', marginBottom: 12, background: 'rgba(255,255,255,0.1)' }} />
        <div className="skeleton" style={{ height: 28, width: '50%', marginBottom: 16, background: 'rgba(255,255,255,0.1)' }} />
        <div className="sk-row">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="skeleton" style={{ height: 14, width: 90, background: 'rgba(255,255,255,0.1)' }} />
          ))}
        </div>
      </div>
      <div className="skeleton-body">
        {Array.from({ length: 3 }).map((_, i) => (
          <div className="sk-day" key={i}>
            <div className="skeleton sk-day-num" />
            <div className="sk-day-lines">
              <div className="skeleton sk-line" style={{ width: '40%', height: 14, marginBottom: 12 }} />
              <div className="skeleton sk-line" style={{ marginBottom: 8 }} />
              <div className="skeleton sk-line" style={{ width: '70%' }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Stars({ count }) {
  return (
    <span className="hotel-stars">
      {Array.from({ length: count }).map((_, i) => <span key={i}>★</span>)}
    </span>
  );
}

export default function ActivationResult({ data, loading, error, onSaveToCompare }) {
  const [copyFeedback, setCopyFeedback] = useState('Copy itinerary');
  const [saveFeedback, setSaveFeedback] = useState('Save to compare');
  const [emailPanelOpen, setEmailPanelOpen] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState('');
  const [sendStatus, setSendStatus] = useState(null);
  const [sending, setSending] = useState(false);

  if (loading) {
    return (
      <div className="result visible">
        <div className="activation-card">
          <ActivationSkeleton />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="result visible">
        <div className="activation-card">
          <div className="activation-head" style={{ background: '#3A1F1F' }}>
            <div className="activation-tag" style={{ color: '#E8A0A0' }}>Couldn't build itinerary</div>
            <div className="activation-title" style={{ fontSize: '1.5rem' }}>{error}</div>
          </div>
          <div className="activation-foot">
            Check that the n8n workflow is active and the webhook URL is correct, then try again.
          </div>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const hotels = HOTEL_DATA[data.city] || [];

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(formatItineraryAsText(data));
      flash(setCopyFeedback, 'Copied ✓', 'Copy itinerary');
    } catch {
      flash(setCopyFeedback, 'Could not copy', 'Copy itinerary');
    }
  }

  function handlePDF() {
    window.print();
  }

  async function handleSendEmail() {
    if (!recipientEmail.trim()) return;

    const webhookUrl = config.sendEmailWebhookUrl;

    if (webhookUrl) {
      setSending(true);
      setSendStatus(null);
      try {
        const res = await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: recipientEmail.trim(),
            subject: `Your bespoke golf itinerary — ${data.city}, World Cup 2026`,
            body: formatItineraryForClient(data),
            itinerary: data,
          }),
        });
        setSendStatus(res.ok ? 'sent' : 'error');
      } catch {
        setSendStatus('error');
      } finally {
        setSending(false);
      }
    } else {
      // Fallback to mailto if no webhook configured
      const subject = `Your bespoke golf itinerary — ${data.city}, World Cup 2026`;
      const body = formatItineraryForClient(data);
      navigator.clipboard.writeText(body).catch(() => {});
      window.location.href = `mailto:${recipientEmail.trim()}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body.slice(0, 1500))}`;
      setSendStatus('mailto');
    }
  }

  function handleSave() {
    const result = onSaveToCompare(data);
    const messages = { saved: 'Saved ✓', duplicate: 'Already saved', full: 'Max 4 saved' };
    flash(setSaveFeedback, messages[result] || 'Saved ✓', 'Save to compare');
  }

  return (
    <div className="result visible">
      <div className="activation-card" id="print-target">
        <div className="activation-head">
          <div className="activation-tag">Bespoke Activation — Drafted</div>
          <div className="activation-title serif">
            {data.city}, <em>{data.country}</em>
          </div>
          <div className="activation-stats">
            <Stat label="Fixture" value={data.match} />
            <Stat label="Venue" value={data.venue} />
            <Stat label="Courses" value={data.courses.join(' · ')} />
            <Stat label="Est. Value (indicative)" value={`${data.estValue || '—'} pp`} />
          </div>
        </div>

        <CoursePhotoStrip courseNames={data.courses} cityName={data.city} />

        <div className="activation-body">
          {data.days.map((d, i) => (
            <div className="day-row" key={i}>
              <div className="day-marker">
                <div className="day-num serif">{DAY_MARKERS[i] || i + 1}</div>
                <div className="day-label">Day {i + 1}</div>
              </div>
              <div className="day-content">
                <h3 className="serif">{d.title}</h3>
                <p>{d.text}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Hotel Suggestions */}
        {hotels.length > 0 && (
          <div className="hotel-section">
            <div className="hotel-section-head">
              <div className="hotel-section-label">— WHERE TO STAY</div>
              <h4 className="hotel-section-title serif">Recommended <em>accommodation</em></h4>
            </div>
            <div className="hotel-grid">
              {hotels.map((hotel) => (
                <div className="hotel-card" key={hotel.name}>
                  <div className="hotel-card-top">
                    <Stars count={hotel.stars} />
                    <span className="hotel-type">{hotel.type}</span>
                  </div>
                  <div className="hotel-name">{hotel.name}</div>
                  <div className="hotel-price">From <strong>{hotel.priceFrom}</strong> / night</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer actions */}
        <div className="activation-contact">
          <div className="foot-note-inline">Drafted automatically — review and personalise before sending.</div>
          <div className="contact-actions">
            <button className="btn-small" onClick={handleSave}>{saveFeedback}</button>
            <button className="btn-small" onClick={handleCopy}>{copyFeedback}</button>
            <button className="btn-small" onClick={handlePDF}>Download PDF</button>
            <button
              className={`btn-small filled ${emailPanelOpen ? 'active' : ''}`}
              onClick={() => { setEmailPanelOpen((o) => !o); setSendStatus(null); }}
            >
              Email to client
            </button>
          </div>
        </div>

        {/* Inline email panel */}
        {emailPanelOpen && (
          <div className="email-panel">
            {sendStatus === 'sent' ? (
              <div className="email-panel-success">
                <span className="email-success-icon">✓</span>
                <div>
                  <div className="email-success-title">Email sent successfully</div>
                  <div className="email-success-sub">Delivered to {recipientEmail} via SendGrid</div>
                </div>
                <button className="email-panel-reset" onClick={() => { setSendStatus(null); setRecipientEmail(''); }}>
                  Send another
                </button>
              </div>
            ) : (
              <>
                <div className="email-panel-label">
                  {config.sendEmailWebhookUrl ? 'Send directly via your n8n → SendGrid workflow' : 'Opens your mail client with the itinerary pre-filled'}
                </div>
                <div className="email-panel-row">
                  <input
                    type="email"
                    className="email-input"
                    placeholder="client@example.com"
                    value={recipientEmail}
                    onChange={(e) => setRecipientEmail(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendEmail()}
                    autoFocus
                  />
                  <button
                    className="email-send-btn"
                    onClick={handleSendEmail}
                    disabled={sending || !recipientEmail.trim()}
                  >
                    {sending ? 'Sending…' : config.sendEmailWebhookUrl ? 'Send →' : 'Open mail →'}
                  </button>
                </div>
                {sendStatus === 'error' && (
                  <div className="email-panel-error">Could not send — check your n8n webhook is active.</div>
                )}
                {sendStatus === 'mailto' && (
                  <div className="email-panel-info">Mail client opened. Full text also copied to clipboard.</div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div>
      <div className="a-stat-label">{label}</div>
      <div className="a-stat-value">{value}</div>
    </div>
  );
}

function flash(setter, message, revertTo) {
  setter(message);
  setTimeout(() => setter(revertTo), 1800);
}
