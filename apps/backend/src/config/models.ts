export const FREE_TRIAL_CREDITS = 6;

export const MODELS = {
  "sourceful/riverflow-v2.5-fast": {
    name: "Riverflow Fast",
    tier: "FAST",
    creditCost: 5,
    featured: true,
  },

  "bytedance-seed/seedream-4.5": {
    name: "Seedream 4.5",
    tier: "STANDARD",
    creditCost: 10,
    featured: true,
  },

  "x-ai/grok-imagine-image-quality": {
    name: "Grok Imagine",
    tier: "PREMIUM",
    creditCost: 15,
    featured: true,
  },

  "recraft/recraft-v4.1-vector": {
    name: "Recraft V4.1",
    tier: "DESIGN",
    creditCost: 20,
    featured: true,
  },

  "sourceful/riverflow-v2.5-pro": {
    name: "Riverflow Pro",
    tier: "PRO",
    creditCost: 30,
    featured: true,
  },

  "google/gemini-3.1-flash-lite-image": {
    name: "Gemini Flash Image",
    tier: "AI_NATIVE",
    creditCost: 40,
    featured: true,
  },
} as const;

// google/gemini-3.1-flash-lite-image
// $0.25 / $1.50per 1M

// sourceful/riverflow-v2.5-pro
// Image Output
// 1024px: $0.13/image
// 2048px: $0.15/image
// 4096px: $0.17/image

// sourceful/riverflow-v2.5-fast
// Image Output
// 1024px: $0.019/image
// 2048px: $0.021/image

// x-ai/grok-imagine-image-quality
// Image Output
// 1K: $0.05/image
// 2K: $0.07/image
// Image Input
// $0.01/image

// bytedance-seed/seedream-4.5
// 0.04$/image

// recraft/recraft-v4.1-vector
// Price
// $0.08/image
