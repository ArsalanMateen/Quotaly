import { z } from "zod";

export const generateSchema = z
  .object({
    prompt: z.string().trim().min(1).max(12000),
    maxOutputTokens: z.number().int().min(1).max(8192).default(1024),
  })
  .strict();

export const keySchema = z
  .string()
  .min(8)
  .max(128)
  .regex(/^[a-zA-Z0-9._:-]+$/);
