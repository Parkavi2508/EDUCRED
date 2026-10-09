import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../lib/storage';
import { Contribution, SubmissionStatus } from '../../types';
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  Clock,
  Sparkles,
  AlertTriangle,
  FileText,
  Search,
  MessageSquare,
  ShieldCheck,
  Award,
  ChevronRight,
  Send,
  UserCheck,
} from 'lucide-react';

export const CheckerWorkspace: React.FC = () => {
  const { currentUser } = useAuth();
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [selectedContrib, setSelectedContrib] = useState<Contribution | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('pending');
  const [searchQuery, setSearchQuery] = useState('');

  // Decision Form State
  const [decision, setDecision] = useState<'approved' | 'rejected' | 'clarification_requested'>('approved');
  const [reason, setReason] = useState('');
  const [customCredits, setCustomCredits] = useState<number>(10);
  const [decisionError, setDecisionError] = useState<string | null>(null);
  const [decisionSuccess, setDecisionSuccess] = useState<string | null>(null);

  const loadData = () => {
    // Checkers see all contributions in their institution
    setContributions(db.getContributions());
  };

  useEffect(() => {
    loadData();
    return db.subscribe(loadData);
  }, []);

  // Update default credits when selected contribution changes
  useEffect(() => {
    if (selectedContrib) {
      const rules = db.getCreditRules();
      const matchingRule = rules.find(r => r.category === selectedContrib.category);
      setCustomCredits(matchingRule ? matchingRule.creditValue : 10);
      setReason('');
      setDecisionError(null);
      setDecisionSuccess(null);
    }
  }, [selectedContrib]);

  // Filter list
  const filteredList = contributions.filter((c) => {
    if (filterStatus === 'pending') {
      if (c.status !== 'pending_checker_review' && c.status !== 'clarification_required' && c.status !== 'exception_requested') {
        return false;
      }
    } else if (filterStatus !== 'all') {
      if (c.status !== filterStatus) return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        c.title.toLowerCase().includes(q) ||
        c.teacherName.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleDecisionSubmit = () => {
    if (!currentUser || !selectedContrib) return;

    if (decision === 'rejected' && !reason.trim()) {
      setDecisionError('A clear justification reason is mandatory for rejecting a submission.');
      return;
    }

    if (decision === 'clarification_requested' && !reason.trim()) {
      setDecisionError('Please specify the exact clarification or missing documents requested from the teacher.');
      return;
    }

    const result = db.submitReview({
      contributionId: selectedContrib.id,
      checker: currentUser,
      decision,
      reason: reason.trim(),
      creditsAwarded: decision === 'approved' ? customCredits : 0,
    });

    if (!result.success) {
      setDecisionError(result.error || 'Failed to submit review decision.');
      return;
    }

    setDecisionSuccess(`Successfully finalized review decision: ${decision.replace('_', ' ')}.`);
    loadData();
    setTimeout(() => {
      setSelectedContrib(null);
      setDecisionSuccess(null);
    }, 1200);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Workspace Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-rose-600 uppercase tracking-wide">
            <UserCheck className="w-4 h-4" />
            <span>Institutional Checker Console</span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#192A56] tracking-tight mt-0.5">
            Contribution Verification Queue
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Review educator evidence, inspect AI screening indicators, and issue certified decisions.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200 text-xs">
          <span className="text-slate-500 font-medium">Logged as Reviewer:</span>
          <span className="font-bold text-[#192A56]">{currentUser?.name}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Queue List */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Search & Tabs */}
          <div className="space-y-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search teacher, title, or category..."
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#192A56]/20"
              />
            </div>

            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs">
              <button
                onClick={() => setFilterStatus('pending')}
                className={`flex-1 py-1.5 rounded-lg font-medium transition-all ${
                  filterStatus === 'pending'
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Needs Review ({contributions.filter(c => c.status === 'pending_checker_review' || c.status === 'clarification_required' || c.status === 'exception_requested').length})
              </button>
              <button
                onClick={() => setFilterStatus('approved')}
                className={`flex-1 py-1.5 rounded-lg font-medium transition-all ${
                  filterStatus === 'approved'
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Approved
              </button>
              <button
                onClick={() => setFilterStatus('all')}
                className={`flex-1 py-1.5 rounded-lg font-medium transition-all ${
                  filterStatus === 'all'
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All
              </button>
            </div>
          </div>

          {/* Queue Items */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs divide-y divide-slate-100 overflow-hidden">
            {filteredList.length === 0 ? (
              <div className="p-12 text-center text-slate-400 text-xs">
                No submissions in current queue.
              </div>
            ) : (
              filteredList.map((c) => {
                const isSelected = selectedContrib?.id === c.id;
                const hasFlags = c.aiFlags && c.aiFlags.length > 0;
                return (
                  <div
                    key={c.id}
                    onClick={() => setSelectedContrib(c)}
                    className={`p-4 cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-[#192A56]/5 border-l-4 border-l-[#192A56]'
                        : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="text-xs font-bold text-slate-900 line-clamp-1">
                          {c.title}
                        </div>
                        <div className="text-[11px] text-slate-500 font-medium mt-0.5">
                          {c.teacherName} • {c.department || 'Faculty'}
                        </div>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold shrink-0 ${
                        c.status === 'approved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : c.status === 'clarification_required'
                          ? 'bg-amber-100 text-amber-800'
                          : c.status === 'exception_requested'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {c.status.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2">
                      <span>Date: {c.activityDate}</span>
                      {hasFlags && (
                        <span className="text-amber-600 font-bold flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          Screening Flags
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

        </div>

        {/* Right Column: Detailed Review Workspace */}
        <div className="lg:col-span-7">
          {!selectedContrib ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400 shadow-xs">
              <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-sm font-bold text-slate-700">Select a submission to review</h3>
              <p className="text-xs text-slate-400 mt-1">
                Inspect evidence attachments, verify OCR extractions, and evaluate date policies.
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
              
              {/* Submission Heading */}
              <div className="border-b border-slate-100 pb-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">
                    {selectedContrib.category}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    ID: {selectedContrib.id}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-[#192A56] mt-1">
                  {selectedContrib.title}
                </h2>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-2">
                  <span>Teacher: <strong className="text-slate-800">{selectedContrib.teacherName}</strong></span>
                  <span>•</span>
                  <span>Activity Date: <strong className="text-slate-800">{selectedContrib.activityDate}</strong></span>
                  <span>•</span>
                  <span>Submitted: {new Date(selectedContrib.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                  Teacher Objectives & Description
                </h4>
                <p className="text-xs text-slate-700 bg-slate-50 p-3.5 rounded-xl border border-slate-100 leading-relaxed">
                  {selectedContrib.description || 'No description provided.'}
                </p>
              </div>

              {/* Automated AI Screening & Flag Banner */}
              {selectedContrib.aiFlags && selectedContrib.aiFlags.length > 0 && (
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-1.5">
                  <div className="font-bold flex items-center gap-1.5 text-amber-800">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <span>Automated Screening Alerts:</span>
                  </div>
                  {selectedContrib.aiFlags.map((flag, idx) => (
                    <div key={idx} className="flex items-start gap-1.5 text-[11px]">
                      <span className="text-amber-500 font-bold">•</span>
                      <span>{flag}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Evidence File & Cryptographic Hash */}
              <div>
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">
                  Submitted Evidence Documents
                </h4>
                {selectedContrib.evidenceFiles.map((ev) => (
                  <div
                    key={ev.id}
                    className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <FileText className="w-5 h-5 text-slate-600 shrink-0" />
                      <div className="truncate">
                        <div className="font-bold text-slate-900 truncate">{ev.fileName}</div>
                        <div className="font-mono text-[10px] text-slate-400 truncate">
                          SHA-256: {ev.sha256Hash}
                        </div>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded bg-white border border-slate-200 text-[10px] font-bold text-slate-700 shadow-2xs shrink-0">
                      Integrity Checked
                    </span>
                  </div>
                ))}
              </div>

              {/* OCR Document Analysis Inspection */}
              {selectedContrib.analysis && (
                <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-[#192A56] border-b border-slate-100 pb-2">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      OCR Machine Verification
                    </span>
                    <span className="text-[10px] text-slate-400 font-normal">
                      Confidence: {Math.round(selectedContrib.analysis.confidenceScore * 100)}%
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs pt-1">
                    <div>
                      <span className="text-[11px] text-slate-400 block">Extracted Title:</span>
                      <span className="font-medium text-slate-800">{selectedContrib.analysis.documentTitle}</span>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-400 block">Detected Date:</span>
                      <span className="font-bold text-slate-900">{selectedContrib.analysis.primaryDate}</span>
                    </div>
                  </div>

                  {selectedContrib.analysis.extractedTextSample && (
                    <div className="text-[11px] text-slate-500 italic bg-slate-50 p-2.5 rounded-lg border border-slate-100 mt-2">
                      "{selectedContrib.analysis.extractedTextSample}"
                    </div>
                  )}
                </div>
              )}

              {/* Clarification History Thread */}
              {selectedContrib.clarifications.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
                    <span>Prior Clarification Thread</span>
                  </h4>
                  <div className="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-200 max-h-48 overflow-y-auto">
                    {selectedContrib.clarifications.map((msg) => (
                      <div key={msg.id} className="p-2.5 rounded-lg bg-white border border-slate-200 text-xs">
                        <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                          <span className="font-bold text-slate-700">{msg.senderName} ({msg.senderRole})</span>
                          <span>{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <p className="text-slate-700">{msg.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Conflict of Interest Warning if checker is the teacher */}
              {selectedContrib.teacherId === currentUser?.id ? (
                <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-center gap-2">
                  <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                  <span>
                    <strong>Conflict of Interest Rule:</strong> You cannot review or approve your own contribution submission.
                  </span>
                </div>
              ) : (
                /* Checker Decision Box */
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                    Record Verification Decision
                  </h3>

                  {/* Decision Radio Buttons */}
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setDecision('approved')}
                      className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                        decision === 'approved'
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Approve</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDecision('clarification_requested')}
                      className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                        decision === 'clarification_requested'
                          ? 'bg-amber-500 text-white border-amber-500 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                      <span>Request Clarification</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDecision('rejected')}
                      className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                        decision === 'rejected'
                          ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Reject</span>
                    </button>
                  </div>

                  {/* Credits input if approving */}
                  {decision === 'approved' && (
                    <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-slate-200 text-xs">
                      <Award className="w-4 h-4 text-amber-500 shrink-0" />
                      <span className="font-medium text-slate-700">Recognition Credits to Award:</span>
                      <input
                        type="number"
                        min="1"
                        max="100"
                        value={customCredits}
                        onChange={(e) => setCustomCredits(parseInt(e.target.value) || 0)}
                        className="w-20 px-2.5 py-1 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold text-slate-900 text-center"
                      />
                      <span className="text-[11px] text-slate-400">pts (tied to {selectedContrib.category} rule)</span>
                    </div>
                  )}

                  {/* Justification / Message text */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {decision === 'approved'
                        ? 'Approval Comments (Optional)'
                        : decision === 'clarification_requested'
                        ? 'Required Clarification / Additional Documents Needed *'
                        : 'Rejection Reason & Policy Basis *'}
                    </label>
                    <textarea
                      rows={3}
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      placeholder={
                        decision === 'approved'
                          ? 'e.g. Verified with department head, fulfills all instructional requirements...'
                          : decision === 'clarification_requested'
                          ? 'e.g. Please provide student roster or official signature page...'
                          : 'e.g. Evidence file does not match stated activity date window...'
                      }
                      className="w-full p-3 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#192A56]/20"
                    />
                  </div>

                  {/* Error / Success messages */}
                  {decisionError && (
                    <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium">
                      {decisionError}
                    </div>
                  )}
                  {decisionSuccess && (
                    <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium">
                      {decisionSuccess}
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    onClick={handleDecisionSubmit}
                    className="w-full py-3 text-xs font-bold text-white bg-[#192A56] hover:bg-[#121f42] rounded-xl shadow-xs transition-all flex items-center justify-center gap-2"
                  >
                    <span>Finalize Review Decision</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}

            </div>
          )}
        </div>

      </div>

    </div>
  );
};
