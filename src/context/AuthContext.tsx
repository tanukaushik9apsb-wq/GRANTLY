import React, { createContext, useContext, useState, useEffect } from "react";
import { AuthUser, StudentProfile, UserRole } from "../types";
import { DEMO_SAMPLE_STUDENT } from "../data/demoScholarships";
import { isSupabaseConfigured, supabase } from "../lib/supabase";

export const DEMO_ADMIN_USER: AuthUser = {
  id: "admin-ananya-verma-01",
  email: "admin.verma@grantly.in",
  role: "admin",
  fullName: "Dr. Ananya Verma",
  avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
};

export const DEMO_STUDENT_USER: AuthUser = {
  id: "student-aarav-sharma-01",
  email: DEMO_SAMPLE_STUDENT.profile.email,
  role: "student",
  fullName: DEMO_SAMPLE_STUDENT.profile.fullName,
  avatarUrl: DEMO_SAMPLE_STUDENT.profile.avatarUrl,
};

interface AuthContextType {
  user: AuthUser | null;
  studentProfile: StudentProfile;
  role: UserRole;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, pass: string, role?: UserRole) => Promise<boolean>;
  register: (
    email: string,
    pass: string,
    role: UserRole,
    profileData?: Partial<StudentProfile>
  ) => Promise<boolean>;
  quickLogin: (role: UserRole) => void;
  logout: () => void;
  updateStudentProfile: (updates: Partial<StudentProfile>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = "grantly_auth_session";
const PROFILE_STORAGE_KEY = "grantly_student_profile";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      return stored ? JSON.parse(stored) : DEMO_STUDENT_USER; // Default to Aarav Sharma demo session
    } catch {
      return DEMO_STUDENT_USER;
    }
  });

  const [studentProfile, setStudentProfile] = useState<StudentProfile>(() => {
    try {
      const stored = localStorage.getItem(PROFILE_STORAGE_KEY);
      return stored ? JSON.parse(stored) : DEMO_SAMPLE_STUDENT.profile;
    } catch {
      return DEMO_SAMPLE_STUDENT.profile;
    }
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Sync session and profile to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(studentProfile));
  }, [studentProfile]);

  // Supabase Auth listener if enabled
  useEffect(() => {
    if (!isSupabaseConfigured()) return;

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          const userMeta = session.user.user_metadata || {};
          const detectedRole: UserRole = userMeta.role === "admin" ? "admin" : "student";
          setUser({
            id: session.user.id,
            email: session.user.email || "",
            role: detectedRole,
            fullName: userMeta.full_name || session.user.email?.split("@")[0] || "Student User",
            avatarUrl: userMeta.avatar_url,
          });
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, _pass: string, roleHint?: UserRole): Promise<boolean> => {
    setIsLoading(true);

    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password: _pass,
        });
        if (!error && data.user) {
          const metaRole = data.user.user_metadata?.role as UserRole;
          setUser({
            id: data.user.id,
            email: data.user.email || email,
            role: metaRole || roleHint || "student",
            fullName: data.user.user_metadata?.full_name || email.split("@")[0],
          });
          setIsLoading(false);
          return true;
        }
      } catch (e) {
        console.warn("Supabase login fallback to local", e);
      }
    }

    // Local / Demo Login resolution
    if (email.toLowerCase().includes("admin") || roleHint === "admin") {
      setUser(DEMO_ADMIN_USER);
    } else {
      setUser({
        ...DEMO_STUDENT_USER,
        email: email || DEMO_STUDENT_USER.email,
        fullName: email.split("@")[0] || DEMO_STUDENT_USER.fullName,
      });
    }

    setIsLoading(false);
    return true;
  };

  const register = async (
    email: string,
    pass: string,
    role: UserRole,
    profileData?: Partial<StudentProfile>
  ): Promise<boolean> => {
    setIsLoading(true);

    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password: pass,
          options: {
            data: {
              full_name: profileData?.fullName || email.split("@")[0],
              role,
            },
          },
        });
        if (!error && data.user) {
          setUser({
            id: data.user.id,
            email,
            role,
            fullName: profileData?.fullName || email.split("@")[0],
          });
          if (profileData) {
            setStudentProfile((prev) => ({ ...prev, ...profileData, email }));
          }
          setIsLoading(false);
          return true;
        }
      } catch (e) {
        console.warn("Supabase sign up error", e);
      }
    }

    // Demo / Offline register
    const newUser: AuthUser = {
      id: `usr_${Date.now().toString(36)}`,
      email,
      role,
      fullName: profileData?.fullName || email.split("@")[0],
    };
    setUser(newUser);

    if (profileData) {
      setStudentProfile((prev) => ({
        ...prev,
        ...profileData,
        email,
      }));
    }

    setIsLoading(false);
    return true;
  };

  const quickLogin = (role: UserRole) => {
    if (role === "admin") {
      setUser(DEMO_ADMIN_USER);
    } else {
      setUser(DEMO_STUDENT_USER);
    }
  };

  const logout = () => {
    if (isSupabaseConfigured()) {
      supabase.auth.signOut().catch(console.warn);
    }
    setUser(null);
  };

  const updateStudentProfile = (updates: Partial<StudentProfile>) => {
    setStudentProfile((prev) => ({ ...prev, ...updates }));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        studentProfile,
        role: user?.role || "student",
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        quickLogin,
        logout,
        updateStudentProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
