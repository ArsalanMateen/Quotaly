import { useCallback, useRef, useState } from 'react';
import { quotaly, checkoutDestination } from '../lib/api/quotaly.js';
import { hasWorkspaceToken } from '../lib/api/client.js';
import { useAsyncAction } from '../hooks/useAsyncAction.js';
import { useSession } from '../features/workspace/useSession.js';
import { useWorkspaceData } from '../features/workspace/useWorkspaceData.js';
import { useGeneration } from '../features/metering/useGeneration.js';

export function useWorkspace(currentPage = 'overview') {
  const currentPageRef = useRef(currentPage);
  currentPageRef.current = currentPage;

  const identity = useSession();
  const { session, activate, invalidate } = identity;
  const data = useWorkspaceData(session, invalidate);
  const handleError = useCallback(
    (error) => {
      if (error.status === 401 && session) invalidate(session.id);
    },
    [session, invalidate],
  );
  const operation = useAsyncAction(handleError);
  const { run } = operation;
  const refresh = data.refresh;
  const refreshAfterMutation = useCallback(async () => {
    try {
      await refresh();
    } catch {
      // The workspace data hook displays refresh errors.
    }
  }, [refresh]);
  const generation = useGeneration(session, run, refreshAfterMutation);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const actions = {
    ...generation,
    startSandbox: () =>
      run(async (signal) => {
        await quotaly.startSandbox(signal);

        if (!signal.aborted) activate();
      }, 'connect'),
    startFresh: () =>
      run(async (signal) => {
        await quotaly.endSandbox(signal).catch(() => {});
        await quotaly.startSandbox(signal);

        if (!signal.aborted) activate();
      }, 'connect'),
    disconnect: () => {
      quotaly.disconnect();
      invalidate(session?.id);
    },
    resetUsage: () =>
      run(async (signal) => {
        await quotaly.resetSandbox(signal);

        if (signal.aborted) return;
        await refreshAfterMutation();

        return "Usage has been reset. You're ready to start fresh.";
      }, 'overview'),
    checkout: () =>
      run(async (signal) => {
        const result = await quotaly.checkout(signal);

        if (!signal.aborted) window.location.assign(checkoutDestination(result.url));
      }, 'billing'),
    refresh: () =>
      run(async () => {
        setIsRefreshing(true);
        try {
          await data.refresh();
        } finally {
          setIsRefreshing(false);
        }
      }, currentPageRef.current),
  };
  const backgroundError = data.error || identity.error;

  return {
    session,
    snapshot: data.snapshot,
    actions,
    busy: operation.busy,
    loading: identity.loading,
    canResume: hasWorkspaceToken(),
    isGenerating: generation.isGenerating,
    isRefreshing,
    notice:
      operation.notice ||
      (backgroundError
        ? { error: true, text: backgroundError.message, page: currentPageRef.current }
        : null),
    dismissNotice() {
      operation.dismiss();
      data.dismissError();
      identity.dismissError();
    },
  };
}
