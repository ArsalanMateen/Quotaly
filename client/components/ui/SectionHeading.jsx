import styles from "./SectionHeading.module.css";

export function SectionHeading({
  title,
  description,
  children,
  className = "",
}) {
  const containerClass = [styles.root, className].filter(Boolean).join(" ");

  return (
    <div className={containerClass}>
      <div>
        <h2 className={styles.title}>{title}</h2>
        {description && <p className={styles.description}>{description}</p>}
      </div>
      {children}
    </div>
  );
}
