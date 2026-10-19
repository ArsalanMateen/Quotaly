import styles from './WorkspaceDashboard.module.css';
import { Notice } from '../../components/ui/Notice.jsx';
import { UsageMetrics } from '../metering/UsageMetrics.jsx';
import { GenerationForm } from '../metering/GenerationForm.jsx';
import { ActivityTable } from '../metering/ActivityTable.jsx';
import { PlanSummary } from '../billing/PlanSummary.jsx';
import { BillingPlans } from '../billing/BillingPlans.jsx';

export function WorkspaceDashboard({
  page,
  snapshot,
  busy,
  isGenerating,
  lastResult,
  notice,
  dismissNotice,
  actions,
  onExplorePlan,
}) {
  const { usage, events } = snapshot;

  return (
    <>
      {notice && notice.page === page && (
        <Notice error={notice.error} expiresAt={notice.expiresAt} onDismiss={dismissNotice}>
          {notice.text}
        </Notice>
      )}
      {usage.paymentRequired && (
        <Notice error>
          Your subscription needs payment. New usage is paused; existing usage is still available.
        </Notice>
      )}
      <div hidden={page !== 'overview'}>
        <UsageMetrics
          used={usage.used}
          limits={usage.limits}
          costMicroUsd={usage.costMicroUsd}
          pricing={usage.pricing}
        />
        <div className={styles.grid}>
          <GenerationForm
            busy={busy}
            generating={isGenerating}
            lastResult={lastResult}
            canRetry={actions.canRetry}
            onGenerate={actions.generate}
            onRetry={actions.retry}
            isSandbox={usage.tenant.isSandbox}
            used={usage.used}
            limits={usage.limits}
            paymentRequired={usage.paymentRequired}
            onResetUsage={actions.resetUsage}
          />
          <PlanSummary
            plan={usage.plan}
            limits={usage.limits}
            resetsAt={usage.resetsAt}
            onExplore={onExplorePlan}
          />
        </div>
      </div>
      {page === 'billing' && (
        <BillingPlans
          currentPlan={usage.plan.id}
          paymentRequired={usage.paymentRequired}
          billingConfigured={usage.billingConfigured}
          busy={busy}
          onCheckout={actions.checkout}
        />
      )}
      {page !== 'billing' && (
        <ActivityTable events={events} />
      )}
    </>
  );
}
