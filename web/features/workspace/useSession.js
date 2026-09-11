import { useCallback, useEffect, useState } from 'react';
import { quotaly } from '../../lib/api/quotaly.js';
import { hasWorkspaceToken, isExplicitlyDisconnected } from '../../lib/api/client.js';

const shouldAutoConnect = () => hasWorkspaceToken() && !isExplicitlyDisconnected();

export function useSession() {
  const [session, setSession] = useState(null);
  const [status, setStatus] = useState(() => ({ loading: shouldAutoConnect(), error: null }));
  const activate = useCallback(() => setSession({ id: crypto.randomUUID() }), []);
  const invalidate = useCallback((expectedId) => {
    setSession((current) => (!expectedId || current?.id === expectedId ? null : current));
  }, []);

  useEffect(() => {
    if (!shouldAutoConnect()) return;

    const controller = new AbortController();

    quotaly
      .session(controller.signal)
      .then((result) => {
        if (controller.signal.aborted) return;
        setStatus({ loading: false, error: null });

        if (result.active) activate();
      })
      .catch((error) => {
        if (!controller.signal.aborted) setStatus({ loading: false, error });
      });

    return () => controller.abort();
  }, [activate]);

  const dismissError = useCallback(
    () => setStatus((current) => ({ ...current, error: null })),
    [],
  );

  return { session, activate, invalidate, loading: status.loading, error: status.error, dismissError };
}
