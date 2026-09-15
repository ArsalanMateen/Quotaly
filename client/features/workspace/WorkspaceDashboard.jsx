import styles from "./WorkspaceDashboard.module.css";
import { Notice } from "../../components/ui/Notice.jsx";
import { UsageMetrics } from "../metering/UsageMetrics.jsx";
import { GenerationForm } from "../metering/GenerationForm.jsx";
import { ActivityTable } from "../metering/ActivityTable.jsx";
import { BillingPlans } from "../billing/BillingPlans.jsx";

export function WorkspaceDashboard({
  page,
  snapshot,
  busy,
  isGenerating,
  lastResult,
  notice,
  dismissNotice,
  actions,
}) {
  const { usage, events } = snapshot;

  return (
    <>
      {notice && notice.page === page && (
        <Notice
          error={notice.error}
          expiresAt={notice.expiresAt}
          onDismiss={dismissNotice}
        >
          {notice.text}
        </Notice>
      )}
      {usage.paymentRequired && (
        <Notice error>
          Your subscription needs payment. New usage is paused; existing usage
          is still available.
        </Notice>
      )}
      <div hidden={page !== "overview"}>
        <div className={styles.metricsSection}>
          <UsageMetrics
            used={usage.used}
            limits={usage.limits}
            costMicroUsd={usage.costMicroUsd}
          />
        </div>

        <div className={styles.playgroundSection}>
          <GenerationForm
            busy={busy}
            generating={isGenerating}
            lastResult={lastResult}
            onGenerate={actions.generate}
            paymentRequired={usage.paymentRequired}
          />
        </div>
      </div>
      {page === "billing" && (
        <BillingPlans
          currentPlan={usage.plan.id}
          paymentRequired={usage.paymentRequired}
          billingConfigured={usage.billingConfigured}
          busy={busy}
          onCheckout={actions.checkout}
        />
      )}
      {page === "activity" && <ActivityTable events={events} />}
    </>
  );
}
