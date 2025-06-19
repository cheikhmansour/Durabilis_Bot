# 🌱 DURABILIS.CO Chatbot Interface

Une interface moderne de chatbot IA spécialisée dans l'analyse de documents techniques sur le développement durable, l'environnement et le sport.

![DURABILIS.CO Chatbot](https://ext.same-assets.com/3391515024/1248550479.jpeg)

## 🚀 Demo Live

**Application déployée :** [https://same-s30rmqlhh9k-latest.netlify.app](https://same-s30rmqlhh9k-latest.netlify.app)

## ✨ Fonctionnalités

### 🎨 Interface Professionnelle
- **Design DURABILIS.CO** avec palette de couleurs personnalisée (#0f70b7, #2b2e83, #2daae1)
- **Interface moderne** inspirée de ChatGPT/Claude
- **Mode sombre/clair** avec sauvegarde des préférences
- **Design responsive** pour mobile/tablet/desktop
- **Police Inter** pour une typographie moderne

### 🔧 Fonctionnalités Complètes
- ✅ **Messages interactifs** avec attribution des sources
- ✅ **Boutons fonctionnels** : copier, partager, supprimer, exporter
- ✅ **Feedback utilisateur** : boutons pouce haut/bas
- ✅ **Questions suggérées** intelligentes
- ✅ **Gestion des conversations** avec historique
- ✅ **Export de conversations** (téléchargement fichier)

### 🧠 UX/UI Optimisée
- **Animations fluides** pour les messages et transitions
- **Indicateurs de chargement** avec progression
- **Affichage des sources** avec titre et numéro de page
- **Questions suggérées conditionnelles** (affichage intelligent)
- **Accessibilité** (ARIA labels, navigation clavier)

## 🛠 Stack Technique

- **Frontend :** React 18 + TypeScript
- **Styling :** TailwindCSS avec thème personnalisé
- **Gestionnaire de paquets :** Bun
- **Build :** Vite
- **Déploiement :** Netlify
- **Linter :** Biome

## 📦 Installation

```bash
# Cloner le repository
git clone https://github.com/cheikhmansour/Durabilis_Bot.git
cd Durabilis_Bot

# Installer les dépendances
bun install

# Lancer le serveur de développement
bun run dev
```

## 🚀 Scripts Disponibles

```bash
# Développement
bun run dev          # Démarre le serveur de développement

# Build et déploiement
bun run build        # Build de production
bun run preview      # Prévisualise le build
bun run lint         # Vérification du code avec Biome
```

## 🏗 Structure du Projet

```
src/
├── components/          # Composants React
│   ├── Header.tsx      # En-tête avec branding et actions
│   ├── Sidebar.tsx     # Historique des conversations
│   ├── ChatContainer.tsx # Container principal du chat
│   ├── MessageList.tsx # Liste des messages
│   ├── Message.tsx     # Composant message individuel
│   ├── InputArea.tsx   # Zone de saisie et suggestions
│   └── LoadingIndicator.tsx # Indicateur de chargement
├── context/
│   └── ThemeContext.tsx # Gestion du thème sombre/clair
├── index.css           # Styles globaux et thème DURABILIS
└── App.tsx            # Composant racine
```

## 🎨 Thème DURABILIS.CO

### Couleurs Principales
- **Bleu principal :** `#0f70b7`
- **Bleu foncé :** `#2b2e83`
- **Bleu clair :** `#2daae1`

### Typographie
- **Police principale :** Inter
- **Variantes :** Regular, Medium, SemiBold, Bold

## 🔧 Configuration

### Variables CSS Personnalisées
```css
:root {
  --durabilis-primary: #0f70b7;
  --durabilis-dark: #2b2e83;
  --durabilis-light: #2daae1;
}
```

### Classes TailwindCSS Personnalisées
```css
.btn-durabilis           /* Bouton principal DURABILIS */
.btn-durabilis-outline   /* Bouton outline DURABILIS */
.durabilis-gradient      /* Dégradé DURABILIS */
.loading-dots           /* Animation de chargement */
```

## 📱 Responsive Design

- **Mobile :** < 768px - Sidebar collapsible, interface tactile
- **Tablet :** 768px - 1024px - Layout optimisé
- **Desktop :** > 1024px - Interface complète avec sidebar fixe

## 🌐 Déploiement

### Netlify (Recommandé)
1. Build automatique avec `bun run build`
2. Déploiement vers `/dist`
3. Configuration dans `netlify.toml`

### Variables d'Environnement
```env
NODE_VERSION=18
```

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/amazing-feature`)
3. Commit les changements (`git commit -m 'Add amazing feature'`)
4. Push vers la branche (`git push origin feature/amazing-feature`)
5. Ouvrir une Pull Request

## 📋 Roadmap

- [ ] Intégration API backend (FastAPI)
- [ ] Authentification utilisateur
- [ ] Upload de documents PDF/DOCX
- [ ] Recherche avancée dans l'historique
- [ ] Export PDF avancé avec mise en forme
- [ ] Tests unitaires et E2E
- [ ] Internationalisation (i18n)

## 🐛 Bugs Connus

- Quelques erreurs de linting mineures (éléments auto-fermants)
- Dépendances useEffect à optimiser

## 📄 Licence

Ce projet est développé pour DURABILIS & CO - Tous droits réservés © 2025

## 👥 Équipe

- **Développement :** [Cheikh Mansour](https://github.com/cheikhmansour)
- **Design :** Équipe DURABILIS.CO
- **Spécialisation :** Développement durable, environnement, sport

## 📞 Support

Pour toute question ou support :
- **Email :** cheikhmansour@durabilis.co
- **Website :** [durabilis.co](https://durabilis.co)

---

⚡ **Données au service du développement durable** - DURABILIS & CO
