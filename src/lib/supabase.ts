import { createClient } from "@supabase/supabase-js";

// Supabase Environment variables
const metaEnv = (import.meta as any).env || {};
const supabaseUrl = metaEnv.VITE_SUPABASE_URL || "";
const supabaseAnonKey = metaEnv.VITE_SUPABASE_ANON_KEY || "";

export const isSupabaseConfigured = (): boolean => {
  return (
    typeof supabaseUrl === "string" &&
    supabaseUrl.trim().length > 0 &&
    !supabaseUrl.includes("placeholder") &&
    typeof supabaseAnonKey === "string" &&
    supabaseAnonKey.trim().length > 0 &&
    !supabaseAnonKey.includes("placeholder")
  );
};

// Initialize real client if keys are present, or a safe stub for demo offline mode
export const supabase = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : createClient(
      "https://grantly-offline-demo.supabase.co",
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy_anon_key_for_offline_demo_session",
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      }
    );

export interface BackendStatus {
  isConfigured: boolean;
  provider: "Supabase (Live)" | "Local Demo Adapter (Active)";
  database: "PostgreSQL with RLS" | "Browser Sandbox with RLS Simulation";
  authProvider: "Supabase GoTrue" | "GRANTLY RBAC Session Manager";
  storage: "Supabase Private S3" | "Client Document Locker";
}

export function getBackendStatus(): BackendStatus {
  const configured = isSupabaseConfigured();
  return {
    isConfigured: configured,
    provider: configured ? "Supabase (Live)" : "Local Demo Adapter (Active)",
    database: configured
      ? "PostgreSQL with RLS"
      : "Browser Sandbox with RLS Simulation",
    authProvider: configured
      ? "Supabase GoTrue"
      : "GRANTLY RBAC Session Manager",
    storage: configured
      ? "Supabase Private S3"
      : "Client Document Locker",
  };
}
