import { useCallback, useEffect, useRef, useState } from 'react';
import { quotaly } from '../../lib/api/quotaly.js';

export function useWorkspaceData(session) {
  const [result, setResult] = useState({ sessionId: null, snapshot: null, error: null });
  const pending = useRef(null);
  const refresh = useCallback(async () => {
    if (!session) return;
    pending.current?.abort();
    const controller = new AbortController();
    pending.current = controller;
    try {
      const snapshot = await quotaly.workspace(controller.signal);
      if (!controller.signal.aborted) setResult({ sessionId: session.id, snapshot, error: null });
      return snapshot;
    } catch (error) {
      if (!controller.signal.aborted) setResult({ sessionId: session.id, snapshot: null, error });
      throw error;
    } finally {
      if (pending.current === controller) pending.current = null;
    }
  }, [session]);

  useEffect(() => {
    if (!session) return;
    void refresh().catch(() => {});
    return () => pending.current?.abort();
  }, [session, refresh]);

  return {
    snapshot: result.sessionId === session?.id ? result.snapshot : null,
    error: result.error,
    refresh,
    dismissError: () => setResult((current) => ({ ...current, error: null })),
  };
}
