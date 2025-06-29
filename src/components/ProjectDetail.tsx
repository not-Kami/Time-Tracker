import React, { useState } from 'react';
import { ArrowLeft, Plus, Check, X, Clock, Calendar, Star, Timer, FileText, Edit3, Save } from 'lucide-react';
import { Project, Category, Task, TimerState, Note, Session } from '../types';
import { formatHours, formatDetailedTime, getCategoryColor, getAchievementLevel } from '../utils/helpers';
import { generateId } from '../utils/helpers';
import { AddSessionModal } from './AddSessionModal';
import { MarkdownEditor } from './MarkdownEditor';
import { MarkdownRenderer } from './MarkdownRenderer';
import { useLanguage } from '../contexts/LanguageContext';

interface ProjectDetailProps {
  project: Project;
  category: Category;
  timerState: TimerState;
  onBack: () => void;
  onUpdateProject: (project: Project) => void;
  onStartTimer: () => void;
  onPauseTimer: () => void;
  onResumeTimer: () => void;
  onStopTimer: () => void;
  onTaskToggle?: (taskId: string) => void;
}

export function ProjectDetail({
  project,
  category,
  timerState,
  onBack,
  onUpdateProject,
  onStartTimer,
  onPauseTimer,
  onResumeTimer,
  onStopTimer,
  onTaskToggle,
}: ProjectDetailProps) {
  const [newTaskName, setNewTaskName] = useState('');
  const [newTaskDeadline, setNewTaskDeadline] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newNoteContent, setNewNoteContent] = useState('');
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editingNoteContent, setEditingNoteContent] = useState('');
  const [isAddSessionModalOpen, setIsAddSessionModalOpen] = useState(false);
  const [noteViewMode, setNoteViewMode] = useState<'edit' | 'preview'>('edit');
  const [editingNoteViewMode, setEditingNoteViewMode] = useState<'edit' | 'preview'>('edit');
  const { t } = useLanguage();

  const colorClasses = getCategoryColor(category.color);
  const currentTime = project.totalTime + timerState.elapsedTime;
  const completedTasks = project.tasks.filter(task => task.completed).length;
  const achievement = getAchievementLevel(currentTime);
  const pomodoroSessions = project.sessions.filter(s => s.pomodoroSession && !s.isBreak).length;

  const handleTimerAction = () => {
    if (timerState.status === 'idle') {
      onStartTimer();
    } else if (timerState.status === 'running') {
      onPauseTimer();
    } else if (timerState.status === 'paused') {
      onResumeTimer();
    }
  };

  const addTask = () => {
    if (!newTaskName.trim()) return;

    const newTask: Task = {
      id: generateId(),
      name: newTaskName.trim(),
      completed: false,
      createdAt: new Date(),
      deadline: newTaskDeadline ? new Date(newTaskDeadline) : undefined,
      priority: newTaskPriority,
    };

    const updatedProject = {
      ...project,
      tasks: [...project.tasks, newTask],
      updatedAt: new Date(),
    };

    onUpdateProject(updatedProject);
    setNewTaskName('');
    setNewTaskDeadline('');
    setNewTaskPriority('medium');
    setIsAddingTask(false);
  };

  const toggleTask = (taskId: string) => {
    const updatedTasks = project.tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );

    const updatedProject = {
      ...project,
      tasks: updatedTasks,
      updatedAt: new Date(),
    };

    onUpdateProject(updatedProject);
    
    // Trigger sound notification
    if (onTaskToggle) {
      onTaskToggle(taskId);
    }
  };

  const deleteTask = (taskId: string) => {
    const updatedTasks = project.tasks.filter(task => task.id !== taskId);
    const updatedProject = {
      ...project,
      tasks: updatedTasks,
      updatedAt: new Date(),
    };

    onUpdateProject(updatedProject);
  };

  const addNote = () => {
    if (!newNoteContent.trim()) return;

    const newNote: Note = {
      id: generateId(),
      content: newNoteContent.trim(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const updatedProject = {
      ...project,
      notes: [...(project.notes || []), newNote],
      updatedAt: new Date(),
    };

    onUpdateProject(updatedProject);
    setNewNoteContent('');
    setIsAddingNote(false);
  };

  const startEditingNote = (note: Note) => {
    setEditingNoteId(note.id);
    setEditingNoteContent(note.content);
    setEditingNoteViewMode('edit');
  };

  const saveNote = (noteId: string) => {
    if (!editingNoteContent.trim()) return;

    const updatedNotes = (project.notes || []).map(note =>
      note.id === noteId 
        ? { ...note, content: editingNoteContent.trim(), updatedAt: new Date() }
        : note
    );

    const updatedProject = {
      ...project,
      notes: updatedNotes,
      updatedAt: new Date(),
    };

    onUpdateProject(updatedProject);
    setEditingNoteId(null);
    setEditingNoteContent('');
  };

  const deleteNote = (noteId: string) => {
    const updatedNotes = (project.notes || []).filter(note => note.id !== noteId);
    const updatedProject = {
      ...project,
      notes: updatedNotes,
      updatedAt: new Date(),
    };

    onUpdateProject(updatedProject);
  };

  const handleAddManualSession = (duration: number, date: Date, description?: string) => {
    const newSession: Session = {
      id: generateId(),
      startTime: date,
      endTime: new Date(date.getTime() + duration),
      duration,
      createdAt: new Date(),
      description,
    };

    const updatedProject = {
      ...project,
      totalTime: project.totalTime + duration,
      sessions: [...project.sessions, newSession],
      updatedAt: new Date(),
    };

    onUpdateProject(updatedProject);
  };

  const formatDeadline = (deadline: Date) => {
    const now = new Date();
    const diffDays = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return { text: t('tasks.overdue').replace('{days}', Math.abs(diffDays).toString()), color: 'text-red-600 dark:text-red-400' };
    if (diffDays === 0) return { text: t('tasks.dueToday'), color: 'text-orange-600 dark:text-orange-400' };
    if (diffDays === 1) return { text: t('tasks.dueTomorrow'), color: 'text-yellow-600 dark:text-yellow-400' };
    if (diffDays <= 7) return { text: t('tasks.dueInDays').replace('{days}', diffDays.toString()), color: 'text-blue-600 dark:text-blue-400' };
    return { text: deadline.toLocaleDateString(), color: 'text-gray-600 dark:text-gray-400' };
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'high': return 'border-red-500 bg-red-50 dark:bg-red-900/20';
      case 'medium': return 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
      case 'low': return 'border-green-500 bg-green-50 dark:bg-green-900/20';
      default: return 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <button
          onClick={onBack}
          className="p-3 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <span className={`inline-flex px-3 py-1 rounded-full text-sm font-bold ${colorClasses.bg} ${colorClasses.text} text-center`}>
              {category.name}
            </span>
            <div className="flex items-center space-x-1">
              {Array.from({ length: achievement.stars }).map((_, i) => (
                <Star key={i} className={`w-5 h-5 fill-current bg-gradient-to-r ${achievement.color} text-transparent bg-clip-text`} />
              ))}
              <span className={`text-lg font-bold ${achievement.textColor} text-center`}>
                {achievement.level}
              </span>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{project.name}</h1>
          {project.description && (
            <p className="text-gray-600 dark:text-gray-400 mt-2">{project.description}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Timer Section */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
            <div className="text-center space-y-6">
              <div className="space-y-3">
                <div className="text-5xl font-mono font-bold text-gray-900 dark:text-white">
                  {formatDetailedTime(currentTime)}
                </div>
                <div className="text-lg text-gray-600 dark:text-gray-400">
                  {t('timer.currentSession')}: {formatDetailedTime(timerState.elapsedTime)}
                </div>
              </div>

              <div className="flex items-center justify-center space-x-4">
                <button
                  onClick={handleTimerAction}
                  className={`px-8 py-4 rounded-2xl font-bold transition-all duration-200 transform hover:scale-105 shadow-lg ${
                    timerState.status === 'running'
                      ? 'bg-orange-500 hover:bg-orange-600 text-white shadow-orange-500/25'
                      : 'bg-green-500 hover:bg-green-600 text-white shadow-green-500/25'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Clock className="w-6 h-6" />
                    <span className="text-lg">
                      {timerState.status === 'running' ? t('timer.pause') : 
                       timerState.status === 'paused' ? t('timer.resume') : t('timer.start')}
                    </span>
                  </div>
                </button>

                {timerState.status !== 'idle' && (
                  <button
                    onClick={onStopTimer}
                    className="px-8 py-4 bg-red-500 hover:bg-red-600 text-white rounded-2xl font-bold transition-all duration-200 transform hover:scale-105 shadow-lg shadow-red-500/25"
                  >
                    {t('timer.stop')}
                  </button>
                )}

                <button
                  onClick={() => setIsAddSessionModalOpen(true)}
                  className="px-6 py-4 bg-blue-500 hover:bg-blue-600 text-white rounded-2xl font-bold transition-all duration-200 transform hover:scale-105 shadow-lg shadow-blue-500/25 flex items-center space-x-2"
                >
                  <Plus className="w-5 h-5" />
                  <span>{t('timer.addSession')}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Tasks Section */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {t('tasks.title')} ({completedTasks}/{project.tasks.length})
              </h2>
              <button
                onClick={() => setIsAddingTask(true)}
                className="inline-flex items-center px-4 py-2 text-sm font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
              >
                <Plus className="w-4 h-4 mr-1" />
                {t('tasks.add')}
              </button>
            </div>

            <div className="space-y-3">
              {project.tasks
                .sort((a, b) => {
                  // Sort by completion status: incomplete tasks first, then completed tasks
                  if (a.completed !== b.completed) {
                    return a.completed ? 1 : -1;
                  }
                  // Within each group, maintain original order (by creation time or ID)
                  return 0;
                })
                .map((task) => {
                const deadlineInfo = task.deadline ? formatDeadline(new Date(task.deadline)) : null;
                const priorityClasses = getPriorityColor(task.priority);

                return (
                  <div
                    key={task.id}
                    className={`flex items-center space-x-3 p-4 rounded-xl border-2 transition-all ${
                      task.completed 
                        ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
                        : priorityClasses
                    }`}
                  >
                    <button
                      onClick={() => toggleTask(task.id)}
                      className={`flex-shrink-0 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-200 transform hover:scale-110 ${
                        task.completed
                          ? 'bg-green-500 border-green-500 shadow-lg shadow-green-500/25'
                          : 'border-gray-300 dark:border-gray-500 hover:border-green-400'
                      }`}
                    >
                      {task.completed && <Check className="w-4 h-4 text-white" />}
                    </button>
                    
                    <div className="flex-1">
                      <span className={`font-medium block ${task.completed ? 'line-through text-gray-500 dark:text-gray-400' : 'text-gray-900 dark:text-white'}`}>
                        {task.name}
                      </span>
                      {task.deadline && (
                        <div className={`text-sm ${deadlineInfo?.color} flex items-center space-x-1 mt-1`}>
                          <Calendar className="w-3 h-3" />
                          <span>{deadlineInfo?.text}</span>
                        </div>
                      )}
                      {task.priority && (
                        <span className={`inline-block text-xs px-2 py-1 rounded-full mt-1 ${
                          task.priority === 'high' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' :
                          task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300' :
                          'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                        }`}>
                          {t(`tasks.${task.priority}Priority`)}
                        </span>
                      )}
                    </div>
                    
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="flex-shrink-0 p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}

              {isAddingTask && (
                <div className="p-4 bg-blue-50 dark:bg-blue-900/30 border-2 border-blue-200 dark:border-blue-800 rounded-xl space-y-4">
                  <input
                    type="text"
                    value={newTaskName}
                    onChange={(e) => setNewTaskName(e.target.value)}
                    placeholder={t('tasks.taskName')}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    onKeyPress={(e) => e.key === 'Enter' && addTask()}
                    autoFocus
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t('tasks.deadline')}
                      </label>
                      <input
                        type="date"
                        value={newTaskDeadline}
                        onChange={(e) => setNewTaskDeadline(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t('tasks.priority')}
                      </label>
                      <select
                        value={newTaskPriority}
                        onChange={(e) => setNewTaskPriority(e.target.value as 'low' | 'medium' | 'high')}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="low">{t('tasks.priority.low')}</option>
                        <option value="medium">{t('tasks.priority.medium')}</option>
                        <option value="high">{t('tasks.priority.high')}</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={addTask}
                      className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors font-semibold"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        setIsAddingTask(false);
                        setNewTaskName('');
                        setNewTaskDeadline('');
                        setNewTaskPriority('medium');
                      }}
                      className="px-4 py-2 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-colors font-semibold"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {project.tasks.length === 0 && !isAddingTask && (
                <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                  {t('tasks.noTasks')}
                </p>
              )}
            </div>
          </div>

          {/* Notes Section */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center space-x-2">
                <FileText className="w-5 h-5" />
                <span>{t('notes.title')}</span>
              </h2>
              <button
                onClick={() => setIsAddingNote(true)}
                className="inline-flex items-center px-4 py-2 text-sm font-bold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 rounded-xl hover:bg-green-100 dark:hover:bg-green-900/50 transition-colors"
              >
                <Plus className="w-4 h-4 mr-1" />
                {t('notes.addNote')}
              </button>
            </div>

            <div className="space-y-4">
              {(project.notes || []).map((note) => (
                <div
                  key={note.id}
                  className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600"
                >
                  {editingNoteId === note.id ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => setEditingNoteViewMode('edit')}
                            className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                              editingNoteViewMode === 'edit'
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
                            }`}
                          >
                            {t('notes.edit')}
                          </button>
                          <button
                            onClick={() => setEditingNoteViewMode('preview')}
                            className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                              editingNoteViewMode === 'preview'
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
                            }`}
                          >
                            {t('notes.preview')}
                          </button>
                        </div>
                      </div>
                      
                      {editingNoteViewMode === 'edit' ? (
                        <MarkdownEditor
                          value={editingNoteContent}
                          onChange={setEditingNoteContent}
                          placeholder={t('notes.placeholder')}
                        />
                      ) : (
                        <div className="border border-gray-200 dark:border-gray-600 rounded-xl p-4 bg-white dark:bg-gray-800">
                          <MarkdownRenderer content={editingNoteContent} />
                        </div>
                      )}
                      
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => saveNote(note.id)}
                          className="px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-semibold"
                        >
                          <Save className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setEditingNoteId(null);
                            setEditingNoteContent('');
                          }}
                          className="px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm font-semibold"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-start justify-between mb-2">
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {note.createdAt.toLocaleDateString()} at {note.createdAt.toLocaleTimeString()}
                          {note.updatedAt.getTime() !== note.createdAt.getTime() && (
                            <span className="ml-2">(edited)</span>
                          )}
                        </div>
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => startEditingNote(note)}
                            className="p-1 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors rounded"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteNote(note.id)}
                            className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors rounded"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <MarkdownRenderer content={note.content} />
                    </>
                  )}
                </div>
              ))}

              {isAddingNote && (
                <div className="p-4 bg-green-50 dark:bg-green-900/30 border-2 border-green-200 dark:border-green-800 rounded-xl">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-gray-900 dark:text-white">{t('notes.newNote')}</h4>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setNoteViewMode('edit')}
                        className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                          noteViewMode === 'edit'
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {t('notes.edit')}
                      </button>
                      <button
                        onClick={() => setNoteViewMode('preview')}
                        className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                          noteViewMode === 'preview'
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {t('notes.preview')}
                      </button>
                    </div>
                  </div>
                  
                  {noteViewMode === 'edit' ? (
                    <MarkdownEditor
                      value={newNoteContent}
                      onChange={setNewNoteContent}
                      placeholder={t('notes.placeholder')}
                    />
                  ) : (
                    <div className="border border-gray-200 dark:border-gray-600 rounded-xl p-4 bg-white dark:bg-gray-800 mb-3">
                      <MarkdownRenderer content={newNoteContent} />
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-2 mt-3">
                    <button
                      onClick={addNote}
                      className="px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors font-semibold"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        setIsAddingNote(false);
                        setNewNoteContent('');
                      }}
                      className="px-4 py-2 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-colors font-semibold"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {(project.notes || []).length === 0 && !isAddingNote && (
                <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                  {t('notes.noNotes')}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Stats Card */}
          {project.pomodoroSettings.enabled && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                <Timer className="w-5 h-5 text-red-500" />
                <span>{t('pomodoro.title')}</span>
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-xl">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{t('pomodoro.completedSessions')}</span>
                  <span className="text-lg font-bold text-red-600 dark:text-red-400 text-center">{pomodoroSessions}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{t('pomodoro.focusTime')}</span>
                  <span className="text-lg font-bold text-blue-600 dark:text-blue-400 text-center">{project.pomodoroSettings.focusTime}m</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-xl">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{t('pomodoro.breakTime')}</span>
                  <span className="text-lg font-bold text-green-600 dark:text-green-400 text-center">{project.pomodoroSettings.breakTime}m</span>
                </div>
              </div>
            </div>
          )}

          {/* Recent Sessions */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">{t('sessions.title')}</h3>
            
            <div className="space-y-3">
              {project.sessions.slice(-5).reverse().map((session) => (
                <div key={session.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <div>
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        {session.startTime.toLocaleDateString()}
                      </span>
                      {session.description && (
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                          {session.description}
                        </p>
                      )}
                      {session.pomodoroSession && (
                        <div className="flex items-center space-x-1 mt-1">
                          <Timer className="w-3 h-3 text-red-500" />
                          <span className="text-xs text-red-600 dark:text-red-400">
                            {session.isBreak ? t('sessions.break') : t('sessions.pomodoro')}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <span className="text-sm font-bold text-gray-900 dark:text-white bg-gray-200 dark:bg-gray-600 px-3 py-1 rounded-lg text-center">
                    {formatHours(session.duration)}
                  </span>
                </div>
              ))}

              {project.sessions.length === 0 && (
                <p className="text-gray-500 dark:text-gray-400 text-center py-6">
                  {t('sessions.noSessions')}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <AddSessionModal
        isOpen={isAddSessionModalOpen}
        onClose={() => setIsAddSessionModalOpen(false)}
        onAddSession={handleAddManualSession}
      />
    </div>
  );
}