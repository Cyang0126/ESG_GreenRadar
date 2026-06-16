export function canTriggerRedFlagAlert(company) {
  return (
    company.isWatched &&
    company.previousSignal !== "red" &&
    company.currentSignal === "red" &&
    company.alertSeverity >= 75 &&
    company.evidenceConfidenceOverall >= 75
  );
}

export function buildGreenwashRiskAlert(company) {
  if (!canTriggerRedFlagAlert(company)) return null;

  return {
    id: `alert-${company.ticker}`,
    ticker: company.ticker,
    companyName: company.name,
    text: `Greenwash Risk Alert: ${company.name}'s sustainability claim moved to GREENWASH RISK after verified evidence widened the talk-vs-action gap. Tap to check the claim.`,
    linkedEvidenceIds: company.receipts.slice(0, 2).map((receipt) => receipt.id),
  };
}

export const buildRedFlagAlert = buildGreenwashRiskAlert;
