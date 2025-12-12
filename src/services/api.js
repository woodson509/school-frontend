/**
 * API Service
 * Handles all HTTP requests to the backend with error handling
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

/**
 * Generic fetch wrapper with error handling
 */
const fetchWithAuth = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');

  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      // Handle specific error cases
      if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    // Check if offline
    if (!navigator.onLine) {
      throw new Error('You are offline. Please check your internet connection.');
    }
    throw error;
  }
};

/**
 * Authentication APIs
 */
export const authAPI = {
  login: async (email, password) => {
    return fetchWithAuth('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  register: async (userData) => {
    return fetchWithAuth('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  getProfile: async () => {
    return fetchWithAuth('/auth/me');
  },
};

/**
 * Course APIs
 */
export const courseAPI = {
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return fetchWithAuth(`/courses${queryString ? `?${queryString}` : ''}`);
  },

  getById: async (id) => {
    return fetchWithAuth(`/courses/${id}`);
  },

  create: async (courseData) => {
    return fetchWithAuth('/courses', {
      method: 'POST',
      body: JSON.stringify(courseData),
    });
  },

  update: async (id, courseData) => {
    return fetchWithAuth(`/courses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(courseData),
    });
  },

  delete: async (id) => {
    return fetchWithAuth(`/courses/${id}`, {
      method: 'DELETE',
    });
  },
};

/**
 * Exam APIs
 */
export const examAPI = {
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return fetchWithAuth(`/exams${queryString ? `?${queryString}` : ''}`);
  },

  getById: async (id) => {
    return fetchWithAuth(`/exams/${id}`);
  },

  create: async (examData) => {
    return fetchWithAuth('/exams', {
      method: 'POST',
      body: JSON.stringify(examData),
    });
  },

  update: async (id, examData) => {
    return fetchWithAuth(`/exams/${id}`, {
      method: 'PUT',
      body: JSON.stringify(examData),
    });
  },

  delete: async (id) => {
    return fetchWithAuth(`/exams/${id}`, {
      method: 'DELETE',
    });
  },

  start: async (examId) => {
    return fetchWithAuth(`/exams/${examId}/start`, {
      method: 'POST',
    });
  },

  submit: async (examId, answers) => {
    return fetchWithAuth(`/exams/${examId}/submit`, {
      method: 'POST',
      body: JSON.stringify({ answers }),
    });
  },

  getAttempts: async (examId) => {
    return fetchWithAuth(`/exams/${examId}/attempts`);
  },
};

/**
 * Agent/Sales APIs
 */
export const agentAPI = {
  // Agent Management
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return fetchWithAuth(`/agents${queryString ? `?${queryString}` : ''}`);
  },

  getById: async (id) => {
    return fetchWithAuth(`/agents/${id}`);
  },

  create: async (agentData) => {
    return fetchWithAuth('/agents', {
      method: 'POST',
      body: JSON.stringify(agentData),
    });
  },

  update: async (id, agentData) => {
    return fetchWithAuth(`/agents/${id}`, {
      method: 'PUT',
      body: JSON.stringify(agentData),
    });
  },

  delete: async (id) => {
    return fetchWithAuth(`/agents/${id}`, {
      method: 'DELETE',
    });
  },

  getStats: async (id, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return fetchWithAuth(`/agents/${id}/stats${queryString ? `?${queryString}` : ''}`);
  },

  // Sales Management
  getSales: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return fetchWithAuth(`/agents/sales${queryString ? `?${queryString}` : ''}`);
  },

  updateSaleStatus: async (id, status) => {
    return fetchWithAuth(`/agents/sales/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ payment_status: status }),
    });
  },

  // Sales Management
  recordSale: async (saleData) => {
    return fetchWithAuth('/agents/sales', {
      method: 'POST',
      body: JSON.stringify(saleData),
    });
  },

  getSales: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return fetchWithAuth(`/agents/sales${queryString ? `?${queryString}` : ''}`);
  },

  getSaleById: async (id) => {
    return fetchWithAuth(`/agents/sales/${id}`);
  },

  updateSaleStatus: async (id, status) => {
    return fetchWithAuth(`/agents/sales/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ payment_status: status }),
    });
  },

  getDashboard: async () => {
    return fetchWithAuth('/agents/dashboard');
  },
};



/**
 * User Management APIs
 */
export const userAPI = {
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return fetchWithAuth(`/users${queryString ? `?${queryString}` : ''}`);
  },

  getById: async (id) => {
    return fetchWithAuth(`/users/${id}`);
  },

  create: async (userData) => {
    return fetchWithAuth('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  update: async (id, userData) => {
    return fetchWithAuth(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  },

  delete: async (id) => {
    return fetchWithAuth(`/users/${id}`, {
      method: 'DELETE',
    });
  },
};

/**
 * Role & Permission APIs
 */
export const roleAPI = {
  getAll: async () => {
    return fetchWithAuth('/roles');
  },

  getById: async (id) => {
    return fetchWithAuth(`/roles/${id}`);
  },

  create: async (roleData) => {
    return fetchWithAuth('/roles', {
      method: 'POST',
      body: JSON.stringify(roleData),
    });
  },

  update: async (id, roleData) => {
    return fetchWithAuth(`/roles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(roleData),
    });
  },

  delete: async (id) => {
    return fetchWithAuth(`/roles/${id}`, {
      method: 'DELETE',
    });
  },

  getPermissions: async (id) => {
    return fetchWithAuth(`/roles/${id}/permissions`);
  },

  updatePermissions: async (id, permissionIds) => {
    return fetchWithAuth(`/roles/${id}/permissions`, {
      method: 'PUT',
      body: JSON.stringify({ permission_ids: permissionIds }),
    });
  },
};

