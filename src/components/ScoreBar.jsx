import { healthScoreFromRisk } from "../utils/formatters.js";

export default function ScoreBar({ score }) {
  const healthScore = healthScoreFromRisk(score);

  return (
    <div className="score-bar-block">
      <div className="score-row">
        <span>ESG Health Score</span>
        <strong>{healthScore}/100</strong>
      </div>
      <div className="score-track" aria-label={`ESG Health Score ${healthScore} out of 100`}>
        <div className="score-fill" style={{ width: `${healthScore}%` }} />
      </div>
      <div className="threshold-row">
        <span>Red 0-35</span>
        <span>Watch 36-65</span>
        <span>Green 66-100</span>
      </div>
    </div>
  );
}
