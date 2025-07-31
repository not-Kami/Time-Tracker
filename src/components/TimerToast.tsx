import React, { useState } from 'react';
import { Play, Pause, Square, Timer, Coffee, Minimize2, Maximize2, X, Eye, EyeOff } from 'lucide-react';
import { Project, Category, TimerState } from '../types';
import { formatDetailedTime, getCategoryColor } from '../utils/helpers';
import { useLanguage } from '../contexts/LanguageContext';

interface TimerToastProps {
  project: Project;
  category: Category;
  timerState: TimerState;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
  pomodoroMode: boolean;
  pomodoroTimeLeft: number;
  isBreak: boolean;
  onTogglePomodoro: () => void;
  onForceResume?: () => void;
}

export function TimerToast({
  project,
  category,
  timerState,
  onPause,
  onResume,
  onStop,
  pomodoroMode,
  pomodoroTimeLeft,
  isBreak,
  onTogglePomodoro,
  onForceResume,
}: TimerToastProps) {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const { t } = useLanguage();

  if (timerState.status === 'idle' || isHidden) return null;

  const colorClasses = getCategoryColor(category.color);
  const displayTime = pomodoroMode ? pomodoroTimeLeft : timerState.elapsedTime;
  
  // Calculate progress for custom pomodoro settings
  const focusTimeMs = project.pomodoroSettings.focusTime * 60 * 1000;
  const breakTimeMs = project.pomodoroSettings.breakTime * 60 * 1000;
  const totalTimeMs = isBreak ? breakTimeMs : focusTimeMs;
  const progressPercent = pomodoroMode ? ((totalTimeMs - pomodoroTimeLeft) / totalTimeMs) * 100 : 0;

  // Show/Hide toggle button (always visible)
  const ToggleButton = () => (
    <button
      onClick={() => setIsHidden(true)}
      className="fixed bottom-6 right-6 z-50 p-3 bg-gray-800 dark:bg-gray-700 text-white rounded-full shadow-lg hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
      title={t('toast.hide')}
    >
      <EyeOff className="w-5 h-5" />
    </button>
  );

  // Hidden state - show only the toggle button
  if (isHidden) {
    return (
      <button
        onClick={() => setIsHidden(false)}
        className="fixed bottom-6 right-6 z-50 p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors animate-pulse"
        title={t('toast.show')}
      >
        <Timer className="w-5 h-5" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-2 duration-300">
      <div className={`bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border-2 ${colorClasses.border} dark:border-opacity-50 ${
        isMinimized ? 'p-3' : 'p-4'
      } min-w-80 max-w-sm`}>
        
        {/* Header with controls */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full ${timerState.status === 'running' ? 'bg-green-500 animate-pulse' : 'bg-orange-500'}`} />
            {!isMinimized && (
              <div>
                <div className="font-semibold text-gray-900 dark:text-white text-sm">
                  {project.name}
                </div>
                <div className={`text-xs px-2 py-1 rounded-full ${colorClasses.bg} ${colorClasses.text} dark:bg-opacity-20`}>
                  {category.name}
                </div>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-1">
            {project.pomodoroSettings.enabled && !isMinimized && (
              <button
                onClick={onTogglePomodoro}
                className={`p-2 rounded-lg transition-colors ${
                  pomodoroMode 
                    ? 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300' 
                    : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                }`}
                title={t('pomodoro.mode')}
              >
                <Timer className="w-4 h-4" />
              </button>
            )}
            
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-2 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              title={isMinimized ? t('toast.expand') : t('toast.minimize')}
            >
              {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
            </button>
            
            <button
              onClick={() => setIsHidden(true)}
              className="p-2 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              title={t('toast.hide')}
            >
              <EyeOff className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Timer display */}
        <div className="text-center mb-4">
          <div className={`${isMinimized ? 'text-lg' : 'text-2xl'} font-mono font-bold text-gray-900 dark:text-white`}>
            {formatDetailedTime(displayTime)}
          </div>
          {!isMinimized && pomodoroMode && project.pomodoroSettings.enabled && (
            <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center justify-center space-x-1">
              {isBreak ? <Coffee className="w-4 h-4" /> : <Timer className="w-4 h-4" />}
              <span>
                {isBreak 
                  ? `${t('timer.breakTime')} (${project.pomodoroSettings.breakTime}m)` 
                  : `${t('timer.focusTime')} (${project.pomodoroSettings.focusTime}m)`
                }
              </span>
            </div>
          )}
        </div>

        {/* Controls */}
        {!isMinimized && (
          <div className="flex items-center justify-center space-x-3">
            <button
              onClick={timerState.status === 'running' ? onPause : onResume}
              className={`p-3 rounded-xl font-medium transition-all transform hover:scale-105 ${
                timerState.status === 'running'
                  ? 'bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/25'
                  : 'bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-500/25'
              }`}
            >
              {timerState.status === 'running' ? (
                <Pause className="w-5 h-5" />
              ) : (
                <Play className="w-5 h-5" />
              )}
            </button>

            <button
              onClick={onStop}
              className="p-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-all transform hover:scale-105 shadow-lg shadow-red-500/25"
            >
              <Square className="w-5 h-5" />
            </button>

            {/* Force Resume Button - only show during break */}
            {pomodoroMode && isBreak && onForceResume && (
              <button
                onClick={onForceResume}
                className="p-3 bg-purple-500 hover:bg-purple-600 text-white rounded-xl font-medium transition-all transform hover:scale-105 shadow-lg shadow-purple-500/25"
                title="Passer la pause"
              >
                <Play className="w-5 h-5" />
              </button>
            )}
          </div>
        )}

        {/* Progress bar for pomodoro */}
        {!isMinimized && pomodoroMode && project.pomodoroSettings.enabled && (
          <div className="mt-3">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-1000 ${
                  isBreak ? 'bg-blue-500' : 'bg-green-500'
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}

        {/* Minimized controls */}
        {isMinimized && (
          <div className="flex items-center justify-center space-x-2 mt-2">
            <button
              onClick={timerState.status === 'running' ? onPause : onResume}
              className={`p-2 rounded-lg transition-colors ${
                timerState.status === 'running'
                  ? 'bg-orange-500 text-white'
                  : 'bg-green-500 text-white'
              }`}
            >
              {timerState.status === 'running' ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4" />
              )}
            </button>

            <button
              onClick={onStop}
              className="p-2 bg-red-500 text-white rounded-lg transition-colors"
            >
              <Square className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}