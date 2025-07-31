import { useLocalStorage } from './useLocalStorage';

export function useSyncTriggers() {
  const { triggerSync } = useLocalStorage();

  // Déclencheurs pour les sessions de travail
  const syncAfterSession = () => {
    triggerSync.session();
  };

  // Déclencheurs pour les sessions Pomodoro
  const syncAfterPomodoro = () => {
    triggerSync.pomodoro();
  };

  // Déclencheurs pour les modifications de projets
  const syncAfterProjectChange = () => {
    triggerSync.project();
  };

  // Déclencheurs pour les modifications de catégories
  const syncAfterCategoryChange = () => {
    triggerSync.category();
  };

  // Déclencheur manuel
  const syncManual = () => {
    triggerSync.manual();
  };

  return {
    syncAfterSession,
    syncAfterPomodoro,
    syncAfterProjectChange,
    syncAfterCategoryChange,
    syncManual,
  };
} 