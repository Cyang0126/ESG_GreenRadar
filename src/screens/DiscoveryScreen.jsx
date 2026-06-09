import DiscoverySignalCard from "../components/DiscoverySignalCard.jsx";
import { useEffect, useRef } from "react";

export default function DiscoveryScreen({
  cards,
  onOpenCompany,
  onToggleWatchlist,
  initialScrollTop = 0,
  onScrollPositionChange,
  restoreKey = "initial",
  scrollToTicker = null,
}) {
  const feedRef = useRef(null);

  useEffect(() => {
    requestAnimationFrame(() => {
      if (feedRef.current) {
        feedRef.current.scrollTo({ top: initialScrollTop, behavior: "auto" });
      }
    });
  }, [initialScrollTop, restoreKey]);

  useEffect(() => {
    if (!scrollToTicker) return;
    const nextCardIndex = cards.findIndex((card) => card.ticker === scrollToTicker);
    if (nextCardIndex < 0) return;

    requestAnimationFrame(() => {
      if (!feedRef.current) return;
      const cardHeight = feedRef.current.clientHeight || 0;
      if (!cardHeight) return;
      feedRef.current.scrollTo({ top: nextCardIndex * cardHeight, behavior: "auto" });
    });
  }, [cards, scrollToTicker]);

  return (
    <section
      className="discovery-screen"
      aria-label="Discovery feed"
      ref={feedRef}
      onScroll={(event) => onScrollPositionChange?.(event.currentTarget.scrollTop)}
    >
      {cards.map((card) => (
        <DiscoverySignalCard
          card={card}
          key={card.id}
          onOpenCompany={onOpenCompany}
          onToggleWatchlist={onToggleWatchlist}
        />
      ))}
    </section>
  );
}
