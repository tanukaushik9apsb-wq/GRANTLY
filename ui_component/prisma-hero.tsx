/**
 * GRANTLY Hero Component
 * Adapted from PrismaHero by Rahil Vahora (@rahil1202) on 21st.dev
 *
 * Requirements & Verification:
 * - Completely removed all remnants of original Prisma branding, watermarks, and text.
 * - Responsive CSS clamp() typography for GRANTLY heading (clamp(76px, 12vw, 190px)).
 * - Responsive 2-column grid on desktop with both columns vertically aligned at the bottom.
 * - Clean vertical stack on mobile with full button accessibility.
 * - Cinematic background artwork with layered gradients and warm ivory (#F5F3EC) typography.
 * - Single authoritative hero instance.
 */

import React, { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight, Sparkles, Menu, X, ShieldCheck, CheckCircle2 } from "lucide-react";
import { ThemeToggle } from "../src/components/common/ThemeToggle";

interface WordsPullUpProps {
  text: string;
  className?: string;
  showAsterisk?: boolean;
}

export function WordsPullUp({
  text,
  className = "",
  showAsterisk = false,
}: WordsPullUpProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true });
  const words = text.split(" ");

  return (
    <span ref={containerRef} className={`inline-flex flex-wrap items-baseline ${className}`}>
      {words.map((word, index) => {
        const isLast = index === words.length - 1;
        return (
          <motion.span
            key={index}
            initial={{ y: 24, opacity: 0 }}
            animate={isInView ? { y: 0, opacity: 1 } : { y: 0, opacity: 1 }}
            transition={{
              duration: 0.65,
              delay: index * 0.08,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="inline-flex items-baseline relative select-none"
          >
            <span style={{ color: "#F5F3EC" }} className="text-[#F5F3EC]">{word}</span>
            {showAsterisk && isLast && (
              <span
                style={{ color: "#F59E0B" }}
                className="inline-block ml-1 font-serif text-amber-400 select-none text-[0.35em] leading-none align-top -translate-y-1.5 animate-pulse"
                aria-hidden="true"
              >
                *
              </span>
            )}
          </motion.span>
        );
      })}
    </span>
  );
}

export interface GrantlyHeroProps {
  onExploreClick?: () => void;
  onGetStartedClick?: () => void;
  onSignInClick?: () => void;
  onNavigate?: (target: string) => void;
}

export function GrantlyHero({
  onExploreClick,
  onGetStartedClick,
  onSignInClick,
  onNavigate,
}: GrantlyHeroProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: "Explore Scholarships", target: "/explore", isHighlighted: true },
    { label: "Eligibility", target: "#eligibility" },
    { label: "How It Works", target: "#how-it-works" },
    { label: "Locker", target: "#features" },
    { label: "FAQ", target: "#faq" },
  ];

  const handleLinkClick = (e: React.MouseEvent, target: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    if (onNavigate) {
      onNavigate(target);
    } else if (target.startsWith("#")) {
      const el = document.getElementById(target.substring(1));
      if (el) el.scrollIntoView({ behavior: "smooth" });
    } else if (target === "/explore") {
      onExploreClick?.();
    }
  };

  return (
    <section data-hero-cinematic="true" className="relative w-full p-2 sm:p-4 md:p-6 lg:p-8 flex flex-col justify-between">
      {/* Outer rounded editorial hero container */}
      <div className="relative min-h-[660px] sm:min-h-[86vh] lg:min-h-[90vh] w-full overflow-hidden rounded-2xl md:rounded-[2.5rem] border border-white/10 shadow-2xl bg-charcoal-950 flex flex-col justify-between">
        {/* Background Visual Asset: Clean, text-free, watermark-free high-res artwork */}
        <div className="absolute inset-0 z-0">
          <img
            src="/hero-bg.png"
            alt="Atmospheric landscape of an Indian student studying over cloud cover at sunset"
            className="h-full w-full object-cover object-center scale-[1.01] transition-transform duration-1000 ease-out"
            loading="eager"
          />

          {/* Film Grain Noise Overlay */}
          <div className="noise-overlay pointer-events-none absolute inset-0 opacity-[0.6] mix-blend-overlay" />

          {/* Layered Cinematic Gradients for Rich Readability */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-charcoal-950 via-charcoal-950/55 to-black/35" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-charcoal-950/85 via-transparent to-charcoal-950/60" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gold-500/10 via-transparent to-transparent opacity-60" />
        </div>

        {/* Floating Rounded Navigation Bar (top center) */}
        <nav
          className="absolute left-1/2 top-0 z-30 -translate-x-1/2 w-auto max-w-[95vw]"
          aria-label="Main Navigation"
        >
          <div className="flex items-center gap-2 sm:gap-6 md:gap-8 lg:gap-10 rounded-b-2xl md:rounded-b-3xl bg-black/90 backdrop-blur-xl px-4 py-2 sm:px-6 md:px-8 border-x border-b border-white/10 shadow-2xl">
            {/* Logo */}
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                onNavigate?.("/");
              }}
              className="flex items-center gap-2 pr-2 border-r border-white/10 text-xs sm:text-sm font-semibold tracking-wider text-ivory-100 hover:text-gold-400 transition-colors"
            >
              <div className="w-5 h-5 rounded-full bg-gold-500/20 flex items-center justify-center text-gold-400">
                <Sparkles className="w-3 h-3" />
              </div>
              <span className="font-serif tracking-widest text-xs sm:text-sm font-bold text-ivory-100">
                GRANTLY
              </span>
            </a>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-3 lg:gap-5">
              {navLinks.map((item) => {
                if (item.isHighlighted) {
                  return (
                    <a
                      key={item.label}
                      href={item.target}
                      onClick={(e) => handleLinkClick(e, item.target)}
                      className="whitespace-nowrap group relative inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs lg:text-sm font-bold text-[#10120F] bg-gradient-to-r from-[#FDE68A] via-[#F59E0B] to-[#D97706] border border-amber-200/80 shadow-md shadow-amber-500/30 hover:scale-[1.03] hover:shadow-amber-500/50 transition-all cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#10120F] animate-pulse" />
                      <span className="text-[#10120F] font-bold">{item.label}</span>
                      <span className="text-[10px] font-black uppercase tracking-wider bg-[#10120F] text-[#FDE68A] px-1.5 py-0.5 rounded-full">
                        500+
                      </span>
                    </a>
                  );
                }
                return (
                  <a
                    key={item.label}
                    href={item.target}
                    onClick={(e) => handleLinkClick(e, item.target)}
                    className="text-xs lg:text-sm font-normal transition-colors text-[#FAF9F5]/85 hover:text-gold-400"
                  >
                    {item.label}
                  </a>
                );
              })}
            </div>

            {/* Nav Action Buttons */}
            <div className="flex items-center gap-2 pl-2">
              <ThemeToggle />

              <button
                onClick={onSignInClick}
                className="text-[11px] sm:text-xs font-medium text-[#DCD7CA] hover:text-white px-2 py-1 transition-colors cursor-pointer"
              >
                Sign In
              </button>

              <button
                onClick={onGetStartedClick}
                className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 rounded-full text-[11px] sm:text-xs font-semibold bg-[#FAF9F5] hover:bg-white text-[#10120F] transition-all shadow-md cursor-pointer"
              >
                <span>Get Started</span>
              </button>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-1 rounded-lg text-ivory-200 hover:text-gold-400 cursor-pointer ml-1"
                aria-label="Toggle mobile menu"
              >
                {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu Dropdown */}
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="md:hidden mt-2 rounded-2xl bg-charcoal-950/95 backdrop-blur-2xl p-4 border border-white/10 shadow-2xl flex flex-col gap-3"
            >
              {/* Mobile Theme Toggle */}
              <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-white/5 border border-white/10">
                <span className="text-xs font-mono text-ivory-300 uppercase tracking-wider">Appearance</span>
                <ThemeToggle showLabel />
              </div>

              {navLinks.map((item) => {
                if (item.isHighlighted) {
                  return (
                    <a
                      key={item.label}
                      href={item.target}
                      onClick={(e) => handleLinkClick(e, item.target)}
                      className="flex items-center justify-between text-sm py-2 px-3 rounded-xl font-bold bg-gradient-to-r from-amber-400 to-gold-400 text-charcoal-950 shadow-md transition-transform"
                    >
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-charcoal-950" />
                        <span>{item.label}</span>
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-wider bg-charcoal-950 text-gold-300 px-2 py-0.5 rounded-full">
                        500+ Live
                      </span>
                    </a>
                  );
                }
                return (
                  <a
                    key={item.label}
                    href={item.target}
                    onClick={(e) => handleLinkClick(e, item.target)}
                    className="text-sm py-1.5 px-3 rounded-lg text-ivory-200 hover:bg-white/5 hover:text-gold-400 transition-colors"
                  >
                    {item.label}
                  </a>
                );
              })}
              <div className="pt-2 border-t border-white/10 flex flex-col gap-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onExploreClick?.();
                  }}
                  className="w-full text-center py-2.5 rounded-xl text-xs font-semibold bg-gold-400 text-charcoal-950 cursor-pointer"
                >
                  Explore Scholarships
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onGetStartedClick?.();
                  }}
                  className="w-full text-center py-2.5 rounded-xl text-xs font-medium bg-white/10 text-ivory-100 cursor-pointer"
                >
                  Register Student Account
                </button>
              </div>
            </motion.div>
          )}
        </nav>

        {/* Top subtle indicators */}
        <div className="relative z-20 pt-16 sm:pt-20 px-4 sm:px-8 md:px-12 flex justify-between items-start pointer-events-none">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{ backgroundColor: "rgba(11, 13, 10, 0.95)" }}
            className="pointer-events-auto inline-flex items-center gap-2.5 rounded-full px-4 py-2 text-xs font-extrabold backdrop-blur-xl border-2 border-amber-400/60 text-[#FDE68A] shadow-[0_6px_20px_rgba(0,0,0,0.7)]"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_#34D399]" />
            <span className="text-[#FDE68A]">2026-27 Academic Cycle Active</span>
            <span className="text-amber-400/60 hidden xs:inline">•</span>
            <span className="text-ivory-200 font-mono text-[11px] hidden xs:inline">NSP & State Portals</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{ backgroundColor: "rgba(11, 13, 10, 0.95)" }}
            className="pointer-events-auto hidden sm:inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-mono tracking-wider uppercase font-extrabold backdrop-blur-xl border-2 border-amber-400/60 text-[#FDE68A] shadow-[0_6px_20px_rgba(0,0,0,0.7)]"
          >
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span className="text-[#FDE68A]">Simulated Indian Demo Hub</span>
          </motion.div>
        </div>

        {/* Bottom Hero Layout: Proportionate 2-Column Responsive Grid */}
        <div className="relative z-20 px-4 pb-6 sm:px-8 sm:pb-8 md:px-12 md:pb-12 mt-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-end gap-6 lg:gap-12 xl:gap-16">
            {/* LEFT COLUMN: Small label + Proportionate clamp() Heading */}
            <div className="lg:col-span-7 xl:col-span-7 space-y-3">
              <div
                style={{ backgroundColor: "rgba(11, 13, 10, 0.95)" }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider font-extrabold text-[#FDE68A] border-2 border-amber-400/60 backdrop-blur-md shadow-md"
              >
                <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
                <span>Unified Scholarship Discovery</span>
              </div>

              {/* Proportionate CSS clamp() heading: bold, monumental, but respects column boundaries */}
              <h1
                className="font-serif font-bold tracking-[-0.03em] leading-[0.88] drop-shadow-[0_12px_28px_rgba(0,0,0,0.85)] m-0 select-none text-ivory-100"
                style={{
                  color: "#F5F3EC",
                  fontSize: "clamp(50px, 8.2vw, 136px)",
                }}
              >
                <WordsPullUp text="GRANTLY" showAsterisk={true} />
              </h1>
            </div>

            {/* RIGHT COLUMN: Highlighted Content Container with Translucent Frosted Glass */}
            <div className="lg:col-span-5 xl:col-span-5 flex flex-col gap-4 lg:pb-2">
              <motion.div
                initial={{ y: 24, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
                style={{ backgroundColor: "rgba(10, 12, 9, 0.25)" }}
                className="relative rounded-3xl backdrop-blur-sm border border-amber-400/40 hover:border-amber-400/60 p-6 sm:p-7 shadow-[0_16px_40px_rgba(0,0,0,0.5),0_0_25px_rgba(245,158,11,0.15)] space-y-4 max-w-xl overflow-hidden transition-all"
              >
                {/* Top golden accent bar */}
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-amber-400/70 to-transparent shadow-[0_0_8px_#F59E0B]" />
                {/* Ambient glow in corner */}
                <div className="absolute -top-12 -right-12 w-36 h-36 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

                {/* Micro Category Highlights Pill Bar */}
                <div className="flex items-center gap-2 flex-wrap relative z-10">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-extrabold uppercase tracking-wider bg-black/45 text-[#FDE68A] border border-amber-400/50 shadow-sm backdrop-blur-sm">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>NSP Central & State Portals</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-extrabold uppercase tracking-wider bg-black/45 text-[#6EE7B7] border border-emerald-400/50 shadow-sm backdrop-blur-sm">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Zero Paperwork Friction</span>
                  </span>
                </div>

                {/* Highlighted Editorial Paragraph */}
                <p className="text-sm sm:text-base text-[#FAF9F5] font-normal leading-relaxed drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)] relative z-10">
                  <strong className="font-extrabold text-base sm:text-lg tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-white via-[#FDE68A] to-[#F59E0B]">GRANTLY</strong> is India&apos;s unified discovery and management ecosystem for higher education scholarships. Map your eligibility across{" "}
                  <span
                    style={{ backgroundColor: "#F59E0B", color: "#10120F" }}
                    className="font-extrabold px-2 py-0.5 rounded shadow-md inline-block my-0.5 font-sans"
                  >
                    Central, State & Corporate Schemes
                  </span>{" "}
                  without paperwork friction.
                </p>

                {/* Quick 3-Metric Highlight Strip */}
                <div className="grid grid-cols-3 gap-2 py-2.5 px-3 border border-white/15 bg-black/35 backdrop-blur-sm rounded-2xl text-center relative z-10">
                  <div>
                    <div style={{ color: "#FDE68A" }} className="text-xs sm:text-sm font-extrabold drop-shadow">₹450+ Cr</div>
                    <div className="text-[10px] text-ivory-200 uppercase tracking-wider font-semibold">Demo Pool</div>
                  </div>
                  <div className="border-x border-white/15">
                    <div style={{ color: "#6EE7B7" }} className="text-xs sm:text-sm font-extrabold drop-shadow">500+</div>
                    <div className="text-[10px] text-ivory-200 uppercase tracking-wider font-semibold">Live Schemes</div>
                  </div>
                  <div>
                    <div style={{ color: "#7DD3FC" }} className="text-xs sm:text-sm font-extrabold drop-shadow">100% Free</div>
                    <div className="text-[10px] text-ivory-200 uppercase tracking-wider font-semibold">For Students</div>
                  </div>
                </div>

                {/* CTAs inside the highlighted container */}
                <div className="flex flex-wrap items-center gap-3 pt-1 relative z-10">
                  {/* Explore Scholarships Button -> routes to /explore */}
                  <button
                    onClick={onExploreClick}
                    style={{
                      background: "linear-gradient(135deg, #FDE68A 0%, #F59E0B 50%, #D97706 100%)",
                      color: "#10120F",
                    }}
                    className="group inline-flex items-center gap-3 rounded-full py-2.5 pl-6 pr-2.5 text-xs sm:text-sm font-extrabold shadow-[0_6px_22px_rgba(245,158,11,0.45)] hover:shadow-[0_8px_32px_rgba(245,158,11,0.7)] hover:scale-[1.03] active:scale-[0.98] transition-all cursor-pointer border border-amber-200/90"
                  >
                    <span style={{ color: "#10120F" }} className="tracking-wide font-extrabold">Explore Scholarships</span>
                    <span
                      style={{ backgroundColor: "#10120F", color: "#FDE68A" }}
                      className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full transition-all duration-300 group-hover:scale-110 shadow-md"
                    >
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </button>

                  {/* Get Started Button -> routes to /register */}
                  <button
                    onClick={onGetStartedClick}
                    style={{ backgroundColor: "rgba(0, 0, 0, 0.40)", color: "#FFFFFF" }}
                    className="inline-flex items-center gap-2 rounded-full hover:bg-black/60 backdrop-blur-md px-6 py-2.5 text-xs sm:text-sm font-extrabold border-2 border-white/30 hover:border-amber-400/80 transition-all cursor-pointer shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <span style={{ color: "#FFFFFF" }}>Get Started</span>
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default GrantlyHero;
