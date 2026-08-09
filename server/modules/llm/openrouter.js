import { AppError } from "../../shared/errors.js";

export function createOpenRouterClient({
  openRouterApiKey,
  openRouterModel = "openrouter/free",
}) {
  return {
    async countTokens(prompt) {
      if (!openRouterApiKey) {
        throw new AppError(
          503,
          "llm_not_configured",
          "OpenRouter is not configured. Set OPENROUTER_API_KEY on the server.",
        );
      }
      const text = prompt.trim();
      return Math.max(1, Math.ceil(text.length / 3.8));
    },

    async generate({ prompt, maxOutputTokens }) {
      if (!openRouterApiKey) {
        throw new AppError(
          503,
          "llm_not_configured",
          "OpenRouter is not configured. Set OPENROUTER_API_KEY on the server.",
        );
      }

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 60_000);

      try {
        const response = await fetch(
          "https://openrouter.ai/api/v1/chat/completions",
          {
            method: "POST",
            headers: {
              "content-type": "application/json",
              authorization: `Bearer ${openRouterApiKey}`,
              "http-referer": "http://localhost:3000",
              "x-title": "Quotaly",
            },
            body: JSON.stringify({
              model: openRouterModel,
              messages: [{ role: "user", content: prompt }],
              max_tokens: maxOutputTokens,
              reasoning: { effort: "low" },
            }),
            signal: controller.signal,
          },
        );

        if (!response.ok) {
          const status = response.status;
          if (status === 429) {
            throw new AppError(
              503,
              "llm_rate_limited",
              "OpenRouter is temporarily rate limited. Please try again shortly.",
            );
          }
          if (status === 401 || status === 403) {
            throw new AppError(
              503,
              "llm_auth_failed",
              "OpenRouter authentication failed. Check the server API key.",
            );
          }
          if (status >= 500) {
            throw new AppError(
              503,
              "llm_unavailable",
              "OpenRouter is temporarily unavailable. Please try again.",
            );
          }
          const errData = await response.json().catch(() => ({}));
          throw new AppError(
            422,
            "llm_request_rejected",
            errData.error?.message ||
              "OpenRouter could not process this prompt. Please revise it and try again.",
          );
        }

        const data = await response.json();
        const choice = data.choices?.[0]?.message;
        const text = (choice?.content || choice?.reasoning || "").trim();
        const usage = data.usage || {};

        if (!text) {
          throw new AppError(
            422,
            "llm_no_output",
            "OpenRouter did not return text for this prompt.",
          );
        }

        const inputTokens = Number.isInteger(usage.prompt_tokens)
          ? usage.prompt_tokens
          : Math.max(1, Math.ceil(prompt.length / 3.8));
        const outputTokens = Number.isInteger(usage.completion_tokens)
          ? usage.completion_tokens
          : Math.max(1, Math.ceil(text.length / 3.8));
        const reasoningTokens =
          usage.completion_tokens_details?.reasoning_tokens || 0;

        return {
          text,
          model: data.model || openRouterModel,
          inputTokens,
          outputTokens,
          reasoningTokens,
        };
      } catch (error) {
        if (error instanceof AppError) throw error;
        if (error.name === "AbortError") {
          throw new AppError(
            504,
            "llm_timeout",
            "OpenRouter took too long to respond. Please try again.",
          );
        }
        throw new AppError(
          503,
          "llm_unavailable",
          "Could not reach OpenRouter. Please try again.",
        );
      } finally {
        clearTimeout(timeout);
      }
    },
  };
}
