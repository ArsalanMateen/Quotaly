import styles from './CostCard.module.css';
import { formatMoney } from '../../lib/format.js';
import { MetricCard } from './MetricCard.jsx';

export function CostCard({ costMicroUsd, pricing }) {
  const pricingLabel =
    pricing?.provider && pricing?.model
      ? `${pricing.provider} ${pricing.model} standard rates`
      : 'Current model rates';

  return (
    <MetricCard
      label="Metered cost"
      tone="cost"
      decoration={<span className={styles.costCard__currency}>USD</span>}
      value={formatMoney(costMicroUsd)}
    >
      <div className={styles.costCard__caption}>{pricingLabel}</div>
    </MetricCard>
  );
}
