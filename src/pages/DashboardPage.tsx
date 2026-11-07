import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Award,
  Bookmark,
  Calendar,
  Send,
  Sparkles,
  ArrowRight,
  Clock,
  CheckCircle2,
  FileCheck2,
  ChevronRight,
  TrendingUp,
  ShieldCheck,
  HelpCircle,
} from "lucide-react";
import { DashboardLayout } from "../components/layout/DashboardLayout";
import { DEMO_SAMPLE_STUDENT, DEMO_SCHOLARSHIPS } from "../data/demoScholarships";
import { formatINR } from "../lib/utils";
import { ScholarshipDetailModal } from "../components/landing/ScholarshipDetailModal";
import { EligibilityBreakdownModal } from "../components/scholarship/EligibilityBreakdownModal";
import { Scholarship } from "../types";
import { useToast } from "../components/common/Toast";
import { useAuth } from "../context/AuthContext";

export function DashboardPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [selectedScholarship, setSelectedScholarship] = useState<Scholarship | null>(null);
  const [breakdownScholarship, setBreakdownScholarship] = useState<Scholarship | null>(null);

  const [savedIds, setSavedIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem("grantly_saved_scholarships");
      return stored ? JSON.parse(stored) : DEMO_SAMPLE_STUDENT.savedIds;
    } catch {
      return DEMO_SAMPLE_STUDENT.savedIds;
    }
  });

  const { studentProfile } = useAuth();
  const profile = studentProfile || DEMO_SAMPLE_STUDENT.profile;
  const { metrics, documents } = DEMO_SAMPLE_STUDENT;

  const handleToggleBookmark = (id: string) => {
    const isCurrentlySaved = savedIds.includes(id);
    const updated = isCurrentlySaved ? savedIds.filter((item) => item !== id) : [...savedIds, id];
    setSavedIds(updated);
    try {
      localStorage.setItem("grantly_saved_scholarships", JSON.stringify(updated));
    } catch (e) {
      console.warn("Storage error", e);
    }
    const scheme = DEMO_SCHOLARSHIPS.find((s) => s.id === id);
    showToast(
      isCurrentlySaved ? "Removed from Saved" : "Saved to Workspace",
      scheme?.title || "Scholarship updated",
      isCurrentlySaved ? "info" : "success"
    );
  };

  const handleAddToTracker = (schemeId: string) => {
    const scheme = DEMO_SCHOLARSHIPS.find((s) => s.id === schemeId);
    try {
      const stored = localStorage.getItem("grantly_applications");
      const list = stored ? JSON.parse(stored) : DEMO_SAMPLE_STUDENT.applications;
      if (!list.some((a: any) => a.scholarshipId === schemeId)) {
        const newApp = {
          id: `app-${Date.now()}`,
          scholarshipId: schemeId,
          status: "preparing_documents",
          updatedAt: new Date().toISOString(),
          portalReferenceId: `DRAFT-${Math.floor(1000 + Math.random() * 9000)}`,
          notes: "Added to tracker from recommendations feed.",
          stageLabel: "Preparing Documents",
        };
        localStorage.setItem("grantly_applications", JSON.stringify([newApp, ...list]));
        showToast("Added to Application Tracker", scheme?.title || "Scholarship tracked", "success");
      } else {
        showToast("Already in Tracker", "This scheme is already in your application pipeline.", "info");
      }
    } catch (e) {
      console.warn("Storage error", e);
    }
  };

  // Filter the 8 matching scholarships for Aarav Sharma (UP, UG, OBC, income <= 2.5L, 8.2 CGPA)
  const matchingScholarships = DEMO_SCHOLARSHIPS.filter((s) => {
    const matchesLevel = s.educationLevels.includes("Undergraduate");
    const matchesState = s.applicableStates.includes("All India") || s.applicableStates.includes("Uttar Pradesh");
    const matchesGender = s.genderRestriction !== "Female";
    const matchesIncome = !s.maxFamilyIncomeINR || 250000 <= s.maxFamilyIncomeINR;
    const matchesScore = !s.minPercentageOrCGPA || 82 >= s.minPercentageOrCGPA;
    const matchesCategory = s.applicableCategories.includes("OBC") || s.applicableCategories.includes("General");
    return matchesLevel && matchesState && matchesGender && matchesIncome && matchesScore && matchesCategory;
  });

  // Upcoming 3 deadlines for dashboard
  const upcomingDeadlines = DEMO_SCHOLARSHIPS.filter((s) =>
    ["demo-up-dashmesh-postmatric-2026", "demo-reliance-foundation-ug-2026", "demo-infosys-stem-star-2026"].includes(s.id)
  );

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Student Welcome Hero Card */}
        <div className="editorial-glass rounded-3xl p-6 sm:p-8 border border-white/10 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start sm:items-center gap-4 sm:gap-6">
              <div className="relative">
                <img
                  src={profile.avatarUrl}
                  alt={profile.fullName}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-gold-500/50 shadow-xl"
                />
                <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-charcoal-900" />
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="font-serif text-2xl sm:text-3xl font-bold text-ivory-100">
                    Welcome back, {profile.fullName}
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold text-amber-900 dark:text-gold-400 bg-amber-100 dark:bg-gold-500/10 border border-amber-300 dark:border-gold-500/30">
                    DEMO STUDENT
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-ivory-300 mt-1 font-medium">
                  {profile.currentCourse} • {profile.academicYear} • {profile.district}, {profile.state}
                </p>

                <div className="flex items-center gap-3 sm:gap-4 mt-2 text-[11px] font-mono text-ivory-400 flex-wrap">
                  <span className="text-amber-900 dark:text-gold-300 font-bold">Score: {profile.percentageOrCGPA} CGPA</span>
                  <span>•</span>
                  <span className="font-semibold text-ivory-100 dark:text-ivory-200">Income: {formatINR(profile.familyIncomeINR)}/yr</span>
                  <span>•</span>
                  <span className="font-semibold text-ivory-100 dark:text-ivory-200">Category: {profile.category} (Non-Creamy Layer)</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/explore")}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-ivory-100 hover:bg-white text-charcoal-950 text-xs sm:text-sm font-semibold transition-all shadow-xl cursor-pointer"
              >
                <span>Find Scholarships</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => navigate("/profile")}
                className="px-4 py-2.5 rounded-full bg-white/5 hover:bg-white/10 text-xs sm:text-sm text-ivory-300 border border-white/10 transition-colors cursor-pointer"
              >
                Edit Profile
              </button>
            </div>
          </div>
        </div>

        {/* The 4 User-Requested Sample Dashboard Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* 1. Matching Scholarships: 8 */}
          <div
            onClick={() => navigate("/explore")}
            className="editorial-glass rounded-2xl p-5 border border-white/10 hover:border-gold-500/40 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-ivory-400">
                Eligible Schemes
              </span>
              <div className="w-8 h-8 rounded-full bg-gold-500/10 text-gold-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Award className="w-4 h-4" />
              </div>
            </div>
            <div className="font-serif text-3xl sm:text-4xl font-bold text-gold-300">
              {metrics.matchingCount}
            </div>
            <div className="text-xs text-ivory-300 mt-1 font-medium">Matching Scholarships</div>
            <div className="text-[11px] text-emerald-400 mt-0.5 flex items-center gap-1 font-mono">
              <CheckCircle2 className="w-3 h-3" />
              <span>Qualified by UP Domicile & Income</span>
            </div>
          </div>

          {/* 2. Saved Scholarships: 4 */}
          <div
            onClick={() => navigate("/explore")}
            className="editorial-glass rounded-2xl p-5 border border-white/10 hover:border-gold-500/40 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-ivory-400">
                Bookmarked
              </span>
              <div className="w-8 h-8 rounded-full bg-white/5 text-ivory-200 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Bookmark className="w-4 h-4" />
              </div>
            </div>
            <div className="font-serif text-3xl sm:text-4xl font-bold text-ivory-100">
              {savedIds.length}
            </div>
            <div className="text-xs text-ivory-300 mt-1 font-medium">Saved Scholarships</div>
            <div className="text-[11px] text-ivory-400 mt-0.5 font-mono">
              Ready for document submission
            </div>
          </div>

          {/* 3. Applications Submitted: 2 */}
          <div
            onClick={() => navigate("/applications")}
            className="editorial-glass rounded-2xl p-5 border border-white/10 hover:border-gold-500/40 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-ivory-400">
                Active Portals
              </span>
              <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Send className="w-4 h-4" />
              </div>
            </div>
            <div className="font-serif text-3xl sm:text-4xl font-bold text-emerald-300">
              {metrics.submittedCount}
            </div>
            <div className="text-xs text-ivory-300 mt-1 font-medium">Applications Submitted</div>
            <div className="text-[11px] text-ivory-400 mt-0.5 font-mono">
              NSP Central & Reliance CSR
            </div>
          </div>

          {/* 4. Upcoming Deadlines: 3 */}
          <div
            onClick={() => navigate("/applications")}
            className="editorial-glass rounded-2xl p-5 border border-white/10 hover:border-gold-500/40 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-ivory-400">
                Radar Alerts
              </span>
              <div className="w-8 h-8 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="font-serif text-3xl sm:text-4xl font-bold text-amber-300">
              {metrics.upcomingDeadlinesCount}
            </div>
            <div className="text-xs text-ivory-300 mt-1 font-medium">Upcoming Deadlines</div>
            <div className="text-[11px] text-amber-400 mt-0.5 font-mono">
              Earliest: 28 Nov (UP Portal)
            </div>
          </div>
        </div>

        {/* Application Status Pipeline Breakdown (Applied: 2, Preparing Documents: 1, Under Review: 1, Approved: 0) */}
        <div className="editorial-glass rounded-3xl p-6 sm:p-8 border border-white/10 shadow-xl">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-gold-400 mb-1">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Application Pipeline Breakdown</span>
              </div>
              <h2 className="font-serif text-xl sm:text-2xl font-semibold text-ivory-100">
                Status Across Active Schemes
              </h2>
            </div>

            <button
              onClick={() => navigate("/applications")}
              className="inline-flex items-center gap-1 text-xs text-gold-400 hover:text-gold-300 font-medium cursor-pointer"
            >
              <span>Manage Application Tracker</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Status Breakdown Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Applied: 2 */}
            <div className="p-4 rounded-2xl bg-charcoal-900 border border-white/10 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs text-ivory-300 font-bold">Applied</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-500/15 text-blue-700 dark:text-blue-300 border border-blue-500/30">
                  {metrics.applicationStatusBreakdown.applied} Schemes
                </span>
              </div>
              <div className="mt-2 text-2xl font-serif font-extrabold text-blue-700 dark:text-blue-300">2</div>
              <p className="text-[11px] text-ivory-400 mt-1 font-medium">
                Forms submitted on NSP & Reliance portal.
              </p>
            </div>

            {/* Preparing Documents: 1 */}
            <div className="p-4 rounded-2xl bg-charcoal-900 border border-white/10 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs text-ivory-300 font-bold">Preparing Documents</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/15 text-amber-900 dark:text-amber-300 border border-amber-500/30">
                  {metrics.applicationStatusBreakdown.preparingDocuments} Scheme
                </span>
              </div>
              <div className="mt-2 text-2xl font-serif font-extrabold text-amber-800 dark:text-amber-300">1</div>
              <p className="text-[11px] text-ivory-400 mt-1 font-medium">
                Infosys STEM: Awaiting HOD recommendation.
              </p>
            </div>

            {/* Under Review: 1 */}
            <div className="p-4 rounded-2xl bg-charcoal-900 border border-white/10 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs text-ivory-300 font-bold">Under Review</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-500/15 text-purple-700 dark:text-purple-300 border border-purple-500/30">
                  {metrics.applicationStatusBreakdown.underReview} Scheme
                </span>
              </div>
              <div className="mt-2 text-2xl font-serif font-extrabold text-purple-700 dark:text-purple-300">1</div>
              <p className="text-[11px] text-ivory-400 mt-1 font-medium">
                UP Post-Matric: District Nodal review in progress.
              </p>
            </div>

            {/* Approved: 0 */}
            <div className="p-4 rounded-2xl bg-charcoal-900 border border-white/10 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs text-ivory-300 font-bold">Approved / Disbursed</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-black/5 dark:bg-white/10 text-ivory-400 border border-black/10 dark:border-white/15">
                  {metrics.applicationStatusBreakdown.approved} Schemes
                </span>
              </div>
              <div className="mt-2 text-2xl font-serif font-extrabold text-ivory-100">0</div>
              <p className="text-[11px] text-ivory-400 mt-1 font-medium">
                Verification cycle completes in Dec-Jan.
              </p>
            </div>
          </div>
        </div>

        {/* Split Grid: Upcoming Deadlines Radar (Left) + Document Health Status (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Upcoming Deadlines Radar (3 upcoming) */}
          <div className="lg:col-span-7 editorial-glass rounded-3xl p-6 sm:p-8 border border-white/10 shadow-xl space-y-4">
            <div className="flex items-center justify-between mb-2">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-gold-400 mb-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>National & State Deadline Radar</span>
                </div>
                <h3 className="font-serif text-xl font-semibold text-ivory-100">
                  {metrics.upcomingDeadlinesCount} Urgent Cutoffs Approaching
                </h3>
              </div>

              <span className="text-xs text-ivory-400 font-mono">Simulated Cycle</span>
            </div>

            <div className="space-y-3 pt-2">
              {upcomingDeadlines.map((scheme) => (
                <div
                  key={scheme.id}
                  className="p-4 rounded-2xl bg-charcoal-900/90 border border-white/5 hover:border-gold-500/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono text-gold-400 bg-gold-500/10">
                        {scheme.type}
                      </span>
                      <span className="text-[11px] font-mono text-amber-300 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>Deadline: {scheme.deadline}</span>
                      </span>
                    </div>

                    <h4 className="text-sm font-semibold text-ivory-100 hover:text-gold-300 transition-colors">
                      {scheme.title}
                    </h4>
                    <p className="text-xs text-ivory-400 mt-0.5">{scheme.provider}</p>
                  </div>

                  <div className="flex items-center sm:flex-col sm:items-end justify-between shrink-0 gap-2">
                    <span className="font-serif text-base font-bold text-gold-300">
                      {formatINR(scheme.amountINR)}
                    </span>
                    <button
                      onClick={() => setSelectedScholarship(scheme)}
                      className="text-xs px-3 py-1.5 rounded-full bg-white/5 hover:bg-gold-500/20 text-ivory-200 hover:text-gold-300 border border-white/10 transition-colors cursor-pointer"
                    >
                      View Scheme
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Document Health Status */}
          <div className="lg:col-span-5 editorial-glass rounded-3xl p-6 sm:p-8 border border-white/10 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-emerald-400 mb-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Digital Document Locker</span>
                  </div>
                  <h3 className="font-serif text-xl font-semibold text-ivory-100">
                    6/6 Verification Documents Ready
                  </h3>
                </div>
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                  <FileCheck2 className="w-5 h-5" />
                </div>
              </div>

              <p className="text-xs text-ivory-300/80 font-light leading-relaxed mb-4">
                All essential UP Domicile, Tehsildar Income, and College Bonafide certificates are uploaded and organized for 1-click verification.
              </p>

              <div className="space-y-2.5">
                {documents.slice(0, 4).map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-charcoal-900 border border-white/5 text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span className="text-ivory-200 line-clamp-1">{doc.name}</span>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded shrink-0">
                      Valid
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-white/5 mt-6 flex items-center justify-between">
              <span className="text-xs text-ivory-400">Total Size: 5.6 MB</span>
              <button
                onClick={() => navigate("/documents")}
                className="inline-flex items-center gap-1.5 text-xs text-gold-400 hover:text-gold-300 font-semibold cursor-pointer"
              >
                <span>Open Document Locker</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Matching Scholarships Showcase (8 eligible schemes) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-gold-400 mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Personalized Recommendations</span>
              </div>
              <h2 className="font-serif text-2xl font-semibold text-ivory-100">
                Matching Schemes for {profile.fullName} ({matchingScholarships.length})
              </h2>
            </div>

            <button
              onClick={() => navigate("/explore")}
              className="text-xs text-gold-400 hover:text-gold-300 font-medium inline-flex items-center gap-1 cursor-pointer"
            >
              <span>Explore All Schemes</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {matchingScholarships.slice(0, 4).map((scheme) => {
              const isSaved = savedIds.includes(scheme.id);
              return (
                <div
                  key={scheme.id}
                  className="editorial-glass rounded-2xl p-5 border border-white/10 flex flex-col justify-between hover:border-gold-500/40 transition-all group"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20">
                        100% Eligible
                      </span>
                      <button
                        onClick={() => handleToggleBookmark(scheme.id)}
                        className="text-ivory-400 hover:text-gold-300 cursor-pointer"
                        title={isSaved ? "Saved" : "Save"}
                      >
                        <Bookmark className={`w-3.5 h-3.5 ${isSaved ? "fill-gold-400 text-gold-400" : ""}`} />
                      </button>
                    </div>

                    <h4 className="font-serif text-sm font-semibold text-ivory-100 group-hover:text-gold-300 transition-colors line-clamp-2">
                      {scheme.title}
                    </h4>
                    <p className="text-[11px] text-ivory-400 mt-1 line-clamp-1">{scheme.provider}</p>

                    <div className="mt-3 flex items-center justify-between">
                      <button
                        onClick={() => setBreakdownScholarship(scheme)}
                        className="text-[10px] text-gold-400 hover:text-gold-300 font-mono flex items-center gap-1 cursor-pointer"
                      >
                        <HelpCircle className="w-3 h-3" />
                        <span>Why eligible?</span>
                      </button>
                      <span className="text-[10px] text-ivory-400 font-mono">Due: {scheme.deadline}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] font-mono text-ivory-400">Award</div>
                      <div className="text-sm font-bold text-gold-300 font-serif">
                        {formatINR(scheme.amountINR)}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleAddToTracker(scheme.id)}
                        className="p-1.5 rounded-full bg-white/5 hover:bg-gold-500/20 text-ivory-300 hover:text-gold-300 border border-white/10 transition-colors cursor-pointer"
                        title="Add to Tracker"
                      >
                        <Send className="w-3 h-3" />
                      </button>

                      <button
                        onClick={() => setSelectedScholarship(scheme)}
                        className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-gold-500/20 text-[11px] font-medium text-ivory-200 hover:text-gold-300 border border-white/10 transition-colors cursor-pointer"
                      >
                        Details
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Scheme Detail Preview Modal */}
      <ScholarshipDetailModal
        scholarship={selectedScholarship}
        onClose={() => setSelectedScholarship(null)}
        isBookmarked={selectedScholarship ? savedIds.includes(selectedScholarship.id) : false}
        onToggleBookmark={handleToggleBookmark}
        onAddToTracker={handleAddToTracker}
      />

      {/* Criterion Breakdown Modal */}
      {breakdownScholarship && (
        <EligibilityBreakdownModal
          scholarship={breakdownScholarship}
          profile={DEMO_SAMPLE_STUDENT.profile}
          onClose={() => setBreakdownScholarship(null)}
          onAddToTracker={handleAddToTracker}
        />
      )}
    </DashboardLayout>
  );
}

export default DashboardPage;
