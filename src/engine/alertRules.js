export function canTriggerRedFlagAlert(company) {
  return (
    company.isWatched &&
    company.previousSignal !== "red" &&
    company.currentSignal === "red" &&
    company.alertSeverity >= 75 &&
    company.evidenceConfidenceOverall >= 75
  );
}

export function buildRedFlagAlert(company) {
  if (!canTriggerRedFlagAlert(company)) return null;

  return {
    id: `alert-${company.ticker}`,
    ticker: company.ticker,
    companyName: company.name,
    text: `Red Flag Alert: ${company.name} moved from ${company.previousSignal.toUpperCase()} to RED after verified deterioration was detected. Tap to see why.`,
    linkedEvidenceIds: company.receipts.slice(0, 2).map((receipt) => receipt.id),
  };
}
