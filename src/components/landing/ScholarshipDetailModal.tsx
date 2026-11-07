import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Building2,
  Calendar,
  FileText,
  CheckCircle,
  ExternalLink,
  Bookmark,
  Share2,
  ShieldAlert,
  GraduationCap,
  Users,
  Send,
  HelpCircle,
} from "lucide-react";
import { Scholarship } from "../../types";
import { formatINR } from "../../lib/utils";
import { EligibilityBreakdownModal } from "../scholarship/EligibilityBreakdownModal";
import { DEMO_SAMPLE_STUDENT } from "../../data/demoScholarships";

interface ScholarshipDetailModalProps {
  scholarship: Scholarship | null;
  onClose: () => void;
  isBookmarked: boolean;
  onToggleBookmark: (id: string) => void;
  onAddToTracker?: (scholarshipId: string) => void;
}

export const ScholarshipDetailModal: React.FC<ScholarshipDetailModalProps> = ({
  scholarship,
  onClose,
  isBookmarked,
  onToggleBookmark,
  onAddToTracker,
}) => {
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [trackerAdded, setTrackerAdded] = useState(false);

  if (!scholarship) return null;

  const handleTrack = () => {
    if (onAddToTracker) {
      onAddToTracker(scholarship.id);
    } else {
      try {
        const stored = localStorage.getItem("grantly_applications");
        const list = stored ? JSON.parse(stored) : DEMO_SAMPLE_STUDENT.applications;
        if (!list.some((a: any) => a.scholarshipId === scholarship.id)) {
          const newApp = {
            id: `app-${Date.now()}`,
            scholarshipId: scholarship.id,
            status: "preparing_documents",
            updatedAt: new Date().toISOString(),
            portalReferenceId: `DRAFT-${Math.floor(1000 + Math.random() * 9000)}`,
            notes: "Added to tracker from scheme details. Preparing required certificates.",
            stageLabel: "Preparing Documents",
          };
          localStorage.setItem("grantly_applications", JSON.stringify([newApp, ...list]));
        }
      } catch (e) {
        console.warn("Storage error", e);
      }
    }
    setTrackerAdded(true);
    setTimeout(() => setTrackerAdded(false), 2500);
  };

  return (
    <>
      <AnimatePresence>
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-3xl rounded-3xl bg-charcoal-900 border border-white/10 shadow-2xl overflow-hidden my-8"
          >
            {/* Header Banner */}
            <div className="relative p-6 sm:p-8 bg-gradient-to-r from-charcoal-950 via-charcoal-900 to-charcoal-950 border-b border-white/10">
              <button
                onClick={onClose}
                className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 text-ivory-300 hover:text-white transition-colors cursor-pointer"
                aria-label="Close details"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 mb-3">
                <span className="px-2.5 py-1 rounded-full text-xs font-mono font-medium text-gold-400 bg-gold-500/10 border border-gold-500/30">
                  {scholarship.type}
                </span>
                {scholarship.isDemoRecord ? (
                  <span className="px-2.5 py-1 rounded-full text-xs font-mono text-blue-300 bg-blue-500/10 border border-blue-500/30">
                    DEMO RECORD (SIMULATED)
                  </span>
                ) : scholarship.verificationStatus === "verified" ? (
                  <span className="px-2.5 py-1 rounded-full text-xs font-mono text-emerald-300 bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>VERIFIED OFFICIAL LISTING</span>
                  </span>
                ) : (
                  <span className="px-2.5 py-1 rounded-full text-xs font-mono text-amber-300 bg-amber-500/10 border border-amber-500/30">
                    PENDING VERIFICATION
                  </span>
                )}
              </div>

              <h2 className="font-serif text-2xl sm:text-3xl text-ivory-100 font-semibold pr-10">
                {scholarship.title}
              </h2>
              <p className="text-sm text-ivory-300/80 mt-1 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-gold-400" />
                <span>{scholarship.provider}</span>
              </p>

              {/* Quick Metrics Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/10">
                <div>
                  <div className="text-[11px] font-mono uppercase tracking-wider text-ivory-400">
                    Financial Assistance
                  </div>
                  <div className="text-xl sm:text-2xl font-bold text-gold-300 font-serif">
                    {formatINR(scholarship.amountINR)}
                    <span className="text-xs font-normal text-ivory-400 ml-1">
                      /{scholarship.frequency.toLowerCase()}
                    </span>
                  </div>
                </div>

                <div>
                  <div className="text-[11px] font-mono uppercase tracking-wider text-ivory-400">
                    Simulated Deadline
                  </div>
                  <div className="text-base sm:text-lg font-semibold text-ivory-100 flex items-center gap-1.5 mt-0.5">
                    <Calendar className="w-4 h-4 text-gold-400" />
                    <span>{scholarship.deadline}</span>
                  </div>
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <div className="text-[11px] font-mono uppercase tracking-wider text-ivory-400">
                    Target States
                  </div>
                  <div className="text-sm font-medium text-ivory-200 mt-0.5">
                    {scholarship.applicableStates.join(", ")}
                  </div>
                </div>
              </div>
            </div>

            {/* Body Content */}
            <div className="p-6 sm:p-8 space-y-6 max-h-[58vh] overflow-y-auto">
              {/* Description */}
              <div>
                <h3 className="text-xs font-mono uppercase tracking-wider text-gold-400 mb-2">
                  Scheme Overview
                </h3>
                <p className="text-sm text-ivory-200/90 leading-relaxed font-light">
                  {scholarship.description}
                </p>
              </div>

              {/* Eligibility Breakdown Summary Box */}
              <div className="rounded-2xl bg-charcoal-950/80 p-5 border border-white/5 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-mono uppercase tracking-wider text-gold-400 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    <span>Eligibility Criteria Checklist</span>
                  </h3>

                  <button
                    onClick={() => setShowBreakdown(true)}
                    className="text-xs text-gold-400 hover:text-gold-300 font-medium inline-flex items-center gap-1 cursor-pointer"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>Criterion Explanation</span>
                  </button>
                </div>

                <p className="text-sm font-medium text-ivory-100">
                  {scholarship.eligibilitySummary}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs text-ivory-300">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-gold-400" />
                    <span>Levels: {scholarship.educationLevels.join(", ")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gold-400" />
                    <span>Categories: {scholarship.applicableCategories.join(", ")}</span>
                  </div>
                  {scholarship.maxFamilyIncomeINR && (
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-gold-400 font-bold">₹</span>
                      <span>Max Income: {formatINR(scholarship.maxFamilyIncomeINR)}</span>
                    </div>
                  )}
                  {scholarship.minPercentageOrCGPA && (
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-gold-400 font-bold">%</span>
                      <span>Min Score: {scholarship.minPercentageOrCGPA}% score</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Required Documents */}
              <div>
                <h3 className="text-xs font-mono uppercase tracking-wider text-gold-400 mb-3 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  <span>Mandatory Verification Documents</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {scholarship.documentsRequired.map((doc, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2.5 p-3 rounded-xl bg-white/5 border border-white/5 text-xs text-ivory-200"
                    >
                      <div className="w-5 h-5 rounded-full bg-gold-500/10 text-gold-400 flex items-center justify-center shrink-0 text-[10px] font-mono">
                        {idx + 1}
                      </div>
                      <span>{doc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Compliance Disclaimer */}
              <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-3.5 flex items-start gap-2.5 text-xs text-amber-300/90">
                <ShieldAlert className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
                <div>
                  {scholarship.isDemoRecord ? (
                    <>
                      <strong>Demonstration Record Notice:</strong> Scheme award figures and conditions reflect simulated Indian criteria for testing. Official applications must be performed exclusively on respective government portals.
                    </>
                  ) : (
                    <>
                      <strong>Statutory Portal Notice:</strong> GRANTLY is an internal scholarship discovery and preparation assistant. Saving or tracking this opportunity inside GRANTLY does <em>NOT</em> submit your form to government authorities. You must finalize your official submission on the official portal linked below.
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-6 bg-charcoal-950 border-t border-white/10 flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onToggleBookmark(scholarship.id)}
                  className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-medium border transition-colors cursor-pointer ${
                    isBookmarked
                      ? "bg-gold-500/20 border-gold-500/50 text-gold-300"
                      : "bg-white/5 border-white/10 text-ivory-300 hover:text-white"
                  }`}
                >
                  <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? "fill-gold-400" : ""}`} />
                  <span>{isBookmarked ? "Saved in Workspace" : "Save Scheme"}</span>
                </button>

                <button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    alert("Scheme URL copied to clipboard!");
                  }}
                  className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 text-ivory-300 hover:text-white border border-white/10 transition-colors"
                  title="Share Scheme"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleTrack}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/10 hover:bg-gold-500/20 text-xs font-semibold text-ivory-100 hover:text-gold-300 border border-white/10 transition-colors cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{trackerAdded ? "Added to Tracker!" : "Add to Application Tracker"}</span>
                </button>

                {scholarship.officialPortalUrl && (
                  <a
                    href={scholarship.officialPortalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-ivory-100 hover:bg-white text-charcoal-950 text-xs sm:text-sm font-semibold transition-all shadow-lg"
                  >
                    <span>Official Portal</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </AnimatePresence>

      {/* Deep Criterion Explanation Modal */}
      {showBreakdown && (
        <EligibilityBreakdownModal
          scholarship={scholarship}
          profile={DEMO_SAMPLE_STUDENT.profile}
          onClose={() => setShowBreakdown(false)}
          onAddToTracker={handleTrack}
        />
      )}
    </>
  );
};

export default ScholarshipDetailModal;
