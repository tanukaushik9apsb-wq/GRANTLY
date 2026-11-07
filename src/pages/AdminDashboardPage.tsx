import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  Sparkles,
  ExternalLink,
  Edit3,
  Trash2,
  X,
  FileText,
  Lock,
  LogOut,
  IndianRupee,
  Calendar,
  AlertTriangle,
  Database,
  Building2,
  UserCheck,
} from "lucide-react";
import { Scholarship, ScholarshipType, EducationLevel, SocialCategory, VerificationStatus } from "../types";
import { ScholarshipService } from "../services/scholarshipService";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../components/common/Toast";
import { getBackendStatus } from "../lib/supabase";
import { ThemeToggle } from "../components/common/ThemeToggle";

export function AdminDashboardPage() {
  const navigate = useNavigate();
  const { user, logout, quickLogin } = useAuth();
  const { showToast } = useToast();

  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterTab, setFilterTab] = useState<"all" | "real" | "demo" | "verified" | "pending">("all");
  
  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingScholarship, setEditingScholarship] = useState<Scholarship | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form State for Create / Edit
  const [formData, setFormData] = useState({
    title: "",
    provider: "",
    type: "Central Government" as ScholarshipType,
    educationLevels: ["Undergraduate", "Postgraduate"] as EducationLevel[],
    applicableCategories: ["General", "OBC", "SC", "ST", "EWS"] as SocialCategory[],
    applicableStates: "All India",
    amountINR: 50000,
    frequency: "Annual" as "Annual" | "One-time" | "Monthly" | "Per Degree",
    deadline: "2026-12-31",
    minPercentageOrCGPA: 75,
    maxFamilyIncomeINR: 500000,
    genderRestriction: "All" as "All" | "Female" | "Transgender",
    description: "",
    eligibilitySummary: "",
    documentsRequired: "Class 10 & 12 Board Marksheet\nIncome Certificate from Tehsildar\nAadhaar Card\nCollege Bonafide Certificate",
    officialPortalUrl: "https://scholarships.gov.in",
    sourceUrl: "",
    verificationStatus: "verified" as VerificationStatus,
    isDemoRecord: false,
  });

  const backendStatus = getBackendStatus();

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await ScholarshipService.getAllScholarships();
      setScholarships(data);
    } catch (err) {
      console.error("Error loading scholarships", err);
      showToast("Could not load scholarships database", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenCreateModal = () => {
    setFormData({
      title: "",
      provider: "",
      type: "Central Government",
      educationLevels: ["Undergraduate", "Postgraduate"],
      applicableCategories: ["General", "OBC", "SC", "ST", "EWS"],
      applicableStates: "All India",
      amountINR: 50000,
      frequency: "Annual",
      deadline: "2026-12-31",
      minPercentageOrCGPA: 75,
      maxFamilyIncomeINR: 500000,
      genderRestriction: "All",
      description: "",
      eligibilitySummary: "",
      documentsRequired: "Class 10 & 12 Board Marksheet\nIncome Certificate from Revenue Authority\nAadhaar Proof\nCollege Bonafide Certificate",
      officialPortalUrl: "https://scholarships.gov.in",
      sourceUrl: "https://www.education.gov.in",
      verificationStatus: "verified",
      isDemoRecord: false,
    });
    setEditingScholarship(null);
    setIsCreateModalOpen(true);
  };

  const handleOpenEditModal = (scheme: Scholarship) => {
    setEditingScholarship(scheme);
    setFormData({
      title: scheme.title,
      provider: scheme.provider,
      type: scheme.type,
      educationLevels: scheme.educationLevels,
      applicableCategories: scheme.applicableCategories,
      applicableStates: scheme.applicableStates.join(", "),
      amountINR: scheme.amountINR,
      frequency: scheme.frequency,
      deadline: scheme.deadline,
      minPercentageOrCGPA: scheme.minPercentageOrCGPA || 0,
      maxFamilyIncomeINR: scheme.maxFamilyIncomeINR || 800000,
      genderRestriction: scheme.genderRestriction || "All",
      description: scheme.description,
      eligibilitySummary: scheme.eligibilitySummary,
      documentsRequired: scheme.documentsRequired.join("\n"),
      officialPortalUrl: scheme.officialPortalUrl || "",
      sourceUrl: scheme.sourceUrl || "",
      verificationStatus: scheme.verificationStatus || (scheme.isDemoRecord ? "unverified" : "verified"),
      isDemoRecord: scheme.isDemoRecord,
    });
    setIsCreateModalOpen(true);
  };

  const handleSaveScholarship = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.provider) {
      showToast("Please provide scheme title and provider name", "warning");
      return;
    }

    const docsList = formData.documentsRequired
      .split("\n")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const statesList = formData.applicableStates
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    try {
      if (editingScholarship) {
        await ScholarshipService.updateScholarship(editingScholarship.id, {
          title: formData.title,
          provider: formData.provider,
          type: formData.type,
          educationLevels: formData.educationLevels,
          applicableCategories: formData.applicableCategories,
          applicableStates: statesList.length > 0 ? statesList : ["All India"],
          amountINR: Number(formData.amountINR),
          frequency: formData.frequency,
          deadline: formData.deadline,
          minPercentageOrCGPA: Number(formData.minPercentageOrCGPA),
          maxFamilyIncomeINR: Number(formData.maxFamilyIncomeINR),
          genderRestriction: formData.genderRestriction,
          description: formData.description || "Official scholarship scheme listed on verified portal.",
          eligibilitySummary: formData.eligibilitySummary || `Income ≤ ₹${Number(formData.amountINR).toLocaleString("en-IN")}, Indian Citizen.`,
          documentsRequired: docsList,
          officialPortalUrl: formData.officialPortalUrl,
          sourceUrl: formData.sourceUrl,
          verificationStatus: formData.verificationStatus,
          isDemoRecord: formData.isDemoRecord,
        });
        showToast("Scholarship record updated successfully", "success");
      } else {
        await ScholarshipService.createScholarship({
          title: formData.title,
          provider: formData.provider,
          type: formData.type,
          educationLevels: formData.educationLevels,
          applicableCategories: formData.applicableCategories,
          applicableStates: statesList.length > 0 ? statesList : ["All India"],
          amountINR: Number(formData.amountINR),
          frequency: formData.frequency,
          deadline: formData.deadline,
          minPercentageOrCGPA: Number(formData.minPercentageOrCGPA),
          maxFamilyIncomeINR: Number(formData.maxFamilyIncomeINR),
          genderRestriction: formData.genderRestriction,
          description: formData.description || "Official scholarship scheme listed on verified portal.",
          eligibilitySummary: formData.eligibilitySummary || `Income ≤ ₹${Number(formData.amountINR).toLocaleString("en-IN")}, Indian Citizen.`,
          documentsRequired: docsList,
          officialPortalUrl: formData.officialPortalUrl,
          sourceUrl: formData.sourceUrl,
          verificationStatus: formData.verificationStatus,
          isDemoRecord: formData.isDemoRecord,
        });
        showToast("New official scholarship scheme created", "success");
      }

      setIsCreateModalOpen(false);
      await loadData();
    } catch (err) {
      console.error(err);
      showToast("Failed to save scholarship", "error");
    }
  };

  const handleToggleVerification = async (scheme: Scholarship) => {
    const nextStatus: VerificationStatus =
      scheme.verificationStatus === "verified" ? "pending_verification" : "verified";
    try {
      await ScholarshipService.toggleVerificationStatus(scheme.id, nextStatus, user?.fullName);
      showToast(
        nextStatus === "verified"
          ? `Scheme marked as VERIFIED OFFICIAL`
          : `Verification status moved to PENDING`,
        "success"
      );
      await loadData();
    } catch (err) {
      console.error(err);
      showToast("Failed to toggle verification status", "error");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await ScholarshipService.deleteScholarship(id);
      showToast("Scholarship permanently deleted from directory", "info");
      setDeletingId(null);
      await loadData();
    } catch (err) {
      console.error(err);
      showToast("Delete operation failed", "error");
    }
  };

  // Filter calculations
  const filteredScholarships = scholarships.filter((s) => {
    const matchesSearch =
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.provider.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    if (filterTab === "real") return !s.isDemoRecord;
    if (filterTab === "demo") return s.isDemoRecord;
    if (filterTab === "verified") return s.verificationStatus === "verified";
    if (filterTab === "pending") return s.verificationStatus === "pending_verification" || !s.verificationStatus;
    return true;
  });

  const verifiedCount = scholarships.filter((s) => s.verificationStatus === "verified").length;
  const pendingCount = scholarships.filter((s) => s.verificationStatus === "pending_verification" || (!s.verificationStatus && !s.isDemoRecord)).length;
  const realCount = scholarships.filter((s) => !s.isDemoRecord).length;
  const demoCount = scholarships.filter((s) => s.isDemoRecord).length;

  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--fg-base)] flex flex-col selection:bg-gold-500/30 selection:text-ivory-50 transition-colors duration-300">
      {/* Top Admin Navbar */}
      <header className="sticky top-0 z-40 bg-[var(--bg-surface)]/95 backdrop-blur-xl border-b border-[var(--border-base)] px-4 sm:px-8 py-3.5 flex items-center justify-between transition-colors">
        <div className="flex items-center gap-4">
          <div
            onClick={() => navigate("/")}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="w-7 h-7 rounded-full bg-gold-500/20 border border-gold-500/30 flex items-center justify-center text-gold-400 group-hover:scale-105 transition-transform">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="font-serif font-bold tracking-widest text-base sm:text-lg text-[var(--fg-base)]">
              GRANTLY
            </span>
          </div>

          <div className="h-5 w-px bg-[var(--border-base)] hidden sm:block" />

          <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono uppercase tracking-wider text-gold-600 dark:text-gold-300 bg-gold-500/10 border border-gold-500/20">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Admin Console & Verification Desk</span>
          </span>
        </div>

        {/* User Info & Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Theme Switcher */}
          <ThemeToggle />

          <div className="text-right hidden md:block">
            <div className="text-xs font-medium text-[var(--fg-base)] flex items-center justify-end gap-1.5">
              <span>{user?.fullName || "Dr. Ananya Verma"}</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30 font-mono">
                ADMIN
              </span>
            </div>
            <div className="text-[11px] text-[var(--fg-muted)] font-mono">
              Chief Verification Officer
            </div>
          </div>

          {/* Quick Switch to Student View */}
          <button
            onClick={() => {
              quickLogin("student");
              navigate("/dashboard");
              showToast("Switched session to Demo Student (Aarav Sharma)", "info");
            }}
            className="text-xs px-3 py-1.5 rounded-full bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 border border-[var(--border-base)] text-[var(--fg-base)] transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Switch to Student Workspace to test student experience"
          >
            <UserCheck className="w-3.5 h-3.5 text-gold-500 dark:text-gold-400" />
            <span className="hidden sm:inline">Switch to Student View</span>
          </button>

          <button
            onClick={() => {
              logout();
              navigate("/login");
              showToast("Admin session logged out", "info");
            }}
            className="p-2 rounded-full bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 border border-[var(--border-base)] text-[var(--fg-muted)] hover:text-[var(--fg-base)] transition-colors cursor-pointer"
            title="Sign out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Console Greeting Banner */}
        <div className="editorial-glass rounded-3xl p-6 sm:p-8 border border-white/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono uppercase tracking-wider text-emerald-300 bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-1">
                  <Database className="w-3 h-3" />
                  <span>{backendStatus.provider}</span>
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono uppercase tracking-wider text-ivory-300 bg-white/5 border border-white/10">
                  PostgreSQL RLS Active
                </span>
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-ivory-100">
                Scheme Verification & Catalog Administration
              </h1>
              <p className="text-xs sm:text-sm text-ivory-300/80 mt-1 max-w-2xl font-light">
                Manage official Indian scholarship listings, inspect verification evidence, audit portal links, and maintain statutory compliance separating real schemes from demonstration data.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleOpenCreateModal}
                className="px-5 py-2.5 rounded-2xl bg-gold-400 hover:bg-gold-300 text-charcoal-950 font-medium text-xs sm:text-sm transition-all duration-300 shadow-lg shadow-gold-500/20 flex items-center gap-2 cursor-pointer font-sans"
              >
                <Plus className="w-4 h-4" />
                <span>Publish New Scholarship</span>
              </button>
            </div>
          </div>
        </div>

        {/* Administrative Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
          <div className="editorial-glass rounded-2xl p-4 border border-white/10">
            <span className="text-[11px] font-mono text-ivory-400 uppercase tracking-wider block mb-1">
              Total Schemes
            </span>
            <div className="text-2xl font-serif font-bold text-ivory-100">
              {scholarships.length}
            </div>
            <span className="text-[10px] text-ivory-400">All registered in catalog</span>
          </div>

          <div className="editorial-glass rounded-2xl p-4 border border-white/10">
            <span className="text-[11px] font-mono text-emerald-400 uppercase tracking-wider block mb-1">
              Verified Official
            </span>
            <div className="text-2xl font-serif font-bold text-emerald-300">
              {verifiedCount}
            </div>
            <span className="text-[10px] text-emerald-400/80">Active with source URL</span>
          </div>

          <div className="editorial-glass rounded-2xl p-4 border border-white/10">
            <span className="text-[11px] font-mono text-amber-400 uppercase tracking-wider block mb-1">
              Pending Review
            </span>
            <div className="text-2xl font-serif font-bold text-amber-300">
              {pendingCount}
            </div>
            <span className="text-[10px] text-amber-400/80">Requires verification</span>
          </div>

          <div className="editorial-glass rounded-2xl p-4 border border-white/10">
            <span className="text-[11px] font-mono text-gold-400 uppercase tracking-wider block mb-1">
              Real Schemes
            </span>
            <div className="text-2xl font-serif font-bold text-gold-300">
              {realCount}
            </div>
            <span className="text-[10px] text-gold-400/80">Official Central/State</span>
          </div>

          <div className="editorial-glass rounded-2xl p-4 border border-white/10 col-span-2 lg:col-span-1">
            <span className="text-[11px] font-mono text-blue-400 uppercase tracking-wider block mb-1">
              Demo Records
            </span>
            <div className="text-2xl font-serif font-bold text-blue-300">
              {demoCount}
            </div>
            <span className="text-[10px] text-blue-400/80">Clearly labeled fictional</span>
          </div>
        </div>

        {/* Statutory Compliance Notice Banner */}
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-3.5">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-200/90 leading-relaxed font-light">
            <strong className="font-semibold text-amber-300 font-sans">
              Statutory Disclaimer Compliance Protocol:
            </strong>{" "}
            All tracking entries logged by students inside GRANTLY represent internal planning and document readiness.
            GRANTLY does not submit applications on behalf of students to external government portals (e.g., NSP, UP Scholarship, MahaDBT).
            Ensure every published scholarship points to an authenticated official source URL.
          </div>
        </div>

        {/* Directory Controls: Search & Tabs */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          {/* Tabs */}
          <div className="flex items-center gap-1 p-1 bg-charcoal-900 border border-white/10 rounded-2xl overflow-x-auto">
            <button
              onClick={() => setFilterTab("all")}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all cursor-pointer whitespace-nowrap ${
                filterTab === "all"
                  ? "bg-gold-500/20 text-gold-300 border border-gold-500/30"
                  : "text-ivory-300 hover:text-white"
              }`}
            >
              All ({scholarships.length})
            </button>
            <button
              onClick={() => setFilterTab("verified")}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all cursor-pointer whitespace-nowrap ${
                filterTab === "verified"
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                  : "text-ivory-300 hover:text-white"
              }`}
            >
              Verified ({verifiedCount})
            </button>
            <button
              onClick={() => setFilterTab("pending")}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all cursor-pointer whitespace-nowrap ${
                filterTab === "pending"
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                  : "text-ivory-300 hover:text-white"
              }`}
            >
              Pending ({pendingCount})
            </button>
            <button
              onClick={() => setFilterTab("real")}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all cursor-pointer whitespace-nowrap ${
                filterTab === "real"
                  ? "bg-white/15 text-white border border-white/20"
                  : "text-ivory-300 hover:text-white"
              }`}
            >
              Real Schemes ({realCount})
            </button>
            <button
              onClick={() => setFilterTab("demo")}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all cursor-pointer whitespace-nowrap ${
                filterTab === "demo"
                  ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                  : "text-ivory-300 hover:text-white"
              }`}
            >
              Demo Records ({demoCount})
            </button>
          </div>

          {/* Search Box */}
          <div className="relative min-w-[280px]">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-ivory-400" />
            <input
              type="text"
              placeholder="Search by title or provider..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-charcoal-900 border border-white/10 rounded-2xl pl-10 pr-4 py-2 text-xs text-ivory-100 placeholder:text-ivory-400 focus:outline-none focus:border-gold-500/40"
            />
          </div>
        </div>

        {/* Scholarships Table / Cards */}
        {loading ? (
          <div className="editorial-glass rounded-3xl p-12 text-center border border-white/10">
            <div className="w-8 h-8 rounded-full border-2 border-gold-400 border-t-transparent animate-spin mx-auto mb-3" />
            <span className="text-xs font-mono text-ivory-300">Loading catalog from database...</span>
          </div>
        ) : filteredScholarships.length === 0 ? (
          <div className="editorial-glass rounded-3xl p-12 text-center border border-white/10">
            <FileText className="w-10 h-10 text-ivory-400 mx-auto mb-3 opacity-40" />
            <h3 className="font-serif text-lg text-ivory-100">No scholarships match filter</h3>
            <p className="text-xs text-ivory-400 mt-1">Adjust search terms or select another category tab.</p>
          </div>
        ) : (
          <div className="editorial-glass rounded-3xl border border-white/10 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-charcoal-900/80 border-b border-white/10 text-ivory-400 font-mono text-[11px] uppercase tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4 sm:px-6">Scheme / Provider</th>
                    <th className="py-3.5 px-4">Type & States</th>
                    <th className="py-3.5 px-4">Disbursement</th>
                    <th className="py-3.5 px-4">Deadline</th>
                    <th className="py-3.5 px-4">Status & Source</th>
                    <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredScholarships.map((s) => (
                    <tr
                      key={s.id}
                      className="hover:bg-white/[0.02] transition-colors"
                    >
                      {/* Title & Provider */}
                      <td className="py-4 px-4 sm:px-6 max-w-sm">
                        <div className="font-medium text-ivory-100 font-sans text-sm line-clamp-1">
                          {s.title}
                        </div>
                        <div className="text-[11px] text-ivory-400 flex items-center gap-1.5 mt-0.5">
                          <Building2 className="w-3 h-3 text-gold-400/70" />
                          <span className="truncate">{s.provider}</span>
                        </div>
                      </td>

                      {/* Type & States */}
                      <td className="py-4 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/5 text-ivory-200 border border-white/10">
                          {s.type}
                        </span>
                        <div className="text-[11px] text-ivory-400 mt-1 font-mono">
                          {s.applicableStates.slice(0, 2).join(", ")}
                          {s.applicableStates.length > 2 && "..."}
                        </div>
                      </td>

                      {/* Disbursement */}
                      <td className="py-4 px-4">
                        <div className="font-mono text-gold-300 font-medium flex items-center gap-0.5">
                          <IndianRupee className="w-3 h-3" />
                          <span>{s.amountINR.toLocaleString("en-IN")}</span>
                        </div>
                        <span className="text-[10px] text-ivory-400 font-mono">
                          {s.frequency}
                        </span>
                      </td>

                      {/* Deadline */}
                      <td className="py-4 px-4">
                        <div className="text-ivory-200 flex items-center gap-1.5 font-mono text-[11px]">
                          <Calendar className="w-3 h-3 text-ivory-400" />
                          <span>{s.deadline}</span>
                        </div>
                      </td>

                      {/* Status & Verification */}
                      <td className="py-4 px-4">
                        <div className="flex flex-col gap-1 items-start">
                          {s.isDemoRecord ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider text-blue-300 bg-blue-500/10 border border-blue-500/20">
                              DEMO DATA
                            </span>
                          ) : s.verificationStatus === "verified" ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>VERIFIED OFFICIAL</span>
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider text-amber-300 bg-amber-500/10 border border-amber-500/20 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span>PENDING VERIFY</span>
                            </span>
                          )}

                          {s.sourceUrl && (
                            <a
                              href={s.sourceUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[10px] text-gold-400 hover:text-gold-300 flex items-center gap-1 underline underline-offset-2"
                            >
                              <span>Official Gazette/Link</span>
                              <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 sm:px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {/* Toggle Verification Button */}
                          <button
                            onClick={() => handleToggleVerification(s)}
                            className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                              s.verificationStatus === "verified"
                                ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/25"
                                : "bg-white/5 border-white/10 text-ivory-300 hover:text-emerald-300 hover:border-emerald-500/30"
                            }`}
                            title={s.verificationStatus === "verified" ? "Revoke Verification" : "Mark as Verified Official"}
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>

                          {/* Edit Button */}
                          <button
                            onClick={() => handleOpenEditModal(s)}
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-ivory-300 hover:text-white transition-colors cursor-pointer"
                            title="Edit Scheme Details"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          {/* Delete Button */}
                          <button
                            onClick={() => setDeletingId(s.id)}
                            className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-300 transition-colors cursor-pointer"
                            title="Delete Scheme"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Database & Security Architecture Card */}
        <div className="editorial-glass rounded-3xl p-6 sm:p-8 border border-white/10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-gold-500/20 border border-gold-500/30 flex items-center justify-center text-gold-400">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-serif text-lg sm:text-xl font-semibold text-ivory-100">
                Backend Security & Row-Level Isolation Overview
              </h2>
              <p className="text-xs text-ivory-300 font-light">
                Enterprise-grade security controls configured in <code className="text-gold-300">supabase/schema.sql</code>.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            <div className="p-4 rounded-2xl bg-charcoal-900 border border-white/5 space-y-1.5">
              <span className="text-[11px] font-mono text-emerald-400 uppercase tracking-wider block">
                RLS Protection
              </span>
              <div className="text-xs text-ivory-200 font-medium">
                Tenant Isolation Active
              </div>
              <p className="text-[11px] text-ivory-400 font-light leading-relaxed">
                Students can only view, update, or delete their own profiles, applications, and documents.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-charcoal-900 border border-white/5 space-y-1.5">
              <span className="text-[11px] font-mono text-gold-400 uppercase tracking-wider block">
                Storage Security
              </span>
              <div className="text-xs text-ivory-200 font-medium">
                Private Vault Folders
              </div>
              <p className="text-[11px] text-ivory-400 font-light leading-relaxed">
                Vault uploads stored in <code className="text-gold-300">student-documents/&#123;uid&#125;/*</code> with cryptographic authorization.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-charcoal-900 border border-white/5 space-y-1.5">
              <span className="text-[11px] font-mono text-blue-400 uppercase tracking-wider block">
                Demo Boundary
              </span>
              <div className="text-xs text-ivory-200 font-medium">
                Strict Flag Separation
              </div>
              <p className="text-[11px] text-ivory-400 font-light leading-relaxed">
                <code className="text-gold-300">is_demo_record</code> isolates simulated schemes from genuine government and institutional programs.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-charcoal-900 border border-white/5 space-y-1.5">
              <span className="text-[11px] font-mono text-purple-400 uppercase tracking-wider block">
                Statutory Notice
              </span>
              <div className="text-xs text-ivory-200 font-medium">
                No Misleading Submission
              </div>
              <p className="text-[11px] text-ivory-400 font-light leading-relaxed">
                Explicit legal disclaimer that internal tracking does NOT submit official state or central portal applications.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      {deletingId && (
        <div className="fixed inset-0 z-50 bg-charcoal-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="editorial-glass rounded-3xl p-6 max-w-sm w-full border border-red-500/30 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-semibold text-ivory-100">
              Confirm Scheme Deletion
            </h3>
            <p className="text-xs text-ivory-300/80">
              Are you sure you want to permanently delete this scholarship record from the GRANTLY database? This action cannot be undone.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeletingId(null)}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-ivory-300 border border-white/10 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deletingId)}
                className="px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-xs text-white font-medium cursor-pointer shadow-lg shadow-red-500/20"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Scholarship Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-charcoal-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="editorial-glass rounded-3xl p-6 sm:p-8 max-w-2xl w-full border border-white/15 my-8 relative">
            <button
              onClick={() => setIsCreateModalOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-ivory-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="mb-6">
              <span className="px-3 py-1 rounded-full text-xs font-mono uppercase tracking-wider text-gold-400 bg-gold-500/10 border border-gold-500/20 mb-2 inline-block">
                {editingScholarship ? "Update Catalog Entry" : "New Official Listing"}
              </span>
              <h2 className="font-serif text-2xl font-semibold text-ivory-100">
                {editingScholarship ? "Edit Scholarship Details" : "Publish Official Scholarship Scheme"}
              </h2>
              <p className="text-xs text-ivory-300/80 mt-1">
                Provide accurate details and official portal URLs. Real listings require a verified source.
              </p>
            </div>

            <form onSubmit={handleSaveScholarship} className="space-y-4">
              {/* Title & Provider */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-ivory-300 mb-1">
                    Scheme Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Central Sector Scheme of Scholarship (CSSS)"
                    className="w-full bg-charcoal-900 border border-white/10 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-ivory-100 focus:outline-none focus:border-gold-500/40"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-ivory-300 mb-1">
                    Authority / Provider *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.provider}
                    onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
                    placeholder="e.g. Ministry of Education, Govt. of India"
                    className="w-full bg-charcoal-900 border border-white/10 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-ivory-100 focus:outline-none focus:border-gold-500/40"
                  />
                </div>
              </div>

              {/* Type & States */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-ivory-300 mb-1">
                    Scheme Classification
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as ScholarshipType })}
                    className="w-full bg-charcoal-900 border border-white/10 rounded-xl px-3 py-2 text-xs sm:text-sm text-ivory-100 focus:outline-none focus:border-gold-500/40"
                  >
                    <option value="Central Government">Central Government</option>
                    <option value="State Government">State Government</option>
                    <option value="Corporate / CSR">Corporate / CSR</option>
                    <option value="Institutional Trust">Institutional Trust</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-ivory-300 mb-1">
                    Applicable States (Comma-sep)
                  </label>
                  <input
                    type="text"
                    value={formData.applicableStates}
                    onChange={(e) => setFormData({ ...formData, applicableStates: e.target.value })}
                    placeholder="All India, or Uttar Pradesh, Delhi"
                    className="w-full bg-charcoal-900 border border-white/10 rounded-xl px-3 py-2 text-xs sm:text-sm text-ivory-100 focus:outline-none focus:border-gold-500/40"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-ivory-300 mb-1">
                    Gender Restriction
                  </label>
                  <select
                    value={formData.genderRestriction}
                    onChange={(e) => setFormData({ ...formData, genderRestriction: e.target.value as "All" | "Female" | "Transgender" })}
                    className="w-full bg-charcoal-900 border border-white/10 rounded-xl px-3 py-2 text-xs sm:text-sm text-ivory-100 focus:outline-none focus:border-gold-500/40"
                  >
                    <option value="All">All Genders</option>
                    <option value="Female">Girl Students Only</option>
                    <option value="Transgender">Transgender Only</option>
                  </select>
                </div>
              </div>

              {/* Funding Amount, Frequency & Deadline */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-ivory-300 mb-1">
                    Grant Amount (₹ INR) *
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={formData.amountINR}
                    onChange={(e) => setFormData({ ...formData, amountINR: Number(e.target.value) })}
                    className="w-full bg-charcoal-900 border border-white/10 rounded-xl px-3 py-2 text-xs sm:text-sm text-ivory-100 focus:outline-none focus:border-gold-500/40"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-ivory-300 mb-1">
                    Disbursement Cycle
                  </label>
                  <select
                    value={formData.frequency}
                    onChange={(e) => setFormData({ ...formData, frequency: e.target.value as any })}
                    className="w-full bg-charcoal-900 border border-white/10 rounded-xl px-3 py-2 text-xs sm:text-sm text-ivory-100 focus:outline-none focus:border-gold-500/40"
                  >
                    <option value="Annual">Annual</option>
                    <option value="Monthly">Monthly</option>
                    <option value="One-time">One-time</option>
                    <option value="Per Degree">Per Degree</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-ivory-300 mb-1">
                    Deadline Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    className="w-full bg-charcoal-900 border border-white/10 rounded-xl px-3 py-2 text-xs sm:text-sm text-ivory-100 focus:outline-none focus:border-gold-500/40"
                  />
                </div>
              </div>

              {/* Academic Benchmark & Income Ceiling */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-ivory-300 mb-1">
                    Min Academic Cutoff (Percentage or 10x CGPA)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={formData.minPercentageOrCGPA}
                    onChange={(e) => setFormData({ ...formData, minPercentageOrCGPA: Number(e.target.value) })}
                    placeholder="e.g. 75"
                    className="w-full bg-charcoal-900 border border-white/10 rounded-xl px-3 py-2 text-xs sm:text-sm text-ivory-100 focus:outline-none focus:border-gold-500/40"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-ivory-300 mb-1">
                    Max Annual Family Income Ceiling (₹ INR)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={formData.maxFamilyIncomeINR}
                    onChange={(e) => setFormData({ ...formData, maxFamilyIncomeINR: Number(e.target.value) })}
                    placeholder="e.g. 500000"
                    className="w-full bg-charcoal-900 border border-white/10 rounded-xl px-3 py-2 text-xs sm:text-sm text-ivory-100 focus:outline-none focus:border-gold-500/40"
                  />
                </div>
              </div>

              {/* Official Portal & Source URLs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-ivory-300 mb-1">
                    Official Portal URL (Application Gateway)
                  </label>
                  <input
                    type="url"
                    value={formData.officialPortalUrl}
                    onChange={(e) => setFormData({ ...formData, officialPortalUrl: e.target.value })}
                    placeholder="https://scholarships.gov.in"
                    className="w-full bg-charcoal-900 border border-white/10 rounded-xl px-3 py-2 text-xs sm:text-sm text-ivory-100 focus:outline-none focus:border-gold-500/40"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-ivory-300 mb-1">
                    Official Source URL (Gazette / Notification)
                  </label>
                  <input
                    type="url"
                    value={formData.sourceUrl}
                    onChange={(e) => setFormData({ ...formData, sourceUrl: e.target.value })}
                    placeholder="https://www.education.gov.in/en/..."
                    className="w-full bg-charcoal-900 border border-white/10 rounded-xl px-3 py-2 text-xs sm:text-sm text-ivory-100 focus:outline-none focus:border-gold-500/40"
                  />
                </div>
              </div>

              {/* Eligibility Summary & Documents Required */}
              <div>
                <label className="block text-xs font-medium text-ivory-300 mb-1">
                  Eligibility Summary
                </label>
                <input
                  type="text"
                  value={formData.eligibilitySummary}
                  onChange={(e) => setFormData({ ...formData, eligibilitySummary: e.target.value })}
                  placeholder="Summary of qualifications and family income eligibility"
                  className="w-full bg-charcoal-900 border border-white/10 rounded-xl px-3 py-2 text-xs sm:text-sm text-ivory-100 focus:outline-none focus:border-gold-500/40"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-ivory-300 mb-1">
                  Documents Required (One per line)
                </label>
                <textarea
                  rows={3}
                  value={formData.documentsRequired}
                  onChange={(e) => setFormData({ ...formData, documentsRequired: e.target.value })}
                  className="w-full bg-charcoal-900 border border-white/10 rounded-xl p-3 text-xs sm:text-sm text-ivory-100 focus:outline-none focus:border-gold-500/40 font-mono"
                />
              </div>

              {/* Status and Demo Checkbox */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-charcoal-900 border border-white/10">
                <div>
                  <label className="block text-xs font-medium text-ivory-200 mb-1">
                    Verification State
                  </label>
                  <select
                    value={formData.verificationStatus}
                    onChange={(e) => setFormData({ ...formData, verificationStatus: e.target.value as VerificationStatus })}
                    className="bg-charcoal-950 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-ivory-100 focus:outline-none focus:border-gold-500/40"
                  >
                    <option value="verified">Verified Official</option>
                    <option value="pending_verification">Pending Verification</option>
                    <option value="unverified">Unverified Draft</option>
                  </select>
                </div>

                <div className="flex items-center gap-2.5">
                  <input
                    type="checkbox"
                    id="isDemoRecord"
                    checked={formData.isDemoRecord}
                    onChange={(e) => setFormData({ ...formData, isDemoRecord: e.target.checked })}
                    className="w-4 h-4 rounded text-gold-400 bg-charcoal-950 border-white/20 focus:ring-gold-500"
                  />
                  <label htmlFor="isDemoRecord" className="text-xs text-ivory-300 cursor-pointer">
                    Mark as Demonstration Record (Fictional Demo Data)
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-ivory-300 border border-white/10 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-gold-400 hover:bg-gold-300 text-charcoal-950 text-xs sm:text-sm font-medium transition-all shadow-lg shadow-gold-500/20 cursor-pointer"
                >
                  {editingScholarship ? "Save Changes" : "Publish to Directory"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
