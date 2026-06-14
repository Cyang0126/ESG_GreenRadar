import EvidenceReceiptCard from "../components/EvidenceReceiptCard.jsx";
import SignalBadge from "../components/SignalBadge.jsx";
import ScoreBar from "../components/ScoreBar.jsx";
import { sentenceCase } from "../utils/formatters.js";

export default function CompanyDetailScreen({
  company,
  openedFromAlert = false,
  onToggleWatchlist,
  onViewSource,
}) {
  return (
    <section className="screen-stack">
      <div className="detail-hero">
        <div>
          <p className="eyebrow">{company.ticker} · {company.sector}</p>
          <h2>{company.name}</h2>
        </div>
        <SignalBadge signal={company.currentSignal} previousSignal={company.previousSignal} />
      </div>

      <ScoreBar score={company.deteriorationScore} />

      <button className="secondary-button" onClick={() => onToggleWatchlist(company.ticker)}>
        {company.isWatched ? "Remove from Watchlist" : "Add to Watchlist"}
      </button>

      <section className="panel">
        <h3>Why This Flag?</h3>
        <p>{company.why}</p>
        {openedFromAlert && (
          <div className="exclusive-note" role="note">
            You’re among the first 12% of users to see this information.
          </div>
        )}
        {company.fundMandatePressure && (
          <div className="callout">
            <strong>Fund Mandate Pressure</strong>
            <p>{company.fundMandatePressure}</p>
          </div>
        )}
      </section>

      <section className="panel">
        <h3>Signal Breakdown</h3>
        <div className="breakdown-grid">
          {Object.entries(company.scores).map(([key, value]) => (
            <div className="breakdown-item" key={key}>
              <span>{sentenceCase(key)}</span>
              <strong>{value}</strong>
            </div>
          ))}
        </div>
      </section>

      <section className="panel">
        <h3>Evidence Receipts</h3>
        <div className="receipt-list">
          {company.receipts.map((receipt) => (
            <EvidenceReceiptCard
              receipt={receipt}
              key={receipt.id}
              onViewSource={onViewSource}
            />
          ))}
        </div>
      </section>

      <section className="panel">
        <h3>Signal History</h3>
        <div className="timeline">
          {company.history.map((item) => (
            <div className="timeline-item" key={`${item.date}-${item.signal}`}>
              <SignalBadge signal={item.signal} />
              <p>{item.note}</p>
            </div>
          ))}
        </div>
      </section>
    </section>
  );
}
