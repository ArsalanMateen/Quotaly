import styles from "./GenerationForm.module.css";
import formStyles from "../../components/ui/Form.module.css";
import { Button } from "../../components/ui/Button.jsx";
import { Panel } from "../../components/ui/Panel.jsx";
import { useId, useState } from "react";
import { SectionHeading } from "../../components/ui/SectionHeading.jsx";

const fields = [
  {
    id: "inputTokens",
    label: "Input tokens",
    hint: "All input, including cached tokens",
    initial: "1000",
  },
  {
    id: "cachedInputTokens",
    label: "Cached input",
    hint: "Already included in input tokens",
    initial: "400",
  },
  {
    id: "outputTokens",
    label: "Output tokens",
    hint: "All output, including reasoning",
    initial: "300",
  },
  {
    id: "reasoningTokens",
    label: "Reasoning tokens",
    hint: "Already included in output tokens",
    initial: "100",
  },
];

export function GenerationForm({
  busy,
  canRetry,
  onGenerate,
  onRetry,
  isSandbox,
  used,
  limits,
  paymentRequired,
  onResetUsage,
}) {
  const formId = useId();
  const [form, setForm] = useState(() =>
    Object.fromEntries(fields.map((field) => [field.id, field.initial])),
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const hasUsage = used.tokens > 0 || used.apiCalls > 0;
  const quotaReached =
    used.tokens >= limits.tokens || used.apiCalls >= limits.apiCalls;

  function reachLimit() {
    onGenerate({
      inputTokens: Math.max(0, limits.tokens - used.tokens),
      cachedInputTokens: 0,
      outputTokens: 0,
      reasoningTokens: 0,
    });
  }

  async function submit(event) {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      await onGenerate(
        Object.fromEntries(
          Object.entries(form).map(([key, value]) => [
            key,
            value === "" ? null : Number(value),
          ]),
        ),
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Panel as="section">
      <SectionHeading
        title="Make a little usage."
        description="Simulate a generation and watch the numbers move."
      />
      <form className={styles.form} onSubmit={submit}>
        <div className={styles.fields}>
          {fields.map(({ id, label, hint }) => (
            <div key={id}>
              <label
                className={formStyles.label}
                htmlFor={`${formId}-${id}`}
              >
                {label}
              </label>
              <input
                className={formStyles.input}
                id={`${formId}-${id}`}
                type="number"
                min="0"
                max="10000000"
                step="1"
                required
                value={form[id]}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    [id]: event.target.value,
                  }))
                }
                aria-describedby={`${formId}-${id}-hint`}
              />
              <small
                id={`${formId}-${id}-hint`}
                className={styles.hint}
              >
                {hint}
              </small>
            </div>
          ))}
        </div>
        <div className={styles.actions}>
          <Button type="submit" variant="primary" disabled={busy}>
            {busy && isSubmitting ? "Working\u2026" : "Run generation"}
          </Button>
          <Button
            type="button"
            variant="secondary"
            disabled={busy || !canRetry}
            onClick={onRetry}
          >
            Retry last request
          </Button>
          {isSandbox && (
            <>
              <Button
                type="button"
                variant="secondary"
                disabled={busy || !hasUsage}
                onClick={onResetUsage}
              >
                Reset usage
              </Button>
              <Button
                type="button"
                variant="secondary"
                disabled={busy || paymentRequired || quotaReached}
                onClick={reachLimit}
              >
                Reach limit
              </Button>
            </>
          )}
        </div>
      </form>
    </Panel>
  );
}
