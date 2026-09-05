import styles from './Sidebar.module.css';
import { Icon } from '../ui/Icon.jsx';

export function Sidebar({ page, navigation, onNavigate }) {
  return (
    <aside className={styles.sidebar}>
      <a className={styles.sidebar__brand} href="/" aria-label="Quotaly home">
        <span className={styles['sidebar__brand-mark']}>
          q<span />
        </span>
        quotaly<span className={styles['sidebar__brand-dot']}>.</span>
      </a>
      <div className={styles['sidebar__nav-label']}>WORKSPACE</div>
      <nav aria-label="Main navigation">
        {navigation.map((item) => {
          const isActive = page === item.id;
          const itemClass = [
            styles.sidebar__item,
            isActive && styles['sidebar__item--active'],
          ]
            .filter(Boolean)
            .join(' ');

          return (
            <button
              key={item.id}
              type="button"
              className={itemClass}
              aria-current={isActive ? 'page' : undefined}
              onClick={() => onNavigate(item.id)}
            >
              <Icon type={item.icon} />
              {item.label}
              {isActive && <span className={styles.sidebar__dot} />}
            </button>
          );
        })}
      </nav>
      <div className={styles.sidebar__footer}>
        <span className={styles.sidebar__logo}>q.</span>
        <span>Built for the details.</span>
      </div>
    </aside>
  );
}
