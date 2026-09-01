import styles from "./Button.module.css";

export function Button({
  children,
  variant = "primary",
  type = "button",
  className = "",
  disabled = false,
  loading = false,
  ...props
}) {
  const classNames = [
    styles.root,
    styles[variant],
    loading && styles.loading,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type={type}
      className={classNames}
      disabled={disabled || loading}
      aria-busy={loading ? "true" : undefined}
      {...props}
    >
      {loading ? (
        <span className={styles.spinner} aria-hidden="true" />
      ) : (
        children
      )}
    </button>
  );
}
