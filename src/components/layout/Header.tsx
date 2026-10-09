import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { EduCredLogo } from '../common/EduCredLogo';
import { UserRole } from '../../types';
import { Bell, User, CheckCircle2, ShieldCheck, ChevronDown, Sparkles } from 'lucide-react';

interface HeaderProps {
  currentView: 'landing' | 'teacher' | 'checker' | 'admin';
  onNavigate: (view: 'landing' | 'teacher' | 'checker' | 'admin') => void;
  onOpenAuth: (mode: 'signin' | 'signup') => void;
  onOpenNotifications?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  onOpenAuth,
  onOpenNotifications,
}) => {
  const { currentUser, role, switchRole, unreadCount, signOut } = useAuth();
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  const handleRoleSelect = (targetRole: UserRole) => {
    switchRole(targetRole);
    setShowRoleMenu(false);
    onNavigate(targetRole);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#FCFBFB]/95 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-8">
        
        {/* Zone 1: Brand Wordmark / Logo */}
        <button
          onClick={() => onNavigate('landing')}
          className="text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#192A56] rounded-md transition-opacity hover:opacity-90 shrink-0"
        >
          <EduCredLogo size="md" showTagline={true} />
        </button>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-[15px] font-medium text-slate-700">
          <button
            onClick={() => onNavigate('landing')}
            className={`transition-colors hover:text-[#192A56] ${
              currentView === 'landing' ? 'text-[#192A56] font-semibold' : ''
            }`}
          >
            Home
          </button>
          <a
            href="#features"
            onClick={(e) => {
              if (currentView !== 'landing') {
                e.preventDefault();
                onNavigate('landing');
                setTimeout(() => {
                  document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }
            }}
            className="transition-colors hover:text-[#192A56]"
          >
            Features
          </a>
          <a
            href="#how-it-works"
            onClick={(e) => {
              if (currentView !== 'landing') {
                e.preventDefault();
                onNavigate('landing');
                setTimeout(() => {
                  document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }
            }}
            className="transition-colors hover:text-[#192A56]"
          >
            How It Works
          </a>
          <a
            href="#benefits"
            onClick={(e) => {
              if (currentView !== 'landing') {
                e.preventDefault();
                onNavigate('landing');
                setTimeout(() => {
                  document.getElementById('benefits')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }
            }}
            className="transition-colors hover:text-[#192A56]"
          >
            Benefits
          </a>
          <a
            href="#responsible-ai"
            onClick={(e) => {
              if (currentView !== 'landing') {
                e.preventDefault();
                onNavigate('landing');
                setTimeout(() => {
                  document.getElementById('responsible-ai')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }
            }}
            className="transition-colors hover:text-[#192A56]"
          >
            About
          </a>
        </nav>

        {/* Zone 3: Actions & Role Personas */}
        <div className="flex items-center gap-3 shrink-0">
          
          {/* Persona Switcher Dropdown (Allows instant switching between Teacher, Checker, Admin) */}
          <div className="relative">
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-xs"
              title="Switch demo persona between Teacher, Checker and Admin"
            >
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="hidden sm:inline text-slate-500">Role:</span>
              <span className="font-semibold text-[#192A56] capitalize">
                {role || 'Select'}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showRoleMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowRoleMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3 py-1.5 border-b border-slate-100 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    Switch Test Persona
                  </div>
                  
                  <button
                    onClick={() => handleRoleSelect('teacher')}
                    className={`w-full px-3 py-2 text-left flex items-start gap-2.5 hover:bg-slate-50 transition-colors ${
                      role === 'teacher' ? 'bg-[#F7D794]/15 font-medium' : ''
                    }`}
                  >
                    <User className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                    <div>
                      <div className="text-xs font-semibold text-slate-900">Dr. Priya Sharma</div>
                      <div className="text-[11px] text-slate-500">Teacher • Mathematics Dept</div>
                    </div>
                  </button>

                  <button
                    onClick={() => handleRoleSelect('checker')}
                    className={`w-full px-3 py-2 text-left flex items-start gap-2.5 hover:bg-slate-50 transition-colors ${
                      role === 'checker' ? 'bg-[#EDA6A3]/15 font-medium' : ''
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4 text-rose-500 mt-0.5 shrink-0" />
                    <div>
                      <div className="text-xs font-semibold text-slate-900">Prof. David Miller</div>
                      <div className="text-[11px] text-slate-500">Checker • Review Queue</div>
                    </div>
                  </button>

                  <button
                    onClick={() => handleRoleSelect('admin')}
                    className={`w-full px-3 py-2 text-left flex items-start gap-2.5 hover:bg-slate-50 transition-colors ${
                      role === 'admin' ? 'bg-[#192A56]/10 font-medium' : ''
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4 text-[#192A56] mt-0.5 shrink-0" />
                    <div>
                      <div className="text-xs font-semibold text-slate-900">Dean Sarah Chen</div>
                      <div className="text-[11px] text-slate-500">Administrator • Institutional Rules</div>
                    </div>
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Notifications button if logged in */}
          {currentUser && (
            <button
              onClick={onOpenNotifications}
              className="relative p-2 text-slate-600 hover:text-[#192A56] hover:bg-slate-100 rounded-lg transition-colors"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full" />
              )}
            </button>
          )}

          {/* Contextual navigation or Auth buttons */}
          {currentView === 'landing' ? (
            <>
              <button
                onClick={() => onOpenAuth('signin')}
                className="px-4 py-2 text-sm font-semibold text-[#192A56] hover:text-black border border-slate-300 rounded-lg hover:border-slate-400 bg-white transition-all whitespace-nowrap shadow-xs"
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  if (role) {
                    onNavigate(role);
                  } else {
                    onOpenAuth('signup');
                  }
                }}
                className="px-4 py-2 text-sm font-semibold text-[#192A56] bg-[#F7D794] hover:bg-[#ebd083] rounded-lg transition-all whitespace-nowrap shadow-xs hover:shadow-sm"
              >
                Get Started
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onNavigate('landing')}
                className="px-3 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors whitespace-nowrap"
              >
                Public Site
              </button>
              {role && (
                <button
                  onClick={() => onNavigate(role)}
                  className="px-3.5 py-2 text-xs font-semibold text-white bg-[#192A56] hover:bg-[#121f42] rounded-lg transition-colors whitespace-nowrap shadow-xs"
                >
                  Workspace
                </button>
              )}
            </div>
          )}

        </div>

      </div>
    </header>
  );
};
