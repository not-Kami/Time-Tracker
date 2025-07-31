import { User } from '@supabase/supabase-js';

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

export function formatTime(milliseconds: number): string {
  const totalMinutes = Math.floor(milliseconds / (1000 * 60));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours > 0) {
    if (minutes > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${hours}h`;
  }
  if (minutes > 0) {
    return `${minutes}m`;
  }
  return '0m';
}

export function formatHours(milliseconds: number): string {
  const hours = milliseconds / (1000 * 60 * 60);
  if (hours >= 1) {
    return `${hours.toFixed(1)}h`;
  }
  const minutes = Math.floor(milliseconds / (1000 * 60));
  return `${minutes}m`;
}

export function formatDetailedTime(milliseconds: number): string {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  const h = hours.toString().padStart(2, '0');
  const m = (minutes % 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');

  return `${h}:${m}:${s}`;
}

export function getProgressToGoal(currentTime: number, goalHours: number = 1000): number {
  const goalMs = goalHours * 60 * 60 * 1000;
  return Math.min((currentTime / goalMs) * 100, 100);
}

export function getAchievementLevel(milliseconds: number): {
  level: string;
  stars: number;
  color: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
  nextMilestone: number;
  progress: number;
  hoursToNext: number;
} {
  const hours = milliseconds / (1000 * 60 * 60);
  
  if (hours >= 10000) {
    return {
      level: 'Master',
      stars: 5,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-gradient-to-br from-purple-900/10 to-pink-900/10 dark:from-purple-500/20 dark:to-pink-500/20',
      borderColor: 'border-purple-500 dark:border-purple-400',
      textColor: 'text-purple-700 dark:text-purple-300',
      nextMilestone: 0,
      progress: 100,
      hoursToNext: 0
    };
  } else if (hours >= 1000) {
    return {
      level: 'Expert',
      stars: 4,
      color: 'from-yellow-500 to-orange-500',
      bgColor: 'bg-gradient-to-br from-yellow-900/10 to-orange-900/10 dark:from-yellow-500/20 dark:to-orange-500/20',
      borderColor: 'border-yellow-500 dark:border-yellow-400',
      textColor: 'text-yellow-700 dark:text-yellow-300',
      nextMilestone: 10000,
      progress: ((hours - 1000) / 9000) * 100,
      hoursToNext: 10000 - hours
    };
  } else if (hours >= 100) {
    return {
      level: 'Advanced',
      stars: 3,
      color: 'from-slate-400 to-slate-600',
      bgColor: 'bg-gradient-to-br from-slate-900/10 to-slate-900/20 dark:from-slate-500/20 dark:to-slate-600/20',
      borderColor: 'border-slate-500 dark:border-slate-400',
      textColor: 'text-slate-700 dark:text-slate-300',
      nextMilestone: 1000,
      progress: ((hours - 100) / 900) * 100,
      hoursToNext: 1000 - hours
    };
  } else if (hours >= 50) {
    return {
      level: 'Intermediate',
      stars: 2,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-gradient-to-br from-blue-900/10 to-cyan-900/10 dark:from-blue-500/20 dark:to-cyan-500/20',
      borderColor: 'border-blue-500 dark:border-blue-400',
      textColor: 'text-blue-700 dark:text-blue-300',
      nextMilestone: 100,
      progress: ((hours - 50) / 50) * 100,
      hoursToNext: 100 - hours
    };
  } else if (hours >= 10) {
    return {
      level: 'Beginner',
      stars: 1,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-gradient-to-br from-green-900/10 to-emerald-900/10 dark:from-green-500/20 dark:to-emerald-500/20',
      borderColor: 'border-green-500 dark:border-green-400',
      textColor: 'text-green-700 dark:text-green-300',
      nextMilestone: 50,
      progress: ((hours - 10) / 40) * 100,
      hoursToNext: 50 - hours
    };
  } else {
    return {
      level: 'Starter',
      stars: 0,
      color: 'from-gray-400 to-gray-500',
      bgColor: 'bg-gradient-to-br from-gray-900/5 to-gray-900/10 dark:from-gray-500/10 dark:to-gray-600/10',
      borderColor: 'border-gray-400 dark:border-gray-500',
      textColor: 'text-gray-600 dark:text-gray-400',
      nextMilestone: 10,
      progress: (hours / 10) * 100,
      hoursToNext: 10 - hours
    };
  }
}

export function getCategoryColor(color: string): { bg: string; text: string; border: string } {
  const colors = {
    blue: {
      bg: 'bg-blue-600/10 dark:bg-blue-500/20',
      text: 'text-blue-700 dark:text-blue-300',
      border: 'border-blue-500 dark:border-blue-400',
    },
    purple: {
      bg: 'bg-purple-600/10 dark:bg-purple-500/20',
      text: 'text-purple-700 dark:text-purple-300',
      border: 'border-purple-500 dark:border-purple-400',
    },
    green: {
      bg: 'bg-green-600/10 dark:bg-green-500/20',
      text: 'text-green-700 dark:text-green-300',
      border: 'border-green-500 dark:border-green-400',
    },
    orange: {
      bg: 'bg-orange-600/10 dark:bg-orange-500/20',
      text: 'text-orange-700 dark:text-orange-300',
      border: 'border-orange-500 dark:border-orange-400',
    },
    red: {
      bg: 'bg-red-600/10 dark:bg-red-500/20',
      text: 'text-red-700 dark:text-red-300',
      border: 'border-red-500 dark:border-red-400',
    },
    indigo: {
      bg: 'bg-indigo-600/10 dark:bg-indigo-500/20',
      text: 'text-indigo-700 dark:text-indigo-300',
      border: 'border-indigo-500 dark:border-indigo-400',
    },
  };

  return colors[color as keyof typeof colors] || colors.blue;
}

/**
 * Get a smart display name for the user
 * Priority: user_metadata.name > user_metadata.full_name > email prefix > 'User'
 */
export function getUserDisplayName(user: User | null): string {
  if (!user) return 'User';
  
  const metadata = user.user_metadata || {};
  
  // Try user_metadata.name first
  if (metadata.name && typeof metadata.name === 'string') {
    return metadata.name;
  }
  
  // Try user_metadata.full_name
  if (metadata.full_name && typeof metadata.full_name === 'string') {
    return metadata.full_name;
  }
  
  // Fallback to email prefix
  if (user.email) {
    return user.email.split('@')[0];
  }
  
  return 'User';
}

/**
 * Get a smart nickname for the user
 * Priority: user_metadata.nickname > user_metadata.preferred_username > email prefix > display name
 */
export function getUserNickname(user: User | null): string {
  if (!user) return 'User';
  
  const metadata = user.user_metadata || {};
  
  // Try user_metadata.nickname
  if (metadata.nickname && typeof metadata.nickname === 'string') {
    return metadata.nickname;
  }
  
  // Try user_metadata.preferred_username
  if (metadata.preferred_username && typeof metadata.preferred_username === 'string') {
    return metadata.preferred_username;
  }
  
  // Fallback to email prefix
  if (user.email) {
    return user.email.split('@')[0];
  }
  
  return 'User';
}

/**
 * Get user's full name with fallbacks
 * Priority: user_metadata.full_name > user_metadata.name > email prefix
 */
export function getUserFullName(user: User | null): string {
  if (!user) return '';
  
  const metadata = user.user_metadata || {};
  
  // Try user_metadata.full_name
  if (metadata.full_name && typeof metadata.full_name === 'string') {
    return metadata.full_name;
  }
  
  // Try user_metadata.name
  if (metadata.name && typeof metadata.name === 'string') {
    return metadata.name;
  }
  
  // Fallback to email prefix
  if (user.email) {
    return user.email.split('@')[0];
  }
  
  return '';
}

/**
 * Get user's avatar URL with fallback
 */
export function getUserAvatarUrl(user: User | null): string | null {
  if (!user) return null;
  
  const metadata = user.user_metadata || {};
  
  // Try user_metadata.avatar_url
  if (metadata.avatar_url && typeof metadata.avatar_url === 'string') {
    return metadata.avatar_url;
  }
  
  // Try user_metadata.picture
  if (metadata.picture && typeof metadata.picture === 'string') {
    return metadata.picture;
  }
  
  return null;
}

/**
 * Get user's email with fallback
 */
export function getUserEmail(user: User | null): string {
  return user?.email || '';
}

/**
 * Get user's timezone
 */
export function getUserTimezone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

/**
 * Generate initials from user name
 */
export function getUserInitials(user: User | null): string {
  if (!user) return 'U';
  
  const displayName = getUserDisplayName(user);
  const words = displayName.split(' ');
  
  if (words.length >= 2) {
    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  }
  
  return displayName.substring(0, 2).toUpperCase();
}

/**
 * Generate a default avatar color based on user name
 */
export function getUserAvatarColor(user: User | null): string {
  if (!user) return '#6B7280';
  
  const displayName = getUserDisplayName(user);
  const colors = [
    '#EF4444', '#F59E0B', '#10B981', '#3B82F6', 
    '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'
  ];
  
  let hash = 0;
  for (let i = 0; i < displayName.length; i++) {
    hash = displayName.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  return colors[Math.abs(hash) % colors.length];
}