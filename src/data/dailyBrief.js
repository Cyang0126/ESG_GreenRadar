import { companies } from "./companies.js";

function signalRank(signal) {
  if (signal === "red") return 3;
  if (signal === "watch") return 2;
  return 1;
}

function buildHeadline(priorityCompany, changedCompanies) {
  const improved = changedCompanies.find((company) => company.currentSignal === "green");

  if (improved && priorityCompany) {
    return `${improved.name} improved, ${priorityCompany.name} still needs attention`;
  }

  if (priorityCompany?.currentSignal === "red") {
    return `${priorityCompany.name} is today’s ESG priority`;
  }

  if (changedCompanies.length > 0) {
    return `${changedCompanies[0].name} changed signal today`;
  }

  return "No urgent ESG changes in today’s watchlist";
}

function buildAiSummary(priorityCompany, changedCompanies, stableCompanies) {
  const changedSentence =
    changedCompanies.length > 0
      ? `${changedCompanies.length} watched company signal changed since the last report.`
      : "No watched company changed signal since the last report.";
  const prioritySentence = priorityCompany
    ? `${priorityCompany.name} should be read first because it has the highest current ESG priority.`
    : "There is no urgent company to review first today.";
  const stableSentence =
    stableCompanies.length > 0
      ? `${stableCompanies.length} watched companies can wait because no material change was detected.`
      : "No watched companies are marked as stable in this report.";

  return `${changedSentence} ${prioritySentence} ${stableSentence}`;
}

function buildRiskThemes(watchedCompanies) {
  const themes = [];
  const hasSupply = watchedCompanies.some((company) => company.scores.supplyChainRisk >= 60);
  const hasRegulatory = watchedCompanies.some((company) => company.scores.regulatoryFlag >= 60);
  const hasPromise = watchedCompanies.some((company) => company.scores.promiseGap >= 60);
  const hasTalkGap = watchedCompanies.some((company) => company.scores.talkVsActionGap >= 60);

  if (hasSupply) themes.push("Supply chain");
  if (hasRegulatory) themes.push("Regulatory");
  if (hasPromise) themes.push("Promise gap");
  if (hasTalkGap) themes.push("Talk vs action");

  return themes.length > 0 ? themes : ["No dominant risk theme"];
}

export function buildDailyBrief(sourceCompanies) {
  const watchedCompanies = sourceCompanies.filter((company) => company.isWatched);
  const changedCompanies = watchedCompanies
    .filter((company) => company.previousSignal !== company.currentSignal)
    .sort((a, b) => signalRank(b.currentSignal) - signalRank(a.currentSignal));
  const stableCompanies = watchedCompanies.filter(
    (company) => company.previousSignal === company.currentSignal
  );
  const priorityCompany =
    watchedCompanies
      .filter((company) => company.currentSignal === "red")
      .sort((a, b) => b.deteriorationScore - a.deteriorationScore)[0] ??
    changedCompanies[0] ??
    watchedCompanies.sort((a, b) => b.deteriorationScore - a.deteriorationScore)[0];
  const signalCounts = {
    green: watchedCompanies.filter((company) => company.currentSignal === "green").length,
    watch: watchedCompanies.filter((company) => company.currentSignal === "watch").length,
    red: watchedCompanies.filter((company) => company.currentSignal === "red").length,
  };
  const readingQueue = [
    priorityCompany,
    ...changedCompanies.filter((company) => company.ticker !== priorityCompany?.ticker),
  ].filter(Boolean);

  return {
    date: "2026-06-10",
    headline: buildHeadline(priorityCompany, changedCompanies),
    aiSummary: buildAiSummary(priorityCompany, changedCompanies, stableCompanies),
    summary: buildHeadline(priorityCompany, changedCompanies),
    priorityCompany,
    signalCounts,
    changedCompanies,
    riskThemes: buildRiskThemes(watchedCompanies),
    readingQueue,
    stableCompanies,
    learningNote:
      "Supplier evidence matters because ESG risk can sit outside the company itself. A strong parent-company claim becomes weaker if a material supplier has verified labour or environmental issues.",
  };
}

export const dailyBrief = buildDailyBrief(companies);
