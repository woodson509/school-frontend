# Pages Étudiant - Documentation

## Vue d'ensemble

Ce module contient **21 pages complètes** pour l'interface étudiant du système de gestion scolaire.

## Liste des Pages

### 📊 Tableau de bord
| Page | Fichier | Description |
|------|---------|-------------|
| Dashboard | `DashboardPage.jsx` | Vue d'ensemble avec stats, emploi du temps, devoirs, examens |

### 📚 Apprentissage (6 pages)
| Page | Fichier | Description |
|------|---------|-------------|
| Mes cours | `CoursesPage.jsx` | Liste des cours avec progression |
| Emploi du temps | `SchedulePage.jsx` | Planning hebdomadaire interactif |
| Devoirs | `AssignmentsPage.jsx` | Devoirs à rendre avec soumission |
| Examens | `ExamsPage.jsx` | Examens à venir et passés |
| Notes | `GradesPage.jsx` | Notes détaillées par matière |
| Présences | `AttendancePage.jsx` | Historique avec calendrier |

### 🛠 Outils d'étude (5 pages)
| Page | Fichier | Description |
|------|---------|-------------|
| Planificateur | `PlannerPage.jsx` | Sessions d'étude + objectifs + Pomodoro |
| Notes perso | `NotesPage.jsx` | Prise de notes organisée par dossiers |
| Quiz | `PracticePage.jsx` | Quiz d'entraînement interactifs |
| Ressources | `ResourcesPage.jsx` | Documents de cours |
| Favoris | `BookmarksPage.jsx` | Contenus sauvegardés |

### 👥 Communauté (3 pages)
| Page | Fichier | Description |
|------|---------|-------------|
| Forum | `ForumPage.jsx` | Discussions et entraide |
| Groupes | `GroupsPage.jsx` | Groupes d'étude collaboratifs |
| Messages | `MessagesPage.jsx` | Messagerie privée |

### 📅 Autres (6 pages)
| Page | Fichier | Description |
|------|---------|-------------|
| Calendrier | `CalendarPage.jsx` | Événements et échéances |
| Annonces | `AnnouncementsPage.jsx` | Annonces de l'école |
| Certificats | `CertificatesPage.jsx` | Certificats et récompenses |
| Progression | `ProgressPage.jsx` | Analytics et évolution |
| Aide | `HelpPage.jsx` | FAQ et support |
| Profil | `ProfilePage.jsx` | Informations personnelles |

## Structure des fichiers

```
src/
├── layouts/
│   └── StudentLayout.jsx        # Layout avec sidebar
├── pages/
│   └── student/
│       ├── index.js             # Exports
│       ├── DashboardPage.jsx
│       ├── CoursesPage.jsx
│       ├── SchedulePage.jsx
│       ├── AssignmentsPage.jsx
│       ├── ExamsPage.jsx
│       ├── GradesPage.jsx
│       ├── AttendancePage.jsx
│       ├── PlannerPage.jsx
│       ├── NotesPage.jsx
│       ├── PracticePage.jsx
│       ├── ResourcesPage.jsx
│       ├── BookmarksPage.jsx
│       ├── ForumPage.jsx
│       ├── GroupsPage.jsx
│       ├── MessagesPage.jsx
│       ├── CalendarPage.jsx
│       ├── AnnouncementsPage.jsx
│       ├── CertificatesPage.jsx
│       ├── ProgressPage.jsx
│       ├── HelpPage.jsx
│       └── ProfilePage.jsx
├── routes/
│   └── studentRoutes.js         # Configuration des routes
└── AppWithStudentRoutes.jsx     # Exemple d'intégration
```

## Installation

### 1. Copier les fichiers

Copiez le dossier `student` dans `src/pages/`.

### 2. Ajouter le layout

Copiez `StudentLayout.jsx` dans `src/layouts/`.

### 3. Configurer les routes

Ajoutez dans votre `App.jsx` :

```jsx
import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const StudentLayout = lazy(() => import('./layouts/StudentLayout'));
const StudentDashboard = lazy(() => import('./pages/student/DashboardPage'));
// ... autres imports

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/student" element={<StudentLayout />}>
            <Route path="dashboard" element={<StudentDashboard />} />
            <Route path="courses" element={<StudentCourses />} />
            {/* ... autres routes */}
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
```

## Routes disponibles

