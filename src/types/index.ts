export type EducationLevel =
  | "Class 10"
  | "Class 12"
  | "Diploma"
  | "Undergraduate"
  | "Postgraduate"
  | "PhD";

export type SocialCategory =
  | "General"
  | "OBC"
  | "SC"
  | "ST"
  | "EWS"
  | "Minority"
  | "Women"
  | "PwD";

export type ScholarshipType =
  | "Central Government"
  | "State Government"
  | "Corporate / CSR"
  | "Institutional Trust";

export type ApplicationStage =
  | "preparing_documents"
  | "applied"
  | "under_review"
  | "approved"
  | "disbursed"
  | "rejected";

export type UserRole = "student" | "admin";

export type VerificationStatus = "verified" | "pending_verification" | "unverified";

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
  fullName: string;
  avatarUrl?: string;
}

export interface Scholarship {
  id: string;
  title: string;
  provider: string;
  type: ScholarshipType;
  educationLevels: EducationLevel[];
  applicableCategories: SocialCategory[];
  applicableStates: string[]; // ['All India'] or specific states
  amountINR: number;
  frequency: "Annual" | "One-time" | "Monthly" | "Per Degree";
  deadline: string; // ISO date string e.g. 2026-12-15
  minPercentageOrCGPA?: number; // e.g. 75 or 7.5
  maxFamilyIncomeINR?: number; // e.g. 250000 (2.5 Lakhs)
  genderRestriction?: "All" | "Female" | "Transgender";
  description: string;
  eligibilitySummary: string;
  documentsRequired: string[];
  officialPortalUrl?: string;
  sourceUrl?: string;
  verificationStatus?: VerificationStatus;
  verifiedAt?: string;
  verifiedBy?: string;
  isDemoRecord: boolean; // Flag to separate demo records from real verified records
  featured?: boolean;
  applicationCountDemo?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface StudentProfile {
  fullName: string;
  email: string;
  phone: string;
  state: string;
  district: string;
  educationLevel: EducationLevel;
  currentCourse: string;
  academicYear: string;
  percentageOrCGPA: number;
  familyIncomeINR: number;
  category: SocialCategory;
  gender: "Male" | "Female" | "Other";
  isPwD: boolean;
  avatarUrl?: string;
}

export interface ApplicationTrackerItem {
  id: string;
  scholarshipId: string;
  status: ApplicationStage;
  updatedAt: string;
  portalReferenceId: string;
  notes: string;
  stageLabel: string;
}

export interface StudentDocument {
  id: string;
  name: string;
  category:
    | "Marksheet"
    | "Income Certificate"
    | "Caste Certificate"
    | "Domicile Certificate"
    | "Bonafide Certificate"
    | "Bank Passbook"
    | "Identity Proof";
  uploadedAt: string;
  verifiedDemo: boolean;
  fileSize: string;
  issueDate?: string;
  validityState: "Valid" | "Under Review" | "Expiring Soon";
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: "deadline" | "status" | "match";
  linkUrl?: string;
}

export interface CriterionExplanation {
  criterion: string;
  satisfied: boolean;
  studentValue: string;
  schemeRequirement: string;
  reason: string;
}
