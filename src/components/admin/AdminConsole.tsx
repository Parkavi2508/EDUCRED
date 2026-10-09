import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../lib/storage';
import { SUPABASE_MIGRATIONS_SQL } from '../../lib/supabaseSql';
import { CreditRule, UserProfile, UserRole } from '../../types';
import {
  ShieldAlert,
  Settings,
  Users,
  Award,
  Calendar,
  Database,
  History,
  Copy,
  Check,
  RotateCcw,
  Sliders,
  Building,
  CheckCircle2,
  Clock,
  Sparkles,
  Search,
} from 'lucide-react';

export const AdminConsole: React.FC = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'rules' | 'policy' | 'users' | 'supabase' | 'audit'>('overview');

  const [institution, setInstitution] = useState(db.getInstitution());
  const [creditRules, setCreditRules] = useState<CreditRule[]>(db.getCreditRules());
  const [users, setUsers] = useState<UserProfile[]>(db.getUsers());
  const [auditLogs, setAuditLogs] = useState(db.getAuditLogs());
  const [copiedSql, setCopiedSql] = useState(false);

  // Policy form state
  const [refDate, setRefDate] = useState(institution.settings.referenceDate);
  const [ruleLeadDays, setRuleLeadDays] = useState(institution.settings.ruleLeadDays);
  const [prohibitSameDay, setProhibitSameDay] = useState(institution.settings.prohibitSameDay);
  const [timeZone, setTimeZone] = useState(institution.timeZone);
  const [policySaved, setPolicySaved] = useState(false);

  // Audit filter state
  const [auditSearch, setAuditSearch] = useState('');

  const refreshData = () => {
    setInstitution(db.getInstitution());
    setCreditRules(db.getCreditRules());
    setUsers(db.getUsers());
    setAuditLogs(db.getAuditLogs());
  };

  useEffect(() => {
    refreshData();
    return db.subscribe(refreshData);
  }, []);

  const handleUpdateRuleValue = (ruleId: string, val: number) => {
    db.updateCreditRule(ruleId, { creditValue: val });
    setCreditRules([...db.getCreditRules()]);
  };

  const handleSavePolicy = () => {
    db.updateInstitutionSettings({
      referenceDate: refDate,
      ruleLeadDays,
      prohibitSameDay,
    });
    setPolicySaved(true);
    setTimeout(() => setPolicySaved(false), 2000);
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_MIGRATIONS_SQL);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  const handleResetDefaults = () => {
    if (confirm('Reset database to clean default demonstration data?')) {
      db.resetToDefaults();
      refreshData();
    }
  };

  // Aggregate Metrics
  const contributions = db.getContributions();
  const ledger = db.getCreditLedger();
  const totalCreditsAwarded = ledger.reduce((sum, e) => sum + e.amount, 0);

  const filteredAuditLogs = auditLogs.filter(a => {
    if (!auditSearch.trim()) return true;
    const q = auditSearch.toLowerCase();
    return (
      a.action.toLowerCase().includes(q) ||
      a.actorName.toLowerCase().includes(q) ||
      a.details.toLowerCase().includes(q)
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#192A56] uppercase tracking-wide">
            <Building className="w-4 h-4 text-amber-500" />
            <span>Institutional Governance & Administration</span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#192A56] tracking-tight mt-0.5">
            Admin Console • {institution.name}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Configure credit recognition rules, verification policies, examine audit logs, and manage database integrity.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleResetDefaults}
            className="px-3.5 py-2 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-colors flex items-center gap-1.5 shadow-2xs"
            title="Reset to default seed state for demonstration"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl text-xs overflow-x-auto">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-xl font-bold transition-all whitespace-nowrap ${
            activeTab === 'overview' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Institutional Overview
        </button>
        <button
          onClick={() => setActiveTab('rules')}
          className={`px-4 py-2 rounded-xl font-bold transition-all whitespace-nowrap ${
            activeTab === 'rules' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Credit Rules Configuration
        </button>
        <button
          onClick={() => setActiveTab('policy')}
          className={`px-4 py-2 rounded-xl font-bold transition-all whitespace-nowrap ${
            activeTab === 'policy' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Date & Verification Policies
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 rounded-xl font-bold transition-all whitespace-nowrap ${
            activeTab === 'users' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Faculty & Role Access
        </button>
        <button
          onClick={() => setActiveTab('supabase')}
          className={`px-4 py-2 rounded-xl font-bold transition-all whitespace-nowrap ${
            activeTab === 'supabase' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Database & Supabase SQL
        </button>
        <button
          onClick={() => setActiveTab('audit')}
          className={`px-4 py-2 rounded-xl font-bold transition-all whitespace-nowrap ${
            activeTab === 'audit' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Security Audit Logs ({auditLogs.length})
        </button>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs text-slate-500 font-medium">Faculty Members</span>
              <div className="text-2xl font-black text-slate-900 tabular-nums mt-1">{users.length}</div>
              <span className="text-[10px] text-slate-400">Teachers, Checkers, Admins</span>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs text-slate-500 font-medium">Total Contributions</span>
              <div className="text-2xl font-black text-slate-900 tabular-nums mt-1">{contributions.length}</div>
              <span className="text-[10px] text-slate-400">Recorded across faculty</span>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs text-slate-500 font-medium">Total Credits Awarded</span>
              <div className="text-2xl font-black text-emerald-600 tabular-nums mt-1">{totalCreditsAwarded}</div>
              <span className="text-[10px] text-slate-400">Append-only ledger balance</span>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs text-slate-500 font-medium">Audit Trail Entries</span>
              <div className="text-2xl font-black text-slate-900 tabular-nums mt-1">{auditLogs.length}</div>
              <span className="text-[10px] text-slate-400">Immutable security events</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <h3 className="text-sm font-bold text-[#192A56] mb-3">Institutional Parameters Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-600">
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-400 block text-[10px]">Reference Policy Date:</span>
                <span className="font-bold text-slate-900">{institution.settings.referenceDate}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-400 block text-[10px]">Lead-Time Submission Window:</span>
                <span className="font-bold text-slate-900">≥ {institution.settings.ruleLeadDays} Days Prior</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-400 block text-[10px]">Configured Timezone:</span>
                <span className="font-bold text-slate-900">{institution.timeZone}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CREDIT RULES CONFIGURATION */}
      {activeTab === 'rules' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-5">
          <div>
            <h2 className="text-base font-bold text-[#192A56]">Recognition Credit Rules</h2>
            <p className="text-xs text-slate-500">
              Configure baseline recognition points awarded upon verified approval for each activity category.
            </p>
          </div>

          <div className="divide-y divide-slate-100">
            {creditRules.map((rule) => (
              <div key={rule.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                <div>
                  <div className="font-bold text-slate-900 text-sm">{rule.category}</div>
                  <div className="text-slate-500 text-[11px] mt-0.5">{rule.description}</div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-slate-500">Credit Value:</span>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={rule.creditValue}
                    onChange={(e) => handleUpdateRuleValue(rule.id, parseInt(e.target.value) || 0)}
                    className="w-20 px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-center font-bold text-slate-900"
                  />
                  <span className="text-slate-400 text-xs">credits</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: DATE & VERIFICATION POLICIES */}
      {activeTab === 'policy' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-8 max-w-2xl space-y-6">
          <div>
            <h2 className="text-base font-bold text-[#192A56]">Lesson Plan & Submission Date Rules</h2>
            <p className="text-xs text-slate-500">
              Timezone-aware institutional verification rules governing activity dates and cutoff windows.
            </p>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Institutional Reference Date
              </label>
              <input
                type="date"
                value={refDate}
                onChange={(e) => setRefDate(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                The baseline server date against which lead times and eligibility are evaluated.
              </span>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Minimum Lead-Time Days (Cutoff Window)
              </label>
              <input
                type="number"
                min="0"
                max="30"
                value={ruleLeadDays}
                onChange={(e) => setRuleLeadDays(parseInt(e.target.value) || 0)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                Submissions within this many days of the reference date require special administrative waiver.
              </span>
            </div>

            <label className="flex items-center gap-2.5 pt-2 cursor-pointer">
              <input
                type="checkbox"
                checked={prohibitSameDay}
                onChange={(e) => setProhibitSameDay(e.target.checked)}
                className="rounded border-slate-300 text-[#192A56] focus:ring-[#192A56]"
              />
              <span className="font-medium text-slate-800">
                Prohibit same-day activity submissions (requires day offset &gt; 0)
              </span>
            </label>

            <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
              <button
                onClick={handleSavePolicy}
                className="px-5 py-2.5 text-xs font-bold text-white bg-[#192A56] hover:bg-[#121f42] rounded-xl shadow-xs transition-all"
              >
                Save Institutional Policies
              </button>
              {policySaved && (
                <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  Policy changes recorded in audit log.
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: USERS & FACULTY */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100">
            <h2 className="text-base font-bold text-[#192A56]">Faculty & User Accounts</h2>
            <p className="text-xs text-slate-500">
              Role assignment is protected server-side. Ordinary registration grants safe default role.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px] font-bold">
                <tr>
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Employee ID</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-bold text-slate-900">{u.name}</td>
                    <td className="py-3 px-4 text-slate-600">{u.email}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        u.role === 'admin'
                          ? 'bg-purple-100 text-purple-800'
                          : u.role === 'checker'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-500">{u.departmentName || 'General'}</td>
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-400">{u.employeeId}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: DATABASE & SUPABASE SQL */}
      {activeTab === 'supabase' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-[#192A56] flex items-center gap-2">
                <Database className="w-4 h-4 text-amber-500" />
                <span>Supabase PostgreSQL Schema & RLS Migrations</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Full 15-table schema with strict PostgreSQL Row Level Security (RLS) policies.
              </p>
            </div>
            <button
              onClick={handleCopySql}
              className="px-4 py-2 text-xs font-bold text-white bg-[#192A56] hover:bg-[#121f42] rounded-xl flex items-center gap-2 shadow-xs transition-all w-fit"
            >
              {copiedSql ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copiedSql ? 'Copied to Clipboard!' : 'Copy SQL Script'}</span>
            </button>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2 text-slate-700">
            <div className="font-bold text-slate-900">Required Environment Configuration:</div>
            <div className="font-mono text-[11px] bg-white p-3 rounded-lg border border-slate-200 space-y-1">
              <div>NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co</div>
              <div>NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOi...</div>
              <div>SUPABASE_SECRET_KEY=eyJhbGciOi... (Server-side only)</div>
              <div>SUPABASE_STORAGE_BUCKET=evidence</div>
            </div>
          </div>

          <div className="relative">
            <pre className="p-4 rounded-xl bg-[#101B37] text-slate-200 font-mono text-[11px] h-96 overflow-y-auto leading-relaxed border border-slate-800">
              {SUPABASE_MIGRATIONS_SQL}
            </pre>
          </div>
        </div>
      )}

      {/* TAB 6: SECURITY AUDIT LOGS */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden space-y-4 p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-[#192A56] flex items-center gap-2">
                <History className="w-4 h-4 text-rose-500" />
                <span>Immutable Security & Event Audit Logs</span>
              </h2>
              <p className="text-xs text-slate-500">
                Audited ledger of all state transitions, reviews, credit awards, and policy adjustments.
              </p>
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={auditSearch}
                onChange={(e) => setAuditSearch(e.target.value)}
                placeholder="Search audit trail..."
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#192A56]/20"
              />
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px] font-bold">
                <tr>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Action</th>
                  <th className="py-3 px-4">Actor</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Entity Type</th>
                  <th className="py-3 px-4">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredAuditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/70">
                    <td className="py-3 px-4 font-mono text-[10px] text-slate-400 whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 font-bold text-[#192A56] whitespace-nowrap">
                      {log.action}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-900 whitespace-nowrap">
                      {log.actorName}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 text-slate-700">
                        {log.actorRole}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-500 capitalize">
                      {log.entityType}
                    </td>
                    <td className="py-3 px-4 text-slate-600 max-w-[320px] truncate" title={log.details}>
                      {log.details}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
