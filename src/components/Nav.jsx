export default function Nav({ view, onBack, onToggleSettings }) {
  return (
    <nav className="nav">
      <div className="nav-left">
        {view === 'planner' && (
          <>
            <button className="nav-back" onClick={onBack}>
              ← Back
            </button>
            <div className="nav-divider" />
          </>
        )}
        <div className="nav-logo serif">
          GTG <span className="nav-dot" /> <span className="nav-logo-italic">World Cup</span>
        </div>
        <div className="nav-divider" />
        <div className="nav-sub">Internal Tool</div>
      </div>
      <div className="nav-right">
        <button className="connect-toggle-nav" onClick={onToggleSettings}>
          ⚙ Connection settings
        </button>
      </div>
    </nav>
  );
}
