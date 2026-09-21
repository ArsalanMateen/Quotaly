import { useState } from 'react';
import { quotaly } from '../../lib/api/quotaly.js';
import { formatMoney, formatNumber } from '../../lib/format.js';

export function useGeneration(session, run, refresh) {
  const [last, setLast] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const canRetry = Boolean(session && last?.sessionId === session.id);

  function submit(body, replay = false) {
    if (!session || (replay && !canRetry)) return Promise.resolve(false);

    return run(
      async (signal) => {
        setIsGenerating(true);
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
          await refresh();

          return replay
            ? 'Showing previous result. No extra usage was charged.'
            : `Generation recorded. ${formatNumber(result.usage.tokens)} tokens · ${formatMoney(result.costMicroUsd)}.`;
        } finally {
          setIsGenerating(false);
        }
      },
      'overview',
    );
  }

  return {
    generate: (body) => submit(body),
    retry: () => submit(null, true),
    canRetry,
    isGenerating,
  };
}
