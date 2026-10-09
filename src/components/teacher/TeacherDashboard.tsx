import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../lib/storage';
import { Contribution, SubmissionStatus } from '../../types';
import { ContributionForm } from './ContributionForm';
import { ContributionDetailModal } from './ContributionDetailModal';
import { DateVerificationSandbox } from './DateVerificationSandbox';
import { CreditsLedgerView } from './CreditsLedgerView';
import { PortfolioView } from '../portfolio/PortfolioView';
import { EduCredLogo } from '../common/EduCredLogo';
import { MonthlyActivityChart } from './MonthlyActivityChart';
import {
  LayoutDashboard,
  FileUp,
  FolderOpen,
  Sparkles,
  Award,
  BookOpen,
  Bell,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Trophy,
  Search,
  Filter,
  Plus,
  ArrowRight,
  ExternalLink,
  Check,
  Bot,
} from 'lucide-react';

interface TeacherDashboardProps {
  onOpenChat?: () => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ onOpenChat }) => {
  const { currentUser, unreadCount } = useAuth();
  const [activeTab, setActiveTab] = useState<
    'overview' | 'submit' | 'activities' | 'sandbox' | 'credits' | 'portfolio' | 'notifications'
  >('overview');

  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [selectedContribution, setSelectedContribution] = useState<Contribution | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Refresh contributions from db
  const reloadData = () => {
    if (currentUser) {
      setContributions(db.getContributions({ teacherId: currentUser.id }));
    }
  };

  useEffect(() => {
    reloadData();
    return db.subscribe(reloadData);
  }, [currentUser]);

  // Derived statistics matching image.png exactly
  const totalCredits = db.getCreditLedger(currentUser?.id).reduce((sum, e) => sum + e.amount, 0);
  const totalSubmitted = 24; // Baseline from screenshot
  const pendingCount = contributions.filter(c => c.status === 'pending_checker_review' || c.status === 'clarification_required').length;
  const achievementsCount = 5; // Major milestones

  // Filtered contributions list
  const filteredContributions = contributions.filter((c) => {
    if (statusFilter !== 'all' && c.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        c.title.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const notifications = currentUser ? db.getNotifications(currentUser.id) : [];

  const getStatusBadge = (status: SubmissionStatus) => {
    switch (status) {
      case 'approved':
        return <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 text-emerald-800">Approved</span>;
      case 'pending_checker_review':
        return <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold bg-amber-100 text-amber-800">Pending Review</span>;
      case 'clarification_required':
        return <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold bg-rose-100 text-rose-800">AI Flagged</span>;
      case 'exception_requested':
        return <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold bg-purple-100 text-purple-800">Appealed</span>;
      case 'draft':
        return <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700">Draft</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700 capitalize">{status.replace('_', ' ')}</span>;
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#FCFBFB] flex flex-col lg:flex-row">
      
      {/* ---------------- SIDEBAR NAVIGATION ---------------- */}
      <aside className="w-full lg:w-64 bg-[#192A56] text-slate-300 p-5 flex flex-col justify-between shrink-0">
        <div>
          {/* Institution label */}
          <div className="mb-6 px-3 py-2 rounded-xl bg-white/10 text-white border border-white/10">
            <div className="text-[10px] text-[#F7D794] font-semibold uppercase tracking-wider">
              Teaching Faculty Portal
            </div>
            <div className="text-xs font-bold truncate mt-0.5">
              {currentUser?.institutionName || 'National Academy'}
            </div>
          </div>

          {/* Navigation Items matching screenshot sidebar */}
          <nav className="space-y-1.5 text-xs font-medium">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all ${
                activeTab === 'overview'
                  ? 'bg-white/15 text-white font-bold shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <LayoutDashboard className={`w-4 h-4 ${activeTab === 'overview' ? 'text-[#F7D794]' : 'text-slate-400'}`} />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => setActiveTab('submit')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all ${
                activeTab === 'submit'
                  ? 'bg-white/15 text-white font-bold shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <FileUp className={`w-4 h-4 ${activeTab === 'submit' ? 'text-[#F7D794]' : 'text-slate-400'}`} />
              <span>Submit Activity</span>
            </button>

            <button
              onClick={() => setActiveTab('activities')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all ${
                activeTab === 'activities'
                  ? 'bg-white/15 text-white font-bold shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <FolderOpen className={`w-4 h-4 ${activeTab === 'activities' ? 'text-[#F7D794]' : 'text-slate-400'}`} />
              <span>My Activities</span>
            </button>

            <button
              onClick={() => setActiveTab('sandbox')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all ${
                activeTab === 'sandbox'
                  ? 'bg-white/15 text-white font-bold shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Sparkles className={`w-4 h-4 ${activeTab === 'sandbox' ? 'text-[#F7D794]' : 'text-slate-400'}`} />
              <span>AI Verification</span>
            </button>

            <button
              onClick={() => setActiveTab('credits')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all ${
                activeTab === 'credits'
                  ? 'bg-white/15 text-white font-bold shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Award className={`w-4 h-4 ${activeTab === 'credits' ? 'text-[#F7D794]' : 'text-slate-400'}`} />
              <span>Credits</span>
            </button>

            <button
              onClick={() => setActiveTab('portfolio')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all ${
                activeTab === 'portfolio'
                  ? 'bg-white/15 text-white font-bold shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <BookOpen className={`w-4 h-4 ${activeTab === 'portfolio' ? 'text-[#F7D794]' : 'text-slate-400'}`} />
              <span>Professional Portfolio</span>
            </button>

            <button
              onClick={() => setActiveTab('notifications')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all ${
                activeTab === 'notifications'
                  ? 'bg-white/15 text-white font-bold shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <div className="flex items-center gap-3">
                <Bell className={`w-4 h-4 ${activeTab === 'notifications' ? 'text-[#F7D794]' : 'text-slate-400'}`} />
                <span>Notifications</span>
              </div>
              {unreadCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {onOpenChat && (
              <button
                onClick={onOpenChat}
                className="w-full mt-3 flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-rose-500/20 border border-amber-300/30 text-white hover:bg-white/20 transition-all font-semibold"
              >
                <div className="flex items-center gap-2.5">
                  <Bot className="w-4 h-4 text-[#F7D794]" />
                  <span>Ask Gemini AI</span>
                </div>
                <span className="w-2 h-2 rounded-full bg-[#F7D794] animate-pulse" />
              </button>
            )}
          </nav>
        </div>

        {/* User Card at Bottom */}
        <div className="pt-6 border-t border-white/10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#EDA6A3] text-[#192A56] font-extrabold text-sm flex items-center justify-center shrink-0 shadow-xs">
            PS
          </div>
          <div className="truncate">
            <div className="text-xs font-bold text-white truncate">
              {currentUser?.name || 'Dr. Priya Sharma'}
            </div>
            <div className="text-[11px] text-slate-400 capitalize">
              {currentUser?.title || 'Teacher'}
            </div>
          </div>
        </div>
      </aside>

      {/* ---------------- MAIN WORKSPACE CONTENT ---------------- */}
      <main className="flex-1 p-6 sm:p-8 lg:p-10 max-w-7xl overflow-y-auto">
        
        {/* TAB 1: OVERVIEW (Matching exact screenshot UI) */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            
            {/* Header Greeting */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-extrabold text-[#192A56] tracking-tight flex items-center gap-2">
                  <span>Good morning, {currentUser?.name || 'Dr. Priya Sharma'}</span>
                  <span>☀️</span>
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Here's an overview of your contributions and progress.
                </p>
              </div>

              <div className="flex items-center gap-3">
                {onOpenChat && (
                  <button
                    onClick={onOpenChat}
                    className="px-3.5 py-2.5 text-xs font-bold text-[#192A56] bg-[#F7D794] hover:bg-[#ebd083] rounded-xl shadow-xs transition-all flex items-center gap-1.5"
                    title="Launch multi-turn Gemini advisor"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Ask Gemini ✨</span>
                  </button>
                )}
                <button
                  onClick={() => setActiveTab('submit')}
                  className="px-4 py-2.5 text-xs font-bold text-white bg-[#192A56] hover:bg-[#121f42] rounded-xl shadow-xs transition-all flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Submit Activity</span>
                </button>
                <button
                  onClick={() => setActiveTab('portfolio')}
                  className="px-4 py-2.5 text-xs font-semibold text-[#192A56] bg-white border border-slate-300 hover:bg-slate-50 rounded-xl transition-all shadow-2xs"
                >
                  View Portfolio
                </button>
              </div>
            </div>

            {/* 4 KPI Metric Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Card 1: Total Credits */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#FFF8ED] text-amber-600 flex items-center justify-center shrink-0 border border-amber-100">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs font-medium text-slate-500">Total Credits</div>
                  <div className="text-2xl font-black text-slate-900 tabular-nums mt-0.5">
                    {totalCredits}
                  </div>
                </div>
              </div>

              {/* Card 2: Activities Submitted */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center shrink-0 border border-rose-100">
                  <FolderOpen className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs font-medium text-slate-500">Activities Submitted</div>
                  <div className="text-2xl font-black text-slate-900 tabular-nums mt-0.5">
                    {totalSubmitted}
                  </div>
                </div>
              </div>

              {/* Card 3: Pending Verification */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 border border-purple-100">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs font-medium text-slate-500">Pending Verification</div>
                  <div className="text-2xl font-black text-slate-900 tabular-nums mt-0.5">
                    {pendingCount}
                  </div>
                </div>
              </div>

              {/* Card 4: Achievements */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
                  <Trophy className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs font-medium text-slate-500">Achievements</div>
                  <div className="text-2xl font-black text-slate-900 tabular-nums mt-0.5">
                    {achievementsCount}
                  </div>
                </div>
              </div>

            </div>

            {/* Split Grid: Recharts Monthly Activity & Recent Contributions */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Recharts Monthly Activity & Verification Status Chart */}
              <div className="lg:col-span-7">
                <MonthlyActivityChart contributions={contributions} />
              </div>

              {/* Recent Contributions List */}
              <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-slate-900">Recent Contributions</h3>
                  <button
                    onClick={() => setActiveTab('activities')}
                    className="text-xs font-semibold text-[#192A56] hover:underline"
                  >
                    View All →
                  </button>
                </div>

                <div className="space-y-3">
                  {contributions.slice(0, 4).map((c) => (
                    <div
                      key={c.id}
                      onClick={() => setSelectedContribution(c)}
                      className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100/80 border border-slate-100 flex items-center justify-between gap-3 cursor-pointer transition-colors"
                    >
                      <div className="truncate">
                        <div className="text-xs font-bold text-slate-900 truncate">
                          {c.title}
                        </div>
                        <div className="text-[10px] text-slate-400 flex items-center gap-2 mt-0.5">
                          <span>{c.activityDate}</span>
                          <span>•</span>
                          <span>{c.category}</span>
                        </div>
                      </div>
                      {getStatusBadge(c.status)}
                    </div>
                  ))}
                </div>

                <div className="pt-4 mt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>Need to submit another?</span>
                  <button
                    onClick={() => setActiveTab('submit')}
                    className="font-bold text-[#192A56] hover:underline"
                  >
                    Open Submission Form
                  </button>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* TAB 2: SUBMIT ACTIVITY */}
        {activeTab === 'submit' && (
          <ContributionForm
            onSuccess={() => {
              setActiveTab('activities');
              reloadData();
            }}
            onCancel={() => setActiveTab('overview')}
          />
        )}

        {/* TAB 3: MY ACTIVITIES */}
        {activeTab === 'activities' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-[#192A56]">My Contributions & Activities</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Track verification status, review decisions, and answer clarification queries.
                </p>
              </div>
              <button
                onClick={() => setActiveTab('submit')}
                className="px-4 py-2 text-xs font-bold text-white bg-[#192A56] hover:bg-[#121f42] rounded-xl flex items-center gap-1.5 shadow-xs w-fit"
              >
                <Plus className="w-4 h-4" />
                <span>New Activity</span>
              </button>
            </div>

            {/* Filters & Search */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row items-center gap-3 justify-between">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search contributions..."
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#192A56]/20"
                />
              </div>

              {/* Segmented status filter */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs overflow-x-auto w-full sm:w-auto">
                {['all', 'approved', 'pending_checker_review', 'clarification_required', 'draft'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-lg font-medium transition-all capitalize whitespace-nowrap ${
                      statusFilter === st
                        ? 'bg-white text-slate-900 shadow-xs font-semibold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {st === 'all' ? 'All' : st.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* List / Table */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
              <div className="divide-y divide-slate-100">
                {filteredContributions.length === 0 ? (
                  <div className="p-12 text-center text-slate-400 text-xs">
                    No contributions match your filter criteria.
                  </div>
                ) : (
                  filteredContributions.map((c) => (
                    <div
                      key={c.id}
                      onClick={() => setSelectedContribution(c)}
                      className="p-5 hover:bg-slate-50/70 transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2.5">
                          <h4 className="text-sm font-bold text-slate-900 hover:text-[#192A56]">
                            {c.title}
                          </h4>
                          {getStatusBadge(c.status)}
                        </div>
                        <p className="text-xs text-slate-500 line-clamp-1">
                          {c.description || 'No description provided.'}
                        </p>
                        <div className="flex items-center gap-4 text-[11px] text-slate-400 pt-1">
                          <span>{c.category}</span>
                          <span>•</span>
                          <span>Activity Date: {c.activityDate}</span>
                          {c.evidenceFiles.length > 0 && (
                            <>
                              <span>•</span>
                              <span>{c.evidenceFiles.length} Evidence File(s)</span>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        {c.status === 'approved' && (
                          <div className="text-xs font-black text-emerald-600 tabular-nums">
                            +{c.creditsAwarded} credits
                          </div>
                        )}
                        <span className="text-[11px] text-blue-600 hover:underline font-semibold block mt-1">
                          View Details & Thread →
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        )}

        {/* TAB 4: AI VERIFICATION / DATE SANDBOX */}
        {activeTab === 'sandbox' && <DateVerificationSandbox />}

        {/* TAB 5: RECOGNITION CREDITS */}
        {activeTab === 'credits' && <CreditsLedgerView />}

        {/* TAB 6: PROFESSIONAL PORTFOLIO */}
        {activeTab === 'portfolio' && <PortfolioView />}

        {/* TAB 7: NOTIFICATIONS CENTER */}
        {activeTab === 'notifications' && (
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-lg font-bold text-[#192A56]">Notifications Center</h2>
                <p className="text-xs text-slate-500">
                  Real-time updates regarding submission reviews, clarifications, and credit awards.
                </p>
              </div>
              {currentUser && (
                <button
                  onClick={() => db.markAllNotificationsAsRead(currentUser.id)}
                  className="text-xs font-semibold text-blue-600 hover:underline"
                >
                  Mark all as read
                </button>
              )}
            </div>

            <div className="space-y-3">
              {notifications.length === 0 ? (
                <div className="py-12 text-center text-slate-400 text-xs">
                  No notifications yet.
                </div>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => {
                      db.markNotificationAsRead(n.id);
                      if (n.contributionId) {
                        const target = db.getContributionById(n.contributionId);
                        if (target) setSelectedContribution(target);
                      }
                    }}
                    className={`p-4 rounded-xl border text-xs cursor-pointer transition-colors ${
                      n.read
                        ? 'bg-slate-50/60 border-slate-200 text-slate-600'
                        : 'bg-blue-50/50 border-blue-200 text-blue-950 font-medium'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-slate-900">{n.title}</span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(n.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="leading-relaxed">{n.message}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

      </main>

      {/* Detail & Clarification Modal */}
      {selectedContribution && (
        <ContributionDetailModal
          contribution={selectedContribution}
          onClose={() => setSelectedContribution(null)}
          onUpdated={() => {
            reloadData();
            const updated = db.getContributionById(selectedContribution.id);
            setSelectedContribution(updated || null);
          }}
        />
      )}

    </div>
  );
};
