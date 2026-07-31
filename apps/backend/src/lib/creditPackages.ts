// apps/backend/src/lib/creditPackages.ts

export interface CreditPack {
  id: string;
  name: string;
  description: string;
  /** Price the user pays, in rupees (display) and paise (charged via Razorpay). */
  priceInr: number;
  amountPaise: number;
  /** Base credits + promotional bonus = total credits granted on success. */
  baseCredits: number;
  bonusCredits: number;
}

export const CREDIT_PACKS: CreditPack[] = [
  {
    id: "starter",
    name: "Starter",
    description:"Perfect for exploring AI image generation and creating your first masterpieces.",
    priceInr: 10,
    amountPaise: 599_00,
    baseCredits: 100,
    bonusCredits: 0,
  },
  {
    id: "pro",
    name: "Pro",
    description:"Built for creators with frequent generations. Includes 10% bonus credits.",
    priceInr: 1999,
    amountPaise: 1999_00,
    baseCredits: 400,
    bonusCredits:50,
  },
  {
    id: "studio",
    name: "Studio",
    description:"Designed for professionals and teams with high-volume image generation. Includes 20% bonus credits.",
    priceInr: 4999,
    amountPaise: 4999_00,
    baseCredits: 1000,
    bonusCredits: 150,
  },
];

export function findPack(packId:string):CreditPack | undefined{
  return CREDIT_PACKS.find((p) => p.id == packId);
}

