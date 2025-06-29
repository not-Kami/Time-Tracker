import React from 'react';
import { Trophy, Target, Zap, Star, Award, TrendingUp } from 'lucide-react';
import { Project } from '../types';
import { formatHours } from '../utils/helpers';
import { useLanguage } from '../contexts/LanguageContext';

interface GamificationPanelProps {
  projects: Project[];
  className?: string;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  unlocked: boolean;
  progress?: number;
  target?: number;
}

export function GamificationPanel({ projects, className = '' }: GamificationPanelProps) {
  const { t } = useLanguage();
  
  const totalTime = projects.reduce((sum, project) => sum + project.totalTime, 0);
  const completedTasks = projects.reduce((sum, project) => 
    sum + project.tasks.filter(task => task.completed).length, 0
  );
  const totalSessions = projects.reduce((sum, project) => sum + project.sessions.length, 0);
  const pomodoroSessions = projects.reduce((sum, project) => 
    sum + project.sessions.filter(session => 
      project.pomodoroSettings.enabled && 
      session.duration >= (project.pomodoroSettings.focusTime * 60 * 1000 * 0.8)
    ).length, 0
  );

  const achievements: Achievement[] = [
    {
      id: 'first-hour',
      title: t('achievements.gettingStarted'),
      description: t('achievements.gettingStartedDesc'),
      icon: <Zap className="w-5 h-5" />,
      unlocked: totalTime >= 60 * 60 * 1000,
      progress: Math.min(totalTime / (60 * 60 * 1000), 1),
      target: 1
    },
    {
      id: 'ten-hours',
      title: t('achievements.dedicatedLearner'),
      description: t('achievements.dedicatedLearnerDesc'),
      icon: <Target className="w-5 h-5" />,
      unlocked: totalTime >= 10 * 60 * 60 * 1000,
      progress: Math.min(totalTime / (10 * 60 * 60 * 1000), 1),
      target: 10
    },
    {
      id: 'hundred-hours',
      title: t('achievements.skillBuilder'),
      description: t('achievements.skillBuilderDesc'),
      icon: <Award className="w-5 h-5" />,
      unlocked: totalTime >= 100 * 60 * 60 * 1000,
      progress: Math.min(totalTime / (100 * 60 * 60 * 1000), 1),
      target: 100
    },
    {
      id: 'task-master',
      title: t('achievements.taskMaster'),
      description: t('achievements.taskMasterDesc'),
      icon: <Trophy className="w-5 h-5" />,
      unlocked: completedTasks >= 50,
      progress: Math.min(completedTasks / 50, 1),
      target: 50
    },
    {
      id: 'pomodoro-pro',
      title: t('achievements.pomodoroPro'),
      description: t('achievements.pomodoroProDesc'),
      icon: <Star className="w-5 h-5" />,
      unlocked: pomodoroSessions >= 25,
      progress: Math.min(pomodoroSessions / 25, 1),
      target: 25
    },
    {
      id: 'consistency-king',
      title: t('achievements.consistencyKing'),
      description: t('achievements.consistencyKingDesc'),
      icon: <TrendingUp className="w-5 h-5" />,
      unlocked: totalSessions >= 100,
      progress: Math.min(totalSessions / 100, 1),
      target: 100
    }
  ];

  const unlockedAchievements = achievements.filter(a => a.unlocked);
  const nextAchievement = achievements.find(a => !a.unlocked);

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 ${className}`}>
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl">
          <Trophy className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">{t('achievements.title')}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {unlockedAchievements.length} of {achievements.length} {t('achievements.unlocked')}
          </p>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl">
          <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
            {formatHours(totalTime)}
          </div>
          <div className="text-sm text-blue-600 dark:text-blue-400">{t('achievements.totalTime')}</div>
        </div>
        <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl">
          <div className="text-2xl font-bold text-green-700 dark:text-green-300">
            {completedTasks}
          </div>
          <div className="text-sm text-green-600 dark:text-green-400">{t('achievements.tasksDone')}</div>
        </div>
      </div>

      {/* Next Achievement */}
      {nextAchievement && (
        <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
          <div className="flex items-center space-x-3 mb-3">
            <div className="p-2 bg-purple-500 rounded-lg text-white">
              {nextAchievement.icon}
            </div>
            <div>
              <h4 className="font-bold text-gray-900 dark:text-white">
                {t('achievements.next')}: {nextAchievement.title}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {nextAchievement.description}
              </p>
            </div>
          </div>
          {nextAchievement.progress !== undefined && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">{t('achievements.progress')}</span>
                <span className="font-bold text-purple-700 dark:text-purple-300">
                  {(nextAchievement.progress * 100).toFixed(0)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div
                  className="h-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
                  style={{ width: `${nextAchievement.progress * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Achievement Grid */}
      <div className="space-y-3">
        <h4 className="font-bold text-gray-900 dark:text-white">{t('achievements.yourAchievements')}</h4>
        <div className="grid grid-cols-1 gap-3">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`flex items-center space-x-3 p-3 rounded-xl transition-all ${
                achievement.unlocked
                  ? 'bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800'
                  : 'bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 opacity-60'
              }`}
            >
              <div className={`p-2 rounded-lg ${
                achievement.unlocked
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-400 text-gray-200'
              }`}>
                {achievement.icon}
              </div>
              <div className="flex-1">
                <h5 className={`font-semibold ${
                  achievement.unlocked
                    ? 'text-green-700 dark:text-green-300'
                    : 'text-gray-500 dark:text-gray-400'
                }`}>
                  {achievement.title}
                </h5>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {achievement.description}
                </p>
              </div>
              {achievement.unlocked && (
                <div className="text-green-600 dark:text-green-400">
                  <Trophy className="w-5 h-5" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}