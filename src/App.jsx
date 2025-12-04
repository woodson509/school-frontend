/**
 * Main App Component
 * Handles routing and authentication guards with three-tier access:
 * - SuperAdmin: System-wide management
 * - Admin: School-level management
 * - Regular users: Basic access
 */

import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Loader } from 'lucide-react';

// Layouts
import AdminLayout from './layouts/AdminLayout';
import SuperAdminLayout from './layouts/SuperAdminLayout';
import StudentLayout from './layouts/StudentLayout';
import TeacherLayout from './layouts/TeacherLayout';

// Regular imports for critical pages
import LoginPage from './pages/LoginPage';
import CoursesPage from './pages/CoursesPage';
import ExamPage from './pages/ExamPage';

// Lazy imports for admin pages
const AdminDashboardPage = lazy(() => import('./pages/admin/DashboardPage'));
const AdminUsersPage = lazy(() => import('./pages/admin/UsersPage'));
const AdminCoursesPage = lazy(() => import('./pages/admin/CoursesPage'));
const AdminCourseDetailsPage = lazy(() => import('./pages/admin/CourseDetailsPage'));
const AdminSubjectsPage = lazy(() => import('./pages/admin/SubjectsPage'));
const AdminCurriculaPage = lazy(() => import('./pages/admin/CurriculaPage'));
const AdminClassesPage = lazy(() => import('./pages/admin/ClassesPage'));
const AdminExamsPage = lazy(() => import('./pages/admin/ExamsPage'));
const AdminGradesPage = lazy(() => import('./pages/admin/GradesPage'));
const AdminAttendancePage = lazy(() => import('./pages/admin/AttendancePage'));
const AdminSchedulesPage = lazy(() => import('./pages/admin/SchedulesPage'));
const AdminPaymentsPage = lazy(() => import('./pages/admin/PaymentsPage'));
const AdminCalendarPage = lazy(() => import('./pages/admin/CalendarPage'));
const AdminAnnouncementsPage = lazy(() => import('./pages/admin/AnnouncementsPage'));
const AdminReportsPage = lazy(() => import('./pages/admin/ReportsPage'));
const AdminSettingsPage = lazy(() => import('./pages/admin/SettingsPage'));
const AdminCompetenciesPage = lazy(() => import('./pages/admin/CompetenciesPage'));
const AdminBadgesPage = lazy(() => import('./pages/admin/BadgesPage'));
const AdminAnalyticsDashboard = lazy(() => import('./pages/admin/AnalyticsDashboard'));
const AdminImportExportPage = lazy(() => import('./pages/admin/ImportExportPage'));
const AdminSupportPage = lazy(() => import('./pages/admin/SupportPage'));

// Lazy imports for superadmin pages
const SuperAdminDashboardPage = lazy(() => import('./pages/superadmin/DashboardPage'));
const SuperAdminSchoolsPage = lazy(() => import('./pages/superadmin/SchoolsPage'));
const SuperAdminAgentsPage = lazy(() => import('./pages/superadmin/AgentsPage'));
const SuperAdminSalesPage = lazy(() => import('./pages/superadmin/SalesPage'));
const SuperAdminUsersPage = lazy(() => import('./pages/superadmin/UsersPage'));
const SuperAdminRolesPage = lazy(() => import('./pages/superadmin/RolesPage'));
const SuperAdminLogsPage = lazy(() => import('./pages/superadmin/LogsPage'));
const SuperAdminBackupPage = lazy(() => import('./pages/superadmin/BackupPage'));

