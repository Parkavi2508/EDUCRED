export type UserRole = 'teacher' | 'checker' | 'admin';

export type SubmissionStatus =
  | 'draft'
  | 'submitted'
  | 'processing_evidence'
  | 'pending_checker_review'
  | 'clarification_required'
  | 'exception_requested'
  | 'approved'
  | 'rejected'
  | 'processing_failed';

export type ContributionCategory =
  | 'Lesson Planning'
  | 'Assessment Development'
  | 'Student Mentoring'
  | 'Professional Development'
  | 'Workshop or Seminar'
  | 'Research or Publication'
  | 'Institutional Activity'
  | 'Community Engagement'
  | 'Other';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  institutionId: string;
  institutionName: string;
  departmentId?: string;
  departmentName?: string;
  title?: string;
  avatarUrl?: string;
  employeeId?: string;
  createdAt: string;
}

export interface Institution {
  id: string;
  name: string;
  code: string;
  timeZone: string;
  settings: {
    referenceDate: string; // e.g. '2026-10-09'
    ruleLeadDays: number; // e.g. 3 days lead time
    prohibitSameDay: boolean;
    requireOCR: boolean;
    allowDuplicateHash: boolean;
  };
  createdAt: string;
}

export interface EvidenceFile {
  id: string;
  contributionId: string;
  ownerId: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  dataUrl?: string;
  sha256Hash: string;
  isDuplicate: boolean;
  duplicateOfId?: string;
  processingStatus: 'pending' | 'completed' | 'failed';
  uploadedAt: string;
}

export interface EvidenceAnalysis {
  id: string;
  evidenceId: string;
  ocrProvider: string;
  documentTitle: string;
  extractedDates: string[];
  primaryDate: string;
  teacherName?: string;
  institutionName?: string;
  detectedCategory?: string;
  extractedTextSample: string;
  confidenceScore: number;
  tamperingWarnings: string[];
  potentialDateMismatch: boolean;
  summary: string;
  analyzedAt: string;
}

export interface ClarificationMessage {
  id: string;
  contributionId: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  message: string;
  createdAt: string;
}

export interface ReviewRecord {
  id: string;
  contributionId: string;
  checkerId: string;
  checkerName: string;
  decision: 'approved' | 'rejected' | 'clarification_requested';
  reason?: string;
  creditsAwarded?: number;
  reviewedAt: string;
}

export interface Contribution {
  id: string;
  teacherId: string;
  teacherName: string;
  institutionId: string;
  title: string;
  category: ContributionCategory;
  description: string;
  activityDate: string;
  lessonPlanDate?: string;
  department?: string;
  status: SubmissionStatus;
  evidenceFiles: EvidenceFile[];
  analysis?: EvidenceAnalysis;
  dateValidationResult?: {
    passed: boolean;
    diffDays: number;
    violationReason?: string;
    evaluatedAt: string;
  };
  clarifications: ClarificationMessage[];
  reviews: ReviewRecord[];
  aiFlags: string[];
  creditsAwarded: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreditRule {
  id: string;
  institutionId: string;
  category: ContributionCategory;
  creditValue: number;
  description: string;
  active: boolean;
}

export interface CreditLedgerEntry {
  id: string;
  teacherId: string;
  teacherName: string;
  contributionId: string;
  contributionTitle: string;
  ruleId: string;
  category: ContributionCategory;
  transactionType: 'award' | 'adjustment';
  amount: number;
  explanation: string;
  idempotencyKey: string;
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  recipientId: string;
  type:
    | 'submission_received'
    | 'processing_failed'
    | 'clarification_requested'
    | 'submission_approved'
    | 'submission_rejected'
    | 'credits_awarded'
    | 'exception_status_changed';
  title: string;
  message: string;
  contributionId?: string;
  read: boolean;
  createdAt: string;
}

export interface AuditLogEntry {
  id: string;
  institutionId: string;
  actorId: string;
  actorName: string;
  actorRole: UserRole;
  action: string;
  entityType: 'contribution' | 'evidence' | 'credit' | 'policy' | 'user' | 'review';
  entityId: string;
  details: string;
  timestamp: string;
}
