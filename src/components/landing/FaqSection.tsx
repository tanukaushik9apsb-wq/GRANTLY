import React, { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

export const FaqSection: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: "Can an Indian student apply for both Central (NSP) and State scholarships simultaneously?",
      a: "Under Ministry of Education guidelines, a student generally cannot receive two government maintenance allowances for the exact same academic expense simultaneously. However, you can often apply for tuition freeships under a state portal while receiving competitive merit-based private CSR grants (like Tata or Reliance). GRANTLY's eligibility engine highlights scheme compatibility flags so you never risk disqualification.",
    },
    {
      q: "What documents serve as legal proof of family income for Indian scholarships?",
      a: "Most central and state schemes require an Income Certificate issued by a competent revenue authority—typically the Sub-Divisional Magistrate (SDM), Tehsildar, or Revenue Officer—issued within the current financial year. Salaried parents can also submit Form 16 or Income Tax Returns (ITR), while affidavits are accepted as interim proof by specific private trusts.",
    },
    {
      q: "What is the difference between National Scholarship Portal (NSP) and State Portals?",
      a: "NSP (scholarships.gov.in) hosts Central Sector schemes, UGC/AICTE initiatives, and minority/tribal welfare grants funded by the Government of India. State portals (such as MahaDBT in Maharashtra, SSP in Karnataka, UP Scholarship, and SVMCM in West Bengal) manage state-specific post-matric, freeship, and hostel subsidies. GRANTLY aggregates both categories into a unified timeline.",
    },
    {
      q: "Are the scholarships shown on this platform real government schemes?",
      a: "This demonstration environment contains realistic simulated schemes explicitly marked as DEMO DATA for software demonstration, feature evaluation, and architectural validation. We do not claim external applications have been submitted on official portals; students are directed to official government links (e.g. scholarships.gov.in) to make real submissions.",
    },
    {
      q: "How does the digital document locker protect sensitive student paperwork?",
      a: "GRANTLY is engineered with local-first security principles. In demonstration mode, metadata is securely managed client-side in localStorage; no real identity numbers or sensitive certificates are permanently persisted to unauthorized servers.",
    },
  ];

  return (
    <section id="faq" className="py-16 sm:py-24 px-4 sm:px-6 md:px-10 max-w-4xl mx-auto">
      <div className="text-center mb-14">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono uppercase tracking-wider text-gold-400 bg-gold-500/10 border border-gold-500/20 mb-3">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Frequently Asked Questions</span>
        </div>
        <h2 className="font-serif text-3xl sm:text-4xl text-ivory-100 font-medium tracking-tight">
          Clear Answers for Indian Applicants
        </h2>
        <p className="text-xs sm:text-sm text-ivory-300/80 mt-2 font-light">
          Key guidelines on criteria, reservation quotas, income limits, and application processes.
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={idx}
              className={`rounded-2xl transition-all duration-300 border ${
                isOpen
                  ? "editorial-glass border-gold-500/40 bg-charcoal-900/90"
                  : "bg-charcoal-950/60 border-white/5 hover:border-white/20"
              }`}
            >
              <button
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer"
                aria-expanded={isOpen}
              >
                <span className="font-serif text-sm sm:text-base font-semibold text-ivory-100">
                  {faq.q}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-gold-400 shrink-0 transition-transform duration-300 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-5 pb-5 sm:px-6 sm:pb-6 text-xs sm:text-sm text-ivory-300/90 font-light leading-relaxed border-t border-white/5 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default FaqSection;
