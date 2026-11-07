-- ==============================================================================
-- GRANTLY: Unified Indian Scholarship Discovery & Management Platform
-- Production PostgreSQL Database Schema & Row Level Security (RLS) Policies
-- Designed for Supabase (PostgreSQL 15+)
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUMS
CREATE TYPE user_role AS ENUM ('student', 'admin');
CREATE TYPE verification_status AS ENUM ('verified', 'pending_verification', 'unverified');
CREATE TYPE scholarship_type AS ENUM (
  'Central Government',
  'State Government',
  'Corporate / CSR',
  'Institutional Trust'
);
CREATE TYPE application_stage AS ENUM (
  'preparing_documents',
  'applied',
  'under_review',
  'approved',
  'disbursed',
  'rejected'
);
CREATE TYPE document_category AS ENUM (
  'Marksheet',
  'Income Certificate',
  'Caste Certificate',
  'Domicile Certificate',
  'Bonafide Certificate',
  'Bank Passbook',
  'Identity Proof'
);

-- ==============================================================================
-- 3. PROFILES TABLE (Linked to auth.users)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role NOT NULL DEFAULT 'student',
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  state TEXT NOT NULL DEFAULT 'Uttar Pradesh',
  district TEXT NOT NULL DEFAULT 'Lucknow',
  education_level TEXT NOT NULL DEFAULT 'Undergraduate',
  current_course TEXT NOT NULL DEFAULT 'B.Tech Computer Science',
  academic_year TEXT NOT NULL DEFAULT '2nd Year',
  percentage_or_cgpa NUMERIC(4, 2) NOT NULL DEFAULT 8.20,
  family_income_inr BIGINT NOT NULL DEFAULT 250000,
  category TEXT NOT NULL DEFAULT 'OBC',
  gender TEXT NOT NULL DEFAULT 'Male',
  is_pwd BOOLEAN NOT NULL DEFAULT false,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- 4. SCHOLARSHIPS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.scholarships (
  id TEXT PRIMARY KEY DEFAULT ('sch_' || substr(md5(random()::text), 1, 12)),
  title TEXT NOT NULL,
  provider TEXT NOT NULL,
  type scholarship_type NOT NULL,
  education_levels TEXT[] NOT NULL DEFAULT '{}',
  applicable_categories TEXT[] NOT NULL DEFAULT '{}',
  applicable_states TEXT[] NOT NULL DEFAULT '{"All India"}',
  amount_inr BIGINT NOT NULL CHECK (amount_inr >= 0),
  frequency TEXT NOT NULL DEFAULT 'Annual',
  deadline DATE NOT NULL,
  min_percentage_or_cgpa NUMERIC(4, 2) DEFAULT 0,
  max_family_income_inr BIGINT DEFAULT 800000,
  gender_restriction TEXT NOT NULL DEFAULT 'All',
  description TEXT NOT NULL,
  eligibility_summary TEXT NOT NULL,
  documents_required TEXT[] NOT NULL DEFAULT '{}',
  official_portal_url TEXT,
  source_url TEXT,
  verification_status verification_status NOT NULL DEFAULT 'pending_verification',
  is_demo_record BOOLEAN NOT NULL DEFAULT false,
  featured BOOLEAN NOT NULL DEFAULT false,
  application_count_demo INTEGER DEFAULT 0,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  verified_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- 5. SAVED SCHOLARSHIPS (Bookmarking)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.saved_scholarships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  scholarship_id TEXT NOT NULL REFERENCES public.scholarships(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  UNIQUE (student_id, scholarship_id)
);

-- ==============================================================================
-- 6. APPLICATION TRACKER TABLE
-- Notice: Records student internal tracking progress. Does NOT represent external portal submission.
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  scholarship_id TEXT NOT NULL REFERENCES public.scholarships(id) ON DELETE CASCADE,
  status application_stage NOT NULL DEFAULT 'preparing_documents',
  portal_reference_id TEXT,
  notes TEXT,
  disclaimer_acknowledged BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  UNIQUE (student_id, scholarship_id)
);

