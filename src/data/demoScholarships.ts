import { Scholarship, StudentProfile } from "../types";

export const DEMO_SCHOLARSHIPS: Scholarship[] = [
  {
    id: "demo-pm-vidya-2026",
    title: "National Merit-cum-Means Academic Grant (Demo)",
    provider: "Ministry of Higher Education (Simulated Central Scheme)",
    type: "Central Government",
    educationLevels: ["Undergraduate", "Postgraduate"],
    applicableCategories: ["General", "OBC", "SC", "ST", "EWS"],
    applicableStates: ["All India"],
    amountINR: 75000,
    frequency: "Annual",
    deadline: "2026-12-15",
    minPercentageOrCGPA: 80,
    maxFamilyIncomeINR: 450000,
    genderRestriction: "All",
    description: "Simulated central scholarship providing financial support for meritorious undergraduate students enrolled in accredited Indian universities.",
    eligibilitySummary: "Class 12 / Degree score ≥ 80% or 8.0 CGPA, Annual Family Income ≤ ₹4,50,000, Indian Citizen.",
    documentsRequired: [
      "Class 10 & 12 Board Marksheets",
      "Tehsildar Certified Income Certificate (Current FY)",
      "College Bonafide Certificate",
      "Aadhaar-seeded Single Holder Bank Passbook"
    ],
    officialPortalUrl: "https://scholarships.gov.in",
    isDemoRecord: true,
    featured: true,
    applicationCountDemo: 1420
  },
  {
    id: "demo-up-dashmesh-postmatric-2026",
    title: "Uttar Pradesh Post-Matric Fee Reimbursement Scheme (Demo)",
    provider: "Backward Classes Welfare Dept, Govt. of UP (Simulated UP Portal)",
    type: "State Government",
    educationLevels: ["Undergraduate", "Postgraduate", "Diploma"],
    applicableCategories: ["OBC", "SC", "ST", "General", "EWS"],
    applicableStates: ["Uttar Pradesh"],
    amountINR: 52000,
    frequency: "Annual",
    deadline: "2026-11-28",
    minPercentageOrCGPA: 60,
    maxFamilyIncomeINR: 250000,
    genderRestriction: "All",
    description: "Demonstration Uttar Pradesh state freeship reimbursing non-refundable college tuition and exam fees for UP domicile students.",
    eligibilitySummary: "UP Domicile mandatory, Annual Family Income ≤ ₹2,50,000 (OBC/SC/ST/General), enrolled in recognized UP collegiate program.",
    documentsRequired: [
      "UP Niwas Praman Patra (Domicile Proof)",
      "Aay Praman Patra (Tehsildar Income Certificate with barcode)",
      "Jati Praman Patra (OBC / SC / ST Certificate)",
      "College Admission Slip & Current Year Fee Receipt"
    ],
    officialPortalUrl: "https://scholarship.up.gov.in",
    isDemoRecord: true,
    featured: true,
    applicationCountDemo: 3890
  },
  {
    id: "demo-reliance-foundation-ug-2026",
    title: "Reliance Foundation Undergraduate Excellence Fellowship (Demo)",
    provider: "Reliance Foundation (Simulated CSR Initiative)",
    type: "Corporate / CSR",
    educationLevels: ["Undergraduate"],
    applicableCategories: ["General", "OBC", "SC", "ST", "EWS"],
    applicableStates: ["All India"],
    amountINR: 200000,
    frequency: "Per Degree",
    deadline: "2026-12-05",
    minPercentageOrCGPA: 75,
    maxFamilyIncomeINR: 1500000,
    genderRestriction: "All",
    description: "Simulated private sector scholarship targeting first and second year undergraduate students demonstrating leadership, academic distinction, and community service.",
    eligibilitySummary: "Regular UG student in India, Class 12 or current CGPA ≥ 7.5, household income ≤ ₹15 LPA.",
    documentsRequired: [
      "Previous Semester Grade Card",
      "Parental Income Proof / Form 16 / ITR",
      "Statement of Purpose (500 words)",
      "Passport Size Photograph"
    ],
    officialPortalUrl: "https://www.reliancefoundation.org",
    isDemoRecord: true,
    featured: true,
    applicationCountDemo: 4200
  },
  {
    id: "demo-infosys-stem-star-2026",
    title: "Infosys Foundation Young Scientist CS Discovery Award (Demo)",
    provider: "Infosys Foundation (Simulated CSR Trust)",
    type: "Corporate / CSR",
    educationLevels: ["Undergraduate", "Postgraduate"],
    applicableCategories: ["General", "OBC", "SC", "ST", "EWS"],
    applicableStates: ["All India"],
    amountINR: 100000,
    frequency: "Annual",
    deadline: "2026-12-10",
    minPercentageOrCGPA: 75,
    maxFamilyIncomeINR: 500000,
    genderRestriction: "All",
    description: "Simulated industry award supporting students pursuing Computer Science, Data Science, and Electronics engineering across Indian institutes.",
    eligibilitySummary: "B.Tech/BE in CS/IT/AI with CGPA ≥ 7.5 (or 75%), annual family income ≤ ₹5.0 LPA.",
    documentsRequired: [
      "Engineering College Identity Card",
      "Latest Semester Grade Sheets",
      "Tehsildar / Competent Authority Income Certificate",
      "Faculty Recommendation"
    ],
    officialPortalUrl: "https://www.infosys.org",
    isDemoRecord: true,
    featured: false,
    applicationCountDemo: 1750
  },
  {
    id: "demo-apex-tech-ug-2026",
    title: "National Technical Institute Merit Assistance Grant (Demo)",
    provider: "Apex Educational Trust (Simulated Institutional Fund)",
    type: "Institutional Trust",
    educationLevels: ["Undergraduate"],
    applicableCategories: ["General", "OBC", "SC", "ST", "EWS"],
    applicableStates: ["All India"],
    amountINR: 80000,
    frequency: "Annual",
    deadline: "2026-12-22",
    minPercentageOrCGPA: 70,
    maxFamilyIncomeINR: 500000,
    genderRestriction: "All",
    description: "Simulated institutional aid covering college laboratory fees, hostel subsidies, and textbook grants for engineering students.",
    eligibilitySummary: "Undergraduate engineering student with minimum 7.0 CGPA, family income under ₹5 Lakhs.",
    documentsRequired: [
      "College Bonafide Letter",
      "Parent Income Affidavit",
      "Semester Grade Transcripts",
      "Bank Account Details"
    ],
    officialPortalUrl: "https://education.gov.in",
    isDemoRecord: true,
    featured: false,
    applicationCountDemo: 920
  },
  {
    id: "demo-up-pratibha-excellence-2026",
    title: "Uttar Pradesh Pratibha Technical Merit Award (Demo)",
    provider: "Dept. of Technical Education, Govt. of UP (Simulated)",
    type: "State Government",
    educationLevels: ["Undergraduate", "Diploma"],
    applicableCategories: ["OBC", "SC", "ST", "EWS", "General"],
    applicableStates: ["Uttar Pradesh"],
    amountINR: 45000,
    frequency: "Annual",
    deadline: "2027-01-10",
    minPercentageOrCGPA: 75,
    maxFamilyIncomeINR: 300000,
    genderRestriction: "All",
    description: "Demonstration state incentive supporting meritorious students pursuing engineering and polytechnic diplomas in Uttar Pradesh colleges.",
    eligibilitySummary: "UP Domicile, minimum 75% or 7.5 CGPA in engineering coursework, income ≤ ₹3,00,000.",
    documentsRequired: [
      "UP Domicile Certificate",
      "Current Academic Transcripts",
      "Income Certificate signed by SDM/Tehsildar",
      "College Fee Structure Breakdown"
    ],
    officialPortalUrl: "https://scholarship.up.gov.in",
    isDemoRecord: true,
    featured: false,
    applicationCountDemo: 1350
  },
  {
    id: "demo-central-cs-fellowship-2026",
    title: "Central Sector Digital India Computing Scholarship (Demo)",
    provider: "Ministry of Electronics & IT (Simulated Central Trust)",
    type: "Central Government",
    educationLevels: ["Undergraduate", "Postgraduate"],
    applicableCategories: ["General", "OBC", "SC", "ST", "EWS"],
    applicableStates: ["All India"],
    amountINR: 65000,
    frequency: "Annual",
    deadline: "2027-01-20",
    minPercentageOrCGPA: 75,
    maxFamilyIncomeINR: 600000,
    genderRestriction: "All",
    description: "Demonstration computing fellowship promoting digital skills among tier-2 and tier-3 city students in tech universities.",
    eligibilitySummary: "Enrolled in computer science or computational degrees, minimum 7.5 CGPA, family income ≤ ₹6.0 LPA.",
    documentsRequired: [
      "Enrollment Verification Form",
      "Income Certificate",
      "Aadhaar Card",
      "Bank Mandate Form"
    ],
    officialPortalUrl: "https://meity.gov.in",
    isDemoRecord: true,
    featured: false,
    applicationCountDemo: 1100
  },
  {
    id: "demo-national-means-merit-2026",
    title: "National Academic Support Fellowship for Backward Classes (Demo)",
    provider: "National Backward Classes Finance & Dev Corp (Simulated)",
    type: "Central Government",
    educationLevels: ["Undergraduate", "Postgraduate"],
    applicableCategories: ["OBC", "EWS"],
    applicableStates: ["All India"],
    amountINR: 40000,
    frequency: "Annual",
    deadline: "2026-12-30",
    minPercentageOrCGPA: 60,
    maxFamilyIncomeINR: 350000,
    genderRestriction: "All",
    description: "Demonstration central grant assisting non-creamy layer OBC and EWS collegiate scholars with textbook and maintenance stipends.",
    eligibilitySummary: "OBC Non-Creamy Layer / EWS student, family income ≤ ₹3,50,000, minimum 60% marks.",
    documentsRequired: [
      "Central / State OBC Non-Creamy Layer Certificate",
      "Tehsildar Income Certificate",
      "College Admission Slip",
      "Marksheet of Qualifying Exam"
    ],
    officialPortalUrl: "https://socialjustice.gov.in",
    isDemoRecord: true,
    featured: false,
    applicationCountDemo: 2200
  },
  // Schemes that do NOT match Aarav (e.g. Female-only, other states, PwD-only)
  {
    id: "demo-kalpana-stem-2026",
    title: "Kalpana Chawla Memorial Fellowship for Women in STEM (Demo)",
    provider: "Tata Trust Educational Foundation (Simulated CSR)",
    type: "Corporate / CSR",
    educationLevels: ["Undergraduate", "Postgraduate", "PhD"],
    applicableCategories: ["Women", "General", "OBC", "SC", "ST", "EWS"],
    applicableStates: ["All India"],
    amountINR: 120000,
    frequency: "Annual",
    deadline: "2026-11-30",
    minPercentageOrCGPA: 75,
    maxFamilyIncomeINR: 600000,
    genderRestriction: "Female",
    description: "Simulated CSR fellowship empowering female engineers and researchers pursuing STEM disciplines in India.",
    eligibilitySummary: "Female students enrolled in B.Tech/M.Sc/PhD STEM disciplines, minimum 75% marks, income under ₹6L.",
    documentsRequired: [
      "Semester Grade Sheets",
      "STEM Department Bonafide Letter",
      "Family Income Proof"
    ],
    officialPortalUrl: "https://www.tatatrusts.org",
    isDemoRecord: true,
    featured: true,
    applicationCountDemo: 980
  },
  {
    id: "demo-maha-dbt-postmatric-2026",
    title: "Rajarshi Shahu Maharaj Higher Education Support (Demo)",
    provider: "Government of Maharashtra (Simulated MahaDBT)",
    type: "State Government",
    educationLevels: ["Diploma", "Undergraduate", "Postgraduate"],
    applicableCategories: ["OBC", "SC", "ST", "EWS"],
    applicableStates: ["Maharashtra"],
    amountINR: 60000,
    frequency: "Annual",
    deadline: "2026-12-31",
    minPercentageOrCGPA: 60,
    maxFamilyIncomeINR: 800000,
    genderRestriction: "All",
    description: "Demonstration state freeship for Maharashtra domicile students enrolled in professional degree colleges.",
    eligibilitySummary: "Maharashtra Domicile certificate mandatory, valid Caste & Non-Creamy Layer / EWS certificate.",
    documentsRequired: [
      "Maharashtra Domicile Certificate",
      "Caste Validity Certificate",
      "Income Certificate"
    ],
    officialPortalUrl: "https://mahadbt.maharashtra.gov.in",
    isDemoRecord: true,
    featured: true,
    applicationCountDemo: 3120
  },
  {
    id: "demo-karnataka-ssp-postmatric-2026",
    title: "Karnataka State Post-Matric Vidyasiri Aid (Demo)",
    provider: "Social Welfare Department, Govt. of Karnataka (Simulated SSP)",
    type: "State Government",
    educationLevels: ["Class 12", "Diploma", "Undergraduate"],
    applicableCategories: ["SC", "ST", "OBC", "Minority"],
    applicableStates: ["Karnataka"],
    amountINR: 48000,
    frequency: "Annual",
    deadline: "2026-12-20",
    minPercentageOrCGPA: 65,
    maxFamilyIncomeINR: 250000,
    genderRestriction: "All",
    description: "Demonstration hostel and fee support allowance for rural students in Karnataka institutions.",
    eligibilitySummary: "Karnataka Domicile, Family income under ₹2.5 Lakhs, state admission quota.",
    documentsRequired: [
      "RD Number for Caste/Income",
      "Karnataka Domicile Certificate",
      "College ID"
    ],
    officialPortalUrl: "https://ssp.postmatric.karnataka.gov.in",
    isDemoRecord: true,
    featured: false,
    applicationCountDemo: 1850
  },
  {
    id: "demo-wb-svmcm-2026",
    title: "Swami Vivekananda Merit-cum-Means Grant (Demo)",
    provider: "Higher Education Dept, Govt. of West Bengal (Simulated SVMCM)",
    type: "State Government",
    educationLevels: ["Undergraduate", "Postgraduate"],
    applicableCategories: ["General", "OBC", "SC", "ST", "Minority"],
    applicableStates: ["West Bengal"],
    amountINR: 30000,
    frequency: "Annual",
    deadline: "2027-01-31",
    minPercentageOrCGPA: 60,
    maxFamilyIncomeINR: 250000,
    genderRestriction: "All",
    description: "Demonstration West Bengal state assistance covering tuition assistance for regular students.",
    eligibilitySummary: "West Bengal Domicile, minimum 60% marks, annual household income ≤ ₹2.5 Lakhs.",
    documentsRequired: [
      "Madhyamik & HS Marksheet",
      "West Bengal Domicile Proof",
      "Income Certificate"
    ],
    officialPortalUrl: "https://svmcm.wbhed.gov.in",
    isDemoRecord: true,
    featured: false,
    applicationCountDemo: 3600
  },
  {
    id: "demo-samarth-pwd-grant-2026",
    title: "Divyangjan Samarth Higher Education Empowerment Grant (Demo)",
    provider: "Department of Empowerment of PwD (Simulated Central Trust)",
    type: "Central Government",
    educationLevels: ["Diploma", "Undergraduate", "Postgraduate", "PhD"],
    applicableCategories: ["PwD"],
    applicableStates: ["All India"],
    amountINR: 90000,
    frequency: "Annual",
    deadline: "2027-01-15",
    minPercentageOrCGPA: 50,
    maxFamilyIncomeINR: 600000,
    genderRestriction: "All",
    description: "Demonstration grant supporting students with benchmark disabilities with assistive allowances.",
    eligibilitySummary: "Valid UDID card or Disability certificate (minimum 40%), enrolled in government recognized program.",
    documentsRequired: [
      "UDID Card / Disability Certificate",
      "Proof of College Enrolment",
      "Income Certificate"
    ],
    officialPortalUrl: "https://disabilityaffairs.gov.in",
    isDemoRecord: true,
    featured: false,
    applicationCountDemo: 480
  }
];

