import React, { useState, useMemo } from "react";
import {
  Search,
  Bookmark,
  Building2,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { DEMO_SCHOLARSHIPS } from "../../data/demoScholarships";
import { Scholarship } from "../../types";
import { formatINR } from "../../lib/utils";

interface ScholarshipExplorerSectionProps {
  onSelectScholarship: (scholarship: Scholarship) => void;
  savedIds: string[];
  onToggleBookmark: (id: string) => void;
}

export const ScholarshipExplorerSection: React.FC<ScholarshipExplorerSectionProps> = ({
  onSelectScholarship,
  savedIds,
  onToggleBookmark,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("All");
  const [selectedState, setSelectedState] = useState<string>("All");
  const [sortBy, setSortBy] = useState<"amount" | "deadline" | "popular">("popular");

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
    "Maharashtra",
    "Karnataka",
    "Uttar Pradesh",
    "Tamil Nadu",
    "West Bengal",
  ];

  const filteredScholarships = useMemo(() => {
    return DEMO_SCHOLARSHIPS.filter((s) => {
      // 1. Search Query
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        s.title.toLowerCase().includes(query) ||
        s.provider.toLowerCase().includes(query) ||
        s.applicableStates.some((st) => st.toLowerCase().includes(query)) ||
        s.educationLevels.some((lvl) => lvl.toLowerCase().includes(query));

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

      return matchesSearch && matchesType && matchesState;
    }).sort((a, b) => {
      if (sortBy === "amount") return b.amountINR - a.amountINR;
      if (sortBy === "deadline") return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      return (b.applicationCountDemo || 0) - (a.applicationCountDemo || 0);
    });
  }, [searchQuery, selectedType, selectedState, sortBy]);

  return (
    <section id="explorer" className="py-16 sm:py-24 px-4 sm:px-6 md:px-10 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono uppercase tracking-wider text-gold-400 bg-gold-500/10 border border-gold-500/20 mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Unified Indian Scholarship Matrix</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-ivory-100 font-medium tracking-tight">
            Curated Opportunities
          </h2>
          <p className="text-xs sm:text-sm text-ivory-300/80 mt-2 font-light max-w-2xl">
            Explore active central schemes, state-specific portals, and premier corporate CSR fellowships across India.
          </p>
        </div>

        {/* Saved Count Indicator */}
        <div className="flex items-center gap-2 text-xs text-ivory-300 font-mono">
          <span className="w-2 h-2 rounded-full bg-gold-400" />
          <span>Showing {filteredScholarships.length} of {DEMO_SCHOLARSHIPS.length} Demo Records</span>
        </div>
      </div>

      {/* Search and Filter Controls */}
      <div className="editorial-glass rounded-3xl p-4 sm:p-6 mb-10 border border-white/10 space-y-4 shadow-xl">
        {/* Search Bar Row */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-ivory-400" />
            <input
              type="text"
              placeholder="Search by scheme name, provider (e.g. Tata, NSP, Maharashtra), course or state..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-charcoal-950/80 border border-white/10 rounded-2xl pl-11 pr-4 py-3 text-xs sm:text-sm text-ivory-100 placeholder:text-ivory-400/60 focus:outline-none focus:border-gold-500/50 transition-colors"
            />
          </div>

          <div className="flex items-center gap-2">
            {/* State filter */}
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="bg-charcoal-950/80 border border-white/10 rounded-2xl px-3 sm:px-4 py-3 text-xs sm:text-sm text-ivory-200 focus:outline-none focus:border-gold-500/50 cursor-pointer"
            >
              <option value="All">All States</option>
              {states.filter((s) => s !== "All").map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>

            {/* Sort by */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-charcoal-950/80 border border-white/10 rounded-2xl px-3 sm:px-4 py-3 text-xs sm:text-sm text-ivory-200 focus:outline-none focus:border-gold-500/50 cursor-pointer"
            >
              <option value="popular">Most Popular</option>
              <option value="amount">Highest Grant Amount</option>
              <option value="deadline">Earliest Deadline</option>
            </select>
          </div>
        </div>

        {/* Category Pills Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar">
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
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        {filteredScholarships.map((scholarship) => {
          const isSaved = savedIds.includes(scholarship.id);

          return (
            <div
              key={scholarship.id}
              className="editorial-glass rounded-3xl p-5 sm:p-6 flex flex-col justify-between border border-white/10 transition-all duration-300 hover:border-gold-500/40 hover:-translate-y-1 group relative shadow-lg"
            >
              {/* Card Top */}
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider text-gold-400 bg-gold-500/10 border border-gold-500/30">
                    {scholarship.type}
                  </span>

                  <button
                    onClick={() => onToggleBookmark(scholarship.id)}
                    className="p-1.5 rounded-full bg-white/5 hover:bg-gold-500/20 text-ivory-400 hover:text-gold-300 transition-colors"
                    title={isSaved ? "Remove Bookmark" : "Save Opportunity"}
                  >
                    <Bookmark
                      className={`w-4 h-4 ${isSaved ? "fill-gold-400 text-gold-400" : ""}`}
                    />
                  </button>
                </div>

                <h3 className="font-serif text-lg sm:text-xl font-semibold text-ivory-100 group-hover:text-gold-300 transition-colors line-clamp-2">
                  {scholarship.title}
                </h3>

                <p className="text-xs text-ivory-400 mt-1 flex items-center gap-1.5 line-clamp-1">
                  <Building2 className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                  <span>{scholarship.provider}</span>
                </p>

                <p className="text-xs text-ivory-300/80 mt-3 line-clamp-2 font-light leading-relaxed">
                  {scholarship.description}
                </p>

                {/* Tags */}
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
              </div>

              {/* Card Bottom */}
              <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-wider text-ivory-400">
                    Award Value
                  </div>
                  <div className="text-base sm:text-lg font-bold text-gold-300 font-serif">
                    {formatINR(scholarship.amountINR)}
                    <span className="text-[10px] text-ivory-400 font-normal ml-1">
                      /{scholarship.frequency.toLowerCase()}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => onSelectScholarship(scholarship)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white/5 hover:bg-gold-500/20 text-xs font-medium text-ivory-200 hover:text-gold-300 border border-white/10 hover:border-gold-500/40 transition-all cursor-pointer"
                >
                  <span>Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredScholarships.length === 0 && (
        <div className="editorial-glass rounded-3xl p-12 text-center border border-white/10">
          <p className="text-sm text-ivory-300">
            No scholarships match your filter criteria. Try resetting state or keyword filters.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedType("All");
              setSelectedState("All");
            }}
            className="mt-4 px-4 py-2 rounded-full bg-gold-500/20 text-gold-300 text-xs font-medium border border-gold-500/30"
          >
            Reset Filters
          </button>
        </div>
      )}
    </section>
  );
};

export default ScholarshipExplorerSection;
