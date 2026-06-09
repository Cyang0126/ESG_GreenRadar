import { SCORE_WEIGHTS } from "../utils/constants.js";

export function clamp(value, min = 0, max = 100) {
  return Math.min(Math.max(value, min), max);
}

export function calculateDeteriorationScore(scores, overrideAdjustments = 0) {
  const rawScore =
    scores.newsRisk * SCORE_WEIGHTS.newsRisk +
    scores.promiseGap * SCORE_WEIGHTS.promiseGap +
    scores.regulatoryFlag * SCORE_WEIGHTS.regulatoryFlag +
    scores.sentimentDrift * SCORE_WEIGHTS.sentimentDrift +
    scores.talkVsActionGap * SCORE_WEIGHTS.talkVsActionGap +
    scores.supplyChainRisk * SCORE_WEIGHTS.supplyChainRisk +
    scores.evidenceConfidencePenalty * SCORE_WEIGHTS.evidenceConfidencePenalty;

  return clamp(rawScore + overrideAdjustments);
}

export function signalFromScore(score) {
  if (score <= 34) return "green";
  if (score <= 64) return "watch";
  return "red";
}

export function enrichCompany(company) {
  const deteriorationScore = calculateDeteriorationScore(
    company.scores,
    company.overrideAdjustments ?? 0
  );

  return {
    ...company,
    deteriorationScore,
    currentSignal: signalFromScore(deteriorationScore),
  };
}

export function enrichCompanies(companies) {
  return companies.map(enrichCompany);
}
