import SignalBadge from "../components/SignalBadge.jsx";
import ScoreBar from "../components/ScoreBar.jsx";
import { verdictLabel } from "../utils/formatters.js";

function countPercent(count, total) {
  if (total === 0) return 0;
  if (count === 0) return 0;
  return Math.max(4, Math.round((count / total) * 100));
}

export default function DailyBriefScreen({ brief, onOpenCompany }) {
  const watchedTotal =
    brief.signalCounts.green + brief.signalCounts.watch + brief.signalCounts.red;
  const priority = brief.priorityCompany;

  return (
    <section className="screen-stack">
      <div className="section-heading">
        <p className="eyebrow">Today’s Greenwashing Brief</p>
        <h2>{brief.headline}</h2>
      </div>

      <section className="panel ai-brief-panel">
        <p className="eyebrow">AI claim review</p>
        <p>{brief.aiSummary}</p>
      </section>

      <section className="brief-dashboard">
        <div>
          <span>Watched</span>
          <strong>{watchedTotal}</strong>
        </div>
        <div>
          <span>Risk</span>
          <strong>{brief.signalCounts.red}</strong>
        </div>
        <div>
          <span>Unverified</span>
          <strong>{brief.signalCounts.watch}</strong>
        </div>
        <div>
          <span>Backed</span>
          <strong>{brief.signalCounts.green}</strong>
        </div>
      </section>

      <section className="panel">
        <h3>Verdict Mix</h3>
        <div className="signal-mix-bar">
          <span
            className="mix-red"
            style={{ width: `${countPercent(brief.signalCounts.red, watchedTotal)}%` }}
          />
          <span
            className="mix-watch"
            style={{ width: `${countPercent(brief.signalCounts.watch, watchedTotal)}%` }}
          />
          <span
            className="mix-green"
            style={{ width: `${countPercent(brief.signalCounts.green, watchedTotal)}%` }}
          />
        </div>
        <div className="theme-row">
          {brief.riskThemes.map((theme) => (
            <span className="theme-chip" key={theme}>{theme}</span>
          ))}
        </div>
      </section>

      {priority && (
        <section className="panel priority-card">
          <div className="card-header">
            <div>
              <p className="eyebrow">Priority now</p>
              <h3>{priority.name}</h3>
              <p>{priority.ticker} · Largest talk-vs-action gap</p>
            </div>
            <SignalBadge signal={priority.currentSignal} previousSignal={priority.previousSignal} />
          </div>
          <ScoreBar score={priority.deteriorationScore} />
          <button className="primary-button" onClick={() => onOpenCompany(priority.ticker)}>
            Check Claim
          </button>
        </section>
      )}

      <section className="panel">
        <h3>What Changed</h3>
        {brief.changedCompanies.length > 0 ? (
          <div className="brief-row-list">
            {brief.changedCompanies.map((company) => (
              <button className="brief-change-row" key={company.ticker} onClick={() => onOpenCompany(company.ticker)}>
                <span>{company.name}</span>
                <strong>{verdictLabel(company.previousSignal)} → {verdictLabel(company.currentSignal)}</strong>
              </button>
            ))}
          </div>
        ) : (
          <p>No signal changes in this generated report.</p>
        )}
      </section>

      <section className="panel">
        <h3>Can Wait</h3>
        <div className="pill-row">
          {brief.stableCompanies.map((company) => (
            <button className="status-pill" key={company.ticker} onClick={() => onOpenCompany(company.ticker)}>
              {company.ticker} stable
            </button>
          ))}
        </div>
      </section>

      <section className="panel">
        <h3>Claim Explainer</h3>
        <p>{brief.learningNote}</p>
      </section>
    </section>
  );
}
