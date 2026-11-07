import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  User,
  GraduationCap,
  MapPin,
  Lock,
} from "lucide-react";
import { SocialCategory, StudentProfile } from "../types";
import { formatINR } from "../lib/utils";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../components/common/Toast";

export function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { showToast } = useToast();

  const [password, setPassword] = useState("aaravpass2026");
  const [formData, setFormData] = useState<StudentProfile>({
    fullName: "Aarav Sharma",
    email: "aarav.demo@grantly.in",
    phone: "+91 98765 43210",
    state: "Uttar Pradesh",
    district: "Lucknow",
    educationLevel: "Undergraduate",
    currentCourse: "B.Tech Computer Science",
    academicYear: "2nd Year",
    percentageOrCGPA: 8.2,
    familyIncomeINR: 250000,
    category: "OBC",
    gender: "Male",
    isPwD: false,
  });

  const [submitted, setSubmitted] = useState(false);

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
    "Haryana",
    "Odisha",
    "Assam",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(formData.email, password, "student", formData);
      setSubmitted(true);
      showToast("Account and student profile registered successfully!", "success");
      setTimeout(() => {
        navigate("/dashboard");
      }, 800);
    } catch {
      showToast("Registration failed. Please check your details.", "error");
    }
  };

  const handlePreFillDemo = () => {
    setFormData({
      fullName: "Aarav Sharma",
      email: "aarav.demo@grantly.in",
      phone: "+91 98765 43210",
      state: "Uttar Pradesh",
      district: "Lucknow",
      educationLevel: "Undergraduate",
      currentCourse: "B.Tech Computer Science",
      academicYear: "2nd Year",
      percentageOrCGPA: 8.2,
      familyIncomeINR: 250000,
      category: "OBC",
      gender: "Male",
      isPwD: false,
    });
    setPassword("demopassword2026");
    showToast("Loaded official sample student: Aarav Sharma", "info");
  };

  return (
    <div className="min-h-screen bg-charcoal-950 text-ivory-100 flex flex-col selection:bg-gold-500/30 selection:text-ivory-50">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-charcoal-950/90 backdrop-blur-xl border-b border-white/10 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-xs sm:text-sm text-ivory-300 hover:text-white px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>

        <div onClick={() => navigate("/")} className="flex items-center gap-2 cursor-pointer">
          <div className="w-6 h-6 rounded-full bg-gold-500/20 flex items-center justify-center text-gold-400">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <span className="font-serif font-bold tracking-widest text-base sm:text-lg text-ivory-100">
            GRANTLY
          </span>
        </div>

        <button
          onClick={() => navigate("/login")}
          className="text-xs text-ivory-300 hover:text-gold-300 transition-colors"
        >
          Existing User? Sign In
        </button>
      </header>

      {/* Main Registration Container */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-10">
        <div className="editorial-glass rounded-3xl p-6 sm:p-10 border border-white/10 shadow-2xl relative overflow-hidden">
          {/* Header */}
          <div className="flex items-start justify-between flex-wrap gap-4 mb-8">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono uppercase tracking-wider text-gold-400 bg-gold-500/10 border border-gold-500/20 mb-2">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Student Onboarding</span>
              </span>
              <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-semibold text-ivory-100">
                Calibrate Your Scholar Profile
              </h1>
              <p className="text-xs sm:text-sm text-ivory-300/80 mt-1 font-light">
                Configure your state, community category, and academic stream for verified matching.
              </p>
            </div>

            <button
              type="button"
              onClick={handlePreFillDemo}
              className="text-xs px-3.5 py-1.5 rounded-full bg-gold-500/15 hover:bg-gold-500/25 border border-gold-500/30 text-gold-300 font-mono transition-colors cursor-pointer"
            >
              ⚡ Autofill Demo Student
            </button>
          </div>

          {/* Compliance Notice */}
          <div className="mb-8 rounded-2xl bg-gold-500/10 border border-gold-500/20 p-3.5 flex items-center gap-2.5 text-xs text-gold-300">
            <AlertTriangle className="w-4 h-4 shrink-0 text-gold-400" />
            <span>
              <strong>Demonstration Privacy Guarantee:</strong> Profiles created during this preview are kept locally in your browser session. Sensitive information is never forwarded to external parties.
            </span>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 1. Personal Information */}
            <div className="space-y-4">
              <h2 className="text-xs font-mono uppercase tracking-wider text-gold-400 flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>1. Personal & Contact Details</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-ivory-300 mb-1.5">
                    Full Legal Name (as per Aadhaar/Marksheet) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Aarav Sharma"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full bg-charcoal-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-ivory-100 focus:outline-none focus:border-gold-500/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-ivory-300 mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="student@example.edu.in"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-charcoal-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-ivory-100 focus:outline-none focus:border-gold-500/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-ivory-300 mb-1.5">
                    Password (for Session Access) *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-ivory-400" />
                    <input
                      type="password"
                      required
                      placeholder="••••••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-charcoal-900 border border-white/10 rounded-xl pl-9 pr-3.5 py-2.5 text-xs sm:text-sm text-ivory-100 focus:outline-none focus:border-gold-500/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-ivory-300 mb-1.5">
                    Mobile Number (for SMS Deadline Radar)
                  </label>
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-charcoal-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-ivory-100 focus:outline-none focus:border-gold-500/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-ivory-300 mb-1.5">
                    Gender
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                    className="w-full bg-charcoal-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-ivory-100 focus:outline-none focus:border-gold-500/50 cursor-pointer"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female (Eligible for Women in STEM)</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 2. Education Profile */}
            <div className="space-y-4 pt-4 border-t border-white/10">
              <h2 className="text-xs font-mono uppercase tracking-wider text-gold-400 flex items-center gap-2">
                <GraduationCap className="w-4 h-4" />
                <span>2. Academic Enrolment</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-ivory-300 mb-1.5">
                    Current Level *
                  </label>
                  <select
                    value={formData.educationLevel}
                    onChange={(e) => setFormData({ ...formData, educationLevel: e.target.value as any })}
                    className="w-full bg-charcoal-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-ivory-100 focus:outline-none focus:border-gold-500/50 cursor-pointer"
                  >
                    <option value="Class 10">Class 10 (Secondary)</option>
                    <option value="Class 12">Class 12 (Higher Secondary)</option>
                    <option value="Diploma">Polytechnic / Diploma</option>
                    <option value="Undergraduate">Undergraduate (UG)</option>
                    <option value="Postgraduate">Postgraduate (PG)</option>
                    <option value="PhD">Doctoral / PhD</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-ivory-300 mb-1.5">
                    Course / Degree
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. B.Tech / B.Sc / MBBS"
                    value={formData.currentCourse}
                    onChange={(e) => setFormData({ ...formData, currentCourse: e.target.value })}
                    className="w-full bg-charcoal-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-ivory-100 focus:outline-none focus:border-gold-500/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-ivory-300 mb-1.5">
                    Last Exam Percentage / CGPA
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="40"
                    max="100"
                    value={formData.percentageOrCGPA}
                    onChange={(e) => setFormData({ ...formData, percentageOrCGPA: Number(e.target.value) })}
                    className="w-full bg-charcoal-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-ivory-100 focus:outline-none focus:border-gold-500/50"
                  />
                </div>
              </div>
            </div>

            {/* 3. Domicile & Financial Reservation Quotas */}
            <div className="space-y-4 pt-4 border-t border-white/10">
              <h2 className="text-xs font-mono uppercase tracking-wider text-gold-400 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>3. Domicile & Reservation Quotas</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-ivory-300 mb-1.5">
                    Domicile State *
                  </label>
                  <select
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full bg-charcoal-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-ivory-100 focus:outline-none focus:border-gold-500/50 cursor-pointer"
                  >
                    {states.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-ivory-300 mb-1.5">
                    Home District
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Pune / Bengaluru"
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    className="w-full bg-charcoal-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-ivory-100 focus:outline-none focus:border-gold-500/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-ivory-300 mb-1.5">
                    Social Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as SocialCategory })}
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

              {/* Annual Income */}
              <div className="pt-2">
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-medium text-ivory-300">
                    Annual Gross Family Income (INR) *
                  </label>
                  <span className="font-mono text-xs font-semibold text-gold-400 bg-gold-500/10 px-2 py-0.5 rounded border border-gold-500/20">
                    {formatINR(formData.familyIncomeINR)} / year
                  </span>
                </div>
                <input
                  type="range"
                  min="50000"
                  max="1200000"
                  step="25000"
                  value={formData.familyIncomeINR}
                  onChange={(e) => setFormData({ ...formData, familyIncomeINR: Number(e.target.value) })}
                  className="w-full accent-gold-500 cursor-pointer bg-charcoal-800 h-2 rounded-lg"
                />
                <div className="flex justify-between text-[10px] text-ivory-400 font-mono mt-1">
                  <span>₹50K</span>
                  <span>₹2.5L (EWS Cutoff)</span>
                  <span>₹8.0L (OBC Non-Creamy Cutoff)</span>
                  <span>₹12L+</span>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={submitted}
                className="w-full py-3.5 px-6 rounded-full bg-ivory-100 hover:bg-white text-charcoal-950 font-bold text-sm sm:text-base transition-all shadow-xl hover:scale-[1.01] cursor-pointer disabled:opacity-50"
              >
                {submitted ? (
                  <span className="flex items-center justify-center gap-2 text-emerald-700">
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Profile Saved! Redirecting to Explorer...</span>
                  </span>
                ) : (
                  <span>Save Profile & Launch Matched Explorer →</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

export default RegisterPage;
