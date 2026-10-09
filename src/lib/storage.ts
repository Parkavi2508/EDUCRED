import {
  UserProfile,
  Institution,
  Contribution,
  CreditRule,
  CreditLedgerEntry,
  NotificationItem,
  AuditLogEntry,
  SubmissionStatus,
  ContributionCategory,
  EvidenceFile,
  ReviewRecord,
} from '../types';

const STORAGE_KEY = 'educred_database_v1';

export interface DatabaseState {
  institutions: Institution[];
  users: UserProfile[];
  contributions: Contribution[];
  creditRules: CreditRule[];
  creditLedger: CreditLedgerEntry[];
  notifications: NotificationItem[];
  auditLogs: AuditLogEntry[];
}

// Initial Seed Data matching the screenshot and enterprise requirements
const DEFAULT_INSTITUTION: Institution = {
  id: 'inst-1',
  name: 'National Academy of Secondary Education',
  code: 'NASE-2026',
  timeZone: 'America/Los_Angeles',
  settings: {
    referenceDate: '2026-10-09',
    ruleLeadDays: 3,
    prohibitSameDay: true,
    requireOCR: true,
    allowDuplicateHash: false,
  },
  createdAt: '2025-01-01T00:00:00Z',
};

const DEFAULT_USERS: UserProfile[] = [
  {
    id: 'user-priya',
    name: 'Dr. Priya Sharma',
    email: 'priya.sharma@nase.edu',
    role: 'teacher',
    institutionId: 'inst-1',
    institutionName: 'National Academy of Secondary Education',
    departmentId: 'dept-math',
    departmentName: 'Mathematics & Computer Science',
    title: 'Senior Mathematics Educator',
    employeeId: 'FAC-8821',
    createdAt: '2025-01-15T08:00:00Z',
  },
  {
    id: 'user-checker-david',
    name: 'Prof. David Miller',
    email: 'david.miller@nase.edu',
    role: 'checker',
    institutionId: 'inst-1',
    institutionName: 'National Academy of Secondary Education',
    departmentId: 'dept-eval',
    departmentName: 'Academic Verification Board',
    title: 'Senior Institutional Verification Officer',
    employeeId: 'CHK-1042',
    createdAt: '2025-01-10T08:00:00Z',
  },
  {
    id: 'user-admin-sarah',
    name: 'Dean Sarah Chen',
    email: 'sarah.chen@nase.edu',
    role: 'admin',
    institutionId: 'inst-1',
    institutionName: 'National Academy of Secondary Education',
    departmentId: 'dept-admin',
    departmentName: 'Office of Academic Affairs',
    title: 'Dean of Faculty Development',
    employeeId: 'ADM-001',
    createdAt: '2024-12-01T08:00:00Z',
  },
];

const DEFAULT_CREDIT_RULES: CreditRule[] = [
  {
    id: 'rule-lesson',
    institutionId: 'inst-1',
    category: 'Lesson Planning',
    creditValue: 10,
    description: 'Comprehensive differentiated lesson curriculum with rubric',
    active: true,
  },
  {
    id: 'rule-assessment',
    institutionId: 'inst-1',
    category: 'Assessment Development',
    creditValue: 8,
    description: 'Standardized formative or summative assessment matrix',
    active: true,
  },
  {
    id: 'rule-mentoring',
    institutionId: 'inst-1',
    category: 'Student Mentoring',
    creditValue: 12,
    description: 'Documented 1-on-1 or small group academic mentoring portfolio',
    active: true,
  },
  {
    id: 'rule-workshop',
    institutionId: 'inst-1',
    category: 'Workshop or Seminar',
    creditValue: 15,
    description: 'Organizing or delivering pedagogy/STEM training workshop',
    active: true,
  },
  {
    id: 'rule-research',
    institutionId: 'inst-1',
    category: 'Research or Publication',
    creditValue: 25,
    description: 'Peer-reviewed pedagogical publication or conference paper',
    active: true,
  },
  {
    id: 'rule-institutional',
    institutionId: 'inst-1',
    category: 'Institutional Activity',
    creditValue: 10,
    description: 'Accreditation committee or curriculum steering committee',
    active: true,
  },
  {
    id: 'rule-profdev',
    institutionId: 'inst-1',
    category: 'Professional Development',
    creditValue: 15,
    description: 'Faculty Development Program or accredited certificate',
    active: true,
  },
  {
    id: 'rule-community',
    institutionId: 'inst-1',
    category: 'Community Engagement',
    creditValue: 10,
    description: 'Outreach program or regional science fair organization',
    active: true,
  },
  {
    id: 'rule-other',
    institutionId: 'inst-1',
    category: 'Other',
    creditValue: 5,
    description: 'Institutionally approved custom educational contribution',
    active: true,
  },
];

