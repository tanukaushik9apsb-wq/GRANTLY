import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastProvider } from "./components/common/Toast";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute, AdminRoute } from "./components/common/RouteGuards";
import { LandingPage } from "./pages/LandingPage";
import { ExplorePage } from "./pages/ExplorePage";
import { RegisterPage } from "./pages/RegisterPage";
import { LoginPage } from "./pages/LoginPage";
import { DashboardPage } from "./pages/DashboardPage";
import { ApplicationsPage } from "./pages/ApplicationsPage";
import { DocumentsPage } from "./pages/DocumentsPage";
import { ProfilePage } from "./pages/ProfilePage";
import { AdminDashboardPage } from "./pages/AdminDashboardPage";
import { DEMO_SAMPLE_STUDENT } from "./data/demoScholarships";

export function App() {
  const [savedIds, setSavedIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem("grantly_saved_scholarships");
      return stored ? JSON.parse(stored) : DEMO_SAMPLE_STUDENT.savedIds;
    } catch {
      return DEMO_SAMPLE_STUDENT.savedIds;
    }
  });

  // Sync saved bookmarks with localStorage
  useEffect(() => {
    try {
      localStorage.setItem("grantly_saved_scholarships", JSON.stringify(savedIds));
    } catch (e) {
      console.warn("Could not sync to localStorage", e);
    }
  }, [savedIds]);

  const handleToggleBookmark = (id: string) => {
    setSavedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
            {/* Public Landing Page */}
            <Route
              path="/"
              element={
                <LandingPage
                  savedIds={savedIds}
                  onToggleBookmark={handleToggleBookmark}
                />
              }
            />

            {/* Dedicated Scholarship Explorer */}
            <Route
              path="/explore"
              element={
                <ExplorePage
                  savedIds={savedIds}
                  onToggleBookmark={handleToggleBookmark}
                />
              }
            />

            {/* Student Onboarding & Registration */}
            <Route path="/register" element={<RegisterPage />} />

            {/* Student / Admin Authentication */}
            <Route path="/login" element={<LoginPage />} />

            {/* Protected Student Workspace Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/applications"
              element={
                <ProtectedRoute>
                  <ApplicationsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/documents"
              element={
                <ProtectedRoute>
                  <DocumentsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />

            {/* Protected Admin Console Route */}
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminDashboardPage />
                </AdminRoute>
              }
            />

            {/* Fallback to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ToastProvider>
  </ThemeProvider>
  );
}

export default App;
