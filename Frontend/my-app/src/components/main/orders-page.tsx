'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import { useOrders, type Order, type OrderStatus } from '@/context/OrderContext'

const filters = ['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'] as const

export default function OrdersPage() {
  const { orders } = useOrders()
  const [filter, setFilter] = useState<(typeof filters)[number]>('All')
  const visibleOrders = useMemo(
    () => (filter === 'All' ? orders : orders.filter((order) => order.status === filter)),
    [filter, orders],
  )

  return (
    <main className="min-h-screen bg-background px-5 py-14 text-foreground sm:px-8 md:py-20 lg:px-16">
      <div className="mx-auto max-w-6xl">
        <h1 className="font-serif text-3xl font-medium tracking-tight sm:text-4xl">My Orders</h1>
        <nav className="mt-12 flex gap-6 overflow-x-auto border-b border-border" aria-label="Order status filters">
          {filters.map((item) => (
            <button
              key={item}
              type="button"
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
            <p className="border-y border-border py-20 text-center text-sm text-muted-foreground">
              No orders in this category.
            </p>
          )}
        </div>
      </div>
    </main>
  )
}

function OrderCard({ order }: { order: Order }) {
  const total = order.total

  return (
    <article className="border border-border p-5 sm:p-7 lg:p-8">
      <header className="flex flex-col gap-5 border-b border-border pb-6 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="font-serif text-2xl">Order #{order.id}</h2>
          <p className="mt-2 text-xs uppercase tracking-[0.16em] text-muted-foreground">{order.date}</p>
        </div>
        <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">{order.status}</p>
      </header>
      <div className="divide-y divide-border">
        {order.items.map((item) => (
          <div
            key={`${item.productId}-${item.size}-${item.color}`}
            className="flex gap-4 py-5 first:pt-6 sm:gap-6"
          >
            <div className="relative size-24 shrink-0 overflow-hidden bg-muted sm:size-28">
              <Image src={item.image} alt={item.name} fill className="object-cover" sizes="112px" />
            </div>
            <div className="flex min-w-0 flex-1 flex-col justify-center">
              <h3 className="font-serif text-xl">{item.name}</h3>
              <p className="mt-2 text-xs uppercase tracking-[0.12em] text-muted-foreground">
                Color: {item.color} · Size: {item.size} · Qty: {item.quantity}
              </p>
            </div>
          </div>
        ))}
      </div>
      <footer className="flex flex-col gap-4 border-t border-border pt-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Total</p>
          <p className="mt-1 font-serif text-2xl">${total.toLocaleString()}</p>
        </div>
        <Link
          href={`/orders/${order.id}`}
          className="w-fit border-b border-foreground pb-1 text-xs uppercase tracking-[0.16em]"
        >
          View Order
        </Link>
      </footer>
    </article>
  )
}
