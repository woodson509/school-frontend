# Pages Admin - School Management System

## Vue d'ensemble

Ce module contient **23 pages administratives complètes** pour le système de gestion scolaire. Chaque page est entièrement fonctionnelle avec des composants React modernes, Tailwind CSS, et Lucide Icons.

## Liste complète des pages

### 📊 Tableau de bord
| Page | Chemin | Description |
|------|--------|-------------|
| **Dashboard** | `/admin/dashboard` | Vue d'ensemble avec statistiques, activités récentes, examens à venir |

### 📚 Pédagogie (8 pages)
| Page | Chemin | Description |
|------|--------|-------------|
| **Cours** | `/admin/courses` | CRUD complet pour les cours, filtres par statut, assignation professeurs |
| **Matières** | `/admin/subjects` | Gestion des disciplines avec codes couleur |
| **Programmes** | `/admin/curricula` | Programmes scolaires par niveau, heures/semaine, coefficients |
| **Classes** | `/admin/classes` | Gestion des classes, niveaux, professeurs principaux, salles |
| **Examens** | `/admin/exams` | Création d'examens, durées, notes de passage, statistiques |
| **Notes** | `/admin/grades` | Saisie et gestion des notes, filtres par classe/matière |
| **Présences** | `/admin/attendance` | Suivi quotidien des présences, retards, excusés |
| **Emplois du temps** | `/admin/schedules` | Grille horaire visuelle par classe, drag-and-drop |

### 👥 Gestion (5 pages)
| Page | Chemin | Description |
|------|--------|-------------|
| **Utilisateurs** | `/admin/users` | CRUD utilisateurs, rôles, filtres, actions en masse |
| **Écoles** | `/admin/schools` | Gestion multi-écoles, statistiques par établissement |
| **Agents** | `/admin/agents` | Agents commerciaux, commissions, performances |
| **Ventes** | `/admin/sales` | Suivi des ventes, statuts de paiement |
| **Paiements** | `/admin/payments` | Frais de scolarité, paiements partiels, rappels |

### 📅 Calendrier & Communication (2 pages)
| Page | Chemin | Description |
|------|--------|-------------|
| **Calendrier** | `/admin/calendar` | Calendrier académique, vacances, événements |
| **Annonces** | `/admin/announcements` | Publications, priorités, audiences ciblées |

### 📈 Rapports (1 page)
| Page | Chemin | Description |
|------|--------|-------------|
| **Rapports** | `/admin/reports` | KPIs, graphiques, exports PDF/Excel |

### ⚙️ Système (5 pages)
| Page | Chemin | Description |
|------|--------|-------------|
| **Paramètres** | `/admin/settings` | Configuration générale, notifications, apparence |
| **Rôles & Permissions** | `/admin/roles` | Gestion des droits d'accès par module |
| **Logs d'activité** | `/admin/logs` | Journal d'audit, filtres par type/date |
| **Import/Export** | `/admin/import-export` | Import CSV/Excel, export de données |
| **Sauvegarde** | `/admin/backup` | Backups manuels/auto, restauration |

### 🆘 Support (1 page)
| Page | Chemin | Description |
|------|--------|-------------|
| **Support** | `/admin/support` | FAQ, tickets, ressources d'aide |

---

## Installation

### 1. Copier les fichiers

```bash
# Les pages sont dans:
src/pages/admin/

# Le layout est dans:
src/layouts/AdminLayout.jsx

# Les routes sont dans:
src/routes/adminRoutes.js
```

### 2. Mettre à jour App.jsx

Remplacez votre `App.jsx` par `AppWithAdminRoutes.jsx` ou fusionnez les routes:

```jsx
// Dans main.jsx
import App from './AppWithAdminRoutes';
```

### 3. S'assurer que les dépendances sont installées

```bash
npm install lucide-react react-router-dom
```

---

## Structure des fichiers

```
src/
├── layouts/
│   └── AdminLayout.jsx          # Layout avec sidebar navigation
├── pages/
│   └── admin/
│       ├── index.js             # Export de toutes les pages
│       ├── DashboardPage.jsx    # Tableau de bord
│       ├── UsersPage.jsx        # Gestion utilisateurs
│       ├── CoursesPage.jsx      # Gestion cours
│       ├── SubjectsPage.jsx     # Matières
│       ├── CurriculaPage.jsx    # Programmes
│       ├── ClassesPage.jsx      # Classes
│       ├── ExamsPage.jsx        # Examens
│       ├── GradesPage.jsx       # Notes
│       ├── AttendancePage.jsx   # Présences
│       ├── SchedulesPage.jsx    # Emplois du temps
│       ├── SchoolsPage.jsx      # Écoles
│       ├── AgentsPage.jsx       # Agents
│       ├── SalesPage.jsx        # Ventes
│       ├── PaymentsPage.jsx     # Paiements
│       ├── CalendarPage.jsx     # Calendrier
│       ├── AnnouncementsPage.jsx # Annonces
│       ├── ReportsPage.jsx      # Rapports
│       ├── SettingsPage.jsx     # Paramètres
│       ├── RolesPage.jsx        # Rôles & Permissions
│       ├── LogsPage.jsx         # Logs d'activité
│       ├── ImportExportPage.jsx # Import/Export
│       ├── BackupPage.jsx       # Sauvegarde
│       └── SupportPage.jsx      # Support
├── routes/
│   └── adminRoutes.js           # Configuration des routes
└── AppWithAdminRoutes.jsx       # App avec toutes les routes
```

