import { useState, useEffect, useRef } from 'react';
import { TimeTrackerData } from '../types';
import { supabase } from '../lib/supabase';

const STORAGE_KEY = 'timeXP-data';
const LAST_SYNC_KEY = 'timeXP-last-sync';
const SYNC_QUEUE_KEY = 'timeXP-sync-queue';

const defaultData: TimeTrackerData = {
  categories: [],
  projects: [],
  version: '1.0.0',
};

// Types pour les événements de synchronisation
type SyncTrigger = 'online' | 'pomodoro' | 'manual' | 'session' | 'project' | 'category' | 'periodic';

interface SyncEvent {
  id: string;
  trigger: SyncTrigger;
  timestamp: number;
  priority: number; // 1 = haute, 2 = moyenne, 3 = basse
}

export function useLocalStorage() {
  const [data, setData] = useState<TimeTrackerData>(defaultData);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncQueue, setSyncQueue] = useState<SyncEvent[]>([]);
  const [autoSyncEnabled, setAutoSyncEnabled] = useState(true);
  const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const periodicSyncRef = useRef<NodeJS.Timeout | null>(null);

  // Charger la file d'attente de synchronisation
  useEffect(() => {
    const storedQueue = localStorage.getItem(SYNC_QUEUE_KEY);
    if (storedQueue) {
      try {
        setSyncQueue(JSON.parse(storedQueue));
      } catch (error) {
        console.error('Error loading sync queue:', error);
        setSyncQueue([]);
      }
    }
  }, []);

  // Sauvegarder la file d'attente
  const saveSyncQueue = (queue: SyncEvent[]) => {
    localStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(queue));
    setSyncQueue(queue);
  };

  // Ajouter un événement de synchronisation
  const addSyncEvent = (trigger: SyncTrigger, priority: number = 2) => {
    if (!autoSyncEnabled) {
      return;
    }

    const newEvent: SyncEvent = {
      id: `${trigger}-${Date.now()}-${Math.random()}`,
      trigger,
      timestamp: Date.now(),
      priority,
    };

    const updatedQueue = [...syncQueue, newEvent];
    saveSyncQueue(updatedQueue);

    // Déclencher la synchronisation après un délai
    scheduleSync();
  };

  // Programmer la synchronisation
  const scheduleSync = () => {
    if (syncTimeoutRef.current) {
      clearTimeout(syncTimeoutRef.current);
    }

    // Délais différents selon la priorité
    const delays = {
      1: 1000,    // Haute priorité : 1 seconde
      2: 5000,    // Moyenne priorité : 5 secondes
      3: 30000,   // Basse priorité : 30 secondes
    };

    syncTimeoutRef.current = setTimeout(() => {
      if (isOnline && !isSyncing) {
        processSyncQueue();
      }
    }, delays[2]); // Utilise la priorité moyenne par défaut
  };

  // Traiter la file d'attente de synchronisation
  const processSyncQueue = async () => {
    if (syncQueue.length === 0 || isSyncing || !isOnline) {
      return;
    }

    setIsSyncing(true);
    
    try {
      // Trier par priorité et timestamp
      const sortedQueue = [...syncQueue].sort((a, b) => {
        if (a.priority !== b.priority) {
          return a.priority - b.priority;
        }
        return a.timestamp - b.timestamp;
      });

      // Prendre les 5 premiers événements
      const eventsToProcess = sortedQueue.slice(0, 5);
      
      // Synchroniser
      const result = await saveToSupabase(data);
      
      if (result.success) {
        // Supprimer les événements traités
        const remainingEvents = syncQueue.filter(
          event => !eventsToProcess.find(e => e.id === event.id)
        );
        saveSyncQueue(remainingEvents);
        
        // Mettre à jour le timestamp de dernière synchronisation
        const now = new Date();
        localStorage.setItem(LAST_SYNC_KEY, now.toISOString());
        setLastSync(now);
      }
    } catch (error) {
      console.error('Error processing sync queue:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // Synchronisation immédiate lors du retour en ligne
      addSyncEvent('online', 1);
    };
    
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Synchronisation périodique (toutes les 5 minutes)
  useEffect(() => {
    if (autoSyncEnabled && isOnline) {
      periodicSyncRef.current = setInterval(() => {
        addSyncEvent('periodic', 3);
      }, 5 * 60 * 1000); // 5 minutes
    }

    return () => {
      if (periodicSyncRef.current) {
        clearInterval(periodicSyncRef.current);
      }
    };
  }, [autoSyncEnabled, isOnline]);

  // Traiter la file d'attente quand on revient en ligne
  useEffect(() => {
    if (isOnline && syncQueue.length > 0 && !isSyncing) {
      processSyncQueue();
    }
  }, [isOnline, syncQueue.length, isSyncing]);

  // Load last sync time
  useEffect(() => {
    const storedLastSync = localStorage.getItem(LAST_SYNC_KEY);
    if (storedLastSync) {
      setLastSync(new Date(storedLastSync));
    }
  }, []);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsedData = JSON.parse(stored);
        // Convert date strings back to Date objects
        parsedData.categories = Array.isArray(parsedData.categories) ? parsedData.categories.map((cat: Record<string, unknown>) => ({
          ...cat,
          createdAt: new Date(cat.createdAt as string),
        })) : defaultData.categories;
        
        parsedData.projects = Array.isArray(parsedData.projects) ? parsedData.projects.map((proj: Record<string, unknown>) => ({
          ...proj,
          createdAt: new Date(proj.createdAt as string),
          updatedAt: new Date(proj.updatedAt as string),
          isPinned: proj.isPinned as boolean || false,
          pomodoroSettings: proj.pomodoroSettings as Record<string, unknown> || { enabled: false, focusTime: 25, breakTime: 5 },
          tasks: Array.isArray(proj.tasks) ? proj.tasks.map((task: Record<string, unknown>) => ({
            ...task,
            createdAt: new Date(task.createdAt as string),
          })) : [],
          sessions: Array.isArray(proj.sessions) ? proj.sessions.map((session: Record<string, unknown>) => ({
            ...session,
            startTime: new Date(session.startTime as string),
            endTime: session.endTime ? new Date(session.endTime as string) : undefined,
            createdAt: new Date(session.createdAt as string),
          })) : [],
          notes: Array.isArray(proj.notes) ? proj.notes.map((note: Record<string, unknown>) => ({
            ...note,
            createdAt: new Date(note.createdAt as string),
            updatedAt: new Date(note.updatedAt as string),
          })) : [],
        })) : [];
        
        setData(parsedData);
      } else {
        setData(defaultData);
      }
    } catch (error) {
      console.error('Error loading data from localStorage:', error);
      setData(defaultData);
    }
    setIsLoaded(true);
  }, []);

  const saveData = (newData: TimeTrackerData) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
      setData(newData);
    } catch (error) {
      console.error('Error saving data to localStorage:', error);
    }
  };

  const exportData = () => {
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `time-tracker-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const resetData = () => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(LAST_SYNC_KEY);
    setData(defaultData);
    setLastSync(null);
  };

  // Save data to Supabase
  const saveToSupabase = async (userData: TimeTrackerData) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { success: false, error: 'No user logged in' };
      }

      const { error } = await supabase
        .from('user_data')
        .upsert({
          user_id: user.id,
          data: userData,
          last_updated: new Date().toISOString(),
        }, {
          onConflict: 'user_id'
        });

      if (error) {
        console.error('Error saving to Supabase:', error);
        return { success: false, error };
      }

      // Update last sync time
      const now = new Date();
      localStorage.setItem(LAST_SYNC_KEY, now.toISOString());
      setLastSync(now);

      return { success: true };
    } catch (error) {
      console.error('Error saving to Supabase:', error);
      return { success: false, error };
    }
  };

  // Load data from Supabase
  const loadFromSupabase = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, error: 'No user logged in' };
      }

      const { data, error } = await supabase
        .from('user_data')
        .select('data, last_updated')
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Error loading from Supabase:', error);
        return { success: false, error };
      }

      if (data) {
        const userData = data.data as TimeTrackerData;
        
        // Convert date strings back to Date objects for categories
        if (Array.isArray(userData.categories)) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          userData.categories = userData.categories.map((cat) => ({
            ...cat,
            createdAt: new Date((cat as any).createdAt),
          })) as any;
        }
        
        // Convert date strings back to Date objects for projects
        if (Array.isArray(userData.projects)) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          userData.projects = userData.projects.map((proj) => ({
            ...proj,
            createdAt: new Date((proj as any).createdAt),
            updatedAt: new Date((proj as any).updatedAt),
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            tasks: Array.isArray((proj as any).tasks) ? (proj as any).tasks.map((task: any) => ({
              ...task,
              createdAt: new Date(task.createdAt),
            })) : [],
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            sessions: Array.isArray((proj as any).sessions) ? (proj as any).sessions.map((session: any) => ({
              ...session,
              startTime: new Date(session.startTime),
              endTime: session.endTime ? new Date(session.endTime) : undefined,
              createdAt: new Date(session.createdAt),
            })) : [],
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            notes: Array.isArray((proj as any).notes) ? (proj as any).notes.map((note: any) => ({
              ...note,
              createdAt: new Date(note.createdAt),
              updatedAt: new Date(note.updatedAt),
            })) : [],
          })) as any;
        }

        setData(userData);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
        
        const lastUpdated = new Date(data.last_updated);
        localStorage.setItem(LAST_SYNC_KEY, lastUpdated.toISOString());
        setLastSync(lastUpdated);

        return { success: true, data: userData };
      }

      return { success: false, error: 'No data found' };
    } catch (error) {
      console.error('Error loading from Supabase:', error);
      return { success: false, error };
    }
  };

  // Manual sync function
  const syncData = async (direction: 'upload' | 'download' | 'both' = 'both') => {
    setIsSyncing(true);
    
    try {
      if (direction === 'upload' || direction === 'both') {
        const result = await saveToSupabase(data);
        if (!result.success) {
          console.error('Upload failed:', result.error);
        }
      }

      if (direction === 'download' || direction === 'both') {
        const result = await loadFromSupabase();
        if (!result.success) {
          console.error('Download failed:', result.error);
        }
      }
    } finally {
      setIsSyncing(false);
    }
  };

  // Fonctions de déclenchement de synchronisation
  const triggerSync = {
    // Synchronisation manuelle (haute priorité)
    manual: () => addSyncEvent('manual', 1),
    
    // Synchronisation après session Pomodoro (haute priorité)
    pomodoro: () => addSyncEvent('pomodoro', 1),
    
    // Synchronisation après session de travail (moyenne priorité)
    session: () => addSyncEvent('session', 2),
    
    // Synchronisation après modification de projet (moyenne priorité)
    project: () => addSyncEvent('project', 2),
    
    // Synchronisation après modification de catégorie (basse priorité)
    category: () => addSyncEvent('category', 3),
    
    // Synchronisation périodique (basse priorité)
    periodic: () => addSyncEvent('periodic', 3),
  };

  // Fonction pour activer/désactiver la synchronisation automatique
  const toggleAutoSync = () => {
    setAutoSyncEnabled(!autoSyncEnabled);
  };

  // Fonction pour vider la file d'attente
  const clearSyncQueue = () => {
    saveSyncQueue([]);
  };

  // Fonction pour obtenir les statistiques de synchronisation
  const getSyncStats = () => {
    const stats = {
      queueLength: syncQueue.length,
      lastSync: lastSync,
      isOnline,
      isSyncing,
      autoSyncEnabled,
      pendingEvents: syncQueue.map(event => ({
        trigger: event.trigger,
        priority: event.priority,
        age: Date.now() - event.timestamp,
      })),
    };
    return stats;
  };

  return {
    data,
    saveData,
    exportData,
    resetData,
    syncData,
    triggerSync,
    toggleAutoSync,
    clearSyncQueue,
    getSyncStats,
    isLoaded,
    isOnline,
    lastSync,
    isSyncing,
    syncQueue,
    autoSyncEnabled,
  };
}