'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Award,
  ShoppingBag,
  LogOut,
  X,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Products', href: '/admin/products', icon: Package },
  { label: 'Categories', href: '/admin/categories', icon: FolderTree },
  { label: 'Brands', href: '/admin/brands', icon: Award },
  { label: 'Orders', href: '/admin/orders', icon: ShoppingBag },
] as const;

export function AdminSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const { logout } = useAuth();

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin';
    }
    return pathname.startsWith(href);
  };

  const handleLogout = () => {
    logout();
    onNavigate?.();
  };

  return (
    <aside className="flex h-full flex-col border-r border-[#1a1714]/10 bg-[#fcfbf8]">
      {/* Brand */}
      <div className="flex h-16 items-center justify-between border-b border-[#1a1714]/10 px-6 md:h-20 md:px-8">
        <Link
          href="/admin"
          className="font-serif text-[1.25rem] tracking-[0.18em] text-[#1a1714] md:text-[1.5rem]"
          onClick={onNavigate}
        >
          MAISON
        </Link>
        {/* Mobile close button */}
        <button
          type="button"
          onClick={onNavigate}
          className="flex h-8 w-8 items-center justify-center text-[#1a1714]/80 transition-colors hover:text-[#1a1714] md:hidden"
          aria-label="Close menu"
        >
          <X className="h-4 w-4" strokeWidth={1.4} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-6 md:px-4" aria-label="Admin">
        <ul className="space-y-1">
          {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
            const active = isActive(href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  onClick={onNavigate}
                  className={`flex items-center gap-3 rounded-none px-3 py-2.5 text-[11px] font-medium uppercase tracking-[0.18em] transition-colors ${
                    active
                      ? 'border-l-2 border-[#1a1714] bg-[#1a1714]/5 text-[#1a1714]'
                      : 'border-l-2 border-transparent text-[#1a1714]/70 hover:border-[#1a1714]/30 hover:text-[#1a1714]'
                  }`}
                >
                  <Icon
                    strokeWidth={1.4}
                    className={`h-4 w-4 ${
                      active ? 'text-[#1a1714]' : 'text-[#1a1714]/60'
                    }`}
                  />
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom actions */}
      <div className="border-t border-[#1a1714]/10 px-3 py-4 md:px-4">
        <Link
          href="/"
          onClick={onNavigate}
          className="flex items-center gap-3 px-3 py-2.5 text-[11px] font-medium uppercase tracking-[0.18em] text-[#1a1714]/70 transition-colors hover:text-[#1a1714]"
        >
          <ShoppingBag strokeWidth={1.4} className="h-4 w-4 text-[#1a1714]/60" />
          Back to Store
        </Link>
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 px-3 py-2.5 text-[11px] font-medium uppercase tracking-[0.18em] text-[#1a1714]/70 transition-colors hover:text-[#1a1714]"
        >
          <LogOut strokeWidth={1.4} className="h-4 w-4 text-[#1a1714]/60" />
          Logout
        </button>
      </div>
    </aside>
  );
}
