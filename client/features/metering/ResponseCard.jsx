import styles from "./ResponseCard.module.css";
import { MarkdownView } from "../../components/ui/MarkdownView.jsx";

export function ResponseCard({ lastResult, generating }) {
  if (!generating && !lastResult) {
    return null;
  }

  if (!lastResult) {
    return (
      <div className={styles.card} aria-live="polite" aria-busy="true">
        <div className={styles.skeletonContainer}>
          <div className={styles.skeletonHeader}>
            <div className={styles.skeletonSpinner} />
            <span className={styles.skeletonStatus}>
              AI is thinking and drafting your response…
            </span>
          </div>
          <div className={styles.skeletonLines}>
            <div className={styles.skeletonLine} />
          </div>
        </div>
      </div>
    );
  }

  const { result } = lastResult;

  return (
    <div className={styles.card} aria-live="polite">
      <div className={styles.content}>
        <MarkdownView content={result} />
      </div>
    </div>
  );
}
