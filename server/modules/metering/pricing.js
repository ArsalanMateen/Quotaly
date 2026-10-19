// Gemini 2.5 Flash standard paid-tier rates, USD per 1M text tokens.
// Source: https://ai.google.dev/gemini-api/docs/pricing
export const PRICING = Object.freeze({
  version: "gemini-2.5-flash-standard-2025-06",
  provider: "Google Gemini",
  model: "gemini-2.5-flash",
  currency: "USD",
  mode: "standard",
  unit: "USD per 1M tokens",
  input: 0.3,
  cachedInput: 0.03,
  output: 2.5,
  sourceUrl: "https://ai.google.dev/gemini-api/docs/pricing",
});

export function price(input) {
  const freshInputTokens = Math.max(0, input.inputTokens - (input.cachedInputTokens || 0));
  return Math.round(
    freshInputTokens * PRICING.input + (input.cachedInputTokens || 0) * PRICING.cachedInput +
      input.outputTokens * PRICING.output,
  );
}