export const permissionAPI = {
  getAll: async () => {
    return fetchWithAuth('/permissions');
  },
};

/**
 * School APIs
 */
export const schoolAPI = {
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return fetchWithAuth(`/schools${queryString ? `?${queryString}` : ''}`);
  },

  getById: async (id) => {
    return fetchWithAuth(`/schools/${id}`);
  },

  create: async (schoolData) => {
    return fetchWithAuth('/schools', {
      method: 'POST',
      body: JSON.stringify(schoolData),
    });
  },

  update: async (id, schoolData) => {
    return fetchWithAuth(`/schools/${id}`, {
      method: 'PUT',
      body: JSON.stringify(schoolData),
    });
  },

  delete: async (id) => {
    return fetchWithAuth(`/schools/${id}`, {
      method: 'DELETE',
    });
  },
};

/**
 * Activity Logs APIs
 */
export const logAPI = {
  getAll: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.page) params.append('page', filters.page);
    if (filters.limit) params.append('limit', filters.limit);
    if (filters.search) params.append('search', filters.search);
    if (filters.type && filters.type !== 'all') params.append('type', filters.type);
    if (filters.status && filters.status !== 'all') params.append('status', filters.status);
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);

    return fetchWithAuth(`/logs?${params.toString()}`);
  },

  getById: async (id) => {
    return fetchWithAuth(`/logs/${id}`);
  },

  getStats: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);

    return fetchWithAuth(`/logs/stats?${params.toString()}`);
  },

  exportCSV: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.search) params.append('search', filters.search);
    if (filters.type && filters.type !== 'all') params.append('type', filters.type);
    if (filters.status && filters.status !== 'all') params.append('status', filters.status);
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);

    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/logs/export?${params.toString()}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Export failed');
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `activity-logs-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

    return { success: true };
  }
};

/**
 * Backup APIs
 */
export const backupAPI = {
  create: async () => {
    return fetchWithAuth('/backups', {
      method: 'POST'
    });
  },

  getAll: async () => {
    return fetchWithAuth('/backups');
  },

  getStats: async () => {
    return fetchWithAuth('/backups/stats');
  },

  download: async (filename) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/backups/${filename}/download`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Download failed');
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

    return { success: true };
  },

  delete: async (filename) => {
    return fetchWithAuth(`/backups/${filename}`, {
      method: 'DELETE'
    });
  }
};

/**
 * Dashboard APIs
 */
export const dashboardAPI = {
  getSuperAdmin: async () => {
    return fetchWithAuth('/dashboard/superadmin');
  },

  getAdmin: async () => {
    return fetchWithAuth('/dashboard/admin');
  },

  getTeacher: async () => {
    return fetchWithAuth('/dashboard/teacher');
  },

  getStudent: async () => {
    return fetchWithAuth('/dashboard/student');
  }
};

/**
 * Class APIs
 */
