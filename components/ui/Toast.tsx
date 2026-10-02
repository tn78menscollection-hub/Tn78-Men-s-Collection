"use client";

import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from "react";

interface ToastItem {
  id: string;
  message: string;
  type: "success" | "error" | "info";
  duration: number;
}

interface ToastContextValue {
  showToast: (message: string, type?: "success" | "error" | "info", duration?: number) => void;
}

const ToastContext = createContext<ToastContextValue>({ showToast: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const idCounter = useRef(0);

  const showToast = useCallback(
    (message: string, type: "success" | "error" | "info" = "success", duration = 3000) => {
      const id = `toast-${++idCounter.current}`;
      setToasts((prev) => [...prev, { id, message, type, duration }]);
    },
    []
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast container */}
      <div className="fixed bottom-24 lg:bottom-6 left-1/2 -translate-x-1/2 lg:left-auto lg:translate-x-0 lg:right-6 z-[60] flex flex-col items-center lg:items-end gap-2 pointer-events-none w-[90vw] lg:w-auto max-w-sm">
        {toasts.map((toast) => (
          <ToastCard
            key={toast.id}
            toast={toast}
            onDismiss={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastCard({
  toast,
  onDismiss,
}: {
  toast: ToastItem;
  onDismiss: () => void;
}) {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const exitTimer = setTimeout(() => {
      setExiting(true);
    }, toast.duration - 300);

    const removeTimer = setTimeout(() => {
      onDismiss();
    }, toast.duration);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(removeTimer);
    };
  }, [toast.duration, onDismiss]);

  const colorMap = {
    success: {
      bg: "bg-emerald-50 border-emerald-200",
      text: "text-emerald-800",
      bar: "bg-emerald-500",
      icon: (
        <svg className="w-4 h-4 text-emerald-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
        </svg>
      ),
    },
    error: {
      bg: "bg-red-50 border-red-200",
      text: "text-red-800",
      bar: "bg-red-500",
      icon: (
        <svg className="w-4 h-4 text-red-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
        </svg>
      ),
    },
    info: {
      bg: "bg-amber-50 border-amber-200",
      text: "text-amber-800",
      bar: "bg-amber-500",
      icon: (
        <svg className="w-4 h-4 text-amber-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  };

  const c = colorMap[toast.type];

  return (
    <div
      className={`pointer-events-auto w-full ${c.bg} border backdrop-blur-md rounded-xl shadow-lg overflow-hidden transition-all duration-300 ${
        exiting
          ? "opacity-0 translate-y-4 scale-95"
          : "opacity-100 translate-y-0 scale-100"
      }`}
      style={{
        animation: exiting ? undefined : "toastSlideIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards",
      }}
    >
      <div className="flex items-center gap-2.5 px-4 py-3">
        {c.icon}
        <span className={`text-xs font-heading font-bold ${c.text} flex-1`}>
          {toast.message}
        </span>
        <button
          type="button"
          onClick={() => {
            setExiting(true);
            setTimeout(onDismiss, 300);
          }}
          className="text-neutral-400 hover:text-neutral-600 transition-colors p-0.5"
          aria-label="Dismiss"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      {/* Animated progress bar */}
      <div className="h-[2px] w-full bg-transparent">
        <div
          className={`h-full ${c.bar} opacity-60`}
          style={{
            animation: `toastProgress ${toast.duration}ms linear forwards`,
          }}
        />
      </div>
    </div>
  );
}
