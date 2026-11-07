import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  MapPin,
  Calendar,
  FileCheck2,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { DEMO_SAMPLE_STUDENT, DEMO_SCHOLARSHIPS } from "../../data/demoScholarships";
import { formatINR } from "../../lib/utils";

interface DemoStudentPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedIds: string[];
}

export const DemoStudentPreviewModal: React.FC<DemoStudentPreviewModalProps> = ({
  isOpen,
  onClose,
  savedIds,
}) => {
  const [activeTab, setActiveTab] = useState<"profile" | "applications" | "documents" | "deadlines">(
    "profile"
  );

  if (!isOpen) return null;

  const { profile, applications, documents } = DEMO_SAMPLE_STUDENT;
  const savedScholarships = DEMO_SCHOLARSHIPS.filter((s) => savedIds.includes(s.id));

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3 }}
          className="relative w-full max-w-4xl rounded-3xl bg-charcoal-900 border border-white/10 shadow-2xl overflow-hidden my-6"
        >
          {/* Header */}
          <div className="relative p-6 sm:p-8 bg-gradient-to-r from-charcoal-950 via-charcoal-900 to-charcoal-950 border-b border-white/10 flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <img
                  src={profile.avatarUrl}
                  alt={profile.fullName}
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover border-2 border-gold-500/40 shadow-lg"
                />
                <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-charcoal-900" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-ivory-100">
                    {profile.fullName}
                  </h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono text-gold-400 bg-gold-500/10 border border-gold-500/30">
                    DEMO STUDENT
                  </span>
                </div>
                <p className="text-xs text-ivory-300 mt-0.5">
                  {profile.currentCourse} • {profile.academicYear}
                </p>
                <div className="flex items-center gap-3 mt-1.5 text-[11px] text-ivory-400 font-mono">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-gold-400" />
                    {profile.district}, {profile.state}
                  </span>
                  <span>•</span>
                  <span>Category: {profile.category}</span>
                  <span>•</span>
                  <span>Score: {profile.percentageOrCGPA}%</span>
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-ivory-300 hover:text-white transition-colors"
              aria-label="Close demo profile"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 px-6 pt-4 border-b border-white/10 bg-charcoal-950/60 overflow-x-auto no-scrollbar">
            {[
              { id: "profile", label: "Profile Summary" },
              { id: "applications", label: `Active Applications (${applications.length})` },
              { id: "documents", label: `Document Locker (${documents.length})` },
              { id: "deadlines", label: `Saved & Deadlines (${savedScholarships.length})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`text-xs px-4 py-2.5 border-b-2 font-medium transition-colors shrink-0 cursor-pointer ${
                  activeTab === tab.id
                    ? "border-gold-400 text-gold-300"
                    : "border-transparent text-ivory-400 hover:text-ivory-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-6 sm:p-8 max-h-[58vh] overflow-y-auto">
            {/* 1. Profile Summary Tab */}
            {activeTab === "profile" && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-2xl bg-charcoal-950/80 border border-white/5">
                    <div className="text-[10px] font-mono text-ivory-400 uppercase">Education Level</div>
                    <div className="text-sm font-semibold text-ivory-100 mt-1">{profile.educationLevel}</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-charcoal-950/80 border border-white/5">
                    <div className="text-[10px] font-mono text-ivory-400 uppercase">Annual Family Income</div>
                    <div className="text-sm font-semibold text-gold-300 mt-1">{formatINR(profile.familyIncomeINR)}</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-charcoal-950/80 border border-white/5">
                    <div className="text-[10px] font-mono text-ivory-400 uppercase">Reservation Category</div>
                    <div className="text-sm font-semibold text-ivory-100 mt-1">{profile.category} (Non-Creamy Layer)</div>
                  </div>
                </div>

                <div className="rounded-2xl bg-gold-500/10 border border-gold-500/20 p-4">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-gold-400 mb-2 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Calculated Eligibility Summary</span>
                  </h4>
                  <p className="text-xs text-ivory-200/90 leading-relaxed font-light">
                    Aarav is 100% eligible for Maharashtra State MahaDBT OBC post-matric freeship and the Central Sector NSP scheme based on domicile and &lt; ₹4.5L family income.
                  </p>
                </div>
              </div>
            )}

            {/* 2. Active Applications Tab */}
            {activeTab === "applications" && (
              <div className="space-y-4">
                {applications.map((app) => {
                  const scheme = DEMO_SCHOLARSHIPS.find((s) => s.id === app.scholarshipId);
                  return (
                    <div
                      key={app.id}
                      className="p-5 rounded-2xl bg-charcoal-950/80 border border-white/5 space-y-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20">
                            {app.status === "under_review" ? "Under Review" : app.stageLabel || "Application in Progress"}
                          </span>
                          <h4 className="text-sm font-semibold text-ivory-100 mt-1.5">
                            {scheme?.title || app.scholarshipId}
                          </h4>
                          <p className="text-xs text-ivory-400 font-mono mt-0.5">
                            Reference ID: {app.portalReferenceId || "Not assigned"}
                          </p>
                        </div>

                        <div className="text-right">
                          <span className="text-xs font-bold text-gold-300 font-serif">
                            {scheme ? formatINR(scheme.amountINR) : ""}
                          </span>
                        </div>
                      </div>

                      <div className="text-xs text-ivory-300/80 bg-white/5 p-3 rounded-xl border border-white/5 font-light">
                        <strong>Status Note:</strong> {app.notes}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* 3. Document Locker Tab */}
            {activeTab === "documents" && (
              <div className="space-y-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-ivory-300 font-light">Organized Verification Documents</span>
                  <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>All 4 verified in demo</span>
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="p-4 rounded-2xl bg-charcoal-950/80 border border-white/5 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gold-500/10 text-gold-400 flex items-center justify-center">
                          <FileCheck2 className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-ivory-100 line-clamp-1">{doc.name}</div>
                          <div className="text-[10px] text-ivory-400 font-mono">{doc.category} • {doc.fileSize}</div>
                        </div>
                      </div>

                      <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                        Ready
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. Deadlines & Saved Tab */}
            {activeTab === "deadlines" && (
              <div className="space-y-4">
                <h4 className="text-xs font-mono uppercase tracking-wider text-gold-400 mb-2">
                  Saved Opportunities ({savedScholarships.length})
                </h4>

                {savedScholarships.length === 0 ? (
                  <p className="text-xs text-ivory-400">No saved scholarships yet. Bookmark schemes in the Explorer to track deadlines.</p>
                ) : (
                  savedScholarships.map((s) => (
                    <div
                      key={s.id}
                      className="p-4 rounded-2xl bg-charcoal-950/80 border border-white/5 flex items-center justify-between gap-4"
                    >
                      <div>
                        <h5 className="text-xs font-semibold text-ivory-100">{s.title}</h5>
                        <p className="text-[11px] text-ivory-400 flex items-center gap-1 mt-0.5">
                          <Calendar className="w-3 h-3 text-gold-400" />
                          <span>Deadline: {s.deadline}</span>
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-bold text-gold-300 font-serif block">
                          {formatINR(s.amountINR)}
                        </span>
                        <span className="text-[10px] text-ivory-400">{s.frequency}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 sm:p-6 bg-charcoal-950 border-t border-white/10 flex items-center justify-between text-xs text-ivory-400">
            <span>Seeded Demonstration Profile for Phase 1 Inspection</span>
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-full bg-ivory-100 hover:bg-white text-charcoal-950 font-semibold cursor-pointer"
            >
              Done Previewing
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default DemoStudentPreviewModal;
