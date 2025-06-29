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
    'app.motivation.1': 'What are we working on today?',
    'app.motivation.2': 'Ready to make progress?',
    'app.motivation.3': 'Time to achieve your goals!',
    'app.motivation.4': 'Let\'s build something amazing!',
    'app.motivation.5': 'Your next breakthrough awaits!',
    
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
    'dashboard.activeProjects': 'Active Projects',
    'dashboard.tasksCompleted': 'Tasks Completed',
    'dashboard.newCategory': 'New Category',
    'dashboard.noCategories': 'No categories created yet',
    'dashboard.createFirstCategory': 'Create your first category',
    
    // Projects
    'projects.new': 'New Project',
    'projects.pinned': 'Pinned Projects',
    'projects.noPinned': 'No pinned projects yet',
    'projects.noProjects': 'No projects created yet',
    'projects.createFirst': 'Create your first project',
    'projects.totalTime': 'Total Time',
    'projects.tasks': 'Tasks',
    
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
    
    // Playlists
    'playlist.title': 'Playlist',
    'playlist.add': 'Add Playlist',
    'playlist.url': 'Playlist URL',
    'playlist.urlPlaceholder': 'Enter Spotify, YouTube, or Apple Music playlist URL',
    'playlist.name': 'Playlist Name',
    'playlist.namePlaceholder': 'Enter a name for this playlist',
    'playlist.save': 'Save Playlist',
    'playlist.remove': 'Remove Playlist',
    'playlist.noPlaylist': 'No playlist added yet',
    'playlist.addFirst': 'Add a playlist to listen while working',
    
    // Categories
    'categories.name': 'Category Name',
    'categories.namePlaceholder': 'e.g. Development, Design, Personal...',
    'categories.color': 'Color',
    'categories.icon': 'Icon',
    'categories.create': 'Create Category',
    
    // Projects
    'project.name': 'Project Name',
    'project.namePlaceholder': 'e.g. Client Website, Mobile App...',
    'project.category': 'Category',
    'project.description': 'Description (optional)',
    'project.descriptionPlaceholder': 'Briefly describe this project...',
    'project.create': 'Create Project',
    'project.enablePomodoro': 'Enable Pomodoro Technique',
    'project.focusTimeMinutes': 'Focus Time (minutes)',
    'project.breakTimeMinutes': 'Break Time (minutes)',
    
    // Pomodoro
    'pomodoro.title': 'Pomodoro Stats',
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
    'app.motivation.1': 'Sur quoi travaillons-nous aujourd\'hui ?',
    'app.motivation.2': 'Prêt à progresser ?',
    'app.motivation.3': 'Il est temps d\'atteindre vos objectifs !',
    'app.motivation.4': 'Construisons quelque chose d\'incroyable !',
    'app.motivation.5': 'Votre prochaine percée vous attend !',
    
    // Navigation
    'nav.dashboard': 'Tableau de bord',
    'nav.pinned': 'Épinglés',
    'nav.categories': 'Catégories',
    'nav.settings': 'Paramètres',
    'nav.logout': 'Déconnexion',
    'nav.login': 'Connexion',
    'nav.profile': 'Profil',
    
    // Dashboard
    'dashboard.totalTime': 'Temps Total Enregistré',
    'dashboard.activeProjects': 'Projets Actifs',
    'dashboard.tasksCompleted': 'Tâches Terminées',
    'dashboard.newCategory': 'Nouvelle Catégorie',
    'dashboard.noCategories': 'Aucune catégorie créée',
    'dashboard.createFirstCategory': 'Créez votre première catégorie',
    
    // Projects
    'projects.new': 'Nouveau Projet',
    'projects.pinned': 'Projets Épinglés',
    'projects.noPinned': 'Aucun projet épinglé',
    'projects.noProjects': 'Aucun projet créé',
    'projects.createFirst': 'Créez votre premier projet',
    'projects.totalTime': 'Temps Total',
    'projects.tasks': 'Tâches',
    
    // Timer
    'timer.start': 'Démarrer',
    'timer.pause': 'Pause',
    'timer.resume': 'Reprendre',
    'timer.stop': 'Arrêter',
    'timer.currentSession': 'Session actuelle',
    'timer.addSession': 'Ajouter Session',
    'timer.addManualSession': 'Ajouter Session Manuelle',
    'timer.focusTime': 'Temps de Focus',
    'timer.breakTime': 'Temps de Pause',
    'timer.totalDuration': 'Durée Totale',
    'timer.startTime': 'Heure de Début',
    'timer.description': 'Description',
    'timer.descriptionPlaceholder': 'Sur quoi avez-vous travaillé pendant cette session ?',
    'timer.hours': 'Heures',
    'timer.minutes': 'Minutes',
    'timer.date': 'Date',
    
    // Tasks
    'tasks.title': 'Tâches',
    'tasks.add': 'Ajouter',
    'tasks.addTask': 'Ajouter Tâche',
    'tasks.noTasks': 'Aucune tâche créée. Ajoutez votre première tâche pour commencer !',
    'tasks.deadline': 'Échéance (optionnel)',
    'tasks.priority': 'Priorité',
    'tasks.priority.low': 'Faible',
    'tasks.priority.medium': 'Moyenne',
    'tasks.priority.high': 'Élevée',
    'tasks.dueToday': 'Échéance aujourd\'hui',
    'tasks.dueTomorrow': 'Échéance demain',
    'tasks.dueInDays': 'Échéance dans {days} jours',
    'tasks.overdue': '{days} jours de retard',
    'tasks.taskName': 'Nom de la tâche...',
    'tasks.lowPriority': 'priorité faible',
    'tasks.mediumPriority': 'priorité moyenne',
    'tasks.highPriority': 'priorité élevée',
    
    // Notes
    'notes.title': 'Notes',
    'notes.add': 'Ajouter Note',
    'notes.addNote': 'Ajouter Note',
    'notes.newNote': 'Nouvelle Note',
    'notes.saveNote': 'Sauvegarder Note',
    'notes.noNotes': 'Aucune note encore. Ajoutez votre première note pour garder une trace des informations importantes !',
    'notes.edit': 'Modifier',
    'notes.preview': 'Aperçu',
    'notes.placeholder': 'Écrivez votre note en utilisant markdown...',
    'notes.createFirst': 'Créez votre première note',
    
    // Sessions
    'sessions.title': 'Sessions Récentes',
    'sessions.noSessions': 'Aucune session enregistrée',
    'sessions.pomodoro': 'Pomodoro',
    'sessions.break': 'Pause',
    
    // Achievements
    'achievements.title': 'Réalisations',
    'achievements.level': 'Niveau de Réalisation',
    'achievements.nextGoal': 'Prochain Objectif : {hours}h',
    'achievements.remaining': '{hours}h restantes ({percent}% terminé)',
    'achievements.maxLevel': '🎉 Niveau Maximum Atteint !',
    'achievements.maxLevelDesc': 'Vous avez atteint le niveau de réalisation le plus élevé',
    'achievements.levels.starter': 'Débutant',
    'achievements.levels.beginner': 'Novice',
    'achievements.levels.intermediate': 'Intermédiaire',
    'achievements.levels.advanced': 'Avancé',
    'achievements.levels.expert': 'Expert',
    'achievements.levels.master': 'Maître',
    'achievements.unlocked': 'unlocked',
    'achievements.totalTime': 'Temps Total',
    'achievements.tasksDone': 'Tâches Terminées',
    'achievements.next': 'Suivant',
    'achievements.progress': 'Progression',
    'achievements.yourAchievements': 'Vos Réalisations',
    'achievements.gettingStarted': 'Débuter',
    'achievements.gettingStartedDesc': 'Log 1 heure',
    'achievements.dedicatedLearner': 'Étudiant Dédié',
    'achievements.dedicatedLearnerDesc': 'Atteindre 10 heures',
    'achievements.skillBuilder': 'Constructeur de Compétences',
    'achievements.skillBuilderDesc': 'Atteindre 100 heures',
    'achievements.taskMaster': 'Maître des Tâches',
    'achievements.taskMasterDesc': 'Terminer 50 tâches',
    'achievements.pomodoroPro': 'Pomodoro Pro',
    'achievements.pomodoroProDesc': 'Terminer 25 sessions pomodoro',
    'achievements.consistencyKing': 'Roi de la Consistance',
    'achievements.consistencyKingDesc': 'Log 100 sessions'
  },
  es: {
    // App
    'app.title': 'TimeXP',
    'app.subtitle': 'Rastreador de Desarrollo de Habilidades',
    'app.greeting.morning': 'Buenos días',
    'app.greeting.afternoon': 'Buenas tardes',
    'app.greeting.evening': 'Buenas noches',
    'app.motivation.1': '¿En qué estamos trabajando hoy?',
    'app.motivation.2': '¿Listo para progresar?',
    'app.motivation.3': '¡Es hora de alcanzar tus objetivos!',
    'app.motivation.4': '¡Construyamos algo increíble!',
    'app.motivation.5': '¡Tu próximo avance te espera!',
    
    // Navigation
    'nav.dashboard': 'Panel de Control',
    'nav.pinned': 'Fijados',
    'nav.categories': 'Categorías',
    'nav.settings': 'Configuración',
    'nav.logout': 'Cerrar Sesión',
    'nav.login': 'Iniciar Sesión',
    'nav.profile': 'Perfil',
    
    // Dashboard
    'dashboard.totalTime': 'Tiempo Total Registrado',
    'dashboard.activeProjects': 'Proyectos Activos',
    'dashboard.tasksCompleted': 'Tareas Completadas',
    'dashboard.newCategory': 'Nueva Categoría',
    'dashboard.noCategories': 'No hay categorías creadas',
    'dashboard.createFirstCategory': 'Crea tu primera categoría',
    
    // Projects
    'projects.new': 'Nuevo Proyecto',
    'projects.pinned': 'Proyectos Fijados',
    'projects.noPinned': 'No hay proyectos fijados',
    'projects.noProjects': 'No hay proyectos creados',
    'projects.createFirst': 'Crea tu primer proyecto',
    'projects.totalTime': 'Tiempo Total',
    'projects.tasks': 'Tareas',
    
    // Timer
    'timer.start': 'Iniciar',
    'timer.pause': 'Pausar',
    'timer.resume': 'Reanudar',
    'timer.stop': 'Detener',
    'timer.currentSession': 'Sesión actual',
    'timer.addSession': 'Agregar Sesión',
    'timer.addManualSession': 'Agregar Sesión Manual',
    'timer.focusTime': 'Tiempo de Enfoque',
    'timer.breakTime': 'Tiempo de Descanso',
    'timer.totalDuration': 'Duración Total',
    'timer.startTime': 'Hora de Inicio',
    'timer.description': 'Descripción',
    'timer.descriptionPlaceholder': '¿En qué trabajaste durante esta sesión?',
    'timer.hours': 'Horas',
    'timer.minutes': 'Minutos',
    'timer.date': 'Fecha',
    
    // Tasks
    'tasks.title': 'Tareas',
    'tasks.add': 'Agregar',
    'tasks.addTask': 'Agregar Tarea',
    'tasks.noTasks': 'No hay tareas creadas. ¡Agrega tu primera tarea para comenzar!',
    'tasks.deadline': 'Fecha límite (opcional)',
    'tasks.priority': 'Prioridad',
    'tasks.priority.low': 'Baja',
    'tasks.priority.medium': 'Media',
    'tasks.priority.high': 'Alta',
    'tasks.dueToday': 'Vence hoy',
    'tasks.dueTomorrow': 'Vence mañana',
    'tasks.dueInDays': 'Vence en {days} días',
    'tasks.overdue': '{days} días de retraso',
    'tasks.taskName': 'Nombre de la tarea...',
    'tasks.lowPriority': 'prioridad baja',
    'tasks.mediumPriority': 'prioridad media',
    'tasks.highPriority': 'prioridad alta',
    
    // Notes
    'notes.title': 'Notas',
    'notes.add': 'Agregar Nota',
    'notes.addNote': 'Agregar Nota',
    'notes.newNote': 'Nueva Nota',
    'notes.saveNote': 'Guardar Nota',
    'notes.noNotes': 'No hay notas aún. ¡Agrega tu primera nota para hacer seguimiento de información importante!',
    'notes.edit': 'Editar',
    'notes.preview': 'Vista Previa',
    'notes.placeholder': 'Escribe tu nota usando markdown...',
    'notes.createFirst': 'Crea tu primera nota',
    
    // Sessions
    'sessions.title': 'Sesiones Recientes',
    'sessions.noSessions': 'No hay sesiones registradas',
    'sessions.pomodoro': 'Pomodoro',
    'sessions.break': 'Descanso',
    
    // Achievements
    'achievements.title': 'Logros',
    'achievements.level': 'Nivel de Logro',
    'achievements.nextGoal': 'Próximo Objetivo: {hours}h',
    'achievements.remaining': '{hours}h restantes ({percent}% completado)',
    'achievements.maxLevel': '🎉 ¡Nivel Máximo Alcanzado!',
    'achievements.maxLevelDesc': 'Has alcanzado el nivel de logro más alto',
    'achievements.levels.starter': 'Principiante',
    'achievements.levels.beginner': 'Novato',
    'achievements.levels.intermediate': 'Intermedio',
    'achievements.levels.advanced': 'Avanzado',
    'achievements.levels.expert': 'Experto',
    'achievements.levels.master': 'Maestro',
    'achievements.unlocked': 'unlocked',
    'achievements.totalTime': 'Tiempo Total',
    'achievements.tasksDone': 'Tareas Completadas',
    'achievements.next': 'Siguiente',
    'achievements.progress': 'Progreso',
    'achievements.yourAchievements': 'Tus Logros',
    'achievements.gettingStarted': 'Empezando',
    'achievements.gettingStartedDesc': 'Log 1 hora',
    'achievements.dedicatedLearner': 'Estudiante Dedicado',
    'achievements.dedicatedLearnerDesc': 'Alcanzar 10 horas',
    'achievements.skillBuilder': 'Constructor de Habilidades',
    'achievements.skillBuilderDesc': 'Alcanzar 100 horas',
    'achievements.taskMaster': 'Maestro de Tareas',
    'achievements.taskMasterDesc': 'Completar 50 tareas',
    'achievements.pomodoroPro': 'Pomodoro Pro',
    'achievements.pomodoroProDesc': 'Completar 25 sesiones pomodoro',
    'achievements.consistencyKing': 'Rey de Consistencia',
    'achievements.consistencyKingDesc': 'Log 100 sesiones'
  },
  it: {
    // App
    'app.title': 'TimeXP',
    'app.subtitle': 'Tracker di Sviluppo delle Competenze',
    'app.greeting.morning': 'Buongiorno',
    'app.greeting.afternoon': 'Buon pomeriggio',
    'app.greeting.evening': 'Buonasera',
    'app.motivation.1': 'Su cosa stiamo lavorando oggi?',
    'app.motivation.2': 'Pronto a fare progressi?',
    'app.motivation.3': 'È ora di raggiungere i tuoi obiettivi!',
    'app.motivation.4': 'Costruiamo qualcosa di incredibile!',
    'app.motivation.5': 'Il tuo prossimo traguardo ti aspetta!',
    
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.pinned': 'Appuntati',
    'nav.categories': 'Categorie',
    'nav.settings': 'Impostazioni',
    'nav.logout': 'Logout',
    'nav.login': 'Login',
    'nav.profile': 'Profilo',
    
    // Common
    'common.save': 'Salva',
    'common.cancel': 'Annulla',
    'common.delete': 'Elimina',
    'common.edit': 'Modifica',
    'common.add': 'Aggiungi',
    'common.create': 'Crea',
    'common.back': 'Indietro',
    'common.close': 'Chiudi',
    'common.loading': 'Caricamento...',
    'common.online': 'Online',
    'common.light': 'Chiaro',
    'common.dark': 'Scuro',
    'common.yes': 'Sì',
    'common.no': 'No',
    'common.confirm': 'Conferma',
  },
  de: {
    // App
    'app.title': 'TimeXP',
    'app.subtitle': 'Fähigkeitsentwicklungs-Tracker',
    'app.greeting.morning': 'Guten Morgen',
    'app.greeting.afternoon': 'Guten Tag',
    'app.greeting.evening': 'Guten Abend',
    'app.motivation.1': 'Woran arbeiten wir heute?',
    'app.motivation.2': 'Bereit für Fortschritte?',
    'app.motivation.3': 'Zeit, deine Ziele zu erreichen!',
    'app.motivation.4': 'Lass uns etwas Unglaubliches bauen!',
    'app.motivation.5': 'Dein nächster Durchbruch wartet!',
    
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.pinned': 'Angeheftet',
    'nav.categories': 'Kategorien',
    'nav.settings': 'Einstellungen',
    'nav.logout': 'Abmelden',
    'nav.login': 'Anmelden',
    'nav.profile': 'Profil',
    
    // Common
    'common.save': 'Speichern',
    'common.cancel': 'Abbrechen',
    'common.delete': 'Löschen',
    'common.edit': 'Bearbeiten',
    'common.add': 'Hinzufügen',
    'common.create': 'Erstellen',
    'common.back': 'Zurück',
    'common.close': 'Schließen',
    'common.loading': 'Laden...',
    'common.online': 'Online',
    'common.light': 'Hell',
    'common.dark': 'Dunkel',
    'common.yes': 'Ja',
    'common.no': 'Nein',
    'common.confirm': 'Bestätigen',
  },
  nl: {
    // App
    'app.title': 'TimeXP',
    'app.subtitle': 'Vaardigheidsontwikkeling Tracker',
    'app.greeting.morning': 'Goedemorgen',
    'app.greeting.afternoon': 'Goedemiddag',
    'app.greeting.evening': 'Goedenavond',
    'app.motivation.1': 'Waar werken we vandaag aan?',
    'app.motivation.2': 'Klaar om vooruitgang te boeken?',
    'app.motivation.3': 'Tijd om je doelen te bereiken!',
    'app.motivation.4': 'Laten we iets geweldigs bouwen!',
    'app.motivation.5': 'Je volgende doorbraak wacht!',
    
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.pinned': 'Vastgezet',
    'nav.categories': 'Categorieën',
    'nav.settings': 'Instellingen',
    'nav.logout': 'Uitloggen',
    'nav.login': 'Inloggen',
    'nav.profile': 'Profiel',
    
    // Common
    'common.save': 'Opslaan',
    'common.cancel': 'Annuleren',
    'common.delete': 'Verwijderen',
    'common.edit': 'Bewerken',
    'common.add': 'Toevoegen',
    'common.create': 'Maken',
    'common.back': 'Terug',
    'common.close': 'Sluiten',
    'common.loading': 'Laden...',
    'common.online': 'Online',
    'common.light': 'Licht',
    'common.dark': 'Donker',
    'common.yes': 'Ja',
    'common.no': 'Nee',
    'common.confirm': 'Bevestigen',
  },
  pt: {
    // App
    'app.title': 'TimeXP',
    'app.subtitle': 'Rastreador de Desenvolvimento de Habilidades',
    'app.greeting.morning': 'Bom dia',
    'app.greeting.afternoon': 'Boa tarde',
    'app.greeting.evening': 'Boa noite',
    'app.motivation.1': 'No que estamos trabalhando hoje?',
    'app.motivation.2': 'Pronto para progredir?',
    'app.motivation.3': 'Hora de alcançar seus objetivos!',
    'app.motivation.4': 'Vamos construir algo incrível!',
    'app.motivation.5': 'Seu próximo avanço te aguarda!',
    
    // Navigation
    'nav.dashboard': 'Painel',
    'nav.pinned': 'Fixados',
    'nav.categories': 'Categorias',
    'nav.settings': 'Configurações',
    'nav.logout': 'Sair',
    'nav.login': 'Entrar',
    'nav.profile': 'Perfil',
    
    // Common
    'common.save': 'Salvar',
    'common.cancel': 'Cancelar',
    'common.delete': 'Excluir',
    'common.edit': 'Editar',
    'common.add': 'Adicionar',
    'common.create': 'Criar',
    'common.back': 'Voltar',
    'common.close': 'Fechar',
    'common.loading': 'Carregando...',
    'common.online': 'Online',
    'common.light': 'Claro',
    'common.dark': 'Escuro',
    'common.yes': 'Sim',
    'common.no': 'Não',
    'common.confirm': 'Confirmar',
  },
  sv: {
    // App
    'app.title': 'TimeXP',
    'app.subtitle': 'Färdighetsutveckling Spårare',
    'app.greeting.morning': 'God morgon',
    'app.greeting.afternoon': 'God eftermiddag',
    'app.greeting.evening': 'God kväll',
    'app.motivation.1': 'Vad arbetar vi med idag?',
    'app.motivation.2': 'Redo att göra framsteg?',
    'app.motivation.3': 'Dags att nå dina mål!',
    'app.motivation.4': 'Låt oss bygga något fantastiskt!',
    'app.motivation.5': 'Ditt nästa genombrott väntar!',
    
    // Navigation
    'nav.dashboard': 'Instrumentpanel',
    'nav.pinned': 'Fäst',
    'nav.categories': 'Kategorier',
    'nav.settings': 'Inställningar',
    'nav.logout': 'Logga ut',
    'nav.login': 'Logga in',
    'nav.profile': 'Profil',
    
    // Common
    'common.save': 'Spara',
    'common.cancel': 'Avbryt',
    'common.delete': 'Radera',
    'common.edit': 'Redigera',
    'common.add': 'Lägg till',
    'common.create': 'Skapa',
    'common.back': 'Tillbaka',
    'common.close': 'Stäng',
    'common.loading': 'Laddar...',
    'common.online': 'Online',
    'common.light': 'Ljus',
    'common.dark': 'Mörk',
    'common.yes': 'Ja',
    'common.no': 'Nej',
    'common.confirm': 'Bekräfta',
  },
  // ... (add complete translations for other languages)
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