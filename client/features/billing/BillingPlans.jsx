import styles from "./BillingPlans.module.css";
import labelStyles from "../../components/ui/Label.module.css";
import planAllowanceStyles from "./PlanAllowance.module.css";
import { Button } from "../../components/ui/Button.jsx";
import { Panel } from "../../components/ui/Panel.jsx";
import { Icon } from "../../components/ui/Icon.jsx";
import { useState } from "react";
import { CheckoutGuide } from "./CheckoutGuide.jsx";

const plans = [
  {
    id: "free",
    name: "Free",
    calls: "1,000",
    tokens: "100,000",
    description: "A clear allowance. No surprises along the way.",
    tag: "Starter Tier",
  },
  {
    id: "pro",
    name: "Pro",
    calls: "10,000",
    tokens: "1,000,000",
    description: "Higher limits, the same clear accounting.",
    tag: "More Room to Build",
  },
];

function PlanCard({
  plan,
  currentPlan,
  paymentRequired,
  billingConfigured,
  busy,
  onCheckout,
}) {
  const current = currentPlan === plan.id;
  const isPro = plan.id === "pro";

  const cardClasses = [styles.card, isPro && styles.cardPro]
    .filter(Boolean)
    .join(" ");

  return (
    <Panel as="article" className={cardClasses}>
      <div className={styles.top}>
        <span className={isPro ? styles.tagPro : labelStyles.tag}>
          {current ? "Current Plan" : plan.tag}
        </span>
        {isPro && (
          <span className={styles.symbol} aria-hidden="true">
            <Icon type="sparkle" size={24} strokeWidth={1.8} />
          </span>
        )}
      </div>
      <h2 className={isPro ? styles.titlePro : styles.title}>
        {plan.name}
        {isPro && <span className={styles.suffix}>plan</span>}
      </h2>
      <p className={isPro ? styles.descriptionPro : styles.description}>
        {plan.description}
      </p>
      <div className={isPro ? styles.rule : styles.ruleLight} />
      <div
        className={[
          planAllowanceStyles.root,
          styles.allowance,
          isPro && styles.allowancePro,
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <Icon type="check" />
        {plan.calls} API calls per month
      </div>
      <div
        className={[
          planAllowanceStyles.root,
          styles.allowance,
          isPro && styles.allowancePro,
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <Icon type="check" />
        {plan.tokens} AI tokens per month
      </div>
      {isPro && !current && (
        <button
          className={styles.buttonPro}
          onClick={onCheckout}
          disabled={busy || !billingConfigured || paymentRequired}
        >
          {busy ? (
            <span className={styles.proSpinner} aria-hidden="true" />
          ) : (
            "Upgrade to Pro"
          )}
        </button>
      )}
      {!isPro && (
        <small className={styles.small}>
          Monthly usage resets on the first day in UTC.
        </small>
      )}
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
      <section className={styles.root}>
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
      </section>
    </>
  );
}
