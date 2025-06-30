import { useState, useEffect } from 'react';
import { TimeTrackerData } from '../types';

const STORAGE_KEY = 'timeXP-data';

const defaultData: TimeTrackerData = {
  categories: [
    {
      id: '1',
      name: 'Development',
      color: 'blue',
      icon: 'Code2',
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true,
    },
    {
      id: '2',
      name: 'Design',
      color: 'purple',
      icon: 'Palette',
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true,
    },
    {
      id: '3',
      name: 'Personal',
      color: 'green',
      icon: 'User',
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true,
    },
    {
      id: '4',
      name: 'Learning',
      color: 'orange',
      icon: 'Lightbulb',
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true,
    },
  ],
  skills: [
    {
      id: 'sample-1',
      name: 'React Dashboard',
      categoryId: '1',
      description: 'Building a comprehensive admin dashboard with React and TypeScript',
      totalTime: 5 * 60 * 60 * 1000, // 5 hours
      isPinned: true,
      pomodoroSettings: { enabled: false, focusTime: 25, breakTime: 5 },
      difficulty: 'intermediate',
      status: 'active',
      isActive: true,
      tasks: [
        { id: 'task-1', name: 'Setup project structure', completed: true, createdAt: new Date(), updatedAt: new Date() },
        { id: 'task-2', name: 'Create authentication system', completed: true, createdAt: new Date(), updatedAt: new Date() },
        { id: 'task-3', name: 'Build user management', completed: false, createdAt: new Date(), updatedAt: new Date() },
      ],
      sessions: [
        { id: 'session-1', startTime: new Date(Date.now() - 86400000), duration: 2 * 60 * 60 * 1000, createdAt: new Date(), updatedAt: new Date() },
        { id: 'session-2', startTime: new Date(Date.now() - 43200000), duration: 3 * 60 * 60 * 1000, createdAt: new Date(), updatedAt: new Date() },
      ],
      notes: [
        { id: 'note-1', content: 'Remember to implement proper error handling for API calls', createdAt: new Date(Date.now() - 86400000), updatedAt: new Date(Date.now() - 86400000) },
        { id: 'note-2', content: 'Consider using React Query for better data fetching and caching', createdAt: new Date(Date.now() - 43200000), updatedAt: new Date(Date.now() - 43200000) },
      ],
      createdAt: new Date(Date.now() - 172800000),
      updatedAt: new Date(),
    },
    {
      id: 'sample-2',
      name: 'Brand Identity Design',
      categoryId: '2',
      description: 'Complete brand identity package for a tech startup',
      totalTime: 25 * 60 * 60 * 1000, // 25 hours
      isPinned: false,
      pomodoroSettings: { enabled: true, focusTime: 45, breakTime: 10 },
      difficulty: 'advanced',
      status: 'active',
      isActive: true,
      tasks: [
        { id: 'task-4', name: 'Logo concepts', completed: true, createdAt: new Date(), updatedAt: new Date() },
        { id: 'task-5', name: 'Color palette', completed: true, createdAt: new Date(), updatedAt: new Date() },
        { id: 'task-6', name: 'Typography selection', completed: true, createdAt: new Date(), updatedAt: new Date() },
        { id: 'task-7', name: 'Brand guidelines', completed: false, createdAt: new Date(), updatedAt: new Date() },
      ],
      sessions: [
        { id: 'session-3', startTime: new Date(Date.now() - 259200000), duration: 8 * 60 * 60 * 1000, createdAt: new Date(), updatedAt: new Date() },
        { id: 'session-4', startTime: new Date(Date.now() - 172800000), duration: 12 * 60 * 60 * 1000, createdAt: new Date(), updatedAt: new Date() },
        { id: 'session-5', startTime: new Date(Date.now() - 86400000), duration: 5 * 60 * 60 * 1000, createdAt: new Date(), updatedAt: new Date() },
      ],
      notes: [
        { id: 'note-3', content: 'Client prefers minimalist approach with bold typography', createdAt: new Date(Date.now() - 172800000), updatedAt: new Date(Date.now() - 172800000) },
      ],
      createdAt: new Date(Date.now() - 345600000),
      updatedAt: new Date(),
    },
    {
      id: 'sample-3',
      name: 'Guitar Practice',
      categoryId: '3',
      description: 'Daily guitar practice sessions focusing on fingerpicking techniques',
      totalTime: 75 * 60 * 60 * 1000, // 75 hours
      isPinned: true,
      pomodoroSettings: { enabled: true, focusTime: 30, breakTime: 5 },
      difficulty: 'beginner',
      status: 'active',
      isActive: true,
      tasks: [
        { id: 'task-8', name: 'Learn basic chords', completed: true, createdAt: new Date(), updatedAt: new Date() },
        { id: 'task-9', name: 'Practice fingerpicking patterns', completed: true, createdAt: new Date(), updatedAt: new Date() },
        { id: 'task-10', name: 'Learn 5 songs', completed: false, createdAt: new Date(), updatedAt: new Date() },
        { id: 'task-11', name: 'Record first performance', completed: false, createdAt: new Date(), updatedAt: new Date() },
      ],
      sessions: Array.from({ length: 15 }, (_, i) => ({
        id: `guitar-session-${i}`,
        startTime: new Date(Date.now() - (i + 1) * 86400000),
        duration: 5 * 60 * 60 * 1000,
        createdAt: new Date(),
        updatedAt: new Date(),
      })),
      notes: [
        { id: 'note-4', content: 'Focus on clean chord transitions - still struggling with F to C', createdAt: new Date(Date.now() - 86400000), updatedAt: new Date(Date.now() - 86400000) },
        { id: 'note-5', content: 'Discovered a great fingerpicking pattern for "Dust in the Wind"', createdAt: new Date(Date.now() - 43200000), updatedAt: new Date(Date.now() - 43200000) },
      ],
      createdAt: new Date(Date.now() - 1296000000),
      updatedAt: new Date(),
    },
    {
      id: 'sample-4',
      name: 'Machine Learning Course',
      categoryId: '4',
      description: 'Complete online course on machine learning fundamentals',
      totalTime: 150 * 60 * 60 * 1000, // 150 hours
      isPinned: false,
      pomodoroSettings: { enabled: true, focusTime: 50, breakTime: 15 },
      difficulty: 'advanced',
      status: 'active',
      isActive: true,
      tasks: [
        { id: 'task-12', name: 'Linear regression', completed: true, createdAt: new Date(), updatedAt: new Date() },
        { id: 'task-13', name: 'Neural networks', completed: true, createdAt: new Date(), updatedAt: new Date() },
        { id: 'task-14', name: 'Deep learning', completed: true, createdAt: new Date(), updatedAt: new Date() },
        { id: 'task-15', name: 'Final project', completed: false, createdAt: new Date(), updatedAt: new Date() },
      ],
      sessions: Array.from({ length: 30 }, (_, i) => ({
        id: `ml-session-${i}`,
        startTime: new Date(Date.now() - (i + 1) * 86400000),
        duration: 5 * 60 * 60 * 1000,
        createdAt: new Date(),
        updatedAt: new Date(),
      })),
      notes: [
        { id: 'note-6', content: 'Key insight: Feature engineering is often more important than algorithm choice', createdAt: new Date(Date.now() - 172800000), updatedAt: new Date(Date.now() - 172800000) },
        { id: 'note-7', content: 'Final project idea: Predict stock prices using sentiment analysis of news articles', createdAt: new Date(Date.now() - 86400000), updatedAt: new Date(Date.now() - 86400000) },
      ],
      createdAt: new Date(Date.now() - 2592000000),
      updatedAt: new Date(),
    },
    {
      id: 'sample-5',
      name: 'Carpentry Workshop',
      categoryId: '3',
      description: 'Learning traditional woodworking techniques and building furniture',
      totalTime: 1200 * 60 * 60 * 1000, // 1200 hours
      isPinned: false,
      pomodoroSettings: { enabled: false, focusTime: 25, breakTime: 5 },
      difficulty: 'expert',
      status: 'active',
      isActive: true,
      tasks: [
        { id: 'task-16', name: 'Basic joinery techniques', completed: true, createdAt: new Date(), updatedAt: new Date() },
        { id: 'task-17', name: 'Build first table', completed: true, createdAt: new Date(), updatedAt: new Date() },
        { id: 'task-18', name: 'Advanced carving', completed: true, createdAt: new Date(), updatedAt: new Date() },
        { id: 'task-19', name: 'Master bedroom set', completed: false, createdAt: new Date(), updatedAt: new Date() },
      ],
      sessions: Array.from({ length: 100 }, (_, i) => ({
        id: `carpentry-session-${i}`,
        startTime: new Date(Date.now() - (i + 1) * 86400000),
        duration: 12 * 60 * 60 * 1000,
        createdAt: new Date(),
        updatedAt: new Date(),
      })),
      notes: [
        { id: 'note-8', content: 'Always measure twice, cut once - learned this the hard way!', createdAt: new Date(Date.now() - 259200000), updatedAt: new Date(Date.now() - 259200000) },
        { id: 'note-9', content: 'Oak is beautiful but challenging to work with - requires sharp tools', createdAt: new Date(Date.now() - 172800000), updatedAt: new Date(Date.now() - 172800000) },
      ],
      createdAt: new Date(Date.now() - 31536000000),
      updatedAt: new Date(),
    },
    {
      id: 'sample-6',
      name: 'Photography Journey',
      categoryId: '2',
      description: 'Developing photography skills from beginner to professional level',
      totalTime: 12000 * 60 * 60 * 1000, // 12000 hours
      isPinned: true,
      pomodoroSettings: { enabled: false, focusTime: 25, breakTime: 5 },
      difficulty: 'expert',
      status: 'active',
      isActive: true,
      tasks: [
        { id: 'task-20', name: 'Camera basics', completed: true, createdAt: new Date(), updatedAt: new Date() },
        { id: 'task-21', name: 'Portrait photography', completed: true, createdAt: new Date(), updatedAt: new Date() },
        { id: 'task-22', name: 'Wedding photography', completed: true, createdAt: new Date(), updatedAt: new Date() },
        { id: 'task-23', name: 'Start photography business', completed: true, createdAt: new Date(), updatedAt: new Date() },
      ],
      sessions: Array.from({ length: 200 }, (_, i) => ({
        id: `photo-session-${i}`,
        startTime: new Date(Date.now() - (i + 1) * 86400000),
        duration: 60 * 60 * 60 * 1000,
        createdAt: new Date(),
        updatedAt: new Date(),
      })),
      notes: [
        { id: 'note-10', content: 'Golden hour is overrated - blue hour creates more dramatic portraits', createdAt: new Date(Date.now() - 345600000), updatedAt: new Date(Date.now() - 345600000) },
        { id: 'note-11', content: 'Invested in 85mm f/1.4 lens - game changer for portrait work', createdAt: new Date(Date.now() - 259200000), updatedAt: new Date(Date.now() - 259200000) },
        { id: 'note-12', content: 'First paid wedding shoot next month - nervous but excited!', createdAt: new Date(Date.now() - 86400000), updatedAt: new Date(Date.now() - 86400000) },
      ],
      createdAt: new Date(Date.now() - 157680000000),
      updatedAt: new Date(),
    },
  ],
  userProfile: {
    id: 'user-1',
    email: 'user@example.com',
    fullName: 'Demo User',
    timezone: 'UTC',
    achievementLevel: 'Beginner',
    totalTimeLogged: 0,
    totalTasksCompleted: 0,
    totalSessions: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    settings: {},
  },
  userSettings: {
    theme: 'system',
    language: 'en',
    soundNotifications: true,
    monthlyReports: true,
    weeklyReminders: true,
    pomodoroSound: true,
    achievementSound: true,
    emailNotifications: false,
    pushNotifications: false,
  },
  achievements: [],
  version: '1.0.0',
};