// Lazy imports for student pages
const StudentDashboardPage = lazy(() => import('./pages/student/DashboardPage'));
const StudentCoursesPage = lazy(() => import('./pages/student/CoursesPage'));
const StudentSchedulePage = lazy(() => import('./pages/student/SchedulePage'));
const StudentAssignmentsPage = lazy(() => import('./pages/student/AssignmentsPage'));
const StudentExamsPage = lazy(() => import('./pages/student/ExamsPage'));
const StudentGradesPage = lazy(() => import('./pages/student/GradesPage'));
const StudentAttendancePage = lazy(() => import('./pages/student/AttendancePage'));
const StudentPlannerPage = lazy(() => import('./pages/student/PlannerPage'));
const StudentNotesPage = lazy(() => import('./pages/student/NotesPage'));
const StudentPracticePage = lazy(() => import('./pages/student/PracticePage'));
const StudentResourcesPage = lazy(() => import('./pages/student/ResourcesPage'));
const StudentBookmarksPage = lazy(() => import('./pages/student/BookmarksPage'));
const StudentForumPage = lazy(() => import('./pages/student/ForumPage'));
const StudentGroupsPage = lazy(() => import('./pages/student/GroupsPage'));
const StudentMessagesPage = lazy(() => import('./pages/student/MessagesPage'));
const StudentCalendarPage = lazy(() => import('./pages/student/CalendarPage'));
const StudentAnnouncementsPage = lazy(() => import('./pages/student/AnnouncementsPage'));
const StudentCertificatesPage = lazy(() => import('./pages/student/CertificatesPage'));
const StudentProgressPage = lazy(() => import('./pages/student/ProgressPage'));
const StudentHelpPage = lazy(() => import('./pages/student/HelpPage'));
const StudentProfilePage = lazy(() => import('./pages/student/ProfilePage'));

// Lazy imports for teacher pages
const TeacherDashboardPage = lazy(() => import('./pages/teacher/DashboardPage'));
const TeacherClassesPage = lazy(() => import('./pages/teacher/ClassesPage'));
const TeacherCoursesPage = lazy(() => import('./pages/teacher/CoursesPage'));
const TeacherSchedulePage = lazy(() => import('./pages/teacher/SchedulePage'));
const TeacherPlannerPage = lazy(() => import('./pages/teacher/PlannerPage'));
const TeacherLessonPlannerPage = lazy(() => import('./pages/teacher/LessonPlannerPage'));
const TeacherLibraryPage = lazy(() => import('./pages/teacher/LibraryPage'));
const TeacherAssignmentsPage = lazy(() => import('./pages/teacher/AssignmentsPage'));
const TeacherCreateAssignmentPage = lazy(() => import('./pages/teacher/CreateAssignmentPage'));
const TeacherExamsPage = lazy(() => import('./pages/teacher/ExamsPage'));
const TeacherCreateExamPage = lazy(() => import('./pages/teacher/CreateExamPage'));
const TeacherQuizBuilderPage = lazy(() => import('./pages/teacher/QuizBuilderPage'));
const TeacherQuestionBankPage = lazy(() => import('./pages/teacher/QuestionBankPage'));
const TeacherGradingPage = lazy(() => import('./pages/teacher/GradingPage'));
const TeacherGradesPage = lazy(() => import('./pages/teacher/GradesPage'));
const TeacherAttendancePage = lazy(() => import('./pages/teacher/AttendancePage'));
const TeacherReportsPage = lazy(() => import('./pages/teacher/ReportsPage'));
const TeacherStudentsPage = lazy(() => import('./pages/teacher/StudentsPage'));
const TeacherGroupsPage = lazy(() => import('./pages/teacher/GroupsPage'));
const TeacherClassAnalyticsPage = lazy(() => import('./pages/teacher/ClassAnalyticsPage'));
const TeacherFeedbackPage = lazy(() => import('./pages/teacher/FeedbackPage'));
const TeacherMessagesPage = lazy(() => import('./pages/teacher/MessagesPage'));
const TeacherAnnouncementsPage = lazy(() => import('./pages/teacher/AnnouncementsPage'));
const TeacherPortfolioPage = lazy(() => import('./pages/teacher/PortfolioPage'));
const TeacherHelpPage = lazy(() => import('./pages/teacher/HelpPage'));
const TeacherProfilePage = lazy(() => import('./pages/teacher/ProfilePage'));

// Loading fallback component
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <Loader className="w-12 h-12 animate-spin text-blue-600" />
  </div>
);

