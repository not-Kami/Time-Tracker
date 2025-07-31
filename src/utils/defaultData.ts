import { DefaultCategory, DefaultSkill } from '../types';

// Données par défaut pour les catégories et skills
export const defaultCategories: DefaultCategory[] = [
  {
    id: 'dev-category',
    name: 'Développement',
    color: 'blue',
    icon: 'Code',
    description: 'Compétences en développement et programmation',
    isActive: true,
    sortOrder: 1,
    skills: [
      {
        id: 'react-skill',
        name: 'React',
        description: 'Framework JavaScript pour les interfaces utilisateur',
        difficulty: 'intermediate',
        isTrending: true,
        trendingReason: 'React 19 est trending ce mois-ci avec de nouvelles fonctionnalités',
        isActive: true,
        sortOrder: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'vue-skill',
        name: 'Vue.js',
        description: 'Framework progressif pour les interfaces utilisateur',
        difficulty: 'beginner',
        isTrending: false,
        isActive: true,
        sortOrder: 2,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'typescript-skill',
        name: 'TypeScript',
        description: 'Superset typé de JavaScript',
        difficulty: 'intermediate',
        isTrending: true,
        trendingReason: 'TypeScript 5.0 apporte de nouvelles fonctionnalités',
        isActive: true,
        sortOrder: 3,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'design-category',
    name: 'Design',
    color: 'purple',
    icon: 'Palette',
    description: 'Compétences en design et créativité',
    isActive: true,
    sortOrder: 2,
    skills: [
      {
        id: 'figma-skill',
        name: 'Figma',
        description: 'Outil de design collaboratif',
        difficulty: 'beginner',
        isTrending: true,
        trendingReason: 'Figma lance de nouvelles fonctionnalités d\'IA',
        isActive: true,
        sortOrder: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'photoshop-skill',
        name: 'Photoshop',
        description: 'Édition d\'images professionnelle',
        difficulty: 'advanced',
        isTrending: false,
        isActive: true,
        sortOrder: 2,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'music-category',
    name: 'Musique',
    color: 'pink',
    icon: 'Music',
    description: 'Compétences musicales et audio',
    isActive: true,
    sortOrder: 3,
    skills: [
      {
        id: 'piano-skill',
        name: 'Piano',
        description: 'Apprentissage du piano',
        difficulty: 'beginner',
        isTrending: false,
        isActive: true,
        sortOrder: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'guitar-skill',
        name: 'Guitare',
        description: 'Apprentissage de la guitare',
        difficulty: 'beginner',
        isTrending: false,
        isActive: true,
        sortOrder: 2,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'fitness-category',
    name: 'Fitness',
    color: 'green',
    icon: 'Dumbbell',
    description: 'Activités physiques et bien-être',
    isActive: true,
    sortOrder: 4,
    skills: [
      {
        id: 'running-skill',
        name: 'Course à pied',
        description: 'Amélioration de l\'endurance',
        difficulty: 'beginner',
        isTrending: false,
        isActive: true,
        sortOrder: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'yoga-skill',
        name: 'Yoga',
        description: 'Flexibilité et équilibre',
        difficulty: 'beginner',
        isTrending: true,
        trendingReason: 'Le yoga devient très populaire pour le bien-être',
        isActive: true,
        sortOrder: 2,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Fonction pour obtenir les catégories par défaut
export const getDefaultCategories = (): DefaultCategory[] => {
  return defaultCategories.filter(cat => cat.isActive);
};

// Fonction pour obtenir les skills trending
export const getTrendingSkills = (): DefaultSkill[] => {
  const trendingSkills: DefaultSkill[] = [];
  defaultCategories.forEach(category => {
    category.skills.forEach(skill => {
      if (skill.isTrending && skill.isActive) {
        trendingSkills.push(skill);
      }
    });
  });
  return trendingSkills;
};

// Fonction pour obtenir les skills d'une catégorie
export const getSkillsForCategory = (categoryId: string): DefaultSkill[] => {
  const category = defaultCategories.find(cat => cat.id === categoryId);
  return category ? category.skills.filter(skill => skill.isActive) : [];
}; 