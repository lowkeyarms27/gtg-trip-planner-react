const MAX_COURSES = 2;

export default function CourseSelector({ courses, loadingCourses, selected, onToggle, onBuild, building }) {
  if (!courses && !loadingCourses) return null;

  return (
    <div className="course-panel visible">
      <div className="course-panel-head">
        <div className="section-label">— STEP II</div>
        <h3 className="serif">Choose the courses for this trip</h3>
        <p>Select one or two real courses near the host city. We'll build the itinerary around your choice.</p>
      </div>

      <div className="course-list">
        {loadingCourses
          ? Array.from({ length: 4 }).map((_, i) => (
              <div className="skeleton-course-card" key={i}>
                <div className="skeleton" style={{ height: 16, width: '70%', marginBottom: 10 }} />
                <div className="skeleton" style={{ height: 11, width: '90%' }} />
              </div>
            ))
          : courses.length === 0
          ? (
              <div className="course-panel-empty">
                No courses found for this city yet — try again, or contact your GTG resort host for manual options.
              </div>
            )
          : courses.map((c) => {
              const isSelected = selected.includes(c.name);
              return (
                <div
                  key={c.name}
                  className={`course-card ${isSelected ? 'selected' : ''}`}
                  onClick={() => onToggle(c.name)}
                >
                  <div className="course-card-name">
                    <span>{c.name}</span>
                    <span className="course-card-check">{isSelected ? '✓' : ''}</span>
                  </div>
                  {c.address && <div className="course-card-address">{c.address}</div>}
                </div>
              );
            })}
      </div>

      {!loadingCourses && courses && courses.length > 0 && (
        <div className="course-panel-foot">
          <button className="plan-btn" onClick={onBuild} disabled={selected.length === 0 || building}>
            {building ? 'Building…' : 'Build Itinerary →'}
          </button>
        </div>
      )}
    </div>
  );
}

export { MAX_COURSES };
