import { Button } from '../../components/ui/Button.jsx';
import styles from './CheckoutGuide.module.css';

export function CheckoutGuide({ busy, onCancel, onContinue }) {
  return (
    <div className={styles.checkoutGuide}>
      <section
        className={styles.checkoutGuide__dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="checkout-guide-title"
      >
        <div>
          <h2 id="checkout-guide-title" className={styles.checkoutGuide__title}>
            Use this card in Stripe Checkout
          </h2>
          <p className={styles.checkoutGuide__description}>
            These values exercise Stripe’s test payment flow.
          </p>
        </div>

        <div className={styles.checkoutGuide__card} aria-label="Stripe test card details">
          <div className={styles.checkoutGuide__cardTop}>
            <span className={styles.checkoutGuide__chip} aria-hidden="true" />
            <span>TEST CARD</span>
          </div>
          <strong className={styles.checkoutGuide__number}>4242 4242 4242 4242</strong>
          <div className={styles.checkoutGuide__cardBottom}>
            <span>
              <small>EXPIRY</small>
              12/34
            </span>
            <span>
              <small>CVC</small>
              123
            </span>
            <span>
              <small>POSTAL CODE</small>
              12345
            </span>
          </div>
        </div>

        <div className={styles.checkoutGuide__actions}>
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            variant="primary"
            disabled={busy}
            onClick={onContinue}
          >
            {busy ? 'Opening Stripe…' : 'Continue to Stripe'}
          </Button>
        </div>
      </section>
    </div>
  );
}
