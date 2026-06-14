import { getHealthBand, healthScoreFromRisk } from "../utils/formatters.js";

export default function ScoreBar({ score }) {
  const healthScore = healthScoreFromRisk(score);
  const band = getHealthBand(healthScore);

  return (
    <div className="score-bar-block">
      <div className="score-row">
        <span>Signal Health Score</span>
        <strong>{healthScore}/100</strong>
      </div>
      <div className="score-track" aria-label={`Signal Health Score ${healthScore} out of 100`}>
        <div className={`score-fill score-fill-${band}`} style={{ width: `${healthScore}%` }} />
      </div>
      <div className="threshold-row">
        <span>Red 0-35</span>
        <span>Watch 36-65</span>
        <span>Green 66-100</span>
      </div>
    </div>
  );
}
