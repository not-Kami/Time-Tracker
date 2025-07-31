import React, { useState, useEffect } from 'react';
import { ArrowLeft, User, Calendar, Trophy, Star, Download, Volume2, VolumeX, Eye, EyeOff, Mail } from 'lucide-react';
import { Project } from '../types';
import { getAchievementLevel, formatHours, getUserNickname, getUserFullName, getUserEmail, getUserInitials, getUserAvatarColor } from '../utils/helpers';
import { useAuth } from '../contexts/AuthContext';

interface ProfilePageProps {
  projects: Project[];
  onBack: () => void;
  onExport: () => void;
  isSoundEnabled: boolean;
  onToggleSound: () => void;
}

export function ProfilePage({ projects, onBack, onExport, isSoundEnabled, onToggleSound }: ProfilePageProps) {
  const { user } = useAuth();
  
  // Initialize with user data or smart defaults
  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  // Update form fields when user data changes
  useEffect(() => {
    if (user) {
      setName(getUserFullName(user) || '');
      setNickname(getUserNickname(user) || '');
      // Note: dateOfBirth is not available in user metadata, so we keep it empty
    }
  }, [user]);

  // Calculate user stats
  const totalTime = projects.reduce((sum, project) => sum + project.totalTime, 0);
  const totalTasks = projects.reduce((sum, project) => sum + project.tasks.length, 0);
  const completedTasks = projects.reduce((sum, project) => 
    sum + project.tasks.filter(task => task.completed).length, 0
  );
  const totalSessions = projects.reduce((sum, project) => sum + project.sessions.length, 0);
  const achievement = getAchievementLevel(totalTime);

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');

    if (newPassword || confirmPassword) {
      if (!currentPassword) {
        setPasswordError('Current password is required to change password');
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
      if (currentPassword !== 'demo123') {
        setPasswordError('Current password is incorrect');
        return;
      }
    }

    alert('Password changed successfully!');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={onBack}
          className="p-3 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        
        {/* User Avatar */}
        <div 
          className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl"
          style={{ backgroundColor: getUserAvatarColor(user) }}
        >
          {getUserInitials(user)}
        </div>
        
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Profile</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your account and view achievements</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Information */}
        <div className="lg:col-span-2 space-y-8">
          {/* Personal Info */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <User className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Personal Information</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  <Mail className="w-4 h-4 inline mr-1" />
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={getUserEmail(user)}
                  readOnly
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                />
              </div>

              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label htmlFor="nickname" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Nickname
                </label>
                <input
                  type="text"
                  id="nickname"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="Enter your nickname"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label htmlFor="dob" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Date of Birth
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
          </div>

          {/* Security */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Security</h2>

            <form onSubmit={handlePasswordChange} className="space-y-4">
              {passwordError && (
                <div className="p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl">
                  <p className="text-sm text-red-600 dark:text-red-400">{passwordError}</p>
                </div>
              )}

              <div>
                <label htmlFor="currentPassword" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Current Password
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
                  New Password
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
                  Confirm New Password
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

              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-semibold transition-colors"
              >
                Change Password
              </button>
            </form>
          </div>

          {/* Settings */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Settings</h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Sound Notifications
                  </label>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Play sounds for achievements and timers</p>
                </div>
                <button
                  onClick={onToggleSound}
                  className={`p-2 rounded-lg transition-colors ${
                    isSoundEnabled 
                      ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' 
                      : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                  }`}
                >
                  {isSoundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                </button>
              </div>

              <button
                onClick={onExport}
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-xl hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors font-medium"
              >
                <Download className="w-5 h-5" />
                <span>Export All Data</span>
              </button>
            </div>
          </div>
        </div>

        {/* Achievement Section */}
        <div className="space-y-6">
          {/* Achievement Card */}
          <div className={`rounded-2xl shadow-lg border-2 p-8 ${achievement.bgColor} ${achievement.borderColor}`}>
            <div className="flex items-center space-x-3 mb-6">
              <Trophy className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Achievements</h3>
            </div>
            
            <div className="text-center mb-8">
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
                      Next Goal: {achievement.nextMilestone}h
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {achievement.hoursToNext.toFixed(1)}h remaining ({achievement.progress.toFixed(1)}% complete)
                    </div>
                  </div>
                </div>
              )}

              {achievement.nextMilestone === 0 && (
                <div className="text-center py-6">
                  <div className="text-xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                    🎉 Maximum Level Achieved!
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    You've reached the highest achievement level
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="space-y-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 text-center">
                {projects.length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 text-center">Active Projects</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400 text-center">
                {completedTasks}/{totalTasks}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 text-center">Tasks Completed</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 text-center">
                {totalSessions}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 text-center">Total Sessions</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}