export function useLocalStorage() {
  const [data, setData] = useState<TimeTrackerData>(defaultData);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsedData = JSON.parse(stored);
        
        // Convert date strings back to Date objects and ensure camelCase properties
        parsedData.categories = parsedData.categories?.map((cat: any) => ({
          ...cat,
          createdAt: new Date(cat.createdAt || cat.created_at || new Date()),
          updatedAt: new Date(cat.updatedAt || cat.updated_at || new Date()),
          isActive: cat.isActive !== undefined ? cat.isActive : (cat.is_active !== undefined ? cat.is_active : true),
        })) || defaultData.categories;
        
        // Handle both 'projects' (old) and 'skills' (new) for backward compatibility
        const skillsData = parsedData.skills || parsedData.projects || [];
        parsedData.skills = skillsData.map((skill: any) => ({
          ...skill,
          categoryId: skill.categoryId || skill.category_id,
          totalTime: skill.totalTime || skill.total_time || 0,
          isPinned: skill.isPinned !== undefined ? skill.isPinned : (skill.is_pinned !== undefined ? skill.is_pinned : false),
          pomodoroSettings: skill.pomodoroSettings || skill.pomodoro_settings || { enabled: false, focusTime: 25, breakTime: 5 },
          createdAt: new Date(skill.createdAt || skill.created_at || new Date()),
          updatedAt: new Date(skill.updatedAt || skill.updated_at || new Date()),
          isActive: skill.isActive !== undefined ? skill.isActive : (skill.is_active !== undefined ? skill.is_active : true),
          difficulty: skill.difficulty || 'beginner',
          status: skill.status || 'active',
          tasks: skill.tasks?.map((task: any) => ({
            ...task,
            createdAt: new Date(task.createdAt || task.created_at || new Date()),
            updatedAt: new Date(task.updatedAt || task.updated_at || new Date()),
            completedAt: task.completedAt || task.completed_at ? new Date(task.completedAt || task.completed_at) : undefined,
          })) || [],
          sessions: skill.sessions?.map((session: any) => ({
            ...session,
            startTime: new Date(session.startTime || session.start_time || new Date()),
            endTime: session.endTime || session.end_time ? new Date(session.endTime || session.end_time) : undefined,
            createdAt: new Date(session.createdAt || session.created_at || new Date()),
            updatedAt: new Date(session.updatedAt || session.updated_at || new Date()),
          })) || [],
          notes: skill.notes?.map((note: any) => ({
            ...note,
            createdAt: new Date(note.createdAt || note.created_at || new Date()),
            updatedAt: new Date(note.updatedAt || note.updated_at || new Date()),
          })) || [],
        }));
        
        // Ensure userProfile exists with proper camelCase
        parsedData.userProfile = parsedData.userProfile ? {
          ...parsedData.userProfile,
          fullName: parsedData.userProfile.fullName || parsedData.userProfile.full_name,
          dateOfBirth: parsedData.userProfile.dateOfBirth || parsedData.userProfile.date_of_birth ? 
            new Date(parsedData.userProfile.dateOfBirth || parsedData.userProfile.date_of_birth) : undefined,
          lastLoginAt: parsedData.userProfile.lastLoginAt || parsedData.userProfile.last_login_at ? 
            new Date(parsedData.userProfile.lastLoginAt || parsedData.userProfile.last_login_at) : undefined,
          achievementLevel: parsedData.userProfile.achievementLevel || parsedData.userProfile.achievement_level || 'Beginner',
          totalTimeLogged: parsedData.userProfile.totalTimeLogged || parsedData.userProfile.total_time_logged || 0,
          totalTasksCompleted: parsedData.userProfile.totalTasksCompleted || parsedData.userProfile.total_tasks_completed || 0,
          totalSessions: parsedData.userProfile.totalSessions || parsedData.userProfile.total_sessions || 0,
          createdAt: new Date(parsedData.userProfile.createdAt || parsedData.userProfile.created_at || new Date()),
          updatedAt: new Date(parsedData.userProfile.updatedAt || parsedData.userProfile.updated_at || new Date()),
        } : defaultData.userProfile;
        
        // Ensure userSettings exists with proper camelCase
        parsedData.userSettings = parsedData.userSettings ? {
          ...parsedData.userSettings,
          soundNotifications: parsedData.userSettings.soundNotifications !== undefined ? 
            parsedData.userSettings.soundNotifications : 
            (parsedData.userSettings.sound_notifications !== undefined ? parsedData.userSettings.sound_notifications : true),
          monthlyReports: parsedData.userSettings.monthlyReports !== undefined ? 
            parsedData.userSettings.monthlyReports : 
            (parsedData.userSettings.monthly_reports !== undefined ? parsedData.userSettings.monthly_reports : true),
          weeklyReminders: parsedData.userSettings.weeklyReminders !== undefined ? 
            parsedData.userSettings.weeklyReminders : 
            (parsedData.userSettings.weekly_reminders !== undefined ? parsedData.userSettings.weekly_reminders : true),
          pomodoroSound: parsedData.userSettings.pomodoroSound !== undefined ? 
            parsedData.userSettings.pomodoroSound : 
            (parsedData.userSettings.pomodoro_sound !== undefined ? parsedData.userSettings.pomodoro_sound : true),
          achievementSound: parsedData.userSettings.achievementSound !== undefined ? 
            parsedData.userSettings.achievementSound : 
            (parsedData.userSettings.achievement_sound !== undefined ? parsedData.userSettings.achievement_sound : true),
          emailNotifications: parsedData.userSettings.emailNotifications !== undefined ? 
            parsedData.userSettings.emailNotifications : 
            (parsedData.userSettings.email_notifications !== undefined ? parsedData.userSettings.email_notifications : false),
          pushNotifications: parsedData.userSettings.pushNotifications !== undefined ? 
            parsedData.userSettings.pushNotifications : 
            (parsedData.userSettings.push_notifications !== undefined ? parsedData.userSettings.push_notifications : false),
        } : defaultData.userSettings;
        
        // Ensure achievements exists with proper camelCase
        parsedData.achievements = parsedData.achievements?.map((achievement: any) => ({
          ...achievement,
          unlockedAt: new Date(achievement.unlockedAt || achievement.unlocked_at || new Date()),
          progressValue: achievement.progressValue || achievement.progress_value || 0,
          targetValue: achievement.targetValue || achievement.target_value || 0,
        })) || [];
        
        setData(parsedData);
      } else {
        setData(defaultData);
      }
    } catch (error) {
      console.error('Error loading data from localStorage:', error);
      setData(defaultData);
    }
    setIsLoaded(true);
  }, []);

  const saveData = (newData: TimeTrackerData) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
      setData(newData);
    } catch (error) {
      console.error('Error saving data to localStorage:', error);
    }
  };

  const exportData = () => {
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `time-tracker-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return {
    data,
    saveData,
    exportData,
    isLoaded,
  };
}