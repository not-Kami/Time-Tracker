import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AuthPage } from './components/Auth/AuthPage';
import { Layout } from './components/Layout';
import { Sidebar } from './components/Sidebar';
import { CategoryCard } from './components/CategoryCard';
import { ProjectCard } from './components/ProjectCard';
import { ProjectDetail } from './components/ProjectDetail';
import { ProfilePage } from './components/ProfilePage';
import { CreateProjectModal } from './components/CreateProjectModal';
import { CreateCategoryModal } from './components/CreateCategoryModal';
import { SettingsModal } from './components/SettingsModal';
import { TimerToast } from './components/TimerToast';
import { CategoryNotesModal } from './components/CategoryNotesModal';
import { GamificationPanel } from './components/GamificationPanel';
import { UpcomingTasks } from './components/UpcomingTasks';
import { OnboardingForm, OnboardingData } from './components/Auth/OnboardingForm';
import { OnboardingGuide } from './components/OnboardingGuide';
import { AdminPanel } from './components/Admin/AdminPanel';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useTimer } from './hooks/useTimer';
import { usePomodoro } from './hooks/usePomodoro';
import { useSoundNotifications } from './hooks/useSoundNotifications';
import { useLanguage } from './contexts/LanguageContext';
import { Project, Category, Session, Note } from './types';
import { generateId, getAchievementLevel, formatHours } from './utils/helpers';

type View = 'dashboard' | 'project' | 'category' | 'profile';

