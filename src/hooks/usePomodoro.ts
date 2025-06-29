import { useState, useEffect } from 'react';
import { Project } from '../types';

export function usePomodoro(project: Project | null) {
  const [pomodoroMode, setPomodoroMode] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [pomodoroTimeLeft, setPomodoroTimeLeft] = useState(0);

  // Initialize pomodoro time when project changes or mode is enabled
  useEffect(() => {
    if (project && project.pomodoroSettings.enabled && pomodoroMode) {
      const focusTime = project.pomodoroSettings.focusTime * 60 * 1000;
      const breakTime = project.pomodoroSettings.breakTime * 60 * 1000;
      setPomodoroTimeLeft(isBreak ? breakTime : focusTime);
    }
  }, [project, pomodoroMode, isBreak]);

  useEffect(() => {
    if (!pomodoroMode || !project?.pomodoroSettings.enabled) return;

    const interval = setInterval(() => {
      setPomodoroTimeLeft(prev => {
        if (prev <= 1000) {
          // Time's up! Switch between focus and break
          setIsBreak(current => {
            const newIsBreak = !current;
            return newIsBreak;
          });
          const focusTime = project.pomodoroSettings.focusTime * 60 * 1000;
          const breakTime = project.pomodoroSettings.breakTime * 60 * 1000;
          return isBreak ? focusTime : breakTime;
        }
        return prev - 1000;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [pomodoroMode, isBreak, project]);

  const togglePomodoro = () => {
    if (!project?.pomodoroSettings.enabled) return;
    
    setPomodoroMode(!pomodoroMode);
    if (!pomodoroMode && project) {
      const focusTime = project.pomodoroSettings.focusTime * 60 * 1000;
      setPomodoroTimeLeft(focusTime);
      setIsBreak(false);
    }
  };

  const resetPomodoro = () => {
    if (!project?.pomodoroSettings.enabled) return;
    
    const focusTime = project.pomodoroSettings.focusTime * 60 * 1000;
    const breakTime = project.pomodoroSettings.breakTime * 60 * 1000;
    setPomodoroTimeLeft(isBreak ? breakTime : focusTime);
  };

  return {
    pomodoroMode: pomodoroMode && project?.pomodoroSettings.enabled,
    isBreak,
    pomodoroTimeLeft,
    togglePomodoro,
    resetPomodoro,
  };
}