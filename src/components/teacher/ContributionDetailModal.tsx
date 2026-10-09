import React, { useState } from 'react';
import { Contribution } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../lib/storage';
import {
  X,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  MessageSquare,
  Send,
  ShieldAlert,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

interface ContributionDetailModalProps {
  contribution: Contribution;
  onClose: () => void;
  onUpdated: () => void;
}

export const ContributionDetailModal: React.FC<ContributionDetailModalProps> = ({
  contribution,
  onClose,
  onUpdated,
}) => {
  const { currentUser } = useAuth();
  const [replyText, setReplyText] = useState('');
  const [appealText, setAppealText] = useState('');
  const [showAppealBox, setShowAppealBox] = useState(false);

  const handleSendClarification = () => {
    if (!currentUser || !replyText.trim()) return;

    db.respondToClarification({
      contributionId: contribution.id,
      teacher: currentUser,
      message: replyText.trim(),
    });

    setReplyText('');
    onUpdated();
  };

  const handleSendAppeal = () => {
    if (!currentUser || !appealText.trim()) return;

    db.requestAppeal({
      contributionId: contribution.id,
      teacher: currentUser,
      reason: appealText.trim(),
    });

    setAppealText('');
    setShowAppealBox(false);
    onUpdated();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-100 text-emerald-800">Approved</span>;
      case 'rejected':
        return <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-rose-100 text-rose-800">Rejected</span>;
      case 'clarification_required':
        return <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-amber-100 text-amber-800">Clarification Required</span>;
      case 'pending_checker_review':
        return <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-blue-100 text-blue-800">Pending Review</span>;
      case 'exception_requested':
        return <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-purple-100 text-purple-800">Appeal / Exception Pending</span>;
      default:
        return <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-slate-100 text-slate-800 capitalize">{status.replace('_', ' ')}</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
        
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-bold text-[#192A56]">{contribution.title}</h2>
              {getStatusBadge(contribution.status)}
            </div>
            <div className="text-xs text-slate-500 mt-1 flex items-center gap-3">
              <span>Category: <strong>{contribution.category}</strong></span>
              <span>·</span>
              <span>Activity Date: <strong>{contribution.activityDate}</strong></span>
              <span>·</span>
              <span>Credits: <strong>{contribution.creditsAwarded}</strong></span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          
          {/* Description */}
          <div>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
              Description & Objectives
            </h4>
            <p className="text-sm text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-100 leading-relaxed">
              {contribution.description || 'No detailed description provided.'}
            </p>
          </div>

          {/* AI Flags / Warnings if any */}
          {contribution.aiFlags && contribution.aiFlags.length > 0 && (
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-1">
              <div className="font-bold flex items-center gap-1.5 mb-1 text-amber-800">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Automated Screening Flags</span>
              </div>
              {contribution.aiFlags.map((flag, idx) => (
                <div key={idx} className="flex items-start gap-1.5">
                  <span className="text-amber-500 font-bold">•</span>
                  <span>{flag}</span>
                </div>
              ))}
            </div>
          )}

          {/* Evidence Files List */}
          <div>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">
              Attached Supporting Evidence
            </h4>
            {contribution.evidenceFiles.length === 0 ? (
              <div className="text-xs text-slate-400 italic">No evidence files attached.</div>
            ) : (
              <div className="space-y-2">
                {contribution.evidenceFiles.map((ev) => (
                  <div
                    key={ev.id}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <FileText className="w-4 h-4 text-slate-500 shrink-0" />
                      <div className="truncate">
                        <div className="font-semibold text-slate-900 truncate">{ev.fileName}</div>
                        <div className="text-[10px] text-slate-400 font-mono truncate">
                          SHA-256: {ev.sha256Hash.slice(0, 24)}...
                        </div>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-100 text-emerald-800 shrink-0">
                      Hash Verified
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* OCR Analysis Findings */}
          {contribution.analysis && (
            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-[#192A56] border-b border-slate-100 pb-2">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  OCR Extraction Report
                </span>
                <span className="text-slate-400 font-normal text-[11px]">
                  Provider: {contribution.analysis.ocrProvider}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs pt-1">
                <div>
                  <span className="text-slate-400 text-[11px] block">Extracted Title:</span>
                  <span className="font-medium text-slate-800">{contribution.analysis.documentTitle}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px] block">Document Date:</span>
                  <span className="font-semibold text-slate-900">{contribution.analysis.primaryDate}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px] block">Educator Name:</span>
                  <span className="font-medium text-slate-800">{contribution.analysis.teacherName || 'Dr. Priya Sharma'}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px] block">Confidence:</span>
                  <span className="font-medium text-emerald-700">
                    {Math.round(contribution.analysis.confidenceScore * 100)}%
                  </span>
                </div>
              </div>
              {contribution.analysis.extractedTextSample && (
                <div className="text-[11px] text-slate-500 italic bg-slate-50 p-2.5 rounded-lg border border-slate-100 mt-2">
                  "{contribution.analysis.extractedTextSample}"
                </div>
              )}
            </div>
          )}

          {/* Checker Reviews History */}
          {contribution.reviews.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">
                Review Decision History
              </h4>
              <div className="space-y-2">
                {contribution.reviews.map((rev) => (
                  <div key={rev.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-slate-800">{rev.checkerName}</span>
                      <span className="text-slate-400 text-[10px]">{new Date(rev.reviewedAt).toLocaleDateString()}</span>
                    </div>
                    <div className="text-slate-600 mb-1">
                      Decision: <strong>{rev.decision.replace('_', ' ')}</strong>
                      {rev.creditsAwarded ? ` · Awarded: ${rev.creditsAwarded} credits` : ''}
                    </div>
                    {rev.reason && (
                      <p className="text-slate-500 italic bg-white p-2 rounded border border-slate-100">
                        "{rev.reason}"
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Clarification Conversation Thread */}
          {contribution.clarifications.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
                <span>Clarification Discussion Thread</span>
              </h4>
              <div className="space-y-2.5 bg-slate-50 p-4 rounded-xl border border-slate-200">
                {contribution.clarifications.map((msg) => {
                  const isTeacher = msg.senderRole === 'teacher';
                  return (
                    <div
                      key={msg.id}
                      className={`p-3 rounded-xl text-xs max-w-[85%] ${
                        isTeacher
                          ? 'ml-auto bg-[#192A56] text-white'
                          : 'mr-auto bg-white border border-slate-200 text-slate-800'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-4 mb-1 text-[10px] opacity-75">
                        <span className="font-semibold">{msg.senderName} ({msg.senderRole})</span>
                        <span>{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <p className="leading-relaxed">{msg.message}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Reply Box if Clarification Required */}
          {contribution.status === 'clarification_required' && (
            <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 space-y-3">
              <div className="text-xs font-bold text-blue-900">
                Respond to Checker & Resubmit for Review
              </div>
              <textarea
                rows={3}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Provide additional details, context, or clarify document details requested by the reviewer..."
                className="w-full p-3 text-xs bg-white border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <button
                onClick={handleSendClarification}
                className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-1.5 shadow-xs transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Response & Resubmit</span>
              </button>
            </div>
          )}

          {/* Appeal / Exception Option for Rejected Submissions */}
          {contribution.status === 'rejected' && (
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              {!showAppealBox ? (
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-600">Dispute this decision?</span>
                  <button
                    onClick={() => setShowAppealBox(true)}
                    className="px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 hover:bg-rose-100 rounded-lg transition-colors"
                  >
                    Request Formal Appeal / Exception
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="text-xs font-bold text-rose-900">
                    Submit Formal Appeal to Institutional Board
                  </div>
                  <textarea
                    rows={3}
                    value={appealText}
                    onChange={(e) => setAppealText(e.target.value)}
                    placeholder="State your institutional justification or reference supporting policies..."
                    className="w-full p-3 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400"
                  />
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleSendAppeal}
                      className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-xs"
                    >
                      Submit Appeal
                    </button>
                    <button
                      onClick={() => setShowAppealBox(false)}
                      className="px-3 py-2 text-xs text-slate-600 hover:text-slate-900"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 rounded-b-2xl flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 bg-white border border-slate-200 rounded-lg shadow-xs"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
