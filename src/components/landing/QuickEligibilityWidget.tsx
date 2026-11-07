import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertCircle, ArrowRight, Sparkles } from "lucide-react";
import { DEMO_SCHOLARSHIPS } from "../../data/demoScholarships";
import { EducationLevel, SocialCategory, Scholarship } from "../../types";
import { formatINR } from "../../lib/utils";

interface QuickEligibilityWidgetProps {
  onSelectScholarship?: (scholarship: Scholarship) => void;
}

export const QuickEligibilityWidget: React.FC<QuickEligibilityWidgetProps> = ({
  onSelectScholarship,
}) => {
  const [educationLevel, setEducationLevel] = useState<EducationLevel>("Undergraduate");
  const [state, setState] = useState<string>("Maharashtra");
  const [category, setCategory] = useState<SocialCategory>("OBC");
  const [incomeRange, setIncomeRange] = useState<number>(350000); // 3.5 Lakhs
  const [percentage, setPercentage] = useState<number>(82);

  const statesList = [
    "All India",
    "Maharashtra",
    "Karnataka",
    "Uttar Pradesh",
    "Tamil Nadu",
    "West Bengal",
    "Rajasthan",
    "Kerala",
    "Gujarat",
    "Telangana",
    "Delhi NCR",
  ];

  // Real-time calculation of matched scholarships
  const matchingResults = useMemo(() => {
    return DEMO_SCHOLARSHIPS.map((scheme) => {
      let score = 0;
      const reasons: string[] = [];
      const blockers: string[] = [];

      // 1. Education check
      if (scheme.educationLevels.includes(educationLevel)) {
        score += 30;
        reasons.push(`Matches your ${educationLevel} education level`);
      } else {
        blockers.push(`Requires ${scheme.educationLevels.join(", ")}`);
      }

      // 2. State Domicile check
      if (scheme.applicableStates.includes("All India") || scheme.applicableStates.includes(state)) {
        score += 25;
        if (scheme.applicableStates.includes(state)) {
          reasons.push(`Tailored specifically for ${state} domicile`);
        } else {
          reasons.push(`Open to all Indian states (Central / Pan-India)`);
        }
      } else {
        blockers.push(`Restricted to ${scheme.applicableStates.join(", ")}`);
      }

      // 3. Category check
      if (
        scheme.applicableCategories.includes("General") ||
        scheme.applicableCategories.includes(category) ||
        (category === "Women" && scheme.genderRestriction === "Female")
      ) {
        score += 25;
        reasons.push(`Valid for ${category} category`);
      } else {
        blockers.push(`Only for ${scheme.applicableCategories.join(", ")}`);
      }

      // 4. Income check
      if (scheme.maxFamilyIncomeINR) {
        if (incomeRange <= scheme.maxFamilyIncomeINR) {
          score += 15;
          reasons.push(`Income ₹${(incomeRange / 100000).toFixed(1)}L is below ceiling of ₹${(scheme.maxFamilyIncomeINR / 100000).toFixed(1)}L`);
        } else {
          blockers.push(`Exceeds max income limit of ₹${(scheme.maxFamilyIncomeINR / 100000).toFixed(1)} Lakhs`);
        }
      } else {
        score += 15;
        reasons.push("No restrictive family income ceiling");
      }

      // 5. Merit check
      if (scheme.minPercentageOrCGPA) {
        if (percentage >= scheme.minPercentageOrCGPA) {
          score += 5;
          reasons.push(`Score ${percentage}% meets minimum cutoff (${scheme.minPercentageOrCGPA}%)`);
        } else {
          blockers.push(`Requires minimum ${scheme.minPercentageOrCGPA}% marks`);
        }
      }

      const isEligible = blockers.length === 0 && score >= 70;

      return {
        scheme,
        score,
        isEligible,
        reasons,
        blockers,
      };
    }).sort((a, b) => (b.isEligible ? 1 : 0) - (a.isEligible ? 1 : 0) || b.score - a.score);
  }, [educationLevel, state, category, incomeRange, percentage]);

  const eligibleList = matchingResults.filter((m) => m.isEligible);
  const potentialAid = eligibleList.reduce((acc, curr) => acc + curr.scheme.amountINR, 0);

  return (
    <section id="eligibility" className="py-16 sm:py-24 px-4 sm:px-6 md:px-10 max-w-7xl mx-auto">
      <div className="editorial-glass rounded-3xl p-6 sm:p-10 md:p-12 border border-white/10 relative overflow-hidden shadow-2xl">
        {/* Ambient Gold Glow on top corner */}
        <div className="absolute -top-32 -right-32 w-80 h-80 rounded-full bg-gold-500/10 blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Interactive Inputs */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono uppercase tracking-wider text-gold-400 bg-gold-500/10 border border-gold-500/20 mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Eligibility Engine Preview</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-ivory-100 font-medium tracking-tight">
                Calculate Your Matching Opportunities in Seconds
              </h2>
              <p className="text-xs sm:text-sm text-ivory-300/80 mt-2 font-light leading-relaxed">
                Test your parameters against Indian central and state criteria. No signup required for quick estimation.
              </p>
            </div>

            <div className="flex flex-col gap-5 pt-2">
              {/* Education Level */}
              <div>
                <label className="block text-xs font-medium text-ivory-300 uppercase tracking-wider mb-2">
                  1. Current Education Level
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(["Class 10", "Class 12", "Diploma", "Undergraduate", "Postgraduate", "PhD"] as EducationLevel[]).map(
                    (level) => (
                      <button
                        key={level}
                        type="button"
                        onClick={() => setEducationLevel(level)}
                        className={`text-xs py-2 px-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                          educationLevel === level
                            ? "bg-gold-500/20 border-gold-500/60 text-gold-300 font-medium shadow-sm"
                            : "bg-charcoal-900/60 border-white/5 text-ivory-400 hover:border-white/20 hover:text-ivory-200"
                        }`}
                      >
                        {level}
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* State & Category Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Domicile State */}
                <div>
                  <label className="block text-xs font-medium text-ivory-300 uppercase tracking-wider mb-2">
                    2. Domicile State
                  </label>
                  <select
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full text-xs rounded-xl bg-charcoal-900 border border-white/10 px-3 py-2.5 text-ivory-100 focus:outline-none focus:border-gold-500/50 cursor-pointer"
                  >
                    {statesList.map((s) => (
                      <option key={s} value={s} className="bg-charcoal-950 text-ivory-100">
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Social Category */}
                <div>
                  <label className="block text-xs font-medium text-ivory-300 uppercase tracking-wider mb-2">
                    3. Category / Reservation
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as SocialCategory)}
                    className="w-full text-xs rounded-xl bg-charcoal-900 border border-white/10 px-3 py-2.5 text-ivory-100 focus:outline-none focus:border-gold-500/50 cursor-pointer"
                  >
                    {(["General", "OBC", "SC", "ST", "EWS", "Minority", "Women", "PwD"] as SocialCategory[]).map(
                      (cat) => (
                        <option key={cat} value={cat} className="bg-charcoal-950 text-ivory-100">
                          {cat}
                        </option>
                      )
                    )}
                  </select>
                </div>
              </div>

              {/* Annual Family Income Slider */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-medium text-ivory-300 uppercase tracking-wider">
                    4. Annual Family Income
                  </label>
                  <span className="font-mono text-xs font-semibold text-gold-400 bg-gold-500/10 px-2 py-0.5 rounded border border-gold-500/20">
                    {formatINR(incomeRange)} / year
                  </span>
                </div>
                <input
                  type="range"
                  min="50000"
                  max="1200000"
                  step="50000"
                  value={incomeRange}
                  onChange={(e) => setIncomeRange(Number(e.target.value))}
                  className="w-full accent-gold-500 cursor-pointer bg-charcoal-800 h-2 rounded-lg"
                />
                <div className="flex justify-between text-[10px] text-ivory-400 font-mono mt-1">
                  <span>₹50K</span>
                  <span>₹2.5L (EWS Cap)</span>
                  <span>₹8.0L (OBC NCL Cap)</span>
                  <span>₹12L+</span>
                </div>
              </div>

              {/* Academic Percentage */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-medium text-ivory-300 uppercase tracking-wider">
                    5. Academic Score / Percentage
                  </label>
                  <span className="font-mono text-xs font-semibold text-ivory-100 bg-white/5 px-2 py-0.5 rounded border border-white/10">
                    {percentage}%
                  </span>
                </div>
                <input
                  type="range"
                  min="45"
                  max="98"
                  step="1"
                  value={percentage}
                  onChange={(e) => setPercentage(Number(e.target.value))}
                  className="w-full accent-gold-500 cursor-pointer bg-charcoal-800 h-2 rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Right Column: Live Results */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            {/* Summary Highlight Box */}
            <div className="editorial-glass-gold rounded-2xl p-5 border flex items-center justify-between flex-wrap gap-4">
              <div>
                <div className="text-xs text-ivory-300 font-light uppercase tracking-wider">
                  Calculated Matching Schemes
                </div>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="font-serif text-3xl sm:text-4xl font-bold text-gold-300">
                    {eligibleList.length}
                  </span>
                  <span className="text-xs text-ivory-300">
                    of {DEMO_SCHOLARSHIPS.length} demo schemes evaluated
                  </span>
                </div>
              </div>

              <div className="text-right">
                <div className="text-xs text-ivory-300 font-light uppercase tracking-wider">
                  Estimated Potential Assistance
                </div>
                <div className="font-serif text-2xl sm:text-3xl font-bold text-ivory-100 mt-1">
                  {formatINR(potentialAid)}
                  <span className="text-xs font-normal text-ivory-400 ml-1">/ year</span>
                </div>
              </div>
            </div>

            {/* Scheme Cards Stream */}
            <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
              <AnimatePresence>
                {matchingResults.slice(0, 5).map(({ scheme, score, isEligible, reasons, blockers }) => (
                  <motion.div
                    key={scheme.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className={`rounded-2xl p-4 transition-all border ${
                      isEligible
                        ? "bg-charcoal-900/80 border-white/10 hover:border-gold-500/40"
                        : "bg-charcoal-950/40 border-white/5 opacity-60"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-mono font-medium uppercase tracking-wider ${
                              isEligible
                                ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/20"
                                : "bg-amber-500/10 text-amber-300 border border-amber-500/20"
                            }`}
                          >
                            {isEligible ? "High Match (100% Eligible)" : `Partial Match (${score}%)`}
                          </span>
                          <span className="text-[10px] text-ivory-400 font-mono">
                            {scheme.type}
                          </span>
                        </div>
                        <h3 className="text-sm font-semibold text-ivory-100 hover:text-gold-300 transition-colors">
                          {scheme.title}
                        </h3>
                        <p className="text-xs text-ivory-400 mt-0.5">{scheme.provider}</p>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="text-sm font-bold text-gold-300">
                          {formatINR(scheme.amountINR)}
                        </div>
                        <span className="text-[10px] text-ivory-400">{scheme.frequency}</span>
                      </div>
                    </div>

                    {/* Eligibility Explanations */}
                    <div className="mt-3 pt-3 border-t border-white/5 flex flex-col gap-1 text-[11px]">
                      {isEligible ? (
                        <div className="flex items-center gap-1.5 text-emerald-400">
                          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                          <span>{reasons[0] || "Fully satisfies income, domicile, and academic criteria."}</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-amber-400/90">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>{blockers[0] || "Check specific income or domicile requirements."}</span>
                        </div>
                      )}
                    </div>

                    <div className="mt-3 flex items-center justify-between text-xs">
                      <span className="text-[10px] font-mono text-ivory-400">
                        Deadline: {scheme.deadline}
                      </span>
                      <button
                        onClick={() => onSelectScholarship?.(scheme)}
                        className="inline-flex items-center gap-1 text-gold-400 hover:text-gold-300 text-xs font-medium cursor-pointer"
                      >
                        <span>View Details</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default QuickEligibilityWidget;
