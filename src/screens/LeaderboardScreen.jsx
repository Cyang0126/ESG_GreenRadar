import { getHealthBand } from "../utils/formatters.js";

function getInitials(name) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export default function LeaderboardScreen({ entries = [] }) {
  const yourEntry = entries.find((entry) => entry.isYou);
  const yourRank = yourEntry ? entries.findIndex((entry) => entry.id === yourEntry.id) + 1 : 0;

  return (
    <section className="screen-stack leaderboard-screen">
      <div className="section-heading">
        <p className="eyebrow">Leaderboard</p>
        <h2>Friends only</h2>
      </div>

      <section className="panel leaderboard-hero">
        <p>
          Compare portfolio health with your friends only. No public rankings, no strangers, just
          the circle you added.
        </p>
        <div className="leaderboard-summary">
          <div>
            <span>Your rank</span>
            <strong>{yourRank ? `#${yourRank}` : "--"}</strong>
          </div>
          <div>
            <span>Friends tracked</span>
            <strong>{Math.max(0, entries.length - 1)}</strong>
          </div>
        </div>
      </section>

      <section className="panel">
        <h3>Ranked by Portfolio Health</h3>
        <div className="leaderboard-list">
          {entries.map((entry, index) => {
            const band = getHealthBand(entry.portfolioHealth);

            return (
              <article className={`leaderboard-row${entry.isYou ? " leaderboard-row-you" : ""}`} key={entry.id}>
                <div className="leaderboard-rank">#{index + 1}</div>
                <div className={`leaderboard-avatar leaderboard-avatar-${band}`}>
                  <span>{getInitials(entry.name)}</span>
                </div>
                <div className="leaderboard-body">
                  <strong>{entry.name}</strong>
                  <span>{entry.handle}</span>
                </div>
                <div className="leaderboard-score">
                  <strong>{entry.portfolioHealth}/100</strong>
                  <div className="leaderboard-track" aria-label={`${entry.name} portfolio health ${entry.portfolioHealth} out of 100`}>
                    <div
                      className={`score-fill score-fill-${band} leaderboard-fill`}
                      style={{ width: `${Math.max(0, Math.min(100, entry.portfolioHealth))}%` }}
                    />
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </section>
  );
}
