export const PRICING = Object.freeze({
  version: 'openai-gpt-5.4-standard',
  provider: 'OpenAI',
  model: 'gpt-5.4',
  currency: 'USD',
  mode: 'standard',
  unit: 'USD per 1M tokens',
  input: 2.5,
  cachedInput: 0.25,
  output: 15,
  longContextThreshold: 272_000,
  longContextInputMultiplier: 2,
  longContextOutputMultiplier: 1.5,
  sourceUrl: 'https://developers.openai.com/api/docs/models/gpt-5.4',
});

export function price(input) {
  const isLongContext = input.inputTokens > PRICING.longContextThreshold;
  const inputMultiplier = isLongContext ? PRICING.longContextInputMultiplier : 1;
  const outputMultiplier = isLongContext ? PRICING.longContextOutputMultiplier : 1;
  const freshInputTokens = input.inputTokens - input.cachedInputTokens;

  return Math.round(
    freshInputTokens * PRICING.input * inputMultiplier +
      input.cachedInputTokens * PRICING.cachedInput * inputMultiplier +
      input.outputTokens * PRICING.output * outputMultiplier,
  );
}