---

## Fonctionnalités par page

### Dashboard (`/admin/dashboard`)
- ✅ Cartes de statistiques (utilisateurs, cours, revenus)
- ✅ Actions rapides
- ✅ Activités récentes
- ✅ Examens à venir
- ✅ Alertes et rappels

### Utilisateurs (`/admin/users`)
- ✅ Liste avec pagination
- ✅ Recherche et filtres (rôle, statut)
- ✅ CRUD complet
- ✅ Actions en masse
- ✅ Activation/désactivation
- ✅ Export/Import

### Cours (`/admin/courses`)
- ✅ Liste avec statistiques
- ✅ Filtres par statut
- ✅ CRUD avec modal
- ✅ Assignation professeurs/écoles

### Notes (`/admin/grades`)
- ✅ Filtres par classe/matière
- ✅ Édition inline
- ✅ Indicateurs de couleur
- ✅ Export des données

### Présences (`/admin/attendance`)
- ✅ Sélection par classe/date
- ✅ Statuts: Présent, Absent, Retard, Excusé
- ✅ Notes par élève
- ✅ Statistiques journalières

### Emplois du temps (`/admin/schedules`)
- ✅ Grille visuelle complète
- ✅ Création/édition de cours
- ✅ Codes couleur par matière
- ✅ Pauses et déjeuner
- ✅ Export PDF

### Calendrier (`/admin/calendar`)
- ✅ Vue mensuelle interactive
- ✅ Types d'événements colorés
- ✅ Événements sur plusieurs jours
- ✅ Liste des événements à venir

### Rapports (`/admin/reports`)
- ✅ KPIs avec tendances
- ✅ Graphiques de performance
- ✅ Distribution des notes
- ✅ Rapports récents téléchargeables

### Paramètres (`/admin/settings`)
- ✅ Onglets: Général, Notifications, Sécurité, Apparence, Email, Backup
- ✅ Toggles et formulaires
- ✅ Upload de logo
- ✅ Choix de couleur principale

### Rôles & Permissions (`/admin/roles`)
- ✅ Liste des rôles avec couleurs
- ✅ Matrice de permissions
- ✅ Création de nouveaux rôles

---

## Personnalisation

### Modifier les couleurs du sidebar

Dans `AdminLayout.jsx`, modifiez les classes Tailwind:

```jsx
// Ligne ~100
<aside className="... bg-slate-900 ...">
```

### Ajouter une nouvelle page

1. Créer le fichier dans `src/pages/admin/`
2. Ajouter l'export dans `src/pages/admin/index.js`
3. Ajouter la route dans `adminRoutes.js`
4. Ajouter le lien dans le menu de `AdminLayout.jsx`

### Connecter à l'API

Chaque page utilise des données simulées (`useState` avec `useEffect`). Remplacez par vos appels API:

```jsx
// Avant (données simulées)
useEffect(() => {
  const sampleData = [...];
  setTimeout(() => {
    setData(sampleData);
    setLoading(false);
  }, 500);
}, []);

// Après (API réelle)
useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await fetch('/api/endpoint');
      const data = await response.json();
      setData(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  fetchData();
}, []);
```

---

## Pages supplémentaires suggérées

Voici des pages que vous pourriez ajouter:

### Pédagogie avancée
- `/admin/lessons` - Gestion des leçons par cours
- `/admin/assignments` - Devoirs et travaux
- `/admin/certificates` - Génération de certificats
- `/admin/transcript` - Relevés de notes

### Communication
- `/admin/messages` - Messagerie interne
- `/admin/notifications` - Centre de notifications
- `/admin/emails` - Templates d'emails

### Finance
- `/admin/invoices` - Facturation
- `/admin/scholarships` - Bourses d'études
- `/admin/expenses` - Dépenses

### RH
- `/admin/teachers` - Profils professeurs détaillés
- `/admin/contracts` - Contrats de travail
- `/admin/leaves` - Gestion des congés

---

## Technologies utilisées

- **React 18** - Framework UI
- **React Router 6** - Navigation
- **Tailwind CSS 3** - Styling
- **Lucide React** - Icônes (150+ utilisées)
- **Lazy Loading** - Performance optimisée

---

## Support

Pour toute question, consultez la page Support intégrée (`/admin/support`) ou contactez l'équipe de développement.
