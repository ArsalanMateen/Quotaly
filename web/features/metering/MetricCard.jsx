import styles from './MetricCard.module.css';

export function MetricCard({ label, decoration, value, allowance, footer, tone, children }) {
  const cardClasses = [
    styles.metricCard,
    tone === 'cost' && styles['metricCard--cost'],
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <article className={cardClasses}>
      <div className={styles.metricCard__label}>
        {label}
        {decoration}
      </div>
      <div className={styles.metricCard__value}>
        {value}
        {allowance && <span className={styles.metricCard__allowance}>/ {allowance}</span>}
      </div>
      {children}
      {footer && <div className={styles.metricCard__footer}>{footer}</div>}
    </article>
  );
}
