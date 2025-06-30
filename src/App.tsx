import React, { useState, useEffect } from 'react';
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
import { CreateSkillModal } from './components/CreateSkillModal';
import { CreateCategoryModal } from './components/CreateCategoryModal';
import { SettingsModal } from './components/SettingsModal';
import { TimerToast } from './components/TimerToast';
import { CategoryNotesModal } from './components/CategoryNotesModal';
import { GamificationPanel } from './components/GamificationPanel';
import { UpcomingTasks } from './components/UpcomingTasks';
import { useSupabaseData } from './hooks/useSupabaseData';
import { useTimer } from './hooks/useTimer';
import { usePomodoro } from './hooks/usePomodoro';
import { useSoundNotifications } from './hooks/useSoundNotifications';
import { useLanguage } from './contexts/LanguageContext';
import { Skill, Category, Session, Note } from './types';
import { getAchievementLevel, formatHours } from './utils/helpers';

type View = 'dashboard' | 'skill' | 'category' | 'profile';

function AppContent() {
  const { 
    skills, 
    categories, 
    userProfile, 
    userSettings, 
    achievements,
    loading, 
    error,
    createCategory,
    createSkill,
    updateSkill,
    updateUserSettings,
    refetch
  } = useSupabaseData();
  
  const { timerState, startTimer, pauseTimer, resumeTimer, stopTimer } = useTimer();
  const { playSound, isSoundEnabled, toggleSound } = useSoundNotifications();
  const { t } = useLanguage();
  
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [activeTimerSkillId, setActiveTimerSkillId] = useState<string | null>(null);
  const [isCreateSkillModalOpen, setIsCreateSkillModalOpen] = useState(false);
  const [isCreateCategoryModalOpen, setIsCreateCategoryModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isCategoryNotesModalOpen, setIsCategoryNotesModalOpen] = useState(false);
  const [selectedCategoryForNotes, setSelectedCategoryForNotes] = useState<Category | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [showingPinned, setShowingPinned] = useState(false);
  const [previousAchievementLevel, setPreviousAchievementLevel] = useState<string>('');

  const activeSkill = activeTimerSkillId ? skills.find(s => s.id === activeTimerSkillId) : null;
  const { pomodoroMode, isBreak, pomodoroTimeLeft, togglePomodoro } = usePomodoro(activeSkill);

  // Check for achievement level changes
  useEffect(() => {
    if (activeSkill && isSoundEnabled) {
      const currentLevel = getAchievementLevel(activeSkill.total_time + timerState.elapsedTime).level;
      if (previousAchievementLevel && currentLevel !== previousAchievementLevel) {
        playSound('achievement-unlocked');
      }
      setPreviousAchievementLevel(currentLevel);
    }
  }, [activeSkill, timerState.elapsedTime, previousAchievementLevel, playSound, isSoundEnabled]);

  // Save timer state to skill when stopping
  useEffect(() => {
    if (timerState.status === 'idle' && activeTimerSkillId) {
      setActiveTimerSkillId(null);
    }
  }, [timerState.status, activeTimerSkillId]);

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

  const getFilteredSkills = (): Skill[] => {
    if (showingPinned) {
      return skills.filter(skill => skill.is_pinned);
    }
    if (selectedCategoryId) {
      return skills.filter(skill => skill.category_id === selectedCategoryId);
    }
    return skills;
  };

  const getSkillsByCategory = (categoryId: string): Skill[] => {
    return skills.filter(skill => skill.category_id === categoryId);
  };

  const findCategoryById = (categoryId: string): Category | undefined => {
    return categories.find(cat => cat.id === categoryId);
  };

  const findSkillById = (skillId: string): Skill | undefined => {
    return skills.find(skill => skill.id === skillId);
  };

  const handleCreateSkill = async (
    name: string, 
    categoryId: string, 
    description?: string,
    difficulty?: 'beginner' | 'intermediate' | 'advanced' | 'expert',
    targetHours?: number,
    pomodoroEnabled?: boolean,
    focusTime?: number,
    breakTime?: number
  ) => {
    const skillData = {
      name,
      category_id: categoryId,
      description,
      difficulty: difficulty || 'beginner',
      status: 'active' as const,
      target_hours: targetHours ? targetHours * 60 * 60 * 1000 : 0,
      total_time: 0,
      is_pinned: false,
      pomodoro_settings: {
        enabled: pomodoroEnabled || false,
        focusTime: focusTime || 25,
        breakTime: breakTime || 5,
      },
    };

    await createSkill(skillData);
  };

  const handleCreateCategory = async (name: string, color: string, icon: string, description?: string) => {
    const categoryData = {
      name,
      color,
      icon,
      description,
    };

    await createCategory(categoryData);
  };

  const handleUpdateSkill = async (updatedSkill: Skill) => {
    await updateSkill(updatedSkill.id, updatedSkill);
    setSelectedSkill(updatedSkill);
  };

  const handleTogglePin = async (skillId: string) => {
    const skill = findSkillById(skillId);
    if (!skill) return;

    await updateSkill(skillId, {
      is_pinned: !skill.is_pinned,
    });
  };

  const handleStartTimer = (skillId: string) => {
    setActiveTimerSkillId(skillId);
    startTimer();
  };

  const handleStopTimer = async (skillId: string) => {
    const session = stopTimer();
    if (session) {
      const skill = skills.find(s => s.id === skillId);
      if (skill) {
        const enhancedSession: Session = {
          ...session,
          pomodoro_session: pomodoroMode,
          is_break: isBreak,
        };

        // Update skill with new session and total time
        await updateSkill(skillId, {
          total_time: skill.total_time + session.duration,
          sessions: [...skill.sessions, enhancedSession],
        });

        // Check for goal achievements
        if (isSoundEnabled) {
          const newLevel = getAchievementLevel(skill.total_time + session.duration);
          const oldLevel = getAchievementLevel(skill.total_time);
          if (newLevel.level !== oldLevel.level) {
            playSound('goal-reached');
          }
        }
      }
    }
    setActiveTimerSkillId(null);
  };

  const handleTaskToggle = (skillId: string, taskId: string) => {
    const skill = findSkillById(skillId);
    if (!skill) return;

    const task = skill.tasks.find(t => t.id === taskId);
    if (task && !task.completed && isSoundEnabled) {
      playSound('task-completed');
    }
  };

  const handleSkillClick = (skill: Skill) => {
    setSelectedSkill(skill);
    setCurrentView('skill');
  };

  const handleAddSkill = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    setIsCreateSkillModalOpen(true);
  };

  const handleSelectCategory = (categoryId: string | null) => {
    setSelectedCategoryId(categoryId);
    setShowingPinned(false);
    setCurrentView('category');
  };

  const handleShowPinned = () => {
    setShowingPinned(true);
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
    // TODO: Implement category notes update in Supabase
  };

  const handleTaskClick = (skill: Skill) => {
    setSelectedSkill(skill);
    setCurrentView('skill');
  };

  const exportData = () => {
    const data = {
      skills,
      categories,
      userProfile,
      userSettings,
      achievements,
      exportedAt: new Date().toISOString(),
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `timexp-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-64">
          <div className="text-gray-500 dark:text-gray-400">{t('common.loading')}</div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-64">
          <div className="text-red-500 dark:text-red-400">Error: {error}</div>
        </div>
      </Layout>
    );
  }

  const activeCategory = activeSkill ? findCategoryById(activeSkill.category_id) : null;

  if (currentView === 'skill' && selectedSkill) {
    const category = findCategoryById(selectedSkill.category_id);
    if (!category) return null;

    const isActiveTimer = activeTimerSkillId === selectedSkill.id;

    return (
      <Layout
        sidebar={
          <Sidebar
            categories={categories}
            skills={skills}
            selectedCategoryId={selectedCategoryId}
            onSelectCategory={handleSelectCategory}
            onShowPinned={handleShowPinned}
            onShowDashboard={handleShowDashboard}
            onShowProfile={handleShowProfile}
            showingPinned={showingPinned}
            currentView={currentView}
            onCreateCategory={() => setIsCreateCategoryModalOpen(true)}
            onOpenSettings={() => setIsSettingsModalOpen(true)}
          />
        }
      >
        <ProjectDetail
          skill={selectedSkill}
          category={category}
          timerState={isActiveTimer ? timerState : { status: 'idle', currentSession: null, elapsedTime: 0 }}
          onBack={() => {
            setCurrentView(selectedCategoryId ? 'category' : 'dashboard');
            setSelectedSkill(null);
          }}
          onUpdateSkill={handleUpdateSkill}
          onStartTimer={() => handleStartTimer(selectedSkill.id)}
          onPauseTimer={pauseTimer}
          onResumeTimer={resumeTimer}
          onStopTimer={() => handleStopTimer(selectedSkill.id)}
          onTaskToggle={(taskId) => handleTaskToggle(selectedSkill.id, taskId)}
        />
        
        {activeSkill && activeCategory && (
          <TimerToast
            skill={activeSkill}
            category={activeCategory}
            timerState={timerState}
            onPause={pauseTimer}
            onResume={resumeTimer}
            onStop={() => handleStopTimer(activeSkill.id)}
            pomodoroMode={pomodoroMode}
            pomodoroTimeLeft={pomodoroTimeLeft}
            isBreak={isBreak}
            onTogglePomodoro={togglePomodoro}
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
            categories={categories}
            skills={skills}
            selectedCategoryId={selectedCategoryId}
            onSelectCategory={handleSelectCategory}
            onShowPinned={handleShowPinned}
            onShowDashboard={handleShowDashboard}
            onShowProfile={handleShowProfile}
            showingPinned={showingPinned}
            currentView={currentView}
            onCreateCategory={() => setIsCreateCategoryModalOpen(true)}
            onOpenSettings={() => setIsSettingsModalOpen(true)}
          />
        }
      >
        <ProfilePage
          skills={skills}
          userProfile={userProfile}
          onBack={handleShowDashboard}
          onExport={exportData}
          isSoundEnabled={isSoundEnabled}
          onToggleSound={toggleSound}
        />

        {activeSkill && activeCategory && (
          <TimerToast
            skill={activeSkill}
            category={activeCategory}
            timerState={timerState}
            onPause={pauseTimer}
            onResume={resumeTimer}
            onStop={() => handleStopTimer(activeSkill.id)}
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
    const totalTime = skills.reduce((sum, skill) => sum + skill.total_time, 0);
    const totalTasks = skills.reduce((sum, skill) => sum + skill.tasks.length, 0);
    const completedTasks = skills.reduce((sum, skill) => 
      sum + skill.tasks.filter(task => task.completed).length, 0
    );

    return (
      <Layout
        sidebar={
          <Sidebar
            categories={categories}
            skills={skills}
            selectedCategoryId={selectedCategoryId}
            onSelectCategory={handleSelectCategory}
            onShowPinned={handleShowPinned}
            onShowDashboard={handleShowDashboard}
            onShowProfile={handleShowProfile}
            showingPinned={showingPinned}
            currentView={currentView}
            onCreateCategory={() => setIsCreateCategoryModalOpen(true)}
            onOpenSettings={() => setIsSettingsModalOpen(true)}
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
                  {skills.length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{t('dashboard.activeSkills')}</div>
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
            skills={skills} 
            categories={categories}
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

            {categories.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((category) => {
                  const categorySkills = getSkillsByCategory(category.id);
                  return (
                    <CategoryCard
                      key={category.id}
                      category={category}
                      skills={categorySkills}
                      onAddSkill={handleAddSkill}
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
          <GamificationPanel skills={skills} />
        </div>

        <CreateSkillModal
          categories={categories}
          selectedCategoryId={selectedCategoryId || undefined}
          isOpen={isCreateSkillModalOpen}
          onClose={() => {
            setIsCreateSkillModalOpen(false);
            setSelectedCategoryId(null);
          }}
          onCreateSkill={handleCreateSkill}
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
          isSoundEnabled={isSoundEnabled}
          onToggleSound={toggleSound}
          skills={skills}
          userProfile={userProfile}
          userSettings={userSettings}
          onUpdateSettings={updateUserSettings}
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

        {activeSkill && activeCategory && (
          <TimerToast
            skill={activeSkill}
            category={activeCategory}
            timerState={timerState}
            onPause={pauseTimer}
            onResume={resumeTimer}
            onStop={() => handleStopTimer(activeSkill.id)}
            pomodoroMode={pomodoroMode}
            pomodoroTimeLeft={pomodoroTimeLeft}
            isBreak={isBreak}
            onTogglePomodoro={togglePomodoro}
          />
        )}
      </Layout>
    );
  }

  // Category/Skills View
  const filteredSkills = getFilteredSkills();
  const currentTitle = showingPinned 
    ? t('skills.pinned')
    : selectedCategoryId 
      ? findCategoryById(selectedCategoryId)?.name || t('skills.new')
      : t('skills.new');

  return (
    <Layout
      sidebar={
        <Sidebar
          categories={categories}
          skills={skills}
          selectedCategoryId={selectedCategoryId}
          onSelectCategory={handleSelectCategory}
          onShowPinned={handleShowPinned}
          onShowDashboard={handleShowDashboard}
          onShowProfile={handleShowProfile}
          showingPinned={showingPinned}
          currentView={currentView}
          onCreateCategory={() => setIsCreateCategoryModalOpen(true)}
          onOpenSettings={() => setIsSettingsModalOpen(true)}
        />
      }
    >
      <div className="space-y-8">
        {/* Skills Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{currentTitle}</h2>
            <button
              onClick={() => setIsCreateSkillModalOpen(true)}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl hover:from-green-700 hover:to-blue-700 font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg shadow-green-500/25"
            >
              <Plus className="w-5 h-5 mr-2" />
              {t('skills.new')}
            </button>
          </div>

          {filteredSkills.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSkills.map((skill) => {
                const category = findCategoryById(skill.category_id);
                if (!category) return null;

                const isActiveTimer = activeTimerSkillId === skill.id;

                return (
                  <ProjectCard
                    key={skill.id}
                    skill={skill}
                    category={category}
                    timerState={isActiveTimer ? timerState : { status: 'idle', currentSession: null, elapsedTime: 0 }}
                    onStartTimer={() => handleStartTimer(skill.id)}
                    onPauseTimer={pauseTimer}
                    onResumeTimer={resumeTimer}
                    onStopTimer={() => handleStopTimer(skill.id)}
                    onTogglePin={handleTogglePin}
                    onClick={() => handleSkillClick(skill)}
                    showCategory={!selectedCategoryId && !showingPinned}
                  />
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-500 dark:text-gray-400 mb-4">
                {showingPinned 
                  ? t('skills.noPinned')
                  : selectedCategoryId 
                    ? t('skills.noSkills')
                    : t('skills.noSkills')
                }
              </div>
              <button
                onClick={() => setIsCreateSkillModalOpen(true)}
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg shadow-blue-500/25"
              >
                <Plus className="w-6 h-6 mr-2" />
                {t('skills.createFirst')}
              </button>
            </div>
          )}
        </div>
      </div>

      <CreateSkillModal
        categories={categories}
        selectedCategoryId={selectedCategoryId || undefined}
        isOpen={isCreateSkillModalOpen}
        onClose={() => {
          setIsCreateSkillModalOpen(false);
          setSelectedCategoryId(null);
        }}
        onCreateSkill={handleCreateSkill}
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
        isSoundEnabled={isSoundEnabled}
        onToggleSound={toggleSound}
        skills={skills}
        userProfile={userProfile}
        userSettings={userSettings}
        onUpdateSettings={updateUserSettings}
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

      {activeSkill && activeCategory && (
        <TimerToast
          skill={activeSkill}
          category={activeCategory}
          timerState={timerState}
          onPause={pauseTimer}
          onResume={resumeTimer}
          onStop={() => handleStopTimer(activeSkill.id)}
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
  const { user, loading } = useAuth();

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

  return <AppContent />;
}

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <AuthenticatedApp />
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;