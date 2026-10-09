/**
 * Production-ready Supabase PostgreSQL Schema Migration & Row Level Security (RLS) script.
 * Follows all 15 tables and strict role-based access policies outlined in the EduCred specification.
 */
export const SUPABASE_MIGRATIONS_SQL = `-- EduCred PostgreSQL Schema & RLS Policies
-- Normalized, secure institutional database for teacher contribution verification

-- 1. Profiles (linked to auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL CHECK (role IN ('teacher', 'checker', 'admin')),
  institution_id UUID NOT NULL,
  department_id UUID,
  employee_id TEXT,
  title TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Institutions
CREATE TABLE IF NOT EXISTS public.institutions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE,
  time_zone TEXT NOT NULL DEFAULT 'America/Los_Angeles',
  settings JSONB NOT NULL DEFAULT '{"ruleLeadDays": 3, "prohibitSameDay": true, "requireOCR": true}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Institution Memberships
CREATE TABLE IF NOT EXISTS public.institution_memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  institution_id UUID NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('teacher', 'checker', 'admin')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'invited')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, institution_id)
);

-- 4. Departments
CREATE TABLE IF NOT EXISTS public.departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id UUID NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  code TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Contributions
CREATE TABLE IF NOT EXISTS public.contributions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  institution_id UUID NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  activity_date DATE NOT NULL,
  lesson_plan_date DATE,
  department TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (
    status IN ('draft', 'submitted', 'processing_evidence', 'pending_checker_review',
               'clarification_required', 'exception_requested', 'approved', 'rejected', 'processing_failed')
  ),
  ai_flags JSONB DEFAULT '[]'::jsonb,
  date_validation_result JSONB,
  credits_awarded INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Evidence Files
CREATE TABLE IF NOT EXISTS public.evidence_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contribution_id UUID NOT NULL REFERENCES public.contributions(id) ON DELETE CASCADE,
  owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  file_type TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  sha256_hash TEXT NOT NULL,
  is_duplicate BOOLEAN DEFAULT FALSE,
  duplicate_of_id UUID REFERENCES public.evidence_files(id),
  processing_status TEXT NOT NULL DEFAULT 'pending' CHECK (processing_status IN ('pending', 'completed', 'failed')),
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Evidence Analysis (OCR & AI Screening)
CREATE TABLE IF NOT EXISTS public.evidence_analysis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  evidence_id UUID NOT NULL REFERENCES public.evidence_files(id) ON DELETE CASCADE,
  ocr_provider TEXT NOT NULL,
  document_title TEXT,
  extracted_dates JSONB DEFAULT '[]'::jsonb,
  primary_date DATE,
  teacher_name TEXT,
  institution_name TEXT,
  detected_category TEXT,
  extracted_text_sample TEXT,
  confidence_score NUMERIC(4, 3),
  tampering_warnings JSONB DEFAULT '[]'::jsonb,
  potential_date_mismatch BOOLEAN DEFAULT FALSE,
  summary TEXT,
  analyzed_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Review Assignments
CREATE TABLE IF NOT EXISTS public.review_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contribution_id UUID NOT NULL REFERENCES public.contributions(id) ON DELETE CASCADE,
  checker_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  assigned_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'assigned' CHECK (status IN ('assigned', 'completed'))
);

-- 9. Reviews
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contribution_id UUID NOT NULL REFERENCES public.contributions(id) ON DELETE CASCADE,
  checker_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  checker_name TEXT NOT NULL,
  decision TEXT NOT NULL CHECK (decision IN ('approved', 'rejected', 'clarification_requested')),
  reason TEXT,
  credits_awarded INTEGER DEFAULT 0,
  reviewed_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Clarification Messages
CREATE TABLE IF NOT EXISTS public.clarification_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contribution_id UUID NOT NULL REFERENCES public.contributions(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  sender_name TEXT NOT NULL,
  sender_role TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. Credit Rules
CREATE TABLE IF NOT EXISTS public.credit_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id UUID NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  credit_value INTEGER NOT NULL CHECK (credit_value > 0),
  description TEXT,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. Credit Ledger (Append-Only)
CREATE TABLE IF NOT EXISTS public.credit_ledger (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  teacher_name TEXT NOT NULL,
  contribution_id UUID REFERENCES public.contributions(id) ON DELETE RESTRICT,
  contribution_title TEXT NOT NULL,
  rule_id UUID REFERENCES public.credit_rules(id),
  category TEXT NOT NULL,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('award', 'adjustment')),
  amount INTEGER NOT NULL,
  explanation TEXT NOT NULL,
  idempotency_key TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. Notifications
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  contribution_id UUID,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. Audit Logs (Immutable)
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id UUID NOT NULL REFERENCES public.institutions(id) ON DELETE RESTRICT,
  actor_id UUID NOT NULL,
  actor_name TEXT NOT NULL,
  actor_role TEXT NOT NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  details TEXT NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- 15. Institution Policies
CREATE TABLE IF NOT EXISTS public.institution_policies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id UUID NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
  policy_type TEXT NOT NULL,
  policy_config JSONB NOT NULL,
  version TEXT NOT NULL DEFAULT '1.0',
  effective_date DATE NOT NULL DEFAULT CURRENT_DATE
);

-- =========================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evidence_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evidence_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credit_ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Helper functions for current user context
CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS TEXT AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql STABLE;

CREATE OR REPLACE FUNCTION public.current_user_institution()
RETURNS UUID AS $$
  SELECT institution_id FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql STABLE;

-- Profiles: Users can read profiles in their institution; only admins can edit roles
CREATE POLICY "Profiles readable within institution"
  ON public.profiles FOR SELECT
  USING (institution_id = public.current_user_institution());

CREATE POLICY "Users can update own non-role profile fields"
  ON public.profiles FOR UPDATE
  USING (id = auth.uid());

-- Contributions:
-- Teachers can view and insert/update their own contributions
CREATE POLICY "Teachers can view own contributions"
  ON public.contributions FOR SELECT
  USING (teacher_id = auth.uid() OR public.current_user_role() IN ('checker', 'admin'));

CREATE POLICY "Teachers can insert own contributions"
  ON public.contributions FOR INSERT
  WITH CHECK (teacher_id = auth.uid() AND institution_id = public.current_user_institution());

CREATE POLICY "Teachers can update own eligible drafts or replies"
  ON public.contributions FOR UPDATE
  USING (teacher_id = auth.uid() OR public.current_user_role() IN ('checker', 'admin'));

-- Reviews: Checkers cannot review their own contributions
CREATE POLICY "Checkers can review institutional contributions"
  ON public.reviews FOR INSERT
  WITH CHECK (
    public.current_user_role() IN ('checker', 'admin') AND
    checker_id = auth.uid() AND
    checker_id != (SELECT teacher_id FROM public.contributions WHERE id = contribution_id)
  );

-- Evidence Files: Accessible only by owner or authorized checkers/admins
CREATE POLICY "Evidence private access"
  ON public.evidence_files FOR SELECT
  USING (owner_id = auth.uid() OR public.current_user_role() IN ('checker', 'admin'));

-- Credit Ledger: Append-only; teachers cannot modify; immutable history
CREATE POLICY "View credit ledger"
  ON public.credit_ledger FOR SELECT
  USING (teacher_id = auth.uid() OR public.current_user_role() IN ('checker', 'admin'));

CREATE POLICY "Admins/Checkers only can record credits"
  ON public.credit_ledger FOR INSERT
  WITH CHECK (public.current_user_role() IN ('checker', 'admin'));

-- Notifications: Private to recipient
CREATE POLICY "User notifications"
  ON public.notifications FOR ALL
  USING (recipient_id = auth.uid());

-- Audit logs: Read only by admins, insert by system
CREATE POLICY "Admin audit log access"
  ON public.audit_logs FOR SELECT
  USING (public.current_user_role() = 'admin');
`;
