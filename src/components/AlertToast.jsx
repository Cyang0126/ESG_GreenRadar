export default function AlertToast({ alert, onClose, onOpen }) {
  if (!alert) return null;

  return (
    <aside className="alert-toast" role="status">
      <div>
        <strong>{alert.companyName}</strong>
        <p>{alert.text}</p>
      </div>
      <div className="alert-actions">
        <button onClick={onOpen}>See Why</button>
        <button className="alert-close" onClick={onClose} aria-label="Dismiss alert">
          Close
        </button>
      </div>
    </aside>
  );
}
