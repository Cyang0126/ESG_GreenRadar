import DiscoveryActionRail from "./DiscoveryActionRail.jsx";
import { healthScoreFromRisk } from "../utils/formatters.js";

export default function DiscoverySignalCard({
  card,
  onOpenCompany,
  onToggleWatchlist,
}) {
  const { company } = card;
  const healthScore = healthScoreFromRisk(company.deteriorationScore);
  const signalToneLabel =
    card.signal === "red"
      ? "Critical update"
      : card.signal === "watch"
        ? "Watch update"
        : "Stable update";
  const previousSignalLabel = card.previousSignal ? card.previousSignal.toUpperCase() : "N/A";
  const evidenceConfidenceScore = Math.max(
    0,
    Math.min(100, Math.round(company.evidenceConfidenceOverall ?? 0))
  );

  return (
    <article className={`discovery-snap-card discovery-${card.signal}`}>
      <div className="discovery-card-sheen" aria-hidden="true" />
      <div className="discovery-card-top">
        <div>
          <p className="eyebrow">{card.cardType.replaceAll("-", " ")}</p>
          <h2>{company.name}</h2>
          <span>
            {company.ticker} - Health {healthScore}/100
          </span>
        </div>
        <div className="company-logo-mark" aria-label={`${company.name} logo mark`}>
          {company.ticker.replace(".SI", "").slice(0, 2)}
        </div>
      </div>

      <div className={`discovery-score-orb orb-${card.signal}`}>
        <span>{healthScore}</span>
        <strong>{card.signal.toUpperCase()}</strong>
        {card.previousSignal !== card.signal && <small>from {previousSignalLabel}</small>}
      </div>

      <DiscoveryActionRail
        company={company}
        onOpenCompany={onOpenCompany}
        onToggleWatchlist={onToggleWatchlist}
      />

      <div className="discovery-caption">
        <div className="discovery-status-row">
          <div className="confidence-chip">
            {card.rankingReason} - {card.evidenceConfidence} confidence
          </div>
          <div className="discovery-tone-chip">{signalToneLabel}</div>
        </div>
        <h3>{card.headline}</h3>
        <p>{card.summary}</p>
        <div className="mini-score">
          <span>Material ESG risk</span>
          <strong>{Math.round(company.materialityScore)}</strong>
        </div>
        <div className="discovery-progress">
          <span className="discovery-progress-label">Signal depth</span>
          <div className="discovery-progress-track" aria-hidden="true">
            <span
              className={`discovery-progress-fill discovery-progress-${card.signal}`}
              style={{ width: `${Math.max(18, evidenceConfidenceScore)}%` }}
            />
          </div>
          <div className="discovery-progress-meta">
            <span>
              {previousSignalLabel} to {card.signal.toUpperCase()}
            </span>
            <strong>{evidenceConfidenceScore}% evidence confidence</strong>
          </div>
        </div>
        <button className="primary-button" onClick={() => onOpenCompany(card.ticker)}>
          {card.primaryCta}
        </button>
      </div>
    </article>
  );
}