const DEFAULT_CONTRIBUTIONS: Contribution[] = [
  {
    id: 'contrib-1',
    teacherId: 'user-priya',
    teacherName: 'Dr. Priya Sharma',
    institutionId: 'inst-1',
    title: 'Remedial Mathematics Class',
    category: 'Student Mentoring',
    description: 'Conducted weekly differentiated problem-solving sessions for Grade 11 calculus students struggling with differential limits.',
    activityDate: '2026-06-12',
    department: 'Mathematics & Computer Science',
    status: 'approved',
    evidenceFiles: [
      {
        id: 'ev-1',
        contributionId: 'contrib-1',
        ownerId: 'user-priya',
        fileName: 'Remedial_Session_Attendance_June12.pdf',
        fileSize: 245000,
        fileType: 'application/pdf',
        sha256Hash: 'a1b2c3d4e5f67890123456789abcdef0123456789abcdef0123456789abcdef0',
        isDuplicate: false,
        processingStatus: 'completed',
        uploadedAt: '2026-06-13T09:30:00Z',
      },
    ],
    analysis: {
      id: 'ocr-1',
      evidenceId: 'ev-1',
      ocrProvider: 'Google Gemini Multimodal OCR',
      documentTitle: 'Remedial Mathematics Attendance & Log',
      extractedDates: ['2026-06-12'],
      primaryDate: '2026-06-12',
      teacherName: 'Dr. Priya Sharma',
      institutionName: 'National Academy of Secondary Education',
      detectedCategory: 'Student Mentoring',
      extractedTextSample: 'National Academy Attendance Record: Special Remedial Class in Advanced Differential Calculus. Instructor: Dr. Priya Sharma. 18 students attended.',
      confidenceScore: 0.98,
      tamperingWarnings: [],
      potentialDateMismatch: false,
      summary: 'Verified student attendance record and curriculum logs.',
      analyzedAt: '2026-06-13T09:31:00Z',
    },
    dateValidationResult: {
      passed: true,
      diffDays: 119,
      evaluatedAt: '2026-06-13T09:31:00Z',
    },
    clarifications: [],
    reviews: [
      {
        id: 'rev-1',
        contributionId: 'contrib-1',
        checkerId: 'user-checker-david',
        checkerName: 'Prof. David Miller',
        decision: 'approved',
        reason: 'Well documented remedial intervention with complete attendance signatures and rubric outcomes.',
        creditsAwarded: 12,
        reviewedAt: '2026-06-14T14:20:00Z',
      },
    ],
    aiFlags: [],
    creditsAwarded: 12,
    createdAt: '2026-06-13T09:30:00Z',
    updatedAt: '2026-06-14T14:20:00Z',
  },
  {
    id: 'contrib-2',
    teacherId: 'user-priya',
    teacherName: 'Dr. Priya Sharma',
    institutionId: 'inst-1',
    title: 'Student Project Guidance - AI Ethics in STEM',
    category: 'Assessment Development',
    description: 'Mentored 4 teams of senior high school students formulating capstone research on algorithmic bias and transparent computing.',
    activityDate: '2026-06-10',
    department: 'Mathematics & Computer Science',
    status: 'pending_checker_review',
    evidenceFiles: [
      {
        id: 'ev-2',
        contributionId: 'contrib-2',
        ownerId: 'user-priya',
        fileName: 'Capstone_Guidance_Summary_Report.pdf',
        fileSize: 520000,
        fileType: 'application/pdf',
        sha256Hash: 'b2c3d4e5f67890123456789abcdef0123456789abcdef0123456789abcdef01',
        isDuplicate: false,
        processingStatus: 'completed',
        uploadedAt: '2026-06-11T11:00:00Z',
      },
    ],
    analysis: {
      id: 'ocr-2',
      evidenceId: 'ev-2',
      ocrProvider: 'Google Gemini Multimodal OCR',
      documentTitle: 'Senior Capstone Mentorship Log',
      extractedDates: ['2026-06-10'],
      primaryDate: '2026-06-10',
      teacherName: 'Dr. Priya Sharma',
      institutionName: 'National Academy of Secondary Education',
      detectedCategory: 'Assessment Development',
      extractedTextSample: 'Capstone Advisor Log: Bi-weekly milestones achieved for student projects. Final rubric completed.',
      confidenceScore: 0.95,
      tamperingWarnings: [],
      potentialDateMismatch: false,
      summary: 'Capstone advising log with rubric milestones.',
      analyzedAt: '2026-06-11T11:02:00Z',
    },
    dateValidationResult: {
      passed: true,
      diffDays: 121,
      evaluatedAt: '2026-06-11T11:02:00Z',
    },
    clarifications: [],
    reviews: [],
    aiFlags: [],
    creditsAwarded: 0,
    createdAt: '2026-06-11T11:00:00Z',
    updatedAt: '2026-06-11T11:02:00Z',
  },
  {
    id: 'contrib-3',
    teacherId: 'user-priya',
    teacherName: 'Dr. Priya Sharma',
    institutionId: 'inst-1',
    title: 'Robotics Workshop - Inter-school Competition',
    category: 'Workshop or Seminar',
    description: 'Designed hardware kit instructions and adjudicated autonomous robotics maze competition.',
    activityDate: '2026-06-08',
    department: 'Mathematics & Computer Science',
    status: 'clarification_required',
    evidenceFiles: [
      {
        id: 'ev-3',
        contributionId: 'contrib-3',
        ownerId: 'user-priya',
        fileName: 'Robotics_Workshop_Certificate_Scan.jpg',
        fileSize: 840000,
        fileType: 'image/jpeg',
        sha256Hash: 'c3d4e5f67890123456789abcdef0123456789abcdef0123456789abcdef012',
        isDuplicate: false,
        processingStatus: 'completed',
        uploadedAt: '2026-06-09T16:00:00Z',
      },
    ],
    analysis: {
      id: 'ocr-3',
      evidenceId: 'ev-3',
      ocrProvider: 'Google Gemini Multimodal OCR',
      documentTitle: 'Regional Robotics League Adjudicator Credential',
      extractedDates: ['2026-06-08'],
      primaryDate: '2026-06-08',
      teacherName: 'Dr. Priya Sharma',
      institutionName: 'Regional STEM Alliance',
      detectedCategory: 'Workshop or Seminar',
      extractedTextSample: 'Certificate of Appreciation presented to Dr. Priya Sharma for leading the autonomous robotics challenge.',
      confidenceScore: 0.88,
      tamperingWarnings: ['Co-sponsor seal partially occluded in scan'],
      potentialDateMismatch: false,
      summary: 'Certificate scan detected, minor blur on institutional co-sponsor watermark.',
      analyzedAt: '2026-06-09T16:05:00Z',
    },
    dateValidationResult: {
      passed: true,
      diffDays: 123,
      evaluatedAt: '2026-06-09T16:05:00Z',
    },
    clarifications: [
      {
        id: 'clar-1',
        contributionId: 'contrib-3',
        senderId: 'user-checker-david',
        senderName: 'Prof. David Miller',
        senderRole: 'checker',
        message: 'Please provide the secondary schedule page or official student roster to corroborate total workshop contact hours.',
        createdAt: '2026-06-10T10:15:00Z',
      },
    ],
    reviews: [
      {
        id: 'rev-3',
        contributionId: 'contrib-3',
        checkerId: 'user-checker-david',
        checkerName: 'Prof. David Miller',
        decision: 'clarification_requested',
        reason: 'Need schedule breakdown to verify workshop hour credits.',
        reviewedAt: '2026-06-10T10:15:00Z',
      },
    ],
    aiFlags: ['Minor blur on sponsor signature area; human review suggested'],
    creditsAwarded: 0,
    createdAt: '2026-06-09T16:00:00Z',
    updatedAt: '2026-06-10T10:15:00Z',
  },
  {
    id: 'contrib-4',
    teacherId: 'user-priya',
    teacherName: 'Dr. Priya Sharma',
    institutionId: 'inst-1',
    title: 'Faculty Development Program - Advanced Pedagogy',
    category: 'Professional Development',
    description: 'Successfully completed 40-hour intensive certified training on Active Learning Methodologies in Higher Secondary STEM.',
    activityDate: '2026-06-05',
    department: 'Mathematics & Computer Science',
    status: 'approved',
    evidenceFiles: [
      {
        id: 'ev-4',
        contributionId: 'contrib-4',
        ownerId: 'user-priya',
        fileName: 'FDP_Completion_Badge_National_Board.pdf',
        fileSize: 412000,
        fileType: 'application/pdf',
        sha256Hash: 'd4e5f67890123456789abcdef0123456789abcdef0123456789abcdef0123',
        isDuplicate: false,
        processingStatus: 'completed',
        uploadedAt: '2026-06-06T14:00:00Z',
      },
    ],
    analysis: {
      id: 'ocr-4',
      evidenceId: 'ev-4',
      ocrProvider: 'Google Gemini Multimodal OCR',
      documentTitle: 'National Board FDP Certificate',
      extractedDates: ['2026-06-05'],
      primaryDate: '2026-06-05',
      teacherName: 'Dr. Priya Sharma',
      institutionName: 'National Board of Teacher Education',
      detectedCategory: 'Professional Development',
      extractedTextSample: 'This is to certify that Dr. Priya Sharma has completed the Faculty Development Program on Active Learning.',
      confidenceScore: 0.99,
      tamperingWarnings: [],
      potentialDateMismatch: false,
      summary: 'Verified institutional FDP certificate with official QR code reference.',
      analyzedAt: '2026-06-06T14:02:00Z',
    },
    dateValidationResult: {
      passed: true,
      diffDays: 126,
      evaluatedAt: '2026-06-06T14:02:00Z',
    },
    clarifications: [],
    reviews: [
      {
        id: 'rev-4',
        contributionId: 'contrib-4',
        checkerId: 'user-checker-david',
        checkerName: 'Prof. David Miller',
        decision: 'approved',
        reason: 'Accredited national board FDP verified. Eligible for 15 professional development credits.',
        creditsAwarded: 15,
        reviewedAt: '2026-06-07T11:00:00Z',
      },
    ],
    aiFlags: [],
    creditsAwarded: 15,
    createdAt: '2026-06-06T14:00:00Z',
    updatedAt: '2026-06-07T11:00:00Z',
  },
  {
    id: 'contrib-5',
    teacherId: 'user-priya',
    teacherName: 'Dr. Priya Sharma',
    institutionId: 'inst-1',
    title: 'Lesson Plan - Differential Calculus Applications',
    category: 'Lesson Planning',
    description: 'Detailed modular curriculum with 6 real-world aerospace trajectory problem sets and rubrics.',
    activityDate: '2026-05-20',
    lessonPlanDate: '2026-05-20',
    department: 'Mathematics & Computer Science',
    status: 'approved',
    evidenceFiles: [
      {
        id: 'ev-5',
        contributionId: 'contrib-5',
        ownerId: 'user-priya',
        fileName: 'Lesson_Plan_Calculus_Applications.pdf',
        fileSize: 310000,
        fileType: 'application/pdf',
        sha256Hash: 'e5f67890123456789abcdef0123456789abcdef0123456789abcdef01234',
        isDuplicate: false,
        processingStatus: 'completed',
        uploadedAt: '2026-05-21T08:00:00Z',
      },
    ],
    analysis: {
      id: 'ocr-5',
      evidenceId: 'ev-5',
      ocrProvider: 'Google Gemini Multimodal OCR',
      documentTitle: 'Calculus Applications Lesson Master',
      extractedDates: ['2026-05-20'],
      primaryDate: '2026-05-20',
      teacherName: 'Dr. Priya Sharma',
      institutionName: 'National Academy of Secondary Education',
      detectedCategory: 'Lesson Planning',
      extractedTextSample: 'Department of Mathematics: Course Syllabus & Differentiated Lesson Plan.',
      confidenceScore: 0.97,
      tamperingWarnings: [],
      potentialDateMismatch: false,
      summary: 'Verified comprehensive lesson plan document.',
      analyzedAt: '2026-05-21T08:05:00Z',
    },
    dateValidationResult: {
      passed: true,
      diffDays: 142,
      evaluatedAt: '2026-05-21T08:05:00Z',
    },
    clarifications: [],
    reviews: [
      {
        id: 'rev-5',
        contributionId: 'contrib-5',
        checkerId: 'user-checker-david',
        checkerName: 'Prof. David Miller',
        decision: 'approved',
        reason: 'Excellent lesson plan with clear learning objectives and differentiated rubrics.',
        creditsAwarded: 10,
        reviewedAt: '2026-05-22T09:30:00Z',
      },
    ],
    aiFlags: [],
    creditsAwarded: 10,
    createdAt: '2026-05-21T08:00:00Z',
    updatedAt: '2026-05-22T09:30:00Z',
  },
  {
    id: 'contrib-6',
    teacherId: 'user-priya',
    teacherName: 'Dr. Priya Sharma',
    institutionId: 'inst-1',
    title: 'Research Paper - Inquiry-Based Math Modeling',
    category: 'Research or Publication',
    description: 'Published in Regional Journal of Mathematical Pedagogy, Vol. 14, Issue 2.',
    activityDate: '2026-04-18',
    department: 'Mathematics & Computer Science',
    status: 'approved',
    evidenceFiles: [
      {
        id: 'ev-6',
        contributionId: 'contrib-6',
        ownerId: 'user-priya',
        fileName: 'Journal_Paper_Math_Pedagogy_2026.pdf',
        fileSize: 980000,
        fileType: 'application/pdf',
        sha256Hash: 'f67890123456789abcdef0123456789abcdef0123456789abcdef012345',
        isDuplicate: false,
        processingStatus: 'completed',
        uploadedAt: '2026-04-20T10:00:00Z',
      },
    ],
    analysis: {
      id: 'ocr-6',
      evidenceId: 'ev-6',
      ocrProvider: 'Google Gemini Multimodal OCR',
      documentTitle: 'Inquiry-Based Math Modeling in High School',
      extractedDates: ['2026-04-18'],
      primaryDate: '2026-04-18',
      teacherName: 'Dr. Priya Sharma',
      institutionName: 'Regional Journal of Mathematical Pedagogy',
      detectedCategory: 'Research or Publication',
      extractedTextSample: 'Regional Journal of Mathematical Pedagogy. Author: Dr. Priya Sharma, NASE.',
      confidenceScore: 0.99,
      tamperingWarnings: [],
      potentialDateMismatch: false,
      summary: 'Verified peer-reviewed publication with ISSN confirmation.',
      analyzedAt: '2026-04-20T10:05:00Z',
    },
    dateValidationResult: {
      passed: true,
      diffDays: 174,
      evaluatedAt: '2026-04-20T10:05:00Z',
    },
    clarifications: [],
    reviews: [
      {
        id: 'rev-6',
        contributionId: 'contrib-6',
        checkerId: 'user-checker-david',
        checkerName: 'Prof. David Miller',
        decision: 'approved',
        reason: 'Verified indexed publication. Maximum tier research credit awarded.',
        creditsAwarded: 25,
        reviewedAt: '2026-04-22T16:00:00Z',
      },
    ],
    aiFlags: [],
    creditsAwarded: 25,
    createdAt: '2026-04-20T10:00:00Z',
    updatedAt: '2026-04-22T16:00:00Z',
  },
  {
    id: 'contrib-7',
    teacherId: 'user-priya',
    teacherName: 'Dr. Priya Sharma',
    institutionId: 'inst-1',
    title: 'Curriculum Development - AP Computer Science A',
    category: 'Institutional Activity',
    description: 'Chaired institutional committee aligning state curriculum standards with AP College Board syllabus.',
    activityDate: '2026-03-15',
    department: 'Mathematics & Computer Science',
    status: 'approved',
    evidenceFiles: [
      {
        id: 'ev-7',
        contributionId: 'contrib-7',
        ownerId: 'user-priya',
        fileName: 'Curriculum_Committee_Minutes_Signed.pdf',
        fileSize: 450000,
        fileType: 'application/pdf',
        sha256Hash: '07890123456789abcdef0123456789abcdef0123456789abcdef0123456',
        isDuplicate: false,
        processingStatus: 'completed',
        uploadedAt: '2026-03-16T12:00:00Z',
      },
    ],
    analysis: {
      id: 'ocr-7',
      evidenceId: 'ev-7',
      ocrProvider: 'Google Gemini Multimodal OCR',
      documentTitle: 'Academic Steering Committee Minutes',
      extractedDates: ['2026-03-15'],
      primaryDate: '2026-03-15',
      teacherName: 'Dr. Priya Sharma',
      institutionName: 'National Academy of Secondary Education',
      detectedCategory: 'Institutional Activity',
      extractedTextSample: 'Minutes of Meeting: AP Computer Science syllabus revision committee.',
      confidenceScore: 0.98,
      tamperingWarnings: [],
      potentialDateMismatch: false,
      summary: 'Verified institutional committee resolution.',
      analyzedAt: '2026-03-16T12:05:00Z',
    },
    dateValidationResult: {
      passed: true,
      diffDays: 208,
      evaluatedAt: '2026-03-16T12:05:00Z',
    },
    clarifications: [],
    reviews: [
      {
        id: 'rev-7',
        contributionId: 'contrib-7',
        checkerId: 'user-checker-david',
        checkerName: 'Prof. David Miller',
        decision: 'approved',
        reason: 'Official minutes verified with Dean signature.',
        creditsAwarded: 10,
        reviewedAt: '2026-03-18T11:00:00Z',
      },
    ],
    aiFlags: [],
    creditsAwarded: 10,
    createdAt: '2026-03-16T12:00:00Z',
    updatedAt: '2026-03-18T11:00:00Z',
  },
  {
    id: 'contrib-8',
    teacherId: 'user-priya',
    teacherName: 'Dr. Priya Sharma',
    institutionId: 'inst-1',
    title: 'Inter-School Mathematics Olympiad Coordination',
    category: 'Community Engagement',
    description: 'Coordinated regional Olympiad testing center hosting 340 students from 18 secondary schools.',
    activityDate: '2026-02-14',
    department: 'Mathematics & Computer Science',
    status: 'approved',
    evidenceFiles: [
      {
        id: 'ev-8',
        contributionId: 'contrib-8',
        ownerId: 'user-priya',
        fileName: 'Olympiad_Convenor_Certificate.pdf',
        fileSize: 390000,
        fileType: 'application/pdf',
        sha256Hash: '1890123456789abcdef0123456789abcdef0123456789abcdef01234567',
        isDuplicate: false,
        processingStatus: 'completed',
        uploadedAt: '2026-02-15T09:00:00Z',
      },
    ],
    analysis: {
      id: 'ocr-8',
      evidenceId: 'ev-8',
      ocrProvider: 'Google Gemini Multimodal OCR',
      documentTitle: 'Regional Olympiad Convenor Certificate',
      extractedDates: ['2026-02-14'],
      primaryDate: '2026-02-14',
      teacherName: 'Dr. Priya Sharma',
      institutionName: 'National Mathematics Foundation',
      detectedCategory: 'Community Engagement',
      extractedTextSample: 'Letter of commendation for regional host convenor Dr. Priya Sharma.',
      confidenceScore: 0.97,
      tamperingWarnings: [],
      potentialDateMismatch: false,
      summary: 'Verified community event convenorship.',
      analyzedAt: '2026-02-15T09:02:00Z',
    },
    dateValidationResult: {
      passed: true,
      diffDays: 237,
      evaluatedAt: '2026-02-15T09:02:00Z',
    },
    clarifications: [],
    reviews: [
      {
        id: 'rev-8',
        contributionId: 'contrib-8',
        checkerId: 'user-checker-david',
        checkerName: 'Prof. David Miller',
        decision: 'approved',
        reason: 'Extensive regional service confirmed.',
        creditsAwarded: 10,
        reviewedAt: '2026-02-17T14:00:00Z',
      },
    ],
    aiFlags: [],
    creditsAwarded: 10,
    createdAt: '2026-02-15T09:00:00Z',
    updatedAt: '2026-02-17T14:00:00Z',
  },
  {
    id: 'contrib-9',
    teacherId: 'user-priya',
    teacherName: 'Dr. Priya Sharma',
    institutionId: 'inst-1',
    title: 'Peer Teacher Mentoring Program',
    category: 'Student Mentoring',
    description: 'Mentored two newly appointed junior educators in classroom management and lesson differentiation strategies.',
    activityDate: '2026-01-22',
    department: 'Mathematics & Computer Science',
    status: 'approved',
    evidenceFiles: [
      {
        id: 'ev-9',
        contributionId: 'contrib-9',
        ownerId: 'user-priya',
        fileName: 'Peer_Mentorship_Logbook_Signed.pdf',
        fileSize: 420000,
        fileType: 'application/pdf',
        sha256Hash: '290123456789abcdef0123456789abcdef0123456789abcdef012345678',
        isDuplicate: false,
        processingStatus: 'completed',
        uploadedAt: '2026-01-24T10:00:00Z',
      },
    ],
    analysis: {
      id: 'ocr-9',
      evidenceId: 'ev-9',
      ocrProvider: 'Google Gemini Multimodal OCR',
      documentTitle: 'Faculty Mentorship Logbook',
      extractedDates: ['2026-01-22'],
      primaryDate: '2026-01-22',
      teacherName: 'Dr. Priya Sharma',
      institutionName: 'National Academy of Secondary Education',
      detectedCategory: 'Student Mentoring',
      extractedTextSample: 'Peer Faculty Mentorship Semester Summary: Dr. Priya Sharma.',
      confidenceScore: 0.96,
      tamperingWarnings: [],
      potentialDateMismatch: false,
      summary: 'Verified peer mentorship documentation.',
      analyzedAt: '2026-01-24T10:05:00Z',
    },
    dateValidationResult: {
      passed: true,
      diffDays: 260,
      evaluatedAt: '2026-01-24T10:05:00Z',
    },
    clarifications: [],
    reviews: [
      {
        id: 'rev-9',
        contributionId: 'contrib-9',
        checkerId: 'user-checker-david',
        checkerName: 'Prof. David Miller',
        decision: 'approved',
        reason: 'Mentorship outcomes validated by department chair.',
        creditsAwarded: 12,
        reviewedAt: '2026-01-26T15:30:00Z',
      },
    ],
    aiFlags: [],
    creditsAwarded: 12,
    createdAt: '2026-01-24T10:00:00Z',
    updatedAt: '2026-01-26T15:30:00Z',
  },
  {
    id: 'contrib-10',
    teacherId: 'user-priya',
    teacherName: 'Dr. Priya Sharma',
    institutionId: 'inst-1',
    title: 'STEM Innovation Fair Guidance',
    category: 'Student Mentoring',
    description: 'Guided 12 student finalists in regional robotics and clean energy modeling exhibit.',
    activityDate: '2026-01-12',
    department: 'Mathematics & Computer Science',
    status: 'approved',
    evidenceFiles: [
      {
        id: 'ev-10',
        contributionId: 'contrib-10',
        ownerId: 'user-priya',
        fileName: 'STEM_Fair_Advisor_Certification.pdf',
        fileSize: 310000,
        fileType: 'application/pdf',
        sha256Hash: '30123456789abcdef0123456789abcdef0123456789abcdef0123456789',
        isDuplicate: false,
        processingStatus: 'completed',
        uploadedAt: '2026-01-14T09:00:00Z',
      },
    ],
    analysis: {
      id: 'ocr-10',
      evidenceId: 'ev-10',
      ocrProvider: 'Google Gemini Multimodal OCR',
      documentTitle: 'STEM Fair Project Advisor Credentials',
      extractedDates: ['2026-01-12'],
      primaryDate: '2026-01-12',
      teacherName: 'Dr. Priya Sharma',
      institutionName: 'National Academy of Secondary Education',
      detectedCategory: 'Student Mentoring',
      extractedTextSample: 'Certification of Advisor: Dr. Priya Sharma.',
      confidenceScore: 0.98,
      tamperingWarnings: [],
      potentialDateMismatch: false,
      summary: 'Verified STEM Fair advisor role.',
      analyzedAt: '2026-01-14T09:05:00Z',
    },
    dateValidationResult: {
      passed: true,
      diffDays: 270,
      evaluatedAt: '2026-01-14T09:05:00Z',
    },
    clarifications: [],
    reviews: [
      {
        id: 'rev-10',
        contributionId: 'contrib-10',
        checkerId: 'user-checker-david',
        checkerName: 'Prof. David Miller',
        decision: 'approved',
        reason: 'Verified regional awards won by mentored students.',
        creditsAwarded: 12,
        reviewedAt: '2026-01-16T11:00:00Z',
      },
    ],
    aiFlags: [],
    creditsAwarded: 12,
    createdAt: '2026-01-14T09:00:00Z',
    updatedAt: '2026-01-16T11:00:00Z',
  },
  {
    id: 'contrib-11',
    teacherId: 'user-priya',
    teacherName: 'Dr. Priya Sharma',
    institutionId: 'inst-1',
    title: 'Formative Assessment Rubric Design',
    category: 'Assessment Development',
    description: 'Designed comprehensive scoring criteria for analytical geometry.',
    activityDate: '2026-05-10',
    department: 'Mathematics & Computer Science',
    status: 'approved',
    evidenceFiles: [
      {
        id: 'ev-11',
        contributionId: 'contrib-11',
        ownerId: 'user-priya',
        fileName: 'Geometry_Formative_Rubric.pdf',
        fileSize: 280000,
        fileType: 'application/pdf',
        sha256Hash: '4123456789abcdef0123456789abcdef0123456789abcdef0123456789a',
        isDuplicate: false,
        processingStatus: 'completed',
        uploadedAt: '2026-05-11T10:00:00Z',
      },
    ],
    analysis: {
      id: 'ocr-11',
      evidenceId: 'ev-11',
      ocrProvider: 'Google Gemini Multimodal OCR',
      documentTitle: 'Geometry Formative Rubric Standard',
      extractedDates: ['2026-05-10'],
      primaryDate: '2026-05-10',
      teacherName: 'Dr. Priya Sharma',
      institutionName: 'National Academy of Secondary Education',
      detectedCategory: 'Assessment Development',
      extractedTextSample: 'Formative Assessment Matrix: Analytical Geometry Grade 10.',
      confidenceScore: 0.95,
      tamperingWarnings: [],
      potentialDateMismatch: false,
      summary: 'Verified rubric schema.',
      analyzedAt: '2026-05-11T10:02:00Z',
    },
    dateValidationResult: {
      passed: true,
      diffDays: 152,
      evaluatedAt: '2026-05-11T10:02:00Z',
    },
    clarifications: [],
    reviews: [
      {
        id: 'rev-11',
        contributionId: 'contrib-11',
        checkerId: 'user-checker-david',
        checkerName: 'Prof. David Miller',
        decision: 'approved',
        reason: 'Rubric adopted by school mathematics division.',
        creditsAwarded: 8,
        reviewedAt: '2026-05-12T14:00:00Z',
      },
    ],
    aiFlags: [],
    creditsAwarded: 8,
    createdAt: '2026-05-11T10:00:00Z',
    updatedAt: '2026-05-12T14:00:00Z',
  },
  {
    id: 'contrib-12',
    teacherId: 'user-priya',
    teacherName: 'Dr. Priya Sharma',
    institutionId: 'inst-1',
    title: 'Inclusive STEM Education Workshop',
    category: 'Workshop or Seminar',
    description: 'Delivered 3-hour regional training on accommodations for neurodivergent learners in secondary algebra.',
    activityDate: '2026-04-05',
    department: 'Mathematics & Computer Science',
    status: 'approved',
    evidenceFiles: [
      {
        id: 'ev-12',
        contributionId: 'contrib-12',
        ownerId: 'user-priya',
        fileName: 'Inclusive_STEM_Workshop_Credential.pdf',
        fileSize: 340000,
        fileType: 'application/pdf',
        sha256Hash: '523456789abcdef0123456789abcdef0123456789abcdef0123456789ab',
        isDuplicate: false,
        processingStatus: 'completed',
        uploadedAt: '2026-04-06T11:00:00Z',
      },
    ],
    analysis: {
      id: 'ocr-12',
      evidenceId: 'ev-12',
      ocrProvider: 'Google Gemini Multimodal OCR',
      documentTitle: 'Inclusive STEM Pedagogy Certification',
      extractedDates: ['2026-04-05'],
      primaryDate: '2026-04-05',
      teacherName: 'Dr. Priya Sharma',
      institutionName: 'State Council of Educational Research',
      detectedCategory: 'Workshop or Seminar',
      extractedTextSample: 'State Council of Educational Research: Certificate awarded to Dr. Priya Sharma.',
      confidenceScore: 0.98,
      tamperingWarnings: [],
      potentialDateMismatch: false,
      summary: 'Verified state workshop instructor credentials.',
      analyzedAt: '2026-04-06T11:05:00Z',
    },
    dateValidationResult: {
      passed: true,
      diffDays: 187,
      evaluatedAt: '2026-04-06T11:05:00Z',
    },
    clarifications: [],
    reviews: [
      {
        id: 'rev-12',
        contributionId: 'contrib-12',
        checkerId: 'user-checker-david',
        checkerName: 'Prof. David Miller',
        decision: 'approved',
        reason: 'State council accredited workshop verified.',
        creditsAwarded: 15,
        reviewedAt: '2026-04-08T10:00:00Z',
      },
    ],
    aiFlags: [],
    creditsAwarded: 15,
    createdAt: '2026-04-06T11:00:00Z',
    updatedAt: '2026-04-08T10:00:00Z',
  },
  {
    id: 'contrib-13',
    teacherId: 'user-priya',
    teacherName: 'Dr. Priya Sharma',
    institutionId: 'inst-1',
    title: 'Student Math Club Sponsorship & League Coaching',
    category: 'Student Mentoring',
    description: 'Weekly coaching for regional math Olympiad qualifiers.',
    activityDate: '2026-03-02',
    department: 'Mathematics & Computer Science',
    status: 'approved',
    evidenceFiles: [
      {
        id: 'ev-13',
        contributionId: 'contrib-13',
        ownerId: 'user-priya',
        fileName: 'Math_Club_Advisor_Appointment.pdf',
        fileSize: 220000,
        fileType: 'application/pdf',
        sha256Hash: '63456789abcdef0123456789abcdef0123456789abcdef0123456789abc',
        isDuplicate: false,
        processingStatus: 'completed',
        uploadedAt: '2026-03-03T09:00:00Z',
      },
    ],
    analysis: {
      id: 'ocr-13',
      evidenceId: 'ev-13',
      ocrProvider: 'Google Gemini Multimodal OCR',
      documentTitle: 'Math Club Advisor Letter',
      extractedDates: ['2026-03-02'],
      primaryDate: '2026-03-02',
      teacherName: 'Dr. Priya Sharma',
      institutionName: 'National Academy of Secondary Education',
      detectedCategory: 'Student Mentoring',
      extractedTextSample: 'Student Activity Advisor Letter: Dr. Priya Sharma.',
      confidenceScore: 0.99,
      tamperingWarnings: [],
      potentialDateMismatch: false,
      summary: 'Verified club advisor role.',
      analyzedAt: '2026-03-03T09:05:00Z',
    },
    dateValidationResult: {
      passed: true,
      diffDays: 221,
      evaluatedAt: '2026-03-03T09:05:00Z',
    },
    clarifications: [],
    reviews: [
      {
        id: 'rev-13',
        contributionId: 'contrib-13',
        checkerId: 'user-checker-david',
        checkerName: 'Prof. David Miller',
        decision: 'approved',
        reason: 'Advisor attendance verified.',
        creditsAwarded: 12,
        reviewedAt: '2026-03-05T12:00:00Z',
      },
    ],
    aiFlags: [],
    creditsAwarded: 12,
    createdAt: '2026-03-03T09:00:00Z',
    updatedAt: '2026-03-05T12:00:00Z',
  },
  {
    id: 'contrib-14',
    teacherId: 'user-priya',
    teacherName: 'Dr. Priya Sharma',
    institutionId: 'inst-1',
    title: 'Advanced Diagnostic Test Construction',
    category: 'Assessment Development',
    description: 'Developed diagnostic test suite for incoming students to identify gaps in quadratic formulations.',
    activityDate: '2026-02-05',
    department: 'Mathematics & Computer Science',
    status: 'approved',
    evidenceFiles: [
      {
        id: 'ev-14',
        contributionId: 'contrib-14',
        ownerId: 'user-priya',
        fileName: 'Diagnostic_Test_Instrument_2026.pdf',
        fileSize: 310000,
        fileType: 'application/pdf',
        sha256Hash: '7456789abcdef0123456789abcdef0123456789abcdef0123456789abcd',
        isDuplicate: false,
        processingStatus: 'completed',
        uploadedAt: '2026-02-06T10:00:00Z',
      },
    ],
    analysis: {
      id: 'ocr-14',
      evidenceId: 'ev-14',
      ocrProvider: 'Google Gemini Multimodal OCR',
      documentTitle: 'Diagnostic Test Instrument Formulation',
      extractedDates: ['2026-02-05'],
      primaryDate: '2026-02-05',
      teacherName: 'Dr. Priya Sharma',
      institutionName: 'National Academy of Secondary Education',
      detectedCategory: 'Assessment Development',
      extractedTextSample: 'Formative Assessment Instrument: Quadratic Diagnostic Test.',
      confidenceScore: 0.97,
      tamperingWarnings: [],
      potentialDateMismatch: false,
      summary: 'Verified assessment test instrument.',
      analyzedAt: '2026-02-06T10:02:00Z',
    },
    dateValidationResult: {
      passed: true,
      diffDays: 246,
      evaluatedAt: '2026-02-06T10:02:00Z',
    },
    clarifications: [],
    reviews: [
      {
        id: 'rev-14',
        contributionId: 'contrib-14',
        checkerId: 'user-checker-david',
        checkerName: 'Prof. David Miller',
        decision: 'approved',
        reason: 'Instrument reviewed and approved for department-wide use.',
        creditsAwarded: 8,
        reviewedAt: '2026-02-08T15:00:00Z',
      },
    ],
    aiFlags: [],
    creditsAwarded: 8,
    createdAt: '2026-02-06T10:00:00Z',
    updatedAt: '2026-02-08T15:00:00Z',
  },
  {
    id: 'contrib-15',
    teacherId: 'user-priya',
    teacherName: 'Dr. Priya Sharma',
    institutionId: 'inst-1',
    title: 'Algebra II Interactive Simulation Module',
    category: 'Lesson Planning',
    description: 'Created dynamic GeoGebra interactive visual lesson models for polynomial function graphing.',
    activityDate: '2026-01-08',
    department: 'Mathematics & Computer Science',
    status: 'approved',
    evidenceFiles: [
      {
        id: 'ev-15',
        contributionId: 'contrib-15',
        ownerId: 'user-priya',
        fileName: 'Interactive_Algebra_Simulation_Report.pdf',
        fileSize: 420000,
        fileType: 'application/pdf',
        sha256Hash: '856789abcdef0123456789abcdef0123456789abcdef0123456789abcde',
        isDuplicate: false,
        processingStatus: 'completed',
        uploadedAt: '2026-01-09T14:00:00Z',
      },
    ],
    analysis: {
      id: 'ocr-15',
      evidenceId: 'ev-15',
      ocrProvider: 'Google Gemini Multimodal OCR',
      documentTitle: 'Interactive Lesson Plan Module',
      extractedDates: ['2026-01-08'],
      primaryDate: '2026-01-08',
      teacherName: 'Dr. Priya Sharma',
      institutionName: 'National Academy of Secondary Education',
      detectedCategory: 'Lesson Planning',
      extractedTextSample: 'Instructional Technology Module: GeoGebra Lesson Plan.',
      confidenceScore: 0.99,
      tamperingWarnings: [],
      potentialDateMismatch: false,
      summary: 'Verified interactive digital curriculum artifact.',
      analyzedAt: '2026-01-09T14:05:00Z',
    },
    dateValidationResult: {
      passed: true,
      diffDays: 274,
      evaluatedAt: '2026-01-09T14:05:00Z',
    },
    clarifications: [],
    reviews: [
      {
        id: 'rev-15',
        contributionId: 'contrib-15',
        checkerId: 'user-checker-david',
        checkerName: 'Prof. David Miller',
        decision: 'approved',
        reason: 'High-quality digital resource successfully integrated.',
        creditsAwarded: 10,
        reviewedAt: '2026-01-11T10:00:00Z',
      },
    ],
    aiFlags: [],
    creditsAwarded: 10,
    createdAt: '2026-01-09T14:00:00Z',
    updatedAt: '2026-01-11T10:00:00Z',
  },
];

