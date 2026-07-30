// src/components/landing/Hero.tsx
import { Link } from "react-router-dom";
import { Sparkles, Play } from "lucide-react";

const Hero = () => {
  return (
    <div className="max-w-3xl mx-auto px-6 text-center pt-24 pb-20 sm:pt-32">
      <div className="inline-flex items-center shadow-lg gap-2 bg-slate-50 border rounded-full px-3.5 py-1.5 mb-8">
        <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
        <span className="text-xs font-semibold text-gray-600">
          6 free credits on sign up
        </span>
      </div>

      <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl mb-5">
        Turn your imagination
        <br />
        into <span className="text-indigo-600">stunning images</span>
      </h1>

      <p className="text-gray-500 text-base leading-relaxed max-w-md mx-auto mb-9">
        Generate professional-grade images from text prompts using the best AI
        models available. Fast, affordable, and ready in seconds.
      </p>

      <div className="flex items-center justify-center gap-3">
        <Link
          to="/signup"
          className="bg-black text-white font-medium text-sm px-5 py-2.5 rounded-lg flex items-center gap-1.5"
        >
          <Sparkles size={15} />
          Start creating free
        </Link>
        <a
          href="#examples"
          className="border text-sm px-5 py-2.5 rounded-lg flex items-center gap-1.5"
        >
          <Play size={15} />
          See examples
        </a>
      </div>
    </div>
  );
};
export default Hero;
