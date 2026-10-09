import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../lib/storage';
import { calculateSHA256, formatBytes } from '../../lib/hash';
import { analyzeDocumentOCR, evaluateActivityDate } from '../../lib/ocr';
import {
  ContributionCategory,
  EvidenceFile,
  EvidenceAnalysis,
} from '../../types';
import {
  UploadCloud,
  FileCheck,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Sparkles,
  ShieldAlert,
  Calendar,
  FileText,
  Loader2,
  Info,
} from 'lucide-react';

interface ContributionFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export const ContributionForm: React.FC<ContributionFormProps> = ({ onSuccess, onCancel }) => {
  const { currentUser } = useAuth();
  const institution = db.getInstitution();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ContributionCategory>('Workshop or Seminar');
  const [description, setDescription] = useState('');
  const [activityDate, setActivityDate] = useState('2026-10-04');
  const [lessonPlanDate, setLessonPlanDate] = useState('');
  const [department, setDepartment] = useState(currentUser?.departmentName || 'Mathematics & Computer Science');

  // File & Verification states
  const [file, setFile] = useState<File | null>(null);
  const [fileHash, setFileHash] = useState<string>('');
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [duplicateTitle, setDuplicateTitle] = useState<string>('');
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<EvidenceAnalysis | null>(null);
  const [ocrError, setOcrError] = useState<string | null>(null);

  // Date policy check preview
  const dateEval = evaluateActivityDate(
    activityDate,
    institution.settings.referenceDate,
    institution.settings.ruleLeadDays,
    institution.settings.prohibitSameDay
  );

  const categories: ContributionCategory[] = [
    'Lesson Planning',
    'Assessment Development',
    'Student Mentoring',
    'Professional Development',
    'Workshop or Seminar',
    'Research or Publication',
    'Institutional Activity',
    'Community Engagement',
    'Other',
  ];

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // File validation: Size <= 15MB, valid types
    if (selectedFile.size > 15 * 1024 * 1024) {
      alert('File size exceeds maximum limit of 15 MB.');
      return;
    }

    setFile(selectedFile);
    setIsProcessingFile(true);
    setOcrError(null);
    setAnalysisResult(null);

