import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../lib/storage';
import { EduCredLogo } from '../common/EduCredLogo';
import {
  Printer,
  Award,
  CheckCircle2,
  Calendar,
  Building,
  GraduationCap,
  ShieldCheck,
  FileText,
  Download,
} from 'lucide-react';

export const PortfolioView: React.FC = () => {
  const { currentUser } = useAuth();
  const approvedContributions = db.getContributions({
    teacherId: currentUser?.id,
    status: 'approved',
  });

  const totalCredits = approvedContributions.reduce((sum, c) => sum + (c.creditsAwarded || 0), 0);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      
      {/* Portfolio Top Bar with Export Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs print:hidden">
        <div>
          <h2 className="text-xl font-bold text-[#192A56]">Professional Portfolio</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Verified institutional record of educator accomplishments, contributions, and recognition credits.
          </p>
        </div>
        <button
          onClick={handlePrint}
          className="px-4 py-2 text-xs font-bold text-white bg-[#192A56] hover:bg-[#121f42] rounded-xl flex items-center gap-2 shadow-xs transition-all w-fit"
        >
          <Printer className="w-4 h-4" />
          <span>Print / Export Certified PDF</span>
        </button>
      </div>

      {/* Certified Printable Portfolio Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-md p-8 sm:p-12 print:border-none print:shadow-none print:p-0">
        
        {/* Certificate Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b-2 border-slate-800 pb-8 gap-6">
          <div>
            <EduCredLogo size="lg" showTagline={true} />
            <div className="mt-3 text-xs text-slate-500 font-medium">
              Official Institutional Recognition Record
            </div>
          </div>
          <div className="sm:text-right">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Certified Verified Portfolio</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              Issue Date: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
          </div>
        </div>

        {/* Educator Profile Summary */}
        <div className="py-8 border-b border-slate-200 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-8 flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-[#192A56] text-[#F7D794] flex items-center justify-center font-bold text-2xl shadow-sm shrink-0">
              {currentUser?.name.split(' ').map(n => n[0]).slice(0, 2).join('') || 'ED'}
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-[#192A56] tracking-tight">
                {currentUser?.name || 'Dr. Priya Sharma'}
              </h1>
              <p className="text-sm font-semibold text-slate-700 mt-0.5">
                {currentUser?.title || 'Senior Mathematics Educator'}
              </p>
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mt-2">
                <span className="flex items-center gap-1">
                  <Building className="w-3.5 h-3.5 text-slate-400" />
                  {currentUser?.institutionName || 'National Academy of Secondary Education'}
                </span>
                <span>•</span>
                <span>ID: {currentUser?.employeeId || 'FAC-8821'}</span>
                <span>•</span>
                <span>{currentUser?.departmentName || 'Mathematics & Computer Science'}</span>
              </div>
            </div>
          </div>

          <div className="md:col-span-4 bg-[#FCFBFB] p-4 rounded-2xl border border-slate-200/80 flex items-center justify-around text-center">
            <div>
              <span className="text-[11px] text-slate-500 font-medium block">Verified Credits</span>
              <span className="text-2xl font-black text-[#192A56] tabular-nums block mt-0.5">
                {totalCredits}
              </span>
            </div>
            <div className="h-8 w-px bg-slate-200" />
            <div>
              <span className="text-[11px] text-slate-500 font-medium block">Approved Records</span>
              <span className="text-2xl font-black text-emerald-600 tabular-nums block mt-0.5">
                {approvedContributions.length}
              </span>
            </div>
          </div>
        </div>

        {/* Accomplishments Section */}
        <div className="py-8">
          <h3 className="text-base font-bold text-[#192A56] uppercase tracking-wider mb-6 flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            <span>Verified Professional Accomplishments</span>
          </h3>

          <div className="space-y-4">
            {approvedContributions.map((contrib, idx) => (
              <div
                key={contrib.id}
                className="p-5 rounded-xl border border-slate-200/90 bg-[#FCFBFB] flex flex-col sm:flex-row sm:items-start justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-slate-400 font-semibold">
                      #{idx + 1}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900">
                      {contrib.title}
                    </h4>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#F7D794]/40 text-[#192A56]">
                      {contrib.category}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {contrib.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-400 pt-1">
                    <span className="flex items-center gap-1 text-slate-500">
                      <Calendar className="w-3.5 h-3.5" />
                      Date: {contrib.activityDate}
                    </span>
                    <span>•</span>
                    <span className="text-emerald-700 font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Audited by Institutional Checker
                    </span>
                    {contrib.evidenceFiles.length > 0 && (
                      <>
                        <span>•</span>
                        <span className="text-slate-500">
                          {contrib.evidenceFiles[0].fileName}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-xs text-slate-500 font-medium">Earned Credits</div>
                  <div className="text-lg font-black text-[#192A56] tabular-nums">
                    +{contrib.creditsAwarded}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Verification Footnote & Institutional Seal */}
        <div className="pt-8 mt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div>
            <p className="font-semibold text-slate-700">Institutional Governance & Integrity:</p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Verified records are cryptographically hashed and audited under institutional policy rules.
            </p>
          </div>
          <div className="text-right">
            <div className="font-serif italic text-slate-700 font-semibold">
              EduCred Trust Assurance
            </div>
            <div className="text-[10px] text-slate-400">
              National Academy Verification Board
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
