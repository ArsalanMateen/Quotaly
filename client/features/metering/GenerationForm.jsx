import { useId, useRef, useState } from "react";
import styles from "./GenerationForm.module.css";
import { Button } from "../../components/ui/Button.jsx";
import { Panel } from "../../components/ui/Panel.jsx";
import { SectionHeading } from "../../components/ui/SectionHeading.jsx";
import { ResponseCard } from "./ResponseCard.jsx";

const STARTER_PROMPTS = [
  "Explain quantum computing in simple terms",
  "Draft a polite follow-up email to a client",
  "Write a Python script to sort JSON objects",
];

export function GenerationForm({
  busy,
  generating,
  onGenerate,
  paymentRequired,
  lastResult,
}) {
  const formId = useId();
  const textareaRef = useRef(null);
  const [prompt, setPrompt] = useState("");
  const [maxOutputTokens, setMaxOutputTokens] = useState("4096");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isBusy = busy || generating || isSubmitting;

  async function submit(event) {
    event.preventDefault();
    if (isBusy || paymentRequired) return;
    if (!prompt.trim()) {
      textareaRef.current.focus();
      return;
    }

    setIsSubmitting(true);
    try {
      const success = await onGenerate({
        prompt: prompt.trim(),
        maxOutputTokens: Number(maxOutputTokens) || 4096,
      });
      if (success) {
        setPrompt("");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  function applyStarter(starterText) {
    setPrompt(starterText);
  }

  return (
    <Panel as="section">
      <SectionHeading
        title="AI Playground"
        description="Run live completions and observe token telemetry and costs meter in real time."
      />
      <div className={styles.body}>
        <div className={styles.starters}>
          {STARTER_PROMPTS.map((starter) => (
            <button
              key={starter}
              type="button"
              className={styles.starterBtn}
              onClick={() => applyStarter(starter)}
            >
              {starter}
            </button>
          ))}
        </div>

        <form onSubmit={submit}>
          <div className={styles.promptWrap}>
            <label htmlFor={`${formId}-prompt`} className="visually-hidden">
              AI Prompt
            </label>
            <textarea
              ref={textareaRef}
              className={styles.textarea}
              id={`${formId}-prompt`}
              rows={4}
              maxLength={100000}
              required
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ask a question, request code, summarize text, or draft instructions"
            />
            <div className={styles.textareaFooter}>
              <span className={styles.charCount}>
                {prompt.length.toLocaleString()}/100,000 characters
              </span>
            </div>
          </div>

          <div className={styles.controlsBar}>
            <div className={styles.tokenSettings}>
              <label
                htmlFor={`${formId}-max-output`}
                className={styles.tokenLabel}
              >
                Max tokens
              </label>
              <div className={styles.tokenInputWrap}>
                <input
                  className={styles.tokenInput}
                  id={`${formId}-max-output`}
                  type="number"
                  min="64"
                  max="16384"
                  step="64"
                  required
                  value={maxOutputTokens}
                  onChange={(e) => setMaxOutputTokens(e.target.value)}
                />
              </div>
            </div>

            <div className={styles.actions}>
              <Button
                type="submit"
                variant="primary"
                className={styles.generateBtn}
                disabled={isBusy || paymentRequired}
                loading={generating || isSubmitting}
              >
                Generate response
              </Button>
            </div>
          </div>
        </form>

        <ResponseCard
          lastResult={lastResult}
          generating={generating || isSubmitting}
        />
      </div>
    </Panel>
  );
}
