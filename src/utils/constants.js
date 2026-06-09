export const SIGNALS = {
  green: {
    label: "Green",
    tone: "green",
    meaning: "Low deterioration risk. No major warning signs found.",
  },
  watch: {
    label: "Watch",
    tone: "watch",
    meaning: "Moderate concern, uncertainty, missing evidence, or early warning signs.",
  },
  red: {
    label: "Red",
    tone: "red",
    meaning: "Serious ESG deterioration, high-severity controversy, regulatory issue, or verified risk.",
  },
};

export const SCORE_WEIGHTS = {
  newsRisk: 0.25,
  promiseGap: 0.2,
  regulatoryFlag: 0.2,
  sentimentDrift: 0.1,
  talkVsActionGap: 0.1,
  supplyChainRisk: 0.1,
  evidenceConfidencePenalty: 0.05,
};

export const NAV_ITEMS = [
  { id: "discovery", label: "Discovery" },
  { id: "watchlist", label: "Watchlist" },
  { id: "brief", label: "Brief" },
  { id: "search", label: "Search" },
];
