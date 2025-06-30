import React from 'react';
import * as Icons from 'lucide-react';
import { Category, Skill } from '../types';
import { formatHours, getCategoryColor } from '../utils/helpers';

interface CategoryCardProps {
  category: Category;
  skills: Skill[];
  onAddSkill: (categoryId: string) => void;
  onClick: () => void;
}

export function CategoryCard({ category, skills, onAddSkill, onClick }: CategoryCardProps) {
  const IconComponent = (Icons as any)[category.icon] || Icons.Folder;
  const totalTime = skills.reduce((sum, skill) => sum + skill.totalTime, 0);
  const colorClasses = getCategoryColor(category.color);

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't trigger card click if clicking on action buttons
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    onClick();
  };

  const handleAddSkill = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddSkill(category.id);
  };

  return (
    <div 
      onClick={handleCardClick}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer group"
    >
      <div className={`p-6 ${colorClasses.bg} border-b ${colorClasses.border} dark:border-opacity-50`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-xl bg-white/20 dark:bg-black/20`}>
              <IconComponent className={`w-6 h-6 ${colorClasses.text}`} />
            </div>
            <h3 className={`font-bold text-lg ${colorClasses.text}`}>{category.name}</h3>
          </div>
          <div className={`text-sm font-bold px-3 py-1 rounded-full bg-white/20 dark:bg-black/20 ${colorClasses.text} text-center`}>
            {formatHours(totalTime)}
          </div>
        </div>
      </div>

      <div className="p-6">
        {skills.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">No skills in this category</p>
        ) : (
          <div className="space-y-3 mb-6">
            {skills.slice(0, 3).map((skill) => (
              <div key={skill.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <span className="text-sm font-medium text-gray-900 dark:text-white">{skill.name}</span>
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-600 px-2 py-1 rounded-lg text-center">
                  {formatHours(skill.totalTime)}
                </span>
              </div>
            ))}
            {skills.length > 3 && (
              <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                +{skills.length - 3} more skills
              </div>
            )}
          </div>
        )}

        <button
          onClick={handleAddSkill}
          className="w-full px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-105"
        >
          + Add Skill
        </button>
      </div>
    </div>
  );
}