// Protected Route Component
const ProtectedRoute = ({ children, adminOnly = false, superAdminOnly = false }) => {
  const { isAuthenticated, loading, isAdmin, isSuperAdmin } = useAuth();

  if (loading) {
    return <LoadingFallback />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (superAdminOnly && !isSuperAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  if (adminOnly && !isAdmin && !isSuperAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// Public Route Component (redirect if already logged in)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingFallback />;
  }

  return !isAuthenticated ? children : <Navigate to="/dashboard" replace />;
};

// App Routes Component
const AppRoutes = () => {
  const { isSuperAdmin, isAdmin, isTeacher, loading, isAuthenticated } = useAuth();

  // DEBUG: Log role detection
  console.log('🔍 AppRoutes - Role Detection:');
  console.log('  isAuthenticated:', isAuthenticated);
  console.log('  isSuperAdmin:', isSuperAdmin);
  console.log('  isAdmin:', isAdmin);
  console.log('  isTeacher:', isTeacher);

  // Show loading while checking auth
  if (loading) {
    return <LoadingFallback />;
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />

      {/* Authenticated Routes - Three tiers */}
      {isAuthenticated && (
        <>
          {/* SuperAdmin Routes */}
          {isSuperAdmin ? (
            <Route
              path="/"
              element={
                <ProtectedRoute superAdminOnly>
                  <Suspense fallback={<LoadingFallback />}>
                    <SuperAdminLayout />
                  </Suspense>
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<SuperAdminDashboardPage />} />

              {/* Management Routes */}
              <Route path="schools" element={<SuperAdminSchoolsPage />} />
              <Route path="users" element={<SuperAdminUsersPage />} />
              <Route path="agents" element={<SuperAdminAgentsPage />} />
              <Route path="sales" element={<SuperAdminSalesPage />} />

              {/* System Routes */}
              <Route path="roles" element={<SuperAdminRolesPage />} />
              <Route path="logs" element={<SuperAdminLogsPage />} />
              <Route path="backup" element={<SuperAdminBackupPage />} />
            </Route>
          ) : isAdmin ? (
            /* Admin Routes */
            <Route
              path="/"
              element={
                <ProtectedRoute adminOnly>
                  <Suspense fallback={<LoadingFallback />}>
                    <AdminLayout />
                  </Suspense>
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboardPage />} />

              {/* Academic Routes */}
              <Route path="users" element={<AdminUsersPage />} />
              <Route path="courses" element={<AdminCoursesPage />} />
              <Route path="courses/:id" element={<AdminCourseDetailsPage />} />
              <Route path="subjects" element={<AdminSubjectsPage />} />
              <Route path="curricula" element={<AdminCurriculaPage />} />
              <Route path="classes" element={<AdminClassesPage />} />
              <Route path="exams" element={<AdminExamsPage />} />
              <Route path="grades" element={<AdminGradesPage />} />
              <Route path="competencies" element={<AdminCompetenciesPage />} />
              <Route path="competencies" element={<AdminCompetenciesPage />} />
              <Route path="report-cards" element={<AdminReportsPage />} />
              <Route path="badges" element={<AdminBadgesPage />} />
              <Route path="analytics" element={<AdminAnalyticsDashboard />} />
              <Route path="attendance" element={<AdminAttendancePage />} />
              <Route path="schedules" element={<AdminSchedulesPage />} />

              {/* Financial */}
              <Route path="payments" element={<AdminPaymentsPage />} />

              {/* Calendar & Communication */}
              <Route path="calendar" element={<AdminCalendarPage />} />
              <Route path="announcements" element={<AdminAnnouncementsPage />} />

              {/* Settings & Tools */}
              <Route path="settings" element={<AdminSettingsPage />} />
              <Route path="import-export" element={<AdminImportExportPage />} />
              <Route path="support" element={<AdminSupportPage />} />

              {/* Exam route */}
              <Route path="exams/:examId" element={<ExamPage />} />
            </Route>
          ) : isTeacher ? (
            /* Teacher Routes */
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Suspense fallback={<LoadingFallback />}>
                    <TeacherLayout />
                  </Suspense>
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<TeacherDashboardPage />} />

              {/* Teaching Routes */}
              <Route path="classes" element={<TeacherClassesPage />} />
              <Route path="courses" element={<TeacherCoursesPage />} />
              <Route path="schedule" element={<TeacherSchedulePage />} />
              <Route path="planner" element={<TeacherPlannerPage />} />
              <Route path="lesson-planner" element={<TeacherLessonPlannerPage />} />
              <Route path="library" element={<TeacherLibraryPage />} />

              {/* Content Creation Routes */}
              <Route path="assignments" element={<TeacherAssignmentsPage />} />
              <Route path="create-assignment" element={<TeacherCreateAssignmentPage />} />
              <Route path="exams" element={<TeacherExamsPage />} />
              <Route path="create-exam" element={<TeacherCreateExamPage />} />
              <Route path="quiz-builder" element={<TeacherQuizBuilderPage />} />
              <Route path="question-bank" element={<TeacherQuestionBankPage />} />

              {/* Evaluation Routes */}
              <Route path="grading" element={<TeacherGradingPage />} />
              <Route path="grades" element={<TeacherGradesPage />} />
              <Route path="attendance" element={<TeacherAttendancePage />} />
              <Route path="reports" element={<TeacherReportsPage />} />

              {/* Students Routes */}
              <Route path="students" element={<TeacherStudentsPage />} />
              <Route path="groups" element={<TeacherGroupsPage />} />
              <Route path="class-analytics" element={<TeacherClassAnalyticsPage />} />
              <Route path="feedback" element={<TeacherFeedbackPage />} />

              {/* Communication Routes */}
              <Route path="messages" element={<TeacherMessagesPage />} />
              <Route path="announcements" element={<TeacherAnnouncementsPage />} />

              {/* Other Routes */}
              <Route path="portfolio" element={<TeacherPortfolioPage />} />
              <Route path="help" element={<TeacherHelpPage />} />
              <Route path="profile" element={<TeacherProfilePage />} />

              {/* Exam route */}
              <Route path="exams/:examId" element={<ExamPage />} />
            </Route>
          ) : (
            /* Student Routes */
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Suspense fallback={<LoadingFallback />}>
                    <StudentLayout />
                  </Suspense>
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<StudentDashboardPage />} />

              {/* Learning Routes */}
              <Route path="courses" element={<StudentCoursesPage />} />
              <Route path="schedule" element={<StudentSchedulePage />} />
              <Route path="assignments" element={<StudentAssignmentsPage />} />
              <Route path="exams" element={<StudentExamsPage />} />
              <Route path="grades" element={<StudentGradesPage />} />
              <Route path="attendance" element={<StudentAttendancePage />} />

              {/* Study Tools Routes */}
              <Route path="planner" element={<StudentPlannerPage />} />
              <Route path="notes" element={<StudentNotesPage />} />
              <Route path="practice" element={<StudentPracticePage />} />
              <Route path="resources" element={<StudentResourcesPage />} />
              <Route path="bookmarks" element={<StudentBookmarksPage />} />

              {/* Community Routes */}
              <Route path="forum" element={<StudentForumPage />} />
              <Route path="groups" element={<StudentGroupsPage />} />
              <Route path="messages" element={<StudentMessagesPage />} />

              {/* Other Routes */}
              <Route path="calendar" element={<StudentCalendarPage />} />
              <Route path="announcements" element={<StudentAnnouncementsPage />} />
              <Route path="certificates" element={<StudentCertificatesPage />} />
              <Route path="progress" element={<StudentProgressPage />} />
              <Route path="help" element={<StudentHelpPage />} />
              <Route path="profile" element={<StudentProfilePage />} />

              {/* Exam route */}
              <Route path="exams/:examId" element={<ExamPage />} />
            </Route>
          )}
        </>
      )}

      {/* Redirect non-authenticated to login */}
      {!isAuthenticated && (
        <Route path="*" element={<Navigate to="/login" replace />} />
      )}

      {/* 404 Not Found */}
      <Route
        path="*"
        element={
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
              <p className="text-xl text-gray-600 mb-8">Page not found</p>
              <a
                href="/dashboard"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Go to Dashboard
              </a>
            </div>
          </div>
        }
      />
    </Routes>
  );
};

// Main App Component
function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;
