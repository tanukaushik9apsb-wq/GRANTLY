import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CinematicIntro } from "../components/common/CinematicIntro";
import { GrantlyHero } from "../components/hero/GrantlyHero";
import { MetricsStrip } from "../components/landing/MetricsStrip";
import { QuickEligibilityWidget } from "../components/landing/QuickEligibilityWidget";
import { ScholarshipExplorerSection } from "../components/landing/ScholarshipExplorerSection";
import { FeatureSection } from "../components/landing/FeatureSection";
import { HowItWorksSection } from "../components/landing/HowItWorksSection";
import { StudentVoicesSection } from "../components/landing/StudentVoicesSection";
import { FaqSection } from "../components/landing/FaqSection";
import { LandingFooter } from "../components/landing/LandingFooter";
import { ScholarshipDetailModal } from "../components/landing/ScholarshipDetailModal";
import { DemoStudentPreviewModal } from "../components/landing/DemoStudentPreviewModal";
import { Scholarship } from "../types";

interface LandingPageProps {
  savedIds: string[];
  onToggleBookmark: (id: string) => void;
}

export function LandingPage({ savedIds, onToggleBookmark }: LandingPageProps) {
  const navigate = useNavigate();
  const [selectedScholarship, setSelectedScholarship] = useState<Scholarship | null>(null);
  const [isDemoStudentOpen, setIsDemoStudentOpen] = useState(false);

  // Initial visit intro animation gate: only show once per session
  const [showIntro, setShowIntro] = useState(() => {
    try {
      return sessionStorage.getItem("grantly_intro_shown") !== "true";
    } catch {
      return false;
    }
  });

  const handleNavigate = (target: string) => {
    if (target.startsWith("#")) {
      const el = document.getElementById(target.substring(1));
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      navigate(target);
    }
  };

  return (
    <>
      {showIntro && (
        <CinematicIntro onComplete={() => setShowIntro(false)} />
      )}

      <motion.div
        initial={{ opacity: showIntro ? 0 : 1, y: showIntro ? 16 : 0 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        className="min-h-screen bg-[var(--bg-base)] text-[var(--fg-base)] flex flex-col selection:bg-gold-500/30 selection:text-ivory-50 transition-colors duration-300"
      >
        {/* 1. Hero Section (Adapted from 21st.dev PrismaHero) */}
        <GrantlyHero
          onExploreClick={() => navigate("/explore")}
          onGetStartedClick={() => navigate("/register")}
          onSignInClick={() => navigate("/login")}
          onNavigate={handleNavigate}
        />

      {/* 2. Key Metrics & Disclaimer Strip */}
      <MetricsStrip />

      {/* 3. Interactive Quick Eligibility Calculation Engine */}
      <QuickEligibilityWidget onSelectScholarship={setSelectedScholarship} />

      {/* 4. Unified Scholarship Explorer with Search & Category Filters */}
      <ScholarshipExplorerSection
        onSelectScholarship={setSelectedScholarship}
        savedIds={savedIds}
        onToggleBookmark={onToggleBookmark}
      />

      {/* 5. Core Platform Features */}
      <FeatureSection />

      {/* 6. How It Works (3-Step Roadmap) */}
      <HowItWorksSection onGetStartedClick={() => navigate("/register")} />

      {/* 7. Inspiring Indian Student Voices */}
      <StudentVoicesSection />

      {/* 8. Frequently Asked Questions */}
      <FaqSection />

      {/* 9. Editorial Footer with Official Portals Directory */}
      <LandingFooter
        onExploreClick={() => navigate("/explore")}
        onEligibilityClick={() => handleNavigate("#eligibility")}
        onLaunchDemoStudent={() => setIsDemoStudentOpen(true)}
      />

      {/* Detail Preview Modal */}
      <ScholarshipDetailModal
        scholarship={selectedScholarship}
        onClose={() => setSelectedScholarship(null)}
        isBookmarked={selectedScholarship ? savedIds.includes(selectedScholarship.id) : false}
        onToggleBookmark={onToggleBookmark}
      />

      {/* Seeded Student Demo Profile Drawer */}
      <DemoStudentPreviewModal
        isOpen={isDemoStudentOpen}
        onClose={() => setIsDemoStudentOpen(false)}
        savedIds={savedIds}
      />
    </motion.div>
    </>
  );
}

export default LandingPage;
