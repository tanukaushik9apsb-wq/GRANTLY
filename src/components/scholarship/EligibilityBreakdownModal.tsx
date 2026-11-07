import React from "react";
import {
  X,
  CheckCircle2,
  AlertCircle,
  ShieldAlert,
} from "lucide-react";
import { Scholarship, StudentProfile, CriterionExplanation } from "../../types";
import { formatINR } from "../../lib/utils";

interface EligibilityBreakdownModalProps {
  scholarship: Scholarship | null;
  profile: StudentProfile;
  onClose: () => void;
  onAddToTracker?: (scholarshipId: string) => void;
}

export const EligibilityBreakdownModal: React.FC<EligibilityBreakdownModalProps> = ({
  scholarship,
  profile,
  onClose,
  onAddToTracker,
}) => {
  if (!scholarship) return null;

  // 1. Education Level check
  const levelMatch = scholarship.educationLevels.includes(profile.educationLevel);
  const levelExplanation: CriterionExplanation = {
    criterion: "Education Level",
    satisfied: levelMatch,
    studentValue: profile.educationLevel,
    schemeRequirement: scholarship.educationLevels.join(", "),
    reason: levelMatch
      ? `Your current level (${profile.educationLevel}) matches the scheme's eligible stages.`
      : `Scheme requires enrollment in ${scholarship.educationLevels.join(", ")}; you are enrolled in ${profile.educationLevel}.`,
  };

  // 2. Domicile State check
  const stateMatch =
    scholarship.applicableStates.includes("All India") ||
    scholarship.applicableStates.includes(profile.state);
  const stateExplanation: CriterionExplanation = {
    criterion: "State Domicile",
    satisfied: stateMatch,
    studentValue: profile.state,
    schemeRequirement: scholarship.applicableStates.join(", "),
    reason: stateMatch
      ? scholarship.applicableStates.includes("All India")
        ? "Pan-India scheme open to Indian citizens across all states & UTs."
        : `Specifically tailored for permanent domicile candidates of ${profile.state}.`
      : `Restricted to candidates possessing domicile of ${scholarship.applicableStates.join(", ")}.`,
  };

  // 3. Social Category & Quotas
  const categoryMatch =
    scholarship.applicableCategories.includes("General") ||
    scholarship.applicableCategories.includes(profile.category) ||
    (profile.gender === "Female" && scholarship.genderRestriction === "Female");
  const categoryExplanation: CriterionExplanation = {
    criterion: "Category & Reservation",
    satisfied: categoryMatch,
    studentValue: `${profile.category} (${profile.gender})`,
    schemeRequirement: `${scholarship.applicableCategories.join(", ")}${
      scholarship.genderRestriction !== "All" ? ` • Gender: ${scholarship.genderRestriction}` : ""
    }`,
    reason: categoryMatch
      ? `Valid under notified category quotas (${profile.category}).`
      : `Targeted exclusively for ${scholarship.applicableCategories.join(", ")} applicants.`,
  };

  // 4. Annual Family Income Cap
  const incomeMatch =
    !scholarship.maxFamilyIncomeINR || profile.familyIncomeINR <= scholarship.maxFamilyIncomeINR;
  const incomeExplanation: CriterionExplanation = {
    criterion: "Annual Family Income",
    satisfied: incomeMatch,
    studentValue: formatINR(profile.familyIncomeINR),
    schemeRequirement: scholarship.maxFamilyIncomeINR
      ? `Maximum ${formatINR(scholarship.maxFamilyIncomeINR)} / year`
      : "No statutory income ceiling",
    reason: incomeMatch
      ? scholarship.maxFamilyIncomeINR
        ? `Your household income (${formatINR(profile.familyIncomeINR)}) is within the statutory limit of ${formatINR(
            scholarship.maxFamilyIncomeINR
          )}.`
        : "Scheme has no restrictive family income limit."
      : `Household income (${formatINR(profile.familyIncomeINR)}) exceeds the maximum ceiling of ${formatINR(
          scholarship.maxFamilyIncomeINR!
        )}.`,
  };

  // 5. Academic Performance (CGPA / Marks)
  const scoreInPercent = profile.percentageOrCGPA <= 10 ? profile.percentageOrCGPA * 10 : profile.percentageOrCGPA;
  const scoreMatch = !scholarship.minPercentageOrCGPA || scoreInPercent >= scholarship.minPercentageOrCGPA;
  const scoreExplanation: CriterionExplanation = {
    criterion: "Academic Merit Cutoff",
    satisfied: scoreMatch,
    studentValue: `${profile.percentageOrCGPA} CGPA (~${scoreInPercent.toFixed(1)}%)`,
    schemeRequirement: scholarship.minPercentageOrCGPA
      ? `Minimum ${scholarship.minPercentageOrCGPA}% score`
      : "No minimum cutoff specified",
    reason: scoreMatch
      ? scholarship.minPercentageOrCGPA
        ? `Your academic score meets the merit benchmark of ${scholarship.minPercentageOrCGPA}%.`
        : "Open to regular enrolled students without minimum percentage filter."
      : `Academic score falls below the required threshold of ${scholarship.minPercentageOrCGPA}%.`,
  };

  const criteriaList = [
    levelExplanation,
    stateExplanation,
    categoryExplanation,
    incomeExplanation,
    scoreExplanation,
  ];

  const satisfiedCount = criteriaList.filter((c) => c.satisfied).length;
  const isOverallEligible = satisfiedCount === criteriaList.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-3xl bg-charcoal-900 border border-white/10 shadow-2xl overflow-hidden my-6">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-charcoal-950 via-charcoal-900 to-charcoal-950 border-b border-white/10 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider text-gold-400 bg-gold-500/10 border border-gold-500/20">
                Criterion-by-Criterion Engine
              </span>
              <span className="text-[10px] font-mono text-ivory-400">DEMO EVALUATION</span>
            </div>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-ivory-100">
              Eligibility Breakdown
            </h3>
            <p className="text-xs text-ivory-300/80 mt-0.5 font-light">
              Evaluated against <strong>{profile.fullName}</strong> ({profile.district}, {profile.state})
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-ivory-300 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scheme Banner */}
        <div className="px-6 py-4 bg-charcoal-950 border-b border-white/5 flex items-center justify-between flex-wrap gap-2">
          <div>
            <div className="text-xs font-semibold text-ivory-100">{scholarship.title}</div>
            <div className="text-[11px] text-ivory-400">{scholarship.provider}</div>
          </div>
          <div className="text-right">
            <span className="text-sm font-bold text-gold-300 font-serif">
              {formatINR(scholarship.amountINR)}
            </span>
            <span className="text-[10px] text-ivory-400 block">{scholarship.frequency}</span>
          </div>
        </div>

        {/* Overall Match Status Banner */}
        <div className="p-6 space-y-5 max-h-[58vh] overflow-y-auto">
          <div
            className={`p-4 rounded-2xl border flex items-center justify-between ${
              isOverallEligible
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                : "bg-amber-500/10 border-amber-500/30 text-amber-300"
            }`}
          >
            <div className="flex items-center gap-3">
              {isOverallEligible ? (
                <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
              ) : (
                <AlertCircle className="w-6 h-6 text-amber-400 shrink-0" />
              )}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider">
                  {isOverallEligible ? "High Compatibility Match" : "Partial Match / Ineligible Criteria"}
                </h4>
                <p className="text-xs mt-0.5 font-light text-ivory-200">
                  {isOverallEligible
                    ? "Your profile satisfies all 5 prerequisite guidelines."
                    : `${5 - satisfiedCount} of 5 criteria currently do not match.`}
                </p>
              </div>
            </div>

            <span className="text-sm font-serif font-bold text-ivory-100">
              {satisfiedCount} / 5 Criteria Met
            </span>
          </div>

          {/* 5 Criteria List */}
          <div className="space-y-3">
            {criteriaList.map((item, index) => (
              <div
                key={index}
                className={`p-4 rounded-2xl border transition-all ${
                  item.satisfied
                    ? "bg-charcoal-950/80 border-white/5"
                    : "bg-charcoal-950/90 border-amber-500/20"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    {item.satisfied ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                    )}
                    <h5 className="text-xs font-semibold text-ivory-100">{item.criterion}</h5>
                  </div>

                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                      item.satisfied
                        ? "bg-emerald-500/15 text-emerald-300"
                        : "bg-amber-500/15 text-amber-300"
                    }`}
                  >
                    {item.satisfied ? "Satisfied" : "Unmet"}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-white/5 text-[11px] font-mono">
                  <div className="text-ivory-400">
                    Your Profile: <strong className="text-ivory-200">{item.studentValue}</strong>
                  </div>
                  <div className="text-ivory-400">
                    Requirement: <strong className="text-ivory-200">{item.schemeRequirement}</strong>
                  </div>
                </div>

                <p className="text-[11px] text-ivory-300/90 font-light mt-1.5 leading-snug">
                  {item.reason}
                </p>
              </div>
            ))}
          </div>

          {/* Mandatory Non-Misleading Guarantee Disclaimer */}
          <div className="rounded-2xl bg-charcoal-950 p-4 border border-white/10 flex items-start gap-3 text-[11px] text-ivory-400">
            <ShieldAlert className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong>Official Scheme Verification Notice:</strong> This platform performs algorithmic preliminary evaluation against statutory guidelines. Final grant sanction and disbursement are subject to original revenue/caste certificate scrutiny by state nodal officers.
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-6 bg-charcoal-950 border-t border-white/10 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 text-xs text-ivory-300 transition-colors"
          >
            Close
          </button>

          <div className="flex items-center gap-2">
            {onAddToTracker && (
              <button
                onClick={() => {
                  onAddToTracker(scholarship.id);
                  onClose();
                }}
                className="px-5 py-2 rounded-full bg-ivory-100 hover:bg-white text-charcoal-950 text-xs font-semibold shadow-lg transition-all cursor-pointer"
              >
                Add to Application Tracker
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EligibilityBreakdownModal;
