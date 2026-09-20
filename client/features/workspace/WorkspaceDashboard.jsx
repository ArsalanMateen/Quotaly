import styles from './WorkspaceDashboard.module.css';
import { Notice } from '../../components/ui/Notice.jsx';
import { Notice } from '../../components/ui/Notice.jsx';
import { Notice } from '../../components/ui/Notice.jsx';
import { UsageMetrics } from '../metering/UsageMetrics.jsx';
import { GenerationForm } from '../metering/GenerationForm.jsx';

export function WorkspaceDashboard({ snapshot, busy, isGenerating, actions }) {
  const { usage } = snapshot;
  return (
    <>
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
          canRetry={actions.canRetry}
          onGenerate={actions.generate}
          onRetry={actions.retry}
        />
      </div>
    </>
  );
}