export const classAPI = {
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return fetchWithAuth(`/classes${queryString ? `?${queryString}` : ''}`);
  },

  getById: async (id) => {
    return fetchWithAuth(`/classes/${id}`);
  },

  create: async (classData) => {
    return fetchWithAuth('/classes', {
      method: 'POST',
      body: JSON.stringify(classData),
    });
  },

  update: async (id, classData) => {
    return fetchWithAuth(`/classes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(classData),
    });
  },

  delete: async (id) => {
    return fetchWithAuth(`/classes/${id}`, {
      method: 'DELETE',
    });
  },
};

/**
 * Subject APIs
 */
export const subjectAPI = {
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return fetchWithAuth(`/subjects${queryString ? `?${queryString}` : ''}`);
  },

  getById: async (id) => {
    return fetchWithAuth(`/subjects/${id}`);
  },

  create: async (subjectData) => {
    return fetchWithAuth('/subjects', {
      method: 'POST',
      body: JSON.stringify(subjectData),
    });
  },

  update: async (id, subjectData) => {
    return fetchWithAuth(`/subjects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(subjectData),
    });
  },

  delete: async (id) => {
    return fetchWithAuth(`/subjects/${id}`, {
      method: 'DELETE',
    });
  },
};

/**
 * Grade APIs
 */
export const gradeAPI = {
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return fetchWithAuth(`/grades${queryString ? `?${queryString}` : ''}`);
  },

  update: async (id, gradeData) => {
    return fetchWithAuth(`/grades/${id}`, {
      method: 'PUT',
      body: JSON.stringify(gradeData),
    });
  },
};

/**
 * Offline Storage Helpers
 */
export const offlineStorage = {
  // Save exam attempt offline
  saveExamAttempt: (examId, data) => {
    try {
      const attempts = JSON.parse(localStorage.getItem('offline_exam_attempts') || '{}');
      attempts[examId] = {
        ...data,
        timestamp: new Date().toISOString(),
        synced: false,
      };
      localStorage.setItem('offline_exam_attempts', JSON.stringify(attempts));
      return true;
    } catch (error) {
      console.error('Error saving offline exam attempt:', error);
      return false;
    }
  },

  // Get offline exam attempt
  getExamAttempt: (examId) => {
    try {
      const attempts = JSON.parse(localStorage.getItem('offline_exam_attempts') || '{}');
      return attempts[examId] || null;
    } catch (error) {
      console.error('Error getting offline exam attempt:', error);
      return null;
    }
  },

  // Sync offline data when back online
  syncOfflineData: async () => {
    try {
      const attempts = JSON.parse(localStorage.getItem('offline_exam_attempts') || '{}');
      const syncPromises = [];

      for (const [examId, attempt] of Object.entries(attempts)) {
        if (!attempt.synced && attempt.answers) {
          syncPromises.push(
            examAPI.submit(examId, attempt.answers)
              .then(() => {
                attempt.synced = true;
                return { examId, success: true };
              })
              .catch(error => ({ examId, success: false, error }))
          );
        }
      }

      const results = await Promise.all(syncPromises);

      // Update localStorage with synced status
      localStorage.setItem('offline_exam_attempts', JSON.stringify(attempts));

      return results;
    } catch (error) {
      console.error('Error syncing offline data:', error);
      return [];
    }
  },

  // Clear synced offline data
  clearSyncedData: () => {
    try {
      const attempts = JSON.parse(localStorage.getItem('offline_exam_attempts') || '{}');
      const unsynced = {};

      for (const [examId, attempt] of Object.entries(attempts)) {
        if (!attempt.synced) {
          unsynced[examId] = attempt;
        }
      }

      localStorage.setItem('offline_exam_attempts', JSON.stringify(unsynced));
      return true;
    } catch (error) {
      console.error('Error clearing synced data:', error);
      return false;
    }
  },
};



/**
 * Lesson APIs
 */
export const lessonAPI = {
  getByCourse: async (courseId) => {
    return fetchWithAuth(`/courses/${courseId}/lessons`);
  },

  getById: async (id) => {
    return fetchWithAuth(`/lessons/${id}`);
  },

  create: async (lessonData) => {
    return fetchWithAuth('/lessons', {
      method: 'POST',
      body: JSON.stringify(lessonData),
    });
  },

  update: async (id, lessonData) => {
    return fetchWithAuth(`/lessons/${id}`, {
      method: 'PUT',
      body: JSON.stringify(lessonData),
    });
  },

  delete: async (id) => {
    return fetchWithAuth(`/lessons/${id}`, {
      method: 'DELETE',
    });
  },
};

/**
 * Enrollment APIs
 */
