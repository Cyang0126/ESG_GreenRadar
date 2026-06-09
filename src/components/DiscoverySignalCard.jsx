import DiscoveryActionRail from "./DiscoveryActionRail.jsx";
import { healthScoreFromRisk } from "../utils/formatters.js";

export default function DiscoverySignalCard({
  card,
  onOpenCompany,
  onToggleWatchlist,
}) {
  const { company } = card;
  const healthScore = healthScoreFromRisk(company.deteriorationScore);

  return (
    <article className={`discovery-snap-card discovery-${card.signal}`}>
      <div className="discovery-card-top">
        <div>
          <p className="eyebrow">{card.cardType.replaceAll("-", " ")}</p>
          <h2>{company.name}</h2>
          <span>{company.ticker} · Health {healthScore}/100</span>
        </div>
        <div className="company-logo-mark" aria-label={`${company.name} logo mark`}>
          {company.ticker.replace(".SI", "").slice(0, 2)}
        </div>
      </div>

      <div className={`discovery-score-orb orb-${card.signal}`}>
        <span>{healthScore}</span>
        <strong>{card.signal.toUpperCase()}</strong>
        {card.previousSignal !== card.signal && (
          <small>from {card.previousSignal.toUpperCase()}</small>
        )}
      </div>

      <DiscoveryActionRail
        company={company}
        onOpenCompany={onOpenCompany}
        onToggleWatchlist={onToggleWatchlist}
      />

      <div className="discovery-caption">
        <div className="confidence-chip">{card.rankingReason} · {card.evidenceConfidence} confidence</div>
        <h3>{card.headline}</h3>
        <p>{card.summary}</p>
        <div className="mini-score">
          <span>Material ESG risk</span>
          <strong>{Math.round(company.materialityScore)}</strong>
        </div>
        <button className="primary-button" onClick={() => onOpenCompany(card.ticker)}>
          {card.primaryCta}
        </button>
      </div>
    </article>
  );
}
