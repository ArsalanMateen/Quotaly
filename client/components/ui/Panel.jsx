import styles from "./Panel.module.css";

export function Panel({
  as: Component = "div",
  empty = false,
  className = "",
  children,
  ...props
}) {
  const classNames = [styles.root, empty && styles.empty, className]
    .filter(Boolean)
    .join(" ");

  return (
    <Component className={classNames} {...props}>
      {children}
    </Component>
  );
}

Panel.Empty = function PanelEmpty({ className = "", children, ...props }) {
  return (
    <div
      className={[styles.empty, className].filter(Boolean).join(" ")}
      {...props}
    >
      {children}
    </div>
  );
};
