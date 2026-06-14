import DiscoveryActionRail from "./DiscoveryActionRail.jsx";
import { healthScoreFromRisk } from "../utils/formatters.js";

export default function DiscoverySignalCard({
  card,
  onOpenCompany,
  onToggleWatchlist,
}) {
  const { company } = card;
  const healthScore = healthScoreFromRisk(company.deteriorationScore);
  const signalChanged = card.previousSignal !== card.signal;
  const signalToneLabel = signalChanged
    ? card.signal === "red"
      ? "Critical update"
      : card.signal === "watch"
        ? "Watch update"
        : "Green update"
    : "Stable update";
  const previousSignalLabel = card.previousSignal ? card.previousSignal.toUpperCase() : "N/A";

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
        {signalChanged && <small>from {previousSignalLabel}</small>}
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
          <span>Material risk</span>
          <strong>{Math.round(company.materialityScore)}</strong>
        </div>
        <button className="primary-button" onClick={() => onOpenCompany(card.ticker)}>
          {card.primaryCta}
        </button>
      </div>
    </article>
  );
}
