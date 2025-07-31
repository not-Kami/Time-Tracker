# Configuration de la Synchronisation avec Supabase

## Vue d'ensemble

TimeXP utilise Supabase pour synchroniser automatiquement vos données (catégories, projets, sessions) entre différents appareils. La synchronisation se fait en arrière-plan et fonctionne même en mode hors ligne.

## Configuration requise

### 1. Créer un projet Supabase

1. Allez sur [supabase.com](https://supabase.com)
2. Créez un nouveau projet
3. Notez votre URL de projet et votre clé anonyme

### 2. Configurer les variables d'environnement

Créez un fichier `.env` à la racine du projet avec les variables suivantes :

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3. Configurer la base de données

Exécutez le script SQL suivant dans l'éditeur SQL de votre projet Supabase :

```sql
-- Créer la table user_data pour la synchronisation
CREATE TABLE IF NOT EXISTS user_data (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  data JSONB NOT NULL,
  last_updated TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Créer un index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_user_data_user_id ON user_data(user_id);

-- Activer RLS (Row Level Security)
ALTER TABLE user_data ENABLE ROW LEVEL SECURITY;

-- Créer une politique pour que les utilisateurs ne puissent voir que leurs propres données
CREATE POLICY "Users can view own data" ON user_data
  FOR SELECT USING (auth.uid() = user_id);

-- Créer une politique pour que les utilisateurs puissent insérer leurs propres données
CREATE POLICY "Users can insert own data" ON user_data
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Créer une politique pour que les utilisateurs puissent mettre à jour leurs propres données
CREATE POLICY "Users can update own data" ON user_data
  FOR UPDATE USING (auth.uid() = user_id);

-- Créer une politique pour que les utilisateurs puissent supprimer leurs propres données
CREATE POLICY "Users can delete own data" ON user_data
  FOR DELETE USING (auth.uid() = user_id);
```

## Fonctionnement de la synchronisation

### Déclencheurs automatiques

La synchronisation se déclenche automatiquement dans les cas suivants :

- **Création de catégorie** : Synchronisation immédiate (priorité basse)
- **Création de projet** : Synchronisation immédiate (priorité moyenne)
- **Modification de projet** : Synchronisation immédiate (priorité moyenne)
- **Fin de session de travail** : Synchronisation immédiate (priorité moyenne)
- **Retour en ligne** : Synchronisation immédiate (priorité haute)
- **Périodique** : Toutes les 5 minutes (priorité basse)

### File d'attente de synchronisation

Si vous êtes hors ligne ou si la synchronisation échoue, les événements sont mis en file d'attente et traités automatiquement dès que possible.

### Priorités

- **Haute (1)** : Retour en ligne, synchronisation manuelle, sessions Pomodoro
- **Moyenne (2)** : Sessions de travail, modifications de projets
- **Basse (3)** : Modifications de catégories, synchronisation périodique

## Surveillance de la synchronisation

Vous pouvez surveiller l'état de la synchronisation dans les paramètres de l'application :

1. Ouvrez les paramètres (icône engrenage)
2. Allez dans l'onglet "Données"
3. Consultez la section "Synchronisation"

### Indicateurs visuels

- 🟢 **Vert** : Synchronisé et à jour
- 🟡 **Jaune** : Non synchronisé (première utilisation)
- 🟠 **Orange** : Éléments en attente de synchronisation
- 🔴 **Rouge** : Hors ligne
- 🔄 **Bleu** : Synchronisation en cours

## Dépannage

### Problèmes courants

1. **"Missing Supabase environment variables"**
   - Vérifiez que votre fichier `.env` est correctement configuré
   - Redémarrez le serveur de développement

2. **"No user logged in, skipping Supabase sync"**
   - Connectez-vous à l'application
   - Vérifiez que l'authentification Supabase fonctionne

3. **Synchronisation qui échoue**
   - Vérifiez votre connexion internet
   - Vérifiez que les politiques RLS sont correctement configurées
   - Consultez les logs de la console pour plus de détails

### Synchronisation manuelle

Si la synchronisation automatique ne fonctionne pas, vous pouvez forcer une synchronisation manuelle :

1. Allez dans les paramètres
2. Onglet "Données"
3. Cliquez sur "Sync" dans la section synchronisation

## Sécurité

- Toutes les données sont chiffrées en transit
- Chaque utilisateur ne peut accéder qu'à ses propres données
- Les politiques RLS garantissent l'isolation des données
- Les clés API sont sécurisées et ne sont jamais exposées côté client

## Performance

- La synchronisation se fait en arrière-plan
- Les données sont compressées avant l'envoi
- La file d'attente évite les synchronisations multiples simultanées
- Les index de base de données optimisent les requêtes 