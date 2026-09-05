import styles from "./AppShell.module.css";
import { Sidebar } from "./Sidebar.jsx";

export function AppShell({
  page,
  navigation,
  onNavigate,
  children,
}) {
  return (
    <div className={styles.root}>
      <Sidebar page={page.id} navigation={navigation} onNavigate={onNavigate} />
      <main className={styles.main}>
        <div className={styles.content}>{children}</div>
      </main>
    </div>
  );
}
