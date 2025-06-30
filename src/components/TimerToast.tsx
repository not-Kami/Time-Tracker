import React, { useState } from 'react';
import { Play, Pause, Square, Timer, Coffee, Minimize2, Maximize2, X, Eye, EyeOff, Droplets, Dumbbell, Zap } from 'lucide-react';
import { Skill, Category, TimerState } from '../types';
import { formatDetailedTime, getCategoryColor } from '../utils/helpers';
import { useLanguage } from '../contexts/LanguageContext';

interface TimerToastProps {
  skill: Skill;
  category: Category;
  timerState: TimerState;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
  pomodoroMode: boolean;
  pomodoroTimeLeft: number;
  isBreak: boolean;
  onTogglePomodoro: () => void;
}

const breakAdvice = [
  { icon: <Droplets className="w-4 h-4" />, text: "Drink some water" },
  { icon: <Dumbbell className="w-4 h-4" />, text: "Stretch your body" },
  { icon: <Eye className="w-4 h-4" />, text: "Rest your eyes" },
  { icon: <Zap className="w-4 h-4" />, text: "Take deep breaths" },
];

export function TimerToast({
  skill,
  category,
  timerState,
  onPause,
  onResume,
  onStop,
  pomodoroMode,
  pomodoroTimeLeft,
  isBreak,
  onTogglePomodoro,
}: TimerToastProps) {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const { t } = useLanguage();

  if (timerState.status === 'idle' || isHidden) return null;

  const colorClasses = getCategoryColor(category.color);
  const displayTime = pomodoroMode ? pomodoroTimeLeft : timerState.elapsedTime;
  
  // Calculate progress for custom pomodoro settings
  const focusTimeMs = skill.pomodoroSettings.focusTime * 60 * 1000;
  const breakTimeMs = skill.pomodoroSettings.breakTime * 60 * 1000;
  const totalTimeMs = isBreak ? breakTimeMs : focusTimeMs;
  const progressPercent = pomodoroMode ? ((totalTimeMs - pomodoroTimeLeft) / totalTimeMs) * 100 : 0;

  // Get random break advice
  const currentAdvice = breakAdvice[Math.floor(Math.random() * breakAdvice.length)];

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
      <div className={`bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border-2 ${
        isBreak && pomodoroMode 
          ? 'border-blue-500 dark:border-blue-400' 
          : colorClasses.border
      } dark:border-opacity-50 ${
        isMinimized ? 'p-3' : 'p-4'
      } min-w-80 max-w-sm`}>
        
        {/* Header with controls */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full ${
              timerState.status === 'running' 
                ? (isBreak && pomodoroMode ? 'bg-blue-500 animate-pulse' : 'bg-green-500 animate-pulse')
                : 'bg-orange-500'
            }`} />
            {!isMinimized && (
              <div>
                <div className="font-semibold text-gray-900 dark:text-white text-sm">
                  {skill.name}
                </div>
                <div className={`text-xs px-2 py-1 rounded-full ${
                  isBreak && pomodoroMode 
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                    : `${colorClasses.bg} ${colorClasses.text}`
                } dark:bg-opacity-20`}>
                  {isBreak && pomodoroMode ? 'Break Time' : category.name}
                </div>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-1">
            {skill.pomodoroSettings.enabled && !isMinimized && (
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

        {/* Break Status Banner */}
        {!isMinimized && pomodoroMode && isBreak && (
          <div className="mb-4 p-3 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
            <div className="flex items-center space-x-2 mb-2">
              <Coffee className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span className="font-semibold text-blue-700 dark:text-blue-300">Break Time!</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-blue-600 dark:text-blue-400">
              {currentAdvice.icon}
              <span>{currentAdvice.text}</span>
            </div>
          </div>
        )}

        {/* Timer display */}
        <div className="text-center mb-4">
          <div className={`${isMinimized ? 'text-lg' : 'text-2xl'} font-mono font-bold ${
            isBreak && pomodoroMode 
              ? 'text-blue-600 dark:text-blue-400' 
              : 'text-gray-900 dark:text-white'
          }`}>
            {formatDetailedTime(displayTime)}
          </div>
          {!isMinimized && pomodoroMode && skill.pomodoroSettings.enabled && (
            <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center justify-center space-x-1">
              {isBreak ? <Coffee className="w-4 h-4" /> : <Timer className="w-4 h-4" />}
              <span>
                {isBreak 
                  ? `${t('timer.breakTime')} (${skill.pomodoroSettings.breakTime}m)` 
                  : `${t('timer.focusTime')} (${skill.pomodoroSettings.focusTime}m)`
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
          </div>
        )}

        {/* Progress bar for pomodoro */}
        {!isMinimized && pomodoroMode && skill.pomodoroSettings.enabled && (
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