    try {
      // 1. Calculate SHA-256 cryptographic hash for duplicate screening
      const hash = await calculateSHA256(selectedFile);
      setFileHash(hash);

      const dupCheck = db.checkFileHashDuplicate(hash);
      if (dupCheck.isDuplicate) {
        setIsDuplicate(true);
        setDuplicateTitle(dupCheck.duplicateContribution?.title || 'Existing Submission');
      } else {
        setIsDuplicate(false);
      }

      // 2. Read file as base64 for OCR inspection
      const reader = new FileReader();
      reader.onload = async () => {
        const base64Data = reader.result as string;
        try {
          const analysis = await analyzeDocumentOCR({
            fileData: base64Data,
            fileName: selectedFile.name,
            mimeType: selectedFile.type,
            activityDate,
            category,
            institutionTimeZone: institution.timeZone,
          });
          setAnalysisResult(analysis);
        } catch (err: any) {
          setOcrError(err.message || 'OCR processing could not read document text.');
        } finally {
          setIsProcessingFile(false);
        }
      };
      reader.readAsDataURL(selectedFile);
    } catch (err: any) {
      setIsProcessingFile(false);
      setOcrError('Failed to process evidence file.');
    }
  };

  const handleSubmit = (asDraft: boolean) => {
    if (!currentUser) return;
    if (!title.trim()) {
      alert('Please enter a contribution title.');
      return;
    }
    if (!activityDate) {
      alert('Please specify the activity date.');
      return;
    }

    // Prepare evidence file record if uploaded
    const evidenceFiles: EvidenceFile[] = [];
    if (file && fileHash) {
      evidenceFiles.push({
        id: 'ev-' + Date.now(),
        contributionId: '',
        ownerId: currentUser.id,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        sha256Hash: fileHash,
        isDuplicate,
        processingStatus: 'completed',
        uploadedAt: new Date().toISOString(),
      });
    }

    // AI Flags
    const aiFlags: string[] = [];
    if (isDuplicate) {
      aiFlags.push(`Duplicate evidence alert: SHA-256 matches file in "${duplicateTitle}".`);
    }
    if (!dateEval.passed) {
      aiFlags.push(dateEval.violationReason || 'Institutional date rule violation.');
    }
    if (analysisResult?.tamperingWarnings && analysisResult.tamperingWarnings.length > 0) {
      aiFlags.push(...analysisResult.tamperingWarnings);
    }

    const newContrib = db.createContribution({
      teacherId: currentUser.id,
      teacherName: currentUser.name,
      institutionId: currentUser.institutionId,
      title: title.trim(),
      category,
      description: description.trim(),
      activityDate,
      lessonPlanDate: lessonPlanDate || undefined,
      department,
      status: asDraft ? 'draft' : 'pending_checker_review',
      evidenceFiles,
      analysis: analysisResult || undefined,
      dateValidationResult: {
        passed: dateEval.passed,
        diffDays: dateEval.diffDays,
        violationReason: dateEval.violationReason,
        evaluatedAt: new Date().toISOString(),
      },
      aiFlags,
    });

    onSuccess();
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-8">
      <div className="flex items-center justify-between pb-6 border-b border-slate-100 mb-6">
        <div>
          <h2 className="text-xl font-bold text-[#192A56]">Submit New Contribution</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Document professional work, attach evidence, and submit for institutional review.
          </p>
        </div>
        <div className="text-right text-[11px] text-slate-400">
          <div>Ref Date: <span className="font-semibold text-slate-700">{institution.settings.referenceDate}</span></div>
          <div>Policy Window: <span className="font-semibold text-slate-700">≥ {institution.settings.ruleLeadDays} days lead time</span></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Form Fields */}
        <div className="lg:col-span-7 space-y-5">
          
          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
              Contribution Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Advanced Calculus Remedial Class or STEM Fair Mentorship"
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#192A56]/20 focus:border-[#192A56] transition-all"
            />
          </div>

          {/* Category & Department */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ContributionCategory)}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#192A56]/20 focus:border-[#192A56] transition-all"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                Department
              </label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#192A56]/20 focus:border-[#192A56] transition-all"
              />
            </div>
          </div>

          {/* Activity Date & Lesson Plan Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                Activity Date *
              </label>
              <input
                type="date"
                value={activityDate}
                onChange={(e) => setActivityDate(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#192A56]/20 focus:border-[#192A56] transition-all"
              />
              {/* Date validation inline feedback */}
              <div className="mt-1.5 text-[11px]">
                {dateEval.passed ? (
                  <span className="text-emerald-600 flex items-center gap-1 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Eligible: {dateEval.diffDays} days before reference date
                  </span>
                ) : (
                  <span className="text-amber-600 flex items-center gap-1 font-medium">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                    {dateEval.violationReason}
                  </span>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                Lesson Plan Date (Optional)
              </label>
              <input
                type="date"
                value={lessonPlanDate}
                onChange={(e) => setLessonPlanDate(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#192A56]/20 focus:border-[#192A56] transition-all"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Required for Lesson Planning category submissions
              </span>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
              Description & Objectives
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Outline the scope of the activity, number of students or teachers involved, instructional objectives, and measurable outcomes..."
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#192A56]/20 focus:border-[#192A56] transition-all resize-y"
            />
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => handleSubmit(false)}
              className="px-6 py-2.5 text-sm font-bold text-white bg-[#192A56] hover:bg-[#121f42] rounded-xl shadow-sm transition-all"
            >
              Submit for Verification
            </button>
            <button
              type="button"
              onClick={() => handleSubmit(true)}
              className="px-4 py-2.5 text-sm font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all"
            >
              Save as Draft
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2.5 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors ml-auto"
            >
              Cancel
            </button>
          </div>

        </div>

        {/* Right Column: Evidence Upload, Hash & OCR Verification */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* File Upload Box */}
          <div className="border border-dashed border-slate-300 rounded-2xl p-6 text-center bg-slate-50/50 hover:bg-slate-50 transition-colors relative">
            <input
              type="file"
              accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="w-12 h-12 rounded-xl bg-[#F7D794]/40 flex items-center justify-center mx-auto mb-3 text-[#192A56]">
              <UploadCloud className="w-6 h-6" />
            </div>
            <div className="text-sm font-bold text-slate-800 mb-1">
              {file ? file.name : 'Upload Supporting Evidence'}
            </div>
            <p className="text-xs text-slate-500 mb-2">
              {file ? `${formatBytes(file.size)} • Click to replace` : 'PDF, JPEG, or PNG up to 15MB'}
            </p>
            <div className="inline-block px-3 py-1 bg-white border border-slate-200 rounded-lg text-[11px] font-semibold text-slate-700 shadow-2xs">
              Select Evidence File
            </div>
          </div>

          {/* Processing Indicator */}
          {isProcessingFile && (
            <div className="p-4 rounded-xl bg-[#FFF8ED] border border-[#F7D794]/60 flex items-center gap-3 animate-pulse">
              <Loader2 className="w-5 h-5 text-amber-600 animate-spin shrink-0" />
              <div>
                <div className="text-xs font-bold text-amber-900">Running Automated Evidence Checks...</div>
                <div className="text-[11px] text-amber-700">Computing SHA-256 hash & reading text with OCR</div>
              </div>
            </div>
          )}

          {/* Cryptographic SHA-256 Duplicate Check Alert */}
          {fileHash && (
            <div className={`p-4 rounded-xl border text-xs ${
              isDuplicate
                ? 'bg-rose-50 border-rose-200 text-rose-900'
                : 'bg-emerald-50 border-emerald-200 text-emerald-900'
            }`}>
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold flex items-center gap-1.5">
                  {isDuplicate ? (
                    <>
                      <ShieldAlert className="w-4 h-4 text-rose-600" />
                      Duplicate Hash Detected
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Unique Document Hash
                    </>
                  )}
                </span>
                <span className="text-[10px] text-slate-400 uppercase font-mono">SHA-256</span>
              </div>
              <div className="font-mono text-[10px] break-all opacity-80 mb-2">
                {fileHash.slice(0, 32)}...
              </div>
              {isDuplicate && (
                <div className="text-[11px] bg-rose-100/70 p-2 rounded-lg">
                  <strong>Flagged for Review:</strong> An identical file was previously submitted in "{duplicateTitle}". Checker will review context.
                </div>
              )}
            </div>
          )}

          {/* OCR Extracted Metadata Card */}
          {analysisResult && (
            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#192A56]">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>OCR Extracted Findings</span>
                </div>
                <span className="text-[10px] font-semibold text-slate-400">
                  Confidence: {Math.round(analysisResult.confidenceScore * 100)}%
                </span>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between py-0.5 border-b border-slate-50">
                  <span className="text-slate-500">Document Title:</span>
                  <span className="font-medium text-slate-900 truncate max-w-[200px]">
                    {analysisResult.documentTitle}
                  </span>
                </div>
                <div className="flex justify-between py-0.5 border-b border-slate-50">
                  <span className="text-slate-500">Detected Date:</span>
                  <span className="font-semibold text-slate-900">
                    {analysisResult.primaryDate}
                  </span>
                </div>
                <div className="flex justify-between py-0.5 border-b border-slate-50">
                  <span className="text-slate-500">Teacher Name:</span>
                  <span className="font-medium text-slate-900">
                    {analysisResult.teacherName || 'Dr. Priya Sharma'}
                  </span>
                </div>
                <div className="flex justify-between py-0.5">
                  <span className="text-slate-500">Provider:</span>
                  <span className="font-medium text-slate-700">
                    {analysisResult.ocrProvider}
                  </span>
                </div>
              </div>

              {analysisResult.extractedTextSample && (
                <div className="mt-2 p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-[11px] text-slate-600 italic">
                  "{analysisResult.extractedTextSample.slice(0, 160)}..."
                </div>
              )}
            </div>
          )}

          {/* Institutional Policy Notice */}
          <div className="p-3.5 rounded-xl bg-slate-100 text-slate-600 text-xs flex items-start gap-2.5">
            <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
            <p className="leading-relaxed text-[11px]">
              AI assistance performs initial screening only. An authorized institutional checker will examine all materials before final approval and credit issuance.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};
