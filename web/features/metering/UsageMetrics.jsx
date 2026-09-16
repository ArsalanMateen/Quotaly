import styles from './UsageMetrics.module.css';
import { QuotaCard } from './QuotaCard.jsx';
import { CostCard } from './CostCard.jsx';

export function UsageMetrics({ used, limits, costMicroUsd, pricing }) {
  return (
    <section className={styles.usageMetrics} aria-label="Monthly usage">
      <QuotaCard label="API calls" icon="grid" used={used.apiCalls} limit={limits.apiCalls} />
      <QuotaCard label="AI tokens" icon="bolt" used={used.tokens} limit={limits.tokens} />
      <CostCard costMicroUsd={costMicroUsd} pricing={pricing} />
    </section>
  );
}
