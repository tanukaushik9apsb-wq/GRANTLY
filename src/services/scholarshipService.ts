import { Scholarship, VerificationStatus } from "../types";
import { DEMO_SCHOLARSHIPS } from "../data/demoScholarships";
import { isSupabaseConfigured, supabase } from "../lib/supabase";

const STORAGE_KEY = "grantly_scholarships_db";

// Official Real Scholarships (Pre-seeded with official verified government portal references)
export const OFFICIAL_REAL_SCHOLARSHIPS: Scholarship[] = [
  {
    id: "nsp-csss-central-2026",
    title: "Central Sector Scheme of Scholarship for College and University Students (CSSS)",
    provider: "Department of Higher Education, Ministry of Education, Govt. of India",
    type: "Central Government",
    educationLevels: ["Undergraduate", "Postgraduate"],
    applicableCategories: ["General", "OBC", "SC", "ST", "EWS"],
    applicableStates: ["All India"],
    amountINR: 20000,
    frequency: "Annual",
    deadline: "2026-12-31",
    minPercentageOrCGPA: 80,
    maxFamilyIncomeINR: 450000,
    genderRestriction: "All",
    description: "Centrally funded financial assistance awarded by Ministry of Education to meritorious students from low-income families pursuing higher education in regular recognized colleges.",
    eligibilitySummary: "Above 80th percentile in Class 12 relevant stream board exams, family annual income ≤ ₹4.5 Lakhs, not receiving any other scholarship/stipend.",
    documentsRequired: [
      "Class 12 Passing Marksheet with Roll Number",
      "Revenue Authority Income Certificate",
      "Aadhaar Number (or Aadhaar Enrolment Slip)",
      "Institutional Bonafide Certificate"
    ],
    officialPortalUrl: "https://scholarships.gov.in",
    sourceUrl: "https://www.education.gov.in/scholarships-education-loan-0",
    verificationStatus: "verified",
    isDemoRecord: false,
    featured: true,
    applicationCountDemo: 12500,
    createdAt: "2026-01-10T10:00:00Z",
    verifiedAt: "2026-02-01T12:00:00Z",
    verifiedBy: "Dr. Ananya Verma (Chief Verification Officer)"
  },
  {
    id: "aicte-pragati-women-2026",
    title: "AICTE Pragati Scholarship Scheme for Girl Students",
    provider: "All India Council for Technical Education (AICTE)",
    type: "Central Government",
    educationLevels: ["Undergraduate", "Diploma"],
    applicableCategories: ["General", "OBC", "SC", "ST", "EWS"],
    applicableStates: ["All India"],
    amountINR: 50000,
    frequency: "Annual",
    deadline: "2026-11-30",
    minPercentageOrCGPA: 60,
    maxFamilyIncomeINR: 800000,
    genderRestriction: "Female",
    description: "Govt. of India scheme implemented by AICTE aimed at providing assistance for advancement of girls pursuing technical education (Degree & Diploma level).",
    eligibilitySummary: "Female candidates admitted to 1st year Degree/Diploma course in an AICTE approved institution, max 2 girls per family, family annual income ≤ ₹8 Lakhs.",
    documentsRequired: [
      "Class 10 and 12 / ITI Marksheet",
      "State Competent Authority Income Certificate",
      "AICTE College Admission Proof & Tuitions Receipt",
      "Director/Principal Declaration Certificate"
    ],
    officialPortalUrl: "https://www.aicte-india.org/schemes/students-development-schemes/Pragati",
    sourceUrl: "https://scholarships.gov.in",
    verificationStatus: "verified",
    isDemoRecord: false,
    featured: true,
    applicationCountDemo: 8400,
    createdAt: "2026-01-12T10:00:00Z",
    verifiedAt: "2026-02-05T15:30:00Z",
    verifiedBy: "Dr. Ananya Verma (Chief Verification Officer)"
  }
];

// Combine demo + real initial seeds
function getInitialScholarships(): Scholarship[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn("Error reading local scholarships cache", err);
  }
  // Initialize with both Demo and Real Verified schemes
  const initial = [...DEMO_SCHOLARSHIPS, ...OFFICIAL_REAL_SCHOLARSHIPS];
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
  } catch (e) {
    console.warn("Could not seed local storage", e);
  }
  return initial;
}

