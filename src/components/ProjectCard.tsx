import React from 'react';
import { Play, Pause, Square, Star, StarOff, Timer } from 'lucide-react';
import { Skill, Category, TimerState } from '../types';
import { formatHours, formatDetailedTime, getCategoryColor, getAchievementLevel } from '../utils/helpers';
import { useLanguage } from '../contexts/LanguageContext';

interface ProjectCardProps {
  skill: Skill;
  category: Category;
  timerState: TimerState;
  onStartTimer: () => void;
  onPauseTimer: () => void;
  onResumeTimer: () => void;
  onStopTimer: () => void;
  onTogglePin: (skillId: string) => void;
  onClick: () => void;
  showCategory?: boolean;
}

export function ProjectCard({
  skill,
  category,
  timerState,
  onStartTimer,
  onPauseTimer,
  onResumeTimer,
  onStopTimer,
  onTogglePin,
  onClick,
  showCategory = false,
}: ProjectCardProps) {
  const { t } = useLanguage();
  const colorClasses = getCategoryColor(category.color);
  const currentTime = skill.totalTime + timerState.elapsedTime;
  const completedTasks = skill.tasks.filter(task => task.completed).length;
  const achievement = getAchievementLevel(currentTime);
  
  // Calculate pomodoro sessions for this skill
  const pomodoroSessions = skill.sessions.filter(session => 
    session.pomodoroSession && !session.isBreak
  ).length;

  const handleTimerAction = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (timerState.status === 'idle') {
      onStartTimer();
    } else if (timerState.status === 'running') {
      onPauseTimer();
    } else if (timerState.status === 'paused') {
      onResumeTimer();
    }
  };

  const handleStopTimer = (e: React.MouseEvent) => {
    e.stopPropagation();
    onStopTimer();
  };

  const handleTogglePin = (e: React.MouseEvent) => {
    e.stopPropagation();
    onTogglePin(skill.id);
  };

  return (
    <div
      onClick={onClick}
      className={`rounded-2xl shadow-lg border-2 p-6 hover:shadow-xl transition-all duration-300 cursor-pointer group transform hover:-translate-y-1 ${achievement.bgColor} ${achievement.borderColor} bg-white dark:bg-gray-800 flex flex-col relative`}
    >
      {/* Pin Button - Top left, above category */}
      <div className="absolute top-4 left-4 z-10">
        <button
          onClick={handleTogglePin}
          className={`p-1.5 rounded-lg transition-all duration-200 transform hover:scale-110 ${
            skill.isPinned
              ? 'text-yellow-500 hover:text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30'
              : 'text-gray-400 hover:text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/20'
          }`}
        >
          {skill.isPinned ? <Star className="w-4 h-4 fill-current" /> : <StarOff className="w-4 h-4" />}
        </button>
      </div>

      {/* Timer Controls - Top right */}
      <div className="absolute top-4 right-4 flex items-center space-x-2 z-10">
        {timerState.status !== 'idle' && (
          <button
            onClick={handleStopTimer}
            className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-all duration-200 transform hover:scale-110 shadow-lg shadow-red-500/25"
          >
            <Square className="w-4 h-4" />
          </button>
        )}
        
        <button
          onClick={handleTimerAction}
          className={`p-2 rounded-lg transition-all duration-200 transform hover:scale-110 shadow-lg ${
            timerState.status === 'running'
              ? 'bg-orange-500 text-white hover:bg-orange-600 shadow-orange-500/25'
              : 'bg-green-500 text-white hover:bg-green-600 shadow-green-500/25'
          }`}
        >
          {timerState.status === 'running' ? (
            <Pause className="w-4 h-4" />
          ) : (
            <Play className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Content with proper spacing for positioned buttons */}
      <div className="mt-8 mb-4">
        <div className="flex items-center space-x-3 flex-wrap mb-3">
          {showCategory && (
            <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${colorClasses.bg} ${colorClasses.text} text-center`}>
              {category.name}
            </span>
          )}
          <div className="flex items-center space-x-1">
            {Array.from({ length: achievement.stars }).map((_, i) => (
              <Star key={i} className={`w-4 h-4 fill-current bg-gradient-to-r ${achievement.color} text-transparent bg-clip-text`} />
            ))}
            <span className={`text-sm font-bold ${achievement.textColor} text-center`}>
              {achievement.level}
            </span>
          </div>
          {skill.pomodoroSettings.enabled && (
            <div className="flex items-center space-x-1 text-red-600 dark:text-red-400">
              <Timer className="w-4 h-4" />
              <span className="text-xs font-bold text-center">
                {skill.pomodoroSettings.focusTime}m/{skill.pomodoroSettings.breakTime}m
              </span>
            </div>
          )}
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {skill.name}
        </h3>
        {skill.description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{skill.description}</p>
        )}
      </div>

      <div className="flex-1 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{t('skills.totalTime')}</span>
          <span className="font-mono text-xl font-bold text-gray-900 dark:text-white text-center">
            {timerState.status !== 'idle' ? formatDetailedTime(currentTime) : formatHours(currentTime)}
          </span>
        </div>

        {skill.tasks.length > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{t('skills.tasks')}</span>
            <span className="text-sm font-bold text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-lg text-center">
              {completedTasks}/{skill.tasks.length}
            </span>
          </div>
        )}

        {skill.pomodoroSettings.enabled && pomodoroSessions > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Pomodoros</span>
            <span className="text-sm font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded-lg text-center">
              {pomodoroSessions}
            </span>
          </div>
        )}

        {achievement.nextMilestone === 0 && (
          <div className="text-center py-3">
            <span className="text-sm font-bold text-purple-600 dark:text-purple-400">🎉 {t('achievements.maxLevel')}</span>
          </div>
        )}
      </div>
    </div>
  );
}