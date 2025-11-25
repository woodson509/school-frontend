/**
 * Timer Component
 * Countdown timer for exams with auto-submit when time expires
 */

import { useState, useEffect, useCallback } from 'react';
import { Clock, AlertCircle } from 'lucide-react';

const Timer = ({ durationMinutes, onTimeUp, startTime, isPaused = false }) => {
  const [timeRemaining, setTimeRemaining] = useState(durationMinutes * 60);
  const [isWarning, setIsWarning] = useState(false);

  // Calculate initial time remaining based on start time
  useEffect(() => {
    if (startTime) {
      const elapsed = Math.floor((Date.now() - new Date(startTime).getTime()) / 1000);
      const remaining = Math.max(0, durationMinutes * 60 - elapsed);
      setTimeRemaining(remaining);
      
      if (remaining === 0) {
        onTimeUp?.();
      }
    }
  }, [startTime, durationMinutes, onTimeUp]);

  // Countdown logic
  useEffect(() => {
    if (isPaused || timeRemaining <= 0) return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        const newTime = prev - 1;
        
        // Warning when 5 minutes or less remaining
        if (newTime <= 300 && !isWarning) {
          setIsWarning(true);
        }
        
        // Time's up
        if (newTime <= 0) {
          clearInterval(interval);
          onTimeUp?.();
          return 0;
        }
        
        // Save to localStorage for offline recovery
        try {
          localStorage.setItem('exam_time_remaining', newTime.toString());
        } catch (error) {
          console.error('Error saving time to localStorage:', error);
        }
        
        return newTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPaused, timeRemaining, isWarning, onTimeUp]);

  // Format time as HH:MM:SS
  const formatTime = useCallback((seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }
    return `${minutes}:${String(secs).padStart(2, '0')}`;
  }, []);

  // Get warning class based on time remaining
  const getTimerClass = () => {
    if (timeRemaining <= 60) {
      return 'text-red-600 animate-pulse';
    }
    if (timeRemaining <= 300) {
      return 'text-orange-600';
    }
    return 'text-gray-700';
  };

  // Get background class
  const getBackgroundClass = () => {
    if (timeRemaining <= 60) {
      return 'bg-red-50 border-red-300';
    }
    if (timeRemaining <= 300) {
      return 'bg-orange-50 border-orange-300';
    }
    return 'bg-blue-50 border-blue-300';
  };

  return (
    <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg border-2 ${getBackgroundClass()}`}>
      <div className="flex items-center gap-3">
        {timeRemaining <= 300 ? (
          <AlertCircle className="w-6 h-6 text-orange-600" />
        ) : (
          <Clock className="w-6 h-6 text-blue-600" />
        )}
        
        <div>
          <div className="text-xs text-gray-600 font-medium">Time Remaining</div>
          <div className={`text-2xl font-bold ${getTimerClass()}`}>
            {formatTime(timeRemaining)}
          </div>
        </div>
      </div>
      
      {timeRemaining <= 300 && timeRemaining > 60 && (
        <div className="mt-2 text-xs text-orange-600 font-medium">
          ⚠️ Less than 5 minutes left!
        </div>
      )}
      
      {timeRemaining <= 60 && timeRemaining > 0 && (
        <div className="mt-2 text-xs text-red-600 font-bold animate-pulse">
          🚨 FINAL MINUTE!
        </div>
      )}
      
      {timeRemaining === 0 && (
        <div className="mt-2 text-xs text-red-600 font-bold">
          ⏰ Time's Up!
        </div>
      )}
    </div>
  );
};

export default Timer;
