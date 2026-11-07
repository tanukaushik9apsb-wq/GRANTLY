import React from "react";
import { Sparkles, ExternalLink, ShieldCheck } from "lucide-react";

interface LandingFooterProps {
  onExploreClick?: () => void;
  onEligibilityClick?: () => void;
  onLaunchDemoStudent?: () => void;
}

export const LandingFooter: React.FC<LandingFooterProps> = ({
  onExploreClick,
  onEligibilityClick,
  onLaunchDemoStudent,
}) => {
  const officialPortals = [
    { name: "National Scholarship Portal (NSP)", url: "https://scholarships.gov.in" },
    { name: "MahaDBT (Maharashtra)", url: "https://mahadbt.maharashtra.gov.in" },
    { name: "State Scholarship Portal (Karnataka SSP)", url: "https://ssp.postmatric.karnataka.gov.in" },
    { name: "UP Scholarship Portal", url: "https://scholarship.up.gov.in" },
    { name: "SVMCM Portal (West Bengal)", url: "https://svmcm.wbhed.gov.in" },
    { name: "AICTE Pragati & Saksham", url: "https://www.aicte-india.org" },
  ];

  return (
    <footer className="mt-20 border-t border-white/10 bg-charcoal-950/90 pt-16 pb-12 px-4 sm:px-6 md:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          {/* Brand Col */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-gold-500/20 flex items-center justify-center text-gold-400">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-serif text-2xl font-bold tracking-widest text-ivory-100">
                GRANTLY
              </span>
              <span className="text-gold-400 font-serif text-xl">*</span>
            </div>

            <p className="text-xs sm:text-sm text-ivory-300/80 font-light leading-relaxed max-w-md">
              A unified, editorial-grade scholarship discovery and management ecosystem engineered specifically for higher education students across Indian states.
            </p>

            <div className="pt-2 flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider text-gold-400 bg-gold-500/10 border border-gold-500/20">
                Demo Platform Edition 2026-27
              </span>
            </div>
          </div>

          {/* Quick Nav */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-gold-400">
              Platform Modules
            </h4>
            <ul className="space-y-2 text-xs text-ivory-300">
              <li>
                <button
                  onClick={onExploreClick}
                  className="hover:text-gold-300 transition-colors cursor-pointer"
                >
                  Scholarship Explorer
                </button>
              </li>
              <li>
                <button
                  onClick={onEligibilityClick}
                  className="hover:text-gold-300 transition-colors cursor-pointer"
                >
                  Eligibility Calculation Engine
                </button>
              </li>
              <li>
                <a href="#features" className="hover:text-gold-300 transition-colors">
                  Digital Document Locker
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-gold-300 transition-colors">
                  Cutoff & Deadline Radar
                </a>
              </li>
              <li>
                <button
                  onClick={onLaunchDemoStudent}
                  className="text-gold-400 hover:text-gold-300 transition-colors font-medium cursor-pointer"
                >
                  Preview Student Demo Profile
                </button>
              </li>
              <li>
                <a
                  href="/admin"
                  className="text-emerald-400/90 hover:text-emerald-300 transition-colors font-mono text-[11px] flex items-center gap-1"
                >
                  <ShieldCheck className="w-3 h-3" />
                  <span>Admin Verification Console</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Official Indian Portals Direct Links */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-gold-400">
              Verified Government Portals
            </h4>
            <ul className="space-y-2 text-xs text-ivory-300/90 font-light">
              {officialPortals.map((portal) => (
                <li key={portal.name}>
                  <a
                    href={portal.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 hover:text-gold-300 transition-colors group"
                  >
                    <span>{portal.name}</span>
                    <ExternalLink className="w-3 h-3 text-ivory-400 group-hover:text-gold-400 transition-colors" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Disclaimer & Copyright */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-ivory-400 font-light">
          <div className="text-center md:text-left">
            <p>
              © 2026 GRANTLY. Designed for students across India. All scholarship listings presented in this preview are simulated <strong>DEMO DATA</strong> for educational evaluation.
            </p>
            <p className="mt-1 text-ivory-400/60 text-[10px]">
              Visual hero adapted from PrismaHero by Rahil Vahora (@rahil1202) on 21st.dev.
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1 text-ivory-400">
              <ShieldCheck className="w-3.5 h-3.5 text-gold-400" />
              <span>Local-First Demo Privacy</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;
