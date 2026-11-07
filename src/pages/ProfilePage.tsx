import React, { useState } from "react";
import {
  User,
  GraduationCap,
  MapPin,
  Save,
  Sparkles,
  Sun,
  Moon,
} from "lucide-react";
import { DashboardLayout } from "../components/layout/DashboardLayout";
import { DEMO_SAMPLE_STUDENT, DEMO_SCHOLARSHIPS } from "../data/demoScholarships";
import { StudentProfile, SocialCategory, EducationLevel } from "../types";
import { formatINR } from "../lib/utils";
import { useToast } from "../components/common/Toast";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

export function ProfilePage() {
  const { showToast } = useToast();
  const { studentProfile, updateStudentProfile } = useAuth();
  const { theme, setTheme } = useTheme();
  const [profile, setProfile] = useState<StudentProfile>(() => {
    return studentProfile || DEMO_SAMPLE_STUDENT.profile;
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const states = [
    "Uttar Pradesh",
    "Maharashtra",
    "Karnataka",
    "Tamil Nadu",
    "West Bengal",
    "Rajasthan",
    "Kerala",
    "Gujarat",
    "Telangana",
    "Delhi NCR",
    "Bihar",
    "Madhya Pradesh",
    "Punjab",
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateStudentProfile(profile);
    setSavedSuccess(true);
    showToast("Scholar Profile Saved", "Matching schemes updated in your workspace.", "success");
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  // Recalculate matching schemes based on live profile parameters
  const liveMatchingCount = DEMO_SCHOLARSHIPS.filter((s) => {
    const matchesLevel = s.educationLevels.includes(profile.educationLevel);
    const matchesState = s.applicableStates.includes("All India") || s.applicableStates.includes(profile.state);
    const matchesGender = s.genderRestriction === "All" || (profile.gender === "Female" && s.genderRestriction === "Female");
    const matchesIncome = !s.maxFamilyIncomeINR || profile.familyIncomeINR <= s.maxFamilyIncomeINR;
    const matchesScore = !s.minPercentageOrCGPA || (profile.percentageOrCGPA * 10) >= s.minPercentageOrCGPA || profile.percentageOrCGPA >= s.minPercentageOrCGPA;
    const matchesCategory = s.applicableCategories.includes("General") || s.applicableCategories.includes(profile.category);
    return matchesLevel && matchesState && matchesGender && matchesIncome && matchesScore && matchesCategory;
  }).length;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-gold-400 mb-1">
              <User className="w-3.5 h-3.5" />
              <span>Student Profile Calibration</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-ivory-100">
              Scholar Profile & Quotas
            </h1>
            <p className="text-xs sm:text-sm text-ivory-300/80 mt-1 font-light">
              Your profile parameters directly drive the algorithmic eligibility matching engine across 500+ Indian schemes.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3.5 py-1.5 rounded-full border border-emerald-500/20 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Profile Health: 95% Complete</span>
            </span>
          </div>
        </div>

        {/* Live Matching Impact Indicator */}
        <div className="editorial-glass-gold rounded-2xl p-5 border flex items-center justify-between flex-wrap gap-4 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gold-500/20 text-gold-300 flex items-center justify-center font-serif text-2xl font-bold">
              {liveMatchingCount}
            </div>
            <div>
              <div className="text-xs font-mono uppercase tracking-wider text-gold-400">
                Active Scheme Eligibility
              </div>
              <div className="text-sm font-semibold text-ivory-100 mt-0.5">
                {liveMatchingCount} of {DEMO_SCHOLARSHIPS.length} schemes currently match your parameters
              </div>
              <p className="text-[11px] text-ivory-300 font-light mt-0.5">
                Domicile: <strong>{profile.state}</strong> • Income: <strong>{formatINR(profile.familyIncomeINR)}</strong> • Score: <strong>{profile.percentageOrCGPA} CGPA</strong>
              </p>
            </div>
          </div>

          <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
            Real-time Algorithmic Sync
          </span>
        </div>

        {/* Profile Edit Form */}
        <form onSubmit={handleSave} className="editorial-glass rounded-3xl p-6 sm:p-10 border border-white/10 space-y-8 shadow-2xl">
          {/* Section 1: Basic Identity */}
          <div className="space-y-4">
            <h2 className="text-xs font-mono uppercase tracking-wider text-gold-400 flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>1. Basic Personal Information</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-ivory-300 mb-1.5">
                  Full Legal Name (as per Marksheets) *
                </label>
                <input
                  type="text"
                  required
                  value={profile.fullName}
                  onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                  className="w-full bg-charcoal-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-ivory-100 focus:outline-none focus:border-gold-500/50"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-ivory-300 mb-1.5">
                  Official Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className="w-full bg-charcoal-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-ivory-100 focus:outline-none focus:border-gold-500/50"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-ivory-300 mb-1.5">
                  Mobile Number (SMS Alerts)
                </label>
                <input
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  className="w-full bg-charcoal-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-ivory-100 focus:outline-none focus:border-gold-500/50"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Academic Standing */}
          <div className="space-y-4 pt-6 border-t border-white/10">
            <h2 className="text-xs font-mono uppercase tracking-wider text-gold-400 flex items-center gap-2">
              <GraduationCap className="w-4 h-4" />
              <span>2. Academic Enrolment & Performance</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-medium text-ivory-300 mb-1.5">
                  Education Level *
                </label>
                <select
                  value={profile.educationLevel}
                  onChange={(e) => setProfile({ ...profile, educationLevel: e.target.value as EducationLevel })}
                  className="w-full bg-charcoal-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-ivory-100 focus:outline-none focus:border-gold-500/50 cursor-pointer"
                >
                  <option value="Class 10">Class 10</option>
                  <option value="Class 12">Class 12</option>
                  <option value="Diploma">Diploma / Polytechnic</option>
                  <option value="Undergraduate">Undergraduate (UG)</option>
                  <option value="Postgraduate">Postgraduate (PG)</option>
                  <option value="PhD">Doctoral / PhD</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-ivory-300 mb-1.5">
                  Current Course *
                </label>
                <input
                  type="text"
                  value={profile.currentCourse}
                  onChange={(e) => setProfile({ ...profile, currentCourse: e.target.value })}
                  className="w-full bg-charcoal-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-ivory-100 focus:outline-none focus:border-gold-500/50"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-ivory-300 mb-1.5">
                  Academic Year
                </label>
                <input
                  type="text"
                  value={profile.academicYear}
                  onChange={(e) => setProfile({ ...profile, academicYear: e.target.value })}
                  className="w-full bg-charcoal-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-ivory-100 focus:outline-none focus:border-gold-500/50"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-ivory-300 mb-1.5">
                  Score (CGPA or %) *
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="4"
                  max="100"
                  value={profile.percentageOrCGPA}
                  onChange={(e) => setProfile({ ...profile, percentageOrCGPA: Number(e.target.value) })}
                  className="w-full bg-charcoal-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-ivory-100 focus:outline-none focus:border-gold-500/50"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Domicile, Reservation & Financial Criteria */}
          <div className="space-y-4 pt-6 border-t border-white/10">
            <h2 className="text-xs font-mono uppercase tracking-wider text-gold-400 flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>3. Domicile & Quota Reservations</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-ivory-300 mb-1.5">
                  Domicile State *
                </label>
                <select
                  value={profile.state}
                  onChange={(e) => setProfile({ ...profile, state: e.target.value })}
                  className="w-full bg-charcoal-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-ivory-100 focus:outline-none focus:border-gold-500/50 cursor-pointer"
                >
                  {states.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-ivory-300 mb-1.5">
                  Home District / City
                </label>
                <input
                  type="text"
                  value={profile.district}
                  onChange={(e) => setProfile({ ...profile, district: e.target.value })}
                  className="w-full bg-charcoal-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-ivory-100 focus:outline-none focus:border-gold-500/50"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-ivory-300 mb-1.5">
                  Reservation Category *
                </label>
                <select
                  value={profile.category}
                  onChange={(e) => setProfile({ ...profile, category: e.target.value as SocialCategory })}
                  className="w-full bg-charcoal-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-ivory-100 focus:outline-none focus:border-gold-500/50 cursor-pointer"
                >
                  <option value="General">General / Open</option>
                  <option value="OBC">OBC (Other Backward Classes)</option>
                  <option value="SC">SC (Scheduled Caste)</option>
                  <option value="ST">ST (Scheduled Tribe)</option>
                  <option value="EWS">EWS (Economically Weaker Section)</option>
                  <option value="Minority">Minority Communities</option>
                </select>
              </div>
            </div>

            {/* Income Slider */}
            <div className="pt-2">
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-medium text-ivory-300">
                  Annual Family Income (INR) *
                </label>
                <span className="font-mono text-xs font-semibold text-gold-400 bg-gold-500/10 px-2 py-0.5 rounded border border-gold-500/20">
                  {formatINR(profile.familyIncomeINR)} / year
                </span>
              </div>
              <input
                type="range"
                min="50000"
                max="1200000"
                step="25000"
                value={profile.familyIncomeINR}
                onChange={(e) => setProfile({ ...profile, familyIncomeINR: Number(e.target.value) })}
                className="w-full accent-gold-500 cursor-pointer bg-charcoal-800 h-2 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-ivory-400 font-mono mt-1">
                <span>₹50K</span>
                <span>₹2.5L (Current Setting)</span>
                <span>₹8.0L (OBC NCL Cap)</span>
                <span>₹12L+</span>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-4 border-t border-[var(--border-base)] flex items-center justify-between flex-wrap gap-4">
            <span className="text-xs text-[var(--fg-muted)] font-light">
              Changes update eligibility matches in the Discovery Engine instantly.
            </span>

            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-charcoal-900 dark:bg-ivory-100 text-ivory-50 dark:text-charcoal-950 font-bold text-xs sm:text-sm transition-all shadow-xl hover:scale-105 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{savedSuccess ? "Profile Saved!" : "Save Profile Updates"}</span>
            </button>
          </div>
        </form>

        {/* Dedicated Display & Theme Preferences Card */}
        <div className="editorial-glass rounded-3xl p-6 sm:p-8 border border-[var(--border-base)] space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-gold-500 dark:text-gold-400 mb-1">
                <Sun className="w-3.5 h-3.5" />
                <span>Visual Atmosphere & Display Preferences</span>
              </div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[var(--fg-base)]">
                Application Theme Mode
              </h2>
              <p className="text-xs sm:text-sm text-[var(--fg-muted)] font-light mt-0.5">
                Switch seamlessly between GRANTLY&apos;s signature deep charcoal night mode and the warm ivory editorial light mode.
              </p>
            </div>
            <div className="px-3.5 py-1.5 rounded-full text-xs font-mono bg-gold-500/10 text-gold-600 dark:text-gold-300 border border-gold-500/20">
              Active Mode: <strong>{theme === "dark" ? "Cinematic Dark" : "Warm Ivory Light"}</strong>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Cinematic Dark Option */}
            <div
              onClick={() => {
                setTheme("dark");
                showToast("Theme changed", "Cinematic Dark activated", "info");
              }}
              className={`p-5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${
                theme === "dark"
                  ? "border-gold-400 bg-[#191B17] shadow-xl ring-2 ring-gold-400/30"
                  : "border-[var(--border-base)] bg-[var(--bg-elevated)] hover:border-gold-400/50"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#10120F] border border-white/10 flex items-center justify-center text-gold-300">
                    <Moon className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-[#E9E6D7]">Cinematic Dark</h3>
                    <p className="text-[11px] text-[#A5A397]">Signature Charcoal (#10120F) & Gold</p>
                  </div>
                </div>
                {theme === "dark" && (
                  <span className="w-2.5 h-2.5 rounded-full bg-gold-400 animate-pulse" />
                )}
              </div>
              {/* Color swatches */}
              <div className="flex items-center gap-2 pt-2 border-t border-white/10">
                <span className="w-6 h-6 rounded-md bg-[#10120F] border border-white/10" title="#10120F Background" />
                <span className="w-6 h-6 rounded-md bg-[#191B17] border border-white/10" title="#191B17 Surface" />
                <span className="w-6 h-6 rounded-md bg-[#23251F] border border-white/10" title="#23251F Elevated" />
                <span className="w-6 h-6 rounded-md bg-[#D6C69A]" title="#D6C69A Accent" />
                <span className="w-6 h-6 rounded-md bg-[#E9E6D7]" title="#E9E6D7 Typography" />
              </div>
            </div>

            {/* Warm Ivory Light Option */}
            <div
              onClick={() => {
                setTheme("light");
                showToast("Theme changed", "Warm Ivory Light activated", "info");
              }}
              className={`p-5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${
                theme === "light"
                  ? "border-amber-600 bg-white shadow-xl ring-2 ring-amber-600/30"
                  : "border-[var(--border-base)] bg-[var(--bg-elevated)] hover:border-amber-600/50"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#F4F1E8] border border-black/10 flex items-center justify-center text-amber-700">
                    <Sun className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-[#25251F]">Warm Ivory Light</h3>
                    <p className="text-[11px] text-[#77756B]">Editorial Paper (#F4F1E8) & Rich Muted Gold</p>
                  </div>
                </div>
                {theme === "light" && (
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-600 animate-pulse" />
                )}
              </div>
              {/* Color swatches */}
              <div className="flex items-center gap-2 pt-2 border-t border-black/10">
                <span className="w-6 h-6 rounded-md bg-[#F4F1E8] border border-black/10" title="#F4F1E8 Background" />
                <span className="w-6 h-6 rounded-md bg-[#FFFFFF] border border-black/10" title="#FFFFFF Surface" />
                <span className="w-6 h-6 rounded-md bg-[#EBE7DC] border border-black/10" title="#EBE7DC Elevated" />
                <span className="w-6 h-6 rounded-md bg-[#A58A56]" title="#A58A56 Accent" />
                <span className="w-6 h-6 rounded-md bg-[#25251F]" title="#25251F Typography" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default ProfilePage;
