import styles from './BillingPlans.module.css';
import labelStyles from '../../components/ui/Label.module.css';
import planAllowanceStyles from './PlanAllowance.module.css';
import { Button } from '../../components/ui/Button.jsx';
import { Panel } from '../../components/ui/Panel.jsx';
import { Icon } from '../../components/ui/Icon.jsx';
import { useState } from 'react';
import { CheckoutGuide } from './CheckoutGuide.jsx';

const plans = [
  {
    id: 'free',
    name: 'Free',
    calls: '1,000',
    tokens: '100,000',
    description: 'Start small. Make every unit count.',
    tag: 'Starter Tier',
  },
  {
    id: 'pro',
    name: 'Pro',
    calls: '10,000',
    tokens: '1,000,000',
    description: 'Higher limits, the same clear accounting.',
    tag: 'More Room to Build',
  },
];

function PlanCard({ plan, currentPlan, paymentRequired, billingConfigured, busy, onCheckout }) {
  const current = currentPlan === plan.id;

  const cardClasses = [
    styles.billingPlans__card,
    plan.id === 'pro' && styles['billingPlans__card--pro'],
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <Panel as="article" className={cardClasses}>
      <span className={labelStyles.tag}>{current ? 'Current Plan' : plan.tag}</span>
      <h2>{plan.name}</h2>
      <p>{plan.description}</p>
      <div className={[planAllowanceStyles.planAllowance, styles.billingPlans__allowance].join(' ')}>
        <Icon type="check" />
        {plan.calls} API calls per month
      </div>
      <div className={[planAllowanceStyles.planAllowance, styles.billingPlans__allowance].join(' ')}>
        <Icon type="check" />
        {plan.tokens} AI tokens per month
      </div>
      {plan.id === 'pro' && (
        <Button
          variant="primary"
          onClick={onCheckout}
          disabled={busy || !billingConfigured || current || paymentRequired}
        >
          {current ? 'Your current plan' : 'Upgrade to Pro'}
        </Button>
      )}
      <small>
        {plan.id === 'pro'
          ? 'Review the subscription price in Checkout.'
          : 'Monthly usage resets on the first day in UTC.'}
      </small>
    </Panel>
  );
}

export function BillingPlans({
  currentPlan,
  paymentRequired,
  billingConfigured,
  busy,
  onCheckout,
}) {
  const [showCheckoutGuide, setShowCheckoutGuide] = useState(false);

  async function continueToCheckout() {
    await onCheckout();
    setShowCheckoutGuide(false);
  }

  return (
    <>
      {showCheckoutGuide && (
        <CheckoutGuide
          busy={busy}
          onCancel={() => setShowCheckoutGuide(false)}
          onContinue={continueToCheckout}
        />
      )}
      <section className={styles.billingPlans}>
        {plans.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            currentPlan={currentPlan}
            paymentRequired={paymentRequired}
            billingConfigured={billingConfigured}
            busy={busy}
            onCheckout={() => setShowCheckoutGuide(true)}
          />
        ))}
        <p className={styles.billingPlans__help}>
          Plan changes take effect immediately and preserve your usage in the current calendar
          month.
        </p>
      </section>
    </>
  );
}
