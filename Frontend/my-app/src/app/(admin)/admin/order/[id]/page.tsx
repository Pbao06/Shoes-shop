'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useAdminOrder } from '@/hooks/admin';
import { adminOrderService } from '@/services/admin';
import { useToast } from '@/components/ui/Toast';
import { ArrowLeft, RefreshCcw, ChevronDown } from 'lucide-react';
import type { AdminOrderDetail, AdminOrderStatus } from '@/types/admin/orders';

const STATUS_OPTIONS: AdminOrderStatus[] = [
  'Pending',
  'Processing',
  'Shipped',
  'Delivered',
  'Cancelled',
];

const STATUS_STYLES: Record<string, string> = {
  Pending: 'bg-[#1a1714]/5 text-[#1a1714]/60',
  Processing: 'bg-[#1a1714]/10 text-[#1a1714]',
  Shipped: 'bg-[#1a1714]/10 text-[#1a1714]',
  Delivered: 'bg-[#2d6a4f]/10 text-[#2d6a4f]',
  Cancelled: 'bg-[#b23a48]/10 text-[#b23a48]',
};

const PAYMENT_STYLES: Record<string, string> = {
  Paid: 'bg-[#1a1714]/10 text-[#1a1714]',
  Pending: 'bg-[#1a1714]/5 text-[#1a1714]/60',
  Failed: 'bg-[#b23a48]/10 text-[#b23a48]',
  Refunded: 'bg-[#1a1714]/5 text-[#1a1714]/60',
};

