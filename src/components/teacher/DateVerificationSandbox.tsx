import React, { useState } from 'react';
import { db } from '../../lib/storage';
import { evaluateActivityDate } from '../../lib/ocr';
import {
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ShieldCheck,
  Info,
  Sliders,
} from 'lucide-react';

export const DateVerificationSandbox: React.FC = () => {
  const institution = db.getInstitution();
  
  // Interactive test states
  const [testDate, setTestDate] = useState('2026-10-06');
  const [refDate, setRefDate] = useState(institution.settings.referenceDate || '2026-10-09');
  const [leadDays, setLeadDays] = useState(institution.settings.ruleLeadDays || 3);
  const [blockSameDay, setBlockSameDay] = useState(institution.settings.prohibitSameDay !== false);

  const evalResult = evaluateActivityDate(testDate, refDate, leadDays, blockSameDay);

  // Pre-configured test scenarios from Section 10 of prompt:
  // e.g. Oct 9, Oct 8, Oct 7, Oct 6 with Ref Date Oct 9
  const presetScenarios = [
    { label: 'October 9, 2026 (Same Day)', date: '2026-10-09' },
    { label: 'October 8, 2026 (1 day prior)', date: '2026-10-08' },
    { label: 'October 7, 2026 (2 days prior)', date: '2026-10-07' },
    { label: 'October 6, 2026 (3 days prior)', date: '2026-10-06' },
    { label: 'September 28, 2026 (11 days prior)', date: '2026-09-28' },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs">
      <div className="max-w-2xl mb-6">
        <div className="flex items-center gap-2 text-xs font-bold text-amber-600 uppercase tracking-wide mb-1">
          <Clock className="w-4 h-4" />
          <span>Section 10 Policy Verification</span>
        </div>
        <h2 className="text-xl font-bold text-[#192A56]">
          Lesson Plan Date Verification Engine
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Timezone-aware institutional date policy calculator. Tests submission eligibility against
          reference timestamp, minimum administrative lead window, and same-day cutoffs.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Interactive Controls */}
        <div className="lg:col-span-6 space-y-5">
          
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span className="flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-slate-500" />
                Institutional Rule Parameters
              </span>
              <span className="text-[10px] text-slate-400 font-mono">TZ: {institution.timeZone}</span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-slate-600 font-medium mb-1">
                  Reference Date
                </label>
                <input
                  type="date"
                  value={refDate}
                  onChange={(e) => setRefDate(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">
                  Minimum Lead Days
                </label>
                <input
                  type="number"
                  min="0"
                  max="14"
                  value={leadDays}
                  onChange={(e) => setLeadDays(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold"
                />
              </div>
            </div>

            <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={blockSameDay}
                onChange={(e) => setBlockSameDay(e.target.checked)}
                className="rounded border-slate-300 text-[#192A56] focus:ring-[#192A56]"
              />
              <span>Prohibit same-day submissions without prior administrative exception</span>
            </label>
          </div>

          {/* Test Target Date Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wide">
              Test Activity / Lesson Plan Date
            </label>
            <input
              type="date"
              value={testDate}
              onChange={(e) => setTestDate(e.target.value)}
              className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#192A56]/20"
            />
          </div>

          {/* Quick Scenario Buttons */}
          <div>
            <span className="text-xs font-bold text-slate-500 block mb-2">
              Preset Policy Test Benchmarks (Reference Oct 9):
            </span>
            <div className="flex flex-wrap gap-2">
              {presetScenarios.map((scen, idx) => (
                <button
                  key={idx}
                  onClick={() => setTestDate(scen.date)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                    testDate === scen.date
                      ? 'bg-[#192A56] text-white border-[#192A56]'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {scen.label}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Live Diagnostics Panel */}
        <div className="lg:col-span-6 flex flex-col justify-between">
          
          <div className={`p-6 rounded-2xl border transition-all ${
            evalResult.passed
              ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
              : 'bg-amber-50/70 border-amber-200 text-amber-950'
          }`}>
            
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                evalResult.passed ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'
              }`}>
                {evalResult.passed ? (
                  <CheckCircle2 className="w-6 h-6" />
                ) : (
                  <AlertTriangle className="w-6 h-6" />
                )}
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider block opacity-75">
                  Verification Evaluation
                </span>
                <h3 className="text-lg font-extrabold leading-tight">
                  {evalResult.passed ? 'Eligible for Verification' : 'Submission Blocked / Review Required'}
                </h3>
              </div>
            </div>

            <div className="space-y-2.5 text-xs pb-4 border-b border-black/10">
              <div className="flex justify-between">
                <span className="opacity-70">Activity Date:</span>
                <span className="font-bold">{testDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="opacity-70">Reference Date:</span>
                <span className="font-bold">{refDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="opacity-70">Calculated Lead Window:</span>
                <span className="font-mono font-bold tabular-nums">
                  {evalResult.diffDays} day(s) before reference
                </span>
              </div>
              <div className="flex justify-between">
                <span className="opacity-70">Required Lead Window:</span>
                <span className="font-mono font-bold tabular-nums">
                  ≥ {leadDays} days
                </span>
              </div>
            </div>

            <div className="pt-4 text-xs">
              {evalResult.passed ? (
                <p className="leading-relaxed font-medium text-emerald-800">
                  Document satisfies institutional lead-time policy. The activity was conducted {evalResult.diffDays} days prior to {refDate}, meeting the {leadDays}-day threshold.
                </p>
              ) : (
                <div className="p-3 bg-white/80 rounded-xl border border-amber-300 font-medium text-amber-900 leading-relaxed">
                  <strong>Policy Violation:</strong> {evalResult.violationReason}
                </div>
              )}
            </div>

          </div>

          <div className="p-4 rounded-xl bg-slate-100 text-slate-600 text-xs flex items-start gap-3 mt-4">
            <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed">
              EduCred separates server upload timestamps from document creation dates.
              Automated date validation checks against server-side institutional time to prevent
              client-side clock manipulation.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};
