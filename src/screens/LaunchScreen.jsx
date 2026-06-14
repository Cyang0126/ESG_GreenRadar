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

export function LockScreen({ notifications = [], onStart, onOpenAlert, onDismissAlert }) {
  const now = new Date();
  const time = now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  const date = now.toLocaleDateString([], {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <section
      className="launch-screen lock-screen"
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
      <div className="lock-screen-topline">
        <span>Locked</span>
        <strong>{time}</strong>
        <small>{date}</small>
      </div>

      <div className="lock-screen-stack" aria-hidden="false">
        {notifications.length > 0 ? (
          <div className="notification-stack">
            {notifications.map((notification) => (
              <article
                className="lock-notification"
                key={notification.id}
                onClick={(event) => event.stopPropagation()}
              >
                <div className="lock-notification-body">
                  <strong>{notification.companyName}</strong>
                  <p>{notification.text}</p>
                </div>
                <div className="lock-notification-actions">
                  <button type="button" onClick={() => onOpenAlert(notification)}>
                    See Why
                  </button>
                  <button
                    type="button"
                    className="lock-notification-close"
                    onClick={() => onDismissAlert(notification.id)}
                  >
                    Close
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="lock-screen-hint">
            <img src="/logo.svg" alt="Green Radar" />
            <h2>Green Radar</h2>
            <p>Click to start</p>
          </div>
        )}
      </div>
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
        <h2>Your new brief is ready</h2>
        <p>
          AI has summarised today’s watched-company changes so you can review the
          highest-priority updates first.
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
