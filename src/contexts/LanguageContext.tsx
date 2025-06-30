import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'fr' | 'es' | 'it' | 'de' | 'nl' | 'pt' | 'sv';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // App
    'app.title': 'TimeXP',
    'app.subtitle': 'Skill Development Tracker',
    'app.greeting.morning': 'Good morning',
    'app.greeting.afternoon': 'Good afternoon',
    'app.greeting.evening': 'Good evening',
    'app.motivation.1': 'What skills are we developing today?',
    'app.motivation.2': 'Ready to level up your skills?',
    'app.motivation.3': 'Time to master new abilities!',
    'app.motivation.4': 'Let\'s build expertise together!',
    'app.motivation.5': 'Your next skill breakthrough awaits!',
    
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.pinned': 'Pinned',
    'nav.categories': 'Categories',
    'nav.settings': 'Settings',
    'nav.logout': 'Logout',
    'nav.login': 'Login',
    'nav.profile': 'Profile',
    
    // Dashboard
    'dashboard.totalTime': 'Total Time Logged',
    'dashboard.activeSkills': 'Active Skills',
    'dashboard.tasksCompleted': 'Tasks Completed',
    'dashboard.newCategory': 'New Category',
    'dashboard.noCategories': 'No categories created yet',
    'dashboard.createFirstCategory': 'Create your first category',
    
    // Skills
    'skills.new': 'New Skill',
    'skills.pinned': 'Pinned Skills',
    'skills.noPinned': 'No pinned skills yet',
    'skills.noSkills': 'No skills created yet',
    'skills.createFirst': 'Create your first skill',
    'skills.totalTime': 'Total Time',
    'skills.tasks': 'Tasks',
    'skills.difficulty': 'Difficulty',
    'skills.status': 'Status',
    'skills.targetHours': 'Target Hours',
    
    // Skill statuses
    'skill.status.active': 'Active',
    'skill.status.paused': 'Paused',
    'skill.status.completed': 'Completed',
    'skill.status.archived': 'Archived',
    
    // Skill difficulties
    'skill.difficulty.beginner': 'Beginner',
    'skill.difficulty.intermediate': 'Intermediate',
    'skill.difficulty.advanced': 'Advanced',
    'skill.difficulty.expert': 'Expert',
    
    // Timer
    'timer.start': 'Start',
    'timer.pause': 'Pause',
    'timer.resume': 'Resume',
    'timer.stop': 'Stop',
    'timer.currentSession': 'Current session',
    'timer.addSession': 'Add Session',
    'timer.addManualSession': 'Add Manual Session',
    'timer.focusTime': 'Focus Time',
    'timer.breakTime': 'Break Time',
    'timer.totalDuration': 'Total Duration',
    'timer.startTime': 'Start Time',
    'timer.description': 'Description',
    'timer.descriptionPlaceholder': 'What did you work on during this session?',
    'timer.hours': 'Hours',
    'timer.minutes': 'Minutes',
    'timer.date': 'Date',
    
    // Tasks
    'tasks.title': 'Tasks',
    'tasks.add': 'Add',
    'tasks.addTask': 'Add Task',
    'tasks.noTasks': 'No tasks created yet. Add your first task to get started!',
    'tasks.deadline': 'Deadline (optional)',
    'tasks.priority': 'Priority',
    'tasks.priority.low': 'Low',
    'tasks.priority.medium': 'Medium',
    'tasks.priority.high': 'High',
    'tasks.dueToday': 'Due today',
    'tasks.dueTomorrow': 'Due tomorrow',
    'tasks.dueInDays': 'Due in {days} days',
    'tasks.overdue': '{days} days overdue',
    'tasks.taskName': 'Task name...',
    'tasks.lowPriority': 'low priority',
    'tasks.mediumPriority': 'medium priority',
    'tasks.highPriority': 'high priority',
    
    // Notes
    'notes.title': 'Notes',
    'notes.add': 'Add Note',
    'notes.addNote': 'Add Note',
    'notes.newNote': 'New Note',
    'notes.saveNote': 'Save Note',
    'notes.noNotes': 'No notes yet. Add your first note to keep track of important information!',
    'notes.edit': 'Edit',
    'notes.preview': 'Preview',
    'notes.placeholder': 'Write your note using markdown...',
    'notes.createFirst': 'Create your first note',
    
    // Sessions
    'sessions.title': 'Recent Sessions',
    'sessions.noSessions': 'No sessions recorded yet',
    'sessions.pomodoro': 'Pomodoro',
    'sessions.break': 'Break',
    
    // Achievements
    'achievements.title': 'Achievements',
    'achievements.level': 'Achievement Level',
    'achievements.nextGoal': 'Next Goal: {hours}h',
    'achievements.remaining': '{hours}h remaining ({percent}% complete)',
    'achievements.maxLevel': '🎉 Maximum Level Achieved!',
    'achievements.maxLevelDesc': 'You\'ve reached the highest achievement level',
    'achievements.levels.starter': 'Starter',
    'achievements.levels.beginner': 'Beginner',
    'achievements.levels.intermediate': 'Intermediate',
    'achievements.levels.advanced': 'Advanced',
    'achievements.levels.expert': 'Expert',
    'achievements.levels.master': 'Master',
    'achievements.unlocked': 'unlocked',
    'achievements.totalTime': 'Total Time',
    'achievements.tasksDone': 'Tasks Done',
    'achievements.next': 'Next',
    'achievements.progress': 'Progress',
    'achievements.yourAchievements': 'Your Achievements',
    'achievements.gettingStarted': 'Getting Started',
    'achievements.gettingStartedDesc': 'Log your first hour',
    'achievements.dedicatedLearner': 'Dedicated Learner',
    'achievements.dedicatedLearnerDesc': 'Reach 10 hours total',
    'achievements.skillBuilder': 'Skill Builder',
    'achievements.skillBuilderDesc': 'Achieve 100 hours',
    'achievements.taskMaster': 'Task Master',
    'achievements.taskMasterDesc': 'Complete 50 tasks',
    'achievements.pomodoroPro': 'Pomodoro Pro',
    'achievements.pomodoroProDesc': 'Complete 25 pomodoro sessions',
    'achievements.consistencyKing': 'Consistency King',
    'achievements.consistencyKingDesc': 'Log 100 sessions',
    
    // Profile
    'profile.title': 'Profile',
    'profile.subtitle': 'Manage your account and view achievements',
    'profile.personalInfo': 'Personal Information',
    'profile.fullName': 'Full Name',
    'profile.nickname': 'Nickname',
    'profile.dateOfBirth': 'Date of Birth',
    'profile.security': 'Security',
    'profile.currentPassword': 'Current Password',
    'profile.newPassword': 'New Password',
    'profile.confirmPassword': 'Confirm New Password',
    'profile.changePassword': 'Change Password',
    'profile.soundNotifications': 'Sound Notifications',
    'profile.soundDesc': 'Play sounds for achievements and timers',
    'profile.exportData': 'Export All Data',
    
    // Settings
    'settings.title': 'Settings',
    'settings.profile': 'Profile & Achievements',
    'settings.security': 'Security',
    'settings.audio': 'Audio',
    'settings.notifications': 'Notifications',
    'settings.data': 'Data',
    'settings.personalInfo': 'Personal Information',
    'settings.fullName': 'Full Name',
    'settings.nickname': 'Nickname',
    'settings.dateOfBirth': 'Date of Birth',
    'settings.currentPassword': 'Current Password',
    'settings.newPassword': 'New Password',
    'settings.confirmPassword': 'Confirm New Password',
    'settings.changePassword': 'Change Password',
    'settings.soundNotifications': 'Sound Notifications',
    'settings.soundDesc': 'Play sounds for achievements, pomodoro, and task completion',
    'settings.monthlyReports': 'Monthly Progress Reports',
    'settings.monthlyReportsDesc': 'Get monthly summaries of your progress',
    'settings.weeklyReminders': 'Weekly Goal Reminders',
    'settings.weeklyRemindersDesc': 'Get weekly reminders about your goals',
    'settings.exportData': 'Export All Data',
    'settings.saveSettings': 'Save Settings',
    
    // Categories
    'categories.name': 'Category Name',
    'categories.namePlaceholder': 'e.g. Programming, Design, Languages...',
    'categories.color': 'Color',
    'categories.icon': 'Icon',
    'categories.create': 'Create Category',
    
    // Skills
    'skill.name': 'Skill Name',
    'skill.namePlaceholder': 'e.g. React Development, Guitar Playing...',
    'skill.category': 'Category',
    'skill.description': 'Description (optional)',
    'skill.descriptionPlaceholder': 'Briefly describe this skill...',
    'skill.create': 'Create Skill',
    'skill.enablePomodoro': 'Enable Pomodoro Technique',
    'skill.focusTimeMinutes': 'Focus Time (minutes)',
    'skill.breakTimeMinutes': 'Break Time (minutes)',
    
    // Pomodoro
    'pomodoro.title': 'Pomodoro',
    'pomodoro.completedSessions': 'Completed Sessions',
    'pomodoro.focusTime': 'Focus Time',
    'pomodoro.breakTime': 'Break Time',
    'pomodoro.mode': 'Pomodoro Mode',
    
    // Toast
    'toast.hide': 'Hide Timer',
    'toast.show': 'Show Timer',
    'toast.minimize': 'Minimize',
    'toast.expand': 'Expand',
    
    // Common
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.add': 'Add',
    'common.create': 'Create',
    'common.back': 'Back',
    'common.close': 'Close',
    'common.loading': 'Loading...',
    'common.online': 'Online',
    'common.light': 'Light',
    'common.dark': 'Dark',
    'common.yes': 'Yes',
    'common.no': 'No',
    'common.confirm': 'Confirm',
    'common.optional': 'optional',
    
    // Authentication
    'auth.welcomeBack': 'Welcome Back',
    'auth.signInToContinue': 'Sign in to continue to TimeXP',
    'auth.createAccount': 'Create Account',
    'auth.signUpToGetStarted': 'Sign up to get started with TimeXP',
    'auth.email': 'Email',
    'auth.emailPlaceholder': 'Enter your email',
    'auth.password': 'Password',
    'auth.passwordPlaceholder': 'Enter your password',
    'auth.confirmPassword': 'Confirm Password',
    'auth.confirmPasswordPlaceholder': 'Confirm your password',
    'auth.forgotPassword': 'Forgot Password?',
    'auth.signIn': 'Sign In',
    'auth.signUp': 'Sign Up',
    'auth.noAccount': "Don't have an account?",
    'auth.alreadyHaveAccount': 'Already have an account?',
    'auth.checkYourEmail': 'Check Your Email',
    'auth.verificationEmailSent': 'We sent a verification email to your inbox',
    'auth.resetPasswordEmailSent': 'We sent a password reset link to your email',
    'auth.backToSignIn': 'Back to Sign In',
    'auth.enterEmailToReset': 'Enter your email to reset your password',
    'auth.sendResetLink': 'Send Reset Link',
    'auth.passwordsDoNotMatch': 'Passwords do not match',
    'auth.passwordTooShort': 'Password must be at least 6 characters long'
  },
  fr: {
    // App
    'app.title': 'TimeXP',
    'app.subtitle': 'Suivi de Développement des Compétences',
    'app.greeting.morning': 'Bonjour',
    'app.greeting.afternoon': 'Bon après-midi',
    'app.greeting.evening': 'Bonsoir',
    'app.motivation.1': 'Quelles compétences développons-nous aujourd\'hui ?',
    'app.motivation.2': 'Prêt à améliorer vos compétences ?',
    'app.motivation.3': 'Il est temps de maîtriser de nouvelles capacités !',
    'app.motivation.4': 'Construisons l\'expertise ensemble !',
    'app.motivation.5': 'Votre prochaine percée de compétence vous attend !',
    
    // Navigation
    'nav.dashboard': 'Tableau de bord',
    'nav.pinned': 'Épinglées',
    'nav.categories': 'Catégories',
    'nav.settings': 'Paramètres',
    'nav.logout': 'Déconnexion',
    'nav.login': 'Connexion',
    'nav.profile': 'Profil',
    
    // Dashboard
    'dashboard.totalTime': 'Temps Total Enregistré',
    'dashboard.activeSkills': 'Compétences Actives',
    'dashboard.tasksCompleted': 'Tâches Terminées',
    'dashboard.newCategory': 'Nouvelle Catégorie',
    'dashboard.noCategories': 'Aucune catégorie créée',
    'dashboard.createFirstCategory': 'Créez votre première catégorie',
    
    // Skills
    'skills.new': 'Nouvelle Compétence',
    'skills.pinned': 'Compétences Épinglées',
    'skills.noPinned': 'Aucune compétence épinglée',
    'skills.noSkills': 'Aucune compétence créée',
    'skills.createFirst': 'Créez votre première compétence',
    'skills.totalTime': 'Temps Total',
    'skills.tasks': 'Tâches',
    'skills.difficulty': 'Difficulté',
    'skills.status': 'Statut',
    'skills.targetHours': 'Heures Cibles',
    
    // Common
    'common.save': 'Sauvegarder',
    'common.cancel': 'Annuler',
    'common.delete': 'Supprimer',
    'common.edit': 'Modifier',
    'common.add': 'Ajouter',
    'common.create': 'Créer',
    'common.back': 'Retour',
    'common.close': 'Fermer',
    'common.loading': 'Chargement...',
    'common.online': 'En ligne',
    'common.light': 'Clair',
    'common.dark': 'Sombre',
    'common.yes': 'Oui',
    'common.no': 'Non',
    'common.confirm': 'Confirmer',
    'common.optional': 'optionnel',
  },
  // Add other languages with skill-focused translations...
  es: {
    'app.title': 'TimeXP',
    'app.subtitle': 'Rastreador de Desarrollo de Habilidades',
    'skills.new': 'Nueva Habilidad',
    'dashboard.activeSkills': 'Habilidades Activas',
    'common.loading': 'Cargando...',
    'common.optional': 'opcional',
  },
  it: {
    'app.title': 'TimeXP',
    'app.subtitle': 'Tracker di Sviluppo delle Competenze',
    'skills.new': 'Nuova Competenza',
    'dashboard.activeSkills': 'Competenze Attive',
    'common.loading': 'Caricamento...',
    'common.optional': 'opzionale',
  },
  de: {
    'app.title': 'TimeXP',
    'app.subtitle': 'Fähigkeitsentwicklungs-Tracker',
    'skills.new': 'Neue Fähigkeit',
    'dashboard.activeSkills': 'Aktive Fähigkeiten',
    'common.loading': 'Laden...',
    'common.optional': 'optional',
  },
  nl: {
    'app.title': 'TimeXP',
    'app.subtitle': 'Vaardigheidsontwikkeling Tracker',
    'skills.new': 'Nieuwe Vaardigheid',
    'dashboard.activeSkills': 'Actieve Vaardigheden',
    'common.loading': 'Laden...',
    'common.optional': 'optioneel',
  },
  pt: {
    'app.title': 'TimeXP',
    'app.subtitle': 'Rastreador de Desenvolvimento de Habilidades',
    'skills.new': 'Nova Habilidade',
    'dashboard.activeSkills': 'Habilidades Ativas',
    'common.loading': 'Carregando...',
    'common.optional': 'opcional',
  },
  sv: {
    'app.title': 'TimeXP',
    'app.subtitle': 'Färdighetsutveckling Spårare',
    'skills.new': 'Ny Färdighet',
    'dashboard.activeSkills': 'Aktiva Färdigheter',
    'common.loading': 'Laddar...',
    'common.optional': 'valfritt',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    if (saved && Object.keys(translations).includes(saved)) {
      return saved as Language;
    }
    // Auto-detect browser language
    const browserLang = navigator.language.split('-')[0];
    const detectedLang = Object.keys(translations).includes(browserLang) ? browserLang as Language : 'en';
    return detectedLang;
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const t = (key: string): string => {
    const currentTranslations = translations[language];
    
    // Direct lookup in the flat translations object
    const translation = (currentTranslations as Record<string, string>)?.[key];
    
    // Return the translation if found, otherwise return the key
    return translation || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}