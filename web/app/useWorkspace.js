import { useCallback } from 'react';
import { quotaly } from '../lib/api/quotaly.js';
import { hasWorkspaceToken } from '../lib/api/client.js';
import { useAsyncAction } from '../hooks/useAsyncAction.js';
import { useSession } from '../features/workspace/useSession.js';
import { useWorkspaceData } from '../features/workspace/useWorkspaceData.js';
import { useGeneration } from '../features/metering/useGeneration.js';

export function useWorkspace() {
  const identity = useSession();
  const { session, activate, invalidate } = identity;
  const data = useWorkspaceData(session);
  const handleError = useCallback((error) => {
    if (error.status === 401 && session) invalidate(session.id);
  }, [session, invalidate]);
  const operation = useAsyncAction(handleError);
  const { run } = operation;
  const refreshAfterMutation = useCallback(async () => {
    try { await data.refresh(); } catch { void 0; }
  }, [data.refresh]);
  const generation = useGeneration(session, run, refreshAfterMutation);

  return {
    session,
    snapshot: data.snapshot,
    busy: operation.busy,
    loading: identity.loading,
    canResume: hasWorkspaceToken(),
    isGenerating: generation.isGenerating,
    notice: operation.notice || ((data.error || identity.error)
      ? { error: true, text: (data.error || identity.error).message }
      : null),
    dismissNotice() {
      operation.dismiss();
      data.dismissError();
      identity.dismissError();
    },
    actions: {
      ...generation,
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
      refresh: () => run(() => data.refresh()),
    },
  };
}
