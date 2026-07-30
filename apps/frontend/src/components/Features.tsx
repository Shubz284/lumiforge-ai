// src/components/landing/Features.tsx
import { Layers, Wallet, Gift, Zap } from "lucide-react";

const FEATURES = [
  {
    icon: Layers,
    title: "Multiple AI models",
    description:
      "Choose from Riverflow, Seedream, Recraft, and more — all in one place.",
  },
  {
    icon: Wallet,
    title: "Pay as you go",
    description:
      "No subscriptions. Buy credits once, use them whenever you want.",
  },
  {
    icon: Gift,
    title: "Free to start",
    description: "Get 6 free credits the moment you sign up. No card required.",
  },
  {
    icon: Zap,
    title: "Fast generation",
    description: "Your image is ready in seconds, not minutes.",
  },
];

const Features = () => {
  return (
    <div id="features" className="max-w-5xl mx-auto px-6 py-20">
      <div className="text-center mb-14">
        <h2 className="text-4xl font-bold mb-3 tracking-tight text-gray-900 sm:text-5xl">
          Why LumiForge
        </h2>
        <p className="text-gray-500 text-base">
          Everything you need to bring your ideas to life
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5">
        {FEATURES.map(({ icon: Icon, title, description }, i) => (
          <div
            key={i}
            className="border bg-gray-100 rounded-2xl p-7 hover:shadow-md transition-shadow"
          >
            <div className="w-12 h-12 rounded-lg bg-indigo-50 flex items-center justify-center mb-5">
              <Icon size={24} className="text-indigo-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {title}
            </h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              {description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Features;
