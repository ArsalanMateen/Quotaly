import { UsageMetrics } from '../metering/UsageMetrics.jsx';

export function WorkspaceDashboard({ snapshot }) {
  const { usage } = snapshot;
  return (
    <UsageMetrics
      used={usage.used}
      limits={usage.limits}
      costMicroUsd={usage.costMicroUsd}
      pricing={usage.pricing}
    />
  );
}