export class ScholarshipService {
  private static localData: Scholarship[] = getInitialScholarships();

  /**
   * Fetch all scholarships (Admins can view both verified and unverified, demo and real)
   */
  static async getAllScholarships(): Promise<Scholarship[]> {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from("scholarships")
          .select("*")
          .order("deadline", { ascending: true });
        if (!error && data && data.length > 0) {
          return data as unknown as Scholarship[];
        }
      } catch (err) {
        console.warn("Supabase query failed, falling back to local adapter", err);
      }
    }
    return [...this.localData];
  }

  /**
   * Fetch scholarships visible to students/public (verified schemes + labeled demo records)
   */
  static async getPublicScholarships(): Promise<Scholarship[]> {
    const all = await this.getAllScholarships();
    return all.filter((s) => s.isDemoRecord || s.verificationStatus === "verified");
  }

  /**
   * Fetch single scholarship by ID
   */
  static async getScholarshipById(id: string): Promise<Scholarship | null> {
    const all = await this.getAllScholarships();
    return all.find((s) => s.id === id) || null;
  }

  /**
   * Admin: Create a new scholarship (Defaults to real scheme, pending or verified)
   */
  static async createScholarship(
    payload: Omit<Scholarship, "id"> & { id?: string }
  ): Promise<Scholarship> {
    const newScholarship: Scholarship = {
      ...payload,
      id: payload.id || `sch_${Date.now().toString(36)}_${Math.random().toString(36).substr(2, 5)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      verificationStatus: payload.verificationStatus || "pending_verification",
      isDemoRecord: payload.isDemoRecord ?? false
    };

    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from("scholarships")
          .insert([newScholarship])
          .select()
          .single();
        if (!error && data) {
          this.localData.unshift(data as unknown as Scholarship);
          this.syncLocal();
          return data as unknown as Scholarship;
        }
      } catch (err) {
        console.warn("Supabase insert failed, persisting to local store", err);
      }
    }

    this.localData.unshift(newScholarship);
    this.syncLocal();
    return newScholarship;
  }

  /**
   * Admin: Update scholarship details
   */
  static async updateScholarship(
    id: string,
    updates: Partial<Scholarship>
  ): Promise<Scholarship | null> {
    const index = this.localData.findIndex((s) => s.id === id);
    if (index === -1) return null;

    const updated: Scholarship = {
      ...this.localData[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from("scholarships")
          .update(updated)
          .eq("id", id)
          .select()
          .single();
        if (!error && data) {
          this.localData[index] = data as unknown as Scholarship;
          this.syncLocal();
          return this.localData[index];
        }
      } catch (err) {
        console.warn("Supabase update failed, updating local store", err);
      }
    }

    this.localData[index] = updated;
    this.syncLocal();
    return updated;
  }

  /**
   * Admin: Toggle Verification status
   */
  static async toggleVerificationStatus(
    id: string,
    newStatus: VerificationStatus,
    adminName: string = "Dr. Ananya Verma"
  ): Promise<Scholarship | null> {
    return this.updateScholarship(id, {
      verificationStatus: newStatus,
      verifiedBy: newStatus === "verified" ? adminName : undefined,
      verifiedAt: newStatus === "verified" ? new Date().toISOString() : undefined
    });
  }

  /**
   * Admin: Delete scholarship
   */
  static async deleteScholarship(id: string): Promise<boolean> {
    if (isSupabaseConfigured()) {
      try {
        const { error } = await supabase.from("scholarships").delete().eq("id", id);
        if (error) {
          console.warn("Supabase delete error", error);
        }
      } catch (err) {
        console.warn("Supabase delete failed", err);
      }
    }

    const initialLen = this.localData.length;
    this.localData = this.localData.filter((s) => s.id !== id);
    this.syncLocal();
    return this.localData.length < initialLen;
  }

  private static syncLocal() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.localData));
    } catch (e) {
      console.warn("Failed to sync scholarships to localStorage", e);
    }
  }
}
