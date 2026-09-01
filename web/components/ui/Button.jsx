import styles from './Button.module.css';

export function Button({
  children,
  variant = 'primary',
  type = 'button',
  className = '',
  disabled = false,
  ...props
}) {
  const variantClass = styles[`btn--${variant}`] || styles['btn--primary'];
  const classNames = [styles.btn, variantClass, className].filter(Boolean).join(' ');

  return (
    <button type={type} className={classNames} disabled={disabled} {...props}>
      {children}
    </button>
  );
}
