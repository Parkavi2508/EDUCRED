import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { LandingPage } from './components/landing/LandingPage';
import { TeacherDashboard } from './components/teacher/TeacherDashboard';
import { CheckerWorkspace } from './components/checker/CheckerWorkspace';
import { AdminConsole } from './components/admin/AdminConsole';
import { AuthModal } from './components/auth/AuthModal';
import { GeminiChatbot } from './components/chat/GeminiChatbot';
import { UserRole } from './types';
import { Sparkles } from 'lucide-react';

const AppContent: React.FC = () => {
  const { role } = useAuth();
  const [currentView, setCurrentView] = useState<'landing' | 'teacher' | 'checker' | 'admin'>('landing');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [chatOpen, setChatOpen] = useState(false);

  const handleOpenAuth = (mode: 'signin' | 'signup') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const handleAuthSuccess = (userRole: UserRole) => {
    setCurrentView(userRole);
  };

  return (
    <div className="min-h-screen bg-[#FCFBFB] flex flex-col font-sans text-[#192A56] antialiased relative">
      {/* Top Header */}
      <Header
        currentView={currentView}
        onNavigate={(view) => setCurrentView(view)}
        onOpenAuth={handleOpenAuth}
        onOpenNotifications={() => {
          if (role === 'teacher') setCurrentView('teacher');
        }}
      />

      {/* Main Body View */}
      <div className="flex-1">
        {currentView === 'landing' && (
          <LandingPage
            onGetStarted={() => {
              if (role) {
                setCurrentView(role);
              } else {
                handleOpenAuth('signup');
              }
            }}
            onExploreDashboard={() => {
              setCurrentView('teacher');
            }}
            onOpenSignIn={() => handleOpenAuth('signin')}
          />
        )}

        {currentView === 'teacher' && (
          <TeacherDashboard onOpenChat={() => setChatOpen(true)} />
        )}

        {currentView === 'checker' && <CheckerWorkspace />}

        {currentView === 'admin' && <AdminConsole />}
      </div>

      {/* Floating Gemini Chatbot Launcher Button */}
      {!chatOpen && (
        <button
          onClick={() => setChatOpen(true)}
          className="fixed bottom-6 right-6 z-40 px-4 py-3 bg-[#192A56] hover:bg-[#121f42] text-white rounded-full shadow-2xl flex items-center gap-2.5 transition-all hover:scale-105 active:scale-95 group border border-white/20"
          title="Ask EduCred Gemini Assistant"
        >
          <div className="relative">
            <Sparkles className="w-5 h-5 text-[#F7D794]" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-[#F7D794] rounded-full animate-ping" />
          </div>
          <span className="text-xs font-bold pr-1">Ask Gemini ✨</span>
        </button>
      )}

      {/* Multi-turn Gemini Chatbot Component */}
      <GeminiChatbot isOpen={chatOpen} onClose={() => setChatOpen(false)} />

      {/* Footer */}
      <Footer />

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        initialMode={authMode}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
