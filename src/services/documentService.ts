import { StudentDocument } from "../types";
import { DEMO_SAMPLE_STUDENT } from "../data/demoScholarships";
import { isSupabaseConfigured, supabase } from "../lib/supabase";

const STORAGE_PREFIX = "grantly_docs_";

export class DocumentService {
  /**
   * Fetch documents strictly isolated to the student ID (Row-Level Security compliance)
   */
  static async getStudentDocuments(studentId: string): Promise<StudentDocument[]> {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from("documents")
          .select("*")
          .eq("student_id", studentId)
          .order("uploaded_at", { ascending: false });
        if (!error && data) {
          return data as unknown as StudentDocument[];
        }
      } catch (err) {
        console.warn("Supabase fetch documents failed, falling back to local vault", err);
      }
    }

    const key = `${STORAGE_PREFIX}${studentId}`;
    try {
      const stored = localStorage.getItem(key);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn("Error reading local documents", e);
    }

    // Default to seeded demo documents for Aarav Sharma or initial demo student
    const defaultDocs = DEMO_SAMPLE_STUDENT.documents;
    this.saveToLocal(studentId, defaultDocs);
    return defaultDocs;
  }

  /**
   * Add a new document to the student's vault
   */
  static async uploadDocument(
    studentId: string,
    docData: Omit<StudentDocument, "id" | "uploadedAt" | "verifiedDemo">
  ): Promise<StudentDocument[]> {
    const docs = await this.getStudentDocuments(studentId);

    const newDoc: StudentDocument = {
      ...docData,
      id: `doc_${Date.now().toString(36)}_${Math.random().toString(36).substr(2, 4)}`,
      uploadedAt: new Date().toISOString(),
      verifiedDemo: true,
    };

    const updated = [newDoc, ...docs];

    if (isSupabaseConfigured()) {
      try {
        await supabase.from("documents").insert([
          {
            ...newDoc,
            student_id: studentId,
          },
        ]);
      } catch (e) {
        console.warn("Supabase document upload failed", e);
      }
    }

    this.saveToLocal(studentId, updated);
    return updated;
  }

  /**
   * Delete a document from the student's vault
   */
  static async deleteDocument(studentId: string, docId: string): Promise<StudentDocument[]> {
    const docs = await this.getStudentDocuments(studentId);
    const updated = docs.filter((d) => d.id !== docId);

    if (isSupabaseConfigured()) {
      try {
        await supabase
          .from("documents")
          .delete()
          .eq("id", docId)
          .eq("student_id", studentId);
      } catch (e) {
        console.warn("Supabase document delete failed", e);
      }
    }

    this.saveToLocal(studentId, updated);
    return updated;
  }

  private static saveToLocal(studentId: string, docs: StudentDocument[]) {
    try {
      localStorage.setItem(`${STORAGE_PREFIX}${studentId}`, JSON.stringify(docs));
    } catch (e) {
      console.warn("Failed saving docs locally", e);
    }
  }
}
