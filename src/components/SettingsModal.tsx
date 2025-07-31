import React, { useState } from 'react';
import { X, User, Calendar, Lock, Bell, Download, Eye, EyeOff, Volume2, VolumeX, Trophy, Star, RotateCcw, Cloud, CloudOff, RefreshCw, Globe, Moon, Sun } from 'lucide-react';
import { Project } from '../types';
import { getAchievementLevel, formatHours } from '../utils/helpers';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: () => void;
  onResetData?: () => void;
  isSoundEnabled: boolean;
  onToggleSound: () => void;
  projects?: Project[];
}

export function SettingsModal({ isOpen, onClose, onExport, onResetData, isSoundEnabled, onToggleSound, projects = [] }: SettingsModalProps) {
  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [monthlyUpdates, setMonthlyUpdates] = useState(true);
  const [weeklyUpdates, setWeeklyUpdates] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'notifications' | 'data' | 'audio' | 'appearance' | 'language' | 'onboarding' | 'danger'>('profile');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { t, language, setLanguage } = useLanguage();
  const { isDark, toggleTheme } = useTheme();
  const { isOnline, lastSync, isSyncing, syncData } = useLocalStorage();

  const handleResetData = () => {
    if (window.confirm('Are you sure you want to reset all data? This action cannot be undone and will remove all categories, projects, and time tracking data.')) {
      onResetData?.();
      onClose();
    }
  };

  // Calculate user stats for profile
  const totalTime = projects.reduce((sum, project) => sum + project.totalTime, 0);
  const totalTasks = projects.reduce((sum, project) => sum + project.tasks.length, 0);
  const completedTasks = projects.reduce((sum, project) => 
    sum + project.tasks.filter(task => task.completed).length, 0
  );
  const totalSessions = projects.reduce((sum, project) => sum + project.sessions.length, 0);
  const achievement = getAchievementLevel(totalTime);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');

    // Password validation
    if (newPassword || confirmPassword) {
      if (!currentPassword) {
        setPasswordError(t('profile.currentPassword') + ' is required to change password');
        return;
      }
      if (newPassword !== confirmPassword) {
        setPasswordError('New passwords do not match');
        return;
      }
      if (newPassword.length < 8) {
        setPasswordError('New password must be at least 8 characters long');
        return;
      }
      // In a real app, you'd verify the current password against the stored hash
      if (currentPassword !== 'demo123') { // Demo validation
        setPasswordError('Current password is incorrect');
        return;
      }
    }

    // Save settings to localStorage
    const settings = {
      name,
      nickname,
      dateOfBirth,
      monthlyUpdates,
      weeklyUpdates,
      language,
      theme: isDark ? 'dark' : 'light'
    };
    
    localStorage.setItem('userSettings', JSON.stringify(settings));
    
    // Reset password fields
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    
    alert('Settings saved successfully!');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-700" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t('settings.title')}</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex">
          {/* Sidebar Navigation */}
          <div className="w-64 border-r border-gray-200 dark:border-gray-700 p-4">
            <nav className="space-y-2">
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-colors ${
                  activeTab === 'profile'
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <User className="w-5 h-5" />
                <span>{t('settings.profile')}</span>
              </button>
              <button
                onClick={() => setActiveTab('security')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-colors ${
                  activeTab === 'security'
                    ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Lock className="w-5 h-5" />
                <span>{t('settings.security')}</span>
              </button>
              <button
                onClick={() => setActiveTab('audio')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-colors ${
                  activeTab === 'audio'
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {isSoundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                <span>{t('settings.audio')}</span>
              </button>
              <button
                onClick={() => setActiveTab('notifications')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-colors ${
                  activeTab === 'notifications'
                    ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Bell className="w-5 h-5" />
                <span>{t('settings.notifications')}</span>
              </button>
              <button
                onClick={() => setActiveTab('data')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-colors ${
                  activeTab === 'data'
                    ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Download className="w-5 h-5" />
                <span>{t('settings.data')}</span>
              </button>
              <button
                onClick={() => setActiveTab('appearance')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-colors ${
                  activeTab === 'appearance'
                    ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Sun className="w-5 h-5" />
                <span>{t('settings.appearance')}</span>
              </button>
              <button
                onClick={() => setActiveTab('language')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-colors ${
                  activeTab === 'language'
                    ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Globe className="w-5 h-5" />
                <span>{t('settings.language')}</span>
              </button>
              <button
                onClick={() => setActiveTab('onboarding')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-colors ${
                  activeTab === 'onboarding'
                    ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                    : 'text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20'
                }`}
              >
                <User className="w-5 h-5" />
                <span>{t('settings.onboarding')}</span>
              </button>
              <button
                onClick={() => setActiveTab('danger')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-colors ${
                  activeTab === 'danger'
                    ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                    : 'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20'
                }`}
              >
                <RotateCcw className="w-5 h-5" />
                <span>{t('settings.danger')}</span>
              </button>
            </nav>
          </div>

          {/* Content Area */}
          <div className="flex-1 p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  {/* Profile Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('settings.personalInfo')}</h3>
                    
                    <div>
                      <label htmlFor="name" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        {t('settings.fullName')}
                      </label>
                      <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="Enter your full name"
                      />
                    </div>

                    <div>
                      <label htmlFor="nickname" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        {t('settings.nickname')}
                      </label>
                      <input
                        type="text"
                        id="nickname"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="Enter your nickname"
                      />
                    </div>

                    <div>
                      <label htmlFor="dob" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        <Calendar className="w-4 h-4 inline mr-1" />
                        {t('settings.dateOfBirth')}
                      </label>
                      <input
                        type="date"
                        id="dob"
                        value={dateOfBirth}
                        onChange={(e) => setDateOfBirth(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>

                  {/* Achievement Section */}
                  <div className={`rounded-2xl shadow-lg border-2 p-8 ${achievement.bgColor} ${achievement.borderColor}`}>
                    <div className="flex items-center space-x-3 mb-6">
                      <Trophy className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{t('achievements.title')}</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* Achievement Level */}
                      <div className="text-center">
                        <div className="flex items-center justify-center space-x-2 mb-4">
                          {Array.from({ length: achievement.stars }).map((_, i) => (
                            <Star key={i} className={`w-8 h-8 fill-current bg-gradient-to-r ${achievement.color} text-transparent bg-clip-text`} />
                          ))}
                        </div>
                        <div className={`text-4xl font-bold mb-2 ${achievement.textColor}`}>
                          {achievement.level}
                        </div>
                        <div className="text-xl font-semibold text-gray-600 dark:text-gray-400">{formatHours(totalTime)} logged</div>
                        
                        {achievement.nextMilestone > 0 && (
                          <div className="mt-6">
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 shadow-inner mb-3">
                              <div
                                className={`h-4 rounded-full transition-all duration-500 bg-gradient-to-r ${achievement.color} shadow-lg`}
                                style={{ width: `${achievement.progress}%` }}
                              />
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                                {t('achievements.nextGoal').replace('{hours}', achievement.nextMilestone.toString())}
                              </div>
                              <div className="text-sm text-gray-600 dark:text-gray-400">
                                {t('achievements.remaining')
                                  .replace('{hours}', achievement.hoursToNext.toFixed(1))
                                  .replace('{percent}', achievement.progress.toFixed(1))}
                              </div>
                            </div>
                          </div>
                        )}

                        {achievement.nextMilestone === 0 && (
                          <div className="text-center py-6">
                            <div className="text-xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                              {t('achievements.maxLevel')}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              {t('achievements.maxLevelDesc')}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Stats */}
                      <div className="space-y-4">
                        <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-4">
                          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 text-center">
                            {projects.length}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400 text-center">{t('dashboard.activeProjects')}</div>
                        </div>
                        <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-4">
                          <div className="text-2xl font-bold text-green-600 dark:text-green-400 text-center">
                            {completedTasks}/{totalTasks}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400 text-center">{t('dashboard.tasksCompleted')}</div>
                        </div>
                        <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-4">
                          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 text-center">
                            {totalSessions}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400 text-center">Total Sessions</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('settings.security')}</h3>

                  {passwordError && (
                    <div className="p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl">
                      <p className="text-sm text-red-600 dark:text-red-400">{passwordError}</p>
                    </div>
                  )}

                  <div>
                    <label htmlFor="currentPassword" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      {t('settings.currentPassword')}
                    </label>
                    <div className="relative">
                      <input
                        type={showCurrentPassword ? 'text' : 'password'}
                        id="currentPassword"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="Enter current password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="newPassword" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      {t('settings.newPassword')}
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        id="newPassword"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="Enter new password (min 8 characters)"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      {t('settings.confirmPassword')}
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="Confirm new password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'audio' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('settings.audio')}</h3>

                  <div className="flex items-center justify-between">
                    <div>
                      <label htmlFor="soundEnabled" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {t('settings.soundNotifications')}
                      </label>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{t('settings.soundDesc')}</p>
                    </div>
                    <input
                      type="checkbox"
                      id="soundEnabled"
                      checked={isSoundEnabled}
                      onChange={onToggleSound}
                      className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                  </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('settings.notifications')}</h3>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <label htmlFor="monthlyUpdates" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {t('settings.monthlyReports')}
                        </label>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{t('settings.monthlyReportsDesc')}</p>
                      </div>
                      <input
                        type="checkbox"
                        id="monthlyUpdates"
                        checked={monthlyUpdates}
                        onChange={(e) => setMonthlyUpdates(e.target.checked)}
                        className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <label htmlFor="weeklyUpdates" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {t('settings.weeklyReminders')}
                        </label>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{t('settings.weeklyRemindersDesc')}</p>
                      </div>
                      <input
                        type="checkbox"
                        id="weeklyUpdates"
                        checked={weeklyUpdates}
                        onChange={(e) => setWeeklyUpdates(e.target.checked)}
                        className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'appearance' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('settings.appearance')}</h3>

                  <div className="flex items-center justify-between">
                    <div>
                      <label htmlFor="theme" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {t('settings.theme')}
                      </label>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{t('settings.themeDesc')}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={toggleTheme}
                        className="p-2 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        {isDark ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'appearance' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('settings.appearance')}</h3>
                  
                  {/* Theme Toggle */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                      <div className="flex items-center space-x-3">
                        {isDark ? <Moon className="w-5 h-5 text-gray-600 dark:text-gray-400" /> : <Sun className="w-5 h-5 text-gray-600 dark:text-gray-400" />}
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">{t('settings.theme')}</h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{t('settings.themeDesc')}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={toggleTheme}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          isDark ? 'bg-blue-600' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            isDark ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'language' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('settings.language')}</h3>
                  
                  {/* Language Selection */}
                  <div className="space-y-3">
                    <p className="text-sm text-gray-600 dark:text-gray-400">{t('settings.languageDesc')}</p>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { code: 'en', name: 'English', flag: '🇺🇸' },
                        { code: 'fr', name: 'Français', flag: '🇫🇷' },
                        { code: 'es', name: 'Español', flag: '🇪🇸' },
                        { code: 'it', name: 'Italiano', flag: '🇮🇹' },
                        { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
                        { code: 'nl', name: 'Nederlands', flag: '🇳🇱' },
                        { code: 'pt', name: 'Português', flag: '🇵🇹' },
                        { code: 'sv', name: 'Svenska', flag: '🇸🇪' },
                      ].map((lang) => (
                        <button
                          key={lang.code}
                          type="button"
                          onClick={() => setLanguage(lang.code as any)}
                          className={`p-3 rounded-lg border-2 transition-all ${
                            language === lang.code
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                              : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                          }`}
                        >
                          <div className="flex items-center space-x-2">
                            <span className="text-lg">{lang.flag}</span>
                            <span className="font-medium text-gray-900 dark:text-white">{lang.name}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'onboarding' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('settings.onboarding')}</h3>
                  
                  <div className="p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl">
                    <h4 className="text-sm font-semibold text-purple-700 dark:text-purple-300 mb-2">
                      {t('settings.onboardingTitle')}
                    </h4>
                    <p className="text-sm text-purple-600 dark:text-purple-400 mb-4">
                      {t('settings.onboardingDesc')}
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        // Trigger onboarding flow
                        localStorage.setItem('newUser', 'true');
                        window.location.reload();
                      }}
                      className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors font-medium"
                    >
                      <User className="w-5 h-5" />
                      <span>{t('settings.startOnboarding')}</span>
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'data' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('settings.data')}</h3>

                  {/* Sync Status */}
                  <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Synchronisation</h4>
                      <div className="flex items-center space-x-2">
                        {isOnline ? (
                          <Cloud className="w-4 h-4 text-green-500" />
                        ) : (
                          <CloudOff className="w-4 h-4 text-red-500" />
                        )}
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {isOnline ? 'En ligne' : 'Hors ligne'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Dernière synchronisation:</span>
                        <span className="text-gray-900 dark:text-white">
                          {lastSync ? lastSync.toLocaleString('fr-FR') : 'Jamais'}
                        </span>
                      </div>
                      
                      <div className="flex space-x-2">
                        <button
                          type="button"
                          onClick={() => syncData('upload')}
                          disabled={!isOnline || isSyncing}
                          className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                        >
                          <Cloud className="w-4 h-4" />
                          <span>Sauvegarder</span>
                        </button>
                        
                        <button
                          type="button"
                          onClick={() => syncData('download')}
                          disabled={!isOnline || isSyncing}
                          className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                        >
                          <RefreshCw className="w-4 h-4" />
                          <span>Restaurer</span>
                        </button>
                      </div>
                      
                      {isSyncing && (
                        <div className="flex items-center justify-center space-x-2 text-sm text-blue-600 dark:text-blue-400">
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Synchronisation en cours...</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={onExport}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-xl hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors font-medium"
                  >
                    <Download className="w-5 h-5" />
                    <span>{t('settings.exportData')}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleResetData}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-xl hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors font-medium"
                  >
                    <RotateCcw className="w-5 h-5" />
                    <span>{t('settings.resetData')}</span>
                  </button>
                </div>
              )}

              {activeTab === 'danger' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-red-600 dark:text-red-400">{t('settings.danger')}</h3>
                  
                  <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                    <h4 className="text-sm font-semibold text-red-700 dark:text-red-300 mb-2">
                      {t('settings.deleteAccount')}
                    </h4>
                    <p className="text-sm text-red-600 dark:text-red-400 mb-4">
                      {t('settings.deleteAccountWarning')}
                    </p>
                    
                    {!showDeleteConfirm ? (
                      <button
                        type="button"
                        onClick={() => setShowDeleteConfirm(true)}
                        className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium"
                      >
                        <RotateCcw className="w-5 h-5" />
                        <span>{t('settings.deleteAccount')}</span>
                      </button>
                    ) : (
                      <div className="space-y-3">
                        <p className="text-sm text-red-600 dark:text-red-400 font-medium">
                          {t('settings.deleteAccountConfirm')}
                        </p>
                        <div className="flex space-x-3">
                          <button
                            type="button"
                            onClick={() => setShowDeleteConfirm(false)}
                            className="flex-1 px-4 py-2 text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-900/30 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                          >
                            {t('common.cancel')}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              // Here you would call the API to soft delete the account
                              localStorage.clear();
                              window.location.reload();
                            }}
                            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                          >
                            {t('settings.confirmDelete')}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="flex space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-3 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 font-semibold transition-colors"
                >
                  {t('common.cancel')}
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg shadow-blue-500/25"
                >
                  {t('settings.saveSettings')}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}