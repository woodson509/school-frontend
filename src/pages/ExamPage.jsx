/**
 * Exam Page Component
 * Handles exam taking with timer, question rendering, and offline support
 * Locks navigation while exam is active
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { examAPI, offlineStorage } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import Timer from '../components/Timer';
import { AlertCircle, CheckCircle, Loader, Send, Save, Wifi, WifiOff } from 'lucide-react';

const ExamPage = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [exam, setExam] = useState(null);
  const [attempt, setAttempt] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [examStarted, setExamStarted] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState('');
  
  const hasUnsavedChanges = useRef(false);
  const autoSaveInterval = useRef(null);

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Load exam and check for existing attempt
  useEffect(() => {
    const loadExam = async () => {
      try {
        setLoading(true);
        setError(null);

        // Try to load from offline storage first
        const offlineAttempt = offlineStorage.getExamAttempt(examId);
        
        if (offlineAttempt && !offlineAttempt.synced) {
          setExam(offlineAttempt.exam);
          setAttempt(offlineAttempt.attempt);
          setAnswers(offlineAttempt.answers || {});
          setExamStarted(true);
          setLoading(false);
          return;
        }

        // Load from API
        const examResponse = await examAPI.getById(examId);
        if (examResponse.success) {
          setExam(examResponse.data);
        }

        setLoading(false);
      } catch (err) {
        console.error('Error loading exam:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    if (examId) {
      loadExam();
    }
  }, [examId]);

  // Start exam
  const startExam = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await examAPI.start(examId);
      
      if (response.success) {
        setAttempt(response.data);
        setExamStarted(true);
        
        // Save to offline storage
        offlineStorage.saveExamAttempt(examId, {
          exam,
          attempt: response.data,
          answers: {},
        });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Auto-save answers to localStorage
  const autoSaveAnswers = useCallback(() => {
    if (examStarted && hasUnsavedChanges.current) {
      offlineStorage.saveExamAttempt(examId, {
        exam,
        attempt,
        answers,
      });
      
      setAutoSaveStatus('Saved');
      hasUnsavedChanges.current = false;
      
      setTimeout(() => setAutoSaveStatus(''), 2000);
    }
  }, [examStarted, examId, exam, attempt, answers]);

  // Set up auto-save interval
  useEffect(() => {
    if (examStarted) {
      autoSaveInterval.current = setInterval(autoSaveAnswers, 10000); // Auto-save every 10 seconds
      
      return () => {
        if (autoSaveInterval.current) {
          clearInterval(autoSaveInterval.current);
        }
      };
    }
  }, [examStarted, autoSaveAnswers]);

  // Handle answer change
  const handleAnswerChange = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer,
    }));
    hasUnsavedChanges.current = true;
  };

  // Submit exam
  const submitExam = async () => {
    if (!window.confirm('Are you sure you want to submit your exam? This action cannot be undone.')) {
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      if (isOnline) {
        // Submit to server
        const response = await examAPI.submit(examId, answers);
        
        if (response.success) {
          // Clear offline data
          localStorage.removeItem(`exam_attempt_${examId}`);
          
          alert('Exam submitted successfully!');
          navigate('/dashboard');
        }
      } else {
        // Save for later sync
        offlineStorage.saveExamAttempt(examId, {
          exam,
          attempt,
          answers,
          submitted: true,
        });
        
        alert('You are offline. Your answers have been saved and will be submitted when you reconnect.');
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Handle time up
  const handleTimeUp = useCallback(() => {
    alert('Time is up! Your exam will be submitted automatically.');
    submitExam();
  }, [submitExam]);

  // Prevent navigation when exam is active
  useEffect(() => {
    if (!examStarted) return;

    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = 'You have an active exam. Are you sure you want to leave?';
      return e.returnValue;
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [examStarted]);

  // Block browser navigation
  useEffect(() => {
    if (!examStarted) return;

    const unblock = () => {
      if (!window.confirm('You have an active exam. Are you sure you want to leave? Your progress will be saved.')) {
        return false;
      }
      autoSaveAnswers();
      return true;
    };

    // This would typically use router's block functionality
    // For now, we handle beforeunload above
    return () => {
      // Cleanup
    };
  }, [examStarted, autoSaveAnswers]);

  // Render loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading exam...</p>
        </div>
      </div>
    );
  }

  // Render error state
  if (error && !exam) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Exam</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Render exam start page
  if (!examStarted) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">{exam?.title}</h1>
            
            {exam?.description && (
              <p className="text-gray-600 mb-6">{exam.description}</p>
            )}
            
            <div className="grid grid-cols-2 gap-4 mb-8 bg-blue-50 p-6 rounded-lg">
              <div>
                <p className="text-sm text-gray-600">Duration</p>
                <p className="text-xl font-bold text-gray-800">{exam?.duration_minutes} minutes</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Marks</p>
                <p className="text-xl font-bold text-gray-800">{exam?.total_marks}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Passing Marks</p>
                <p className="text-xl font-bold text-gray-800">{exam?.passing_marks}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <div className="flex items-center gap-2">
                  {isOnline ? (
                    <Wifi className="w-5 h-5 text-green-600" />
                  ) : (
                    <WifiOff className="w-5 h-5 text-orange-600" />
                  )}
                  <p className="text-xl font-bold text-gray-800">
                    {isOnline ? 'Online' : 'Offline'}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
              <h3 className="font-bold text-gray-800 mb-2">Important Instructions:</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                <li>Once started, you cannot pause the exam</li>
                <li>Your answers will be auto-saved every 10 seconds</li>
                <li>If you go offline, your progress will be saved locally</li>
                <li>Do not close the browser or navigate away during the exam</li>
                <li>Submit before the timer runs out</li>
              </ul>
            </div>

            <button
              onClick={startExam}
              disabled={loading}
              className="w-full bg-green-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-green-700 transition-colors disabled:bg-gray-400"
            >
              {loading ? 'Starting...' : 'Start Exam'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Render active exam
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Timer */}
      <Timer
        durationMinutes={exam.duration_minutes}
        startTime={attempt?.started_at}
        onTimeUp={handleTimeUp}
      />

      {/* Header */}
      <div className="bg-white shadow-md sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{exam.title}</h1>
              <p className="text-sm text-gray-600">
                {Object.keys(answers).length} of {exam.total_marks} questions answered
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Online/Offline indicator */}
              <div className="flex items-center gap-2">
                {isOnline ? (
                  <>
                    <Wifi className="w-5 h-5 text-green-600" />
                    <span className="text-sm text-green-600 font-medium">Online</span>
                  </>
                ) : (
                  <>
                    <WifiOff className="w-5 h-5 text-orange-600" />
                    <span className="text-sm text-orange-600 font-medium">Offline</span>
                  </>
                )}
              </div>

              {/* Auto-save status */}
              {autoSaveStatus && (
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="w-5 h-5" />
                  <span className="text-sm font-medium">{autoSaveStatus}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Questions */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Sample questions - in real app, these would come from exam data */}
          {[1, 2, 3, 4, 5].map((qNum) => (
            <div key={qNum} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-start gap-4">
                <div className="bg-blue-100 text-blue-800 font-bold rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0">
                  {qNum}
                </div>
                
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Sample Question {qNum}: What is the capital of France?
                  </h3>
                  
                  <div className="space-y-3">
                    {['Paris', 'London', 'Berlin', 'Madrid'].map((option, idx) => (
                      <label
                        key={idx}
                        className="flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer hover:bg-blue-50 transition-colors"
                      >
                        <input
                          type="radio"
                          name={`question_${qNum}`}
                          value={option}
                          checked={answers[`question_${qNum}`] === option}
                          onChange={(e) => handleAnswerChange(`question_${qNum}`, e.target.value)}
                          className="w-5 h-5"
                        />
                        <span className="text-gray-700">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Error message */}
        {error && (
          <div className="mt-6 bg-red-50 border-l-4 border-red-500 p-4 rounded">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Submit button */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <div className="flex gap-4">
            <button
              onClick={autoSaveAnswers}
              className="flex-1 bg-gray-600 text-white py-3 rounded-lg font-bold hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              Save Progress
            </button>
            
            <button
              onClick={submitExam}
              disabled={submitting}
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors disabled:bg-gray-400 flex items-center justify-center gap-2"
            >
              <Send className="w-5 h-5" />
              {submitting ? 'Submitting...' : 'Submit Exam'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamPage;
