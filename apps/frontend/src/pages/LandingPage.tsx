import Faq from "@/components/Faq";
import Features from "@/components/Features";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import Pricing from "@/components/Pricing";
import Showcase from "@/components/Showcase";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#f8fafc]">
      {/* Top Fade Grid Background */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `
        linear-gradient(to right, rgba(226,232,240,0.7) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(226,232,240,0.7) 1px, transparent 1px)
        `,
          backgroundSize: "32px 32px",
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 65% at 50% 0%, black 55%, transparent 100%)",
          maskImage:
            "radial-gradient(ellipse 80% 65% at 50% 0%, black 55%, transparent 100%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        <Navbar />
        <Hero />
        <Showcase />
        <section id="features">
          <Features />
        </section>
        <section id="pricing">
          <Pricing />
        </section>
        <section id="faq">
          <Faq />
        </section>
        <Footer />
      </div>
    </div>
  );
}
