import { useCallback, useEffect, useRef, useState } from 'react';
import { quotaly } from '../../lib/api/quotaly.js';

export function useWorkspaceData(session, onUnauthorized) {
  const [result, setResult] = useState({ sessionId: null, snapshot: null, error: null });
  const pending = useRef(null);
  const refresh = useCallback(
    async () => {
      if (!session) return;

      pending.current?.abort();
      const controller = new AbortController();

      pending.current = controller;

      try {
        const snapshot = await quotaly.workspace(controller.signal);

        if (!controller.signal.aborted && pending.current === controller) {
          setResult({ sessionId: session.id, snapshot, error: null });
        }

        return snapshot;
      } catch (error) {
        if (!controller.signal.aborted && pending.current === controller) {
          setResult((current) => ({
            snapshot: current.sessionId === session.id ? current.snapshot : null,
            sessionId: session.id,
            error,
          }));

          if (error.status === 401) onUnauthorized(session.id);
        }

        throw error;
      } finally {
        if (pending.current === controller) pending.current = null;
      }
    },
    [session, onUnauthorized],
  );

  useEffect(() => {
    if (!session) return;
    const refreshWhenVisible = () => {
      if (document.visibilityState === 'hidden' || pending.current) return;

      void refresh().catch(() => {});
    };

    refreshWhenVisible();

    document.addEventListener('visibilitychange', refreshWhenVisible);

    return () => {
      document.removeEventListener('visibilitychange', refreshWhenVisible);
      pending.current?.abort();
      pending.current = null;
    };
  }, [session, refresh]);

  const dismissError = useCallback(() => setResult((current) => ({ ...current, error: null })), []);

  return {
    snapshot: result.sessionId === session?.id ? result.snapshot : null,
    error: result.error,
    refresh,
    dismissError,
  };
}
