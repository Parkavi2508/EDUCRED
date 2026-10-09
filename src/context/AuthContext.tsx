import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '../types';
import { db } from '../lib/storage';

interface AuthContextType {
  currentUser: UserProfile | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  switchRole: (role: UserRole) => void;
  signIn: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (params: { name: string; email: string; role?: UserRole }) => Promise<{ success: boolean; error?: string }>;
  signOut: () => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  unreadCount: number;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Default to Dr. Priya Sharma for immediate, rich walkthrough of the teacher dashboard from the screenshot
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const savedUserId = localStorage.getItem('educred_active_user_id');
    if (savedUserId) {
      const user = db.getUserById(savedUserId);
      if (user) return user;
    }
    return db.getUserById('user-priya') || null;
  });

  const [unreadCount, setUnreadCount] = useState<number>(0);

  // Sync unread notification count
  useEffect(() => {
    const updateStats = () => {
      if (currentUser) {
        const notifs = db.getNotifications(currentUser.id);
        setUnreadCount(notifs.filter(n => !n.read).length);
      } else {
        setUnreadCount(0);
      }
    };

    updateStats();
    return db.subscribe(updateStats);
  }, [currentUser]);

  const switchRole = (newRole: UserRole) => {
    let targetUser: UserProfile | undefined;
    if (newRole === 'teacher') {
      targetUser = db.getUserById('user-priya');
    } else if (newRole === 'checker') {
      targetUser = db.getUserById('user-checker-david');
    } else if (newRole === 'admin') {
      targetUser = db.getUserById('user-admin-sarah');
    }

    if (targetUser) {
      setCurrentUser(targetUser);
      localStorage.setItem('educred_active_user_id', targetUser.id);
      db.recordAudit({
        institutionId: targetUser.institutionId,
        actorId: targetUser.id,
        actorName: targetUser.name,
        actorRole: targetUser.role,
        action: 'ROLE_SWITCHED',
        entityType: 'user',
        entityId: targetUser.id,
        details: `Switched active session to role ${newRole} (${targetUser.name})`,
      });
    }
  };

  const signIn = async (email: string): Promise<{ success: boolean; error?: string }> => {
    const users = db.getUsers();
    const found = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (found) {
      setCurrentUser(found);
      localStorage.setItem('educred_active_user_id', found.id);
      return { success: true };
    }
    return { success: false, error: 'No user registered with this email address.' };
  };

  const signUp = async (params: {
    name: string;
    email: string;
    role?: UserRole;
  }): Promise<{ success: boolean; error?: string }> => {
    const users = db.getUsers();
    if (users.some(u => u.email.toLowerCase() === params.email.toLowerCase())) {
      return { success: false, error: 'A user with this email already exists.' };
    }

    const newUser: UserProfile = {
      id: 'user-' + Date.now(),
      name: params.name,
      email: params.email,
      role: params.role || 'teacher', // Safe default role
      institutionId: 'inst-1',
      institutionName: 'National Academy of Secondary Education',
      departmentName: 'General Faculty',
      title: 'Faculty Educator',
      employeeId: 'FAC-' + Math.floor(1000 + Math.random() * 9000),
      createdAt: new Date().toISOString(),
    };

    db.getState().users.push(newUser);
    setCurrentUser(newUser);
    localStorage.setItem('educred_active_user_id', newUser.id);

    db.recordAudit({
      institutionId: newUser.institutionId,
      actorId: newUser.id,
      actorName: newUser.name,
      actorRole: newUser.role,
      action: 'USER_REGISTERED',
      entityType: 'user',
      entityId: newUser.id,
      details: `New account registered as ${newUser.role}`,
    });

    return { success: true };
  };

  const signOut = () => {
    setCurrentUser(null);
    localStorage.removeItem('educred_active_user_id');
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...updates };
    setCurrentUser(updated);

    const users = db.getState().users;
    const idx = users.findIndex(u => u.id === currentUser.id);
    if (idx !== -1) {
      users[idx] = updated;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        role: currentUser ? currentUser.role : null,
        isAuthenticated: Boolean(currentUser),
        switchRole,
        signIn,
        signUp,
        signOut,
        updateProfile,
        unreadCount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
