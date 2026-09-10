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
    <section className={styles.workspaceConnect}>
      <div className={styles.workspaceConnect__art}>
        <span className={styles.workspaceConnect__orb} />
        <span className={[styles.workspaceConnect__orb, styles['workspaceConnect__orb--secondary']].join(' ')} />
        <div className={styles.workspaceConnect__glyph}>
          <Icon type="pulse" />
        </div>
        <div className={styles.workspaceConnect__caption}>
          A little clarity.
          <br />
          <em>For every call.</em>
        </div>
      </div>
      <div className={styles.workspaceConnect__content}>
        <h2 className={styles.workspaceConnect__title}>
          Your usage story
          <br />
          starts here.
        </h2>
        <p className={styles.workspaceConnect__description}>
          Explore real usage metering in your own temporary workspace. Generate tokens, retry a
          request, and see exactly how quotas work.
        </p>
        <div className={styles.workspaceConnect__actions}>
          <Button
            variant="primary"
            className={styles.workspaceConnect__button}
            onClick={handlePrimary}
            disabled={busy}
          >
            {busy && isPrimaryActive
              ? canResume
                ? 'Resuming workspace…'
                : 'Opening workspace…'
              : canResume
              ? 'Resume Workspace'
              : 'Open Workspace'}
          </Button>
          {canResume && (
            <Button
              variant="text"
              className={styles.workspaceConnect__freshButton}
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
