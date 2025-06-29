import { useEffect, useRef, useState } from 'react';

type SoundType = 'pomodoro-complete' | 'break-complete' | 'goal-reached' | 'task-completed' | 'achievement-unlocked';

export function useSoundNotifications() {
  const audioContextRef = useRef<AudioContext | null>(null);
  const [isSoundEnabled, setIsSoundEnabled] = useState(() => {
    const saved = localStorage.getItem('soundEnabled');
    return saved ? saved === 'true' : true;
  });

  useEffect(() => {
    localStorage.setItem('soundEnabled', isSoundEnabled.toString());
  }, [isSoundEnabled]);

  useEffect(() => {
    // Initialize audio context on first user interaction
    const initAudio = () => {
      if (!audioContextRef.current && isSoundEnabled) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
    };

    document.addEventListener('click', initAudio, { once: true });
    document.addEventListener('keydown', initAudio, { once: true });

    return () => {
      document.removeEventListener('click', initAudio);
      document.removeEventListener('keydown', initAudio);
    };
  }, [isSoundEnabled]);

  const createTone = (frequency: number, duration: number, type: OscillatorType = 'sine') => {
    if (!audioContextRef.current || !isSoundEnabled) return;

    const oscillator = audioContextRef.current.createOscillator();
    const gainNode = audioContextRef.current.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContextRef.current.destination);

    oscillator.frequency.setValueAtTime(frequency, audioContextRef.current.currentTime);
    oscillator.type = type;

    // Envelope for smooth sound
    gainNode.gain.setValueAtTime(0, audioContextRef.current.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, audioContextRef.current.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + duration);

    oscillator.start(audioContextRef.current.currentTime);
    oscillator.stop(audioContextRef.current.currentTime + duration);
  };

  const playSound = (soundType: SoundType) => {
    if (!audioContextRef.current || !isSoundEnabled) return;

    try {
      switch (soundType) {
        case 'pomodoro-complete':
          // Gentle bell sound - C major chord
          createTone(523.25, 0.5); // C5
          setTimeout(() => createTone(659.25, 0.5), 100); // E5
          setTimeout(() => createTone(783.99, 0.8), 200); // G5
          break;

        case 'break-complete':
          // Soft chime - F major chord
          createTone(349.23, 0.4); // F4
          setTimeout(() => createTone(440.00, 0.4), 80); // A4
          setTimeout(() => createTone(523.25, 0.6), 160); // C5
          break;

        case 'goal-reached':
          // Triumphant fanfare
          createTone(523.25, 0.3); // C5
          setTimeout(() => createTone(659.25, 0.3), 150); // E5
          setTimeout(() => createTone(783.99, 0.3), 300); // G5
          setTimeout(() => createTone(1046.50, 0.5), 450); // C6
          break;

        case 'task-completed':
          // Quick success sound
          createTone(659.25, 0.2); // E5
          setTimeout(() => createTone(783.99, 0.3), 100); // G5
          break;

        case 'achievement-unlocked':
          // Epic achievement sound
          createTone(261.63, 0.2); // C4
          setTimeout(() => createTone(329.63, 0.2), 100); // E4
          setTimeout(() => createTone(392.00, 0.2), 200); // G4
          setTimeout(() => createTone(523.25, 0.2), 300); // C5
          setTimeout(() => createTone(659.25, 0.2), 400); // E5
          setTimeout(() => createTone(783.99, 0.4), 500); // G5
          setTimeout(() => createTone(1046.50, 0.6), 600); // C6
          break;
      }
    } catch (error) {
      console.warn('Could not play sound:', error);
    }
  };

  const toggleSound = () => {
    setIsSoundEnabled(!isSoundEnabled);
  };

  return { playSound, isSoundEnabled, toggleSound };
}