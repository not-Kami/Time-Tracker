import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Skill, Category, UserProfile, UserSettings, Achievement } from '../types';

export function useSupabaseData() {
  const { user } = useAuth();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userSettings, setUserSettings] = useState<UserSettings | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch user profile
  const fetchUserProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        // If user doesn't exist, create one
        if (error.code === 'PGRST116') {
          const { data: newUser, error: createError } = await supabase
            .from('users')
            .insert({
              id: user.id,
              email: user.email,
              full_name: user.user_metadata?.full_name,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            })
            .select()
            .single();

          if (createError) throw createError;
          setUserProfile(newUser);
        } else {
          throw error;
        }
      } else {
        setUserProfile(data);
      }
    } catch (err) {
      console.error('Error fetching user profile:', err);
      setError('Failed to load user profile');
    }
  };

  // Fetch user settings
  const fetchUserSettings = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) {
        // If settings don't exist, create default ones
        if (error.code === 'PGRST116') {
          const defaultSettings = {
            user_id: user.id,
            theme: 'light',
            language: 'en',
            sound_notifications: true,
            monthly_reports: false,
            weekly_reminders: false,
            pomodoro_sound: true,
            achievement_sound: true,
            email_notifications: true,
            push_notifications: false,
          };

          const { data: newSettings, error: createError } = await supabase
            .from('user_settings')
            .insert(defaultSettings)
            .select()
            .single();

          if (createError) throw createError;
          setUserSettings(newSettings);
        } else {
          throw error;
        }
      } else {
        setUserSettings(data);
      }
    } catch (err) {
      console.error('Error fetching user settings:', err);
      setError('Failed to load user settings');
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('created_at', { ascending: true });

      if (error) throw error;

      const categoriesWithDates = data.map(cat => ({
        ...cat,
        created_at: new Date(cat.created_at),
        updated_at: new Date(cat.updated_at),
      }));

      setCategories(categoriesWithDates);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError('Failed to load categories');
    }
  };

  // Fetch skills with related data
  const fetchSkills = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('skills')
        .select(`
          *,
          tasks(*),
          sessions(*),
          notes(*)
        `)
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const skillsWithDates = data.map(skill => ({
        ...skill,
        created_at: new Date(skill.created_at),
        updated_at: new Date(skill.updated_at),
        tasks: skill.tasks?.map((task: any) => ({
          ...task,
          created_at: new Date(task.created_at),
          updated_at: new Date(task.updated_at),
          completed_at: task.completed_at ? new Date(task.completed_at) : undefined,
          deadline: task.deadline ? new Date(task.deadline) : undefined,
        })) || [],
        sessions: skill.sessions?.map((session: any) => ({
          ...session,
          start_time: new Date(session.start_time),
          end_time: session.end_time ? new Date(session.end_time) : undefined,
          created_at: new Date(session.created_at),
          updated_at: new Date(session.updated_at),
        })) || [],
        notes: skill.notes?.map((note: any) => ({
          ...note,
          created_at: new Date(note.created_at),
          updated_at: new Date(note.updated_at),
        })) || [],
      }));

      setSkills(skillsWithDates);
    } catch (err) {
      console.error('Error fetching skills:', err);
      setError('Failed to load skills');
    }
  };

  // Fetch achievements
  const fetchAchievements = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('achievements')
        .select('*')
        .eq('user_id', user.id)
        .order('unlocked_at', { ascending: false });

      if (error) throw error;

      const achievementsWithDates = data.map(achievement => ({
        ...achievement,
        unlocked_at: new Date(achievement.unlocked_at),
      }));

      setAchievements(achievementsWithDates);
    } catch (err) {
      console.error('Error fetching achievements:', err);
      setError('Failed to load achievements');
    }
  };

  // Create category
  const createCategory = async (categoryData: Omit<Category, 'id' | 'created_at' | 'updated_at' | 'is_active'>) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('categories')
        .insert({
          ...categoryData,
          user_id: user.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          is_active: true,
        })
        .select()
        .single();

      if (error) throw error;

      const newCategory = {
        ...data,
        created_at: new Date(data.created_at),
        updated_at: new Date(data.updated_at),
      };

      setCategories(prev => [...prev, newCategory]);
      return newCategory;
    } catch (err) {
      console.error('Error creating category:', err);
      setError('Failed to create category');
      return null;
    }
  };

  // Create skill
  const createSkill = async (skillData: Omit<Skill, 'id' | 'created_at' | 'updated_at' | 'is_active' | 'tasks' | 'sessions' | 'notes'>) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('skills')
        .insert({
          ...skillData,
          user_id: user.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          is_active: true,
        })
        .select()
        .single();

      if (error) throw error;

      const newSkill = {
        ...data,
        created_at: new Date(data.created_at),
        updated_at: new Date(data.updated_at),
        tasks: [],
        sessions: [],
        notes: [],
      };

      setSkills(prev => [newSkill, ...prev]);
      return newSkill;
    } catch (err) {
      console.error('Error creating skill:', err);
      setError('Failed to create skill');
      return null;
    }
  };

  // Update skill
  const updateSkill = async (skillId: string, updates: Partial<Skill>) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('skills')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', skillId)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      const updatedSkill = {
        ...data,
        created_at: new Date(data.created_at),
        updated_at: new Date(data.updated_at),
      };

      setSkills(prev => prev.map(skill => 
        skill.id === skillId 
          ? { ...skill, ...updatedSkill }
          : skill
      ));

      return updatedSkill;
    } catch (err) {
      console.error('Error updating skill:', err);
      setError('Failed to update skill');
      return null;
    }
  };

  // Update user settings
  const updateUserSettings = async (updates: Partial<UserSettings>) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('user_settings')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      setUserSettings(data);
      return data;
    } catch (err) {
      console.error('Error updating user settings:', err);
      setError('Failed to update settings');
      return null;
    }
  };

  // Initialize data when user changes
  useEffect(() => {
    if (user) {
      setLoading(true);
      setError(null);
      
      Promise.all([
        fetchUserProfile(),
        fetchUserSettings(),
        fetchCategories(),
        fetchSkills(),
        fetchAchievements(),
      ]).finally(() => {
        setLoading(false);
      });
    } else {
      // Clear data when user logs out
      setSkills([]);
      setCategories([]);
      setUserProfile(null);
      setUserSettings(null);
      setAchievements([]);
      setLoading(false);
    }
  }, [user]);

  return {
    skills,
    categories,
    userProfile,
    userSettings,
    achievements,
    loading,
    error,
    createCategory,
    createSkill,
    updateSkill,
    updateUserSettings,
    refetch: () => {
      if (user) {
        fetchCategories();
        fetchSkills();
        fetchAchievements();
      }
    },
  };
}