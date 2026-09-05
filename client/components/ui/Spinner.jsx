import styles from "./Spinner.module.css";

export function Spinner({ className = "", size = "default", label = "Loading" }) {
  return (
    <div
      className={[styles.wrap, className].filter(Boolean).join(" ")}
      role="status"
    >
      <div
        className={[styles.spinner, styles[size]].filter(Boolean).join(" ")}
        aria-hidden="true"
      />
      <span className={styles.srOnly}>{label}</span>
    </div>
  );
}
