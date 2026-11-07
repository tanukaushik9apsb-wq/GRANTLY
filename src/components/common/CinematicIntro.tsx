import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, FastForward } from "lucide-react";

interface CinematicIntroProps {
  onComplete: () => void;
}

const SESSION_STORAGE_KEY = "grantly_intro_shown";

export const CinematicIntro: React.FC<CinematicIntroProps> = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);
  const letters = "GRANTLY".split("");

  // Check prefers-reduced-motion
  useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia) {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        sessionStorage.setItem(SESSION_STORAGE_KEY, "true");
        setIsVisible(false);
        onComplete();
        return;
      }
    }

    // Auto-advance after 2.8 seconds
    const timer = setTimeout(() => {
      handleFinish();
    }, 2800);

    // Escape key skips intro
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleFinish();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleFinish = () => {
    try {
      sessionStorage.setItem(SESSION_STORAGE_KEY, "true");
    } catch (e) {
      console.warn("Storage error", e);
    }
    setIsVisible(false);
    setTimeout(() => {
      onComplete();
    }, 450); // Give time for exit animation
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="cinematic-intro"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.03 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#10120F] text-[#E9E6D7] overflow-hidden select-none"
          role="dialog"
          aria-label="Welcome to GRANTLY"
        >
          {/* Subtle Film Grain Noise Texture */}
          <div className="noise-overlay pointer-events-none absolute inset-0 opacity-[0.7] mix-blend-overlay" />

          {/* Minimal Warm Golden Radial Ambient Light Glow */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.8, ease: "easeOut" }}
            className="pointer-events-none absolute w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,_rgba(214,198,154,0.18)_0%,_rgba(16,18,15,0)_70%)] blur-2xl -translate-y-10"
          />

          {/* Skip Intro Button (Top Right) */}
          <div className="absolute top-6 right-6 z-20">
            <button
              onClick={handleFinish}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono tracking-wider uppercase text-[#A5A397] hover:text-[#E9E6D7] bg-white/5 hover:bg-white/10 border border-white/10 transition-all cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-gold-400"
              aria-label="Skip introductory animation"
            >
              <span>Skip</span>
              <FastForward className="w-3 h-3" />
            </button>
          </div>

          {/* Center Brand Sequence */}
          <div className="relative z-10 flex flex-col items-center px-4 max-w-2xl text-center">
            {/* Minimal Icon Badge */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="w-8 h-8 rounded-full bg-[#D6C69A]/15 border border-[#D6C69A]/30 flex items-center justify-center text-[#D6C69A] mb-5 shadow-lg shadow-black/50"
            >
              <Sparkles className="w-4 h-4" />
            </motion.div>

            {/* Letter by Letter Wordmark Reveal */}
            <h1 className="font-serif font-bold text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-[0.18em] text-[#E9E6D7] flex items-center justify-center relative">
              {letters.map((letter, index) => (
                <motion.span
                  key={index}
                  initial={{ y: 35, opacity: 0, filter: "blur(6px)" }}
                  animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                  transition={{
                    duration: 0.65,
                    delay: 0.25 + index * 0.08,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="inline-block"
                >
                  {letter}
                </motion.span>
              ))}

              {/* Superscript Golden Asterisk */}
              <motion.span
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.85, ease: "backOut" }}
                className="text-[#D6C69A] text-[0.45em] ml-1.5 align-top inline-block"
              >
                *
              </motion.span>
            </h1>

            {/* Expanding Thin Golden Line Beneath Logo */}
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.95, ease: [0.16, 1, 0.3, 1] }}
              className="h-px w-48 sm:w-64 md:w-80 bg-gradient-to-r from-transparent via-[#D6C69A] to-transparent my-4 origin-center"
            />

            {/* Tagline Fade In */}
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 1.25, ease: [0.16, 1, 0.3, 1] }}
              className="text-xs sm:text-sm md:text-base font-light text-[#A5A397] tracking-wider max-w-md font-sans"
            >
              Every opportunity deserves to be discovered.
            </motion.p>
          </div>

          {/* Minimal Bottom Indication */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ duration: 1, delay: 1.6 }}
            className="absolute bottom-8 text-[11px] font-mono tracking-widest uppercase text-[#A5A397]"
          >
            Unified Indian Scholarship Platform
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CinematicIntro;
