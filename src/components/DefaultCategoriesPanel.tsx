import React, { useState } from 'react';
import { Plus, TrendingUp, Star } from 'lucide-react';
import * as Icons from 'lucide-react';
import { DefaultCategory, DefaultSkill, Category } from '../types';
import { getDefaultCategories, getTrendingSkills } from '../utils/defaultData';
import { useLanguage } from '../contexts/LanguageContext';
import { generateId } from '../utils/helpers';

interface DefaultCategoriesPanelProps {
  userCategories: Category[];
  onAdoptCategory: (category: Category) => void;
  onShowTrendingSkills: () => void;
}

export function DefaultCategoriesPanel({ 
  userCategories, 
  onAdoptCategory, 
  onShowTrendingSkills 
}: DefaultCategoriesPanelProps) {
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<DefaultCategory | null>(null);
  
  const defaultCategories = getDefaultCategories();
  const trendingSkills = getTrendingSkills();
  
  // Filtrer les catégories par défaut qui ne sont pas encore adoptées
  const availableCategories = defaultCategories.filter(defaultCat => 
    !userCategories.some(userCat => userCat.name === defaultCat.name)
  );

  const handleAdoptCategory = (defaultCategory: DefaultCategory) => {
    const newCategory: Category = {
      id: generateId(),
      name: defaultCategory.name,
      color: defaultCategory.color,
      icon: defaultCategory.icon,
      createdAt: new Date(),
      isDefault: true,
      skills: defaultCategory.skills.map(skill => ({
        id: generateId(),
        name: skill.name,
        category: defaultCategory.name,
        icon: defaultCategory.icon,
        color: defaultCategory.color,
        description: skill.description,
        popularity: 0,
        isActive: true,
        isDefault: true,
        isTrending: skill.isTrending,
        trendingReason: skill.trendingReason,
        difficulty: skill.difficulty,
        targetHours: 0,
        totalTime: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })),
    };
    
    onAdoptCategory(newCategory);
  };

  if (availableCategories.length === 0 && trendingSkills.length === 0) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {t('categories.discoverCategories')}
        </h3>
        {trendingSkills.length > 0 && (
          <button
            onClick={onShowTrendingSkills}
            className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
          >
            <TrendingUp size={16} />
            {t('categories.trendingSkills')} ({trendingSkills.length})
          </button>
        )}
      </div>

      {availableCategories.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {availableCategories.map((category) => {
            const IconComponent = (Icons as any)[category.icon] || Icons.Folder;
            return (
              <div
                key={category.id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setSelectedCategory(category)}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-lg bg-${category.color}-100 dark:bg-${category.color}-900 flex items-center justify-center`}>
                    <IconComponent className={`w-5 h-5 text-${category.color}-600 dark:text-${category.color}-400`} />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {category.name}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {category.skills.length} {t('categories.skills')}
                    </p>
                  </div>
                </div>
                
                {category.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                    {category.description}
                  </p>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {category.skills.some(skill => skill.isTrending) && (
                      <span className="flex items-center gap-1 text-xs text-orange-600 dark:text-orange-400">
                        <TrendingUp size={12} />
                        {t('categories.trending')}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAdoptCategory(category);
                    }}
                    className="flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                  >
                    <Plus size={14} />
                    {t('categories.adopt')}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal pour afficher les détails d'une catégorie */}
      {selectedCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {selectedCategory.name}
              </h3>
              <button
                onClick={() => setSelectedCategory(null)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                ×
              </button>
            </div>

            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {selectedCategory.description}
            </p>

            <div className="space-y-3 mb-6">
              <h4 className="font-medium text-gray-900 dark:text-white">
                {t('categories.skillsIncluded')}:
              </h4>
              {selectedCategory.skills.map((skill) => (
                <div key={skill.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {skill.name}
                    </p>
                    {skill.description && (
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {skill.description}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {skill.isTrending && (
                      <span className="flex items-center gap-1 text-xs text-orange-600 dark:text-orange-400">
                        <TrendingUp size={12} />
                        {t('categories.trending')}
                      </span>
                    )}
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      skill.difficulty === 'beginner' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                      skill.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                      skill.difficulty === 'advanced' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                      'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                    }`}>
                      {t(`skills.difficulty.${skill.difficulty}`)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => handleAdoptCategory(selectedCategory)}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {t('categories.adoptCategory')}
              </button>
              <button
                onClick={() => setSelectedCategory(null)}
                className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                {t('common.cancel')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 