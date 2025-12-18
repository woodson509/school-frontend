/**
 * Teacher Layout
 * Main layout for teacher/professor dashboard
 * Color scheme: Indigo/Purple (different from admin blue and student emerald)
 */

import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  LayoutDashboard,
  BookOpen,
  Calendar,
  Users,
  ClipboardList,
  FileText,
  BarChart3,
  Clock,
  PenTool,
  GraduationCap,
  Folder,
  MessageSquare,
  Bell,
  HelpCircle,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown,
  User,
  CheckSquare,
  Database,
  FileCheck,
  Target,
  TrendingUp,
  Layers,
  Share2,
  Lightbulb,
  BookMarked,
  Award,
} from 'lucide-react';

const TeacherLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState(['teaching']);
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const toggleMenu = (menuId) => {
    setExpandedMenus(prev =>
      prev.includes(menuId)
        ? prev.filter(id => id !== menuId)
        : [...prev, menuId]
    );
  };

  const menuItems = [
    {
      id: 'teaching',
      label: 'Enseignement',
      icon: BookOpen,
      children: [
        { path: '/courses', label: 'Mes cours', icon: BookOpen },
        { path: '/subjects', label: 'Matières', icon: BookMarked },
        { path: '/curricula', label: 'Programmes', icon: Layers },
        { path: '/classes', label: 'Mes classes', icon: Users },
        { path: '/schedule', label: 'Emploi du temps', icon: Calendar },
        { path: '/lesson-planner', label: 'Planificateur', icon: Target },
        { path: '/library', label: 'Ressources', icon: Folder },
      ],
    },
    {
      id: 'evaluation',
      label: 'Évaluation',
      icon: ClipboardList,
      children: [
        { path: '/assignments', label: 'Devoirs', icon: FileText },
        { path: '/grading', label: 'Correction', icon: FileCheck },
        { path: '/exams', label: 'Examens', icon: ClipboardList },
        { path: '/competencies', label: 'Compétences', icon: Target },
        { path: '/badges', label: 'Badges', icon: Award },
        { path: '/quiz-builder', label: 'Créateur de quiz', icon: Lightbulb },
        { path: '/question-bank', label: 'Banque de questions', icon: Database },
        { path: '/grades', label: 'Notes', icon: BarChart3 },
      ],
    },
    {
      id: 'students',
      label: 'Suivi élèves',
      icon: Users,
      children: [
        { path: '/students', label: 'Liste élèves', icon: Users },
        { path: '/attendance', label: 'Présences', icon: CheckSquare },
        { path: '/student-progress', label: 'Suivi individuel', icon: TrendingUp },
        { path: '/class-analytics', label: 'Analyse de classe', icon: BarChart3 },
        { path: '/reports', label: 'Bulletins', icon: FileText },
      ],
    },
    {
      id: 'communication',
      label: 'Communication',
      icon: MessageSquare,
      children: [
        { path: '/messages', label: 'Messages', icon: MessageSquare },
        { path: '/announcements', label: 'Annonces', icon: Bell },
        { path: '/parent-reports', label: 'Rapports parents', icon: FileText },
      ],
    },
    {
      id: 'tools',
      label: 'Outils',
      icon: Layers,
      children: [
        { path: '/calendar', label: 'Calendrier', icon: Calendar },
        { path: '/collaboration', label: 'Collaboration', icon: Share2 },
        { path: '/my-library', label: 'Ma bibliothèque', icon: BookMarked },
      ],
    },
  ];

  const bottomMenuItems = [
    { path: '/profile', label: 'Mon profil', icon: User },
    { path: '/settings', label: 'Paramètres', icon: Settings },
    { path: '/help', label: 'Aide', icon: HelpCircle },
  ];

  const NavItem = ({ item, isChild = false }) => (
    <NavLink
      to={item.path}
      onClick={() => setSidebarOpen(false)}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all ${isChild ? 'ml-4' : ''
        } ${isActive
          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
          : 'text-gray-300 hover:bg-indigo-500/20 hover:text-white'
        }`
      }
    >
      <item.icon className="w-5 h-5" />
      <span className="text-sm font-medium">{item.label}</span>
    </NavLink>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-72 bg-gradient-to-b from-indigo-900 via-indigo-800 to-purple-900 transform transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-3 px-6 py-5 border-b border-indigo-700/50">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">EduPortal</h1>
              <p className="text-xs text-indigo-300">Espace Enseignant</p>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="ml-auto lg:hidden text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4 px-3">
            {/* Dashboard */}
            <NavLink
              to="/dashboard"
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-all ${isActive
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                  : 'text-gray-300 hover:bg-indigo-500/20 hover:text-white'
                }`
              }
            >
              <LayoutDashboard className="w-5 h-5" />
              <span className="font-medium">Tableau de bord</span>
            </NavLink>

            {/* Menu Groups */}
            {menuItems.map((group) => (
              <div key={group.id} className="mb-2">
                <button
                  onClick={() => toggleMenu(group.id)}
                  className="flex items-center justify-between w-full px-4 py-2.5 text-gray-300 hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <group.icon className="w-5 h-5" />
                    <span className="text-sm font-medium">{group.label}</span>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${expandedMenus.includes(group.id) ? 'rotate-180' : ''
                      }`}
                  />
                </button>
                {expandedMenus.includes(group.id) && (
                  <div className="mt-1 space-y-1">
                    {group.children.map((item) => (
                      <NavItem key={item.path} item={item} isChild />
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Divider */}
            <div className="my-4 border-t border-indigo-700/50" />

            {/* Bottom Menu */}
            <div className="space-y-1">
              {bottomMenuItems.map((item) => (
                <NavItem key={item.path} item={item} />
              ))}
            </div>
          </nav>

          {/* User Profile */}
          <div className="p-4 border-t border-indigo-700/50">
            <div className="flex items-center gap-3 px-3 py-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                {user?.full_name?.charAt(0) || 'P'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{user?.full_name || 'Professeur'}</p>
                <p className="text-xs text-indigo-300 truncate">Enseignant</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-2 w-full mt-3 px-4 py-2 text-sm text-indigo-300 hover:text-white hover:bg-indigo-500/20 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Déconnexion
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:ml-72">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-white shadow-sm">
          <div className="flex items-center justify-between px-4 lg:px-8 py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
              >
                <Menu className="w-6 h-6" />
              </button>
              <div>
                <h2 className="text-xl font-bold text-gray-800">Bonjour, {user?.full_name || 'Professeur'} 👋</h2>
                <p className="text-sm text-gray-500">Bienvenue sur votre espace enseignant</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button className="relative p-2 hover:bg-gray-100 rounded-lg">
                <Bell className="w-6 h-6 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </button>
              <button className="relative p-2 hover:bg-gray-100 rounded-lg">
                <MessageSquare className="w-6 h-6 text-gray-600" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-indigo-600 text-white text-xs rounded-full flex items-center justify-center">
                  5
                </span>
              </button>
              <div className="hidden md:flex items-center gap-2 pl-3 border-l border-gray-200">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-semibold">
                  MD
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default TeacherLayout;
