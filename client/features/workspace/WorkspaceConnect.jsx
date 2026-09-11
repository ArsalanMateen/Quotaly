import { useState } from 'react';
import styles from './WorkspaceConnect.module.css';
import { Button } from '../../components/ui/Button.jsx';
import { Icon } from '../../components/ui/Icon.jsx';

export function WorkspaceConnect({ busy, canResume, onStartSandbox, onStartFresh }) {
  const [isPrimaryActive, setIsPrimaryActive] = useState(false);

  async function handlePrimary() {
    setIsPrimaryActive(true);
    try {
      await onStartSandbox();
    } finally {
      setIsPrimaryActive(false);
    }
  }

  return (
    <section className={styles.root}>
      <div className={styles.art}>
        <span className={styles.orb} />
        <span className={[styles.orb, styles.orbSecondary].join(' ')} />
        <div className={styles.glyph}>
          <Icon type="pulse" />
        </div>
        <div className={styles.caption}>
          A little clarity
          <br />
          <em>for every call.</em>
        </div>
      </div>
      <div className={styles.content}>
        <h2 className={styles.title}>Your usage story starts here.</h2>
        <p className={styles.description}>
          Explore real usage metering in your own temporary workspace. Generate tokens, retry a
          request, and see exactly how quotas work.
        </p>
        <div className={styles.actions}>
          <Button
            variant="primary"
            className={styles.button}
            onClick={handlePrimary}
            disabled={busy}
          >
            {busy && isPrimaryActive
              ? canResume
                ? 'Resuming workspace\u2026'
                : 'Opening workspace\u2026'
              : canResume
              ? 'Resume Workspace'
              : 'Open Workspace'}
          </Button>
          {canResume && (
            <Button
              variant="text"
              className={styles.freshButton}
              onClick={onStartFresh}
              disabled={busy}
            >
              Start a fresh workspace
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
