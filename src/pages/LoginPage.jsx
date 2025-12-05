/**
 * Login Page Component
 * Handles user authentication
 */

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogIn, Loader, AlertCircle, Eye, EyeOff } from 'lucide-react';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, loading } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError(''); // Clear error on input change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    // Basic validation
    if (!formData.email || !formData.password) {
      setError('Veuillez remplir tous les champs');
      setIsSubmitting(false);
      return;
    }

    try {
      const result = await login(formData.email, formData.password);

      // Log for debugging (check console)
      console.log('Login result:', result);

      if (result.success) {
        console.log('Redirecting to dashboard...');
        navigate('/dashboard');
      } else {
        setError(result.error || 'Échec de la connexion. Veuillez réessayer.');
      }
    } catch (err) {
      console.error('Login exception:', err);
      setError(err.message || 'Une erreur inattendue s\'est produite');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Quick login for testing
  const quickLogin = (email, password) => {
    setFormData({ email, password });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        {/* Header with EDIKA Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <img
              src="/edika-logo.png"
              alt="EDIKA"
              className="h-16 object-contain"
            />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Bienvenue</h1>
          <p className="text-gray-600">Connectez-vous à votre compte</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Adresse e-mail
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="vous@exemple.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              disabled={isSubmitting}
            />
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Mot de passe
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all pr-12"
                disabled={isSubmitting}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                disabled={isSubmitting}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-gray-700">Se souvenir de moi</span>
            </label>
            <Link to="/forgot-password" className="text-blue-600 hover:text-blue-700 font-medium">
              Mot de passe oublié ?
            </Link>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                Connexion en cours...
              </>
            ) : (
              <>
                <LogIn className="w-5 h-5" />
                Se connecter
              </>
            )}
          </button>
        </form>

        {/* Demo Accounts - Development Only */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-600 text-center mb-3">Connexion rapide (démo) :</p>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => quickLogin('admin@example.com', 'admin123')}
              className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded transition-colors"
              disabled={isSubmitting}
            >
              Admin
            </button>
            <button
              onClick={() => quickLogin('teacher@example.com', 'teacher123')}
              className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded transition-colors"
              disabled={isSubmitting}
            >
              Enseignant
            </button>
            <button
              onClick={() => quickLogin('student@example.com', 'student123')}
              className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded transition-colors"
              disabled={isSubmitting}
            >
              Élève
            </button>
            <button
              onClick={() => quickLogin('agent@example.com', 'agent123')}
              className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded transition-colors"
              disabled={isSubmitting}
            >
              Agent
            </button>
          </div>
        </div>

        {/* Register Link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Vous n'avez pas de compte ?{' '}
            <Link to="/register" className="text-blue-600 hover:text-blue-700 font-semibold">
              S'inscrire
            </Link>
          </p>
        </div>
      </div>

      {/* Offline indicator */}
      {!navigator.onLine && (
        <div className="fixed bottom-4 right-4 bg-orange-100 border-l-4 border-orange-500 p-4 rounded shadow-lg">
          <p className="text-sm text-orange-800 font-medium">
            ⚠️ Vous êtes hors ligne
          </p>
        </div>
      )}
    </div>
  );
};

export default LoginPage;

