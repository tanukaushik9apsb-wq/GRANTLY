import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Sparkles, ShieldCheck, Lock, Mail, CheckCircle2, UserCheck, Shield } from "lucide-react";
import { useAuth, DEMO_STUDENT_USER, DEMO_ADMIN_USER } from "../context/AuthContext";
import { useToast } from "../components/common/Toast";
import { UserRole } from "../types";

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, quickLogin, isLoading } = useAuth();
  const { showToast } = useToast();

  const [activeRole, setActiveRole] = useState<UserRole>("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fromLocation = (location.state as any)?.from?.pathname || (activeRole === "admin" ? "/admin" : "/dashboard");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const success = await login(email, password, activeRole);
      if (success) {
        showToast(`Authenticated successfully as ${activeRole.toUpperCase()}`, "success");
        navigate(activeRole === "admin" ? "/admin" : fromLocation, { replace: true });
      } else {
        showToast("Invalid credentials. Please verify your details.", "error");
      }
    } catch {
      showToast("Authentication failed", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickStudentLogin = () => {
    quickLogin("student");
    showToast("Signed in as Demo Student (Aarav Sharma)", "success");
    navigate("/dashboard", { replace: true });
  };

  const handleQuickAdminLogin = () => {
    quickLogin("admin");
    showToast("Signed in as Platform Admin (Dr. Ananya Verma)", "success");
    navigate("/admin", { replace: true });
  };

  return (
    <div className="min-h-screen bg-charcoal-950 text-ivory-100 flex flex-col selection:bg-gold-500/30 selection:text-ivory-50">
      {/* Top Bar */}
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
          onClick={() => navigate("/register")}
          className="text-xs text-ivory-300 hover:text-gold-300 transition-colors cursor-pointer"
        >
          Need an account? Register
        </button>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="editorial-glass rounded-3xl p-6 sm:p-10 max-w-md w-full border border-white/10 shadow-2xl relative overflow-hidden">
          {/* Header Title */}
          <div className="text-center mb-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono uppercase tracking-wider text-gold-400 bg-gold-500/10 border border-gold-500/20 mb-3">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Secure Authentication</span>
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-ivory-100">
              Sign In to GRANTLY
            </h1>
            <p className="text-xs text-ivory-300/80 mt-1 font-light">
              Select your role to access your dedicated workspace.
            </p>
          </div>

          {/* Role Selector Tabs */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-charcoal-900 border border-white/10 rounded-2xl mb-6">
            <button
              type="button"
              onClick={() => {
                setActiveRole("student");
                setEmail(DEMO_STUDENT_USER.email);
              }}
              className={`py-2 px-3 rounded-xl text-xs font-medium transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeRole === "student"
                  ? "bg-gold-500/20 text-gold-300 border border-gold-500/30 shadow"
                  : "text-ivory-400 hover:text-white"
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Student Portal</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveRole("admin");
                setEmail(DEMO_ADMIN_USER.email);
              }}
              className={`py-2 px-3 rounded-xl text-xs font-medium transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeRole === "admin"
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow"
                  : "text-ivory-400 hover:text-white"
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin Console</span>
            </button>
          </div>

          {/* Quick Demo Access Buttons */}
          <div className="space-y-2 mb-6">
            {activeRole === "student" ? (
              <button
                type="button"
                onClick={handleQuickStudentLogin}
                className="w-full py-2.5 px-4 rounded-2xl bg-gold-500/15 hover:bg-gold-500/25 border border-gold-500/30 text-gold-300 text-xs font-mono transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>⚡ 1-Click Login: Aarav Sharma (Demo Student)</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleQuickAdminLogin}
                className="w-full py-2.5 px-4 rounded-2xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-xs font-mono transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>⚡ 1-Click Login: Dr. Ananya Verma (Admin)</span>
              </button>
            )}
          </div>

          {/* Standard Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-ivory-300 mb-1.5">
                {activeRole === "student" ? "Student Email or Roll ID" : "Administrative Email"}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-ivory-400" />
                <input
                  type="email"
                  required
                  placeholder={
                    activeRole === "student"
                      ? "aarav.demo@grantly.in"
                      : "admin.verma@grantly.in"
                  }
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-charcoal-900 border border-white/10 rounded-xl pl-10 pr-3.5 py-2.5 text-xs sm:text-sm text-ivory-100 focus:outline-none focus:border-gold-500/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-ivory-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-ivory-400" />
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-charcoal-900 border border-white/10 rounded-xl pl-10 pr-3.5 py-2.5 text-xs sm:text-sm text-ivory-100 focus:outline-none focus:border-gold-500/50"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || isLoading}
              className="w-full mt-4 py-3 px-6 rounded-full bg-ivory-100 hover:bg-white text-charcoal-950 font-bold text-xs sm:text-sm transition-all shadow-xl hover:scale-[1.01] cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2 text-emerald-700">
                  <CheckCircle2 className="w-4 h-4 animate-spin" />
                  <span>Authenticating...</span>
                </span>
              ) : (
                <span>
                  {activeRole === "admin" ? "Access Admin Console →" : "Sign In to Dashboard →"}
                </span>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-ivory-400">
            <span>Don&apos;t have an account yet? </span>
            <button
              onClick={() => navigate("/register")}
              className="text-gold-400 hover:text-gold-300 font-medium cursor-pointer"
            >
              Register here
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default LoginPage;
