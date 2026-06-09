export default function NotificationBanner({ notifications = [], onOpen, onClose }) {
  if (notifications.length === 0) return null;

  return (
    <aside className="notification-banner-stack" role="status" aria-live="assertive">
      {notifications.map((notification) => (
        <div className="notification-banner" key={notification.id}>
          <div className="notification-banner-copy">
            <strong>{notification.companyName}</strong>
            <p>{notification.text}</p>
          </div>
          <div className="notification-banner-actions">
            <button onClick={() => onOpen(notification)}>See Why</button>
            <button
              className="notification-banner-close"
              onClick={() => onClose(notification.id)}
              aria-label="Dismiss alert"
            >
              Close
            </button>
          </div>
        </div>
      ))}
    </aside>
  );
}