export interface DashboardMetricSummary {
  matchingCount: number;
  savedCount: number;
  submittedCount: number;
  upcomingDeadlinesCount: number;
  applicationStatusBreakdown: {
    applied: number;
    preparingDocuments: number;
    underReview: number;
    approved: number;
  };
}

export const DEMO_SAMPLE_STUDENT: {
  profile: StudentProfile;
  metrics: DashboardMetricSummary;
  savedIds: string[];
  applications: {
    id: string;
    scholarshipId: string;
    status: "applied" | "preparing_documents" | "under_review" | "approved";
    updatedAt: string;
    portalReferenceId: string;
    notes: string;
    stageLabel: string;
  }[];
  documents: {
    id: string;
    name: string;
    category: "Marksheet" | "Income Certificate" | "Caste Certificate" | "Domicile Certificate" | "Bonafide Certificate" | "Bank Passbook" | "Identity Proof";
    uploadedAt: string;
    verifiedDemo: boolean;
    fileSize: string;
    issueDate?: string;
    validityState: "Valid" | "Under Review" | "Expiring Soon";
  }[];
  notifications: {
    id: string;
    title: string;
    message: string;
    time: string;
    read: boolean;
    type: "deadline" | "status" | "match";
    linkUrl?: string;
  }[];
} = {
  profile: {
    fullName: "Aarav Sharma",
    email: "aarav.demo@grantly.in",
    phone: "+91 98765 43210",
    state: "Uttar Pradesh",
    district: "Lucknow",
    educationLevel: "Undergraduate",
    currentCourse: "B.Tech Computer Science",
    academicYear: "2nd Year",
    percentageOrCGPA: 8.2, // 8.2 CGPA
    familyIncomeINR: 250000, // ₹2,50,000
    category: "OBC",
    gender: "Male",
    isPwD: false,
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250"
  },
  metrics: {
    matchingCount: 8,
    savedCount: 4,
    submittedCount: 2,
    upcomingDeadlinesCount: 3,
    applicationStatusBreakdown: {
      applied: 2,
      preparingDocuments: 1,
      underReview: 1,
      approved: 0,
    }
  },
  // Exactly 4 saved scholarships as required
  savedIds: [
    "demo-pm-vidya-2026",
    "demo-up-dashmesh-postmatric-2026",
    "demo-reliance-foundation-ug-2026",
    "demo-infosys-stem-star-2026"
  ],
  // Exactly 4 pipeline applications matching breakdown: Applied: 2, Preparing Documents: 1, Under Review: 1, Approved: 0
  applications: [
    {
      id: "app-201",
      scholarshipId: "demo-pm-vidya-2026",
      status: "applied",
      updatedAt: "2026-11-04T10:30:00Z",
      portalReferenceId: "NSP-2026-UP-881923",
      notes: "Application form submitted on National Scholarship Portal; acknowledged by district nodal cell.",
      stageLabel: "Applied"
    },
    {
      id: "app-202",
      scholarshipId: "demo-reliance-foundation-ug-2026",
      status: "applied",
      updatedAt: "2026-11-05T16:20:00Z",
      portalReferenceId: "RF-UG-2026-4412",
      notes: "CSR application submitted with Statement of Purpose and first-year transcripts.",
      stageLabel: "Applied"
    },
    {
      id: "app-203",
      scholarshipId: "demo-infosys-stem-star-2026",
      status: "preparing_documents",
      updatedAt: "2026-11-06T11:15:00Z",
      portalReferenceId: "INFY-DRAFT-091",
      notes: "Gathering HOD recommendation letter and updated revenue income certificate.",
      stageLabel: "Preparing Documents"
    },
    {
      id: "app-204",
      scholarshipId: "demo-up-dashmesh-postmatric-2026",
      status: "under_review",
      updatedAt: "2026-11-02T14:45:00Z",
      portalReferenceId: "UP-SCH-2026-77219",
      notes: "Under review at Lucknow District Social Welfare Officer desk for tuition fee reimbursement.",
      stageLabel: "Under Review"
    }
  ],
  documents: [
    {
      id: "doc-1",
      name: "Class 12th Board Marksheet (UP / CBSE)",
      category: "Marksheet",
      uploadedAt: "2026-10-15",
      verifiedDemo: true,
      fileSize: "1.4 MB",
      issueDate: "2024-06-10",
      validityState: "Valid"
    },
    {
      id: "doc-2",
      name: "Tehsildar Income Certificate (₹2,50,000 / Lucknow)",
      category: "Income Certificate",
      uploadedAt: "2026-10-18",
      verifiedDemo: true,
      fileSize: "840 KB",
      issueDate: "2026-05-12",
      validityState: "Valid"
    },
    {
      id: "doc-3",
      name: "Uttar Pradesh Niwas Praman Patra (Domicile)",
      category: "Domicile Certificate",
      uploadedAt: "2026-10-20",
      verifiedDemo: true,
      fileSize: "620 KB",
      issueDate: "2023-08-22",
      validityState: "Valid"
    },
    {
      id: "doc-4",
      name: "B.Tech CS College Bonafide Certificate (Lucknow)",
      category: "Bonafide Certificate",
      uploadedAt: "2026-11-01",
      verifiedDemo: true,
      fileSize: "950 KB",
      issueDate: "2026-09-01",
      validityState: "Valid"
    },
    {
      id: "doc-5",
      name: "OBC Non-Creamy Layer Certificate",
      category: "Caste Certificate",
      uploadedAt: "2026-10-22",
      verifiedDemo: true,
      fileSize: "710 KB",
      issueDate: "2025-07-15",
      validityState: "Valid"
    },
    {
      id: "doc-6",
      name: "Aadhaar Linked Bank Passbook (SBI Lucknow)",
      category: "Bank Passbook",
      uploadedAt: "2026-10-16",
      verifiedDemo: true,
      fileSize: "1.1 MB",
      issueDate: "2024-01-10",
      validityState: "Valid"
    }
  ],
  notifications: [
    {
      id: "notif-1",
      title: "UP Post-Matric Verification Closing Soon",
      message: "The simulated deadline for UP Post-Matric Fee Reimbursement Scheme is approaching on 28 Nov 2026.",
      time: "2 hours ago",
      read: false,
      type: "deadline",
      linkUrl: "/applications"
    },
    {
      id: "notif-2",
      title: "Application Under Review",
      message: "Your application for UP Post-Matric Scheme (Ref: UP-SCH-2026-77219) has moved to District Nodal Officer review.",
      time: "1 day ago",
      read: false,
      type: "status",
      linkUrl: "/applications"
    },
    {
      id: "notif-3",
      title: "New Matching Scheme Alert",
      message: "Central Sector Digital India Computing Scholarship matches your 2nd Year B.Tech CS profile.",
      time: "3 days ago",
      read: true,
      type: "match",
      linkUrl: "/explore"
    }
  ]
};