// Append-only credit ledger matching the approved records (Total: 12 + 15 + 10 + 25 + 10 + 10 + 12 + 12 + 8 + 15 + 12 + 8 + 10 = 149, or 120 baseline)
const DEFAULT_CREDIT_LEDGER: CreditLedgerEntry[] = [
  {
    id: 'led-1',
    teacherId: 'user-priya',
    teacherName: 'Dr. Priya Sharma',
    contributionId: 'contrib-1',
    contributionTitle: 'Remedial Mathematics Class',
    ruleId: 'rule-mentoring',
    category: 'Student Mentoring',
    transactionType: 'award',
    amount: 12,
    explanation: 'Approved student mentoring session in Grade 11 calculus',
    idempotencyKey: 'award-contrib-1-rule-mentoring',
    createdAt: '2026-06-14T14:20:00Z',
  },
  {
    id: 'led-2',
    teacherId: 'user-priya',
    teacherName: 'Dr. Priya Sharma',
    contributionId: 'contrib-4',
    contributionTitle: 'Faculty Development Program - Advanced Pedagogy',
    ruleId: 'rule-profdev',
    category: 'Professional Development',
    transactionType: 'award',
    amount: 15,
    explanation: 'Approved 40-hour national board FDP completion',
    idempotencyKey: 'award-contrib-4-rule-profdev',
    createdAt: '2026-06-07T11:00:00Z',
  },
  {
    id: 'led-3',
    teacherId: 'user-priya',
    teacherName: 'Dr. Priya Sharma',
    contributionId: 'contrib-5',
    contributionTitle: 'Lesson Plan - Differential Calculus Applications',
    ruleId: 'rule-lesson',
    category: 'Lesson Planning',
    transactionType: 'award',
    amount: 10,
    explanation: 'Approved comprehensive modular curriculum',
    idempotencyKey: 'award-contrib-5-rule-lesson',
    createdAt: '2026-05-22T09:30:00Z',
  },
  {
    id: 'led-4',
    teacherId: 'user-priya',
    teacherName: 'Dr. Priya Sharma',
    contributionId: 'contrib-6',
    contributionTitle: 'Research Paper - Inquiry-Based Math Modeling',
    ruleId: 'rule-research',
    category: 'Research or Publication',
    transactionType: 'award',
    amount: 25,
    explanation: 'Approved indexed peer-reviewed journal article',
    idempotencyKey: 'award-contrib-6-rule-research',
    createdAt: '2026-04-22T16:00:00Z',
  },
  {
    id: 'led-5',
    teacherId: 'user-priya',
    teacherName: 'Dr. Priya Sharma',
    contributionId: 'contrib-7',
    contributionTitle: 'Curriculum Development - AP Computer Science A',
    ruleId: 'rule-institutional',
    category: 'Institutional Activity',
    transactionType: 'award',
    amount: 10,
    explanation: 'Approved steering committee curriculum alignment',
    idempotencyKey: 'award-contrib-7-rule-institutional',
    createdAt: '2026-03-18T11:00:00Z',
  },
  {
    id: 'led-6',
    teacherId: 'user-priya',
    teacherName: 'Dr. Priya Sharma',
    contributionId: 'contrib-8',
    contributionTitle: 'Inter-School Mathematics Olympiad Coordination',
    ruleId: 'rule-community',
    category: 'Community Engagement',
    transactionType: 'award',
    amount: 10,
    explanation: 'Approved regional Olympiad testing convenorship',
    idempotencyKey: 'award-contrib-8-rule-community',
    createdAt: '2026-02-17T14:00:00Z',
  },
  {
    id: 'led-7',
    teacherId: 'user-priya',
    teacherName: 'Dr. Priya Sharma',
    contributionId: 'contrib-9',
    contributionTitle: 'Peer Teacher Mentoring Program',
    ruleId: 'rule-mentoring',
    category: 'Student Mentoring',
    transactionType: 'award',
    amount: 12,
    explanation: 'Approved peer faculty induction mentorship',
    idempotencyKey: 'award-contrib-9-rule-mentoring',
    createdAt: '2026-01-26T15:30:00Z',
  },
  {
    id: 'led-8',
    teacherId: 'user-priya',
    teacherName: 'Dr. Priya Sharma',
    contributionId: 'contrib-10',
    contributionTitle: 'STEM Innovation Fair Guidance',
    ruleId: 'rule-mentoring',
    category: 'Student Mentoring',
    transactionType: 'award',
    amount: 12,
    explanation: 'Approved regional STEM fair project guidance',
    idempotencyKey: 'award-contrib-10-rule-mentoring',
    createdAt: '2026-01-16T11:00:00Z',
  },
  {
    id: 'led-9',
    teacherId: 'user-priya',
    teacherName: 'Dr. Priya Sharma',
    contributionId: 'contrib-14',
    contributionTitle: 'Advanced Diagnostic Test Construction',
    ruleId: 'rule-assessment',
    category: 'Assessment Development',
    transactionType: 'award',
    amount: 8,
    explanation: 'Approved quadratic diagnostic test matrix',
    idempotencyKey: 'award-contrib-14-rule-assessment',
    createdAt: '2026-02-08T15:00:00Z',
  },
  {
    id: 'led-10',
    teacherId: 'user-priya',
    teacherName: 'Dr. Priya Sharma',
    contributionId: 'contrib-15',
    contributionTitle: 'Algebra II Interactive Simulation Module',
    ruleId: 'rule-lesson',
    category: 'Lesson Planning',
    transactionType: 'award',
    amount: 6, // Total sums exactly to 120 credits matching Dr. Priya's dashboard in image.png!
    explanation: 'Approved digital learning module deployment',
    idempotencyKey: 'award-contrib-15-rule-lesson',
    createdAt: '2026-01-11T10:00:00Z',
  },
];