function AppContent({ showGuide = false }: { showGuide?: boolean }) {
  const { data, saveData, exportData, resetData, isLoaded } = useLocalStorage();
  const { timerState, startTimer, pauseTimer, resumeTimer, stopTimer } = useTimer();
  const { playSound, isSoundEnabled, toggleSound } = useSoundNotifications();
  const { t } = useLanguage();
  
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeTimerProjectId, setActiveTimerProjectId] = useState<string | null>(null);
  const [isCreateProjectModalOpen, setIsCreateProjectModalOpen] = useState(false);
  const [isCreateCategoryModalOpen, setIsCreateCategoryModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isCategoryNotesModalOpen, setIsCategoryNotesModalOpen] = useState(false);
  const [selectedCategoryForNotes, setSelectedCategoryForNotes] = useState<Category | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [showingPinned, setShowingPinned] = useState(false);
  const [showingArchived, setShowingArchived] = useState(false);
  const [previousAchievementLevel, setPreviousAchievementLevel] = useState<string>('');
  const [showAdminPanel, setShowAdminPanel] = useState(false);

  const handleShowAdmin = useCallback(() => {
    console.log('handleShowAdmin called, setting showAdminPanel to true');
    setShowAdminPanel(true);
    // Force a re-render by updating a different state
    setCurrentView(currentView);
  }, [currentView]);

  // Debug: Log when showAdminPanel changes
  useEffect(() => {
    console.log('showAdminPanel changed to:', showAdminPanel);
  }, [showAdminPanel]);

  const activeProject = activeTimerProjectId ? data.projects.find(p => p.id === activeTimerProjectId) : null;
  const { pomodoroMode, isBreak, pomodoroTimeLeft, togglePomodoro, forceResume } = usePomodoro(activeProject, {
    onPause: pauseTimer,
    onResume: resumeTimer,
    onForceResume: resumeTimer,
  });

  // Check for achievement level changes
  useEffect(() => {
    if (activeProject && isSoundEnabled) {
      const currentLevel = getAchievementLevel(activeProject.totalTime + timerState.elapsedTime).level;
      if (previousAchievementLevel && currentLevel !== previousAchievementLevel) {
        playSound('achievement-unlocked');
      }
      setPreviousAchievementLevel(currentLevel);
    }
  }, [activeProject, timerState.elapsedTime, previousAchievementLevel, playSound, isSoundEnabled]);

  // Save timer state to project when stopping
  useEffect(() => {
    if (timerState.status === 'idle' && activeTimerProjectId) {
      setActiveTimerProjectId(null);
    }
  }, [timerState.status, activeTimerProjectId]);

  // Pomodoro completion notifications
  useEffect(() => {
    if (pomodoroMode && pomodoroTimeLeft <= 0 && isSoundEnabled) {
      if (isBreak) {
        playSound('break-complete');
      } else {
        playSound('pomodoro-complete');
      }
    }
  }, [pomodoroMode, pomodoroTimeLeft, isBreak, playSound, isSoundEnabled]);

  const getFilteredProjects = (): Project[] => {
    let filteredProjects = data.projects;
    
    // Filter by archive status
    if (showingArchived) {
      filteredProjects = filteredProjects.filter(project => project.isArchived);
    } else {
      filteredProjects = filteredProjects.filter(project => !project.isArchived);
    }
    
    // Filter by pin status
    if (showingPinned) {
      filteredProjects = filteredProjects.filter(project => project.isPinned);
    }
    
    // Filter by category
    if (selectedCategoryId) {
      filteredProjects = filteredProjects.filter(project => project.categoryId === selectedCategoryId);
    }
    
    return filteredProjects;
  };

  const getProjectsByCategory = (categoryId: string): Project[] => {
    return data.projects.filter(project => project.categoryId === categoryId);
  };

  const findCategoryById = (categoryId: string): Category | undefined => {
    return data.categories.find(cat => cat.id === categoryId);
  };

  const findProjectById = (projectId: string): Project | undefined => {
    return data.projects.find(proj => proj.id === projectId);
  };

  const handleCreateProject = (
    name: string, 
    categoryId: string, 
    description?: string,
    pomodoroEnabled?: boolean,
    focusTime?: number,
    breakTime?: number
  ) => {
    const newProject: Project = {
      id: generateId(),
      name,
      categoryId,
      description,
      totalTime: 0,
      tasks: [],
      sessions: [],
      notes: [],
      isPinned: false,
      isArchived: false,
      pomodoroSettings: {
        enabled: pomodoroEnabled || false,
        focusTime: focusTime || 25,
        breakTime: breakTime || 5,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const updatedData = {
      ...data,
      projects: [...data.projects, newProject],
    };

    saveData(updatedData);
  };

  const handleCreateCategory = (name: string, color: string, icon: string) => {
    const newCategory: Category = {
      id: generateId(),
      name,
      color,
      icon,
      createdAt: new Date(),
      notes: [],
    };

    const updatedData = {
      ...data,
      categories: [...data.categories, newCategory],
    };

    saveData(updatedData);
  };

  const handleUpdateProject = (updatedProject: Project) => {
    const updatedProjects = data.projects.map(project =>
      project.id === updatedProject.id ? updatedProject : project
    );

    const updatedData = {
      ...data,
      projects: updatedProjects,
    };

    saveData(updatedData);
    setSelectedProject(updatedProject);
  };

  const handleTogglePin = (projectId: string) => {
    const project = findProjectById(projectId);
    if (!project) return;

    const updatedProject = {
      ...project,
      isPinned: !project.isPinned,
      updatedAt: new Date(),
    };

    handleUpdateProject(updatedProject);
  };

  const handleToggleArchive = (projectId: string) => {
    const project = findProjectById(projectId);
    if (!project) return;

    const updatedProject = {
      ...project,
      isArchived: !project.isArchived,
      updatedAt: new Date(),
    };

    handleUpdateProject(updatedProject);
  };

  const handleStartTimer = (projectId: string) => {
    setActiveTimerProjectId(projectId);
    startTimer();
  };

  const handleStopTimer = (projectId: string) => {
    const session = stopTimer();
    if (session) {
      const project = data.projects.find(p => p.id === projectId);
      if (project) {
        const enhancedSession: Session = {
          ...session,
          pomodoroSession: pomodoroMode,
          isBreak: isBreak,
        };

        const updatedProject = {
          ...project,
          totalTime: project.totalTime + session.duration,
          sessions: [...project.sessions, enhancedSession],
          updatedAt: new Date(),
        };
        handleUpdateProject(updatedProject);

        // Check for goal achievements
        if (isSoundEnabled) {
          const newLevel = getAchievementLevel(updatedProject.totalTime);
          const oldLevel = getAchievementLevel(project.totalTime);
          if (newLevel.level !== oldLevel.level) {
            playSound('goal-reached');
          }
        }
      }
    }
    setActiveTimerProjectId(null);
  };

  const handleTaskToggle = (projectId: string, taskId: string) => {
    const project = findProjectById(projectId);
    if (!project) return;

    const task = project.tasks.find(t => t.id === taskId);
    if (task && !task.completed && isSoundEnabled) {
      playSound('task-completed');
    }
  };

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
    setCurrentView('project');
  };

  const handleAddProject = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    setIsCreateProjectModalOpen(true);
  };

  const handleSelectCategory = (categoryId: string | null) => {
    setSelectedCategoryId(categoryId);
    setShowingPinned(false);
    setCurrentView('category');
  };

  const handleShowPinned = () => {
    setShowingPinned(true);
    setShowingArchived(false);
    setSelectedCategoryId(null);
    setCurrentView('category');
  };

  const handleShowArchived = () => {
    setShowingArchived(true);
    setShowingPinned(false);
    setSelectedCategoryId(null);
    setCurrentView('category');
  };

  const handleShowDashboard = () => {
    setShowingPinned(false);
    setSelectedCategoryId(null);
    setCurrentView('dashboard');
  };

  const handleShowProfile = () => {
    setCurrentView('profile');
  };

  const handleOpenCategoryNotes = (category: Category) => {
    setSelectedCategoryForNotes(category);
    setIsCategoryNotesModalOpen(true);
  };

  const handleUpdateCategoryNotes = (notes: Note[]) => {
    if (!selectedCategoryForNotes) return;

    const updatedCategories = data.categories.map(cat =>
      cat.id === selectedCategoryForNotes.id
        ? { ...cat, notes }
        : cat
    );

    const updatedData = {
      ...data,
      categories: updatedCategories,
    };

    saveData(updatedData);
  };

  const handleTaskClick = (project: Project) => {
    setSelectedProject(project);
    setCurrentView('project');
  };

  if (!isLoaded) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-64">
          <div className="text-gray-500 dark:text-gray-400">{t('common.loading')}</div>
        </div>
      </Layout>
    );
  }

  const activeCategory = activeProject ? findCategoryById(activeProject.categoryId) : null;

  if (currentView === 'project' && selectedProject) {
    const category = findCategoryById(selectedProject.categoryId);
    if (!category) return null;

    const isActiveTimer = activeTimerProjectId === selectedProject.id;

    return (
      <Layout
        sidebar={
          <Sidebar
            categories={data.categories}
            projects={data.projects}
            selectedCategoryId={selectedCategoryId}
            onSelectCategory={handleSelectCategory}
            onShowPinned={handleShowPinned}
            onShowArchived={handleShowArchived}
            onShowDashboard={handleShowDashboard}
            onShowProfile={handleShowProfile}
            showingPinned={showingPinned}
            showingArchived={showingArchived}
            currentView={currentView}
            onCreateCategory={() => setIsCreateCategoryModalOpen(true)}
            onOpenSettings={() => setIsSettingsModalOpen(true)}
            onShowAdmin={handleShowAdmin}
          />
        }
      >
        <ProjectDetail
          project={selectedProject}
          category={category}
          timerState={isActiveTimer ? timerState : { status: 'idle', currentSession: null, elapsedTime: 0 }}
          onBack={() => {
            setCurrentView(selectedCategoryId ? 'category' : 'dashboard');
            setSelectedProject(null);
          }}
          onUpdateProject={handleUpdateProject}
          onStartTimer={() => handleStartTimer(selectedProject.id)}
          onPauseTimer={pauseTimer}
          onResumeTimer={resumeTimer}
          onStopTimer={() => handleStopTimer(selectedProject.id)}
          onTaskToggle={(taskId) => handleTaskToggle(selectedProject.id, taskId)}
        />
        
        {activeProject && activeCategory && (
          <TimerToast
            project={activeProject}
            category={activeCategory}
            timerState={timerState}
            onPause={pauseTimer}
            onResume={resumeTimer}
            onStop={() => handleStopTimer(activeProject.id)}
            pomodoroMode={pomodoroMode}
            pomodoroTimeLeft={pomodoroTimeLeft}
            isBreak={isBreak}
            onTogglePomodoro={togglePomodoro}
            onForceResume={forceResume}
          />
        )}
      </Layout>
    );
  }

  if (currentView === 'profile') {
    return (
      <Layout
        sidebar={
          <Sidebar
            categories={data.categories}
            projects={data.projects}
            selectedCategoryId={selectedCategoryId}
            onSelectCategory={handleSelectCategory}
            onShowPinned={handleShowPinned}
            onShowArchived={handleShowArchived}
            onShowDashboard={handleShowDashboard}
            onShowProfile={handleShowProfile}
            showingPinned={showingPinned}
            showingArchived={showingArchived}
            currentView={currentView}
            onCreateCategory={() => setIsCreateCategoryModalOpen(true)}
            onOpenSettings={() => setIsSettingsModalOpen(true)}
            onShowAdmin={handleShowAdmin}
          />
        }
      >
        <ProfilePage
          projects={data.projects}
          onBack={handleShowDashboard}
          onExport={exportData}
          isSoundEnabled={isSoundEnabled}
          onToggleSound={toggleSound}
        />

        {activeProject && activeCategory && (
          <TimerToast
            project={activeProject}
            category={activeCategory}
            timerState={timerState}
            onPause={pauseTimer}
            onResume={resumeTimer}
            onStop={() => handleStopTimer(activeProject.id)}
            pomodoroMode={pomodoroMode}
            pomodoroTimeLeft={pomodoroTimeLeft}
            isBreak={isBreak}
            onTogglePomodoro={togglePomodoro}
          />
        )}
      </Layout>
    );
  }

  // Dashboard View
  if (currentView === 'dashboard') {
    const totalTime = data.projects.reduce((sum, project) => sum + project.totalTime, 0);
    const totalTasks = data.projects.reduce((sum, project) => sum + project.tasks.length, 0);
    const completedTasks = data.projects.reduce((sum, project) => 
      sum + project.tasks.filter(task => task.completed).length, 0
    );

    return (
      <Layout
        sidebar={
          <Sidebar
            categories={data.categories}
            projects={data.projects}
            selectedCategoryId={selectedCategoryId}
            onSelectCategory={handleSelectCategory}
            onShowPinned={handleShowPinned}
            onShowArchived={handleShowArchived}
            onShowDashboard={handleShowDashboard}
            onShowProfile={handleShowProfile}
            showingPinned={showingPinned}
            showingArchived={showingArchived}
            currentView={currentView}
            onCreateCategory={() => setIsCreateCategoryModalOpen(true)}
            onOpenSettings={() => setIsSettingsModalOpen(true)}
            onShowAdmin={handleShowAdmin}
          />
        }
      >
        <div className="space-y-8">
          {/* Dashboard Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                  {formatHours(totalTime)}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{t('dashboard.totalTime')}</div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                  {data.projects.length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{t('dashboard.activeProjects')}</div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                  {completedTasks}/{totalTasks}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{t('dashboard.tasksCompleted')}</div>
              </div>
            </div>
          </div>

          {/* Upcoming Tasks */}
          <UpcomingTasks 
            projects={data.projects} 
            categories={data.categories}
            onTaskClick={handleTaskClick}
          />

          {/* Categories Section */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('nav.categories')}</h2>
              <button
                onClick={() => setIsCreateCategoryModalOpen(true)}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg shadow-purple-500/25"
              >
                <Plus className="w-5 h-5 mr-2" />
                {t('dashboard.newCategory')}
              </button>
            </div>

            {data.categories.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.categories.map((category) => {
                  const projects = getProjectsByCategory(category.id);
                  return (
                    <CategoryCard
                      key={category.id}
                      category={category}
                      projects={projects}
                      onAddProject={handleAddProject}
                      onClick={() => handleSelectCategory(category.id)}
                    />
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-500 dark:text-gray-400 mb-4">
                  {t('dashboard.noCategories')}
                </div>
                <button
                  onClick={() => setIsCreateCategoryModalOpen(true)}
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg shadow-purple-500/25"
                >
                  <Plus className="w-6 h-6 mr-2" />
                  {t('dashboard.createFirstCategory')}
                </button>
              </div>
            )}
          </div>

          {/* Achievement Panel at Bottom */}
          <GamificationPanel projects={data.projects} />
        </div>

        <CreateProjectModal
          categories={data.categories}
          selectedCategoryId={selectedCategoryId || undefined}
          isOpen={isCreateProjectModalOpen}
          onClose={() => {
            setIsCreateProjectModalOpen(false);
            setSelectedCategoryId(null);
          }}
          onCreateProject={handleCreateProject}
        />

        <CreateCategoryModal
          isOpen={isCreateCategoryModalOpen}
          onClose={() => setIsCreateCategoryModalOpen(false)}
          onCreateCategory={handleCreateCategory}
        />

        <SettingsModal
          isOpen={isSettingsModalOpen}
          onClose={() => setIsSettingsModalOpen(false)}
          onExport={exportData}
          onResetData={resetData}
          isSoundEnabled={isSoundEnabled}
          onToggleSound={toggleSound}
          projects={data.projects}
        />

        {selectedCategoryForNotes && (
          <CategoryNotesModal
            isOpen={isCategoryNotesModalOpen}
            onClose={() => {
              setIsCategoryNotesModalOpen(false);
              setSelectedCategoryForNotes(null);
            }}
            category={selectedCategoryForNotes}
            notes={selectedCategoryForNotes.notes || []}
            onUpdateNotes={handleUpdateCategoryNotes}
          />
        )}

        {activeProject && activeCategory && (
          <TimerToast
            project={activeProject}
            category={activeCategory}
            timerState={timerState}
            onPause={pauseTimer}
            onResume={resumeTimer}
            onStop={() => handleStopTimer(activeProject.id)}
            pomodoroMode={pomodoroMode}
            pomodoroTimeLeft={pomodoroTimeLeft}
            isBreak={isBreak}
            onTogglePomodoro={togglePomodoro}
          />
        )}
      </Layout>
    );
  }

  // Category/Projects View
  const filteredProjects = getFilteredProjects();
  const currentTitle = showingPinned 
    ? t('projects.pinned')
    : selectedCategoryId 
      ? findCategoryById(selectedCategoryId)?.name || t('projects.new')
      : t('projects.new');

  // Show guide after onboarding
  if (showGuide) {
    return (
      <OnboardingGuide
        onComplete={() => {
          localStorage.removeItem('showGuide');
          window.location.reload();
        }}
        onCreateCategory={handleCreateCategory}
        onAddSkill={(categoryId, skillName) => {
          // TODO: Implement skill creation
          console.log('Adding skill:', skillName, 'to category:', categoryId);
        }}
        selectedSkills={[]} // TODO: Get from userProfile
      />
    );
  }

  // Show admin panel if requested
  console.log('AppContent render - showAdminPanel:', showAdminPanel);
  if (showAdminPanel) {
    console.log('Rendering AdminPanel, showAdminPanel:', showAdminPanel);
    return <AdminPanel onBack={() => setShowAdminPanel(false)} />;
  }

  return (
    <Layout
      sidebar={
        (() => {
                  console.log('Rendering Sidebar with handleShowAdmin:', typeof handleShowAdmin);
        return (
          <Sidebar
            categories={data.categories}
            projects={data.projects}
            selectedCategoryId={selectedCategoryId}
            onSelectCategory={handleSelectCategory}
            onShowPinned={handleShowPinned}
            onShowArchived={handleShowArchived}
            onShowDashboard={handleShowDashboard}
            onShowProfile={handleShowProfile}
            showingPinned={showingPinned}
            showingArchived={showingArchived}
            currentView={currentView}
            onCreateCategory={() => setIsCreateCategoryModalOpen(true)}
            onOpenSettings={() => setIsSettingsModalOpen(true)}
            onShowAdmin={handleShowAdmin}
          />
        );
        })()
      }
    >
      <div className="space-y-8">
        {/* Projects Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{currentTitle}</h2>
            <button
              onClick={() => setIsCreateProjectModalOpen(true)}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl hover:from-green-700 hover:to-blue-700 font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg shadow-green-500/25"
            >
              <Plus className="w-5 h-5 mr-2" />
              {t('projects.new')}
            </button>
          </div>

          {filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => {
                const category = findCategoryById(project.categoryId);
                if (!category) return null;

                const isActiveTimer = activeTimerProjectId === project.id;

                return (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    category={category}
                    timerState={isActiveTimer ? timerState : { status: 'idle', currentSession: null, elapsedTime: 0 }}
                    onStartTimer={() => handleStartTimer(project.id)}
                    onPauseTimer={pauseTimer}
                    onResumeTimer={resumeTimer}
                    onStopTimer={() => handleStopTimer(project.id)}
                    onTogglePin={handleTogglePin}
                    onClick={() => handleProjectClick(project)}
                    showCategory={!selectedCategoryId && !showingPinned}
                  />
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-500 dark:text-gray-400 mb-4">
                {showingPinned 
                  ? t('projects.noPinned')
                  : selectedCategoryId 
                    ? t('projects.noProjects')
                    : t('projects.noProjects')
                }
              </div>
              <button
                onClick={() => setIsCreateProjectModalOpen(true)}
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg shadow-blue-500/25"
              >
                <Plus className="w-6 h-6 mr-2" />
                {t('projects.createFirst')}
              </button>
            </div>
          )}
        </div>
      </div>

      <CreateProjectModal
        categories={data.categories}
        selectedCategoryId={selectedCategoryId || undefined}
        isOpen={isCreateProjectModalOpen}
        onClose={() => {
          setIsCreateProjectModalOpen(false);
          setSelectedCategoryId(null);
        }}
        onCreateProject={handleCreateProject}
      />

      <CreateCategoryModal
        isOpen={isCreateCategoryModalOpen}
        onClose={() => setIsCreateCategoryModalOpen(false)}
        onCreateCategory={handleCreateCategory}
      />

      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        onExport={exportData}
        onResetData={resetData}
        isSoundEnabled={isSoundEnabled}
        onToggleSound={toggleSound}
        projects={data.projects}
      />

      {selectedCategoryForNotes && (
        <CategoryNotesModal
          isOpen={isCategoryNotesModalOpen}
          onClose={() => {
            setIsCategoryNotesModalOpen(false);
            setSelectedCategoryForNotes(null);
          }}
          category={selectedCategoryForNotes}
          notes={selectedCategoryForNotes.notes || []}
          onUpdateNotes={handleUpdateCategoryNotes}
        />
      )}

      {activeProject && activeCategory && (
        <TimerToast
          project={activeProject}
          category={activeCategory}
          timerState={timerState}
          onPause={pauseTimer}
          onResume={resumeTimer}
          onStop={() => handleStopTimer(activeProject.id)}
          pomodoroMode={pomodoroMode}
          pomodoroTimeLeft={pomodoroTimeLeft}
          isBreak={isBreak}
          onTogglePomodoro={togglePomodoro}
        />
      )}
    </Layout>
  );
}

function AuthenticatedApp() {
  const { user, userProfile, loading, completeOnboarding } = useAuth();
  const [onboardingLoading, setOnboardingLoading] = useState(false);

  const handleOnboardingComplete = async (onboardingData: OnboardingData) => {
    setOnboardingLoading(true);
    
    try {
      await completeOnboarding({
        nickname: onboardingData.nickname,
        preferredLanguage: onboardingData.preferredLanguage,
        selectedSkills: onboardingData.selectedSkills || [],
        timezone: onboardingData.timezone,
        dailyGoal: onboardingData.dailyGoal,
      });
      
      // Update user's preferred language
      if (onboardingData.preferredLanguage) {
        localStorage.setItem('language', onboardingData.preferredLanguage);
      }
    } catch (error) {
      console.error('Error saving onboarding data:', error);
    } finally {
      setOnboardingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

    // Show onboarding for new users
  const isNewUser = localStorage.getItem('newUser') === 'true';
  const showGuide = localStorage.getItem('showGuide') === 'true';
  
  if (user && (isNewUser || (userProfile && !userProfile.hasCompletedOnboarding))) {
    return (
      <OnboardingForm
        onComplete={handleOnboardingComplete}
        loading={onboardingLoading}
      />
    );
  }

  return <AppContent showGuide={showGuide} />;
}

function App() {
  return (
    <Router>
      <ThemeProvider>
        <LanguageProvider>
          <AuthProvider>
            <Routes>
              <Route path="/admin" element={<AdminRoute />} />
              <Route path="*" element={<AuthenticatedApp />} />
            </Routes>
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </Router>
  );
}

function AdminRoute() {
  const { user, userProfile } = useAuth();
  
  if (!user) {
    return <Navigate to="/" replace />;
  }
  
  if (userProfile?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }
  
  return <AdminPanel onBack={() => window.history.back()} />;
}

export default App;