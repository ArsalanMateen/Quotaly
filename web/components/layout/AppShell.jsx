import styles from './AppShell.module.css';
import { Button } from '../ui/Button.jsx';
import { Sidebar } from './Sidebar.jsx';

export function AppShell({
  connected,
  busy,
  page,
  navigation,
  onNavigate,
  onDisconnect,
  children,
}) {
  return (
    <div className={styles.appShell}>
      <Sidebar page={page.id} navigation={navigation} onNavigate={onNavigate} />
      <main className={styles.appShell__main}>
        <header className={styles.appShell__topbar}>
          <span>
            Workspace <span className={styles.appShell__slash}>/</span>
            <strong className={styles.appShell__title}>{page.label}</strong>
          </span>
          <div className={styles.appShell__actions}>
            {connected && (
              <Button
                variant="text"
                className={styles.appShell__disconnect}
                disabled={busy}
                onClick={onDisconnect}
              >
                Disconnect
              </Button>
            )}
          </div>
        </header>
        <div className={styles.appShell__content}>{children}</div>
      </main>
    </div>
  );
}
