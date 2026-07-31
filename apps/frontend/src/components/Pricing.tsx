import { useCredits } from "@/context/CreditsContext";
import { apiFetch } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import { Check, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";

interface CreditPack {
  id: string;
  name: string;
  description: string;
  priceInr: number;
  baseCredits: number;
  bonusCredits: number;
}

const FEATURED_PACK_ID = "pro";

const PACK_PERKS: Record<string, string[]> = {
  starter: [
    "100 image generations",
    "Standard queue priority",
    "Credits never expire",
  ],
  pro: [
    "2,20 image generations",
    "Priority generation queue",
    "Credits never expire",
    "Upscale & variations included",
  ],
  studio: [
    "6,00 image generations",
    "Highest queue priority",
    "Credits never expire",
    "Upscale & variations included",
    "Commercial usage rights",
  ],
};

const inr = (n: number) =>
  new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(n);

const perCredit = (pack: CreditPack) =>
  (pack.priceInr / (pack.baseCredits + pack.bonusCredits)).toFixed(2);

const bonusPct = (pack: CreditPack) =>
  pack.bonusCredits > 0
    ? Math.round((pack.bonusCredits / pack.baseCredits) * 100)
    : 0;

interface PricingProps {
  // Called after a purchase is verified — use it to close a modal / refetch
  // balance. Navigation is no longer this component's job: whether it's
  // mounted as a modal or as the /dashboard/billing route, the user stays
  // put after paying.
  onPurchaseSuccess?: () => void;
  variant?: "landing" | "dashboard";
}

export default function Pricing({ onPurchaseSuccess, variant = "landing" }: PricingProps) {
  const { data: session, isPending: isSessionPending } = authClient.useSession();
  const isAuthenticated = !!session?.user;

  const [packs, setPacks] = useState<CreditPack[]>([]);
  const [loading, setLoading] = useState(true);
  const [buyingPackId, setBuyingPackId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [searchParams, setSearchParams] = useSearchParams();
  // const preselectedPack = searchParams.get("pack");
  const { setCredits } = useCredits();

  useEffect(() => {
    const cached = sessionStorage.getItem("pricing_cache");
    if (cached) {
      setPacks(JSON.parse(cached));
      setLoading(false);
    }

    apiFetch("/checkout/pricing").then((data) => {
      setPacks(data.packs);
      sessionStorage.setItem("pricing_cache", JSON.stringify(data.packs));
      setLoading(false);
    });
  }, []);

  const handleBuy = async (packId: string) => {
    // Session is still resolving on first load — don't let a click (or the
    // auto-trigger effect below) race ahead of it.
    if (isSessionPending) return;

    // Not signed in: this only happens on a direct card click now — the
    // ?next=...&pack=... redirect to /signup already handles the
    // "came from auth" case before this component even re-renders
    // authenticated.
    if (!isAuthenticated) {
      const params = new URLSearchParams({
        next: "/dashboard/billing",
        pack: packId,
      });
      window.location.assign(`/signup?${params.toString()}`);
      return;
    }

    setBuyingPackId(packId);
    setError(null);

    try {
      const order = await apiFetch("/payments/create-order", {
        method: "POST",
        body: JSON.stringify({ packId }),
      });

      console.log("ORDER KEY ID:", order.keyId); // add this
      console.log("FULL ORDER:", order);

      const options = {
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: "LumiForge AI",
        description: `${order.packName} • ${order.credits} Credits`,
          order_id: order.orderId,
          handler: async (response: any) => {
            console.log(
            response.razorpay_order_id,
            response.razorpay_payment_id,
            response.razorpay_signature,
          );
          try {
            const result = await apiFetch("/payments/verify", {
              method: "POST",
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });
            setCredits(result.balance)
            toast.success("Credits added to your account");
          } catch (err) {
            console.error("Payment verification failed:", err);
            toast.error("Payment verification failed, please contact support");
          } finally {
            // Drop ?pack= so a refresh (or back button) doesn't re-trigger
            // the auto-checkout effect for an already-completed purchase.
            if (searchParams.has("pack")) {
              setSearchParams(
                (prev) => {
                  const next = new URLSearchParams(prev);
                  next.delete("pack");
                  return next;
                },
                { replace: true },
              );
            }
            setBuyingPackId(null);
            // Stay on the current page either way — no navigate() here.
            // onPurchaseSuccess is purely for a modal parent to close
            // itself / refetch balance.
            onPurchaseSuccess?.();
          }
        },
        modal: {
          ondismiss: () => setBuyingPackId(null),
        },
        theme: { color: "#6C5CE7" },
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();
    } catch (err) {
      console.error("Failed to create order:", err);
      setError("Could not start checkout. Please try again.");
      setBuyingPackId(null);
    }
  };

  // Auto-trigger checkout when landing here as /dashboard/billing?pack=pro
  // straight out of signup/login — user shouldn't have to click Buy twice.
  // useEffect(() => {
  //   if (
  //     preselectedPack &&
  //     !isSessionPending &&
  //     isAuthenticated &&
  //     packs.length > 0 &&
  //     buyingPackId === null
  //   ) {
  //     handleBuy(preselectedPack);
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [preselectedPack, isSessionPending, isAuthenticated, packs]);

  if (loading) {
    return (
      <section className="w-full px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto mb-16 max-w-xl text-center animate-pulse">
            <div className="h-6 w-40 bg-gray-100 rounded-full mx-auto mb-5" />
            <div className="h-10 w-96 bg-gray-100 rounded mx-auto mb-4" />
            <div className="h-4 w-80 bg-gray-100 rounded mx-auto" />
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-2xl border p-7 animate-pulse">
                <div className="h-5 w-24 bg-gray-100 rounded mb-3" />
                <div className="h-4 w-full bg-gray-100 rounded mb-6" />
                <div className="h-10 w-32 bg-gray-100 rounded mb-6" />
                <div className="h-20 w-full bg-gray-100 rounded mb-6" />
                <div className="h-10 w-full bg-gray-100 rounded" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="pricing" className="w-full  px-6 py-20">
      <div className="mx-auto max-w-6xl">
        {variant === "landing" && (
          <div className="mx-auto mb-16 max-w-xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-medium text-gray-600">
              <span className="h-1.5 w-1.5 rounded-full bg-teal-500" />
              Credits, not subscriptions
            </span>
            <h1 className="mt-5 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Simple, pay-as-you-go{" "}
              <span className="text-[#6C5CE7]">pricing</span>
            </h1>
            <p className="mt-4 text-base leading-relaxed text-gray-500">
              Buy credits once, spend them whenever inspiration strikes. No
              subscriptions, no monthly commitment, no expiry.
            </p>
          </div>
        )}

        {variant === "dashboard" && (
          <div className="flex flex-col justify-center h-5 items-center  pb-10 mb-10">
            <h1 className="text-2xl font-bold text-gray-900">Buy Credits</h1>
            <p className="mt-1 text-sm text-gray-500">
              Pick a pack — credits are added instantly and never expire.
            </p>
          </div>
        )}

        {error && (
          <p className="mb-6 text-center text-sm text-red-600">{error}</p>
        )}

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:items-stretch">
          {packs.map((pack) => {
            const featured = pack.id === FEATURED_PACK_ID;
            const totalCredits = pack.baseCredits + pack.bonusCredits;
            const bonus = bonusPct(pack);
            const basePct = pack.bonusCredits
              ? Math.round((pack.baseCredits / totalCredits) * 100)
              : 100;
            const isBuying = buyingPackId === pack.id;

            return (
              <div
                key={pack.id}
                className={[
                  "relative flex flex-col rounded-2xl border p-7 transition-shadow duration-200",
                  featured
                    ? "border-[#6C5CE7]/30 bg-white shadow-[0_20px_45px_-20px_rgba(108,92,231,0.35)] lg:-translate-y-3"
                    : "border-gray-200 bg-white hover:shadow-md",
                ].join(" ")}
              >
                {featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#6C5CE7] px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">
                      <Sparkles className="h-3 w-3" strokeWidth={2.5} />
                      Most popular
                    </span>
                  </div>
                )}

                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {pack.name}
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-gray-500">
                    {pack.description}
                  </p>
                </div>

                <div className="mt-6 flex items-end gap-1">
                  <span className="pb-1 text-xl font-medium text-gray-400">
                    &#8377;
                  </span>
                  <span className="text-5xl font-bold tracking-tight text-gray-900">
                    {inr(pack.priceInr)}
                  </span>
                  <span className="pb-1.5 text-sm text-gray-400">one-time</span>
                </div>
                <p className="mt-1 text-xs text-gray-400">
                  &#8776; &#8377;{perCredit(pack)} / credit
                </p>

                <div className="mt-6 rounded-xl border border-gray-100 bg-gray-50 p-4">
                  <div className="flex items-baseline justify-between">
                    <span className="text-2xl font-bold text-gray-900">
                      {inr(totalCredits)}
                    </span>
                    <span className="text-xs uppercase tracking-wide text-gray-400">
                      credits
                    </span>
                  </div>

                  <div className="mt-3 flex h-1.5 w-full overflow-hidden rounded-full bg-gray-200">
                    <div
                      className="h-full bg-[#6C5CE7]"
                      style={{ width: `${basePct}%` }}
                    />
                    {pack.bonusCredits > 0 && (
                      <div
                        className="h-full bg-teal-400"
                        style={{ width: `${100 - basePct}%` }}
                      />
                    )}
                  </div>

                  <div className="mt-2 flex items-center justify-between text-[11px] text-gray-400">
                    <span className="flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#6C5CE7]" />
                      {inr(pack.baseCredits)} base
                    </span>
                    {pack.bonusCredits > 0 && (
                      <span className="flex items-center gap-1.5 text-teal-600">
                        <span className="h-1.5 w-1.5 rounded-full bg-teal-400" />
                        +{inr(pack.bonusCredits)} bonus ({bonus}%)
                      </span>
                    )}
                  </div>
                </div>

                <ul className="mt-6 flex-1 space-y-3">
                  {PACK_PERKS[pack.id]?.map((perk) => (
                    <li
                      key={perk}
                      className="flex items-start gap-2.5 text-sm text-gray-600"
                    >
                      <Check
                        className="mt-0.5 h-4 w-4 shrink-0 text-teal-500"
                        strokeWidth={2.5}
                      />
                      {perk}
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  onClick={() => handleBuy(pack.id)}
                  disabled={isBuying}
                  className={[
                    "mt-7 w-full rounded-full px-5 py-3 text-sm font-semibold transition-colors duration-150 disabled:opacity-60",
                    featured
                      ? "bg-gray-900 text-white hover:bg-gray-800"
                      : "border border-gray-300 bg-white text-gray-900 hover:bg-gray-50",
                  ].join(" ")}
                >
                  {isBuying
                    ? "Opening checkout..."
                    : isAuthenticated
                      ? `Buy ${pack.name}`
                      : `Get ${pack.name}`}
                </button>
              </div>
            );
          })}
        </div>

        <p className="mt-10 text-center text-xs text-gray-400">
          Prices in INR. Credits are added to your account instantly after
          payment and never expire.
        </p>
      </div>
    </section>
  );
}
