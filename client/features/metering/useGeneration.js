import { useEffect, useState } from "react";
import { quotaly } from "../../lib/api/quotaly.js";
import { formatMoney, formatNumber } from "../../lib/format.js";

export function useGeneration(session, run, refresh, hasEvents) {
  const [last, setLast] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastResult, setLastResult] = useState(null);

  useEffect(() => {
    setLast(null);
    setLastResult(null);
  }, [session?.id]);

  const canRetry = Boolean(
    session && last?.sessionId === session.id && hasEvents !== false,
  );

  function submit(body, replay = false) {
    if (!session || (replay && !canRetry)) return Promise.resolve(false);

    return run(async (signal) => {
      setIsGenerating(true);
      setLastResult(null);

      try {
        const submission = replay
          ? last
          : {
              sessionId: session.id,
              key: crypto.randomUUID(),
              body: { ...body },
            };

        setLast(submission);

        const result = await quotaly.generate(submission, signal);

        if (signal.aborted) return;
        setLastResult(result);

        await refresh();

        return replay
          ? "Showing previous result. No extra usage was charged."
          : undefined;
      } finally {
        setIsGenerating(false);
      }
    }, "overview");
  }

  return {
    generate: (body) => submit(body),
    retry: () => submit(null, true),
    clearLast: () => {
      setLast(null);
      setLastResult(null);
    },
    lastResult,
    canRetry,
    isGenerating,
  };
}
