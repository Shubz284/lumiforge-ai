// src/lib/creditPricing.ts
const USD_TO_INR = 95.6;
const MARGIN_MULTIPLIER = 2;
const CREDIT_VALUE_INR = 0.83; // your cheapest per-credit rate (Studio pack)
const MIN_CREDIT_FLOOR = 1;

export const MODEL_COST_USD: Record<string, number> = {
  "sourceful/riverflow-v2.5-fast": 0.021,
  "sourceful/riverflow-v2.5-pro": 0.17,
  "x-ai/grok-imagine-image-quality": 0.08,
  "bytedance-seed/seedream-4.5": 0.05,
  "recraft/recraft-v4.1-vector": 0.08,
  "google/gemini-3.1-flash-lite-image": 2.0,
};

export function getCreditCost(modelId: string): number {
  const costUsd = MODEL_COST_USD[modelId];
  if (costUsd === undefined) {
    throw new Error(`Unknown model: ${modelId}`);
  }
  const raw = (costUsd * USD_TO_INR * MARGIN_MULTIPLIER) / CREDIT_VALUE_INR;
  return Math.max(MIN_CREDIT_FLOOR, Math.ceil(raw));
}
