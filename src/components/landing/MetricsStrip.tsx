import React from "react";
import { Award, Building2, MapPin, Sparkles, AlertTriangle } from "lucide-react";

export const MetricsStrip: React.FC = () => {
  const metrics = [
    {
      value: "₹450+ Cr",
      label: "Simulated Funding Pool",
      sublabel: "Across Central & State schemes",
      icon: Award,
    },
    {
      value: "500+",
      label: "Categorized Schemes",
      sublabel: "NSP, State Portals & CSR",
      icon: Building2,
    },
    {
      value: "28 States & 8 UTs",
      label: "Nationwide Scope",
      sublabel: "Domicile-specific matching",
      icon: MapPin,
    },
    {
      value: "100% Free",
      label: "For Indian Students",
      sublabel: "No hidden application fees",
      icon: Sparkles,
    },
  ];

  return (
    <section className="relative z-10 -mt-2 sm:-mt-4 px-4 sm:px-6 md:px-10 max-w-7xl mx-auto">
      {/* Notice Banner */}
      <div className="mb-4 rounded-xl bg-gold-500/10 border border-gold-500/30 px-4 py-2.5 flex items-center justify-between flex-wrap gap-2 text-xs">
        <div className="flex items-center gap-2 text-gold-300">
          <AlertTriangle className="w-4 h-4 shrink-0 text-gold-400" />
          <span>
            <strong>DEMO SIMULATION ENVIRONMENT:</strong> All scholarship listings, award numbers, and deadlines are realistic demonstration records for platform evaluation.
          </span>
        </div>
        <span className="font-mono text-[10px] uppercase tracking-wider text-gold-400/80 bg-gold-500/20 px-2 py-0.5 rounded">
          Demo Mode Active
        </span>
      </div>

      {/* Metrics Card Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        {metrics.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={index}
              className="editorial-glass rounded-2xl p-4 sm:p-6 transition-all duration-300 hover:border-gold-500/30 hover:translate-y-[-2px] group"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-mono uppercase tracking-wider text-ivory-400">
                  Metric 0{index + 1}
                </span>
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gold-400 group-hover:bg-gold-500/20 transition-colors">
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="font-serif text-2xl sm:text-3xl md:text-4xl font-semibold text-ivory-100 tracking-tight group-hover:text-gold-300 transition-colors">
                {item.value}
              </div>
              <div className="text-xs sm:text-sm font-medium text-ivory-200 mt-1">
                {item.label}
              </div>
              <div className="text-[11px] text-ivory-400/80 mt-0.5 font-light">
                {item.sublabel}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default MetricsStrip;
