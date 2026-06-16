export const SIGNALS = {
  green: {
    label: "Backed",
    tone: "green",
    meaning: "Claims are supported by strong, independent evidence.",
  },
  watch: {
    label: "Unverified",
    tone: "watch",
    meaning: "Claims exist, but proof is weak, missing, or mostly self-reported.",
  },
  red: {
    label: "Greenwash Risk",
    tone: "red",
    meaning: "Big sustainability claims are not supported by enough real-world proof.",
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
  { id: "account", label: "Profile" },
];
