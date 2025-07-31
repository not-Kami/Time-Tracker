-- Script pour créer la table user_data dans Supabase
-- Exécutez ce script dans l'éditeur SQL de votre projet Supabase

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

-- Créer une fonction pour mettre à jour automatiquement last_updated
CREATE OR REPLACE FUNCTION update_last_updated()
RETURNS TRIGGER AS $$
BEGIN
  NEW.last_updated = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Créer un trigger pour mettre à jour automatiquement last_updated
CREATE TRIGGER update_user_data_last_updated
  BEFORE UPDATE ON user_data
  FOR EACH ROW
  EXECUTE FUNCTION update_last_updated(); 