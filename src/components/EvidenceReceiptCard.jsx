import { formatDate } from "../utils/formatters.js";

export default function EvidenceReceiptCard({ receipt, onViewSource }) {
  return (
    <article className="receipt-card">
      <div className="receipt-topline">
        <span className="source-grade">Grade {receipt.grade}</span>
        <span>{receipt.confidence}% confidence</span>
      </div>
      <h3>{receipt.title}</h3>
      <p>{receipt.summary}</p>
      <footer>
        <span>{receipt.type}</span>
        <span>{formatDate(receipt.date)}</span>
      </footer>
      <button className="source-link-button" onClick={() => onViewSource(receipt.id)}>
        View Source
      </button>
    </article>
  );
}
