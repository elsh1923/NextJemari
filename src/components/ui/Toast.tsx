"use client";

import * as React from "react";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";

type ToastType = "success" | "error" | "info" | "warning";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (message: string, type?: ToastType, duration?: number) => void;
  removeToast: (id: string) => void;
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([]);

  const addToast = React.useCallback(
    (message: string, type: ToastType = "info", duration = 3000) => {
      const id = Math.random().toString(36).substring(2, 9);
      setToasts((prev) => [...prev, { id, message, type, duration }]);

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    },
    []
  );

  const removeToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex min-w-[300px] items-center justify-between rounded-lg p-4 shadow-lg transition-all duration-300 animate-[slide-in-right_0.3s_ease-out] ${
              toast.type === "success"
                ? "bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-300"
                : toast.type === "error"
                ? "bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-300"
                : toast.type === "warning"
                ? "bg-yellow-50 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300"
                : "bg-blue-50 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300"
            }`}
          >
            <div className="flex items-center gap-3">
              {toast.type === "success" && <CheckCircle className="h-5 w-5" />}
              {toast.type === "error" && <AlertCircle className="h-5 w-5" />}
              {toast.type === "warning" && <AlertCircle className="h-5 w-5" />}
              {toast.type === "info" && <Info className="h-5 w-5" />}
              <p className="text-sm font-medium">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="ml-4 rounded-full p-1 hover:bg-black/5 dark:hover:bg-white/10"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = React.useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