export const enrollmentAPI = {
  enroll: async (enrollmentData) => {
    return fetchWithAuth('/enrollments', {
      method: 'POST',
      body: JSON.stringify(enrollmentData),
    });
  },

  getByCourse: async (courseId) => {
    return fetchWithAuth(`/courses/${courseId}/enrollments`);
  },

  getByStudent: async (studentId) => {
    return fetchWithAuth(`/students/${studentId}/enrollments`);
  },

  update: async (id, data) => {
    return fetchWithAuth(`/enrollments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  unenroll: async (id) => {
    return fetchWithAuth(`/enrollments/${id}`, {
      method: 'DELETE',
    });
  },
};

/**
 * Assignment APIs
 */
export const assignmentAPI = {
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return fetchWithAuth(`/assignments${queryString ? `?${queryString}` : ''}`);
  },

  getByCourse: async (courseId) => {
    return fetchWithAuth(`/courses/${courseId}/assignments`);
  },

  getById: async (id) => {
    return fetchWithAuth(`/assignments/${id}`);
  },

  create: async (assignmentData) => {
    return fetchWithAuth('/assignments', {
      method: 'POST',
      body: JSON.stringify(assignmentData),
    });
  },

  update: async (id, assignmentData) => {
    return fetchWithAuth(`/assignments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(assignmentData),
    });
  },

  delete: async (id) => {
    return fetchWithAuth(`/assignments/${id}`, {
      method: 'DELETE',
    });
  },
};

/**
 * Announcement APIs
 */