-- ==============================================================================
-- 7. STUDENT DOCUMENTS TABLE (Locker Metadata)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category document_category NOT NULL,
  storage_path TEXT NOT NULL,
  file_size TEXT NOT NULL,
  mime_type TEXT NOT NULL DEFAULT 'application/pdf',
  is_verified BOOLEAN NOT NULL DEFAULT false,
  validity_state TEXT NOT NULL DEFAULT 'Valid',
  issue_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- 8. NOTIFICATIONS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'deadline',
  read BOOLEAN NOT NULL DEFAULT false,
  link_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- 9. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scholarships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_scholarships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Helper functions to check role
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- PROFILES POLICIES
-- Students can read & update their own profile; Admins can read all profiles
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- SCHOLARSHIPS POLICIES
-- Anyone authenticated can view verified scholarships & demo records
CREATE POLICY "Anyone can view verified or demo scholarships"
  ON public.scholarships FOR SELECT
  USING (
    is_demo_record = true
    OR verification_status = 'verified'
    OR public.is_admin()
  );

-- Only admins can INSERT, UPDATE, DELETE scholarships
CREATE POLICY "Admins can insert scholarships"
  ON public.scholarships FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update scholarships"
  ON public.scholarships FOR UPDATE
  USING (public.is_admin());

CREATE POLICY "Admins can delete scholarships"
  ON public.scholarships FOR DELETE
  USING (public.is_admin());

-- SAVED SCHOLARSHIPS POLICIES
-- Students can only manage their own saved scholarships
CREATE POLICY "Students can view own saved scholarships"
  ON public.saved_scholarships FOR SELECT
  USING (auth.uid() = student_id);

CREATE POLICY "Students can insert own saved scholarships"
  ON public.saved_scholarships FOR INSERT
  WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Students can delete own saved scholarships"
  ON public.saved_scholarships FOR DELETE
  USING (auth.uid() = student_id);

-- APPLICATIONS POLICIES
-- Students can only view & manage their own applications; Admins can view all for verification audits
CREATE POLICY "Students view own applications, Admins view all"
  ON public.applications FOR SELECT
  USING (auth.uid() = student_id OR public.is_admin());

CREATE POLICY "Students can insert own applications"
  ON public.applications FOR INSERT
  WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Students can update own applications"
  ON public.applications FOR UPDATE
  USING (auth.uid() = student_id);

CREATE POLICY "Students can delete own applications"
  ON public.applications FOR DELETE
  USING (auth.uid() = student_id);

-- DOCUMENTS POLICIES
-- Strict privacy: Only the owning student can view, upload, or delete their private documents
CREATE POLICY "Students manage own documents"
  ON public.documents FOR SELECT
  USING (auth.uid() = student_id);

CREATE POLICY "Students insert own documents"
  ON public.documents FOR INSERT
  WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Students delete own documents"
  ON public.documents FOR DELETE
  USING (auth.uid() = student_id);

-- NOTIFICATIONS POLICIES
CREATE POLICY "Users view own notifications"
  ON public.notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users update own notifications"
  ON public.notifications FOR UPDATE
  USING (auth.uid() = user_id);

-- ==============================================================================
-- 10. SUPABASE STORAGE BUCKET CONFIGURATION (RLS)
-- ==============================================================================
-- Create 'student-documents' bucket if storage extension is active
INSERT INTO storage.buckets (id, name, public)
VALUES ('student-documents', 'student-documents', false)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS: Restrict student access to their own folder: student-documents/{user_id}/*
CREATE POLICY "Students can view own folder"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'student-documents'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Students can upload to own folder"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'student-documents'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Students can delete from own folder"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'student-documents'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- ==============================================================================
-- 11. AUTOMATIC PROFILE CREATION TRIGGER ON AUTH SIGNUP
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, role)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', 'Student User'),
    new.email,
    COALESCE((new.raw_user_meta_data->>'role')::user_role, 'student')
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger definition
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
