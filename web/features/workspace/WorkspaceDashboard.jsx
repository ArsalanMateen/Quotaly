import { Notice } from '../../components/ui/Notice.jsx';
import styles from './WorkspaceDashboard.module.css';
import { SandboxControls } from '../sandbox/SandboxControls.jsx';
import { UsageMetrics } from '../metering/UsageMetrics.jsx';
import { GenerationForm } from '../metering/GenerationForm.jsx';
import { ActivityTable } from '../metering/ActivityTable.jsx';

export function WorkspaceDashboard({ page, snapshot, busy, isGenerating, isRefreshing, notice, dismissNotice, actions }) {
  const { usage, events } = snapshot;
  return (
    <>
      {usage.tenant.isSandbox && page === 'overview' && (
        <SandboxControls
          paymentRequired={usage.paymentRequired}
          used={usage.used}
          limits={usage.limits}
          busy={busy}
          onReset={actions.resetUsage}
          onGenerate={actions.generate}
        />
      )}
      <div hidden={page !== 'overview'}>
        <UsageMetrics used={usage.used} limits={usage.limits} costMicroUsd={usage.costMicroUsd} pricing={usage.pricing} />
        <div className={styles.workspaceDashboard__grid}>
          <GenerationForm busy={busy} generating={isGenerating} canRetry={actions.canRetry} onGenerate={actions.generate} onRetry={actions.retry} />
        </div>
      </div>
      <ActivityTable events={events} busy={busy} refreshing={isRefreshing} onRefresh={actions.refresh} />
    </>
  );
}
