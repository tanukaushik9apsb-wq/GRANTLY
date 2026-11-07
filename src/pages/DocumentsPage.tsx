import React, { useState } from "react";
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  ShieldCheck,
  Trash2,
  Eye,
  Lock,
  X,
  Download,
} from "lucide-react";
import { DashboardLayout } from "../components/layout/DashboardLayout";
import { DEMO_SAMPLE_STUDENT } from "../data/demoScholarships";
import { useToast } from "../components/common/Toast";

export function DocumentsPage() {
  const { showToast } = useToast();

  const [documents, setDocuments] = useState(() => {
    try {
      const stored = localStorage.getItem("grantly_documents");
      return stored ? JSON.parse(stored) : DEMO_SAMPLE_STUDENT.documents;
    } catch {
      return DEMO_SAMPLE_STUDENT.documents;
    }
  });

  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [isUploading, setIsUploading] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<any | null>(null);

  // New Document Mock Form
  const [newDocName, setNewDocName] = useState("");
  const [newDocCategory, setNewDocCategory] = useState<string>("Marksheet");

  const categories = [
    "All",
    "Marksheet",
    "Income Certificate",
    "Domicile Certificate",
    "Bonafide Certificate",
    "Caste Certificate",
    "Bank Passbook",
  ];

  const filteredDocs = documents.filter((doc: any) => {
    if (selectedCategory === "All") return true;
    return doc.category === selectedCategory;
  });

  const handleSimulateUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocName.trim()) return;

    setIsUploading(true);
    setTimeout(() => {
      const newDoc = {
        id: `doc-${Date.now()}`,
        name: newDocName,
        category: newDocCategory,
        uploadedAt: new Date().toISOString().split("T")[0],
        verifiedDemo: true,
        fileSize: "1.2 MB",
        issueDate: "2026-10-01",
        validityState: "Valid",
      };

      const updated = [newDoc, ...documents];
      setDocuments(updated);
      try {
        localStorage.setItem("grantly_documents", JSON.stringify(updated));
      } catch (err) {
        console.warn("Storage error", err);
      }

      setIsUploading(false);
      setNewDocName("");
      showToast("Document Verified & Saved", `${newDoc.name} is ready for portal applications.`, "success");
    }, 700);
  };

  const handleDeleteDoc = (id: string, name: string) => {
    const updated = documents.filter((d: any) => d.id !== id);
    setDocuments(updated);
    try {
      localStorage.setItem("grantly_documents", JSON.stringify(updated));
    } catch (err) {
      console.warn("Storage error", err);
    }
    showToast("Document Removed", name, "info");
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-emerald-400 mb-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Digital Verification Vault</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-ivory-100">
              Document Locker
            </h1>
            <p className="text-xs sm:text-sm text-ivory-300/80 mt-1 font-light">
              Securely organize verified marksheets, Tehsildar income proofs, and UP domicile certificates.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{documents.length} Documents Organized</span>
            </span>
          </div>
        </div>

        {/* Privacy & Compliance Assurance */}
        <div className="rounded-2xl bg-charcoal-900 border border-white/10 p-4 flex items-center justify-between flex-wrap gap-3 text-xs">
          <div className="flex items-center gap-2.5 text-ivory-300">
            <Lock className="w-4 h-4 text-gold-400 shrink-0" />
            <span>
              <strong>Local-First Client Sandbox:</strong> Uploaded document previews are stored locally in client cache for simulation. Real Aadhaar numbers and financial files are never permanently transmitted.
            </span>
          </div>
          <span className="text-[10px] font-mono text-gold-400/90 uppercase tracking-wider bg-gold-500/10 px-2 py-0.5 rounded">
            Client-Side Encrypted
          </span>
        </div>

        {/* Upload Simulation Card */}
        <div className="editorial-glass rounded-3xl p-6 sm:p-8 border border-white/10 shadow-xl">
          <h2 className="font-serif text-lg sm:text-xl font-semibold text-ivory-100 mb-2 flex items-center gap-2">
            <UploadCloud className="w-5 h-5 text-gold-400" />
            <span>Simulate Document Upload</span>
          </h2>
          <p className="text-xs text-ivory-300/80 mb-6 font-light">
            Add a mock PDF/JPG scan (e.g. Latest Semester Grade Card, Renewal Income Proof) to simulate automated verification.
          </p>

          <form onSubmit={handleSimulateUpload} className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end">
            <div className="sm:col-span-5">
              <label className="block text-xs font-medium text-ivory-300 mb-1.5">
                Document Name / Description
              </label>
              <input
                type="text"
                required
                placeholder="e.g. B.Tech Semester 3 Grade Sheet"
                value={newDocName}
                onChange={(e) => setNewDocName(e.target.value)}
                className="w-full bg-charcoal-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-ivory-100 focus:outline-none focus:border-gold-500/50"
              />
            </div>

            <div className="sm:col-span-4">
              <label className="block text-xs font-medium text-ivory-300 mb-1.5">
                Category
              </label>
              <select
                value={newDocCategory}
                onChange={(e) => setNewDocCategory(e.target.value)}
                className="w-full bg-charcoal-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-ivory-100 focus:outline-none focus:border-gold-500/50 cursor-pointer"
              >
                {categories.filter((c) => c !== "All").map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-3">
              <button
                type="submit"
                disabled={isUploading}
                className="w-full py-2.5 px-4 rounded-xl bg-ivory-100 hover:bg-white text-charcoal-950 font-semibold text-xs sm:text-sm transition-all shadow-md cursor-pointer disabled:opacity-50"
              >
                {isUploading ? "Simulating Scan..." : "+ Add to Vault"}
              </button>
            </div>
          </form>
        </div>

        {/* Category Pills Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs px-3.5 py-1.5 rounded-full border transition-all shrink-0 cursor-pointer ${
                selectedCategory === cat
                  ? "bg-gold-500/20 border-gold-500/60 text-gold-300 font-medium"
                  : "bg-charcoal-900 border-white/5 text-ivory-400 hover:text-ivory-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Documents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredDocs.map((doc: any) => (
            <div
              key={doc.id}
              className="editorial-glass rounded-2xl p-5 border border-white/10 hover:border-gold-500/30 transition-all flex flex-col justify-between group shadow-lg"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-mono text-gold-400 bg-gold-500/10 border border-gold-500/20">
                    {doc.category}
                  </span>

                  <span className="px-2 py-0.5 rounded text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Verified</span>
                  </span>
                </div>

                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-white/5 text-gold-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-semibold text-ivory-100 line-clamp-1">
                      {doc.name}
                    </h3>
                    <p className="text-[10px] text-ivory-400 font-mono mt-0.5">
                      File Size: {doc.fileSize}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-white/5 space-y-1 text-[11px] text-ivory-400 font-mono">
                  <div className="flex justify-between">
                    <span>Uploaded:</span>
                    <span className="text-ivory-200">{doc.uploadedAt}</span>
                  </div>
                  {doc.issueDate && (
                    <div className="flex justify-between">
                      <span>Issue Date:</span>
                      <span className="text-ivory-200">{doc.issueDate}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                <button
                  onClick={() => setPreviewDoc(doc)}
                  className="inline-flex items-center gap-1 text-gold-400 hover:text-gold-300 font-medium cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Preview</span>
                </button>

                <button
                  onClick={() => handleDeleteDoc(doc.id, doc.name)}
                  className="p-1 rounded text-rose-400/80 hover:text-rose-300 transition-colors cursor-pointer"
                  title="Remove Document"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Simulated Document Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-lg rounded-3xl bg-charcoal-900 border border-white/10 shadow-2xl p-6 sm:p-8">
            <div className="flex items-start justify-between pb-4 border-b border-white/10 mb-6">
              <div>
                <span className="px-2.5 py-0.5 rounded text-[10px] font-mono text-gold-400 bg-gold-500/10 border border-gold-500/20">
                  {previewDoc.category}
                </span>
                <h3 className="font-serif text-lg font-bold text-ivory-100 mt-2">
                  {previewDoc.name}
                </h3>
              </div>
              <button
                onClick={() => setPreviewDoc(null)}
                className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-ivory-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Simulated Document Sheet Preview */}
            <div className="p-8 rounded-2xl bg-charcoal-950 border border-white/10 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-gold-500/10 text-gold-400 mx-auto flex items-center justify-center">
                <FileText className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-ivory-100">Government Verification Pass</h4>
                <p className="text-xs text-ivory-400 mt-1">
                  Document ID: <strong>{previewDoc.id}</strong> • Issue Date: {previewDoc.issueDate || "2026-05-12"}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Digitally signed & verified by Revenue Competent Authority (Lucknow)</span>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between">
              <span className="text-xs font-mono text-ivory-400">Size: {previewDoc.fileSize}</span>
              <button
                onClick={() => {
                  showToast("Download Simulation", "Simulated PDF document download initiated.", "info");
                  setPreviewDoc(null);
                }}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-ivory-100 hover:bg-white text-charcoal-950 text-xs font-semibold"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Scan</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

export default DocumentsPage;
