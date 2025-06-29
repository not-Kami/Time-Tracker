export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
  description?: string;
  created_at: Date;
  updated_at: Date;
  is_active: boolean;
  notes?: Note[];
  playlist?: Playlist;
}

export interface Task {
  id: string;
  name: string;
  description?: string;
  completed: boolean;
  priority?: 'low' | 'medium' | 'high';
  estimated_hours?: number;
  actual_hours?: number;
  deadline?: Date;
  tags?: string[];
  created_at: Date;
  updated_at: Date;
  completed_at?: Date;
}

export interface Session {
  id: string;
  start_time: Date;
  end_time?: Date;
  duration: number; // in milliseconds
  description?: string;
  pomodoro_session?: boolean;
  is_break?: boolean;
  mood_rating?: number; // 1-5
  focus_score?: number; // 1-10
  interruptions?: number;
  created_at: Date;
  updated_at: Date;
}

export interface Note {
  id: string;
  title?: string;
  content: string;
  tags?: string[];
  created_at: Date;
  updated_at: Date;
}

export interface Playlist {
  id: string;
  name: string;
  url: string;
  platform: 'spotify' | 'youtube' | 'apple' | 'other';
  created_at: Date;
}

export interface PomodoroSettings {
  enabled: boolean;
  focusTime: number; // in minutes
  breakTime: number; // in minutes
}

export interface Skill {
  id: string;
  name: string;
  category_id: string;
  description?: string;
  target_hours?: number; // in milliseconds
  total_time: number; // in milliseconds
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  status: 'active' | 'paused' | 'completed' | 'archived';
  is_pinned: boolean;
  pomodoro_settings: PomodoroSettings;
  playlist_url?: string;
  playlist_name?: string;
  playlist_platform?: 'spotify' | 'youtube' | 'apple' | 'other';
  tasks: Task[];
  sessions: Session[];
  notes: Note[];
  created_at: Date;
  updated_at: Date;
  is_active: boolean;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  nickname?: string;
  date_of_birth?: Date;
  last_login_at?: Date;
  timezone: string;
  achievement_level: string;
  total_time_logged: number;
  total_tasks_completed: number;
  total_sessions: number;
  created_at: Date;
  updated_at: Date;
  settings: Record<string, any>;
}

export interface UserSettings {
  theme: 'light' | 'dark' | 'system';
  language: 'en' | 'es' | 'fr' | 'it' | 'de' | 'nl' | 'pt' | 'sv';
  sound_notifications: boolean;
  monthly_reports: boolean;
  weekly_reminders: boolean;
  pomodoro_sound: boolean;
  achievement_sound: boolean;
  email_notifications: boolean;
  push_notifications: boolean;
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
  unlocked_at: Date;
  progress_value: number;
  target_value: number;
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