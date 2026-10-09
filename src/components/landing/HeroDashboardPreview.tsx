import React from 'react';
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
} from 'lucide-react';

interface HeroDashboardPreviewProps {
  onOpenDashboard: () => void;
}

export const HeroDashboardPreview: React.FC<HeroDashboardPreviewProps> = ({ onOpenDashboard }) => {
  return (
    <div
      onClick={onOpenDashboard}
      className="group relative bg-white rounded-2xl shadow-2xl border border-slate-200/90 overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-3xl hover:border-[#192A56]/30"
    >
      {/* Interactive hover banner */}
      <div className="absolute top-2 right-3 z-30 opacity-0 group-hover:opacity-100 transition-opacity bg-[#192A56] text-white text-[11px] font-semibold py-1 px-2.5 rounded-md shadow-md flex items-center gap-1.5">
        <span>Click to open live workspace</span>
        <span>→</span>
      </div>

      <div className="flex flex-col lg:flex-row min-h-[460px]">
        
        {/* Left Dark Mini-Sidebar */}
        <div className="w-full lg:w-48 bg-[#192A56] text-slate-300 p-4 flex flex-col justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-6 text-white font-bold text-sm tracking-tight border-b border-white/10 pb-3">
              <span className="w-5 h-5 rounded bg-[#F7D794] flex items-center justify-center text-[#192A56] text-xs font-black">
                E
              </span>
              <span>EduCred</span>
            </div>

            <nav className="space-y-1 text-xs">
              <div className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg bg-white/15 text-white font-medium">
                <LayoutDashboard className="w-3.5 h-3.5 text-[#F7D794]" />
                <span>Dashboard</span>
              </div>
              <div className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-slate-300 hover:text-white">
                <FileUp className="w-3.5 h-3.5 text-slate-400" />
                <span>Submit Activity</span>
              </div>
              <div className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-slate-300 hover:text-white">
                <FolderOpen className="w-3.5 h-3.5 text-slate-400" />
                <span>My Activities</span>
              </div>
              <div className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-slate-300 hover:text-white">
                <Sparkles className="w-3.5 h-3.5 text-slate-400" />
                <span>AI Verification</span>
              </div>
              <div className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-slate-300 hover:text-white">
                <Award className="w-3.5 h-3.5 text-slate-400" />
                <span>Credits</span>
              </div>
              <div className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-slate-300 hover:text-white">
                <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                <span>Professional Portfolio</span>
              </div>
              <div className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-slate-300 hover:text-white">
                <Bell className="w-3.5 h-3.5 text-slate-400" />
                <span>Notifications</span>
              </div>
            </nav>
          </div>

          {/* User badge */}
          <div className="pt-4 border-t border-white/10 flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-[#EDA6A3] text-[#192A56] font-bold text-xs flex items-center justify-center shrink-0">
              PS
            </div>
            <div className="truncate">
              <div className="text-[11px] font-semibold text-white truncate">Dr. Priya Sharma</div>
              <div className="text-[9px] text-slate-400">Teacher</div>
            </div>
          </div>
        </div>

        {/* Main Content Preview */}
        <div className="flex-1 p-5 bg-[#FCFBFB] flex flex-col justify-between">
          
          {/* Greeting Header */}
          <div className="mb-4">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-[#192A56]">
                Good morning, Dr. Priya Sharma
              </h3>
              <span className="text-sm">☀️</span>
            </div>
            <p className="text-[11px] text-slate-500">
              Here's an overview of your contributions and progress.
            </p>
          </div>

          {/* 4 Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-4">
            <div className="bg-white p-2.5 rounded-xl border border-slate-200/80 shadow-xs flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <Award className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[10px] text-slate-500 font-medium">Total Credits</div>
                <div className="text-base font-extrabold text-slate-900 tabular-nums">120</div>
              </div>
            </div>

            <div className="bg-white p-2.5 rounded-xl border border-slate-200/80 shadow-xs flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-500 flex items-center justify-center shrink-0">
                <FolderOpen className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[10px] text-slate-500 font-medium">Activities Submitted</div>
                <div className="text-base font-extrabold text-slate-900 tabular-nums">24</div>
              </div>
            </div>

            <div className="bg-white p-2.5 rounded-xl border border-slate-200/80 shadow-xs flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[10px] text-slate-500 font-medium">Pending Verification</div>
                <div className="text-base font-extrabold text-slate-900 tabular-nums">2</div>
              </div>
            </div>

            <div className="bg-white p-2.5 rounded-xl border border-slate-200/80 shadow-xs flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <Trophy className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[10px] text-slate-500 font-medium">Achievements</div>
                <div className="text-base font-extrabold text-slate-900 tabular-nums">5</div>
              </div>
            </div>
          </div>

          {/* Grid Split: Chart & Recent Activities */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            
            {/* Chart: Contribution Overview */}
            <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-800">Contribution Overview</span>
                <span className="text-[10px] text-slate-400">Monthly</span>
              </div>
              
              {/* Bar Chart Representation matching image.png */}
              <div className="h-32 flex items-end justify-between gap-2 pt-4 px-1 border-b border-slate-100">
                {[
                  { month: 'Jan', val: 15, h: '38%' },
                  { month: 'Feb', val: 30, h: '75%' },
                  { month: 'Mar', val: 21, h: '52%' },
                  { month: 'Apr', val: 30, h: '75%' },
                  { month: 'May', val: 36, h: '90%' },
                  { month: 'Jun', val: 18, h: '45%' },
                ].map((bar, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                    <span className="text-[8px] text-slate-400 tabular-nums">{bar.val}</span>
                    <div
                      style={{ height: bar.h }}
                      className="w-full max-w-[20px] rounded-t-sm bg-[#F7D794] group-hover:bg-[#f3cb79] transition-all"
                    />
                    <span className="text-[9px] text-slate-500 font-medium">{bar.month}</span>
                  </div>
                ))}
              </div>
              <div className="mt-2 text-[9px] text-slate-400 text-center">
                Recognition Credits Recorded (2026)
              </div>
            </div>

            {/* List: Recent Contributions */}
            <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div className="text-xs font-bold text-slate-800 mb-2">Recent Contributions</div>
              
              <div className="space-y-2 text-[11px]">
                
                {/* Item 1 */}
                <div className="p-1.5 rounded-lg bg-slate-50 flex items-center justify-between gap-2 border border-slate-100">
                  <div className="truncate">
                    <div className="font-semibold text-slate-900 truncate">Remedial Mathematics Class</div>
                    <div className="text-[9px] text-slate-500">12 Jun 2026</div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800 shrink-0">
                    Approved
                  </span>
                </div>

                {/* Item 2 */}
                <div className="p-1.5 rounded-lg bg-slate-50 flex items-center justify-between gap-2 border border-slate-100">
                  <div className="truncate">
                    <div className="font-semibold text-slate-900 truncate">Student Project Guidance</div>
                    <div className="text-[9px] text-slate-500">10 Jun 2026</div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-100 text-amber-800 shrink-0">
                    Pending Review
                  </span>
                </div>

                {/* Item 3 */}
                <div className="p-1.5 rounded-lg bg-slate-50 flex items-center justify-between gap-2 border border-slate-100">
                  <div className="truncate">
                    <div className="font-semibold text-slate-900 truncate">Robotics Workshop</div>
                    <div className="text-[9px] text-slate-500">08 Jun 2026</div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-100 text-rose-800 shrink-0">
                    AI Flagged
                  </span>
                </div>

                {/* Item 4 */}
                <div className="p-1.5 rounded-lg bg-slate-50 flex items-center justify-between gap-2 border border-slate-100">
                  <div className="truncate">
                    <div className="font-semibold text-slate-900 truncate">Faculty Development Program</div>
                    <div className="text-[9px] text-slate-500">05 Jun 2026</div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800 shrink-0">
                    Approved
                  </span>
                </div>

              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
