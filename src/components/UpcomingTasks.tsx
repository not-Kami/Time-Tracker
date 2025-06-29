import React from 'react';
import { Calendar, Clock, AlertTriangle, CheckCircle } from 'lucide-react';
import { Project, Task } from '../types';
import { getCategoryColor } from '../utils/helpers';

interface UpcomingTasksProps {
  projects: Project[];
  categories: any[];
  onTaskClick?: (project: Project, task: Task) => void;
}

export function UpcomingTasks({ projects, categories, onTaskClick }: UpcomingTasksProps) {
  // Get all incomplete tasks with deadlines
  const upcomingTasks = projects
    .flatMap(project => 
      project.tasks
        .filter(task => !task.completed && task.deadline)
        .map(task => ({ project, task }))
    )
    .sort((a, b) => {
      if (!a.task.deadline || !b.task.deadline) return 0;
      return new Date(a.task.deadline).getTime() - new Date(b.task.deadline).getTime();
    })
    .slice(0, 5); // Show only next 5 tasks

  const getTaskUrgency = (deadline: Date) => {
    const now = new Date();
    const diffDays = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return { level: 'overdue', color: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-900/20' };
    if (diffDays === 0) return { level: 'today', color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-50 dark:bg-orange-900/20' };
    if (diffDays === 1) return { level: 'tomorrow', color: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-50 dark:bg-yellow-900/20' };
    if (diffDays <= 7) return { level: 'this-week', color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/20' };
    return { level: 'later', color: 'text-gray-600 dark:text-gray-400', bg: 'bg-gray-50 dark:bg-gray-700' };
  };

  const formatDeadline = (deadline: Date) => {
    const now = new Date();
    const diffDays = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return `${Math.abs(diffDays)} days overdue`;
    if (diffDays === 0) return 'Due today';
    if (diffDays === 1) return 'Due tomorrow';
    if (diffDays <= 7) return `Due in ${diffDays} days`;
    return deadline.toLocaleDateString();
  };

  const getPriorityIcon = (priority?: string) => {
    switch (priority) {
      case 'high': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'medium': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'low': return <CheckCircle className="w-4 h-4 text-green-500" />;
      default: return null;
    }
  };

  if (upcomingTasks.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Upcoming Tasks</h3>
        </div>
        <div className="text-center py-8">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">No upcoming deadlines</p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Add deadlines to your tasks to see them here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Upcoming Tasks</h3>
      </div>

      <div className="space-y-3">
        {upcomingTasks.map(({ project, task }) => {
          const category = categories.find(c => c.id === project.categoryId);
          const colorClasses = category ? getCategoryColor(category.color) : getCategoryColor('blue');
          const urgency = task.deadline ? getTaskUrgency(new Date(task.deadline)) : null;

          return (
            <div
              key={`${project.id}-${task.id}`}
              onClick={() => onTaskClick?.(project, task)}
              className={`p-4 rounded-xl border-l-4 ${colorClasses.border} ${urgency?.bg} hover:shadow-md transition-all cursor-pointer group`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    {getPriorityIcon(task.priority)}
                    <h4 className="font-semibold text-gray-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {task.name}
                    </h4>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{project.name}</p>
                  {task.deadline && (
                    <div className={`flex items-center space-x-1 text-sm ${urgency?.color}`}>
                      <Clock className="w-3 h-3" />
                      <span className="font-medium">{formatDeadline(new Date(task.deadline))}</span>
                    </div>
                  )}
                </div>
                <span className={`inline-flex px-2 py-1 rounded-full text-xs font-bold ${colorClasses.bg} ${colorClasses.text} text-center`}>
                  {category?.name}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {upcomingTasks.length === 5 && (
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">Showing next 5 tasks</p>
        </div>
      )}
    </div>
  );
}