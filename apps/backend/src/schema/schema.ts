import { z } from "zod";

const resolutionValues = ["512", "1K", "2K", "4K"] as const;

export function normalizeResolution(value: unknown) {
  if (typeof value !== "string") {
    return value;
  }

  const compact = value.trim().replace(/\s+/g, "").toUpperCase();

  switch (compact) {
    case "512":
    case "512X512":
      return "512";
    case "1K":
    case "1024X1024":
      return "1K";
    case "2K":
    case "2048X2048":
      return "2K";
    case "4K":
    case "4096X4096":
      return "4K";
    default:
      return value;
  }
}

export const resolutionSchema = z.enum(resolutionValues);

export const signupSchema = z.object({
  name: z.string(),
  email: z.email(),
  password: z.string(),
});

export const signinSchema = z.object({
  email: z.email(),
  password: z.string(),
});

export const imageGenerationSchema = z.object({
  prompt: z.string().min(1),
  model: z.string().min(1),
  aspectRatio: z.string().optional(),
  resolution: z.preprocess(normalizeResolution, resolutionSchema.optional()),
});

export const creditsPerImgSchema = z.object({
  FREE_TRIAL_CREDITS: z.coerce.number().int().positive().default(6),
  CREDITS_PER_IMAGE: z.coerce.number().int().positive().default(6),
  FREE_TRIAL_MODEL: z.string().default("sourceful/riverflow-v2.5-fast"),
});

export const env = creditsPerImgSchema.parse(process.env);
