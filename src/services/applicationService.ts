import { ApplicationTrackerItem, ApplicationStage } from "../types";
import { DEMO_SAMPLE_STUDENT } from "../data/demoScholarships";
import { isSupabaseConfigured, supabase } from "../lib/supabase";

const STORAGE_PREFIX = "grantly_apps_";

export class ApplicationService {
  /**
   * Fetch applications for a specific student ID (Enforces per-student tenant isolation)
   */
  static async getStudentApplications(studentId: string): Promise<ApplicationTrackerItem[]> {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from("applications")
          .select("*")
          .eq("student_id", studentId)
          .order("updated_at", { ascending: false });
        if (!error && data) {
          return data as unknown as ApplicationTrackerItem[];
        }
      } catch (err) {
        console.warn("Supabase fetch applications failed, using local", err);
      }
    }

    const key = `${STORAGE_PREFIX}${studentId}`;
    try {
      const stored = localStorage.getItem(key);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn("Error reading local applications", e);
    }

    // Default to seeded demo applications if Aarav Sharma or new student demo session
    const defaultApps = DEMO_SAMPLE_STUDENT.applications;
    this.saveToLocal(studentId, defaultApps);
    return defaultApps;
  }

  /**
   * Update stage status of an application
   */
  static async updateStatus(
    studentId: string,
    appId: string,
    newStatus: ApplicationStage,
    notes?: string
  ): Promise<ApplicationTrackerItem[]> {
    const apps = await this.getStudentApplications(studentId);
    const updated = apps.map((app) => {
      if (app.id === appId) {
        const stageLabels: Record<ApplicationStage, string> = {
          preparing_documents: "Preparing Documents",
          applied: "Applied (Tracked Internally)",
          under_review: "Under Portal Review",
          approved: "Approved & Disbursed",
          disbursed: "Disbursed to Bank Account",
          rejected: "Rejected / Ineligible",
        };
        return {
          ...app,
          status: newStatus,
          stageLabel: stageLabels[newStatus] || newStatus,
          notes: notes !== undefined ? notes : app.notes,
          updatedAt: new Date().toISOString(),
        };
      }
      return app;
    });

    if (isSupabaseConfigured()) {
      try {
        await supabase
          .from("applications")
          .update({
            status: newStatus,
            notes,
            updated_at: new Date().toISOString(),
          })
          .eq("id", appId)
          .eq("student_id", studentId);
      } catch (e) {
        console.warn("Supabase app update failed", e);
      }
    }

    this.saveToLocal(studentId, updated);
    return updated;
  }

  /**
   * Track a new scholarship application
   */
  static async addApplication(
    studentId: string,
    scholarshipId: string,
    initialStatus: ApplicationStage = "preparing_documents",
    portalRef: string = ""
  ): Promise<ApplicationTrackerItem[]> {
    const apps = await this.getStudentApplications(studentId);
    const existing = apps.find((a) => a.scholarshipId === scholarshipId);
    if (existing) return apps;

    const stageLabels: Record<ApplicationStage, string> = {
      preparing_documents: "Preparing Documents",
      applied: "Applied (Tracked Internally)",
      under_review: "Under Portal Review",
      approved: "Approved & Disbursed",
      disbursed: "Disbursed to Bank Account",
      rejected: "Rejected / Ineligible",
    };

    const newApp: ApplicationTrackerItem = {
      id: `app_${Date.now().toString(36)}_${Math.random().toString(36).substr(2, 4)}`,
      scholarshipId,
      status: initialStatus,
      updatedAt: new Date().toISOString(),
      portalReferenceId: portalRef || `GRANTLY/${new Date().getFullYear()}/${Math.floor(10000 + Math.random() * 90000)}`,
      notes: "Internal application tracked in GRANTLY. Official submission must be performed on the scholarship portal.",
      stageLabel: stageLabels[initialStatus] || "Preparing Documents",
    };

    const updated = [newApp, ...apps];

    if (isSupabaseConfigured()) {
      try {
        await supabase.from("applications").insert([
          {
            ...newApp,
            student_id: studentId,
          },
        ]);
      } catch (e) {
        console.warn("Supabase app insert failed", e);
      }
    }

    this.saveToLocal(studentId, updated);
    return updated;
  }

  /**
   * Delete / Remove tracked application
   */
  static async removeApplication(studentId: string, appId: string): Promise<ApplicationTrackerItem[]> {
    const apps = await this.getStudentApplications(studentId);
    const updated = apps.filter((a) => a.id !== appId);

    if (isSupabaseConfigured()) {
      try {
        await supabase
          .from("applications")
          .delete()
          .eq("id", appId)
          .eq("student_id", studentId);
      } catch (e) {
        console.warn("Supabase app delete failed", e);
      }
    }

    this.saveToLocal(studentId, updated);
    return updated;
  }

  private static saveToLocal(studentId: string, apps: ApplicationTrackerItem[]) {
    try {
      localStorage.setItem(`${STORAGE_PREFIX}${studentId}`, JSON.stringify(apps));
    } catch (e) {
      console.warn("Failed saving apps locally", e);
    }
  }
}
