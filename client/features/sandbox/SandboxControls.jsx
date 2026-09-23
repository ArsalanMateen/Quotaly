import styles from "./SandboxControls.module.css";
import { Button } from "../../components/ui/Button.jsx";
import { Panel } from "../../components/ui/Panel.jsx";

export function SandboxControls({
  used,
  limits,
  paymentRequired,
  busy,
  onReset,
  onGenerate,
}) {
  const hasUsage = used.tokens > 0 || used.apiCalls > 0;
  const quotaReached =
    used.tokens >= limits.tokens || used.apiCalls >= limits.apiCalls;

  return (
    <Panel as="section" className={styles.root} aria-label="Workspace controls">
      <div>
        <strong className={styles.title}>Your workspace</strong>
      </div>
      <div className={styles.actions}>
        <Button
          variant="text"
          className={styles.actionButton}
          disabled={busy || !hasUsage}
          onClick={onReset}
        >
          Reset usage
        </Button>
        <Button
          variant="text"
          className={styles.actionButton}
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
          Reach limit
        </Button>
      </div>
    </Panel>
  );
}
