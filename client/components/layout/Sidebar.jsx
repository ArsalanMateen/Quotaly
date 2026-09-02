import styles from "./Sidebar.module.css";
import { Icon } from "../ui/Icon.jsx";

export function Sidebar({ page, navigation, onNavigate }) {
  return (
    <aside className={styles.root}>
      <a className={styles.brand} href="/" aria-label="Quotaly home">
        <img
          src="/favicon.svg"
          alt=""
          className={styles.brandMark}
          width="35"
          height="35"
        />
        uotaly
      </a>
      <div className={styles.navLabel}>WORKSPACE</div>
      <nav aria-label="Main navigation">
        {navigation.map((item) => {
          const isActive = page === item.id;
          const itemClass = [styles.item, isActive && styles.itemActive]
            .filter(Boolean)
            .join(" ");

          return (
            <button
              key={item.id}
              type="button"
              className={itemClass}
              aria-current={isActive ? "page" : undefined}
              onClick={() => onNavigate(item.id)}
            >
              <Icon type={item.icon} />
              {item.label}
              {isActive && <span className={styles.dot} />}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
