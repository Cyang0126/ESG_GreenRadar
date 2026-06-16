import { SIGNALS } from "../utils/constants.js";
import { verdictLabel } from "../utils/formatters.js";

export default function SignalBadge({ signal, previousSignal }) {
  const config = SIGNALS[signal];

  return (
    <div className={`signal-badge signal-${config.tone}`}>
      <span>{config.label}</span>
      {previousSignal && previousSignal !== signal && (
        <small>from {verdictLabel(previousSignal)}</small>
      )}
    </div>
  );
}
