const signalImportance = {
  green: 20,
  watch: 60,
  red: 90,
};

function seededJitter(seed) {
  let hash = 0;
  for (let index = 0; index < seed.length; index += 1) {
    hash = (hash << 5) - hash + seed.charCodeAt(index);
    hash |= 0;
  }
  return Math.abs(hash % 17) - 8;
}

function rankingReasonFor(company, boosts) {
  if (company.previousSignal !== company.currentSignal) return "Fresh signal change";
  if ((company.materialityScore ?? company.deteriorationScore) >= 75) return "High materiality";
  if (boosts.interestBoost >= 8) return "Watched sector";
  if (boosts.learningBoost >= 8) return "Learning value";
  if (company.evidenceConfidenceOverall >= 80) return "Strong evidence";
  return "Relevant update";
}

export function createDiscoveryCard(company) {
  const materiality = company.materialityScore ?? company.deteriorationScore;
  const confidence = company.evidenceConfidenceOverall;
  const signalChangeImportance =
    company.previousSignal === company.currentSignal
      ? signalImportance[company.currentSignal] * 0.5
      : signalImportance[company.currentSignal];

  const feedScore =
    materiality * 0.3 +
    confidence * 0.25 +
    signalChangeImportance * 0.2 +
    (company.userInterestMatch ?? 50) * 0.15 +
    (company.freshness ?? 70) * 0.05 +
    (company.learningValue ?? 50) * 0.05;
  const boosts = {
    recencyBoost: company.isDemoOverride ? 26 : company.previousSignal !== company.currentSignal ? 14 : (company.freshness ?? 70) / 12,
    interestBoost: company.isWatched ? 10 : (company.userInterestMatch ?? 50) / 12,
    noveltyBoost: company.discoveryType?.includes("learning") ? 9 : company.currentSignal === "green" ? 5 : 0,
    learningBoost: (company.learningValue ?? 50) / 10,
    jitter: seededJitter(`${company.ticker}-${company.discoveryType}-${company.currentSignal}`),
  };
  const algorithmScore =
    feedScore +
    boosts.recencyBoost +
    boosts.interestBoost +
    boosts.noveltyBoost +
    boosts.learningBoost +
    boosts.jitter;

  return {
    id: `feed-${company.ticker}`,
    ticker: company.ticker,
    companyName: company.name,
    cardType: company.discoveryType,
    signal: company.currentSignal,
    previousSignal: company.previousSignal,
    headline: company.discoveryHeadline,
    summary: company.discoverySummary,
    evidenceConfidence: confidence >= 75 ? "high" : confidence >= 50 ? "medium" : "low",
    primaryCta: "Why This Flag?",
    feedScore,
    algorithmScore,
    rankingReason: rankingReasonFor(company, boosts),
    company,
  };
}

export function buildDiscoveryCards(companies) {
  const cards = companies
    .filter((company) => company.hasMeaningfulUpdate)
    .map(createDiscoveryCard)
    .sort((a, b) => b.algorithmScore - a.algorithmScore);

  const firstUrgentIndex = cards.findIndex(
    (card) => card.signal === "red" || card.signal === "watch"
  );

  if (firstUrgentIndex > 2) {
    const [urgentCard] = cards.splice(firstUrgentIndex, 1);
    cards.splice(1, 0, urgentCard);
  }

  return cards;
}
