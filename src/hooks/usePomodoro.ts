import { useState, useEffect, useRef } from 'react';
import { Skill } from '../types';

export function usePomodoro(skill: Skill | null, onPomodoroComplete?: () => void, onBreakComplete?: () => void) {
  const [pomodoroMode, setPomodoroMode] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [pomodoroTimeLeft, setPomodoroTimeLeft] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [breakAdviceShown, setBreakAdviceShown] = useState(false);
  const intervalRef = useRef<number | null>(null);

  // Initialize pomodoro time when skill changes or mode is enabled
  useEffect(() => {
    if (skill && skill.pomodoroSettings.enabled && pomodoroMode) {
      const focusTime = skill.pomodoroSettings.focusTime * 60 * 1000;
      const breakTime = skill.pomodoroSettings.breakTime * 60 * 1000;
      setPomodoroTimeLeft(isBreak ? breakTime : focusTime);
    }
  }, [skill, pomodoroMode, isBreak]);

  // Pomodoro countdown logic
  useEffect(() => {
    if (!pomodoroMode || !skill?.pomodoroSettings.enabled || isPaused) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = window.setInterval(() => {
      setPomodoroTimeLeft(prev => {
        if (prev <= 1000) {
          // Time's up! Switch between focus and break
          const wasBreak = isBreak;
          
          setIsBreak(currentIsBreak => {
            const newIsBreak = !currentIsBreak;
            
            // Reset break advice when starting a new break
            if (newIsBreak) {
              setBreakAdviceShown(false);
            }
            
            // Trigger sound callbacks when switching
            setTimeout(() => {
              if (currentIsBreak) {
                // Break just ended, focus starts
                onBreakComplete?.();
              } else {
                // Pomodoro just ended, break starts
                onPomodoroComplete?.();
              }
            }, 100);
            
            return newIsBreak;
          });
          
          const focusTime = skill.pomodoroSettings.focusTime * 60 * 1000;
          const breakTime = skill.pomodoroSettings.breakTime * 60 * 1000;
          
          // Return the time for the NEW state (opposite of current)
          return wasBreak ? focusTime : breakTime;
        }
        return prev - 1000;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [pomodoroMode, isBreak, skill, onPomodoroComplete, onBreakComplete, isPaused]);

  // Sync pause state with timer state
  const pausePomodoro = () => {
    setIsPaused(true);
  };

  const resumePomodoro = () => {
    setIsPaused(false);
  };

  const stopPomodoro = () => {
    setIsPaused(false);
    setPomodoroMode(false);
    setIsBreak(false);
    setPomodoroTimeLeft(0);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const togglePomodoro = () => {
    if (!skill?.pomodoroSettings.enabled) return;
    
    const newPomodoroMode = !pomodoroMode;
    setPomodoroMode(newPomodoroMode);
    
    if (newPomodoroMode && skill) {
      const focusTime = skill.pomodoroSettings.focusTime * 60 * 1000;
      setPomodoroTimeLeft(focusTime);
      setIsBreak(false);
      setIsPaused(false);
      setBreakAdviceShown(false);
    } else {
      stopPomodoro();
    }
  };

  const resetPomodoro = () => {
    if (!skill?.pomodoroSettings.enabled) return;
    
    const focusTime = skill.pomodoroSettings.focusTime * 60 * 1000;
    const breakTime = skill.pomodoroSettings.breakTime * 60 * 1000;
    setPomodoroTimeLeft(isBreak ? breakTime : focusTime);
  };

  return {
    pomodoroMode: pomodoroMode && skill?.pomodoroSettings.enabled,
    isBreak,
    pomodoroTimeLeft,
    isPaused,
    breakAdviceShown,
    setBreakAdviceShown,
    togglePomodoro,
    resetPomodoro,
    pausePomodoro,
    resumePomodoro,
    stopPomodoro,
  };
}