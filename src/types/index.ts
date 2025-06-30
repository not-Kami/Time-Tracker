export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  notes?: Note[];
  playlist?: Playlist;
}

export interface Task {
  id: string;
  name: string;
  description?: string;
  completed: boolean;
  priority?: 'low' | 'medium' | 'high';
  estimatedHours?: number;
  actualHours?: number;
  deadline?: Date;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

export interface Session {
  id: string;
  startTime: Date;
  endTime?: Date;
  duration: number; // in milliseconds
  description?: string;
  pomodoroSession?: boolean;
  isBreak?: boolean;
  moodRating?: number; // 1-5
  focusScore?: number; // 1-10
  interruptions?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Note {
  id: string;
  title?: string;
  content: string;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Playlist {
  id: string;
  name: string;
  url: string;
  platform: 'spotify' | 'youtube' | 'apple' | 'other';
  createdAt: Date;
}

export interface PomodoroSettings {
  enabled: boolean;
  focusTime: number; // in minutes
  breakTime: number; // in minutes
}

export interface Skill {
  id: string;
  name: string;
  categoryId: string;
  description?: string;
  targetHours?: number; // in milliseconds
  totalTime: number; // in milliseconds
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  status: 'active' | 'paused' | 'completed' | 'archived';
  isPinned: boolean;
  pomodoroSettings: PomodoroSettings;
  playlistUrl?: string;
  playlistName?: string;
  playlistPlatform?: 'spotify' | 'youtube' | 'apple' | 'other';
  tasks: Task[];
  sessions: Session[];
  notes: Note[];
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

export interface UserProfile {
  id: string;
  email: string;
  fullName?: string;
  nickname?: string;
  dateOfBirth?: Date;
  lastLoginAt?: Date;
  timezone: string;
  achievementLevel: string;
  totalTimeLogged: number;
  totalTasksCompleted: number;
  totalSessions: number;
  createdAt: Date;
  updatedAt: Date;
  settings: Record<string, any>;
}

export interface UserSettings {
  theme: 'light' | 'dark' | 'system';
  language: 'en' | 'es' | 'fr' | 'it' | 'de' | 'nl' | 'pt' | 'sv';
  soundNotifications: boolean;
  monthlyReports: boolean;
  weeklyReminders: boolean;
  pomodoroSound: boolean;
  achievementSound: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
}

export interface Achievement {
  id: string;
  type: string;
  level: string;
  title: string;
  description: string;
  icon?: string;
  color?: string;
  points: number;
  unlockedAt: Date;
  progressValue: number;
  targetValue: number;
}

export interface TimeTrackerData {
  categories: Category[];
  skills: Skill[];
  userProfile: UserProfile;
  userSettings: UserSettings;
  achievements: Achievement[];
  version: string;
}

export type TimerStatus = 'idle' | 'running' | 'paused';

export interface TimerState {
  status: TimerStatus;
  currentSession: Session | null;
  elapsedTime: number;
}