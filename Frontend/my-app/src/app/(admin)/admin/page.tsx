'use client';

import { useAdminDashboard } from '@/hooks/admin';
import { AdminStatCard } from '@/components/admin/AdminStatCard';
import Link from 'next/link';
import {
  Package,
  ShoppingBag,
  Users,
  DollarSign,
  Clock,
  RefreshCcw,
  ChevronRight,
} from 'lucide-react';

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

const STATUS_STYLES: Record<string, string> = {
  Pending: 'bg-[#1a1714]/10 text-[#1a1714]',
  Processing: 'bg-[#1a1714]/10 text-[#1a1714]',
  Shipped: 'bg-[#1a1714]/10 text-[#1a1714]',
  Delivered: 'bg-[#1a1714]/10 text-[#1a1714]',
  Cancelled: 'bg-[#1a1714]/10 text-[#1a1714]',
};

export default function AdminDashboardPage() {
  const { stats, loading, error, refetch } = useAdminDashboard();

  if (loading) {
    return (
      <div className="px-6 py-10 md:px-12 md:py-16">
        <div className="mb-10">
          <h1 className="font-serif text-3xl tracking-[-0.03em] md:text-4xl">Dashboard</h1>
          <p className="mt-2 text-[13px] tracking-[0.02em] text-[#1a1714]/60">
            Overview of your store performance.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="border border-[#1a1714]/10 bg-[#fcfbf8] p-6 md:p-8 animate-pulse">
              <div className="h-3 w-24 bg-[#1a1714]/10" />
              <div className="mt-3 h-8 w-32 bg-[#1a1714]/10" />
            </div>
          ))}
        </div>
        <div className="mt-10 border border-[#1a1714]/10 bg-[#fcfbf8] p-6 md:p-8 animate-pulse">
          <div className="h-3 w-32 bg-[#1a1714]/10" />
          <div className="mt-6 space-y-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-12 w-full bg-[#1a1714]/10" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 py-16">
        <p className="font-serif text-2xl text-[#1a1714]">Failed to load dashboard</p>
        <p className="mt-2 text-[13px] tracking-[0.02em] text-[#1a1714]/60">{error}</p>
        <button
          type="button"
          onClick={refetch}
          className="mt-8 flex items-center gap-2 border border-[#1a1714]/10 px-6 py-3 text-[11px] font-medium uppercase tracking-[0.18em] text-[#1a1714] transition-colors hover:border-[#1a1714] hover:text-[#1a1714]"
        >
          <RefreshCcw strokeWidth={1.4} className="h-4 w-4" />
          Retry
        </button>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  const statCards = [
    {
      title: 'Total Orders',
      value: stats.totalOrders.toLocaleString(),
      icon: <ShoppingBag strokeWidth={1.4} className="h-5 w-5" />,
    },
    {
      title: 'Total Products',
      value: stats.totalProducts.toLocaleString(),
      icon: <Package strokeWidth={1.4} className="h-5 w-5" />,
    },
    {
      title: 'Total Users',
      value: stats.totalUsers.toLocaleString(),
      icon: <Users strokeWidth={1.4} className="h-5 w-5" />,
    },
    {
      title: 'Total Revenue',
      value: formatCurrency(stats.totalRevenue),
      icon: <DollarSign strokeWidth={1.4} className="h-5 w-5" />,
    },
    {
      title: 'Pending Orders',
      value: stats.pendingOrders.toLocaleString(),
      icon: <Clock strokeWidth={1.4} className="h-5 w-5" />,
    },
  ];

  return (
    <div className="px-6 py-10 md:px-12 md:py-16">
      <div className="mb-10">
        <h1 className="font-serif text-3xl tracking-[-0.03em] md:text-4xl">Dashboard</h1>
        <p className="mt-2 text-[13px] tracking-[0.02em] text-[#1a1714]/60">
          Overview of your store performance.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {statCards.map((card) => (
          <AdminStatCard key={card.title} title={card.title} value={card.value} icon={card.icon} />
        ))}
      </div>

      {/* Recent Orders */}
      <div className="mt-10 border border-[#1a1714]/10 bg-[#fcfbf8]">
        <div className="border-b border-[#1a1714]/10 px-6 py-5 md:px-8 md:py-6">
          <h2 className="font-serif text-xl tracking-[-0.02em]">Recent Orders</h2>
          <p className="mt-1 text-[11px] uppercase tracking-[0.16em] text-[#1a1714]/60">
            The 5 most recent orders
          </p>
        </div>

        {stats.recentOrders.length === 0 ? (
          <div className="px-6 py-16 text-center md:px-8">
            <p className="text-[13px] tracking-[0.02em] text-[#1a1714]/60">
              No orders yet.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[13px]">
              <thead>
                <tr className="border-b border-[#1a1714]/10 text-[11px] uppercase tracking-[0.16em] text-[#1a1714]/60">
                  <th className="px-6 py-4 font-medium md:px-8">Order</th>
                  <th className="px-4 py-4 font-medium">Customer</th>
                  <th className="px-4 py-4 font-medium text-right">Amount</th>
                  <th className="px-4 py-4 font-medium">Status</th>
                  <th className="px-4 py-4 font-medium">Date</th>
                  <th className="px-4 py-4 md:px-8" />
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1a1714]/10">
                {stats.recentOrders.map((order) => (
                  <tr key={order.id} className="transition-colors hover:bg-[#1a1714]/[0.02]">
                    <td className="px-6 py-4 md:px-8">
                      <p className="font-medium text-[#1a1714]">#{order.orderNumber}</p>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-[#1a1714]/80">{order.customerName}</p>
                    </td>
                    <td className="px-4 py-4 text-right">
                      {formatCurrency(order.totalAmount)}
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-block px-3 py-1 text-[10px] font-medium uppercase tracking-[0.14em] ${
                          STATUS_STYLES[order.status] ?? 'bg-[#1a1714]/10 text-[#1a1714]'
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-[#1a1714]/70">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="px-4 py-4 md:px-8">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="inline-flex items-center gap-1 text-[11px] font-medium uppercase tracking-[0.14em] text-[#1a1714]/70 transition-colors hover:text-[#1a1714]"
                      >
                        View
                        <ChevronRight strokeWidth={1.4} className="h-3.5 w-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
