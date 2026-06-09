export default function DiscoveryActionRail({
  company,
  onOpenCompany,
  onToggleWatchlist,
}) {
  return (
    <div className="discovery-action-rail" aria-label={`${company.name} actions`}>
      <button
        className={company.isWatched ? "rail-button active" : "rail-button"}
        onClick={() => onToggleWatchlist(company.ticker)}
      >
        <span>{company.isWatched ? "✓" : "+"}</span>
        <small>Watch</small>
      </button>
      <button className="rail-button" onClick={() => onOpenCompany(company.ticker)}>
        <span>↗</span>
        <small>Evidence</small>
      </button>
      <div className="rail-metric">
        <strong>{company.evidenceConfidenceOverall}%</strong>
        <small>Proof</small>
      </div>
    </div>
  );
}