| Route | Page |
|-------|------|
| `/student/dashboard` | Tableau de bord |
| `/student/courses` | Mes cours |
| `/student/schedule` | Emploi du temps |
| `/student/assignments` | Devoirs |
| `/student/exams` | Examens |
| `/student/grades` | Notes |
| `/student/attendance` | Présences |
| `/student/planner` | Planificateur |
| `/student/notes` | Notes personnelles |
| `/student/practice` | Quiz d'entraînement |
| `/student/resources` | Ressources |
| `/student/bookmarks` | Favoris |
| `/student/forum` | Forum |
| `/student/groups` | Groupes d'étude |
| `/student/messages` | Messages |
| `/student/calendar` | Calendrier |
| `/student/announcements` | Annonces |
| `/student/certificates` | Certificats |
| `/student/progress` | Progression |
| `/student/help` | Aide |
| `/student/profile` | Profil |

## Fonctionnalités principales

### 🎯 Dashboard
- Statistiques en temps réel (cours, moyenne, présence, classement)
- Emploi du temps du jour avec indicateur "en cours"
- Devoirs à rendre avec priorités
- Examens à venir
- Notes récentes
- Actions rapides

### 📚 Cours
- Cartes de cours avec progression visuelle
- Filtres (en cours, terminés, non commencés)
- Affichage de la prochaine leçon
- Code couleur par matière

### 📅 Emploi du temps
- Vue hebdomadaire avec navigation
- Créneaux colorés par matière
- Indication du cours en cours
- Affichage salle + professeur

### ✏️ Devoirs
- Liste avec statuts (à rendre, soumis, noté, en retard)
- Priorités (haute, moyenne, basse)
- Compte à rebours avant échéance
- Upload de fichiers
- Modal de détails

### 📝 Examens
- Onglets "À venir" / "Passés"
- Informations complètes (date, heure, salle, sujets)
- Notes obtenues avec classement
- Démarrage d'examen en ligne

### 📊 Notes
- Moyenne générale avec évolution
- Notes par matière avec détail
- Comparaison avec moyenne de classe
- Tendances (hausse/baisse)

### 📆 Présences
- Calendrier mensuel coloré
- Statistiques (présent, absent, retard, excusé)
- Liste des absences récentes

### 🎯 Planificateur (innovant)
- Sessions d'étude planifiées
- Objectifs avec progression
- Streak de jours consécutifs
- Timer Pomodoro intégré

### ❓ Quiz d'entraînement (innovant)
- Quiz par matière
- Niveaux de difficulté
- Historique des scores
- Mode quiz rapide aléatoire

### 📝 Notes personnelles (innovant)
- Organisation par dossiers/matières
- Recherche
- Favoris (étoiles)
- Éditeur de texte

### 💬 Messages
- Conversations avec profs et camarades
- Indicateur en ligne
- Messages lus/non lus
- Interface type chat

### 📈 Progression (innovant)
- Graphiques d'évolution
- Compétences (radar)
- Objectifs personnels
- Conseils personnalisés

### 🏆 Certificats
- Certificats officiels téléchargeables
- Récompenses (or, argent, bronze)
- Partage social

## Design System

### Couleurs principales
- **Emerald** (`#10B981`) - Couleur principale étudiant
- **Teal** (`#14B8A6`) - Accent
- **Couleurs par matière** :
  - Mathématiques : `#3B82F6` (bleu)
  - Physique : `#8B5CF6` (violet)
  - Français : `#EF4444` (rouge)
  - Anglais : `#F59E0B` (orange)
  - Informatique : `#6366F1` (indigo)
  - Histoire : `#EC4899` (rose)

### Composants réutilisables
- Cards avec progression
- Badges de statut
- Calendrier interactif
- Modals
- Tabs
- Formulaires

## Dépendances

```json
{
  "react": "^18.0.0",
  "react-router-dom": "^6.0.0",
  "lucide-react": "^0.263.1",
  "tailwindcss": "^3.0.0"
}
```

## À faire

- [ ] Connecter à l'API backend
- [ ] Ajouter la gestion d'état (Redux/Zustand)
- [ ] Implémenter les notifications push
- [ ] Ajouter les validations de formulaires
- [ ] Tests unitaires
- [ ] PWA avec mode offline

## Pages suggérées à ajouter

- `/student/courses/:id/lessons` - Détail d'un cours avec leçons
- `/student/courses/:id/lessons/:lessonId` - Lecteur de leçon
- `/student/exams/:id/start` - Interface de passage d'examen
- `/student/transcript` - Relevé de notes officiel
- `/student/library` - Bibliothèque numérique
- `/student/tutoring` - Demande de tutorat
