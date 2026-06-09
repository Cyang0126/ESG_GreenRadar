import { NAV_ITEMS } from "../utils/constants.js";
import { ROUTES } from "../app/routes.js";

export default function BottomNav({ activeRoute, onNavigate, unreadRoutes = {} }) {
  return (
    <nav className="bottom-nav" aria-label="Main navigation">
      {NAV_ITEMS.filter((item) => item.id !== ROUTES.search).map((item) => (
        <button
          key={item.id}
          className={activeRoute === item.id ? "active" : ""}
          onClick={() => onNavigate(item.id)}
        >
          {item.label}
          {unreadRoutes[item.id] && <span className="nav-unread-dot" aria-label={`${item.label} unread`} />}
        </button>
      ))}
    </nav>
  );
}