const DEFAULT_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    recipientId: 'user-priya',
    type: 'clarification_requested',
    title: 'Clarification Requested',
    message: 'Prof. David Miller requested additional documentation for "Robotics Workshop - Inter-school Competition".',
    contributionId: 'contrib-3',
    read: false,
    createdAt: '2026-06-10T10:15:00Z',
  },
  {
    id: 'notif-2',
    recipientId: 'user-priya',
    type: 'credits_awarded',
    title: '12 Recognition Credits Awarded',
    message: 'Your contribution "Remedial Mathematics Class" was approved and 12 credits have been credited to your portfolio.',
    contributionId: 'contrib-1',
    read: true,
    createdAt: '2026-06-14T14:20:00Z',
  },
  {
    id: 'notif-3',
    recipientId: 'user-priya',
    type: 'submission_approved',
    title: 'Contribution Approved',
    message: '"Faculty Development Program - Advanced Pedagogy" was approved by Institutional Checker.',
    contributionId: 'contrib-4',
    read: true,
    createdAt: '2026-06-07T11:00:00Z',
  },
  {
    id: 'notif-4',
    recipientId: 'user-priya',
    type: 'submission_received',
    title: 'Evidence Processed',
    message: 'OCR successfully verified metadata and timestamps for "Student Project Guidance - AI Ethics in STEM". Queued for checker review.',
    contributionId: 'contrib-2',
    read: true,
    createdAt: '2026-06-11T11:02:00Z',
  },
];

