import styles from "./MetricCard.module.css";

export function MetricCard({
  label,
  decoration,
  value,
  allowance,
  footer,
  tone,
  children,
}) {
  const cardClasses = [
    styles.root,
    tone === "cost" && styles.cost,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <article className={cardClasses}>
      <div className={styles.label}>
        {label}
        {decoration}
      </div>
      <div className={styles.value}>
        {value}
        {allowance && (
          <span className={styles.allowance}>/ {allowance}</span>
        )}
      </div>
      {children}
      {footer && <div className={styles.footer}>{footer}</div>}
    </article>
  );
}
