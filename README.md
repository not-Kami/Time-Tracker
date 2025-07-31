# TimeXP - Suivi du Développement des Compétences

[![React](https://img.shields.io/badge/React-18.0-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0-purple.svg)](https://vitejs.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-2.0-green.svg)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-cyan.svg)](https://tailwindcss.com/)

TimeXP est une application moderne de suivi du développement des compétences, construite avec React, TypeScript et Supabase. Elle vous permet de créer des catégories, des projets, de suivre votre temps de travail et de synchroniser vos données entre différents appareils.

## ✨ Fonctionnalités

- 🎯 **Gestion des catégories et projets** - Organisez vos compétences par catégories
- ⏱️ **Suivi du temps** - Chronométrez vos sessions de travail avec précision
- 🍅 **Mode Pomodoro** - Améliorez votre productivité avec la technique Pomodoro
- 📊 **Statistiques détaillées** - Visualisez vos progrès et performances
- 🔄 **Synchronisation cloud** - Vos données sont sauvegardées et synchronisées avec Supabase
- 🌙 **Mode sombre** - Interface adaptée à vos préférences visuelles
- 🌍 **Multilingue** - Support de plusieurs langues (FR, EN, ES, etc.)
- 📱 **Responsive** - Fonctionne sur desktop, tablette et mobile
- 🔔 **Notifications sonores** - Alertes pour les sessions et objectifs
- 🏆 **Système de gamification** - Débloquez des succès en progressant

## 🚀 Installation et Configuration

### Prérequis

- Node.js 18+ 
- npm ou yarn
- Un projet Supabase (optionnel, pour la synchronisation)

### Installation

1. **Cloner le repository**
   ```bash
   git clone https://github.com/votre-username/time-tracker.git
   cd time-tracker
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Configurer l'environnement (optionnel)**
   
   Pour activer la synchronisation cloud, créez un fichier `.env` :
   ```bash
   cp .env.example .env
   ```
   
   Puis configurez vos variables Supabase :
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

4. **Lancer l'application**
   ```bash
   npm run dev
   ```

5. **Ouvrir dans le navigateur**
   ```
   http://localhost:5173
   ```

### Configuration de la synchronisation

Pour activer la synchronisation cloud avec Supabase :

1. Créez un projet sur [supabase.com](https://supabase.com)
2. Exécutez le script SQL dans `add-user-data-table.sql`
3. Configurez les variables d'environnement
4. Consultez [docs/sync-setup.md](docs/sync-setup.md) pour plus de détails

## 📚 Scripts disponibles

```bash
# Développement
npm run dev          # Lance le serveur de développement
npm run build        # Compile pour la production
npm run preview      # Prévisualise la build de production

# Linting et formatage
npm run lint         # Vérifie le code avec ESLint
npm run lint:fix     # Corrige automatiquement les erreurs de linting

# Tests
npm run test         # Lance les tests
npm run test:watch   # Lance les tests en mode watch
```

## 🏗️ Architecture

```
src/
├── components/          # Composants React réutilisables
│   ├── Auth/           # Composants d'authentification
│   ├── Admin/          # Composants d'administration
│   └── ...
├── contexts/           # Contextes React (thème, langue, auth)
├── hooks/              # Hooks personnalisés
├── lib/                # Bibliothèques et configurations
├── types/              # Définitions TypeScript
└── utils/              # Utilitaires et helpers
```

## 🔧 Technologies utilisées

- **Frontend** : React 18, TypeScript, Vite
- **Styling** : Tailwind CSS
- **Backend** : Supabase (PostgreSQL, Auth, Real-time)
- **État** : React Context + LocalStorage
- **Icons** : Lucide React
- **Build** : Vite

## 📖 Documentation

- [Guide de synchronisation](docs/sync-setup.md) - Configuration de Supabase
- [Schéma de base de données](TABLE.md) - Structure des tables
- [Guide d'auto-hébergement](docs/supabase-self-host.md) - Héberger Supabase

## 🤝 Contribution

Les contributions sont les bienvenues ! Pour contribuer :

1. Fork le projet
2. Créez une branche pour votre fonctionnalité (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 🙏 Remerciements

- [Supabase](https://supabase.com) pour l'infrastructure backend
- [Tailwind CSS](https://tailwindcss.com) pour le styling
- [Lucide](https://lucide.dev) pour les icônes
- [Vite](https://vitejs.dev) pour l'outil de build
