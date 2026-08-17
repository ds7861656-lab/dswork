import React, { useEffect, useState, useRef } from 'react';
import { SnackbarIcons } from './SnackbarIcons';

export type SnackbarType = 'error' | 'success' | 'warning' | 'info';

export interface SnackbarAction {
  label: string;
  onClick: () => void;
  style?: 'default' | 'primary' | 'destructive';
}

export interface SnackbarData {
  id: string;
  message: string;
  type: SnackbarType;
  duration?: number;
  actions?: SnackbarAction[];
}

export interface SnackbarProps {
  id: string;
  message: string;
  type: SnackbarType;
  duration?: number;
  actions?: SnackbarAction[];
  onClose: (id: string) => void;
  showProgress?: boolean;
}

const Snackbar: React.FC<SnackbarProps> = ({
  id,
  message,
  type,
  duration = 5000,
  actions = [],
  onClose,
  showProgress = true
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const [progress, setProgress] = useState(100);
  const [isPaused, setIsPaused] = useState(false);
  
  // Use refs to track time to handle pause/resume accurately
  const remainingTime = useRef(duration);
  const lastStartTime = useRef<number>(0);
  const timerId = useRef<number | null>(null);

  // Entrance animation
  useEffect(() => {
    // Small delay to allow CSS transition to trigger
    requestAnimationFrame(() => setIsVisible(true));
  }, []);

  const handleClose = () => {
    setIsLeaving(true);
    setIsVisible(false);
    // Wait for animation to finish before unmounting
    setTimeout(() => onClose(id), 300);
  };

  // Timer Logic with Pause/Resume
  useEffect(() => {
    if (duration === 0 || isPaused || isLeaving) return;

    lastStartTime.current = Date.now();

    const interval = setInterval(() => {
      const now = Date.now();
      const elapsed = now - lastStartTime.current;
      
      remainingTime.current = Math.max(0, remainingTime.current - elapsed);
      lastStartTime.current = now;

      const percentage = (remainingTime.current / duration) * 100;
      setProgress(percentage);

      if (remainingTime.current <= 0) {
        clearInterval(interval);
        handleClose();
      }
    }, 50);

    timerId.current = interval;

    return () => clearInterval(interval);
  }, [isPaused, duration, isLeaving]);

  const getProgressColor = () => {
    switch (type) {
      case 'error': return 'bg-red-500';
      case 'success': return 'bg-green-500';
      case 'warning': return 'bg-amber-500';
      case 'info': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div
      className={`
        pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg 
        bg-white shadow-lg ring-1 ring-black/5 backdrop-blur-3xl 
        transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]
        dark:bg-slate-900 dark:ring-white/10
        ${isVisible && !isLeaving ? 'translate-x-0 opacity-100 scale-100' : 'translate-x-full opacity-0 scale-95'}
      `}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      role="alert"
    >
      <div className="p-4">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            {SnackbarIcons[type]}
          </div>
          
          <div className="w-0 flex-1 pt-0.5">
            <p className="text-sm font-medium leading-5 text-slate-900 dark:text-slate-100">
              {message}
            </p>
            
            {actions.length > 0 && (
              <div className="mt-3 flex gap-3">
                {actions.map((action, i) => (
                  <button
                    key={i}
                    onClick={action.onClick}
                    className={`
                      rounded-md text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-900
                      ${action.style === 'primary' 
                        ? 'text-blue-600 hover:text-blue-500 dark:text-blue-400' 
                        : action.style === 'destructive'
                        ? 'text-red-600 hover:text-red-500 dark:text-red-400'
                        : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}
                    `}
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="ml-4 flex flex-shrink-0">
            <button
              onClick={handleClose}
              className="inline-flex rounded-md text-slate-400 hover:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:hover:text-slate-300"
            >
              <span className="sr-only">Close</span>
              {SnackbarIcons.close}
            </button>
          </div>
        </div>
      </div>

      {/* Progress Bar (Bottom Line) */}
      {showProgress && duration > 0 && (
        <div className="h-1 w-full bg-slate-100 dark:bg-slate-800">
          <div
            className={`h-full transition-all duration-100 ease-linear ${getProgressColor()}`}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
};

export default Snackbar;