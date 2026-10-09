import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { EduCredLogo } from '../common/EduCredLogo';
import { X, User, CheckCircle2, ShieldCheck, ArrowRight, Lock, Mail } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  initialMode: 'signin' | 'signup';
  onClose: () => void;
  onSuccess: (role: UserRole) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialMode,
  onClose,
  onSuccess,
}) => {
  const { signIn, signUp, switchRole } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('teacher');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (mode === 'signin') {
      const res = await signIn(email, password);
      if (res.success) {
        onSuccess('teacher');
        onClose();
      } else {
        setError(res.error || 'Authentication failed. Please verify credentials.');
      }
    } else {
      if (!name.trim()) {
        setError('Please provide your full educator name.');
        return;
      }
      const res = await signUp({ name: name.trim(), email: email.trim(), role });
      if (res.success) {
        onSuccess(role);
        onClose();
      } else {
        setError(res.error || 'Registration failed.');
      }
    }
  };

  const handleQuickLogin = (targetRole: UserRole) => {
    switchRole(targetRole);
    onSuccess(targetRole);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden relative animate-in fade-in zoom-in-95 duration-150">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="p-6 sm:p-8 bg-gradient-to-b from-[#FCFBFB] to-white border-b border-slate-100 text-center">
          <div className="flex justify-center mb-3">
            <EduCredLogo size="lg" showTagline={false} />
          </div>
          <h2 className="text-xl font-bold text-[#192A56]">
            {mode === 'signin' ? 'Welcome to EduCred' : 'Join Your Institution'}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {mode === 'signin'
              ? 'Sign in to access your dashboard, activities, or reviews'
              : 'Create your account to start documenting verified contributions'}
          </p>
        </div>

        {/* Quick Demo Persona Access */}
        <div className="p-6 sm:p-8 space-y-4">
          <div className="p-3 bg-amber-50/70 rounded-2xl border border-amber-200/80 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 block">
              Instant Demo Access (One Click):
            </span>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={() => handleQuickLogin('teacher')}
                className="p-2 rounded-xl bg-white border border-amber-200 hover:border-amber-400 text-center transition-all shadow-2xs hover:shadow-xs"
              >
                <div className="text-[11px] font-bold text-slate-900">Dr. Priya</div>
                <div className="text-[9px] text-amber-700 font-semibold">Teacher</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('checker')}
                className="p-2 rounded-xl bg-white border border-amber-200 hover:border-amber-400 text-center transition-all shadow-2xs hover:shadow-xs"
              >
                <div className="text-[11px] font-bold text-slate-900">Prof. David</div>
                <div className="text-[9px] text-rose-700 font-semibold">Checker</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('admin')}
                className="p-2 rounded-xl bg-white border border-amber-200 hover:border-amber-400 text-center transition-all shadow-2xs hover:shadow-xs"
              >
                <div className="text-[11px] font-bold text-slate-900">Dean Sarah</div>
                <div className="text-[9px] text-purple-700 font-semibold">Admin</div>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3 my-4">
            <div className="h-px bg-slate-200 flex-1" />
            <span className="text-[11px] text-slate-400 uppercase font-semibold">or standard login</span>
            <div className="h-px bg-slate-200 flex-1" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Dr. Robert Vance"
                    className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#192A56]/20"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Institutional Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@nase.edu"
                  className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#192A56]/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#192A56]/20"
                />
              </div>
            </div>

            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Default Role Request
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#192A56]/20"
                >
                  <option value="teacher">Teacher (Standard Educator)</option>
                  <option value="checker">Checker (Verification Committee)</option>
                  <option value="admin">Administrator (Institution Head)</option>
                </select>
              </div>
            )}

            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 text-xs font-bold text-white bg-[#192A56] hover:bg-[#121f42] rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5"
            >
              <span>{mode === 'signin' ? 'Sign In' : 'Create Account'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Toggle between Sign In / Sign Up */}
          <div className="text-center pt-2 text-xs text-slate-500">
            {mode === 'signin' ? (
              <span>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('signup');
                    setError(null);
                  }}
                  className="font-bold text-[#192A56] hover:underline"
                >
                  Register here
                </button>
              </span>
            ) : (
              <span>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('signin');
                    setError(null);
                  }}
                  className="font-bold text-[#192A56] hover:underline"
                >
                  Sign in
                </button>
              </span>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