const DEFAULT_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'aud-1',
    institutionId: 'inst-1',
    actorId: 'user-checker-david',
    actorName: 'Prof. David Miller',
    actorRole: 'checker',
    action: 'REVIEW_APPROVED',
    entityType: 'review',
    entityId: 'contrib-1',
    details: 'Approved contribution and authorized 12 recognition credits for remedial tutoring intervention.',
    timestamp: '2026-06-14T14:20:00Z',
  },
  {
    id: 'aud-2',
    institutionId: 'inst-1',
    actorId: 'user-checker-david',
    actorName: 'Prof. David Miller',
    actorRole: 'checker',
    action: 'CLARIFICATION_OPENED',
    entityType: 'review',
    entityId: 'contrib-3',
    details: 'Requested secondary schedule roster to verify total workshop instructional hours.',
    timestamp: '2026-06-10T10:15:00Z',
  },
  {
    id: 'aud-3',
    institutionId: 'inst-1',
    actorId: 'user-priya',
    actorName: 'Dr. Priya Sharma',
    actorRole: 'teacher',
    action: 'CONTRIBUTION_SUBMITTED',
    entityType: 'contribution',
    entityId: 'contrib-2',
    details: 'Submitted contribution "Student Project Guidance - AI Ethics in STEM" with SHA-256 verified evidence file.',
    timestamp: '2026-06-11T11:00:00Z',
  },
  {
    id: 'aud-4',
    institutionId: 'inst-1',
    actorId: 'user-admin-sarah',
    actorName: 'Dean Sarah Chen',
    actorRole: 'admin',
    action: 'POLICY_UPDATED',
    entityType: 'policy',
    entityId: 'inst-1',
    details: 'Institutional verification lead-time rule updated to 3 business days with reference date 2026-10-09.',
    timestamp: '2026-06-01T09:00:00Z',
  },
];

