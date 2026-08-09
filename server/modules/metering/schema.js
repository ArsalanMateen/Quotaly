import { z } from 'zod';

const quantity = z.number().int().min(0).max(10000000);

export const generateSchema = z
  .object({
    inputTokens: quantity,
    cachedInputTokens: quantity.default(0),
    outputTokens: quantity,
    reasoningTokens: quantity.default(0),
  })
  .strict()
  .superRefine((v, ctx) => {
    if (v.cachedInputTokens > v.inputTokens)
      ctx.addIssue({
        code: 'custom',
        path: ['cachedInputTokens'],
        message: 'Cached input tokens cannot be greater than total input tokens.',
      });

    if (v.reasoningTokens > v.outputTokens)
      ctx.addIssue({
        code: 'custom',
        path: ['reasoningTokens'],
        message: 'Reasoning tokens cannot be greater than total output tokens.',
      });
  });
export const keySchema = z
  .string()
  .min(8)
  .max(128)
  .regex(/^[a-zA-Z0-9._:-]+$/);
