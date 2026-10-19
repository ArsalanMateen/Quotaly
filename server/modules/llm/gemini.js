import { AppError } from "../../shared/errors.js";

export function createGeminiClient({ geminiApiKey, geminiModel }) {
  return {
    async generate({ prompt, maxOutputTokens }) {
      if (!geminiApiKey)
        throw new AppError(
          503,
          "llm_not_configured",
          "Gemini is not configured. Set GEMINI_API_KEY on the server.",
        );

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 60_000);

      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(geminiModel)}:generateContent?key=${encodeURIComponent(geminiApiKey)}`,
          {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
              contents: [{ role: "user", parts: [{ text: prompt }] }],
              generationConfig: { maxOutputTokens },
            }),
            signal: controller.signal,
          },
        );

        if (!response.ok) {
          const status = response.status;
          if (status === 429)
            throw new AppError(503, "llm_rate_limited", "Gemini is temporarily rate limited. Please try again shortly.");
          if (status === 401 || status === 403)
            throw new AppError(503, "llm_auth_failed", "Gemini authentication failed. Check the server API key.");
          if (status >= 500)
            throw new AppError(503, "llm_unavailable", "Gemini is temporarily unavailable. Please try again.");
          throw new AppError(422, "llm_request_rejected", "Gemini could not process this prompt. Please revise it and try again.");
        }

        const data = await response.json();
        const text = (data.candidates?.[0]?.content?.parts || [])
          .map((part) => part.text || "")
          .join("")
          .trim();
        const usage = data.usageMetadata || {};

        if (!text)
          throw new AppError(422, "llm_no_output", "Gemini did not return text for this prompt.");

        if (!Number.isInteger(usage.promptTokenCount) || !Number.isInteger(usage.candidatesTokenCount))
          throw new AppError(502, "llm_usage_unavailable", "Gemini did not return token usage, so this generation cannot be metered safely.");

        return {
          text,
          model: data.modelVersion || geminiModel,
          inputTokens: usage.promptTokenCount,
          outputTokens: usage.candidatesTokenCount,
          reasoningTokens: usage.thoughtsTokenCount || 0,
        };
      } catch (error) {
        if (error instanceof AppError) throw error;
        if (error.name === "AbortError")
          throw new AppError(504, "llm_timeout", "Gemini took too long to respond. Please try again.");
        throw new AppError(503, "llm_unavailable", "Could not reach Gemini. Please try again.");
      } finally {
        clearTimeout(timeout);
      }
    },
  };
}
