import React, { useState } from 'react';
import { User, Folder, Plus, Target, Clock, Star, CheckCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Category } from '../types';

interface OnboardingGuideProps {
  onComplete: () => void;
  onCreateCategory: (name: string, color: string, icon: string) => void;
  onAddSkill: (categoryId: string, skillName: string) => void;
  selectedSkills: string[];
}

export function OnboardingGuide({ onComplete, onCreateCategory, onAddSkill, selectedSkills }: OnboardingGuideProps) {
  const [step, setStep] = useState(1);
  const [showSkillForm, setShowSkillForm] = useState(false);
  const [skillName, setSkillName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const { t } = useLanguage();

  // Convert selected skills to categories
  const skillToCategoryMap: Record<string, { name: string; color: string; icon: string }> = {
    'programming': { name: 'Programming', color: 'blue', icon: 'Code' },
    'design': { name: 'Design', color: 'purple', icon: 'Palette' },
    'music': { name: 'Music', color: 'pink', icon: 'Music' },
    'gaming': { name: 'Gaming', color: 'green', icon: 'Gamepad2' },
    'photography': { name: 'Photography', color: 'yellow', icon: 'Camera' },
    'cooking': { name: 'Cooking', color: 'orange', icon: 'Utensils' },
    'travel': { name: 'Travel', color: 'indigo', icon: 'Plane' },
    'reading': { name: 'Reading', color: 'red', icon: 'BookOpen' },
  };

  const handleCreateCategoriesFromSkills = () => {
    selectedSkills.forEach(skillId => {
      const category = skillToCategoryMap[skillId];
      if (category) {
        onCreateCategory(category.name, category.color, category.icon);
      }
    });
    setStep(3);
  };

  const handleAddSkill = () => {
    if (skillName.trim() && selectedCategory) {
      onAddSkill(selectedCategory, skillName.trim());
      setSkillName('');
      setShowSkillForm(false);
    }
  };

  const nextStep = () => {
    if (step < 4) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {t('guide.welcome')}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {t('guide.letsGetStarted')}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {t('guide.step')} {step}/4
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {Math.round((step / 4) * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(step / 4) * 100}%` }}
              />
            </div>
          </div>

          {/* Step Content */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {t('guide.whatIsTimeXP')}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {t('guide.timeXPDescription')}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <Clock className="w-8 h-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                    {t('guide.trackTime')}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {t('guide.trackTimeDesc')}
                  </p>
                </div>
                <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <Star className="w-8 h-8 text-purple-600 dark:text-purple-400 mx-auto mb-2" />
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                    {t('guide.organize')}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {t('guide.organizeDesc')}
                  </p>
                </div>
                <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <User className="w-8 h-8 text-green-600 dark:text-green-400 mx-auto mb-2" />
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                    {t('guide.grow')}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {t('guide.growDesc')}
                  </p>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Folder className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {t('guide.setupCategories')}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {t('guide.categoriesDescription')}
                </p>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    {t('guide.yourInterests')}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedSkills.map(skillId => {
                      const category = skillToCategoryMap[skillId];
                      return category ? (
                        <span key={skillId} className="px-3 py-1 bg-white dark:bg-gray-700 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300">
                          {category.name}
                        </span>
                      ) : null;
                    })}
                  </div>
                </div>

                <div className="text-center">
                  <button
                    onClick={handleCreateCategoriesFromSkills}
                    className="inline-flex items-center space-x-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                    <span>{t('guide.createCategoriesFromInterests')}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Plus className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {t('guide.addSkills')}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {t('guide.skillsDescription')}
                </p>
              </div>

              {!showSkillForm ? (
                <div className="text-center">
                  <button
                    onClick={() => setShowSkillForm(true)}
                    className="inline-flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                    <span>{t('guide.addFirstSkill')}</span>
                  </button>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    {t('guide.skipForNow')}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('guide.skillName')}
                    </label>
                    <input
                      type="text"
                      value={skillName}
                      onChange={(e) => setSkillName(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder={t('guide.skillNamePlaceholder')}
                    />
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={handleAddSkill}
                      disabled={!skillName.trim()}
                      className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {t('guide.addSkill')}
                    </button>
                    <button
                      onClick={() => setShowSkillForm(false)}
                      className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                    >
                      {t('common.cancel')}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {t('guide.readyToGo')}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {t('guide.readyDescription')}
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {t('guide.readyCheck1')}
                  </span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {t('guide.readyCheck2')}
                  </span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {t('guide.readyCheck3')}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <button
              type="button"
              onClick={prevStep}
              disabled={step === 1}
              className="px-6 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t('common.back')}
            </button>

            {step < 4 ? (
              <button
                type="button"
                onClick={nextStep}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                {t('common.next')}
              </button>
            ) : (
              <button
                type="button"
                onClick={onComplete}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                {t('guide.startUsing')}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 