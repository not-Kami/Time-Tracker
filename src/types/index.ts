export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
  createdAt: Date;
  notes?: Note[];
  isDefault?: boolean; // Indique si c'est une catégorie par défaut
  skills?: Skill[]; // Skills associés à cette catégorie
}

export interface Task {
  id: string;
  name: string;
  completed: boolean;
  createdAt: Date;
  deadline?: Date;
  priority?: 'low' | 'medium' | 'high';
}

export interface Session {
  id: string;
  startTime: Date;
  endTime?: Date;
  duration: number; // in milliseconds
  createdAt: Date;
  description?: string;
  pomodoroSession?: boolean;
  isBreak?: boolean;
}

export interface Note {
  id: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}



export interface PomodoroSettings {
  enabled: boolean;
  focusTime: number; // in minutes
  breakTime: number; // in minutes
}

export interface Project {
  id: string;
  name: string;
  categoryId: string;
  description?: string;
  totalTime: number; // in milliseconds
  tasks: Task[];
  sessions: Session[];
  notes: Note[];
  isPinned: boolean;
  isArchived: boolean;
  pomodoroSettings: PomodoroSettings;

  createdAt: Date;
  updatedAt: Date;
}

export interface TimeTrackerData {
  categories: Category[];
  projects: Project[];
  version: string;
}

export type TimerStatus = 'idle' | 'running' | 'paused';

export interface TimerState {
  status: TimerStatus;
  currentSession: Session | null;
  elapsedTime: number;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  icon: string;
  color: string;
  description?: string;
  popularity: number; // number of users who selected this skill
  isActive: boolean;
  isDefault?: boolean; // Indique si c'est un skill par défaut
  isTrending?: boolean; // Indique si le skill est trending
  trendingReason?: string; // Raison du trending
  difficulty?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  targetHours?: number; // Objectif en heures
  totalTime?: number; // Temps total passé
  createdAt: string;
  updatedAt: string;
}

// Nouvelles interfaces pour les catégories et skills par défaut
export interface DefaultCategory {
  id: string;
  name: string;
  color: string;
  icon: string;
  description?: string;
  isActive: boolean;
  sortOrder: number;
  skills: DefaultSkill[];
  createdAt: string;
  updatedAt: string;
}

export interface DefaultSkill {
  id: string;
  name: string;
  description?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  isTrending: boolean;
  trendingReason?: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface OnboardingData {
  nickname: string;
  preferredLanguage: string;
  selectedSkills?: string[]; // array of skill IDs
  timezone: string;
  dailyGoal?: number;
}