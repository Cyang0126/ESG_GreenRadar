export function ClosedScreen({ onStart }) {
  return (
    <section
      className="launch-screen closed-screen"
      role="button"
      tabIndex={0}
      aria-label="Click to start"
      onClick={onStart}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onStart?.();
        }
      }}
    >
      <img src="/logo.svg" alt="Green Radar" />
      <h2>Green Radar</h2>
      <p>Click to start</p>
    </section>
  );
}

export function SplashScreen() {
  return (
    <section className="launch-screen splash-screen">
      <img src="/logo.svg" alt="Green Radar" />
      <h2>Green Radar</h2>
      <p>Checking watched companies...</p>
    </section>
  );
}

export function BriefPromptScreen({ onOpenBrief, onSeeLater }) {
  return (
    <section className="prompt-overlay" aria-label="Daily Brief prompt">
      <div className="prompt-card">
        <p className="eyebrow">Daily Brief</p>
        <h2>Your new ESG brief is ready</h2>
        <p>
          AI has summarised today’s watched-company changes so you can review the
          highest-priority ESG updates first.
        </p>
        <div className="prompt-actions">
          <button className="primary-button" onClick={onOpenBrief}>
            Open Brief
          </button>
          <button className="secondary-button" onClick={onSeeLater}>
            See Later
          </button>
        </div>
      </div>
    </section>
  );
}
