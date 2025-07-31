import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

export interface UserProfile {
  id: string;
  email: string;
  role: 'user' | 'admin';
  nickname?: string;
  preferredLanguage?: string;
  selectedSkills?: string[];
  timezone?: string;
  dailyGoal?: number;
  hasCompletedOnboarding: boolean;
  createdAt: string;
  updatedAt: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signUp: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>;
  updateUserProfile: (profile: Partial<UserProfile>) => Promise<void>;
  completeOnboarding: (onboardingData: {
    nickname: string;
    preferredLanguage: string;
    selectedSkills: string[];
    timezone: string;
    dailyGoal?: number;
  }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Function to load user profile from database
  const loadUserProfile = async (userId: string) => {
    try {
      console.log('Loading profile for user ID:', userId);
      
      // First, try to get user from auth.users (this should work)
      const { data: authData, error: authError } = await supabase.auth.getUser();
      console.log('Auth user data:', authData);
      
      if (authError) {
        console.error('Error getting auth user:', authError);
        return;
      }

      // Try to get profile from our users table
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      console.log('Users table query result:', { data, error });

      if (error) {
        console.error('Error loading user profile from users table:', error);
        
        // If user doesn't exist in our table, create a default profile
        if (authData.user) {
          const defaultProfile: UserProfile = {
            id: authData.user.id,
            email: authData.user.email || '',
            role: authData.user.email === 'admin@creative88.be' ? 'admin' : 'user',
            nickname: authData.user.email?.split('@')[0] || '',
            preferredLanguage: 'en',
            selectedSkills: [],
            timezone: 'UTC',
            dailyGoal: 4,
            hasCompletedOnboarding: true,
            createdAt: authData.user.created_at,
            updatedAt: authData.user.updated_at || authData.user.created_at,
          };
          setUserProfile(defaultProfile);
          console.log('Using default profile:', defaultProfile);
        }
        return;
      }

      if (data) {
        const profile: UserProfile = {
          id: data.id,
          email: data.email,
          role: data.role || 'user',
          nickname: data.nickname || '',
          preferredLanguage: 'en',
          selectedSkills: [],
          timezone: data.timezone || 'UTC',
          dailyGoal: 4,
          hasCompletedOnboarding: true,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
        };
        setUserProfile(profile);
        console.log('User profile loaded from DB:', profile);
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      // Load user profile from database if user exists
      if (session?.user) {
        loadUserProfile(session.user.id);
      }
      
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      // Load user profile from database if user exists
      if (session?.user) {
        loadUserProfile(session.user.id);
      } else {
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    console.log('Attempting sign in with:', { email });
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    console.log('Sign in result:', { error });
    return { error };
  };

  const signUp = async (email: string, password: string) => {
    console.log('Attempting sign up with:', { email });
    const { error, data } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    console.log('Sign up result:', { error, data });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    return { error };
  };

  const updateUserProfile = async (profile: Partial<UserProfile>) => {
    if (!user) return;
    
    // For now, save to localStorage. In production, this would be saved to the backend
    const currentProfile = userProfile || {
      id: user.id,
      email: user.email || '',
      role: 'user',
      hasCompletedOnboarding: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    const updatedProfile = {
      ...currentProfile,
      ...profile,
      updatedAt: new Date().toISOString(),
    };
    
    localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
    setUserProfile(updatedProfile);
  };

  const completeOnboarding = async (onboardingData: {
    nickname: string;
    preferredLanguage: string;
    selectedSkills: string[];
    timezone: string;
    dailyGoal?: number;
  }) => {
    if (!user) return;
    
    const profile: UserProfile = {
      id: user.id,
      email: user.email || '',
      role: 'user',
      nickname: onboardingData.nickname,
      preferredLanguage: onboardingData.preferredLanguage,
      selectedSkills: onboardingData.selectedSkills,
      timezone: onboardingData.timezone,
      dailyGoal: onboardingData.dailyGoal,
      hasCompletedOnboarding: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    localStorage.setItem('userProfile', JSON.stringify(profile));
    localStorage.setItem('hasCompletedOnboarding', 'true');
    setUserProfile(profile);
  };

  const value = {
    user,
    session,
    userProfile,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updateUserProfile,
    completeOnboarding,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 