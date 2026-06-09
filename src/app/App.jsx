import { useMemo, useRef, useState } from "react";
import { ROUTES } from "./routes.js";
import { companies, getCompanyByTicker } from "../data/companies.js";
import { demoScenarios } from "../data/demoScenarios.js";
import { buildDailyBrief } from "../data/dailyBrief.js";
import { buildRedFlagAlert } from "../engine/alertRules.js";
import { buildDiscoveryCards } from "../engine/discoveryRanking.js";
import { enrichCompany } from "../engine/signalEngine.js";
import AlertToast from "../components/AlertToast.jsx";
import BottomNav from "../components/BottomNav.jsx";
import CompanyDetailScreen from "../screens/CompanyDetailScreen.jsx";
import DailyBriefScreen from "../screens/DailyBriefScreen.jsx";
import DiscoveryScreen from "../screens/DiscoveryScreen.jsx";
import { BriefPromptScreen, ClosedScreen, SplashScreen } from "../screens/LaunchScreen.jsx";
import PresenterControls from "../components/PresenterControls.jsx";
import SearchScreen from "../screens/SearchScreen.jsx";
import SourceDetailScreen from "../screens/SourceDetailScreen.jsx";
import WatchlistScreen from "../screens/WatchlistScreen.jsx";

export default function App() {
  const screenFrameRef = useRef(null);
  const discoveryScrollTopRef = useRef(0);
  const [appPhase, setAppPhase] = useState("closed");
  const [route, setRoute] = useState(ROUTES.discovery);
  const [routeHistory, setRouteHistory] = useState([]);
  const [selectedTicker, setSelectedTicker] = useState("NVDA");
  const [watchlist, setWatchlist] = useState(
    () => new Set(companies.filter((company) => company.isWatched).map((company) => company.ticker))
  );
  const [demoOverrides, setDemoOverrides] = useState({});
  const [activePresenterActions, setActivePresenterActions] = useState(() => new Set());
  const [alert, setAlert] = useState(null);
  const [selectedReceiptId, setSelectedReceiptId] = useState(null);
  const [isBriefUnread, setIsBriefUnread] = useState(false);
  const [briefSnapshot, setBriefSnapshot] = useState(() => buildDailyBrief(companies));
  const [discoveryRestoreKey, setDiscoveryRestoreKey] = useState(0);

  const companiesWithWatchlist = useMemo(
    () =>
      companies.map((company) => ({
        ...(demoOverrides[company.ticker] ?? company),
        isWatched: watchlist.has(company.ticker),
      })),
    [demoOverrides, watchlist]
  );

  const dynamicDiscoveryCards = useMemo(
    () => buildDiscoveryCards(companiesWithWatchlist),
    [companiesWithWatchlist]
  );

  const selectedCompany =
    companiesWithWatchlist.find((company) => company.ticker === selectedTicker) ??
    getCompanyByTicker(selectedTicker) ??
    companiesWithWatchlist[0];
  const selectedReceipt =
    selectedCompany.receipts.find((receipt) => receipt.id === selectedReceiptId) ??
    selectedCompany.receipts[0];

  function scrollScreenToTop() {
    requestAnimationFrame(() => {
      screenFrameRef.current?.scrollTo({ top: 0, behavior: "auto" });
    });
  }

  function pushRoute(routeId) {
    setRouteHistory((current) => [...current.slice(-8), route]);
    setRoute(routeId);
    if (routeId !== ROUTES.company || route !== ROUTES.discovery) {
      scrollScreenToTop();
    }
  }

  function openCompany(ticker) {
    setSelectedTicker(ticker);
    pushRoute(ROUTES.company);
  }

  function openSource(receiptId) {
    setSelectedReceiptId(receiptId);
    pushRoute(ROUTES.source);
  }

  function navigate(routeId, { replace = false } = {}) {
    if (routeId === ROUTES.brief) {
      setIsBriefUnread(false);
    }
    if (!replace) {
      setRouteHistory([]);
    }
    setRoute(routeId);
    if (routeId !== ROUTES.discovery) {
      scrollScreenToTop();
    }
  }

  function goBack() {
    setRouteHistory((current) => {
      const next = [...current];
      const previous = next.pop() ?? ROUTES.discovery;
      setRoute(previous);
      if (previous !== ROUTES.discovery) {
        scrollScreenToTop();
      }
      return next;
    });
  }

  function openApp() {
    setAppPhase("splash");
    setIsBriefUnread(true);
    scrollScreenToTop();
    setTimeout(() => {
      setAppPhase("prompt");
      scrollScreenToTop();
    }, 900);
  }

  function openBriefFromPrompt() {
    setAppPhase("app");
    navigate(ROUTES.brief);
    scrollScreenToTop();
  }

  function seeBriefLater() {
    setAppPhase("app");
    navigate(ROUTES.discovery, { replace: true });
    scrollScreenToTop();
  }

  function toggleWatchlist(ticker) {
    setWatchlist((current) => {
      const next = new Set(current);
      if (next.has(ticker)) next.delete(ticker);
      else next.add(ticker);
      return next;
    });
  }

  function simulateAlert(ticker) {
    const company = companiesWithWatchlist.find((item) => item.ticker === ticker);
    const redFlagAlert = company ? buildRedFlagAlert(company) : null;
    setAlert(redFlagAlert);
  }

  function markPresenterAction(actionId) {
    setActivePresenterActions((current) => {
      const next = new Set(current);
      next.add(actionId);
      return next;
    });
  }

  function runDemoScenario(scenario) {
    const baseCompany = companiesWithWatchlist.find((company) => company.ticker === scenario.ticker);
    if (!baseCompany) return;

    const overriddenCompany = enrichCompany({
      ...baseCompany,
      previousSignal: baseCompany.currentSignal,
      scores: scenario.scores,
      evidenceConfidenceOverall: scenario.receipt.confidence,
      materialityScore: 92,
      alertSeverity: 92,
      hasMeaningfulUpdate: true,
      isDemoOverride: true,
      scenarioId: scenario.id,
      discoveryType: scenario.id === "supplier-remediation" ? "turned-green" : "turned-red",
      discoveryHeadline: scenario.headline,
      discoverySummary: scenario.summary,
      why: scenario.why,
      receipts: [scenario.receipt, ...baseCompany.receipts],
      history: [
        ...baseCompany.history,
        {
          date: scenario.receipt.date,
          signal: "red",
          note: scenario.summary,
        },
      ],
    });

    setDemoOverrides((current) => ({
      ...current,
      [scenario.ticker]: overriddenCompany,
    }));
    markPresenterAction(`scenario:${scenario.id}`);
    setSelectedTicker(scenario.ticker);
    discoveryScrollTopRef.current = 0;
    setDiscoveryRestoreKey((current) => current + 1);
    if (appPhase === "app") {
      setRoute(ROUTES.discovery);
      setRouteHistory([]);
    }
    setAlert(buildRedFlagAlert({ ...overriddenCompany, isWatched: baseCompany.isWatched }));
  }

  function generateDailyReport() {
    setBriefSnapshot(buildDailyBrief(companiesWithWatchlist));
    markPresenterAction("report:general");
    setIsBriefUnread(true);
    setAlert({
      id: "alert-daily-report",
      ticker: selectedTicker,
      companyName: "Daily Brief",
      text: "New daily report ready: today’s AI brief has summarised the latest watched-company priorities. Tap to review the update.",
      linkedEvidenceIds: [],
      targetRoute: ROUTES.brief,
    });
  }

  function buildForcedCompany(ticker, config, sourceCompanies) {
    const baseCompany = sourceCompanies.find((company) => company.ticker === ticker);
    if (!baseCompany) return null;

    return enrichCompany({
      ...baseCompany,
      previousSignal: baseCompany.currentSignal,
      scores: config.scores,
      evidenceConfidenceOverall: config.receipt.confidence,
      materialityScore: config.materialityScore,
      alertSeverity: config.alertSeverity,
      hasMeaningfulUpdate: true,
      isDemoOverride: true,
      scenarioId: "forced-change-report",
      discoveryType: config.discoveryType,
      discoveryHeadline: config.headline,
      discoverySummary: config.summary,
      why: config.why,
      receipts: [config.receipt, ...baseCompany.receipts],
      history: [
        ...baseCompany.history,
        {
          date: config.receipt.date,
          signal: config.targetSignal,
          note: config.summary,
        },
      ],
    });
  }

  function generateChangeReport() {
    const forcedConfigs = {
      XOM: {
        targetSignal: "red",
        discoveryType: "turned-red",
        headline: "ExxonMobil moved to Red",
        summary: "A verified climate commitment reversal became today’s highest-priority watched update.",
        why: "ExxonMobil is Red because commitment reversal is material, recent, and backed by reliable evidence.",
        materialityScore: 92,
        alertSeverity: 90,
        scores: {
          newsRisk: 86,
          promiseGap: 92,
          regulatoryFlag: 70,
          sentimentDrift: 70,
          talkVsActionGap: 88,
          supplyChainRisk: 48,
          evidenceConfidencePenalty: 12,
        },
        receipt: {
          id: "ev-forced-xom-001",
          type: "annual report",
          grade: "B",
          confidence: 88,
          date: "2026-06-10",
          title: "Climate commitment reversal confirmed",
          summary: "A new disclosure confirmed climate transition commitments were materially weakened.",
        },
      },
      AMZN: {
        targetSignal: "watch",
        discoveryType: "trending-watch",
        headline: "Amazon moved to Watch",
        summary: "Worker safety evidence increased enough to require monitoring in today’s report.",
        why: "Amazon is Watch because repeated worker safety evidence is material but not yet severe enough for Red.",
        materialityScore: 66,
        alertSeverity: 60,
        scores: {
          newsRisk: 62,
          promiseGap: 42,
          regulatoryFlag: 54,
          sentimentDrift: 66,
          talkVsActionGap: 48,
          supplyChainRisk: 34,
          evidenceConfidencePenalty: 18,
        },
        receipt: {
          id: "ev-forced-amzn-001",
          type: "regulator",
          grade: "A",
          confidence: 86,
          date: "2026-06-10",
          title: "Worker safety notice added",
          summary: "A formal safety notice increased the worker safety risk signal.",
        },
      },
      MSFT: {
        targetSignal: "green",
        discoveryType: "turned-green",
        headline: "Microsoft remains Green",
        summary: "Carbon progress evidence stayed stable and specific in today’s watched-company review.",
        why: "Microsoft remains Green because measurable carbon progress evidence is recent and externally reviewable.",
        materialityScore: 24,
        alertSeverity: 16,
        scores: {
          newsRisk: 14,
          promiseGap: 18,
          regulatoryFlag: 10,
          sentimentDrift: 22,
          talkVsActionGap: 20,
          supplyChainRisk: 16,
          evidenceConfidencePenalty: 10,
        },
        receipt: {
          id: "ev-forced-msft-001",
          type: "sustainability report",
          grade: "B",
          confidence: 82,
          date: "2026-06-10",
          title: "Carbon progress remained on track",
          summary: "A reviewed sustainability update kept the company’s climate commitment on track.",
        },
      },
    };

    const forcedCompanies = Object.entries(forcedConfigs)
      .map(([ticker, config]) => [ticker, buildForcedCompany(ticker, config, companiesWithWatchlist)])
      .filter(([, company]) => Boolean(company));
    const forcedMap = Object.fromEntries(forcedCompanies);

    setWatchlist((current) => {
      const next = new Set(current);
      Object.keys(forcedConfigs).forEach((ticker) => next.add(ticker));
      return next;
    });
    setDemoOverrides((current) => ({
      ...current,
      ...forcedMap,
    }));

    const nextWatchlist = new Set(watchlist);
    Object.keys(forcedConfigs).forEach((ticker) => nextWatchlist.add(ticker));
    const nextCompanies = companiesWithWatchlist.map((company) => (
      forcedMap[company.ticker]
        ? { ...forcedMap[company.ticker], isWatched: true }
        : { ...company, isWatched: nextWatchlist.has(company.ticker) }
    ));

    setBriefSnapshot(buildDailyBrief(nextCompanies));
    markPresenterAction("report:forced-change");
    setIsBriefUnread(true);
    setAlert({
      id: "alert-forced-report",
      ticker: "XOM",
      companyName: "Daily Brief",
      text: "New watched-company changes detected: one followed company moved to Red and another moved to Watch. Tap to review the brief.",
      linkedEvidenceIds: ["ev-forced-xom-001", "ev-forced-amzn-001"],
      targetRoute: ROUTES.brief,
    });
  }

  function resetDemo() {
    setDemoOverrides({});
    setActivePresenterActions(new Set());
    setAlert(null);
    setSelectedTicker("NVDA");
    setWatchlist(new Set(companies.filter((company) => company.isWatched).map((company) => company.ticker)));
    setIsBriefUnread(false);
    setBriefSnapshot(buildDailyBrief(companies));
    setRouteHistory([]);
    setRoute(ROUTES.discovery);
    discoveryScrollTopRef.current = 0;
    setDiscoveryRestoreKey((current) => current + 1);
    scrollScreenToTop();
  }

  const canGoBack = appPhase === "app" && routeHistory.length > 0;

  return (
    <div className="phone-stage">
      <PresenterControls
        scenarios={demoScenarios}
        activePresenterActions={activePresenterActions}
        appPhase={appPhase}
        onOpenApp={openApp}
        onRunScenario={runDemoScenario}
        onGenerateDailyReport={generateDailyReport}
        onGenerateChangeReport={generateChangeReport}
        onResetDemo={resetDemo}
      />
      <div className="app-shell">
        <header className="topbar">
          {canGoBack && (
            <button className="back-button" onClick={goBack} aria-label="Go back">
              ←
            </button>
          )}
          <div>
            <p className="eyebrow">ESG Deathwatch</p>
            <h1>GreenRadar</h1>
          </div>
        </header>

        <main className="screen-frame" ref={screenFrameRef}>
        {appPhase === "closed" && <ClosedScreen />}
        {appPhase === "splash" && <SplashScreen />}
        {appPhase === "prompt" && (
          <>
            <DiscoveryScreen
              cards={dynamicDiscoveryCards.map((card) => ({
                ...card,
                company:
                  companiesWithWatchlist.find((company) => company.ticker === card.ticker) ??
                  card.company,
              }))}
              onOpenCompany={() => {}}
              onToggleWatchlist={() => {}}
              initialScrollTop={discoveryScrollTopRef.current}
              restoreKey={discoveryRestoreKey}
              onScrollPositionChange={(scrollTop) => {
                discoveryScrollTopRef.current = scrollTop;
              }}
            />
            <BriefPromptScreen onOpenBrief={openBriefFromPrompt} onSeeLater={seeBriefLater} />
          </>
        )}
        {appPhase === "app" && (
          <>
        {route === ROUTES.discovery && (
          <DiscoveryScreen
            cards={dynamicDiscoveryCards.map((card) => ({
              ...card,
              company:
                companiesWithWatchlist.find((company) => company.ticker === card.ticker) ??
                card.company,
            }))}
            onOpenCompany={openCompany}
            onToggleWatchlist={toggleWatchlist}
            initialScrollTop={discoveryScrollTopRef.current}
            restoreKey={discoveryRestoreKey}
            onScrollPositionChange={(scrollTop) => {
              discoveryScrollTopRef.current = scrollTop;
            }}
          />
        )}
        {route === ROUTES.company && (
          <CompanyDetailScreen
            company={selectedCompany}
            onToggleWatchlist={toggleWatchlist}
            onViewSource={openSource}
          />
        )}
        {route === ROUTES.source && (
          <SourceDetailScreen
            company={selectedCompany}
            receipt={selectedReceipt}
            onBackToCompany={goBack}
          />
        )}
        {route === ROUTES.watchlist && (
          <WatchlistScreen
            companies={companiesWithWatchlist}
            onOpenCompany={openCompany}
            onToggleWatchlist={toggleWatchlist}
          />
        )}
        {route === ROUTES.brief && (
          <DailyBriefScreen brief={briefSnapshot} onOpenCompany={openCompany} />
        )}
        {route === ROUTES.search && (
          <SearchScreen companies={companiesWithWatchlist} onOpenCompany={openCompany} />
        )}
          </>
        )}
        </main>

        {appPhase === "app" && (
          <>
            <BottomNav
              activeRoute={route}
              onNavigate={navigate}
              unreadRoutes={{ [ROUTES.brief]: isBriefUnread }}
            />
            <AlertToast
              alert={alert}
              onClose={() => setAlert(null)}
              onOpen={() => {
                if (alert.targetRoute) {
                  navigate(alert.targetRoute);
                } else {
                  setSelectedTicker(alert.ticker);
                  navigate(ROUTES.company);
                }
                setAlert(null);
              }}
            />
          </>
        )}
      </div>
    </div>
  );
}
