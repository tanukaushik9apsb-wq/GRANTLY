import { useState, useEffect } from "react";
import {
  Send,
  Building2,
  ExternalLink,
  Plus,
  AlertTriangle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "../components/layout/DashboardLayout";
import { DEMO_SAMPLE_STUDENT, DEMO_SCHOLARSHIPS } from "../data/demoScholarships";
import { ScholarshipService } from "../services/scholarshipService";
import { formatINR } from "../lib/utils";
import { ScholarshipDetailModal } from "../components/landing/ScholarshipDetailModal";
import { Scholarship } from "../types";
import { useToast } from "../components/common/Toast";

export function ApplicationsPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [allScholarships, setAllScholarships] = useState<Scholarship[]>([]);

  useEffect(() => {
    ScholarshipService.getAllScholarships().then(setAllScholarships).catch(console.warn);
  }, []);

  const [applications, setApplications] = useState(() => {
    try {
      const stored = localStorage.getItem("grantly_applications");
      return stored ? JSON.parse(stored) : DEMO_SAMPLE_STUDENT.applications;
    } catch {
      return DEMO_SAMPLE_STUDENT.applications;
    }
  });

  const [filterStage, setFilterStage] = useState<string>("all");
  const [selectedScholarship, setSelectedScholarship] = useState<Scholarship | null>(null);

  const stageOptions = [
    { id: "all", label: "All Active", count: applications.length },
    { id: "applied", label: "Applied", count: applications.filter((a: any) => a.status === "applied").length },
    { id: "preparing_documents", label: "Preparing Documents", count: applications.filter((a: any) => a.status === "preparing_documents").length },
    { id: "under_review", label: "Under Review", count: applications.filter((a: any) => a.status === "under_review").length },
    { id: "approved", label: "Approved / Disbursed", count: applications.filter((a: any) => a.status === "approved").length },
  ];

  const filteredApplications = applications.filter((app: any) => {
    if (filterStage === "all") return true;
    return app.status === filterStage;
  });

  const handleUpdateStatus = (appId: string, newStatus: string) => {
    const updated = applications.map((app: any) => {
      if (app.id === appId) {
        let label = "Applied";
        if (newStatus === "preparing_documents") label = "Preparing Documents";
        if (newStatus === "under_review") label = "Under Review";
        if (newStatus === "approved") label = "Approved";

        return {
          ...app,
          status: newStatus,
          stageLabel: label,
          updatedAt: new Date().toISOString(),
          notes: `Status transitioned to ${label} on ${new Date().toLocaleDateString("en-IN")}.`,
        };
      }
      return app;
    });

    setApplications(updated);
    try {
      localStorage.setItem("grantly_applications", JSON.stringify(updated));
    } catch (e) {
      console.warn("Storage error", e);
    }

    const appObj = applications.find((a: any) => a.id === appId);
    const scheme = allScholarships.find((s: Scholarship) => s.id === appObj?.scholarshipId) || DEMO_SCHOLARSHIPS.find((s: Scholarship) => s.id === appObj?.scholarshipId);
    showToast("Application Stage Updated", `${scheme?.title || "Scheme"} is now: ${newStatus.replace("_", " ")}`, "success");
  };

  const handleRemoveApplication = (appId: string) => {
    const updated = applications.filter((a: any) => a.id !== appId);
    setApplications(updated);
    try {
      localStorage.setItem("grantly_applications", JSON.stringify(updated));
    } catch (e) {
      console.warn("Storage error", e);
    }
    showToast("Application Removed from Tracker", undefined, "info");
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-gold-400 mb-1">
              <Send className="w-3.5 h-3.5" />
              <span>Pipeline & Verification Tracking</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-ivory-100">
              Application Tracker
            </h1>
            <p className="text-xs sm:text-sm text-ivory-300/80 mt-1 font-light">
              Track government portals and CSR initiatives through each verification milestone.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/explore")}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-ivory-100 hover:bg-white text-charcoal-950 font-semibold text-xs transition-all shadow-md cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Track New Scheme</span>
            </button>
          </div>
        </div>

        {/* Statutory Compliance Notice Banner */}
        <div className="p-4 rounded-2xl bg-amber-100 dark:bg-amber-500/10 border border-amber-300 dark:border-amber-500/20 flex items-start gap-3.5 shadow-sm">
          <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-950 dark:text-amber-200 leading-relaxed font-medium">
            <strong className="font-bold text-amber-900 dark:text-amber-300 font-sans">
              Statutory Application Notice:
            </strong>{" "}
            Marking an application as &ldquo;Applied&rdquo; in GRANTLY records your personal timeline and document preparation only.
            Saving an opportunity in GRANTLY does <em>NOT</em> submit forms to external government portals (such as NSP, UP Scholarship, or MahaDBT).
            You must complete and submit your official application on the scheme&apos;s verified government portal.
          </div>
        </div>

        {/* Filter Stage Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          {stageOptions.map((stage) => (
            <button
              key={stage.id}
              onClick={() => setFilterStage(stage.id)}
              className={`text-xs px-4 py-2 rounded-full border transition-all shrink-0 cursor-pointer flex items-center gap-2 ${
                filterStage === stage.id
                  ? "bg-gold-500/20 border-gold-500/60 text-gold-300 font-semibold shadow-sm"
                  : "bg-charcoal-900 border-white/5 text-ivory-400 hover:text-ivory-200"
              }`}
            >
              <span>{stage.label}</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/10 font-mono">
                {stage.count}
              </span>
            </button>
          ))}
        </div>

        {/* Applications Stream */}
        <div className="space-y-4">
          {filteredApplications.map((app: any) => {
            const scheme = allScholarships.find((s: Scholarship) => s.id === app.scholarshipId) || DEMO_SCHOLARSHIPS.find((s: Scholarship) => s.id === app.scholarshipId);

            return (
              <div
                key={app.id}
                className="editorial-glass rounded-3xl p-5 sm:p-7 border border-white/10 hover:border-gold-500/30 transition-all shadow-xl space-y-4"
              >
                {/* Card Top Row */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2.5 flex-wrap mb-2">
                      <span
                        className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider ${
                          app.status === "applied"
                            ? "bg-blue-500/15 text-blue-300 border border-blue-500/30"
                            : app.status === "preparing_documents"
                            ? "bg-amber-500/15 text-amber-300 border border-amber-500/30"
                            : app.status === "under_review"
                            ? "bg-purple-500/15 text-purple-300 border border-purple-500/30"
                            : "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                        }`}
                      >
                        {app.stageLabel}
                      </span>

                      <span className="text-[11px] font-mono text-ivory-400">
                        Portal Ref: <strong>{app.portalReferenceId}</strong>
                      </span>
                    </div>

                    <h3 className="font-serif text-lg sm:text-xl font-semibold text-ivory-100">
                      {scheme?.title || app.scholarshipId}
                    </h3>
                    <p className="text-xs text-ivory-400 mt-0.5 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-gold-400" />
                      <span>{scheme?.provider}</span>
                    </p>
                  </div>

                  <div className="text-left sm:text-right shrink-0">
                    <div className="text-[10px] font-mono text-ivory-400 uppercase">
                      Award Value
                    </div>
                    <div className="text-xl font-serif font-bold text-gold-300">
                      {scheme ? formatINR(scheme.amountINR) : "₹50,000"}
                      <span className="text-xs font-normal text-ivory-400 ml-1">
                        /{scheme?.frequency.toLowerCase() || "year"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Status Progress Step Bar */}
                <div className="py-2">
                  <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-mono uppercase tracking-wider mb-1.5">
                    <span className={app.status !== "preparing_documents" ? "text-emerald-400 font-bold" : "text-amber-400 font-bold"}>
                      1. Prep Docs
                    </span>
                    <span className={["applied", "under_review", "approved"].includes(app.status) ? "text-emerald-400 font-bold" : "text-ivory-400"}>
                      2. Applied
                    </span>
                    <span className={["under_review", "approved"].includes(app.status) ? "text-purple-400 font-bold" : "text-ivory-400"}>
                      3. Under Review
                    </span>
                    <span className={app.status === "approved" ? "text-emerald-400 font-bold" : "text-ivory-400"}>
                      4. Disbursed
                    </span>
                  </div>

                  <div className="h-2 w-full bg-charcoal-900 rounded-full overflow-hidden flex">
                    <div className="h-full bg-emerald-500 w-1/4" />
                    <div className={`h-full ${["applied", "under_review", "approved"].includes(app.status) ? "bg-emerald-500" : "bg-transparent"} w-1/4 transition-all`} />
                    <div className={`h-full ${["under_review", "approved"].includes(app.status) ? "bg-purple-500" : "bg-transparent"} w-1/4 transition-all`} />
                    <div className={`h-full ${app.status === "approved" ? "bg-emerald-500" : "bg-transparent"} w-1/4 transition-all`} />
                  </div>
                </div>

                {/* Notes & Actions Bar */}
                <div className="pt-3 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="text-ivory-300/80 font-light text-[11px] flex-1">
                    <strong>Latest Note:</strong> {app.notes}
                  </div>

                  <div className="flex items-center gap-2 flex-wrap shrink-0">
                    {/* Simulated Stage Changer */}
                    <select
                      value={app.status}
                      onChange={(e) => handleUpdateStatus(app.id, e.target.value)}
                      className="bg-charcoal-900 border border-white/10 rounded-full px-3 py-1.5 text-[11px] text-ivory-200 focus:outline-none focus:border-gold-500/50 cursor-pointer"
                    >
                      <option value="preparing_documents">Move: Preparing Docs</option>
                      <option value="applied">Move: Applied</option>
                      <option value="under_review">Move: Under Review</option>
                      <option value="approved">Move: Approved / Disbursed</option>
                    </select>

                    {scheme && (
                      <button
                        onClick={() => setSelectedScholarship(scheme)}
                        className="px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-gold-500/20 text-ivory-200 hover:text-gold-300 border border-white/10 text-xs transition-colors cursor-pointer"
                      >
                        Checklist
                      </button>
                    )}

                    {scheme?.officialPortalUrl && (
                      <a
                        href={scheme.officialPortalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-ivory-300 hover:text-white border border-white/10"
                        title="Open Official Portal"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}

                    <button
                      onClick={() => handleRemoveApplication(app.id)}
                      className="text-[11px] text-ivory-400 hover:text-rose-400 px-2 py-1 transition-colors cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredApplications.length === 0 && (
          <div className="editorial-glass rounded-3xl p-10 text-center border border-white/10">
            <p className="text-sm text-ivory-300">No applications in this stage.</p>
            <button
              onClick={() => setFilterStage("all")}
              className="mt-3 px-5 py-2 rounded-full bg-gold-500/20 text-gold-300 text-xs font-semibold cursor-pointer"
            >
              Show All Applications
            </button>
          </div>
        )}
      </div>

      {/* Scheme Detail Modal */}
      <ScholarshipDetailModal
        scholarship={selectedScholarship}
        onClose={() => setSelectedScholarship(null)}
        isBookmarked={true}
        onToggleBookmark={() => {}}
      />
    </DashboardLayout>
  );
}

export default ApplicationsPage;
