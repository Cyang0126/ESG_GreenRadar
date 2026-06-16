import { claimTruthScore, getHealthBand } from "../utils/formatters.js";

export default function ScoreBar({ score }) {
  const scoreValue = claimTruthScore(score);
  const band = getHealthBand(scoreValue);

  return (
    <div className="score-bar-block">
      <div className="score-row">
        <span>Claim Truth Score</span>
        <strong>{scoreValue}/100</strong>
      </div>
      <div className="score-track" aria-label={`Claim Truth Score ${scoreValue} out of 100`}>
        <div className={`score-fill score-fill-${band}`} style={{ width: `${scoreValue}%` }} />
      </div>
      <div className="threshold-row">
        <span>Risk 0-34</span>
        <span>Unverified 35-64</span>
        <span>Backed 65-100</span>
      </div>
    </div>
  );
}
