import React, { createContext, useContext, ReactNode } from 'react';
import { useToast, Toast, ToastOptions } from '../hooks/useToast';
import { motion, AnimatePresence } from 'framer-motion';
import { FiAlertCircle, FiCheckCircle, FiInfo, FiXCircle, FiX } from 'react-icons/fi';

interface ToastContextType {
  showToast: (options: ToastOptions) => string;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToastContext = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToastContext must be used within a ToastProvider');
  }
  return context;
};

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const { toasts, showToast, removeToast } = useToast();

  return (
    <ToastContext.Provider value={{ showToast, removeToast }}>
      {children}
      <div className="fixed top-4 right-4 z-50 w-full max-w-sm space-y-4">
        <AnimatePresence>
          {toasts.map((toast) => (
            <ToastNotification key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

interface ToastNotificationProps {
  toast: Toast;
  onClose: () => void;
}

const ToastNotification: React.FC<ToastNotificationProps> = ({ toast, onClose }) => {
  const iconMap = {
    info: <FiInfo className="h-5 w-5 text-blue-400" />,
    success: <FiCheckCircle className="h-5 w-5 text-green-400" />,
    warning: <FiAlertCircle className="h-5 w-5 text-yellow-400" />,
    error: <FiXCircle className="h-5 w-5 text-red-400" />,
  };

  const bgColorMap = {
    info: 'bg-blue-950 border-blue-800',
    success: 'bg-green-950 border-green-800',
    warning: 'bg-yellow-950 border-yellow-800',
    error: 'bg-red-950 border-red-800',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`rounded-lg border p-4 shadow-lg ${bgColorMap[toast.type]}`}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0">{iconMap[toast.type]}</div>
        <div className="ml-3 w-0 flex-1">
          <p className="text-sm font-medium text-white">{toast.title}</p>
          {toast.message && (
            <p className="mt-1 text-sm text-gray-300">{toast.message}</p>
          )}
        </div>
        <div className="ml-4 flex flex-shrink-0">
          <button
            onClick={onClose}
            className="inline-flex rounded-md text-gray-400 hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            <span className="sr-only">Close</span>
            <FiX className="h-5 w-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ToastProvider; 