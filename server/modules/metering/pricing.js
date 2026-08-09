export const PRICING = Object.freeze({
  version: "openrouter-free-standard",
  provider: "OpenRouter",
  model: "openrouter/free",
  currency: "USD",
  mode: "standard",
  unit: "USD per 1M tokens",
  input: 0.3,
  cachedInput: 0.03,
  output: 2.5,
  sourceUrl: "https://openrouter.ai/models",
});

export function price(input) {
  const freshInputTokens = input.inputTokens - input.cachedInputTokens;
  return Math.round(
    freshInputTokens * PRICING.input +
      input.cachedInputTokens * PRICING.cachedInput +
      input.outputTokens * PRICING.output,
  );
}
