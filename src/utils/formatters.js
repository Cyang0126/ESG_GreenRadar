export function formatScore(score) {
  return Math.round(score);
}

export function getHealthBand(score) {
  if (score > 70) return "green";
  if (score >= 40) return "watch";
  return "red";
}

export function healthScoreFromRisk(riskScore) {
  return Math.max(0, Math.min(100, Math.round(100 - riskScore)));
}

export function formatDate(value) {
  return new Intl.DateTimeFormat("en-SG", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export function sentenceCase(value) {
  return value
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (char) => char.toUpperCase())
    .trim();
}
