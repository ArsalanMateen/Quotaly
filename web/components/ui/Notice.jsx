import { useEffect, useRef, useState } from 'react';
import styles from './Notice.module.css';

const DISPLAY_DURATION_MS = 5000;
const EXIT_DURATION_MS = 400;

export function Notice({ children, error = false, expiresAt, onDismiss }) {
  const [present, setPresent] = useState(true);
  const [leaving, setLeaving] = useState(false);
  const dismissRef = useRef(onDismiss);

  dismissRef.current = onDismiss;

  useEffect(() => {
    const remaining = expiresAt ? expiresAt - Date.now() : DISPLAY_DURATION_MS;

    if (remaining <= 0) {
      setPresent(false);
      dismissRef.current?.();
      return;
    }

    setPresent(true);
    setLeaving(false);

    const exitDelay = Math.max(0, remaining - EXIT_DURATION_MS);
    const exitTimer = window.setTimeout(() => setLeaving(true), exitDelay);
    const dismissTimer = window.setTimeout(() => {
      setPresent(false);
      dismissRef.current?.();
    }, remaining);

    return () => {
      window.clearTimeout(exitTimer);
      window.clearTimeout(dismissTimer);
    };
  }, [children, error, expiresAt]);

  if (!present) return null;

  const classNames = [
    styles.notice,
    error && styles['notice--error'],
    leaving && styles['notice--leaving'],
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={classNames}
      data-state={leaving ? 'leaving' : 'visible'}
      role={error ? 'alert' : 'status'}
    >
      {children}
    </div>
  );
}
