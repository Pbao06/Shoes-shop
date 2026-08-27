'use client';

import { useState } from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#fcfbf8] text-[#1a1714]">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-[#1a1714]/10 backdrop-blur-[2px] md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar — fixed on mobile, static on desktop */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-200 ease-in-out md:static md:z-auto md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <AdminSidebar onNavigate={() => setSidebarOpen(false)} />
      </div>

      {/* Main content area */}
      <div className="flex flex-1 flex-col min-w-0">
        <AdminHeader onMenuToggle={() => setSidebarOpen(true)} />
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
