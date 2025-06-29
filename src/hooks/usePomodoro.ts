import { useState, useEffect } from 'react';
import { Skill } from '../types';

export function usePomodoro(skill: Skill | null) {
  const [pomodoroMode, setPomodoroMode] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [pomodoroTimeLeft, setPomodoroTimeLeft] = useState(0);

  // Initialize pomodoro time when skill changes or mode is enabled
  useEffect(() => {
    if (skill && skill.pomodoro_settings.enabled && pomodoroMode) {
      const focusTime = skill.pomodoro_settings.focusTime * 60 * 1000;
      const breakTime = skill.pomodoro_settings.breakTime * 60 * 1000;
      setPomodoroTimeLeft(isBreak ? breakTime : focusTime);
    }
  }, [skill, pomodoroMode, isBreak]);

  useEffect(() => {
    if (!pomodoroMode || !skill?.pomodoro_settings.enabled) return;

    const interval = setInterval(() => {
      setPomodoroTimeLeft(prev => {
        if (prev <= 1000) {
          // Time's up! Switch between focus and break
          setIsBreak(current => {
            const newIsBreak = !current;
            return newIsBreak;
          });
          const focusTime = skill.pomodoro_settings.focusTime * 60 * 1000;
          const breakTime = skill.pomodoro_settings.breakTime * 60 * 1000;
          return isBreak ? focusTime : breakTime;
        }
        return prev - 1000;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [pomodoroMode, isBreak, skill]);

  const togglePomodoro = () => {
    if (!skill?.pomodoro_settings.enabled) return;
    
    setPomodoroMode(!pomodoroMode);
    if (!pomodoroMode && skill) {
      const focusTime = skill.pomodoro_settings.focusTime * 60 * 1000;
      setPomodoroTimeLeft(focusTime);
      setIsBreak(false);
    }
  };

  const resetPomodoro = () => {
    if (!skill?.pomodoro_settings.enabled) return;
    
    const focusTime = skill.pomodoro_settings.focusTime * 60 * 1000;
    const breakTime = skill.pomodoro_settings.breakTime * 60 * 1000;
    setPomodoroTimeLeft(isBreak ? breakTime : focusTime);
  };

  return {
    pomodoroMode: pomodoroMode && skill?.pomodoro_settings.enabled,
    isBreak,
    pomodoroTimeLeft,
    togglePomodoro,
    resetPomodoro,
  };
}