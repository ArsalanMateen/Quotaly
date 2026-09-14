import styles from "./CostCard.module.css";
import { formatMoney } from "../../lib/format.js";
import { MetricCard } from "./MetricCard.jsx";

export function CostCard({ costMicroUsd, pricing }) {
  return (
    <MetricCard
      label="Metered cost"
      tone="cost"
      decoration={<span className={styles.currency}>USD</span>}
      value={formatMoney(costMicroUsd)}
    >
      <div className={styles.caption}>
        {pricing.provider} {pricing.model} standard rates
      </div>
    </MetricCard>
  );
}
