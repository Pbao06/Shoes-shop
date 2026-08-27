'use client';

import { Menu, User } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface AdminHeaderProps {
  onMenuToggle: () => void;
}

export function AdminHeader({ onMenuToggle }: AdminHeaderProps) {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-40 h-16 border-b border-[#1a1714]/10 bg-[#fcfbf8]/95 backdrop-blur-[2px] md:h-20">
      <div className="flex h-full w-full items-center justify-between px-4 md:px-8">
        {/* Left — mobile menu + context */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onMenuToggle}
            className="flex h-9 w-9 items-center justify-center text-[#1a1714]/80 transition-colors hover:text-[#1a1714] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#1a1714] focus-visible:ring-offset-2 focus-visible:ring-offset-[#fcfbf8] md:hidden"
            aria-label="Toggle menu"
          >
            <Menu strokeWidth={1.4} className="h-[18px] w-[18px]" />
          </button>
          <div className="hidden md:block">
            <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#1a1714]/60">
              Admin
            </p>
          </div>
        </div>

        {/* Right — user info */}
        <div className="flex items-center gap-3">
          {user && (
            <div className="hidden items-center gap-2 sm:flex">
              <div className="flex h-7 w-7 items-center justify-center border border-[#1a1714]/10 bg-[#1a1714]/5">
                <User strokeWidth={1.4} className="h-3.5 w-3.5 text-[#1a1714]/70" />
              </div>
              <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#1a1714]/70">
                {user.email}
              </span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
