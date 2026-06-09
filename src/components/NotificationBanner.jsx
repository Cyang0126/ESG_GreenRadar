export default function NotificationBanner({ alert, onOpen, onClose }) {
  if (!alert) return null;

  return (
    <aside className="notification-banner" role="status" aria-live="assertive">
      <div className="notification-banner-copy">
        <strong>{alert.companyName}</strong>
        <p>{alert.text}</p>
      </div>
      <div className="notification-banner-actions">
        <button onClick={onOpen}>See Why</button>
        <button className="notification-banner-close" onClick={onClose} aria-label="Dismiss alert">
          Close
        </button>
      </div>
    </aside>
  );
}
