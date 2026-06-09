import DiscoverySignalCard from "../components/DiscoverySignalCard.jsx";
import { useEffect, useRef } from "react";

export default function DiscoveryScreen({
  cards,
  onOpenCompany,
  onToggleWatchlist,
  initialScrollTop = 0,
  onScrollPositionChange,
  restoreKey = "initial",
}) {
  const feedRef = useRef(null);

  useEffect(() => {
    requestAnimationFrame(() => {
      if (feedRef.current) {
        feedRef.current.scrollTo({ top: initialScrollTop, behavior: "auto" });
      }
    });
  }, [initialScrollTop, restoreKey]);

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
