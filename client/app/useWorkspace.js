import { useCallback, useRef } from "react";
import { quotaly, checkoutDestination } from "../lib/api/quotaly.js";
import { hasWorkspaceToken } from "../lib/api/client.js";
import { useAsyncAction } from "../hooks/useAsyncAction.js";
import { useSession } from "../features/workspace/useSession.js";
import { useWorkspaceData } from "../features/workspace/useWorkspaceData.js";
import { useGeneration } from "../features/metering/useGeneration.js";

export function useWorkspace(currentPage) {
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

  const hasEvents = data.snapshot ? data.snapshot.events.length > 0 : undefined;
  const generation = useGeneration(
    session,
    run,
    refreshAfterMutation,
    hasEvents,
  );

  const actions = {
    ...generation,

    startSandbox: () =>
      run(async (signal) => {
        await quotaly.startSandbox(signal);

        if (!signal.aborted) activate();
      }, "connect"),

    startFresh: () =>
      run(async (signal) => {
        await quotaly.endSandbox(signal).catch(() => {});
        await quotaly.startSandbox(signal);

        if (!signal.aborted) {
          generation.clearLast();
          activate();
        }
      }, "connect"),

    disconnect: () => {
      quotaly.disconnect();
      invalidate(session.id);
    },

    resetUsage: () =>
      run(async (signal) => {
        await quotaly.resetSandbox(signal);

        if (signal.aborted) return;
        generation.clearLast();
        await refreshAfterMutation();

        return "Usage has been reset. You're ready to start fresh.";
      }, "overview"),

    checkout: () =>
      run(async (signal) => {
        const result = await quotaly.checkout(signal);

        if (!signal.aborted)
          window.location.assign(checkoutDestination(result.url));
      }, "billing"),

    refresh: () =>
      run(async () => {
        await data.refresh();
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
    notice:
      operation.notice ||
      (backgroundError
        ? {
            error: true,
            text: backgroundError.message,
            page: currentPageRef.current,
          }
        : null),
    dismissNotice() {
      operation.dismiss();
      data.dismissError();
      identity.dismissError();
    },
  };
}
