import { meteringRepository } from "./repository.js";
import { randomUUID } from "node:crypto";
import { AppError } from "../../shared/errors.js";
import { fingerprint } from "../../shared/hash.js";
import { monthWindow } from "../../shared/time.js";
import { price, PRICING } from "./pricing.js";
import { transaction } from "../../infrastructure/database/transaction.js";
import { assertActiveTenant } from "../tenants/policy.js";

const PLANS = Object.freeze({
  free: { _id: "free", name: "Free", apiCalls: 1000, tokens: 100000 },
  pro: { _id: "pro", name: "Pro", apiCalls: 10000, tokens: 1000000 },
});

export function metering({ db, client, clock = () => new Date(), llm }) {
  const repository = meteringRepository({ db });

  async function generate(tenantId, key, input) {
    if (!llm) throw new AppError(503, "llm_not_configured", "Gemini is not configured. Set GEMINI_API_KEY on the server.");
    const requestHash = fingerprint(input);
    return transaction(client, async (session) => {
      const tenant = await repository.lockTenant({ tenantId, session });
      assertActiveTenant(tenant, clock());
      const existing = await repository.findEvent({ tenantId, key, session });
      if (existing) {
        if (existing.fingerprint !== requestHash) throw new AppError(409, "idempotency_conflict", "This idempotency key was already used with a different prompt or generation settings.");
        return existing.response;
      }
      const now = clock();
      const { month, end } = monthWindow(now);
      const sub = await repository.findSubscription({ tenantId, session });
      if (!sub) throw new AppError(503, "tenant_not_ready", "Your workspace is still getting ready. Please try again in a moment.");
      if (sub.blocked) throw new AppError(402, "payment_required", "Your subscription needs payment before new usage can be recorded.", { subscriptionStatus: sub.status });
      const plan = PLANS[sub.planId];
      if (!plan) throw new AppError(503, "invalid_plan", "The workspace plan is unavailable.");
      const usage = (await repository.findMonth({ tenantId, month, session })) || { apiCalls: 0, tokens: 0, costMicroUsd: 0 };
      if (usage.apiCalls + 1 > plan.apiCalls) throw new AppError(429, "quota_exceeded", "Monthly API call quota exceeded.", { dimension: "apiCalls", used: usage.apiCalls, limit: plan.apiCalls, requested: 1, resetsAt: end.toISOString(), retryAfter: Math.max(1, Math.ceil((end - now) / 1000)) });
      const countedInputTokens = await llm.countTokens(input.prompt);
      const remaining = plan.tokens - usage.tokens - countedInputTokens;
      if (remaining < 1) throw new AppError(429, "quota_exceeded", "Monthly token quota exceeded.", { dimension: "tokens", used: usage.tokens, limit: plan.tokens, requested: countedInputTokens, resetsAt: end.toISOString(), retryAfter: Math.max(1, Math.ceil((end - now) / 1000)) });
      const maxOutputTokens = Math.min(input.maxOutputTokens, remaining);
      const generated = await llm.generate({ prompt: input.prompt, maxOutputTokens });
      const meteredInput = { inputTokens: generated.inputTokens, cachedInputTokens: 0, outputTokens: generated.outputTokens, reasoningTokens: Math.min(generated.reasoningTokens || 0, generated.outputTokens) };
      const tokens = meteredInput.inputTokens + meteredInput.outputTokens;
      if (usage.tokens + tokens > plan.tokens) throw new AppError(429, "quota_exceeded", "This generation exceeded the remaining monthly token quota and was not recorded.", { dimension: "tokens", used: usage.tokens, limit: plan.tokens, requested: tokens, resetsAt: end.toISOString(), retryAfter: Math.max(1, Math.ceil((end - now) / 1000)) });
      const costMicroUsd = price(meteredInput);
      const id = randomUUID();
      const response = { id, result: generated.text, model: generated.model, usage: { apiCalls: 1, tokens, ...meteredInput }, costMicroUsd, currency: "USD", priceVersion: PRICING.version, createdAt: now.toISOString() };
      await repository.insertEvent({ id, tenantId, key, requestHash, month, input: { ...meteredInput, prompt: input.prompt, maxOutputTokens: input.maxOutputTokens }, tokens, costMicroUsd, priceVersion: PRICING.version, now, response, tenant, session });
      await repository.incrementMonth({ tenantId, month, tokens, costMicroUsd, tenant, session });
      return response;
    });
  }
  async function usage(tenantId) {
    return transaction(client, async (session) => {
      const { month, start, end } = monthWindow(clock());
      const tenant = await repository.findTenant({ tenantId, session });

      assertActiveTenant(tenant, clock());

      const sub = await repository.findSubscription({ tenantId, session });
      const plan = PLANS[sub?.planId];

      if (!plan)
        throw new AppError(
          503,
          "invalid_plan",
          "The workspace plan is unavailable.",
        );

      const totals = (await repository.findMonth({
        tenantId,
        month,
        session,
      })) || {
        apiCalls: 0,
        tokens: 0,
        costMicroUsd: 0,
      };

      return {
        tenant: {
          id: tenantId,
          name: tenant.name,
          isSandbox: Boolean(tenant.isSandbox),
          expiresAt: tenant.expiresAt || null,
        },
        month,
        periodStart: start.toISOString(),
        resetsAt: end.toISOString(),
        plan: { id: plan._id, name: plan.name },
        subscriptionStatus: sub.status,
        paymentRequired: Boolean(sub.blocked),
        used: { apiCalls: totals.apiCalls, tokens: totals.tokens },
        limits: { apiCalls: plan.apiCalls, tokens: plan.tokens },
        costMicroUsd: totals.costMicroUsd,
        currency: "USD",
        pricing: PRICING,
      };
    });
  }

  return {
    generate,
    usage,
    events: (tenantId) => repository.recentEvents({ tenantId }),
  };
}
