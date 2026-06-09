export default function PresenterControls({
  scenarios,
  activePresenterActions,
  appPhase,
  onOpenApp,
  onRunScenario,
  onGenerateDailyReport,
  onGenerateChangeReport,
  onResetDemo,
}) {
  return (
    <aside className="presenter-controls" aria-label="Presenter demo controls">
      <p className="eyebrow">Outside app UI</p>
      <h2>Presenter Controls</h2>
      <p>Demo controls are outside the mobile app so judges see a clean product experience.</p>

      <button className="open-app-button" onClick={onOpenApp}>
        {appPhase === "closed" ? "Open App" : "Restart Launch"}
      </button>

      <div className="scenario-list">
        {scenarios.map((scenario) => (
          <button
            className={activePresenterActions.has(`scenario:${scenario.id}`) ? "scenario-button active" : "scenario-button"}
            key={scenario.id}
            onClick={() => onRunScenario(scenario)}
          >
            <strong>{scenario.label}</strong>
            <span>{scenario.ticker} · {scenario.transition}</span>
            <small>{scenario.explanation}</small>
          </button>
        ))}
      </div>

      <button className="daily-report-button" onClick={onGenerateDailyReport}>
        Generate Daily Report
        <span>Create next brief</span>
      </button>

      <button
        className={activePresenterActions.has("report:forced-change") ? "daily-report-button active" : "daily-report-button"}
        onClick={onGenerateChangeReport}
      >
        Generate Change Report
        <span>Force watched changes</span>
      </button>

      <button className="reset-demo-button" onClick={onResetDemo}>
        Reset Demo
      </button>
    </aside>
  );
}
