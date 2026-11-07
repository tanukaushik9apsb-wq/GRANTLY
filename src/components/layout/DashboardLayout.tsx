import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Sparkles,
  LayoutDashboard,
  Compass,
  FileCheck2,
  Send,
  User,
  Bell,
  AlertTriangle,
  Menu,
  X,
  CheckCircle2,
  CheckCheck,
  ShieldCheck,
  LogOut,
} from "lucide-react";
import { DEMO_SAMPLE_STUDENT } from "../../data/demoScholarships";
import { NotificationItem } from "../../types";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../common/Toast";
import { ThemeToggle } from "../common/ThemeToggle";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, role, studentProfile, logout } = useAuth();
  const { showToast } = useToast();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    try {
      const stored = localStorage.getItem("grantly_notifications");
      return stored ? JSON.parse(stored) : DEMO_SAMPLE_STUDENT.notifications;
    } catch {
      return DEMO_SAMPLE_STUDENT.notifications;
    }
  });

  const profile = studentProfile || DEMO_SAMPLE_STUDENT.profile;
  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAllRead = () => {
    const updated = notifications.map((n) => ({ ...n, read: true }));
    setNotifications(updated);
    try {
      localStorage.setItem("grantly_notifications", JSON.stringify(updated));
    } catch (e) {
      console.warn("Storage error", e);
    }
  };

  const handleNotificationClick = (item: NotificationItem) => {
    const updated = notifications.map((n) => (n.id === item.id ? { ...n, read: true } : n));
    setNotifications(updated);
    try {
      localStorage.setItem("grantly_notifications", JSON.stringify(updated));
    } catch (e) {
      console.warn("Storage error", e);
    }
    setNotificationsOpen(false);
    if (item.linkUrl) {
      navigate(item.linkUrl);
    }
  };

  const navigationItems = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Explore Scholarships", href: "/explore", icon: Compass, isHighlighted: true },
    { label: "Applications", href: "/applications", icon: Send },
    { label: "Document Locker", href: "/documents", icon: FileCheck2 },
    { label: "My Profile", href: "/profile", icon: User },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--fg-base)] flex flex-col selection:bg-gold-500/30 selection:text-ivory-50 transition-colors duration-300">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-[var(--bg-surface)]/90 backdrop-blur-xl border-b border-[var(--border-base)] px-4 sm:px-8 py-3 flex items-center justify-between transition-colors">
        {/* Left: Brand & Mobile Toggle */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 rounded-lg bg-black/5 dark:bg-white/5 text-[var(--fg-base)] hover:opacity-80"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              navigate("/");
            }}
            className="flex items-center gap-2 group cursor-pointer"
          >
            <div className="w-7 h-7 rounded-full bg-gold-500/20 flex items-center justify-center text-gold-400 group-hover:bg-gold-500/30 transition-colors">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="font-serif font-bold tracking-widest text-lg text-[var(--fg-base)]">
              GRANTLY
            </span>
            <span className="text-gold-400 font-serif text-base">*</span>
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1.5 ml-6 border-l border-[var(--border-base)] pl-6">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              
              if (item.isHighlighted) {
                return (
                  <button
                    key={item.href}
                    onClick={() => navigate(item.href)}
                    className={`relative flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer shadow-sm ${
                      isActive
                        ? "bg-amber-600 text-white dark:bg-gradient-to-r dark:from-amber-400 dark:to-gold-400 dark:text-charcoal-950 ring-2 ring-amber-600/50 dark:ring-amber-400/70 shadow-[0_0_15px_rgba(245,158,11,0.5)]"
                        : "bg-amber-500/15 dark:bg-amber-500/20 text-amber-900 dark:text-amber-300 border-2 border-amber-600/50 dark:border-amber-400/60 hover:bg-amber-500/25 dark:hover:bg-amber-500/30"
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-700 dark:text-amber-300 animate-pulse" />
                    <span className="text-amber-900 dark:text-amber-200 font-bold">{item.label}</span>
                    <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[9px] font-black uppercase tracking-wider bg-amber-700 text-white dark:bg-amber-400 dark:text-charcoal-950">
                      500+
                    </span>
                  </button>
                );
              }

              return (
                <button
                  key={item.href}
                  onClick={() => navigate(item.href)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? "bg-black/10 dark:bg-white/10 text-[var(--fg-base)] border border-black/15 dark:border-white/20 shadow-sm"
                      : "text-[var(--fg-muted)] hover:text-[var(--fg-base)] hover:bg-black/5 dark:hover:bg-white/5"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right: Theme, Notifications & Profile Pill */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Global Theme Switcher */}
          <ThemeToggle />

          {/* Admin link badge if admin role */}
          {role === "admin" && (
            <button
              onClick={() => navigate("/admin")}
              className="px-3 py-1 rounded-full text-xs font-mono uppercase tracking-wider text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 flex items-center gap-1.5 cursor-pointer hover:bg-emerald-500/25 transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin Console</span>
            </button>
          )}

          {/* Notifications Dropdown Toggle */}
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="relative p-2 rounded-full bg-white/5 hover:bg-white/10 text-ivory-300 hover:text-white transition-colors cursor-pointer"
              aria-label="View notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              )}
            </button>

            {/* Notification Dropdown Popover */}
            {notificationsOpen && (
              <div className="absolute right-0 mt-3 w-80 sm:w-96 rounded-2xl bg-charcoal-900 border border-white/10 shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-ivory-100">Notification Radar</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-gold-500/10 text-gold-400">
                      {unreadCount} Unread
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {unreadCount > 0 && (
                      <button
                        onClick={handleMarkAllRead}
                        className="text-[11px] text-gold-400 hover:text-gold-300 flex items-center gap-1 cursor-pointer"
                      >
                        <CheckCheck className="w-3 h-3" />
                        <span>Mark All Read</span>
                      </button>
                    )}
                    <button
                      onClick={() => setNotificationsOpen(false)}
                      className="text-[11px] text-ivory-400 hover:text-white cursor-pointer ml-1"
                    >
                      Close
                    </button>
                  </div>
                </div>

                <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => handleNotificationClick(n)}
                      className={`p-3 rounded-xl border transition-colors cursor-pointer ${
                        n.read
                          ? "bg-charcoal-950/60 border-white/5 opacity-70"
                          : "bg-charcoal-950 border-gold-500/30 hover:border-gold-500/60"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs font-medium text-ivory-100">{n.title}</h4>
                        <span className="text-[10px] text-ivory-400 font-mono shrink-0">{n.time}</span>
                      </div>
                      <p className="text-[11px] text-ivory-300/80 mt-1 font-light leading-snug">
                        {n.message}
                      </p>
                    </div>
                  ))}

                  {notifications.length === 0 && (
                    <div className="py-6 text-center text-xs text-ivory-400">
                      No notifications right now.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Student Profile Pill */}
          <button
            onClick={() => navigate("/profile")}
            className="flex items-center gap-2.5 pl-2 pr-3 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-colors cursor-pointer"
          >
            <img
              src={user?.avatarUrl || profile.avatarUrl}
              alt={user?.fullName || profile.fullName}
              className="w-6 h-6 rounded-full object-cover border border-gold-500/40"
            />
            <div className="hidden sm:block text-left">
              <div className="text-xs font-semibold text-ivory-100 leading-none">
                {user?.fullName || profile.fullName}
              </div>
              <div className="text-[10px] text-gold-400 font-mono mt-0.5">
                {profile.district}, {profile.state}
              </div>
            </div>
          </button>

          {/* Logout Action */}
          <button
            onClick={() => {
              logout();
              showToast("Signed out of session", "info");
              navigate("/login");
            }}
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-ivory-400 hover:text-white transition-colors cursor-pointer"
            title="Sign out"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[var(--bg-surface)] border-b border-[var(--border-base)] p-4 space-y-2">
          {/* Mobile Theme Toggle */}
          <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-[var(--border-base)] mb-2">
            <span className="text-xs font-mono text-[var(--fg-muted)] uppercase tracking-wider">Appearance</span>
            <ThemeToggle showLabel />
          </div>

          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;

            if (item.isHighlighted) {
              return (
                <button
                  key={item.href}
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate(item.href);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm ${
                    isActive
                      ? "bg-amber-600 text-white dark:bg-gradient-to-r dark:from-amber-400 dark:to-gold-400 dark:text-charcoal-950"
                      : "bg-amber-500/15 dark:bg-amber-500/20 text-amber-900 dark:text-amber-300 border-2 border-amber-600/50 dark:border-amber-400/60"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Sparkles className="w-4 h-4 text-amber-700 dark:text-amber-300" />
                    <span className="text-amber-900 dark:text-amber-200 font-bold">{item.label}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-700 text-white dark:bg-amber-400 dark:text-charcoal-950">
                    500+ Live
                  </span>
                </button>
              );
            }

            return (
              <button
                key={item.href}
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate(item.href);
                }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                  isActive
                    ? "bg-black/10 dark:bg-white/10 text-[var(--fg-base)] border border-black/15 dark:border-white/20"
                    : "text-[var(--fg-muted)] hover:bg-black/5 dark:hover:bg-white/5"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
          {role === "admin" && (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                navigate("/admin");
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-medium text-emerald-600 dark:text-emerald-300 bg-emerald-500/10 border border-emerald-500/20"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Admin Console</span>
            </button>
          )}
        </div>
      )}

      {/* Mandatory Demo Banner with Seeded Student Identity */}
      <div className="bg-[var(--bg-elevated)] border-b border-[var(--border-base)] px-4 sm:px-8 py-2 flex items-center justify-between flex-wrap gap-2 text-xs transition-colors">
        <div className="flex items-center gap-2 text-amber-800 dark:text-gold-300">
          <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600 dark:text-gold-400" />
          <span>
            <strong>ACTIVE STUDENT DEMO SESSION:</strong> Logged in as <strong>{profile.fullName}</strong> ({profile.district}, {profile.state} • {profile.currentCourse} • 8.2 CGPA • ₹2,50,000 Income).
          </span>
        </div>
        <div className="flex items-center gap-3 text-[11px] font-mono text-[var(--fg-muted)]">
          <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>OBC Non-Creamy Validated</span>
          </span>
          <span>•</span>
          <a href="/" className="hover:text-gold-600 dark:hover:text-gold-300 transition-colors">
            Exit to Landing Page
          </a>
        </div>
      </div>

      {/* Main Content View */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 md:px-8 py-8">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
