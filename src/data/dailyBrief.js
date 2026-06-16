import { companies } from "./companies.js";

function signalRank(signal) {
  if (signal === "red") return 3;
  if (signal === "watch") return 2;
  return 1;
}

function buildHeadline(priorityCompany, changedCompanies) {
  const improved = changedCompanies.find((company) => company.currentSignal === "green");

  if (improved && priorityCompany) {
    return `${improved.name} claim backed, ${priorityCompany.name} needs review`;
  }

  if (priorityCompany?.currentSignal === "red") {
    return `${priorityCompany.name} is today’s greenwashing story`;
  }

  if (changedCompanies.length > 0) {
    return `${changedCompanies[0].name} claim verdict changed today`;
  }

  return "No urgent greenwashing changes today";
}

function buildAiSummary(priorityCompany, changedCompanies, stableCompanies) {
  const changedSentence =
    changedCompanies.length > 0
      ? `${changedCompanies.length} watched company claim changed verdict since the last report.`
      : "No watched company claim changed verdict since the last report.";
  const prioritySentence = priorityCompany
    ? `${priorityCompany.name} has the largest talk-vs-action gap in today’s brief.`
    : "There is no urgent claim to review first today.";
  const stableSentence =
    stableCompanies.length > 0
      ? `${stableCompanies.length} watched claims can wait because no material evidence change was detected.`
      : "No watched claims are marked as stable in this report.";

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
      "A company’s own green marketing is only a claim. Green Radar looks for independent evidence before treating that claim as backed.",
  };
}

export const dailyBrief = buildDailyBrief(companies);
