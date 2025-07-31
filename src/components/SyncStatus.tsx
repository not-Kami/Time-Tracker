import React, { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { ChevronDown, ChevronUp, Clock, AlertCircle, TestTube } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface SyncStatusProps {
  className?: string;
}

export function SyncStatus({ className = '' }: SyncStatusProps) {
  const { 
    isOnline, 
    lastSync, 
    isSyncing, 
    syncData, 
    syncQueue, 
    autoSyncEnabled, 
    getSyncStats,
    clearSyncQueue,
    toggleAutoSync 
  } = useLocalStorage();
  
  const [showDetails, setShowDetails] = useState(false);
  const [testResult, setTestResult] = useState<string>('');

  // Fonction de test pour vérifier la connexion Supabase
  const testSupabaseConnection = async () => {
    setTestResult('Test en cours...');
    try {
      // Vérifier l'authentification
      const { data: { user }, error: authError } = await supabase.auth.getUser();
  
      
      if (authError) {
        setTestResult(`❌ Erreur d'authentification: ${authError.message}`);
        return;
      }
      
      if (!user) {
        setTestResult('❌ Aucun utilisateur connecté');
        return;
      }
      
      // Tester la connexion à la base de données
      const { data, error: dbError } = await supabase
        .from('user_data')
        .select('user_id')
        .eq('user_id', user.id)
        .limit(1);
      
      if (dbError) {
        setTestResult(`❌ Erreur de base de données: ${dbError.message}`);
        return;
      }
      
      setTestResult(`✅ Connecté en tant que ${user.email} - Base de données accessible`);
      
      // Forcer une synchronisation de test
      
      await syncData('upload');
      
    } catch (error) {
      setTestResult(`❌ Erreur de test: ${error}`);
    }
  };

  const formatLastSync = (date: Date | null) => {
    if (!date) return 'Jamais';
    
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'À l\'instant';
    if (minutes < 60) return `Il y a ${minutes} min`;
    if (hours < 24) return `Il y a ${hours}h`;
    return `Il y a ${days}j`;
  };

  const getStatusColor = () => {
    if (isSyncing) return 'text-blue-500';
    if (!isOnline) return 'text-red-500';
    if (!lastSync) return 'text-yellow-500';
    if (syncQueue.length > 0) return 'text-orange-500';
    return 'text-green-500';
  };

  const getStatusIcon = () => {
    if (isSyncing) return '🔄';
    if (!isOnline) return '📡';
    if (!lastSync) return '⚠️';
    if (syncQueue.length > 0) return '⏳';
    return '✅';
  };

  const getStatusText = () => {
    if (isSyncing) return 'Synchronisation...';
    if (!isOnline) return 'Hors ligne';
    if (!lastSync) return 'Non synchronisé';
    if (syncQueue.length > 0) return `${syncQueue.length} en attente`;
    return 'Synchronisé';
  };

  const getPriorityText = (priority: number) => {
    switch (priority) {
      case 1: return 'Haute';
      case 2: return 'Moyenne';
      case 3: return 'Basse';
      default: return 'Inconnue';
    }
  };

  const getTriggerText = (trigger: string) => {
    const triggers: Record<string, string> = {
      'online': 'Retour en ligne',
      'pomodoro': 'Session Pomodoro',
      'manual': 'Manuel',
      'session': 'Session de travail',
      'project': 'Modification projet',
      'category': 'Modification catégorie',
      'periodic': 'Périodique'
    };
    return triggers[trigger] || trigger;
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Status principal */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm">
          <span className={getStatusColor()}>
            {getStatusIcon()}
          </span>
          <span className="text-gray-600">
            {getStatusText()}
          </span>
          {lastSync && (
            <span className="text-gray-400 text-xs">
              {formatLastSync(lastSync)}
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-1">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="p-1 text-gray-400 hover:text-gray-600 rounded"
          >
            {showDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          
          {isOnline && !isSyncing && (
            <button
              onClick={() => syncData('both')}
              className="text-blue-500 hover:text-blue-700 text-xs underline"
              title="Synchroniser maintenant"
            >
              Sync
            </button>
          )}
        </div>
      </div>

      {/* Détails */}
      {showDetails && (
        <div className="space-y-3 pt-2 border-t border-gray-200 dark:border-gray-600">
          {/* Auto-sync toggle */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-600">Synchronisation automatique</span>
            <button
              onClick={toggleAutoSync}
              className={`px-2 py-1 text-xs rounded ${
                autoSyncEnabled 
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                  : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
              }`}
            >
              {autoSyncEnabled ? 'Activée' : 'Désactivée'}
            </button>
          </div>

          {/* File d'attente */}
          {syncQueue.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  File d'attente ({syncQueue.length})
                </span>
                <button
                  onClick={clearSyncQueue}
                  className="text-xs text-red-500 hover:text-red-700"
                >
                  Vider
                </button>
              </div>
              
              <div className="max-h-32 overflow-y-auto space-y-1">
                {syncQueue.slice(0, 5).map((event) => (
                  <div key={event.id} className="flex items-center justify-between text-xs bg-gray-50 dark:bg-gray-700 p-2 rounded">
                    <span className="text-gray-600">
                      {getTriggerText(event.trigger)}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className={`px-1 py-0.5 rounded text-xs ${
                        event.priority === 1 ? 'bg-red-100 text-red-700' :
                        event.priority === 2 ? 'bg-yellow-100 text-yellow-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {getPriorityText(event.priority)}
                      </span>
                      <span className="text-gray-400">
                        {Math.floor((Date.now() - event.timestamp) / 1000)}s
                      </span>
                    </div>
                  </div>
                ))}
                {syncQueue.length > 5 && (
                  <div className="text-xs text-gray-400 text-center">
                    +{syncQueue.length - 5} autres...
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Bouton de test */}
          <div className="space-y-2">
            <button
              onClick={testSupabaseConnection}
              className="flex items-center gap-2 px-3 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors text-xs"
            >
              <TestTube className="w-3 h-3" />
              Tester la connexion
            </button>
            
            {testResult && (
              <div className={`text-xs p-2 rounded ${
                testResult.startsWith('✅') 
                  ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                  : testResult.startsWith('❌')
                  ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'
                  : 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
              }`}>
                {testResult}
              </div>
            )}
          </div>

          {/* Avertissements */}
          {!isOnline && (
            <div className="flex items-center gap-2 text-xs text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 p-2 rounded">
              <AlertCircle className="w-3 h-3" />
              Mode hors ligne - synchronisation en attente
            </div>
          )}
        </div>
      )}
    </div>
  );
} 