export const announcementAPI = {
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return fetchWithAuth(`/announcements${queryString ? `?${queryString}` : ''}`);
  },

  create: async (data) => {
    return fetchWithAuth('/announcements', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id, data) => {
    return fetchWithAuth(`/announcements/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (id) => {
    return fetchWithAuth(`/announcements/${id}`, {
      method: 'DELETE',
    });
  },
};

/**
 * Attendance APIs
 */
export const attendanceAPI = {
  get: async (classId, date) => {
    return fetchWithAuth(`/attendance?class_id=${classId}&date=${date}`);
  },

  save: async (data) => {
    return fetchWithAuth('/attendance', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

/**
 * Curriculum APIs
 */
export const curriculumAPI = {
  getAll: async () => {
    return fetchWithAuth('/curricula');
  },
  create: async (data) => {
    return fetchWithAuth('/curricula', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  update: async (id, data) => {
    return fetchWithAuth(`/curricula/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  delete: async (id) => {
    return fetchWithAuth(`/curricula/${id}`, {
      method: 'DELETE',
    });
  },
};

/**
 * Schedule APIs
 */
export const scheduleAPI = {
  getAll: async (class_id) => {
    const params = class_id ? `?class_id=${class_id}` : '';
    return fetchWithAuth(`/schedules${params}`);
  },
  create: async (data) => {
    return fetchWithAuth('/schedules', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  update: async (id, data) => {
    return fetchWithAuth(`/schedules/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  delete: async (id) => {
    return fetchWithAuth(`/schedules/${id}`, {
      method: 'DELETE',
    });
  },
};

/**
 * Payment APIs
 */
export const paymentAPI = {
  getStudentFees: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return fetchWithAuth(`/student-fees${queryString ? `?${queryString}` : ''}`);
  },

  assignFee: async (data) => {
    return fetchWithAuth('/student-fees', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  recordPayment: async (data) => {
    return fetchWithAuth('/payments', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getStats: async () => {
    return fetchWithAuth('/payments/stats');
  },

  getFees: async () => {
    return fetchWithAuth('/fees');
  },

  createFee: async (data) => {
    return fetchWithAuth('/fees', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  updateFee: async (id, data) => {
    return fetchWithAuth(`/fees/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  deleteFee: async (id) => {
    return fetchWithAuth(`/fees/${id}`, {
      method: 'DELETE',
    });
  },

  getTeacherPayments: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return fetchWithAuth(`/teacher-payments${queryString ? `?${queryString}` : ''}`);
  },

  recordTeacherPayment: async (data) => {
    return fetchWithAuth('/teacher-payments', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

/**
 * Settings & Grading System APIs
 */
export const settingsAPI = {
  getSettings: async () => {
    return fetchWithAuth('/settings');
  },

  updateSetting: async (data) => {
    return fetchWithAuth('/settings', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  getGradingScales: async () => {
    return fetchWithAuth('/grading-scales');
  },

  createGradingScale: async (data) => {
    return fetchWithAuth('/grading-scales', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getReportPeriods: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return fetchWithAuth(`/report-periods${queryString ? `?${queryString}` : ''}`);
  },

  createReportPeriod: async (data) => {
    return fetchWithAuth('/report-periods', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  updateReportPeriod: async (id, data) => {
    return fetchWithAuth(`/report-periods/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  deleteReportPeriod: async (id) => {
    return fetchWithAuth(`/report-periods/${id}`, {
      method: 'DELETE',
    });
  },

  getSubjectCoefficients: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return fetchWithAuth(`/subject-coefficients${queryString ? `?${queryString}` : ''}`);
  },

  setSubjectCoefficient: async (data) => {
    return fetchWithAuth('/subject-coefficients', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

export const gradesAPI = {
  getGrades: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return fetchWithAuth(`/grades${queryString ? `?${queryString}` : ''}`);
  },

  createGrade: async (data) => {
    return fetchWithAuth('/grades', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  updateGrade: async (id, data) => {
    return fetchWithAuth(`/grades/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  deleteGrade: async (id) => {
    return fetchWithAuth(`/grades/${id}`, {
      method: 'DELETE',
    });
  },

  calculateAverage: async (params) => {
    const queryString = new URLSearchParams(params).toString();
    return fetchWithAuth(`/grades/average?${queryString}`);
  },

  calculateOverallAverage: async (params) => {
    const queryString = new URLSearchParams(params).toString();
    return fetchWithAuth(`/grades/overall-average?${queryString}`);
  },
};

export const competencyAPI = {
  getCompetencies: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return fetchWithAuth(`/competencies${queryString ? `?${queryString}` : ''}`);
  },

  createCompetency: async (data) => {
    return fetchWithAuth('/competencies', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  updateCompetency: async (id, data) => {
    return fetchWithAuth(`/competencies/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  deleteCompetency: async (id) => {
    return fetchWithAuth(`/competencies/${id}`, {
      method: 'DELETE',
    });
  },

  getEvaluations: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return fetchWithAuth(`/competency-evaluations${queryString ? `?${queryString}` : ''}`);
  },

  evaluateCompetency: async (data) => {
    return fetchWithAuth('/competency-evaluations', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getStudentSummary: async (params) => {
    const queryString = new URLSearchParams(params).toString();
    return fetchWithAuth(`/competency-evaluations/summary?${queryString}`);
  },
};

export const reportCardAPI = {
  generate: async (data) => {
    return fetchWithAuth('/report-cards/generate', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return fetchWithAuth(`/report-cards${queryString ? `?${queryString}` : ''}`);
  },

  getById: async (id) => {
    return fetchWithAuth(`/report-cards/${id}`);
  },
};

export const badgeAPI = {
  getAll: async () => fetchWithAuth('/badges'),
  create: async (data) => fetchWithAuth('/badges', { method: 'POST', body: JSON.stringify(data) }),
  award: async (data) => fetchWithAuth('/badges/award', { method: 'POST', body: JSON.stringify(data) }),
  getStudentBadges: async (studentId) => fetchWithAuth(`/students/${studentId}/badges`),
};



export const analyticsAPI = {
  getStats: async () => fetchWithAuth('/analytics/stats'),
  getPredictions: async (studentId) => fetchWithAuth(`/analytics/predictions/${studentId}`),
  getScholarshipCandidates: async () => fetchWithAuth('/analytics/scholarships'),
};

export const eventAPI = {
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return fetchWithAuth(`/events${queryString ? `?${queryString}` : ''}`);
  },
  getById: async (id) => fetchWithAuth(`/events/${id}`),
  create: async (data) => fetchWithAuth('/events', { method: 'POST', body: JSON.stringify(data) }),
  update: async (id, data) => fetchWithAuth(`/events/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: async (id) => fetchWithAuth(`/events/${id}`, { method: 'DELETE' }),
};


export default {
  authAPI,
  courseAPI,
  examAPI,
  agentAPI,
  dashboardAPI,
  schoolAPI,
  userAPI,
  classAPI,
  subjectAPI,
  gradeAPI,
  offlineStorage,
  lessonAPI,
  enrollmentAPI,
  assignmentAPI,
  announcementAPI,
  attendanceAPI,
  curriculumAPI,
  scheduleAPI,
  paymentAPI,
  settingsAPI,
  gradesAPI,

  competencyAPI,
  reportCardAPI,
  badgeAPI,
  analyticsAPI,
  eventAPI,
};
