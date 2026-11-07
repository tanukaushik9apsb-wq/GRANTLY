import React from "react";
import { UserCheck, SlidersHorizontal, CheckCheck, ArrowRight } from "lucide-react";

interface HowItWorksSectionProps {
  onGetStartedClick?: () => void;
}

export const HowItWorksSection: React.FC<HowItWorksSectionProps> = ({
  onGetStartedClick,
}) => {
  const steps = [
    {
      num: "01",
      icon: UserCheck,
      title: "Calibrate Student Profile",
      desc: "Specify your current academic level (Class 10, 12, Diploma, UG, PG, PhD), course stream, home state, community category, and annual family income range.",
    },
    {
      num: "02",
      icon: SlidersHorizontal,
      title: "Discover Verified Schemes",
      desc: "Our engine maps your parameters against central guidelines, state reservations, and private foundation grants, showing you exactly why you qualify.",
    },
    {
      num: "03",
      icon: CheckCheck,
      title: "Track Until Disbursement",
      desc: "Assemble required documentation in your locker, link directly to verified official application portals, and track verification stages until funds disburse.",
    },
  ];

  return (
    <section id="how-it-works" className="py-16 sm:py-24 px-4 sm:px-6 md:px-10 max-w-7xl mx-auto">
      <div className="editorial-glass rounded-3xl p-6 sm:p-10 md:p-14 border border-white/10 relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-mono uppercase tracking-wider text-gold-400 bg-gold-500/10 px-3 py-1 rounded-full border border-gold-500/20">
            Simple 3-Stage Process
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-ivory-100 font-medium tracking-tight mt-3">
            From Discovery to Direct Bank Transfer
          </h2>
          <p className="text-xs sm:text-sm text-ivory-300/80 mt-3 font-light">
            Designed to bring absolute clarity to scholarship applications across India.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 relative z-10">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="bg-charcoal-950/60 rounded-2xl p-6 border border-white/5 hover:border-gold-500/30 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-2xl font-bold text-gold-400/80">
                      {step.num}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-ivory-200 group-hover:text-gold-300 group-hover:bg-gold-500/10 transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="font-serif text-lg font-semibold text-ivory-100 mb-2">
                    {step.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-ivory-300/80 font-light leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/5 flex items-center gap-2 text-xs font-mono text-gold-400/70">
                  <span>Step {idx + 1} of 3</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA Banner */}
        <div className="mt-12 text-center">
          <button
            onClick={onGetStartedClick}
            className="inline-flex items-center gap-3 px-8 py-3.5 rounded-full bg-ivory-100 hover:bg-white text-charcoal-950 font-semibold text-sm transition-all shadow-xl hover:scale-105 cursor-pointer"
          >
            <span>Launch Interactive Demo Profile</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
