import React, { useState } from 'react';
import { User, Heart, BookOpen, Code, Palette, Music, Gamepad2, Camera, Utensils, Plane } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface OnboardingFormProps {
  onComplete: (userData: OnboardingData) => void;
  loading?: boolean;
}

export interface OnboardingData {
  nickname: string;
  preferredLanguage: string;
  selectedSkills: string[];
  timezone: string;
  dailyGoal?: number;
}

const interestOptions = [
  { id: 'programming', label: 'Programming', icon: Code, color: 'bg-blue-500' },
  { id: 'design', label: 'Design', icon: Palette, color: 'bg-purple-500' },
  { id: 'music', label: 'Music', icon: Music, color: 'bg-pink-500' },
  { id: 'gaming', label: 'Gaming', icon: Gamepad2, color: 'bg-green-500' },
  { id: 'photography', label: 'Photography', icon: Camera, color: 'bg-yellow-500' },
  { id: 'cooking', label: 'Cooking', icon: Utensils, color: 'bg-orange-500' },
  { id: 'travel', label: 'Travel', icon: Plane, color: 'bg-indigo-500' },
  { id: 'reading', label: 'Reading', icon: BookOpen, color: 'bg-red-500' },
];

const languageOptions = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'nl', name: 'Nederlands', flag: '🇳🇱' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
  { code: 'sv', name: 'Svenska', flag: '🇸🇪' },
];

export function OnboardingForm({ onComplete, loading = false }: OnboardingFormProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<OnboardingData>({
    nickname: '',
    preferredLanguage: 'en',
    selectedSkills: [],
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    dailyGoal: 4,
  });

  const { t, language, setLanguage } = useLanguage();

  const handleSkillToggle = (skillId: string) => {
    setFormData(prev => ({
      ...prev,
      selectedSkills: prev.selectedSkills?.includes(skillId)
        ? prev.selectedSkills.filter(id => id !== skillId)
        : [...(prev.selectedSkills || []), skillId]
    }));
  };

  const handleLanguageChange = (langCode: string) => {
    setFormData(prev => ({ ...prev, preferredLanguage: langCode }));
    setLanguage(langCode as any);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete(formData);
    // Mark onboarding as complete and trigger guide
    localStorage.removeItem('newUser');
    localStorage.setItem('onboardingComplete', 'true');
    localStorage.setItem('showGuide', 'true');
  };

  const canProceed = () => {
    switch (step) {
      case 1: return formData.nickname.trim().length > 0;
      case 2: return (formData.selectedSkills?.length || 0) > 0;
      case 3: return true;
      default: return false;
    }
  };

  const nextStep = () => {

    if (canProceed() && step < 3) {
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
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {t('onboarding.welcome')}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {t('onboarding.setupProfile')}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {t('onboarding.step')} {step}/3
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {Math.round((step / 3) * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(step / 3) * 100}%` }}
              />
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Step 1: Nickname */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('onboarding.nickname')}
                  </label>
                  <input
                    type="text"
                    value={formData.nickname}
                    onChange={(e) => setFormData(prev => ({ ...prev, nickname: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                    placeholder={t('onboarding.nicknamePlaceholder')}
                    required
                  />
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {t('onboarding.nicknameHelp')}
                  </p>
                </div>
              </div>
            )}

            {/* Step 2: Interests */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                    {t('onboarding.interests')}
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {interestOptions.map((interest) => {
                      const Icon = interest.icon;
                      const isSelected = formData.selectedSkills?.includes(interest.id) || false;
                      return (
                        <button
                          key={interest.id}
                          type="button"
                          onClick={() => handleSkillToggle(interest.id)}
                          className={`p-4 rounded-lg border-2 transition-all ${
                            isSelected
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                              : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <div className={`w-8 h-8 rounded-full ${interest.color} flex items-center justify-center`}>
                              <Icon className="w-4 h-4 text-white" />
                            </div>
                            <span className="font-medium text-gray-900 dark:text-white">
                              {t(`onboarding.interests.${interest.id}`)}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
                    {t('onboarding.interestsHelp')}
                  </p>
                </div>
              </div>
            )}

            {/* Step 3: Language & Goals */}
            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    {t('onboarding.preferredLanguage')}
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {languageOptions.map((lang) => (
                      <button
                        key={lang.code}
                        type="button"
                        onClick={() => handleLanguageChange(lang.code)}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          formData.preferredLanguage === lang.code
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">{lang.flag}</span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {lang.name}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('onboarding.dailyGoal')}
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="12"
                    value={formData.dailyGoal}
                    onChange={(e) => setFormData(prev => ({ ...prev, dailyGoal: parseInt(e.target.value) || 4 }))}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {t('onboarding.dailyGoalHelp')}
                  </p>
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

              {step < 3 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={!canProceed()}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t('common.next')}
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading || !canProceed()}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>{t('common.loading')}</span>
                    </>
                  ) : (
                    <span>{t('onboarding.complete')}</span>
                  )}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 