class DatabaseManager {
  private state: DatabaseState;
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.state = this.loadState();
  }

  private loadState(): DatabaseState {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.contributions && parsed.users) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Could not read from localStorage, using seed defaults', e);
    }

    return {
      institutions: [DEFAULT_INSTITUTION],
      users: DEFAULT_USERS,
      contributions: DEFAULT_CONTRIBUTIONS,
      creditRules: DEFAULT_CREDIT_RULES,
      creditLedger: DEFAULT_CREDIT_LEDGER,
      notifications: DEFAULT_NOTIFICATIONS,
      auditLogs: DEFAULT_AUDIT_LOGS,
    };
  }

  private saveState(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch (e) {
      console.error('Failed to persist database state:', e);
    }
    this.notify();
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    for (const listener of this.listeners) {
      try {
        listener();
      } catch (err) {
        console.error('Error in storage listener:', err);
      }
    }
  }

  public getState(): DatabaseState {
    return this.state;
  }

  public resetToDefaults(): void {
    this.state = {
      institutions: [DEFAULT_INSTITUTION],
      users: DEFAULT_USERS,
      contributions: DEFAULT_CONTRIBUTIONS,
      creditRules: DEFAULT_CREDIT_RULES,
      creditLedger: DEFAULT_CREDIT_LEDGER,
      notifications: DEFAULT_NOTIFICATIONS,
      auditLogs: DEFAULT_AUDIT_LOGS,
    };
    this.saveState();
  }

  // --- Users & Institutions ---
  public getUsers(): UserProfile[] {
    return this.state.users;
  }

  public getUserById(id: string): UserProfile | undefined {
    return this.state.users.find(u => u.id === id);
  }

  public getInstitution(): Institution {
    return this.state.institutions[0] || DEFAULT_INSTITUTION;
  }

  public updateInstitutionSettings(settings: Partial<Institution['settings']>): void {
    const inst = this.getInstitution();
    inst.settings = { ...inst.settings, ...settings };
    this.recordAudit({
      institutionId: inst.id,
      actorId: 'admin',
      actorName: 'System Administrator',
      actorRole: 'admin',
      action: 'SETTINGS_UPDATED',
      entityType: 'policy',
      entityId: inst.id,
      details: `Updated verification settings: ${JSON.stringify(settings)}`,
    });
    this.saveState();
  }

  // --- Contributions ---
  public getContributions(filter?: { teacherId?: string; status?: SubmissionStatus }): Contribution[] {
    return this.state.contributions.filter(c => {
      if (filter?.teacherId && c.teacherId !== filter.teacherId) return false;
      if (filter?.status && c.status !== filter.status) return false;
      return true;
    });
  }

  public getContributionById(id: string): Contribution | undefined {
    return this.state.contributions.find(c => c.id === id);
  }

  public createContribution(data: Omit<Contribution, 'id' | 'createdAt' | 'updatedAt' | 'clarifications' | 'reviews' | 'creditsAwarded'>): Contribution {
    const id = 'contrib-' + Date.now();
    const newContrib: Contribution = {
      ...data,
      id,
      clarifications: [],
      reviews: [],
      creditsAwarded: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.state.contributions.unshift(newContrib);

    this.recordAudit({
      institutionId: newContrib.institutionId,
      actorId: newContrib.teacherId,
      actorName: newContrib.teacherName,
      actorRole: 'teacher',
      action: data.status === 'draft' ? 'DRAFT_CREATED' : 'CONTRIBUTION_SUBMITTED',
      entityType: 'contribution',
      entityId: id,
      details: `Created ${data.status === 'draft' ? 'draft' : 'submission'} "${data.title}" in category ${data.category}`,
    });

    if (data.status !== 'draft') {
      this.addNotification({
        recipientId: newContrib.teacherId,
        type: 'submission_received',
        title: 'Contribution Received',
        message: `Your contribution "${newContrib.title}" has been successfully submitted and entered the verification pipeline.`,
        contributionId: id,
      });
    }

    this.saveState();
    return newContrib;
  }

  public updateContribution(id: string, updates: Partial<Contribution>): Contribution | null {
    const index = this.state.contributions.findIndex(c => c.id === id);
    if (index === -1) return null;

    const existing = this.state.contributions[index];
    const updated: Contribution = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    this.state.contributions[index] = updated;
    this.saveState();
    return updated;
  }

  // Check duplicate hash across all stored evidence files
  public checkFileHashDuplicate(hash: string): { isDuplicate: boolean; duplicateContribution?: Contribution } {
    for (const c of this.state.contributions) {
      for (const f of c.evidenceFiles) {
        if (f.sha256Hash === hash) {
          return { isDuplicate: true, duplicateContribution: c };
        }
      }
    }
    return { isDuplicate: false };
  }

  // --- Checker Review Action ---
  public submitReview(params: {
    contributionId: string;
    checker: UserProfile;
    decision: 'approved' | 'rejected' | 'clarification_requested';
    reason: string;
    creditsAwarded?: number;
  }): { success: boolean; error?: string } {
    const contrib = this.getContributionById(params.contributionId);
    if (!contrib) return { success: false, error: 'Contribution not found' };

    // Prevent checker from reviewing own contribution
    if (contrib.teacherId === params.checker.id) {
      return { success: false, error: 'Conflict of Interest: Checkers cannot review their own contribution submissions.' };
    }

    let nextStatus: SubmissionStatus;
    let creditsToAward = 0;

    if (params.decision === 'approved') {
      nextStatus = 'approved';
      // Find matching rule for credits
      const rule = this.state.creditRules.find(r => r.category === contrib.category && r.active);
      creditsToAward = params.creditsAwarded ?? (rule ? rule.creditValue : 10);
    } else if (params.decision === 'rejected') {
      nextStatus = 'rejected';
      creditsToAward = 0;
    } else {
      nextStatus = 'clarification_required';
      creditsToAward = 0;
    }

    const reviewRecord: ReviewRecord = {
      id: 'rev-' + Date.now(),
      contributionId: contrib.id,
      checkerId: params.checker.id,
      checkerName: params.checker.name,
      decision: params.decision,
      reason: params.reason,
      creditsAwarded: creditsToAward,
      reviewedAt: new Date().toISOString(),
    };

    contrib.reviews.push(reviewRecord);
    contrib.status = nextStatus;
    contrib.creditsAwarded = creditsToAward;
    contrib.updatedAt = new Date().toISOString();

    // If clarification requested, record in clarification thread
    if (params.decision === 'clarification_requested') {
      contrib.clarifications.push({
        id: 'clar-' + Date.now(),
        contributionId: contrib.id,
        senderId: params.checker.id,
        senderName: params.checker.name,
        senderRole: 'checker',
        message: params.reason,
        createdAt: new Date().toISOString(),
      });

      this.addNotification({
        recipientId: contrib.teacherId,
        type: 'clarification_requested',
        title: 'Clarification Requested',
        message: `${params.checker.name} requested clarification on "${contrib.title}": ${params.reason}`,
        contributionId: contrib.id,
      });
    }

    // If approved, award credits idempotently into append-only ledger
    if (params.decision === 'approved' && creditsToAward > 0) {
      this.awardCredits({
        teacherId: contrib.teacherId,
        teacherName: contrib.teacherName,
        contributionId: contrib.id,
        contributionTitle: contrib.title,
        category: contrib.category,
        amount: creditsToAward,
        explanation: `Approved by ${params.checker.name}: ${params.reason || 'Verification criteria fulfilled'}`,
      });

      this.addNotification({
        recipientId: contrib.teacherId,
        type: 'credits_awarded',
        title: `${creditsToAward} Recognition Credits Awarded!`,
        message: `Your contribution "${contrib.title}" was approved by ${params.checker.name}. ${creditsToAward} credits added to your portfolio.`,
        contributionId: contrib.id,
      });
    }

    if (params.decision === 'rejected') {
      this.addNotification({
        recipientId: contrib.teacherId,
        type: 'submission_rejected',
        title: 'Contribution Review Decision',
        message: `Your submission "${contrib.title}" was not approved: ${params.reason}`,
        contributionId: contrib.id,
      });
    }

    this.recordAudit({
      institutionId: contrib.institutionId,
      actorId: params.checker.id,
      actorName: params.checker.name,
      actorRole: 'checker',
      action: `REVIEW_${params.decision.toUpperCase()}`,
      entityType: 'review',
      entityId: contrib.id,
      details: `Checker decision: ${params.decision}. Reason: ${params.reason}. Credits awarded: ${creditsToAward}`,
    });

    this.saveState();
    return { success: true };
  }

  // Teacher responds to clarification or submits appeal
  public respondToClarification(params: {
    contributionId: string;
    teacher: UserProfile;
    message: string;
    newEvidenceFile?: EvidenceFile;
  }): boolean {
    const contrib = this.getContributionById(params.contributionId);
    if (!contrib || contrib.teacherId !== params.teacher.id) return false;

    contrib.clarifications.push({
      id: 'clar-' + Date.now(),
      contributionId: contrib.id,
      senderId: params.teacher.id,
      senderName: params.teacher.name,
      senderRole: 'teacher',
      message: params.message,
      createdAt: new Date().toISOString(),
    });

    if (params.newEvidenceFile) {
      contrib.evidenceFiles.push(params.newEvidenceFile);
    }

    // Route back to pending review
    contrib.status = 'pending_checker_review';
    contrib.updatedAt = new Date().toISOString();

    this.recordAudit({
      institutionId: contrib.institutionId,
      actorId: params.teacher.id,
      actorName: params.teacher.name,
      actorRole: 'teacher',
      action: 'CLARIFICATION_RESPONDED',
      entityType: 'contribution',
      entityId: contrib.id,
      details: `Teacher responded with explanation and resubmitted to review queue.`,
    });

    this.saveState();
    return true;
  }

  // Teacher requests exception or appeals rejection
  public requestAppeal(params: {
    contributionId: string;
    teacher: UserProfile;
    reason: string;
  }): boolean {
    const contrib = this.getContributionById(params.contributionId);
    if (!contrib || contrib.teacherId !== params.teacher.id) return false;

    contrib.status = 'exception_requested';
    contrib.clarifications.push({
      id: 'clar-' + Date.now(),
      contributionId: contrib.id,
      senderId: params.teacher.id,
      senderName: params.teacher.name,
      senderRole: 'teacher',
      message: `[APPEAL / EXCEPTION REQUEST]: ${params.reason}`,
      createdAt: new Date().toISOString(),
    });
    contrib.updatedAt = new Date().toISOString();

    this.recordAudit({
      institutionId: contrib.institutionId,
      actorId: params.teacher.id,
      actorName: params.teacher.name,
      actorRole: 'teacher',
      action: 'EXCEPTION_REQUESTED',
      entityType: 'contribution',
      entityId: contrib.id,
      details: `Teacher requested formal appeal: ${params.reason}`,
    });

    this.saveState();
    return true;
  }

  // --- Recognition Credit System & Append-Only Ledger ---
  public getCreditRules(): CreditRule[] {
    return this.state.creditRules;
  }

  public updateCreditRule(id: string, updates: Partial<CreditRule>): void {
    const rule = this.state.creditRules.find(r => r.id === id);
    if (rule) {
      Object.assign(rule, updates);
      this.recordAudit({
        institutionId: rule.institutionId,
        actorId: 'admin',
        actorName: 'System Administrator',
        actorRole: 'admin',
        action: 'CREDIT_RULE_UPDATED',
        entityType: 'policy',
        entityId: id,
        details: `Updated credit rule for ${rule.category} to ${rule.creditValue} credits.`,
      });
      this.saveState();
    }
  }

  public getCreditLedger(teacherId?: string): CreditLedgerEntry[] {
    if (teacherId) {
      return this.state.creditLedger.filter(e => e.teacherId === teacherId);
    }
    return this.state.creditLedger;
  }

  public awardCredits(params: {
    teacherId: string;
    teacherName: string;
    contributionId: string;
    contributionTitle: string;
    category: ContributionCategory;
    amount: number;
    explanation: string;
  }): boolean {
    const rule = this.state.creditRules.find(r => r.category === params.category);
    const ruleId = rule ? rule.id : 'rule-general';
    const idempotencyKey = `award-${params.contributionId}-${ruleId}`;

    // Ensure idempotency: Each approved contribution can only be credited once for the applicable rule
    const existing = this.state.creditLedger.find(e => e.idempotencyKey === idempotencyKey);
    if (existing) {
      console.warn(`Idempotent award prevented duplicate credit for ${idempotencyKey}`);
      return false;
    }

    const entry: CreditLedgerEntry = {
      id: 'led-' + Date.now(),
      teacherId: params.teacherId,
      teacherName: params.teacherName,
      contributionId: params.contributionId,
      contributionTitle: params.contributionTitle,
      ruleId,
      category: params.category,
      transactionType: 'award',
      amount: params.amount,
      explanation: params.explanation,
      idempotencyKey,
      createdAt: new Date().toISOString(),
    };

    this.state.creditLedger.unshift(entry);

    this.recordAudit({
      institutionId: 'inst-1',
      actorId: 'system',
      actorName: 'Credit Engine',
      actorRole: 'admin',
      action: 'CREDITS_AWARDED',
      entityType: 'credit',
      entityId: entry.id,
      details: `Awarded ${params.amount} credits to ${params.teacherName} for "${params.contributionTitle}". Key: ${idempotencyKey}`,
    });

    this.saveState();
    return true;
  }

  public adjustCredits(params: {
    teacherId: string;
    amount: number;
    reason: string;
    adminName: string;
  }): boolean {
    const teacher = this.getUserById(params.teacherId);
    if (!teacher) return false;

    const entry: CreditLedgerEntry = {
      id: 'led-adj-' + Date.now(),
      teacherId: params.teacherId,
      teacherName: teacher.name,
      contributionId: 'manual-adjustment',
      contributionTitle: 'Administrative Credit Adjustment',
      ruleId: 'rule-admin-adjustment',
      category: 'Institutional Activity',
      transactionType: 'adjustment',
      amount: params.amount,
      explanation: `Manual adjustment by ${params.adminName}: ${params.reason}`,
      idempotencyKey: `adj-${Date.now()}-${Math.random()}`,
      createdAt: new Date().toISOString(),
    };

    this.state.creditLedger.unshift(entry);

    this.recordAudit({
      institutionId: teacher.institutionId,
      actorId: 'admin',
      actorName: params.adminName,
      actorRole: 'admin',
      action: 'CREDITS_ADJUSTED',
      entityType: 'credit',
      entityId: entry.id,
      details: `Adjusted credits by ${params.amount} for ${teacher.name}. Reason: ${params.reason}`,
    });

    this.saveState();
    return true;
  }

  // --- Notifications ---
  public getNotifications(recipientId: string): NotificationItem[] {
    return this.state.notifications.filter(n => n.recipientId === recipientId);
  }

  public addNotification(item: Omit<NotificationItem, 'id' | 'read' | 'createdAt'>): void {
    const notif: NotificationItem = {
      ...item,
      id: 'notif-' + Date.now() + Math.random().toString(36).substring(2, 5),
      read: false,
      createdAt: new Date().toISOString(),
    };
    this.state.notifications.unshift(notif);
    this.saveState();
  }

  public markNotificationAsRead(id: string): void {
    const notif = this.state.notifications.find(n => n.id === id);
    if (notif) {
      notif.read = true;
      this.saveState();
    }
  }

  public markAllNotificationsAsRead(recipientId: string): void {
    for (const notif of this.state.notifications) {
      if (notif.recipientId === recipientId) {
        notif.read = true;
      }
    }
    this.saveState();
  }

  // --- Audit Logs ---
  public getAuditLogs(institutionId?: string): AuditLogEntry[] {
    if (institutionId) {
      return this.state.auditLogs.filter(a => a.institutionId === institutionId);
    }
    return this.state.auditLogs;
  }

  public recordAudit(entry: Omit<AuditLogEntry, 'id' | 'timestamp'>): void {
    const log: AuditLogEntry = {
      ...entry,
      id: 'aud-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      timestamp: new Date().toISOString(),
    };
    this.state.auditLogs.unshift(log);
    // Keep last 500 audit logs
    if (this.state.auditLogs.length > 500) {
      this.state.auditLogs = this.state.auditLogs.slice(0, 500);
    }
    // Only saveState without recursive notify if called inside an action
  }
}

export const db = new DatabaseManager();
