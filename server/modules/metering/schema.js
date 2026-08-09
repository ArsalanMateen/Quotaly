import { z } from "zod";

export const generateSchema = z
  .object({
    prompt: z.string().trim().min(1).max(100000),
    maxOutputTokens: z.number().int().min(1).max(16384).default(4096),
  })
  .strict();

export const keySchema = z
  .string()
  .min(8)
  .max(128)
  .regex(/^[a-zA-Z0-9._:-]+$/);
