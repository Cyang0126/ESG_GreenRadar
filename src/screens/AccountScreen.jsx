import { getHealthBand, healthScoreFromRisk } from "../utils/formatters.js";

function getHealthLabel(score) {
  const band = getHealthBand(score);
  if (band === "green") return "Green";
  if (band === "watch") return "Amber";
  return "Red";
}

function buildActivityPath(series, width, height, baseline) {
  return series
    .map((value, index) => {
      const x = (index / (series.length - 1)) * width;
      const y = baseline - value;
      return `${index === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");
}

export default function AccountScreen({
  themeMode,
  onToggleTheme,
  watchedCompanies = [],
  portfolioHealth,
  friendCount = 0,
  onOpenFriends = () => {},
}) {
  const isDarkMode = themeMode === "dark";
  const activitySeries = [28, 34, 31, 46, 44, 52, 49, 63, 57, 66, 72, 68];
  const activityPath = buildActivityPath(activitySeries, 320, 120, 104);
  const activityStats = [
    { label: "Watched posts", value: 18 },
    { label: "Reports read", value: 11 },
    { label: "Alerts reviewed", value: 6 },
  ];
  const resolvedPortfolioHealth =
    portfolioHealth ??
    (watchedCompanies.length > 0
      ? Math.round(
          watchedCompanies.reduce(
            (total, company) => total + healthScoreFromRisk(company.deteriorationScore),
            0
          ) / watchedCompanies.length
        )
      : null);
  const portfolioLabel =
    resolvedPortfolioHealth === null ? "No watchlist" : getHealthLabel(resolvedPortfolioHealth);
  const portfolioBand = resolvedPortfolioHealth === null ? "empty" : getHealthBand(resolvedPortfolioHealth);
  const portfolioVisualBand = portfolioBand === "watch" ? "amber" : portfolioBand;

  return (
    <section className="screen-stack">
      <div className="section-heading">
        <p className="eyebrow">Account</p>
        <h2>Your profile</h2>
      </div>

      <section className="panel account-hero">
        <div className="account-hero-visuals" aria-hidden="true">
          <div className="account-avatar">
            <span className="account-avatar-head" />
            <span className="account-avatar-body" />
          </div>
          <div className="account-streak" aria-label="7 day streak">
            <span>7</span>
          </div>
        </div>
        <div>
          <h3>Guest User</h3>
          <p>Hackathon demo account</p>
        </div>
      </section>

      <section className="panel">
        <h3>Portfolio Health</h3>
        {resolvedPortfolioHealth === null ? (
          <div className="portfolio-empty">
            <div className="portfolio-orbital portfolio-orbital-empty" aria-hidden="true">
              <div className="portfolio-orbital-ring">
                <div className="portfolio-orbital-core">
                  <strong>--</strong>
                  <span>No watchlist</span>
                </div>
              </div>
            </div>
            <strong>No companies on watchlist</strong>
            <p>Add companies from Discovery, Search, or Company Detail to see portfolio health.</p>
          </div>
        ) : (
          <div
            className="portfolio-health-card"
            style={{ "--portfolio-progress": `${resolvedPortfolioHealth}%` }}
          >
            <div
              className={`portfolio-orbital portfolio-${portfolioVisualBand}`}
              aria-label={`Portfolio health ${resolvedPortfolioHealth} out of 100`}
            >
              <div className="portfolio-orbital-ring">
                <span className="portfolio-orbital-mark portfolio-orbital-mark-top" />
                <span className="portfolio-orbital-mark portfolio-orbital-mark-right" />
                <span className="portfolio-orbital-mark portfolio-orbital-mark-bottom" />
                <div className="portfolio-orbital-core">
                  <strong>{resolvedPortfolioHealth}</strong>
                  <span>Portfolio ESG</span>
                </div>
              </div>
            </div>
            <div className={`portfolio-health-pill health-${portfolioLabel.toLowerCase().replace(/ /g, "-")}`}>
              {portfolioLabel}
            </div>
            <ul className="portfolio-health-notes">
              <li>Overall Portfolio ESG Score (0-100) shown as a large orbital indicator.</li>
              <li>Colour coded: green above 70, amber 40-70, red below 40.</li>
            </ul>
            <div className="portfolio-activity-card">
              <div className="portfolio-activity-head">
                <span>Activity</span>
                <strong>Last 12 weeks</strong>
              </div>
              <svg
                className="portfolio-activity-chart"
                viewBox="0 0 320 120"
                role="img"
                aria-label="Fake portfolio activity line graph"
              >
                <defs>
                  <linearGradient id="activityGradient" x1="0" x2="1" y1="0" y2="0">
                    <stop offset="0%" stopColor="var(--red)" />
                    <stop offset="50%" stopColor="var(--watch)" />
                    <stop offset="100%" stopColor="var(--green)" />
                  </linearGradient>
                  <linearGradient id="activityFill" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="rgba(37, 244, 238, 0.24)" />
                    <stop offset="100%" stopColor="rgba(37, 244, 238, 0)" />
                  </linearGradient>
                </defs>
                <line x1="0" y1="102" x2="320" y2="102" className="portfolio-activity-baseline" />
                <line x1="0" y1="70" x2="320" y2="70" className="portfolio-activity-grid" />
                <line x1="0" y1="38" x2="320" y2="38" className="portfolio-activity-grid" />
                <path
                  d={activityPath}
                  fill="none"
                  stroke="url(#activityGradient)"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d={`${activityPath} L 320 112 L 0 112 Z`}
                  fill="url(#activityFill)"
                  opacity="0.95"
                />
              {activitySeries.map((value, index) => {
                  const x = (index / (activitySeries.length - 1)) * 320;
                  const y = 104 - value;
                  return <circle key={index} cx={x} cy={y} r="3.5" className="portfolio-activity-dot" />;
                })}
              </svg>
              <div className="portfolio-activity-stats">
                {activityStats.map((stat) => (
                  <div key={stat.label} className="portfolio-activity-stat">
                    <strong>{stat.value}</strong>
                    <span>{stat.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <p className="portfolio-health-note">
              Based on {watchedCompanies.length} watched {watchedCompanies.length === 1 ? "company" : "companies"}.
            </p>
          </div>
        )}
      </section>

      <section className="panel">
        <h3>Account Details</h3>
        <div className="account-list">
          <div className="account-row">
            <span>Email</span>
            <strong>demo@greenradar.app</strong>
          </div>
          <div className="account-row">
            <span>Plan</span>
            <strong>Demo Access</strong>
          </div>
          <div className="account-row">
            <span>Location</span>
            <strong>Singapore</strong>
          </div>
        </div>
      </section>

      <section className="panel">
        <h3>Badges</h3>
        <div className="account-badges">
          <article className="account-badge">
            <div className="account-badge-mark">30</div>
            <div>
              <strong>30 Day Green Run</strong>
              <p>Unlocked for 30 consecutive days with a green portfolio score.</p>
            </div>
          </article>
          <article className="account-badge">
            <div className="account-badge-mark">60</div>
            <div>
              <strong>60 Day Green Run</strong>
              <p>Unlocked for 60 consecutive days with a green portfolio score.</p>
            </div>
          </article>
        </div>
      </section>

      <section className="panel">
        <h3>Friends</h3>
        <p className="friends-intro">
          Open your friends page to view your circle and search the directory.
        </p>
        <button className="secondary-button friends-page-button" type="button" onClick={onOpenFriends}>
          Open Friends List
        </button>
        <p className="friends-page-note">
          {friendCount} friend{friendCount === 1 ? "" : "s"} connected
        </p>
      </section>

      <section className="panel">
        <h3>Quick Settings</h3>
        <div className="account-actions">
          <div className="theme-toggle-row">
            <div>
              <span>Appearance</span>
              <strong>{isDarkMode ? "Dark Mode" : "Light Mode"}</strong>
            </div>
            <button
              className="theme-toggle"
              type="button"
              role="switch"
              aria-checked={isDarkMode}
              aria-label="Toggle light and dark mode"
              onClick={onToggleTheme}
            >
              <span className={`theme-toggle-thumb${isDarkMode ? " on" : ""}`} />
            </button>
          </div>
          <button className="secondary-button" type="button">
            Edit Profile
          </button>
          <button className="secondary-button" type="button">
            Notification Preferences
          </button>
          <button className="secondary-button" type="button">
            Privacy and Security
          </button>
        </div>
      </section>

      <section className="panel">
        <h3>About This Demo</h3>
        <p>
          Green Radar uses a single ESG signal engine to surface watchlist changes, daily
          briefings, and evidence-backed alerts.
        </p>
      </section>
    </section>
  );
}
