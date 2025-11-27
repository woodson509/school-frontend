/**
 * Admin Layout Component
 * Provides sidebar navigation and header for all admin pages
 */

import { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  FileText,
  GraduationCap,
  Calendar,
  ClipboardList,
  BarChart3,
  Settings,
  Bell,
  Building2,
  UserCog,
  DollarSign,
  Shield,
  History,
  MessageSquare,
  Database,
  HelpCircle,
  Menu,
  X,
  LogOut,
  ChevronDown,
  ChevronRight,
  School,
  Layers,
  BookMarked,
  Clock,
  Award,
  CreditCard,
  FileSpreadsheet,
  Megaphone,
} from 'lucide-react';

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [expandedMenus, setExpandedMenus] = useState(['academic', 'management']);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleMenu = (menuId) => {
    setExpandedMenus(prev =>
      prev.includes(menuId)
        ? prev.filter(id => id !== menuId)
        : [...prev, menuId]
    );
  };

  const isActive = (path) => location.pathname === path;
  const isMenuActive = (paths) => paths.some(path => location.pathname.startsWith(path));

  // Navigation menu structure
  const menuItems = [
    {
      id: 'dashboard',
      label: 'Tableau de bord',
      icon: LayoutDashboard,
      path: '/dashboard',
    },
    {
      id: 'academic',
      label: 'Pédagogie',
      icon: GraduationCap,
      submenu: [
        { label: 'Utilisateurs', icon: Users, path: '/users' },
        { label: 'Cours', icon: BookOpen, path: '/courses' },
        { label: 'Matières', icon: BookMarked, path: '/subjects' },
        { label: 'Programmes', icon: Layers, path: '/curricula' },
        { label: 'Classes', icon: School, path: '/classes' },
        { label: 'Examens', icon: FileText, path: '/exams' },
        { label: 'Notes', icon: Award, path: '/grades' },
        { label: 'Présences', icon: ClipboardList, path: '/attendance' },
        { label: 'Emplois du temps', icon: Clock, path: '/schedules' },
      ],
    },
    {
      id: 'financial',
      label: 'Finance',
      icon: CreditCard,
      path: '/payments',
    },
    {
      id: 'calendar',
      label: 'Calendrier',
      icon: Calendar,
      path: '/calendar',
    },
    {
      id: 'announcements',
      label: 'Annonces',
      icon: Megaphone,
      path: '/announcements',
    },
    {
      id: 'reports',
      label: 'Rapports',
      icon: BarChart3,
      path: '/reports',
    },
    {
      id: 'settings',
      label: 'Paramètres',
      icon: Settings,
      path: '/settings',
    },
    {
      id: 'tools',
      label: 'Outils',
      icon: FileSpreadsheet,
      submenu: [
        { label: 'Import/Export', icon: FileSpreadsheet, path: '/import-export' },
        { label: 'Support', icon: HelpCircle, path: '/support' },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile sidebar toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md"
      >
        {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen transition-transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:translate-x-0`}
      >
        <div className="h-full w-64 bg-slate-900 text-white flex flex-col">
          {/* Logo */}
          <div className="p-6 border-b border-slate-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-lg">School LMS</h1>
                <p className="text-xs text-slate-400">Administration</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4 px-3">
            {menuItems.map((item) => (
              <div key={item.id} className="mb-1">
                {item.submenu ? (
                  // Menu with submenu
                  <>
                    <button
                      onClick={() => toggleMenu(item.id)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${isMenuActive(item.submenu.map(s => s.path))
                        ? 'bg-slate-800 text-white'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon className="w-5 h-5" />
                        <span className="text-sm font-medium">{item.label}</span>
                      </div>
                      {expandedMenus.includes(item.id) ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </button>

                    {/* Submenu */}
                    {expandedMenus.includes(item.id) && (
                      <div className="mt-1 ml-4 space-y-1">
                        {item.submenu.map((subItem) => (
                          <Link
                            key={subItem.path}
                            to={subItem.path}
                            className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition-colors ${isActive(subItem.path)
                              ? 'bg-blue-600 text-white'
                              : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                              }`}
                          >
                            <subItem.icon className="w-4 h-4" />
                            {subItem.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  // Single menu item
                  <Link
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive(item.path)
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                      }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </Link>
                )}
              </div>
            ))}
          </nav>

          {/* User Section */}
          <div className="p-4 border-t border-slate-700">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="font-bold text-sm">
                  {user?.full_name?.charAt(0) || 'A'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user?.full_name}</p>
                <p className="text-xs text-slate-400 truncate">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-medium transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Déconnexion
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`${sidebarOpen ? 'lg:ml-64' : ''} transition-all`}>
        {/* Top Header */}
        <header className="bg-white shadow-sm sticky top-0 z-30">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="hidden lg:block p-2 hover:bg-gray-100 rounded-lg"
              >
                <Menu className="w-5 h-5 text-gray-600" />
              </button>
              <h2 className="text-xl font-semibold text-gray-800">
                {getPageTitle(location.pathname)}
              </h2>
            </div>

            <div className="flex items-center gap-4">
              {/* Notifications */}
              <button className="relative p-2 hover:bg-gray-100 rounded-lg">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* Messages */}
              <button className="relative p-2 hover:bg-gray-100 rounded-lg">
                <MessageSquare className="w-5 h-5 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full"></span>
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

// Helper function to get page title
const getPageTitle = (pathname) => {
  const titles = {
    '/dashboard': 'Tableau de bord',
    '/users': 'Gestion des utilisateurs',
    '/courses': 'Gestion des cours',
    '/subjects': 'Gestion des matières',
    '/curricula': 'Programmes scolaires',
    '/classes': 'Gestion des classes',
    '/exams': 'Gestion des examens',
    '/grades': 'Gestion des notes',
    '/attendance': 'Gestion des présences',
    '/schedules': 'Emplois du temps',
    '/payments': 'Paiements & Frais',
    '/calendar': 'Calendrier académique',
    '/announcements': 'Annonces',
    '/reports': 'Rapports & Statistiques',
    '/settings': 'Paramètres',
    '/import-export': 'Import / Export',
    '/support': 'Support',
  };
  return titles[pathname] || 'Administration';
};

export default AdminLayout;
