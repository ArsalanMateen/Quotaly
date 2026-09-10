import { quotaly } from '../lib/api/quotaly.js';
import { hasWorkspaceToken } from '../lib/api/client.js';
import { useAsyncAction } from '../hooks/useAsyncAction.js';
import { useSession } from '../features/workspace/useSession.js';

export function useWorkspace() {
  const identity = useSession();
  const operation = useAsyncAction();
  const { session, activate, invalidate } = identity;
  const { run } = operation;

  return {
    session,
    busy: operation.busy,
    loading: identity.loading,
    canResume: hasWorkspaceToken(),
    notice: operation.notice || (identity.error ? { error: true, text: identity.error.message } : null),
    dismissNotice() {
      operation.dismiss();
      identity.dismissError();
    },
    actions: {
      startSandbox: () => run(async (signal) => {
        await quotaly.startSandbox(signal);
        if (!signal.aborted) activate();
      }),
      startFresh: () => run(async (signal) => {
        await quotaly.endSandbox(signal).catch(() => {});
        await quotaly.startSandbox(signal);
        if (!signal.aborted) activate();
      }),
      disconnect: () => {
        quotaly.disconnect();
        invalidate(session?.id);
      },
    },
  };
}
