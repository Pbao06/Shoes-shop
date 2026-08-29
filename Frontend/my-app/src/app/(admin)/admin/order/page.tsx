'use client';

import { useMemo, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useAdminOrders } from '@/hooks/admin';
import { useToast } from '@/components/ui/Toast';
import { ShoppingBag, Search, Eye, RefreshCcw, ChevronDown } from 'lucide-react';
import type { AdminOrderStatus } from '@/types/admin/orders';

const STATUS_OPTIONS: AdminOrderStatus[] = [
  'Pending',
  'Processing',
  'Shipped',
  'Delivered',
  'Cancelled',
];

export default function AdminOrdersPage() {
  const { orders, loading, error, refetch } = useAdminOrders();
  const { showToast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');

  const filteredOrders = useMemo(() => {
    let result = orders;

    if (statusFilter) {
      result = result.filter((order) => order.status === statusFilter);
    }

    if (!searchQuery.trim()) return result;

    const q = searchQuery.toLowerCase();
    return result.filter((order) =>
      order.orderNumber.toLowerCase().includes(q) ||
      order.customerName.toLowerCase().includes(q) ||
      order.customerEmail.toLowerCase().includes(q),
    );
  }, [orders, searchQuery, statusFilter]);

  const paymentStatusStyles: Record<string, string> = {
    Paid: 'bg-[#1a1714]/10 text-[#1a1714]',
    Pending: 'bg-[#1a1714]/5 text-[#1a1714]/60',
    Failed: 'bg-[#b23a48]/10 text-[#b23a48]',
    Refunded: 'bg-[#1a1714]/5 text-[#1a1714]/60',
  };

  const orderStatusStyles: Record<string, string> = {
    Pending: 'bg-[#1a1714]/5 text-[#1a1714]/60',
    Processing: 'bg-[#1a1714]/10 text-[#1a1714]',
    Shipped: 'bg-[#1a1714]/10 text-[#1a1714]',
    Delivered: 'bg-[#2d6a4f]/10 text-[#2d6a4f]',
    Cancelled: 'bg-[#b23a48]/10 text-[#b23a48]',
  };

  if (loading) {
    return (
      <div className="px-6 py-10 md:px-12 md:py-16">
        <div className="mb-10">
          <div className="h-8 w-32 bg-[#1a1714]/10" />
          <div className="mt-2 h-3 w-64 bg-[#1a1714]/10" />
        </div>
        <div className="border border-[#1a1714]/10 bg-[#fcfbf8]">
          <div className="space-y-0">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="h-16 w-full border-b border-[#1a1714]/10 bg-[#1a1714]/[0.02] animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 py-16">
        <p className="font-serif text-2xl text-[#1a1714]">Failed to load orders</p>
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

  return (
    <div className="px-6 py-10 md:px-12 md:py-16">
      <div className="mb-10">
        <h1 className="font-serif text-3xl tracking-[-0.03em] md:text-4xl">Orders</h1>
        <p className="mt-2 text-[13px] tracking-[0.02em] text-[#1a1714]/60">
          View and manage customer orders.
        </p>
      </div>

      <div className="border border-[#1a1714]/10 bg-[#fcfbf8]">
        <div className="border-b border-[#1a1714]/10 px-6 py-5 md:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-serif text-xl tracking-[-0.02em]">All Orders</h2>
              <p className="mt-1 text-[11px] uppercase tracking-[0.16em] text-[#1a1714]/60">
                {filteredOrders.length} {filteredOrders.length === 1 ? 'order' : 'orders'}
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative">
                <Search strokeWidth={1.4} className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#1a1714]/50" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search orders..."
                  className="w-full border border-[#1a1714]/10 bg-[#fcfbf8] py-2.5 pl-9 pr-4 text-[13px] outline-none transition-colors focus:border-[#1a1714] placeholder:text-[#1a1714]/40 sm:w-64"
                />
              </div>
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full appearance-none border border-[#1a1714]/10 bg-[#fcfbf8] py-2.5 pl-4 pr-9 text-[13px] outline-none transition-colors focus:border-[#1a1714] sm:w-40"
                >
                  <option value="">All statuses</option>
                  {STATUS_OPTIONS.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
                <ChevronDown strokeWidth={1.4} className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#1a1714]/50 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="px-6 py-20 text-center md:px-8">
            <ShoppingBag strokeWidth={1.4} className="mx-auto h-8 w-8 text-[#1a1714]/30" />
            <p className="mt-4 text-[13px] tracking-[0.02em] text-[#1a1714]/60">
              {searchQuery || statusFilter ? 'No orders match your filters.' : 'No orders yet.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[13px]">
              <thead>
                <tr className="border-b border-[#1a1714]/10 text-[11px] uppercase tracking-[0.16em] text-[#1a1714]/60">
                  <th className="px-6 py-4 font-medium md:px-8">Order</th>
                  <th className="px-4 py-4 font-medium">Customer</th>
                  <th className="px-4 py-4 font-medium text-right">Total</th>
                  <th className="px-4 py-4 font-medium">Payment</th>
                  <th className="px-4 py-4 font-medium">Status</th>
                  <th className="px-4 py-4 font-medium">Date</th>
                  <th className="px-4 py-4 md:px-8" />
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1a1714]/10">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="transition-colors hover:bg-[#1a1714]/[0.02]">
                    <td className="px-6 py-4 md:px-8">
                      <p className="font-medium text-[#1a1714]">#{order.orderNumber}</p>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-[#1a1714]/80">{order.customerName}</p>
                      <p className="mt-0.5 text-[11px] text-[#1a1714]/50">{order.customerEmail}</p>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <span className="font-medium text-[#1a1714]">${order.totalAmount.toFixed(2)}</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-block px-3 py-1 text-[10px] font-medium uppercase tracking-[0.14em] ${paymentStatusStyles[order.paymentStatus] ?? 'bg-[#1a1714]/10 text-[#1a1714]'}`}>
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-block px-3 py-1 text-[10px] font-medium uppercase tracking-[0.14em] ${orderStatusStyles[order.status] ?? 'bg-[#1a1714]/10 text-[#1a1714]'}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-[#1a1714]/70">
                      {new Date(order.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="px-4 py-4 md:px-8">
                      <Link
                        href={`/admin/order/${order.id}`}
                        className="inline-flex items-center gap-1 text-[11px] font-medium uppercase tracking-[0.14em] text-[#1a1714]/70 transition-colors hover:text-[#1a1714]"
                      >
                        <Eye strokeWidth={1.4} className="h-3.5 w-3.5" />
                        View
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
