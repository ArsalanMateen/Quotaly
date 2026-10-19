import test from "node:test";
import assert from "node:assert/strict";
import { createGeminiClient } from "../modules/llm/gemini.js";
import { price, PRICING } from "../modules/metering/pricing.js";

const originalFetch = globalThis.fetch;
test.afterEach(() => { globalThis.fetch = originalFetch; });

test("Gemini countTokens returns provider token count", async () => {
  globalThis.fetch = async () => new Response(JSON.stringify({ totalTokens: 17 }), { status: 200 });
  const client = createGeminiClient({ geminiApiKey: "test-key", geminiModel: "gemini-2.5-flash" });
  assert.equal(await client.countTokens("hello"), 17);
});

test("Gemini generation returns text and provider-reported usage", async () => {
  globalThis.fetch = async () => new Response(JSON.stringify({
    modelVersion: "gemini-2.5-flash",
    candidates: [{ content: { parts: [{ text: "Hello from Gemini." }] } }],
    usageMetadata: { promptTokenCount: 4, candidatesTokenCount: 6, thoughtsTokenCount: 1 },
  }), { status: 200 });
  const client = createGeminiClient({ geminiApiKey: "test-key", geminiModel: "gemini-2.5-flash" });
  assert.deepEqual(await client.generate({ prompt: "hello", maxOutputTokens: 20 }), {
    text: "Hello from Gemini.", model: "gemini-2.5-flash", inputTokens: 4, outputTokens: 7, reasoningTokens: 1,
  });
});

test("Gemini client fails closed when no server API key is configured", async () => {
  const client = createGeminiClient({ geminiApiKey: "", geminiModel: "gemini-2.5-flash" });
  await assert.rejects(() => client.generate({ prompt: "hello", maxOutputTokens: 20 }), { code: "llm_not_configured", status: 503 });
});

test("Gemini rate limits are mapped to a safe service error", async () => {
  globalThis.fetch = async () => new Response("{}", { status: 429 });
  const client = createGeminiClient({ geminiApiKey: "test-key", geminiModel: "gemini-2.5-flash" });
  await assert.rejects(() => client.generate({ prompt: "hello", maxOutputTokens: 20 }), { code: "llm_rate_limited", status: 503 });
});

test("Gemini response without usage metadata is not accepted for metering", async () => {
  globalThis.fetch = async () => new Response(JSON.stringify({ candidates: [{ content: { parts: [{ text: "unmetered" }] } }], usageMetadata: {} }), { status: 200 });
  const client = createGeminiClient({ geminiApiKey: "test-key", geminiModel: "gemini-2.5-flash" });
  await assert.rejects(() => client.generate({ prompt: "hello", maxOutputTokens: 20 }), { code: "llm_usage_unavailable", status: 502 });
});

test("Gemini pricing is expressed in micro-USD and includes input and output", () => {
  assert.equal(price({ inputTokens: 1000, cachedInputTokens: 0, outputTokens: 1000 }), 2800);
  assert.equal(PRICING.provider, "Google Gemini");
});
