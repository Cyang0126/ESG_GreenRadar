export function ClosedScreen() {
  return (
    <section className="launch-screen closed-screen">
      <img src="/logo.svg" alt="Green Radar" />
      <h2>Green Radar</h2>
      <p>Tap Open App in Presenter Controls to begin the mobile demo.</p>
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
