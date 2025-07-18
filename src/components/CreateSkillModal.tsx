import React, { useState } from 'react';
import { useEffect } from 'react';
import { X, Timer } from 'lucide-react';
import { Category } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface CreateSkillModalProps {
  categories: Category[];
  selectedCategoryId?: string;
  isOpen: boolean;
  onClose: () => void;
  onCreateSkill: (
    name: string, 
    categoryId: string, 
    description?: string, 
    difficulty?: 'beginner' | 'intermediate' | 'advanced' | 'expert',
    targetHours?: number,
    pomodoroEnabled?: boolean,
    focusTime?: number,
    breakTime?: number
  ) => void;
}

export function CreateSkillModal({
  categories,
  selectedCategoryId,
  isOpen,
  onClose,
  onCreateSkill,
}: CreateSkillModalProps) {
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState(selectedCategoryId || categories[0]?.id || '');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState<'beginner' | 'intermediate' | 'advanced' | 'expert'>('beginner');
  const [targetHours, setTargetHours] = useState<number>(0);
  const [pomodoroEnabled, setPomodoroEnabled] = useState(false);
  const [focusTime, setFocusTime] = useState(25);
  const [breakTime, setBreakTime] = useState(5);
  const { t } = useLanguage();

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !categoryId) return;

    onCreateSkill(
      name.trim(), 
      categoryId, 
      description.trim() || undefined,
      difficulty,
      targetHours > 0 ? targetHours : undefined,
      pomodoroEnabled,
      focusTime,
      breakTime
    );
    
    // Reset form
    setName('');
    setDescription('');
    setCategoryId(selectedCategoryId || categories[0]?.id || '');
    setDifficulty('beginner');
    setTargetHours(0);
    setPomodoroEnabled(false);
    setFocusTime(25);
    setBreakTime(5);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-[60]">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t('skills.new')}</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              {t('skill.name')} *
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder={t('skill.namePlaceholder')}
              required
              autoFocus
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              {t('skill.category')} *
            </label>
            <select
              id="category"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              required
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="difficulty" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              {t('skills.difficulty')}
            </label>
            <select
              id="difficulty"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as 'beginner' | 'intermediate' | 'advanced' | 'expert')}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="beginner">{t('skill.difficulty.beginner')}</option>
              <option value="intermediate">{t('skill.difficulty.intermediate')}</option>
              <option value="advanced">{t('skill.difficulty.advanced')}</option>
              <option value="expert">{t('skill.difficulty.expert')}</option>
            </select>
          </div>

          <div>
            <label htmlFor="targetHours" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              {t('skills.targetHours')} ({t('common.optional')})
            </label>
            <input
              type="number"
              id="targetHours"
              value={targetHours}
              onChange={(e) => setTargetHours(Math.max(0, parseInt(e.target.value) || 0))}
              min="0"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="0"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              {t('skill.description')}
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder={t('skill.descriptionPlaceholder')}
              rows={3}
            />
          </div>

          {/* Pomodoro Settings */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <div className="flex items-center space-x-3 mb-4">
              <input
                type="checkbox"
                id="pomodoro"
                checked={pomodoroEnabled}
                onChange={(e) => setPomodoroEnabled(e.target.checked)}
                className="w-5 h-5 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500 dark:focus:ring-red-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <label htmlFor="pomodoro" className="flex items-center space-x-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                <Timer className="w-4 h-4" />
                <span>{t('skill.enablePomodoro')}</span>
              </label>
            </div>

            {pomodoroEnabled && (
              <div className="grid grid-cols-2 gap-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">
                <div>
                  <label htmlFor="focusTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('skill.focusTimeMinutes')}
                  </label>
                  <input
                    type="number"
                    id="focusTime"
                    value={focusTime}
                    onChange={(e) => setFocusTime(Math.max(1, parseInt(e.target.value) || 25))}
                    min="1"
                    max="120"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label htmlFor="breakTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('skill.breakTimeMinutes')}
                  </label>
                  <input
                    type="number"
                    id="breakTime"
                    value={breakTime}
                    onChange={(e) => setBreakTime(Math.max(1, parseInt(e.target.value) || 5))}
                    min="1"
                    max="60"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex space-x-3 pt-4">
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
              {t('skill.create')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}