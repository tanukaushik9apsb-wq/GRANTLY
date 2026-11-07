import React from "react";
import {
  Compass,
  FileCheck2,
  BellRing,
  Workflow,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

export const FeatureSection: React.FC = () => {
  const features = [
    {
      icon: Compass,
      step: "01",
      title: "Algorithmic Eligibility Breakdown",
      description:
        "Instantly cross-references state domicile criteria, caste quotas, parental annual income caps (₹2.5L/₹8L), and academic merit cutoffs to give you zero-guesswork eligibility.",
      points: [
        "Income ceiling verification",
        "Category & quota matching",
        "Clear reason for every match or rejection",
      ],
    },
    {
      icon: FileCheck2,
      step: "02",
      title: "Digital Document Locker",
      description:
        "Pre-organize your Tahsildar income proofs, caste validity certificates, domicile papers, college bonafides, and marksheets in one safe, structured space.",
      points: [
        "Checklist by scheme requirements",
        "Expiry and renewal monitoring",
        "Zero sensitive data transmitted to third parties",
      ],
    },
    {
      icon: BellRing,
      step: "03",
      title: "National & State Deadline Radar",
      description:
        "Never miss a cutoff. Track official deadline timelines across NSP (National Scholarship Portal), MahaDBT, SSP Karnataka, UP Scholarship, and private CSR trusts.",
      points: [
        "Synchronized academic cycles",
        "Automated cutoff reminders",
        "Verification window alerts",
      ],
    },
    {
      icon: Workflow,
      step: "04",
      title: "Unified Application Pipeline",
      description:
        "From saved bookmarks to disbursement, manage your scholarship pipeline through a visual stage tracker so you always know where each application stands.",
      points: [
        "Stage-by-stage Kanban tracker",
        "Portal application reference ID logs",
        "Disbursement milestone tracking",
      ],
    },
  ];

  return (
    <section id="features" className="py-16 sm:py-24 px-4 sm:px-6 md:px-10 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono uppercase tracking-wider text-gold-400 bg-gold-500/10 border border-gold-500/20 mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Built for the Indian Higher Education Landscape</span>
        </div>
        <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-ivory-100 font-medium tracking-tight">
          Engineered to Eliminate Bureaucratic Friction
        </h2>
        <p className="text-xs sm:text-sm text-ivory-300/80 mt-3 font-light leading-relaxed">
          Over 60% of eligible Indian students miss out on scholarships due to fragmented state portals, missed verification dates, or missing documentation. GRANTLY solves this at every step.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {features.map((feature, idx) => {
          const Icon = feature.icon;
          return (
            <div
              key={idx}
              className="editorial-glass rounded-3xl p-6 sm:p-8 border border-white/10 hover:border-gold-500/30 transition-all duration-300 group relative flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-gold-400 group-hover:bg-gold-500/20 group-hover:scale-105 transition-all">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="font-mono text-xs text-ivory-400 font-semibold tracking-wider">
                    MODULE {feature.step}
                  </span>
                </div>

                <h3 className="font-serif text-xl sm:text-2xl font-semibold text-ivory-100 group-hover:text-gold-300 transition-colors">
                  {feature.title}
                </h3>

                <p className="text-xs sm:text-sm text-ivory-300/80 mt-3 font-light leading-relaxed">
                  {feature.description}
                </p>
              </div>

              <div className="mt-6 pt-6 border-t border-white/5 space-y-2">
                {feature.points.map((pt, pIdx) => (
                  <div key={pIdx} className="flex items-center gap-2 text-xs text-ivory-300 font-light">
                    <CheckCircle2 className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                    <span>{pt}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default FeatureSection;
