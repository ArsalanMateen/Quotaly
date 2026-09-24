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
        <h2 id="checkout-guide-title" className={styles.title}>
          Use this card in Stripe Checkout
        </h2>

        <div
          className={styles.card}
          aria-label="Stripe test card details"
        >
          <div className={styles.cardTop}>
            <span className={styles.chip} aria-hidden="true" />
            <span>TEST CARD</span>
          </div>
          <strong className={styles.number}>
            4242 4242 4242 4242
          </strong>
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
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="primary" disabled={busy} onClick={onContinue}>
            {busy ? "Opening Stripe\u2026" : "Continue to Stripe"}
          </Button>
        </div>
      </section>
    </div>
  );
}
