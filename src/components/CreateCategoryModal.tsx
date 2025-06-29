import React, { useState } from 'react';
import { X } from 'lucide-react';
import * as Icons from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface CreateCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateCategory: (name: string, color: string, icon: string) => void;
}

const colorOptions = [
  { name: 'Blue', value: 'blue' },
  { name: 'Purple', value: 'purple' },
  { name: 'Green', value: 'green' },
  { name: 'Orange', value: 'orange' },
  { name: 'Red', value: 'red' },
  { name: 'Indigo', value: 'indigo' },
];

const iconOptions = [
  { name: 'Code', value: 'Code2' },
  { name: 'Palette', value: 'Palette' },
  { name: 'User', value: 'User' },
  { name: 'Folder', value: 'Folder' },
  { name: 'Star', value: 'Star' },
  { name: 'Heart', value: 'Heart' },
  { name: 'Lightbulb', value: 'Lightbulb' },
  { name: 'Target', value: 'Target' },
];

export function CreateCategoryModal({ isOpen, onClose, onCreateCategory }: CreateCategoryModalProps) {
  const [name, setName] = useState('');
  const [color, setColor] = useState('blue');
  const [icon, setIcon] = useState('Folder');
  const { t } = useLanguage();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onCreateCategory(name.trim(), color, icon);
    
    // Reset form
    setName('');
    setColor('blue');
    setIcon('Folder');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t('dashboard.newCategory')}</h2>
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
              {t('categories.name')} *
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder={t('categories.namePlaceholder')}
              required
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              {t('categories.color')}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {colorOptions.map((colorOption) => (
                <button
                  key={colorOption.value}
                  type="button"
                  onClick={() => setColor(colorOption.value)}
                  className={`p-3 rounded-xl border-2 text-sm font-semibold transition-all duration-200 transform hover:scale-105 ${
                    color === colorOption.value
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {colorOption.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              {t('categories.icon')}
            </label>
            <div className="grid grid-cols-4 gap-2">
              {iconOptions.map((iconOption) => {
                const IconComponent = (Icons as any)[iconOption.value];
                return (
                  <button
                    key={iconOption.value}
                    type="button"
                    onClick={() => setIcon(iconOption.value)}
                    className={`p-3 rounded-xl border-2 flex flex-col items-center space-y-1 transition-all duration-200 transform hover:scale-105 ${
                      icon === iconOption.value
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <IconComponent className="w-5 h-5" />
                    <span className="text-xs font-medium">{iconOption.name}</span>
                  </button>
                );
              })}
            </div>
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
              {t('categories.create')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}