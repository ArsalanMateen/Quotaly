import styles from "./GenerationForm.module.css";
import formStyles from "../../components/ui/Form.module.css";
import { Button } from "../../components/ui/Button.jsx";
import { Panel } from "../../components/ui/Panel.jsx";
import { useId, useState } from "react";
import { SectionHeading } from "../../components/ui/SectionHeading.jsx";

export function GenerationForm({
  busy, canRetry, onGenerate, onRetry, isSandbox, used, limits,
  paymentRequired, onResetUsage, lastResult,
}) {
  const formId = useId();
  const [prompt, setPrompt] = useState("");
  const [maxOutputTokens, setMaxOutputTokens] = useState("1024");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const hasUsage = used.tokens > 0 || used.apiCalls > 0;

  async function submit(event) {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      await onGenerate({ prompt: prompt.trim(), maxOutputTokens: Number(maxOutputTokens) });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Panel as="section">
      <SectionHeading
        title="Generate with Gemini."
        description="Send a prompt to Google Gemini and meter the provider-reported token usage and cost."
      />
      <form className={styles.form} onSubmit={submit}>
        <div>
          <label className={formStyles.label} htmlFor={`${formId}-prompt`}>Prompt</label>
          <textarea
            className={formStyles.input}
            id={`${formId}-prompt`}
            rows="5"
            maxLength="12000"
            required
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            placeholder="Ask Gemini to explain, summarize, brainstorm, or write something…"
            aria-describedby={`${formId}-prompt-hint`}
          />
          <small id={`${formId}-prompt-hint`} className={styles.hint}>
            Up to 12,000 characters. Your Gemini API key stays on the server.
          </small>
        </div>
        <div className={styles.fields} style={{ marginTop: 18 }}>
          <div>
            <label className={formStyles.label} htmlFor={`${formId}-max-output`}>Maximum output tokens</label>
            <input
              className={formStyles.input}
              id={`${formId}-max-output`}
              type="number"
              min="1"
              max="8192"
              step="1"
              required
              value={maxOutputTokens}
              onChange={(event) => setMaxOutputTokens(event.target.value)}
            />
            <small className={styles.hint}>Actual output is metered from Gemini usage metadata.</small>
          </div>
        </div>
        {lastResult && (
          <section aria-live="polite" style={{ marginTop: 20 }}>
            <h3>Gemini response</h3>
            <p style={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}>{lastResult.result}</p>
            <small className={styles.hint}>
              {lastResult.model} · {lastResult.usage.inputTokens.toLocaleString()} input + {lastResult.usage.outputTokens.toLocaleString()} output tokens
            </small>
          </section>
        )}
        <div className={styles.actions}>
          <Button type="submit" variant="primary" disabled={busy || paymentRequired || !prompt.trim()}>
            {busy && isSubmitting ? "Generating…" : "Generate response"}
          </Button>
          <Button type="button" variant="secondary" disabled={busy || !canRetry} onClick={onRetry}>
            Retry last request
          </Button>
          {isSandbox && (
            <Button type="button" variant="secondary" disabled={busy || !hasUsage} onClick={onResetUsage}>
              Reset usage
            </Button>
          )}
        </div>
      </form>
    </Panel>
  );
}
