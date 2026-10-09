'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import { useOrderApi } from '@/hooks/useOrderApi'
import { useAuth } from '@/context/AuthContext'
import type { OrderDto, OrderStatus } from '@/types/order'

const filters = ['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'] as const

export default function OrdersPage() {
  const { user } = useAuth()
  const { orders, loading, error } = useOrderApi(user?.id ?? 0)
  const [filter, setFilter] = useState<(typeof filters)[number]>('All')
  const visibleOrders = useMemo(
    () => (filter === 'All' ? orders : orders.filter((order) => order.status === filter)),
    [filter, orders],
  )

  if (loading) {
    return (
      <main data-testid="orders-loading" className="flex min-h-screen items-center justify-center bg-background text-foreground">
        <p className="font-serif text-3xl">Loading…</p>
      </main>
    )
  }

  if (error) {
    return (
      <main data-testid="orders-error" className="flex min-h-screen items-center justify-center bg-background text-foreground">
        <p className="font-serif text-3xl text-red-600">{error}</p>
      </main>
    )
  }

  return (
    <main data-testid="orders-page" className="min-h-screen bg-background px-5 py-14 text-foreground sm:px-8 md:py-20 lg:px-16">
      <div className="mx-auto max-w-6xl">
        <h1 data-testid="orders-title" className="font-serif text-3xl font-medium tracking-tight sm:text-4xl">My Orders</h1>
        <nav className="mt-12 flex gap-6 overflow-x-auto border-b border-border" aria-label="Order status filters">
          {filters.map((item) => (
            <button
              key={item}
              type="button"
              data-testid={`filter-${item.toLowerCase()}`}
              onClick={() => setFilter(item)}
              className={`shrink-0 pb-4 text-xs uppercase tracking-[0.18em] transition-colors ${filter === item ? 'border-b border-foreground text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
              aria-pressed={filter === item}
            >
              {item}
            </button>
          ))}
        </nav>

        <div className="mt-10 space-y-6">
          {visibleOrders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
          {visibleOrders.length === 0 && (
            <p data-testid="orders-empty" className="border-y border-border py-20 text-center text-sm text-muted-foreground">
              No orders in this category.
            </p>
          )}
        </div>
      </div>
    </main>
  )
}

function OrderCard({ order }: { order: OrderDto }) {
  const total = order.totalAmount

  return (
    <article data-testid={`order-card-${order.id}`} className="border border-border p-5 sm:p-7 lg:p-8">
      <header className="flex flex-col gap-5 border-b border-border pb-6 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 data-testid={`order-number-${order.id}`} className="font-serif text-2xl">Order #{order.orderNumber}</h2>
          <p data-testid={`order-date-${order.id}`} className="mt-2 text-xs uppercase tracking-[0.16em] text-muted-foreground">
            {new Date(order.createdAt).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
          </p>
        </div>
        <p data-testid={`order-status-${order.id}`} className="text-xs uppercase tracking-[0.16em] text-muted-foreground">{order.status}</p>
      </header>
      <div className="divide-y divide-border">
        {order.items.map((item) => (
          <div
            key={`${item.productId}-${item.productVariantId}`}
            data-testid={`order-item-${order.id}-${item.productId}`}
            className="flex gap-4 py-5 first:pt-6 sm:gap-6"
          >
            <div className="relative size-24 shrink-0 overflow-hidden bg-muted sm:size-28">
              <Image src={item.imageUrl ?? ''} alt={item.productName} fill className="object-cover" sizes="112px" />
            </div>
            <div className="flex min-w-0 flex-1 flex-col justify-center">
              <h3 data-testid={`order-item-name-${order.id}-${item.productId}`} className="font-serif text-xl">{item.productName}</h3>
              <p data-testid={`order-item-meta-${order.id}-${item.productId}`} className="mt-2 text-xs uppercase tracking-[0.12em] text-muted-foreground">
                Size: {item.sizeName} · Qty: {item.quantity}
              </p>
            </div>
          </div>
        ))}
      </div>
      <footer className="flex flex-col gap-4 border-t border-border pt-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p data-testid={`order-total-label-${order.id}`} className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Total</p>
          <p data-testid={`order-total-${order.id}`} className="mt-1 font-serif text-2xl">${total.toLocaleString()}</p>
        </div>
        <Link
          href={`/orders/${order.id}`}
          data-testid={`view-order-${order.id}`}
          className="w-fit border-b border-foreground pb-1 text-xs uppercase tracking-[0.16em]"
        >
          View Order
        </Link>
      </footer>
    </article>
  )
}
