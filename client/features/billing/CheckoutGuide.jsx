import { Button } from "../../components/ui/Button.jsx";
import styles from "./CheckoutGuide.module.css";

export function CheckoutGuide({ busy, onCancel, onContinue }) {
  return (
    <div className={styles.root}>
      <section
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="checkout-guide-title"
      >
        <div className={styles.dialogHeader}>
          <h2 id="checkout-guide-title" className={styles.title}>
            Use this card in Stripe Checkout
          </h2>
          <button
            type="button"
            className={styles.closeButton}
            onClick={onCancel}
            aria-label="Close dialog"
            title="Close"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className={styles.card} aria-label="Stripe test card details">
          <div className={styles.cardTop}>
            <span className={styles.chip} aria-hidden="true" />
            <span>TEST CARD</span>
          </div>
          <strong className={styles.number}>4242 4242 4242 4242</strong>
          <div className={styles.cardBottom}>
            <span>
              <small>EXPIRY</small>
              08/28
            </span>
            <span>
              <small>CVC</small>
              842
            </span>
            <span>
              <small>POSTAL CODE</small>
              94103
            </span>
          </div>
        </div>

        <div className={styles.actions}>
          <Button
            variant="primary"
            className={styles.checkoutBtn}
            disabled={busy}
            loading={busy}
            onClick={onContinue}
          >
            Proceed to checkout
          </Button>
        </div>
      </section>
    </div>
  );
}
