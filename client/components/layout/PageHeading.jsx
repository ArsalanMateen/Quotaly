import styles from "./PageHeading.module.css";
import { Button } from "../ui/Button.jsx";

export function PageHeading({
  title,
  description,
  onDisconnect,
  disconnectDisabled,
}) {
  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.description}>{description}</p>
        </div>
        {onDisconnect && (
          <Button
            variant="text"
            className={styles.disconnectButton}
            disabled={disconnectDisabled}
            onClick={onDisconnect}
          >
            Disconnect
          </Button>
        )}
      </div>
    </div>
  );
}
