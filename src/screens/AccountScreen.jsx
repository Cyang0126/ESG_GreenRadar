import { useMemo, useState } from "react";
import { getHealthBand, healthScoreFromRisk } from "../utils/formatters.js";

function getInitials(name) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function getHealthLabel(score) {
  const band = getHealthBand(score);
  if (band === "green") return "Green";
  if (band === "watch") return "Amber";
  return "Red";
}

export default function AccountScreen({
  themeMode,
  onToggleTheme,
  watchedCompanies = [],
  portfolioHealth,
  friendDirectory = [],
  friendIds = new Set(),
  onAddFriend = () => {},
}) {
  const isDarkMode = themeMode === "dark";
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
  const [friendQuery, setFriendQuery] = useState("");

  const currentFriends = useMemo(
    () =>
      friendDirectory
        .filter((friend) => friendIds.has(friend.id))
        .sort((a, b) => b.portfolioHealth - a.portfolioHealth),
    [friendDirectory, friendIds]
  );

  const suggestedFriends = useMemo(() => {
    const normalized = friendQuery.trim().toLowerCase();

    return friendDirectory.filter((friend) => {
      if (friendIds.has(friend.id)) return false;
      if (!normalized) return true;
      return (
        friend.name.toLowerCase().includes(normalized) ||
        friend.handle.toLowerCase().includes(normalized)
      );
    });
  }, [friendDirectory, friendIds, friendQuery]);

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
        <p className="friends-intro">View your circle and add more friends from the directory.</p>

        <div className="friends-list">
          {currentFriends.length > 0 ? (
            currentFriends.map((friend) => (
              <article className="friend-row" key={friend.id}>
                <div className={`friend-avatar friend-avatar-${getHealthBand(friend.portfolioHealth)}`}>
                  <span>{getInitials(friend.name)}</span>
                </div>
                <div className="friend-body">
                  <strong>{friend.name}</strong>
                  <span>{friend.handle}</span>
                </div>
                <div className="friend-score">
                  <strong>{friend.portfolioHealth}</strong>
                  <span>Health</span>
                </div>
              </article>
            ))
          ) : (
            <p className="friends-empty">No friends added yet.</p>
          )}
        </div>

        <div className="friends-search">
          <input
            className="search-input"
            placeholder="Search friends to add"
            value={friendQuery}
            onChange={(event) => setFriendQuery(event.target.value)}
          />

          <div className="friends-list">
            {suggestedFriends.length > 0 ? (
              suggestedFriends.map((friend) => (
                <article className="friend-row friend-row-add" key={friend.id}>
                  <div className={`friend-avatar friend-avatar-${getHealthBand(friend.portfolioHealth)}`}>
                    <span>{getInitials(friend.name)}</span>
                  </div>
                  <div className="friend-body">
                    <strong>{friend.name}</strong>
                    <span>{friend.handle}</span>
                  </div>
                  <button
                    className="secondary-button friend-add-button"
                    type="button"
                    onClick={() => onAddFriend(friend.id)}
                  >
                    Add
                  </button>
                </article>
              ))
            ) : (
              <p className="friends-empty">No matching friends found.</p>
            )}
          </div>
        </div>
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
