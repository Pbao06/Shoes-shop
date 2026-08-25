"use client";

import { useEffect } from "react";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  primaryLabel?: string;
  secondaryLabel?: string;
  onPrimary?: () => void;
  onSecondary?: () => void;
};

export default function Modal({
  isOpen,
  onClose,
  title,
  message,
  primaryLabel = "OK",
  secondaryLabel = "Cancel",
  onPrimary,
  onSecondary,
}: ModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center">
      <div
        className="absolute inset-0 bg-[#1a1714]/15 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-[420px] mx-4 bg-[#fcfbf8] border border-[#1a1714]/10 shadow-[0_2px_12px_rgba(26,23,20,0.08)] p-8">
        <h2 className="font-serif text-3xl tracking-[-0.03em] text-[#1a1714]">
          {title}
        </h2>
        <p className="mt-4 text-[13px] tracking-[0.02em] text-muted-foreground">
          {message}
        </p>
        <div className="mt-8 flex items-center justify-end gap-4">
          {secondaryLabel && (
            <button
              type="button"
              onClick={onSecondary ?? onClose}
              className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            >
              {secondaryLabel}
            </button>
          )}
          {primaryLabel && (
            <button
              type="button"
              onClick={onPrimary}
              className="bg-foreground text-background px-6 py-4 text-[10px] uppercase tracking-[0.24em] transition-opacity hover:opacity-80"
            >
              {primaryLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
