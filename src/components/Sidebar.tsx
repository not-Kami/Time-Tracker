import React, { useState } from 'react';
import * as Icons from 'lucide-react';
import { Star, Plus, Settings, Clock, Moon, Sun, LayoutDashboard, Globe } from 'lucide-react';
import { Category, Skill } from '../types';
import { getCategoryColor } from '../utils/helpers';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';

interface SidebarProps {
  categories: Category[];
  skills: Skill[];
  selectedCategoryId: string | null;
  onSelectCategory: (categoryId: string | null) => void;
  onShowPinned: () => void;
  onShowDashboard: () => void;
  onShowProfile: () => void;
  showingPinned: boolean;
  currentView: string;
  onCreateCategory: () => void;
  onOpenSettings: () => void;
}

export function Sidebar({ 
  categories, 
  skills, 
  selectedCategoryId, 
  onSelectCategory, 
  onShowPinned,
  onShowDashboard,
  onShowProfile,
  showingPinned,
  currentView,
  onCreateCategory,
  onOpenSettings
}: SidebarProps) {
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const { isDark, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'nl', name: 'Nederlands', flag: '🇳🇱' },
    { code: 'pt', name: 'Português', flag: '🇵🇹' },
    { code: 'sv', name: 'Svenska', flag: '🇸🇪' },
  ];

  const getSkillCount = (categoryId: string) => {
    return skills.filter(s => s.categoryId === categoryId).length;
  };

  const pinnedCount = skills.filter(s => s.isPinned).length;

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
    return messages[Math.floor(Math.random() * messages.length)];
  };

  const currentLanguage = languages.find(lang => lang.code === language);

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
      <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-b border-gray-200 dark:border-gray-700">
        <div className="text-center">
          <p className="text-sm font-semibold text-gray-900 dark:text-white">
            {getGreeting()}, Developer! 👋
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
            {getMotivationalMessage()}
          </p>
        </div>
      </div>

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

        {/* Pinned Skills */}
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
            const skillCount = getSkillCount(category.id);

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
                  {skillCount}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Controls Section */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-4 space-y-3">
        <div className="flex items-center space-x-2">
          <button
            onClick={toggleTheme}
            className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            <span>{isDark ? t('common.light') : t('common.dark')}</span>
          </button>
          
          <div className="relative">
            <button
              onClick={() => setShowLanguageMenu(!showLanguageMenu)}
              className="flex items-center justify-center space-x-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <Globe className="w-4 h-4" />
              <span>{currentLanguage?.flag}</span>
            </button>
            
            {showLanguageMenu && (
              <div className="absolute bottom-full right-0 mb-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg py-2 min-w-48 z-50">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLanguage(lang.code as 'en' | 'fr' | 'es' | 'it' | 'de' | 'nl' | 'pt' | 'sv');
                      setShowLanguageMenu(false);
                    }}
                    className={`w-full flex items-center space-x-3 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                      language === lang.code ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <span className="text-lg">{lang.flag}</span>
                    <span>{lang.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Settings Button */}
        <button 
          onClick={onOpenSettings}
          className="w-full flex items-center justify-center space-x-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          <Settings className="w-4 h-4" />
          <span>{t('nav.settings')}</span>
        </button>
      </div>
    </div>
  );
}