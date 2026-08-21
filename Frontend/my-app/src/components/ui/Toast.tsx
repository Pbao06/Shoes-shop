"use client";

import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react";

type ToastType = "success" | "error" | "info";

type Toast = {
  id: number;
  message: string;
  type: ToastType;
};

type ToastContextValue = {
  showToast: (message: string, type?: ToastType) => void;
};

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

let toastId = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timers = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());

  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.filter((t) => t.id !== id));
    const timer = timers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timers.current.delete(id);
    }
  }, []);

  const showToast = useCallback(
    (message: string, type: ToastType = "success") => {
      const id = ++toastId;
      setToasts((current) => [...current, { id, message, type }]);
      const timer = setTimeout(() => dismiss(id), 3000);
      timers.current.set(id, timer);
    },
    [dismiss]
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast container — fixed bottom-right, quiet-luxury styling */}
      <div className="pointer-events-none fixed bottom-6 right-6 z-[100] flex flex-col items-end gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role="status"
            className="pointer-events-auto flex items-center gap-3 border border-[#1a1714]/10 bg-[#fcfbf8] px-4 py-3 shadow-[0_2px_12px_rgba(26,23,20,0.08)] animate-[toast-in_0.25s_ease-out]"
          >
            <span
              className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                toast.type === "success"
                  ? "bg-[#2d6a4f]"
                  : toast.type === "error"
                    ? "bg-[#b23a48]"
                    : "bg-[#1a1714]/40"
              }`}
            />
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#1a1714]/80">
              {toast.message}
            </p>
            <button
              onClick={() => dismiss(toast.id)}
              aria-label="Dismiss"
              className="ml-1 text-[#1a1714]/40 transition-colors hover:text-[#1a1714]"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M2 2l8 8M10 2l-8 8" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}