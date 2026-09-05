import styles from './SectionHeading.module.css';

export function SectionHeading({ title, description, children, className = '' }) {
  const containerClass = [styles.sectionHeading, className].filter(Boolean).join(' ');

  return (
    <div className={containerClass}>
      <div>
        <h2 className={styles.sectionHeading__title}>{title}</h2>
        {description && <p className={styles.sectionHeading__description}>{description}</p>}
      </div>
      {children}
    </div>
  );
}
