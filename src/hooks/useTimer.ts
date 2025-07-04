import { useState, useEffect, useRef } from 'react';
import { TimerState, Session } from '../types';
import { generateId } from '../utils/helpers';

export function useTimer() {
  const [timerState, setTimerState] = useState<TimerState>({
    status: 'idle',
    currentSession: null,
    elapsedTime: 0,
  });

  const intervalRef = useRef<number | null>(null);
  const startTimeRef = useRef<Date | null>(null);
  const pausedTimeRef = useRef<number>(0); // Track paused time for pomodoro

  useEffect(() => {
    if (timerState.status === 'running') {
      intervalRef.current = window.setInterval(() => {
        if (startTimeRef.current) {
          const now = new Date();
          const elapsed = now.getTime() - startTimeRef.current.getTime();
          setTimerState(prev => ({
            ...prev,
            elapsedTime: prev.elapsedTime + elapsed,
          }));
          startTimeRef.current = now;
        }
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [timerState.status]);

  const startTimer = () => {
    const now = new Date();
    const session: Session = {
      id: generateId(),
      startTime: now,
      duration: 0,
      createdAt: now,
    };

    startTimeRef.current = now;
    pausedTimeRef.current = 0; // Reset paused time
    setTimerState({
      status: 'running',
      currentSession: session,
      elapsedTime: 0,
    });
  };

  const pauseTimer = () => {
    // Store the current elapsed time when pausing
    pausedTimeRef.current = timerState.elapsedTime;
    setTimerState(prev => ({
      ...prev,
      status: 'paused',
    }));
    startTimeRef.current = null;
  };

  const resumeTimer = () => {
    startTimeRef.current = new Date();
    setTimerState(prev => ({
      ...prev,
      status: 'running',
    }));
  };

  const stopTimer = (): Session | null => {
    if (!timerState.currentSession) return null;

    const endTime = new Date();
    const finalSession: Session = {
      ...timerState.currentSession,
      endTime,
      duration: timerState.elapsedTime,
    };

    setTimerState({
      status: 'idle',
      currentSession: null,
      elapsedTime: 0,
    });

    startTimeRef.current = null;
    pausedTimeRef.current = 0;

    return finalSession;
  };

  return {
    timerState,
    startTimer,
    pauseTimer,
    resumeTimer,
    stopTimer,
  };
}