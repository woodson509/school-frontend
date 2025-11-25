/**
 * Authentication Context
 * Manages user authentication state across the application
 */

import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, offlineStorage } from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const token = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');

        if (token && savedUser) {
          setUser(JSON.parse(savedUser));
        }
      } catch (err) {
        console.error('Error initializing auth:', err);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Sync offline data when coming back online
  useEffect(() => {
    const handleOnline = async () => {
      console.log('Back online - syncing data...');
      try {
        const results = await offlineStorage.syncOfflineData();
        const synced = results.filter(r => r.success).length;
        if (synced > 0) {
          console.log(`Successfully synced ${synced} exam attempts`);
          offlineStorage.clearSyncedData();
        }
      } catch (error) {
        console.error('Error syncing data:', error);
      }
    };

    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);

      const response = await authAPI.login(email, password);

      // DEBUG: Log the exact response structure
      console.log('Login Response:', JSON.stringify(response, null, 2));

      // Handle different response formats
      let userData, token;

      if (response.success && response.data) {
        // Format: { success: true, data: { user, token } }
        console.log('Response format: success + data');
        userData = response.data.user;
        token = response.data.token;
      } else if (response.token && response.user) {
        // Format: { token, user }
        console.log('Response format: token + user');
        userData = response.user;
        token = response.token;
      } else if (response.accessToken && response.user) {
        // Format: { accessToken, user }
        console.log('Response format: accessToken + user');
        userData = response.user;
        token = response.accessToken;
      } else {
        // Try direct user format (might not have token wrapper)
        console.log('Trying direct format...');
        userData = response;
        token = response.token || response.accessToken;
      }

      console.log('Extracted token:', token ? 'YES' : 'NO');
      console.log('Extracted userData:', userData ? 'YES' : 'NO');
      console.log('User role:', userData?.role);
      console.log('Full user data:', userData);

      if (token && userData) {
        // Normalize user data - handle different field names from backend
        const normalizedUser = {
          ...userData,
          name: userData.name || userData.full_name || userData.fullName,
          // Normalize role: lowercase and trim to prevent comparison issues
          role: userData.role?.toString().toLowerCase().trim() || 'student',
        };

        console.log('Normalized user data:', normalizedUser);

        // Save to localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(normalizedUser));

        // Update state
        setUser(normalizedUser);

        console.log('Login successful, redirecting...');
        console.log('Role value:', normalizedUser.role);
        console.log('Role type:', typeof normalizedUser.role);
        console.log('Is Teacher?', normalizedUser.role === 'teacher');
        console.log('Is Admin?', normalizedUser.role === 'admin');
        console.log('Is Student?', normalizedUser.role === 'student');
        console.log('Is SuperAdmin?', normalizedUser.role === 'superadmin');
        return { success: true, user: normalizedUser };
      } else {
        console.error('Invalid login response:', response);
        console.error('Missing token:', !token);
        console.error('Missing userData:', !userData);
        throw new Error('Invalid response from server - missing token or user data');
      }
    } catch (err) {
      console.error('Login error:', err);
      const errorMessage = err.message || 'Login failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await authAPI.register(userData);

      // Handle different response formats
      let newUser, token;

      if (response.success && response.data) {
        newUser = response.data.user;
        token = response.data.token;
      } else if (response.token && response.user) {
        newUser = response.user;
        token = response.token;
      } else if (response.accessToken && response.user) {
        newUser = response.user;
        token = response.accessToken;
      }

      if (token && newUser) {
        // Save to localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(newUser));

        // Update state
        setUser(newUser);

        return { success: true, user: newUser };
      } else {
        console.error('Invalid register response:', response);
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      const errorMessage = err.message || 'Registration failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    // Clear state
    setUser(null);
    setError(null);

    // Force a hard reload to clear any cached state (fixes Edge issue)
    window.location.href = '/login';
  };

  const updateUser = (userData) => {
    const updatedUser = { ...user, ...userData };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated: !!user,
    // Defensive role checking with normalization
    isAdmin: user?.role?.toLowerCase().trim() === 'admin',
    isSuperAdmin: user?.role?.toLowerCase().trim() === 'superadmin',
    isTeacher: user?.role?.toLowerCase().trim() === 'teacher',
    isStudent: user?.role?.toLowerCase().trim() === 'student',
    isAgent: user?.role?.toLowerCase().trim() === 'agent',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
