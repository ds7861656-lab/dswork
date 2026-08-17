import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import Snackbar from '../components/ui/Snackbar';
import type { SnackbarType, SnackbarAction, SnackbarData } from '../components/ui/Snackbar';
import { i18nErrorHandler } from '../utils/i18nErrorHandler';

// Re-export types for consumers
export type { SnackbarType, SnackbarAction };

// Configuration types
export type SnackbarPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top-center' | 'bottom-center';

interface SnackbarContextType {
  snackbars: SnackbarData[];
  showSnackbar: (data: Omit<SnackbarData, 'id'>) => void;
  hideSnackbar: (id: string) => void;
  hideAll: () => void;
  // Convenience methods
  showError: (message: string, actions?: SnackbarAction[], duration?: number) => void;
  showSuccess: (message: string, actions?: SnackbarAction[], duration?: number) => void;
  showWarning: (message: string, actions?: SnackbarAction[], duration?: number) => void;
  showInfo: (message: string, actions?: SnackbarAction[], duration?: number) => void;
}

const SnackbarContext = createContext<SnackbarContextType | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export const useSnackbar = () => {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error('useSnackbar must be used within a SnackbarProvider');
  }
  return context;
};

interface SnackbarProviderProps {
  children: React.ReactNode;
  maxSnackbars?: number;
  position?: SnackbarPosition;
}

export const SnackbarProvider: React.FC<SnackbarProviderProps> = ({ 
  children, 
  maxSnackbars = 3,
  position = 'top-right'
}) => {
  const [snackbars, setSnackbars] = useState<SnackbarData[]>([]);

  const generateId = () => `snack_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

  const showSnackbar = useCallback((data: Omit<SnackbarData, 'id'>) => {
    setSnackbars(prev => {
      const newSnackbar = { id: generateId(), ...data };
      // Keep only the last (max - 1) items + new one
      const current = prev.length >= maxSnackbars ? prev.slice(prev.length - maxSnackbars + 1) : prev;
      return [...current, newSnackbar];
    });
  }, [maxSnackbars]);

  const hideSnackbar = useCallback((id: string) => {
    setSnackbars(prev => prev.filter(s => s.id !== id));
  }, []);

  const hideAll = useCallback(() => {
    setSnackbars([]);
  }, []);

  // Convenience wrappers
  const showError = useCallback((msg: string, actions?: SnackbarAction[], dur?: number) => 
    showSnackbar({ message: msg, type: 'error', actions, duration: dur ?? 6000 }), [showSnackbar]);

  const showSuccess = useCallback((msg: string, actions?: SnackbarAction[], dur?: number) => 
    showSnackbar({ message: msg, type: 'success', actions, duration: dur ?? 4000 }), [showSnackbar]);

  const showWarning = useCallback((msg: string, actions?: SnackbarAction[], dur?: number) => 
    showSnackbar({ message: msg, type: 'warning', actions, duration: dur ?? 5000 }), [showSnackbar]);

  const showInfo = useCallback((msg: string, actions?: SnackbarAction[], dur?: number) => 
    showSnackbar({ message: msg, type: 'info', actions, duration: dur ?? 4000 }), [showSnackbar]);

  // Bind to error handler
  useEffect(() => {
    i18nErrorHandler.initializeSnackbar({ showError, showSuccess, showWarning, showInfo });
  }, [showError, showSuccess, showWarning, showInfo]);

  const value = { snackbars, showSnackbar, hideSnackbar, hideAll, showError, showSuccess, showWarning, showInfo };

  return (
    <SnackbarContext.Provider value={value}>
      {children}
      <SnackbarContainer snackbars={snackbars} position={position} onClose={hideSnackbar} />
    </SnackbarContext.Provider>
  );
};

// --- Internal Container Component ---

const SnackbarContainer: React.FC<{
  snackbars: SnackbarData[];
  position: SnackbarPosition;
  onClose: (id: string) => void;
}> = ({ snackbars, position, onClose }) => {
  if (snackbars.length === 0) return null;

  const getPositionClasses = () => {
    switch (position) {
      case 'top-left': return 'top-0 left-0 p-4 sm:p-6 items-start';
      case 'top-right': return 'top-0 right-0 p-4 sm:p-6 items-end';
      case 'bottom-left': return 'bottom-0 left-0 p-4 sm:p-6 items-start';
      case 'bottom-right': return 'bottom-0 right-0 p-4 sm:p-6 items-end';
      case 'top-center': return 'top-0 left-1/2 -translate-x-1/2 p-4 sm:p-6 items-center';
      case 'bottom-center': return 'bottom-0 left-1/2 -translate-x-1/2 p-4 sm:p-6 items-center';
      default: return 'top-0 right-0 p-4 items-end';
    }
  };

  const isBottom = position.startsWith('bottom');

  return (
    <div 
      className={`fixed z-50 flex flex-col gap-2 pointer-events-none w-full max-w-full ${getPositionClasses()}`}
      aria-live="assertive"
    >
      {/* Reverse map if bottom aligned so new ones push old ones up */}
      {(isBottom ? [...snackbars].reverse() : snackbars).map((snackbar) => (
        <Snackbar
          key={snackbar.id}
          {...snackbar}
          onClose={onClose}
        />
      ))}
    </div>
  );
};

export default SnackbarProvider;