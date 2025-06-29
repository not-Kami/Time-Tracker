export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
  createdAt: Date;
  notes?: Note[];
  playlist?: Playlist;
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
  pomodoroSettings: PomodoroSettings;
  playlist?: Playlist;
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