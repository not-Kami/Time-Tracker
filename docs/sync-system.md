# Système de Synchronisation TimeXP

## Vue d'ensemble

TimeXP utilise un système de synchronisation hybride qui combine le stockage local (localStorage) pour le travail hors ligne et les sauvegardes ponctuelles vers Supabase pour la persistance et la synchronisation multi-appareils.

## Architecture

### Stockage Local (localStorage)
- **Avantages** : 
  - Travail hors ligne complet
  - Accès instantané aux données
  - Pas de latence réseau
- **Utilisation** : Toutes les opérations quotidiennes (création de projets, sessions, etc.)

### Synchronisation Supabase
- **Avantages** :
  - Sauvegarde sécurisée
  - Synchronisation multi-appareils
  - Récupération de données
- **Utilisation** : Sauvegardes ponctuelles et restauration

## Fonctionnalités

### 1. Synchronisation Automatique
- **Reconnexion** : Synchronisation automatique lors du retour en ligne
- **Détection hors ligne** : Indicateur visuel du statut de connexion
- **Gestion des conflits** : Priorité aux données locales en cas de conflit

### 2. Synchronisation Manuelle
- **Sauvegarde** : Envoi des données locales vers Supabase
- **Restauration** : Téléchargement des données depuis Supabase
- **Synchronisation bidirectionnelle** : Mise à jour complète

### 3. Interface Utilisateur
- **Indicateur de statut** : Affichage du statut de connexion et de la dernière synchronisation
- **Boutons de synchronisation** : Contrôle manuel de la synchronisation
- **Feedback visuel** : Indicateurs de progression et d'erreur

## Utilisation

### Configuration Initiale
1. Exécutez le script SQL `setup-database.sql` dans votre projet Supabase
2. Assurez-vous que l'authentification est configurée
3. Les utilisateurs connectés peuvent commencer à synchroniser

### Utilisation Quotidienne
1. **Travail normal** : Toutes les données sont sauvegardées localement
2. **Sauvegarde** : Cliquez sur "Sauvegarder" dans les paramètres ou utilisez le bouton "Sync" dans la sidebar
3. **Restauration** : Cliquez sur "Restaurer" pour récupérer les données depuis le cloud

### Travail Hors Ligne
- L'application fonctionne normalement sans connexion
- Les données sont sauvegardées localement
- Synchronisation automatique lors du retour en ligne

## Structure des Données

### Table `user_data`
```sql
CREATE TABLE user_data (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  data JSONB NOT NULL,
  last_updated TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);
```

### Format JSON
```json
{
  "version": "1.0.0",
  "categories": [...],
  "projects": [...]
}
```

## Sécurité

- **RLS (Row Level Security)** : Chaque utilisateur ne peut accéder qu'à ses propres données
- **Authentification requise** : Synchronisation uniquement pour les utilisateurs connectés
- **Validation des données** : Vérification de l'intégrité des données JSON

## Gestion des Erreurs

### Erreurs de Connexion
- Tentatives de reconnexion automatiques
- Indicateurs visuels du statut de connexion
- Fallback vers le mode hors ligne

### Erreurs de Synchronisation
- Messages d'erreur explicites
- Possibilité de réessayer
- Conservation des données locales

### Conflits de Données
- Priorité aux données locales
- Timestamp de dernière modification
- Possibilité de résolution manuelle

## Avantages du Système

1. **Performance** : Accès instantané aux données locales
2. **Fiabilité** : Travail possible sans connexion
3. **Sécurité** : Sauvegarde sécurisée dans le cloud
4. **Flexibilité** : Synchronisation manuelle ou automatique
5. **Simplicité** : Interface utilisateur intuitive

## Limitations

1. **Taille des données** : Limitation du localStorage (~5-10MB)
2. **Conflits** : Pas de résolution automatique des conflits
3. **Versioning** : Pas de gestion des versions de données
4. **Partage** : Pas de partage de données entre utilisateurs

## Évolutions Futures

- [ ] Synchronisation en temps réel
- [ ] Gestion des conflits automatique
- [ ] Versioning des données
- [ ] Partage de projets
- [ ] Sauvegarde automatique périodique
- [ ] Compression des données
- [ ] Chiffrement des données sensibles 