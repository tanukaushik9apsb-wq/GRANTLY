import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  ArrowLeft,
  Sparkles,
  Building2,
  Bookmark,
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  Layers,
  X,
  Send,
  HelpCircle,
} from "lucide-react";
import { DEMO_SCHOLARSHIPS, DEMO_SAMPLE_STUDENT } from "../data/demoScholarships";
import { ScholarshipService } from "../services/scholarshipService";
import { Scholarship, EducationLevel } from "../types";
import { formatINR } from "../lib/utils";
import { ScholarshipDetailModal } from "../components/landing/ScholarshipDetailModal";
import { EligibilityBreakdownModal } from "../components/scholarship/EligibilityBreakdownModal";
import { useToast } from "../components/common/Toast";
import { ThemeToggle } from "../components/common/ThemeToggle";

interface ExplorePageProps {
  savedIds: string[];
  onToggleBookmark: (id: string) => void;
}

export function ExplorePage({ savedIds, onToggleBookmark }: ExplorePageProps) {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [allScholarships, setAllScholarships] = useState<Scholarship[]>(DEMO_SCHOLARSHIPS);

  useEffect(() => {
    ScholarshipService.getPublicScholarships()
      .then((data) => {
        if (data && data.length > 0) {
          setAllScholarships(data);
        }
      })
      .catch(console.warn);
  }, []);

  const [selectedScholarship, setSelectedScholarship] = useState<Scholarship | null>(null);
  const [breakdownScholarship, setBreakdownScholarship] = useState<Scholarship | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("All");
  const [selectedState, setSelectedState] = useState<string>("All");
  const [selectedLevel, setSelectedLevel] = useState<string>("All");
  const [onlyEligible, setOnlyEligible] = useState<boolean>(false);
  const [onlySaved, setOnlySaved] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<"amount" | "deadline" | "popular">("popular");

  // Comparison State
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [isCompareOpen, setIsCompareOpen] = useState(false);

  const filterTabs = [
    "All",
    "Central Government",
    "State Government",
    "Corporate / CSR",
    "Institutional Trust",
    "Women in STEM",
  ];

  const states = [
    "All",
    "All India",
    "Uttar Pradesh",
    "Maharashtra",
    "Karnataka",
    "Tamil Nadu",
    "West Bengal",
  ];

  const levels: (EducationLevel | "All")[] = [
    "All",
    "Class 10",
    "Class 12",
    "Diploma",
    "Undergraduate",
    "Postgraduate",
    "PhD",
  ];

  const filteredScholarships = useMemo(() => {
    return allScholarships.filter((s) => {
      // 1. Search Query
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        s.title.toLowerCase().includes(q) ||
        s.provider.toLowerCase().includes(q) ||
        s.applicableStates.some((st) => st.toLowerCase().includes(q)) ||
        s.educationLevels.some((lvl) => lvl.toLowerCase().includes(q));

      // 2. Type or Women filter
      let matchesType = true;
      if (selectedType === "Women in STEM") {
        matchesType = s.genderRestriction === "Female" || s.applicableCategories.includes("Women");
      } else if (selectedType !== "All") {
        matchesType = s.type === selectedType;
      }

      // 3. State filter
      const matchesState =
        selectedState === "All" ||
        s.applicableStates.includes("All India") ||
        s.applicableStates.includes(selectedState);

      // 4. Education level
      const matchesLevel =
        selectedLevel === "All" || s.educationLevels.includes(selectedLevel as EducationLevel);

      // 5. Only saved toggle
      const matchesSaved = !onlySaved || savedIds.includes(s.id);

      // 6. Only eligible for Aarav Sharma (UP, UG, OBC, income <= 2.5L, 8.2 CGPA)
      let matchesAarav = true;
      if (onlyEligible) {
        const aaravLevel = s.educationLevels.includes("Undergraduate");
        const aaravState = s.applicableStates.includes("All India") || s.applicableStates.includes("Uttar Pradesh");
        const aaravGender = s.genderRestriction !== "Female";
        const aaravIncome = !s.maxFamilyIncomeINR || 250000 <= s.maxFamilyIncomeINR;
        const aaravScore = !s.minPercentageOrCGPA || 82 >= s.minPercentageOrCGPA;
        const aaravCat = s.applicableCategories.includes("OBC") || s.applicableCategories.includes("General");
        matchesAarav = aaravLevel && aaravState && aaravGender && aaravIncome && aaravScore && aaravCat;
      }

      return matchesSearch && matchesType && matchesState && matchesLevel && matchesSaved && matchesAarav;
    }).sort((a, b) => {
      if (sortBy === "amount") return b.amountINR - a.amountINR;
      if (sortBy === "deadline") return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      return (b.applicationCountDemo || 0) - (a.applicationCountDemo || 0);
    });
  }, [searchQuery, selectedType, selectedState, selectedLevel, onlyEligible, onlySaved, savedIds, sortBy]);

  const toggleCompare = (id: string) => {
    if (compareIds.includes(id)) {
      setCompareIds(compareIds.filter((item) => item !== id));
      showToast("Removed from Comparison", undefined, "info");
    } else {
      if (compareIds.length >= 3) {
        showToast("Comparison Limit Reached", "You can compare up to 3 scholarships side by side.", "error");
        return;
      }
      setCompareIds([...compareIds, id]);
      showToast("Added to Comparison", "Click 'Compare' in the header to view matrix.", "success");
    }
  };

  const handleBookmarkClick = (id: string, title: string) => {
    const isCurrentlySaved = savedIds.includes(id);
    onToggleBookmark(id);
    showToast(
      isCurrentlySaved ? "Removed from Saved" : "Saved to Workspace",
      title,
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
          notes: "Added to tracker from explorer. Preparing certificates.",
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

  const comparedScholarships = DEMO_SCHOLARSHIPS.filter((s) => compareIds.includes(s.id));

  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--fg-base)] flex flex-col selection:bg-gold-500/30 selection:text-ivory-50 transition-colors duration-300">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-[var(--bg-surface)]/90 backdrop-blur-xl border-b border-[var(--border-base)] px-4 sm:px-8 py-3.5 flex items-center justify-between transition-colors">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 text-xs sm:text-sm text-[var(--fg-muted)] hover:text-[var(--fg-base)] px-3 py-1.5 rounded-full bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 border border-[var(--border-base)] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Dashboard</span>
          </button>

          <div onClick={() => navigate("/")} className="flex items-center gap-2 cursor-pointer">
            <div className="w-6 h-6 rounded-full bg-gold-500/20 flex items-center justify-center text-gold-400">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <span className="font-serif font-bold tracking-widest text-base sm:text-lg text-[var(--fg-base)]">
              GRANTLY
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Theme Toggle */}
          <ThemeToggle />

          {compareIds.length > 0 && (
            <button
              onClick={() => setIsCompareOpen(true)}
              className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-gold-500/20 hover:bg-gold-500/30 text-gold-600 dark:text-gold-300 border border-gold-500/40 transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Compare ({compareIds.length})</span>
            </button>
          )}

          <button
            onClick={() => navigate("/dashboard")}
            className="px-4 py-1.5 rounded-full text-xs font-semibold bg-charcoal-900 dark:bg-ivory-100 text-ivory-50 dark:text-charcoal-950 hover:opacity-90 transition-all cursor-pointer"
          >
            My Workspace
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 md:px-10 py-8">
        {/* Compliance Notice */}
        <div className="mb-6 rounded-2xl bg-gold-500/10 border border-gold-500/20 p-3 sm:p-4 flex items-center justify-between flex-wrap gap-2 text-xs text-gold-300">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-gold-400" />
            <span>
              <strong>DEDICATED EXPLORER:</strong> Simulated demonstration records across Central NSP, UP State Portals, and CSR Fellowships.
            </span>
          </div>
          <span className="font-mono text-[10px] uppercase text-gold-400/80 bg-gold-500/20 px-2 py-0.5 rounded">
            {DEMO_SCHOLARSHIPS.length} Total Demo Schemes
          </span>
        </div>

        {/* Filter Controls Bar */}
        <div className="editorial-glass rounded-3xl p-4 sm:p-6 mb-8 border border-white/10 space-y-4 shadow-xl">
          {/* Top Row: Search + Selects */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
            <div className="sm:col-span-6 relative">
              <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-ivory-400" />
              <input
                type="text"
                placeholder="Search scheme title, provider, state, or course..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-charcoal-950/80 border border-white/10 rounded-2xl pl-11 pr-4 py-3 text-xs sm:text-sm text-ivory-100 placeholder:text-ivory-400/60 focus:outline-none focus:border-gold-500/50 transition-colors"
              />
            </div>

            <div className="sm:col-span-2">
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="w-full bg-charcoal-950/80 border border-white/10 rounded-2xl px-3 py-3 text-xs text-ivory-200 focus:outline-none focus:border-gold-500/50 cursor-pointer"
              >
                <option value="All">All States</option>
                {states.filter((s) => s !== "All").map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="w-full bg-charcoal-950/80 border border-white/10 rounded-2xl px-3 py-3 text-xs text-ivory-200 focus:outline-none focus:border-gold-500/50 cursor-pointer"
              >
                {levels.map((lvl) => (
                  <option key={lvl} value={lvl}>
                    {lvl === "All" ? "All Levels" : lvl}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full bg-charcoal-950/80 border border-white/10 rounded-2xl px-3 py-3 text-xs text-ivory-200 focus:outline-none focus:border-gold-500/50 cursor-pointer"
              >
                <option value="popular">Most Popular</option>
                <option value="amount">Highest Grant Amount</option>
                <option value="deadline">Earliest Deadline</option>
              </select>
            </div>
          </div>

          {/* Bottom Row: Type Filter Pills & Quick Toggles */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pt-2 border-t border-white/5">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              {filterTabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setSelectedType(tab)}
                  className={`text-xs px-3.5 py-1.5 rounded-full border transition-all shrink-0 cursor-pointer ${
                    selectedType === tab
                      ? "bg-gold-500/20 border-gold-500/60 text-gold-300 font-medium"
                      : "bg-white/5 border-white/5 text-ivory-400 hover:text-ivory-200 hover:border-white/20"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 flex-wrap shrink-0">
              {/* Only Saved Toggle */}
              <button
                onClick={() => setOnlySaved(!onlySaved)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all flex items-center gap-1.5 cursor-pointer ${
                  onlySaved
                    ? "bg-gold-500/25 border-gold-500/60 text-gold-300 font-semibold"
                    : "bg-white/5 border-white/10 text-ivory-300 hover:text-white"
                }`}
              >
                <Bookmark className={`w-3.5 h-3.5 ${onlySaved ? "fill-gold-400" : ""}`} />
                <span>Saved Only ({savedIds.length})</span>
              </button>

              {/* Aarav Sharma Pre-Filtered Toggle */}
              <button
                onClick={() => setOnlyEligible(!onlyEligible)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all flex items-center gap-1.5 cursor-pointer ${
                  onlyEligible
                    ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-300 font-semibold"
                    : "bg-white/5 border-white/10 text-ivory-300 hover:text-white"
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Eligible for Aarav Sharma ({DEMO_SAMPLE_STUDENT.metrics.matchingCount})</span>
              </button>
            </div>
          </div>
        </div>

        {/* Scholarships Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredScholarships.map((scholarship) => {
            const isSaved = savedIds.includes(scholarship.id);
            const isCompared = compareIds.includes(scholarship.id);

            return (
              <div
                key={scholarship.id}
                className="editorial-glass rounded-3xl p-5 sm:p-6 flex flex-col justify-between border border-white/10 transition-all duration-300 hover:border-gold-500/40 hover:-translate-y-1 group relative shadow-lg"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider text-gold-400 bg-gold-500/10 border border-gold-500/30">
                        {scholarship.type}
                      </span>
                      {scholarship.isDemoRecord ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider text-blue-300 bg-blue-500/10 border border-blue-500/20">
                          DEMO
                        </span>
                      ) : scholarship.verificationStatus === "verified" ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-0.5">
                          <CheckCircle2 className="w-2.5 h-2.5" />
                          <span>VERIFIED</span>
                        </span>
                      ) : null}
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => toggleCompare(scholarship.id)}
                        className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                          isCompared
                            ? "bg-gold-500/30 text-gold-300"
                            : "bg-white/5 text-ivory-400 hover:text-white"
                        }`}
                        title={isCompared ? "Remove from Compare" : "Compare Scheme"}
                      >
                        <Layers className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleBookmarkClick(scholarship.id, scholarship.title)}
                        className="p-1.5 rounded-full bg-white/5 hover:bg-gold-500/20 text-ivory-400 hover:text-gold-300 transition-colors cursor-pointer"
                        title={isSaved ? "Remove Bookmark" : "Save Opportunity"}
                      >
                        <Bookmark
                          className={`w-3.5 h-3.5 ${isSaved ? "fill-gold-400 text-gold-400" : ""}`}
                        />
                      </button>
                    </div>
                  </div>

                  <h3 className="font-serif text-lg font-semibold text-ivory-100 group-hover:text-gold-300 transition-colors line-clamp-2">
                    {scholarship.title}
                  </h3>

                  <p className="text-xs text-ivory-400 mt-1 flex items-center gap-1.5 line-clamp-1">
                    <Building2 className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                    <span>{scholarship.provider}</span>
                  </p>

                  <p className="text-xs text-ivory-300/80 mt-3 line-clamp-2 font-light leading-relaxed">
                    {scholarship.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {scholarship.educationLevels.slice(0, 2).map((lvl) => (
                      <span
                        key={lvl}
                        className="px-2 py-0.5 rounded-md text-[10px] bg-white/5 text-ivory-300 font-mono"
                      >
                        {lvl}
                      </span>
                    ))}
                    <span className="px-2 py-0.5 rounded-md text-[10px] bg-white/5 text-ivory-400 font-mono">
                      {scholarship.applicableStates[0]}
                    </span>
                  </div>

                  {/* Criterion Explainer Quick Trigger */}
                  <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between">
                    <button
                      onClick={() => setBreakdownScholarship(scholarship)}
                      className="text-[11px] text-gold-400 hover:text-gold-300 font-mono flex items-center gap-1 cursor-pointer"
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                      <span>Why do I qualify?</span>
                    </button>

                    <span className="text-[10px] font-mono text-ivory-400">
                      Due: {scholarship.deadline}
                    </span>
                  </div>
                </div>

                {/* Card Bottom Bar */}
                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between gap-2">
                  <div>
                    <div className="text-[10px] font-mono uppercase tracking-wider text-ivory-400">
                      Grant Amount
                    </div>
                    <div className="text-base sm:text-lg font-bold text-gold-300 font-serif">
                      {formatINR(scholarship.amountINR)}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleAddToTracker(scholarship.id)}
                      className="p-2 rounded-full bg-white/5 hover:bg-gold-500/20 text-ivory-300 hover:text-gold-300 border border-white/10 transition-colors cursor-pointer"
                      title="Add to Application Tracker"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => setSelectedScholarship(scholarship)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-gold-500/20 text-xs font-medium text-ivory-200 hover:text-gold-300 border border-white/10 hover:border-gold-500/40 transition-all cursor-pointer"
                    >
                      <span>Details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredScholarships.length === 0 && (
          <div className="editorial-glass rounded-3xl p-12 text-center border border-white/10 mt-6">
            <p className="text-sm text-ivory-300">
              No scholarships match your active filters. Try toggling off &quot;Saved Only&quot; or resetting state filters.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedType("All");
                setSelectedState("All");
                setSelectedLevel("All");
                setOnlyEligible(false);
                setOnlySaved(false);
              }}
              className="mt-4 px-5 py-2 rounded-full bg-gold-500/20 text-gold-300 text-xs font-medium border border-gold-500/30 cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </main>

      {/* Comparison Drawer / Modal */}
      {isCompareOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-5xl rounded-3xl bg-charcoal-900 border border-white/10 shadow-2xl p-6 sm:p-8 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
              <div>
                <h3 className="font-serif text-2xl font-bold text-ivory-100">
                  Scholarship Comparison Matrix
                </h3>
                <p className="text-xs text-ivory-400 mt-0.5">
                  Side-by-side comparison across award amounts, requirements, and deadlines.
                </p>
              </div>

              <button
                onClick={() => setIsCompareOpen(false)}
                className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-ivory-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {comparedScholarships.map((s) => (
                <div key={s.id} className="p-5 rounded-2xl bg-charcoal-950 border border-white/10 space-y-4">
                  <h4 className="font-serif text-base font-semibold text-ivory-100">{s.title}</h4>
                  <div className="text-xl font-serif font-bold text-gold-300">
                    {formatINR(s.amountINR)} <span className="text-xs text-ivory-400">/{s.frequency}</span>
                  </div>

                  <div className="space-y-2 text-xs text-ivory-300 pt-2 border-t border-white/5">
                    <div><strong>Type:</strong> {s.type}</div>
                    <div><strong>States:</strong> {s.applicableStates.join(", ")}</div>
                    <div><strong>Min Marks:</strong> {s.minPercentageOrCGPA ? `${s.minPercentageOrCGPA}%` : "Not specified"}</div>
                    <div><strong>Income Limit:</strong> {s.maxFamilyIncomeINR ? formatINR(s.maxFamilyIncomeINR) : "No limit"}</div>
                    <div><strong>Deadline:</strong> {s.deadline}</div>
                  </div>

                  <div className="pt-2 border-t border-white/5 flex items-center gap-2">
                    <button
                      onClick={() => {
                        setIsCompareOpen(false);
                        setSelectedScholarship(s);
                      }}
                      className="flex-1 py-2 rounded-xl text-xs font-semibold bg-ivory-100 hover:bg-white text-charcoal-950 cursor-pointer"
                    >
                      View Scheme
                    </button>
                    <button
                      onClick={() => toggleCompare(s.id)}
                      className="p-2 rounded-xl bg-white/5 hover:bg-rose-500/20 text-rose-300"
                      title="Remove"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Scheme Detail Modal */}
      <ScholarshipDetailModal
        scholarship={selectedScholarship}
        onClose={() => setSelectedScholarship(null)}
        isBookmarked={selectedScholarship ? savedIds.includes(selectedScholarship.id) : false}
        onToggleBookmark={onToggleBookmark}
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
    </div>
  );
}

export default ExplorePage;
