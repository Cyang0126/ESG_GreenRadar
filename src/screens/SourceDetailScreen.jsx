import { formatDate } from "../utils/formatters.js";

function sourceReliabilityText(receipt) {
  if (receipt.grade === "A") {
    return "Grade A sources are official records such as regulators, courts, stock exchanges, or government databases.";
  }

  if (receipt.grade === "B") {
    return "Grade B sources are strong references such as audited reports, reputable news, or recognised watchdog research.";
  }

  return "This source is useful context, but the app expects corroboration before major signal changes.";
}

function inferSignalType(receipt) {
  const text = `${receipt.type} ${receipt.title}`.toLowerCase();
  if (text.includes("supplier") || text.includes("labour")) return "Supply Chain Risk";
  if (text.includes("regulator") || text.includes("enforcement")) return "Regulatory Flag";
  if (text.includes("promise") || text.includes("target") || text.includes("commitment")) {
    return "Promise Gap";
  }
  if (text.includes("greenwashing") || text.includes("disclosure")) return "Talk-vs-Action Gap";
  return "News Risk";
}

export default function SourceDetailScreen({ company, receipt, onBackToCompany }) {
  const activeReceipt = receipt ?? company.receipts[0];

  return (
    <section className="screen-stack source-screen">
      <div className="section-heading">
        <p className="eyebrow">Evidence Source</p>
        <h2>{activeReceipt.title}</h2>
      </div>

      <section className="panel source-main-card">
        <div className="source-topline">
          <span className="source-grade">Grade {activeReceipt.grade}</span>
          <span>{activeReceipt.confidence}% confidence</span>
        </div>
        <p>{sourceReliabilityText(activeReceipt)}</p>
        <div className="source-meta-grid">
          <div>
            <span>Source Type</span>
            <strong>{activeReceipt.type}</strong>
          </div>
          <div>
            <span>Published</span>
            <strong>{formatDate(activeReceipt.date)}</strong>
          </div>
        </div>
      </section>

      <section className="panel fake-source-panel">
        <p className="eyebrow">Demo source extract</p>
        <h3>{activeReceipt.type.includes("regulator") ? "Official enforcement notice" : "Archived disclosure record"}</h3>
        <p>
          “{activeReceipt.summary} The item was reviewed for specificity, recency,
          independence, and relevance before it affected the ESG signal.”
        </p>
        <div className="fake-url">source.demo/{company.ticker.toLowerCase()}/{activeReceipt.id}</div>
      </section>

      <section className="panel">
        <h3>Signal Impact</h3>
        <p>
          This evidence is linked to <strong>{company.name}</strong> and contributes to{" "}
          <strong>{inferSignalType(activeReceipt)}</strong>.
        </p>
        <p>
          This evidence was used because the source is recent, specific, and independently
          verifiable.
        </p>
      </section>

      <div className="source-actions">
        <button className="primary-button" onClick={onBackToCompany}>
          Back to Company
        </button>
        <button className="secondary-button" disabled>
          Open Original · Demo only
        </button>
      </div>
    </section>
  );
}
