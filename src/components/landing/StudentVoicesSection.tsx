import React from "react";
import { Quote, Sparkles } from "lucide-react";

export const StudentVoicesSection: React.FC = () => {
  const testimonials = [
    {
      name: "Pooja Deshmukh",
      course: "B.Tech in Artificial Intelligence",
      institution: "Government College of Engineering, Pune",
      state: "Maharashtra",
      quote:
        "Navigating MahaDBT and central NSP at the same time used to be confusing with conflicting income guidelines. GRANTLY's eligibility checklist clearly showed which scheme I could claim without double-dipping violations.",
      award: "₹60,000 / year (Demo)",
    },
    {
      name: "Syed Rehan Ali",
      course: "M.Sc in Applied Mathematics",
      institution: "Aligarh Muslim University",
      state: "Uttar Pradesh",
      quote:
        "The document locker prevented me from missing the Tehsildar verification cutoff date. Having all certificate numbers and renewal reminders organized saved my entire academic semester fees.",
      award: "₹75,000 / year (Demo)",
    },
    {
      name: "Kavitha Sundaram",
      course: "BE in Mechanical Engineering",
      institution: "Anna University, Chennai",
      state: "Tamil Nadu",
      quote:
        "As a first-generation girl student in engineering, knowing about private CSR grants alongside the state incentives allowed me to fund my laptop and hostel accommodation with zero debt.",
      award: "₹1,20,000 / year (Demo)",
    },
  ];

  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 md:px-10 max-w-7xl mx-auto">
      <div className="text-center max-w-2xl mx-auto mb-14">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono uppercase tracking-wider text-gold-400 bg-gold-500/10 border border-gold-500/20 mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Student Narratives</span>
        </div>
        <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-ivory-100 font-medium tracking-tight">
          Empowering Indian Scholars
        </h2>
        <p className="text-xs sm:text-sm text-ivory-300/80 mt-3 font-light">
          Real stories reflecting how structured guidance transforms higher education accessibility across Indian towns and cities.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((t, idx) => (
          <div
            key={idx}
            className="editorial-glass rounded-3xl p-6 sm:p-8 border border-white/10 flex flex-col justify-between relative group hover:border-gold-500/30 transition-all duration-300"
          >
            <div>
              <Quote className="w-8 h-8 text-gold-500/30 mb-4 group-hover:text-gold-400 transition-colors" />
              <p className="text-xs sm:text-sm text-ivory-200/90 font-light leading-relaxed italic">
                &ldquo;{t.quote}&rdquo;
              </p>
            </div>

            <div className="mt-8 pt-4 border-t border-white/5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif font-semibold text-ivory-100 text-sm">
                    {t.name}
                  </h3>
                  <p className="text-[11px] text-ivory-400 mt-0.5">
                    {t.course}
                  </p>
                  <p className="text-[10px] text-gold-400/80 font-mono mt-0.5">
                    {t.institution} • {t.state}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-ivory-400 block">
                    Aid Unlocked
                  </span>
                  <span className="font-mono text-xs font-bold text-gold-300">
                    {t.award}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default StudentVoicesSection;
