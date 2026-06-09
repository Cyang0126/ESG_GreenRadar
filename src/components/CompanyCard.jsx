import SignalBadge from "./SignalBadge.jsx";
import ScoreBar from "./ScoreBar.jsx";

export default function CompanyCard({ company, onOpenCompany, compact = false }) {
  return (
    <article className="company-card">
      <div className="card-header">
        <div>
          <h3>{company.name}</h3>
          <p>{company.ticker} · {company.sector}</p>
        </div>
        <SignalBadge signal={company.currentSignal} previousSignal={company.previousSignal} />
      </div>
      {!compact && <p>{company.why}</p>}
      <ScoreBar score={company.deteriorationScore} />
      <button className="primary-button" onClick={() => onOpenCompany(company.ticker)}>
        Open Evidence
      </button>
    </article>
  );
}
