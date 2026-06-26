const STEPS = [
  { num: 'I', label: 'Fixture' },
  { num: 'II', label: 'Courses' },
  { num: 'III', label: 'Draft itinerary' },
];

// step: 1 = fixture active, 2 = courses active, 3 = itinerary active, 4 = all complete
export default function WizardSteps({ step }) {
  return (
    <div className="wizard-steps">
      {STEPS.map((s, i) => {
        const stepNum = i + 1;
        const isActive = stepNum === step;
        const isComplete = stepNum < step;
        return (
          <div key={s.num} className={`wizard-step ${isActive ? 'active' : ''} ${isComplete ? 'completed' : ''}`}>
            <span className="num serif">{s.num}</span> {s.label}
          </div>
        );
      })}
    </div>
  );
}
