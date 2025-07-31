import React from 'react';
import { useNavigate } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { Star, Plus, User, LogOut, Settings, Clock, LayoutDashboard, Globe } from 'lucide-react';
import { Category, Project } from '../types';
import { getCategoryColor, getUserDisplayName } from '../utils/helpers';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';

interface SidebarProps {
  categories: Category[];
  projects: Project[];
  selectedCategoryId: string | null;
  onSelectCategory: (categoryId: string | null) => void;
  onShowPinned: () => void;
  onShowArchived?: () => void;
  onShowDashboard: () => void;
  onShowProfile: () => void;
  showingPinned: boolean;
  showingArchived?: boolean;
  currentView: string;
  onCreateCategory: () => void;
  onOpenSettings: () => void;
  onShowAdmin?: () => void;
}

export function Sidebar({ 
  categories, 
  projects, 
  selectedCategoryId, 
  onSelectCategory, 
  onShowPinned,
  onShowArchived,
  onShowDashboard,
  onShowProfile,
  showingPinned,
  showingArchived,
  currentView,
  onCreateCategory,
  onOpenSettings,
  onShowAdmin
}: SidebarProps) {
  const { t } = useLanguage();
  const { user, signOut, userProfile } = useAuth();
  const navigate = useNavigate();



  const getProjectCount = (categoryId: string) => {
    return projects.filter(p => p.categoryId === categoryId).length;
  };

  const pinnedCount = projects.filter(p => p.isPinned).length;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t('app.greeting.morning');
    if (hour < 17) return t('app.greeting.afternoon');
    return t('app.greeting.evening');
  };

  const getMotivationalMessage = () => {
    const messages = [
      t('app.motivation.1'),
      t('app.motivation.2'),
      t('app.motivation.3'),
      t('app.motivation.4'),
      t('app.motivation.5'),
    ];
    
    // Use sessionStorage to keep the same message for the session
    const sessionKey = 'motivationalMessage';
    let messageIndex = sessionStorage.getItem(sessionKey);
    
    if (!messageIndex) {
      messageIndex = Math.floor(Math.random() * messages.length).toString();
      sessionStorage.setItem(sessionKey, messageIndex);
    }
    
    return messages[parseInt(messageIndex)];
  };

  const handleLogoClick = () => {
    window.location.reload();
  };

  return (
    <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 h-full flex flex-col">
      {/* Logo and App Name */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <button 
          onClick={handleLogoClick}
          className="flex items-center space-x-3 w-full hover:opacity-80 transition-opacity"
        >
          <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
            <Clock className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              {t('app.title')}
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">{t('app.subtitle')}</p>
          </div>
        </button>
      </div>

      {/* User Greeting */}
      {user && (
        <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-b border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              {getGreeting()}, {getUserDisplayName(user)}! 👋
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              {getMotivationalMessage()}
            </p>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {/* Dashboard */}
        <button
          onClick={onShowDashboard}
          className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 text-left ${
            currentView === 'dashboard'
              ? 'bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-700 dark:text-blue-300 shadow-lg'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="font-medium">{t('nav.dashboard')}</span>
        </button>

        {/* Pinned Projects */}
        <button
          onClick={onShowPinned}
          className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 text-left ${
            showingPinned
              ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 shadow-lg'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          <Star className="w-5 h-5" />
          <span className="font-medium">{t('nav.pinned')}</span>
          <span className="ml-auto text-sm bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded-full text-center">
            {pinnedCount}
          </span>
        </button>

        {/* Archived Projects */}
        {onShowArchived && (
          <button
            onClick={onShowArchived}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 text-left ${
              showingArchived
                ? 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 shadow-lg'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-14 0h14" />
            </svg>
            <span className="font-medium">{t('projects.archived')}</span>
            <span className="ml-auto text-sm bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded-full text-center">
              {projects.filter(p => p.isArchived).length}
            </span>
          </button>
        )}

        <div className="border-t border-gray-200 dark:border-gray-700 my-4"></div>

        {/* Categories */}
        <div className="space-y-1">
          <div className="flex items-center justify-between px-4 py-2">
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400">{t('nav.categories')}</h3>
            <button
              onClick={onCreateCategory}
              className="p-1 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
              title={t('dashboard.newCategory')}
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          {categories.map((category) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const IconComponent = (Icons as any)[category.icon] || Icons.Folder;
            const colorClasses = getCategoryColor(category.color);
            const projectCount = getProjectCount(category.id);

            return (
              <button
                key={category.id}
                onClick={() => onSelectCategory(category.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 text-left ${
                  selectedCategoryId === category.id
                    ? `${colorClasses.bg} ${colorClasses.text} shadow-lg`
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <IconComponent className="w-5 h-5" />
                <span className="font-medium flex-1">{category.name}</span>
                <span className="text-sm bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded-full text-center">
                  {projectCount}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Controls Section */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-4 space-y-3">

        {/* User Section */}
        {user && (
          <>
            <button
              onClick={onShowProfile}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors cursor-pointer ${
                currentView === 'profile'
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                  : 'bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30'
              }`}
            >
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0 text-left">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {getUserDisplayName(user)}
                </p>
                <p className="text-xs text-green-600 dark:text-green-400">{t('common.online')}</p>
              </div>
            </button>
            <div className="flex space-x-2">
              <button 
                onClick={onOpenSettings}
                className="flex-1 flex items-center justify-center space-x-2 px-2 py-2 text-xs text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <Settings className="w-4 h-4" />
                <span className="truncate">{t('nav.settings')}</span>
              </button>
              <button
                onClick={() => signOut()}
                className="flex-1 flex items-center justify-center space-x-2 px-2 py-2 text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="truncate">{t('nav.logout')}</span>
              </button>
            </div>

            {/* Admin Panel Access - Only for admins */}
            {userProfile?.role === 'admin' && (
              <button
                onClick={() => {
                  navigate('/admin');
                }}
                className="w-full flex items-center justify-center space-x-2 px-3 py-2 text-xs text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors"
              >
                <Globe className="w-4 h-4" />
                <span>Admin Panel</span>
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}