import { useCallback, useEffect, useRef, useState } from 'react';

const NOTICE_DURATION_MS = 5000;

export function useAsyncAction(onError) {
  const pending = useRef(null);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState(null);
  const timerRef = useRef(null);

  const clearNoticeTimer = useCallback(() => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const dismiss = useCallback(() => {
    clearNoticeTimer();
    setNotice(null);
  }, [clearNoticeTimer]);

  const scheduleNotice = useCallback(
    (newNotice) => {
      clearNoticeTimer();
      const expiresAt = Date.now() + NOTICE_DURATION_MS;
      setNotice({ ...newNotice, expiresAt });
      timerRef.current = window.setTimeout(() => {
        setNotice(null);
        timerRef.current = null;
      }, NOTICE_DURATION_MS);
    },
    [clearNoticeTimer],
  );

  useEffect(
    () => () => {
      pending.current?.abort();
      pending.current = null;
      clearNoticeTimer();
    },
    [clearNoticeTimer],
  );

  const run = useCallback(
    async (operation, page) => {
      if (pending.current) return false;
      const controller = new AbortController();

      pending.current = controller;
      setBusy(true);
      dismiss();

      try {
        const message = await operation(controller.signal);

        if (controller.signal.aborted) return false;

        if (message) scheduleNotice({ text: message, page });

        return true;
      } catch (error) {
        if (!controller.signal.aborted && error.name !== 'AbortError') {
          onError?.(error);
          scheduleNotice({ error: true, text: error.message, page });
        }

        return false;
      } finally {
        if (pending.current === controller) {
          pending.current = null;
          setBusy(false);
        }
      }
    },
    [onError, dismiss, scheduleNotice],
  );

  return { busy, notice, dismiss, run, scheduleNotice };
}
