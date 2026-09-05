import styles from './PageHeading.module.css';

export function PageHeading({ title, description }) {
  return (
    <div className={styles.pageHeading}>
      <h1 className={styles.pageHeading__title}>{title}</h1>
      <p className={styles.pageHeading__description}>{description}</p>
    </div>
  );
}
