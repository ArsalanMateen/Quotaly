import styles from './SandboxControls.module.css';
import { Button } from '../../components/ui/Button.jsx';

export function SandboxControls({ used, limits, paymentRequired, busy, onReset, onGenerate }) {
  const quotaReached = used.tokens >= limits.tokens || used.apiCalls >= limits.apiCalls;

  return (
    <section className={styles.sandboxControls} aria-label="Workspace controls">
      <div>
        <strong className={styles.sandboxControls__title}>Your workspace</strong>
        <p className={styles.sandboxControls__description}>
          Test your usage limits and plan upgrades with temporary demo data.
        </p>
      </div>
      <div className={styles.sandboxControls__actions}>
        <Button variant="secondary" disabled={busy} onClick={onReset}>
          Reset usage
        </Button>
        <Button
          variant="secondary"
          disabled={busy || paymentRequired || quotaReached}
          onClick={() =>
            onGenerate({
              inputTokens: Math.max(0, limits.tokens - used.tokens),
              cachedInputTokens: 0,
              outputTokens: 0,
              reasoningTokens: 0,
            })
          }
        >
          Reach token limit
        </Button>
      </div>
    </section>
  );
}
