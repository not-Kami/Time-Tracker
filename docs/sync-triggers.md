# Système de Déclencheurs de Synchronisation

## Vue d'ensemble

Le système de synchronisation de TimeXP utilise des déclencheurs intelligents pour optimiser les sauvegardes vers Supabase. Chaque déclencheur a une priorité différente et est programmé pour s'exécuter à des moments optimaux.

## Types de Déclencheurs

### 1. **Retour en ligne** (Priorité: Haute)
- **Déclenchement** : Automatique lors du retour de la connexion internet
- **Délai** : Immédiat (1 seconde)
- **Cas d'usage** : Synchronisation urgente des données accumulées hors ligne

### 2. **Session Pomodoro** (Priorité: Haute)
- **Déclenchement** : À la fin d'une session Pomodoro
- **Délai** : Immédiat (1 seconde)
- **Cas d'usage** : Sauvegarde rapide des sessions de travail concentré

### 3. **Session de travail** (Priorité: Moyenne)
- **Déclenchement** : À la fin d'une session de travail normale
- **Délai** : 5 secondes
- **Cas d'usage** : Sauvegarde des sessions de travail standard

### 4. **Modification de projet** (Priorité: Moyenne)
- **Déclenchement** : Après création/modification/suppression d'un projet
- **Délai** : 5 secondes
- **Cas d'usage** : Sauvegarde des changements structurels

### 5. **Modification de catégorie** (Priorité: Basse)
- **Déclenchement** : Après création/modification/suppression d'une catégorie
- **Délai** : 30 secondes
- **Cas d'usage** : Sauvegarde des changements d'organisation

### 6. **Synchronisation périodique** (Priorité: Basse)
- **Déclenchement** : Automatique toutes les 5 minutes
- **Délai** : 30 secondes
- **Cas d'usage** : Sauvegarde de sécurité régulière

### 7. **Synchronisation manuelle** (Priorité: Haute)
- **Déclenchement** : Clic sur le bouton "Sync"
- **Délai** : Immédiat (1 seconde)
- **Cas d'usage** : Synchronisation à la demande

## Système de File d'Attente

### Priorités
- **1 (Haute)** : Synchronisation immédiate
- **2 (Moyenne)** : Synchronisation dans les 5 secondes
- **3 (Basse)** : Synchronisation dans les 30 secondes

### Gestion de la File
- Maximum 5 événements traités par synchronisation
- Tri automatique par priorité puis par timestamp
- Suppression des événements traités avec succès
- Conservation en cas d'échec de synchronisation

## Intégration dans les Composants

### Hook `useSyncTriggers`
```typescript
import { useSyncTriggers } from '../hooks/useSyncTriggers';

const { syncAfterSession, syncAfterPomodoro, syncAfterProjectChange } = useSyncTriggers();

// Après une session de travail
const handleSessionEnd = () => {
  // Logique de fin de session
  syncAfterSession();
};

// Après une session Pomodoro
const handlePomodoroEnd = () => {
  // Logique de fin de Pomodoro
  syncAfterPomodoro();
};
```

### Exemples d'Intégration

#### 1. **Composant Timer**
```typescript
const handleSessionComplete = () => {
  // Sauvegarder la session
  saveSession(sessionData);
  
  // Déclencher la synchronisation
  syncAfterSession();
};
```

#### 2. **Composant ProjectCard**
```typescript
const handleProjectUpdate = () => {
  // Mettre à jour le projet
  updateProject(projectData);
  
  // Déclencher la synchronisation
  syncAfterProjectChange();
};
```

#### 3. **Composant CreateCategoryModal**
```typescript
const handleCategoryCreate = () => {
  // Créer la catégorie
  createCategory(categoryData);
  
  // Déclencher la synchronisation
  syncAfterCategoryChange();
};
```

## Configuration

### Activation/Désactivation
```typescript
const { toggleAutoSync, autoSyncEnabled } = useLocalStorage();

// Désactiver la synchronisation automatique
if (autoSyncEnabled) {
  toggleAutoSync();
}
```

### Surveillance
```typescript
const { getSyncStats } = useLocalStorage();

// Obtenir les statistiques de synchronisation
const stats = getSyncStats();
console.log('File d\'attente:', stats.queueLength);
console.log('Dernière sync:', stats.lastSync);
```

## Avantages du Système

### 1. **Performance**
- Évite les synchronisations excessives
- Regroupe les événements similaires
- Délais adaptés à l'importance des données

### 2. **Fiabilité**
- File d'attente persistante
- Retry automatique en cas d'échec
- Conservation des données en mode hors ligne

### 3. **Expérience Utilisateur**
- Synchronisation transparente
- Indicateurs visuels du statut
- Contrôle manuel disponible

### 4. **Optimisation Réseau**
- Réduction des requêtes HTTP
- Synchronisation par batch
- Priorisation intelligente

## Monitoring et Debug

### Console Logs
```javascript
// Activer les logs de synchronisation
localStorage.setItem('debug-sync', 'true');
```

### Statistiques en Temps Réel
```typescript
const stats = getSyncStats();
console.log('Statistiques de sync:', stats);
```

### File d'Attente
```typescript
const { syncQueue } = useLocalStorage();
console.log('Événements en attente:', syncQueue);
```

## Évolutions Futures

- [ ] Synchronisation en temps réel pour les données critiques
- [ ] Compression des données avant synchronisation
- [ ] Chiffrement des données sensibles
- [ ] Synchronisation différentielle
- [ ] Gestion des conflits automatique
- [ ] Notifications de synchronisation
- [ ] Métriques de performance 