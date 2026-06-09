import CompanyCard from "../components/CompanyCard.jsx";

export default function WatchlistScreen({ companies, onOpenCompany, onToggleWatchlist }) {
  const watched = companies
    .filter((company) => company.isWatched)
    .sort((a, b) => b.deteriorationScore - a.deteriorationScore);

  return (
    <section className="screen-stack">
      <div className="section-heading">
        <p className="eyebrow">Watchlist</p>
        <h2>Worst ESG risk first</h2>
      </div>

      {watched.length === 0 ? (
        <div className="empty-state">
          <h3>No watched companies yet</h3>
          <p>Add companies from Discovery, Search, or Company Detail.</p>
        </div>
      ) : (
        <div className="card-list">
          {watched.map((company) => (
            <div key={company.ticker}>
              <CompanyCard company={company} onOpenCompany={onOpenCompany} compact />
              <button className="link-button" onClick={() => onToggleWatchlist(company.ticker)}>
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
