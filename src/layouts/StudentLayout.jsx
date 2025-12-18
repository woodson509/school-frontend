/**
 * Student Layout
 * Main layout for student dashboard with sidebar navigation
 */

import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  FileText,
  GraduationCap,
  Calendar,
  ClipboardList,
  BarChart3,
  Bell,
  User,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Award,
  MessageSquare,
  Clock,
  Target,
  BookMarked,
  HelpCircle,
  Folder,
  Users,
  PenTool,
  Lightbulb,
  CheckCircle,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const StudentLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState(['learning', 'tools']);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    {
      name: 'Tableau de bord',
      path: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      name: 'Mes Cours',
      path: '/courses',
      icon: BookOpen,
    },
    {
      name: 'Devoirs',
      path: '/assignments',
      icon: ClipboardList,
    },
    {
      name: 'Examens',
      path: '/exams',
      icon: FileText,
    },
    {
      name: 'Notes',
      path: '/grades',
      icon: BarChart3,
    },
    {
      name: 'Emploi du temps',
      path: '/schedule',
      icon: Calendar,
    },
    {
      name: 'Messages',
      path: '/messages',
      icon: MessageSquare,
    },
    {
      name: 'Calendrier',
      path: '/calendar',
      icon: Calendar,
    },
    {
      name: 'Annonces',
      path: '/announcements',
      icon: Bell,
    },
    {
      name: 'Apprentissage',
      icon: BookOpen,
      key: 'learning',
      submenu: [
        { name: 'Mes cours', path: '/courses', icon: BookOpen },
        { name: 'Mon emploi du temps', path: '/schedule', icon: Calendar },
        { name: 'Mes devoirs', path: '/assignments', icon: ClipboardList },
        { name: 'Mes examens', path: '/exams', icon: FileText },
        { name: 'Mes notes', path: '/grades', icon: BarChart3 },
        { name: 'Compétences', path: '/competencies', icon: Target },
        { name: 'Mes badges', path: '/badges', icon: Award },
        { name: 'Mes présences', path: '/attendance', icon: Clock },
      ],
    },
    {
      name: 'Outils d\'étude',
      icon: Lightbulb,
      key: 'tools',
      submenu: [
        { name: 'Planificateur', path: '/planner', icon: Target },
        { name: 'Mes notes perso', path: '/notes', icon: PenTool },
        { name: 'Quiz d\'entraînement', path: '/practice', icon: GraduationCap },
        { name: 'Ressources', path: '/resources', icon: Folder },
        { name: 'Favoris', path: '/bookmarks', icon: BookMarked },
      ],
    },
    {
      name: 'Communauté',
      icon: Users,
      key: 'community',
      submenu: [
        { name: 'Forum', path: '/forum', icon: MessageSquare },
        { name: 'Groupes d\'étude', path: '/groups', icon: Users },
        { name: 'Messages', path: '/messages', icon: MessageSquare },
      ],
    },
    {
      name: 'Certificats',
      path: '/certificates',
      icon: Award,
    },
    {
      name: 'Progression',
      path: '/progress',
      icon: BarChart3,
    },
    {
      name: 'Aide',
      path: '/help',
      icon: HelpCircle,
    },
  ];

  const toggleSubmenu = (key) => {
    setExpandedMenus(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const NavItem = ({ item }) => {
    if (item.submenu) {
      const isExpanded = expandedMenus.includes(item.key);
      return (
        <div>
          <button
            onClick={() => toggleSubmenu(item.key)}
            className="w-full flex items-center justify-between px-4 py-3 text-gray-300 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <div className="flex items-center gap-3">
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.name}</span>
            </div>
            <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
          </button>
          {isExpanded && (
            <div className="ml-4 mt-1 space-y-1">
              {item.submenu.map((subitem) => (
                <NavLink
                  key={subitem.path}
                  to={subitem.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${isActive
                      ? 'bg-emerald-600 text-white'
                      : 'text-gray-400 hover:bg-slate-800 hover:text-white'
                    }`
                  }
                >
                  <subitem.icon className="w-4 h-4" />
                  <span className="text-sm">{subitem.name}</span>
                </NavLink>
              ))}
            </div>
          )}
        </div>
      );
    }

    return (
      <NavLink
        to={item.path}
        className={({ isActive }) =>
          `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
            ? 'bg-emerald-600 text-white'
            : 'text-gray-300 hover:bg-slate-800'
          }`
        }
      >
        <item.icon className="w-5 h-5" />
        <span className="font-medium">{item.name}</span>
      </NavLink>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-slate-900 text-white rounded-lg"
      >
        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 transform transition-transform duration-300 ease-in-out ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:translate-x-0`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-white">EduPortal</h1>
            <p className="text-xs text-gray-400">Espace Étudiant</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-180px)]">
          {menuItems.map((item) => (
            <NavItem key={item.path || item.key} item={item} />
          ))}
        </nav>

        {/* User Profile */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
              <span className="text-white font-semibold">
                {user?.name?.charAt(0) || 'E'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {user?.full_name || 'Étudiant'}
              </p>
              <p className="text-xs text-gray-400 truncate">
                {user?.role === 'student' ? 'Élève' : 'Étudiant'}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <NavLink
              to="/profile"
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-gray-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              <User className="w-4 h-4" />
              <span className="text-sm">Profil</span>
            </NavLink>
            <button
              onClick={logout}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-gray-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm">Quitter</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="lg:ml-64 min-h-screen">
        {/* Header */}
        <header className="bg-white shadow-sm sticky top-0 z-20">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="lg:hidden w-10" />
            <h2 className="text-xl font-semibold text-gray-800">
              Bienvenue, {user?.full_name?.split(' ')[0] || 'Étudiant'} 👋
            </h2>
            <div className="flex items-center gap-4">
              <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  3
                </span>
              </button>
              <NavLink
                to="/profile"
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
              >
                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                  <User className="w-4 h-4 text-emerald-600" />
                </div>
              </NavLink>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default StudentLayout;
