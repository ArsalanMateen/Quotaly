import styles from "./QuotaCard.module.css";
import { Icon } from "../../components/ui/Icon.jsx";
import { formatNumber } from "../../lib/format.js";
import { MetricCard } from "./MetricCard.jsx";

export function QuotaCard({ label, icon, used, limit }) {
  const percentage = (used / limit) * 100;

  return (
    <MetricCard
      label={label}
      decoration={
        <span className={styles.icon}>
          <Icon type={icon} />
        </span>
      }
      value={formatNumber(used)}
      allowance={formatNumber(limit)}
      footer={
        <>
          <span>{percentage.toFixed(1)}% of allowance</span>
          <span>Monthly</span>
        </>
      }
    >
      <div
        className={styles.progress}
        role="progressbar"
        aria-label={`${label} quota`}
        aria-valuenow={Math.min(used, limit)}
        aria-valuemin={0}
        aria-valuemax={limit}
      >
        <span
          className={styles.bar}
          style={{ width: `${Math.min(100, percentage)}%` }}
        />
      </div>
    </MetricCard>
  );
}