export default function AdminOrderDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const orderId = Number(params.id);
  const { order, loading, error, refetch } = useAdminOrder(orderId);
  const { showToast } = useToast();

  const [updating, setUpdating] = useState(false);
  const [status, setStatus] = useState<string>('');

  useEffect(() => {
    if (order) {
      setStatus(order.status);
    }
  }, [order]);

  const handleStatusUpdate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!order || status === order.status) return;

    setUpdating(true);
    try {
      await adminOrderService.updateStatus(order.id, { status });
      refetch();
      showToast('Order status updated successfully');
    } catch {
      showToast('Failed to update order status.', 'error');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="px-6 py-10 md:px-12 md:py-16">
        <div className="mb-10">
          <div className="h-8 w-48 bg-[#1a1714]/10" />
          <div className="mt-2 h-3 w-64 bg-[#1a1714]/10" />
        </div>
        <div className="space-y-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-24 w-full bg-[#1a1714]/10 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 py-16">
        <p className="font-serif text-2xl text-[#1a1714]">{error ? 'Error loading order' : 'Order not found'}</p>
        {error && <p className="mt-2 text-[13px] tracking-[0.02em] text-[#1a1714]/60">{error}</p>}
        <Link
          href="/admin/order"
          className="mt-8 inline-flex items-center gap-2 border border-[#1a1714]/10 px-6 py-3 text-[11px] font-medium uppercase tracking-[0.18em] text-[#1a1714] transition-colors hover:border-[#1a1714]"
        >
          <ArrowLeft strokeWidth={1.4} className="h-4 w-4" />
          Back to orders
        </Link>
      </div>
    );
  }

  return (
    <div className="px-6 py-10 md:px-12 md:py-16">
      <div className="mb-10">
        <Link
          href="/admin/order"
          className="inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-[#1a1714]/70 transition-colors hover:text-[#1a1714]"
        >
          <ArrowLeft strokeWidth={1.4} className="h-4 w-4" />
          Back to orders
        </Link>
        <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="font-serif text-3xl tracking-[-0.03em] md:text-4xl">
              Order #{order.orderNumber}
            </h1>
            <p className="mt-2 text-[13px] tracking-[0.02em] text-[#1a1714]/60">
              Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </p>
          </div>

          <form onSubmit={handleStatusUpdate} className="flex items-center gap-3">
            <div className="relative">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full appearance-none border border-[#1a1714]/10 bg-[#fcfbf8] py-2.5 pl-4 pr-9 text-[13px] outline-none transition-colors focus:border-[#1a1714]"
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <ChevronDown strokeWidth={1.4} className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#1a1714]/50 pointer-events-none" />
            </div>
            <button
              type="submit"
              disabled={updating || status === order.status}
              className="border border-[#1a1714] bg-[#1a1714] px-5 py-2.5 text-[11px] font-medium uppercase tracking-[0.18em] text-[#fcfbf8] transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {updating ? 'Saving...' : 'Update'}
            </button>
          </form>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-8">
          {/* Customer & Shipping */}
          <div className="border border-[#1a1714]/10 bg-[#fcfbf8]">
            <div className="border-b border-[#1a1714]/10 px-6 py-5 md:px-8">
              <h2 className="font-serif text-xl tracking-[-0.02em]">Customer & Shipping</h2>
            </div>
            <div className="px-6 py-6 md:px-8">
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.16em] text-[#1a1714]/60">Customer</p>
                  <p className="mt-2 text-[13px] text-[#1a1714]">{order.customerName}</p>
                  <p className="mt-1 text-[13px] text-[#1a1714]/70">{order.customerEmail}</p>
                </div>
                {order.shippingAddress && (
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.16em] text-[#1a1714]/60">Shipping Address</p>
                    <div className="mt-2 space-y-1 text-[13px] text-[#1a1714]/80">
                      <p>{order.shippingAddress.recipientName}</p>
                      <p>{order.shippingAddress.street}</p>
                      <p>
                        {order.shippingAddress.city}, {order.shippingAddress.postalCode}
                      </p>
                      <p>{order.shippingAddress.country}</p>
                      {order.shippingAddress.phoneNumber && <p>{order.shippingAddress.phoneNumber}</p>}
                      {order.shippingAddress.email && <p>{order.shippingAddress.email}</p>}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="border border-[#1a1714]/10 bg-[#fcfbf8]">
            <div className="border-b border-[#1a1714]/10 px-6 py-5 md:px-8">
              <h2 className="font-serif text-xl tracking-[-0.02em]">Items</h2>
              <p className="mt-1 text-[11px] uppercase tracking-[0.16em] text-[#1a1714]/60">
                {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
              </p>
            </div>
            <div className="divide-y divide-[#1a1714]/10">
              {order.items.map((item) => (
                <div key={`${item.productId}-${item.sizeName}`} className="px-6 py-5 md:px-8">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-medium text-[#1a1714]">{item.productName}</p>
                      <p className="mt-1 text-[11px] uppercase tracking-[0.12em] text-[#1a1714]/50">
                        Size: {item.sizeName}
                      </p>
                    </div>
                    <div className="flex items-center gap-6 text-right text-[13px]">
                      <div>
                        <p className="text-[11px] uppercase tracking-[0.12em] text-[#1a1714]/50">Qty</p>
                        <p className="mt-0.5 text-[#1a1714]">{item.quantity}</p>
                      </div>
                      <div>
                        <p className="text-[11px] uppercase tracking-[0.12em] text-[#1a1714]/50">Unit Price</p>
                        <p className="mt-0.5 text-[#1a1714]">${item.unitPrice.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-[11px] uppercase tracking-[0.12em] text-[#1a1714]/50">Total</p>
                        <p className="mt-0.5 font-medium text-[#1a1714]">${item.totalPrice.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          {/* Status */}
          <div className="border border-[#1a1714]/10 bg-[#fcfbf8]">
            <div className="border-b border-[#1a1714]/10 px-6 py-5">
              <h2 className="font-serif text-xl tracking-[-0.02em]">Status</h2>
            </div>
            <div className="px-6 py-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] uppercase tracking-[0.16em] text-[#1a1714]/60">Order Status</span>
                <span className={`inline-block px-3 py-1 text-[10px] font-medium uppercase tracking-[0.14em] ${STATUS_STYLES[order.status] ?? 'bg-[#1a1714]/10 text-[#1a1714]'}`}>
                  {order.status}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] uppercase tracking-[0.16em] text-[#1a1714]/60">Payment Status</span>
                <span className={`inline-block px-3 py-1 text-[10px] font-medium uppercase tracking-[0.14em] ${PAYMENT_STYLES[order.paymentStatus] ?? 'bg-[#1a1714]/10 text-[#1a1714]'}`}>
                  {order.paymentStatus}
                </span>
              </div>
            </div>
          </div>

          {/* Payment */}
          {order.payment && (
            <div className="border border-[#1a1714]/10 bg-[#fcfbf8]">
              <div className="border-b border-[#1a1714]/10 px-6 py-5">
                <h2 className="font-serif text-xl tracking-[-0.02em]">Payment</h2>
              </div>
              <div className="px-6 py-6 space-y-3 text-[13px]">
                <div className="flex justify-between">
                  <span className="text-[#1a1714]/60">Method</span>
                  <span className="text-[#1a1714]">{order.payment.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#1a1714]/60">Amount</span>
                  <span className="text-[#1a1714]">${order.payment.amount.toFixed(2)}</span>
                </div>
                {order.payment.transactionId && (
                  <div className="flex justify-between">
                    <span className="text-[#1a1714]/60">Transaction ID</span>
                    <span className="text-[#1a1714]">{order.payment.transactionId}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-[#1a1714]/60">Date</span>
                  <span className="text-[#1a1714]">
                    {new Date(order.payment.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Summary */}
          <div className="border border-[#1a1714]/10 bg-[#fcfbf8]">
            <div className="border-b border-[#1a1714]/10 px-6 py-5">
              <h2 className="font-serif text-xl tracking-[-0.02em]">Summary</h2>
            </div>
            <div className="px-6 py-6 space-y-3 text-[13px]">
              <div className="flex justify-between">
                <span className="text-[#1a1714]/60">Items</span>
                <span className="text-[#1a1714]">{order.itemCount}</span>
              </div>
              <div className="flex justify-between border-t border-[#1a1714]/10 pt-4 font-medium">
                <span className="text-[#1a1714]">Total</span>
                <span className="text-[#1a1714]">${order.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
