'use client'

import Image from 'next/image'
import Link from 'next/link'
import { notFound, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useOrderApi } from '@/hooks/useOrderApi'
import { useAuth } from '@/context/AuthContext'

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { id } = params
  const { user } = useAuth()
  const { getOrderById, loading, error } = useOrderApi(user?.id ?? 0)
  const [order, setOrder] = useState<Awaited<ReturnType<typeof getOrderById>> | null>(null)

  useEffect(() => {
    const numericId = Number(id)
    if (Number.isNaN(numericId)) {
      notFound()
      return
    }

    getOrderById(numericId).then((result) => {
      if (!result) {
        notFound()
        return
      }
      setOrder(result)
    })
  }, [id, getOrderById])

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background text-foreground">
        <p className="font-serif text-3xl">Loading…</p>
      </main>
    )
  }

  if (error || !order) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background text-foreground">
        <p className="font-serif text-3xl text-red-600">{error ?? 'Order not found.'}</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background px-5 py-14 text-foreground sm:px-8 md:py-20 lg:px-16">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/orders"
          className="mb-10 inline-block text-[10px] uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground"
        >
          ← Back to orders
        </Link>

        <div className="flex flex-col gap-8 border-b border-border pb-8 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="font-serif text-3xl">Order #{order.orderNumber}</h1>
            <p className="mt-2 text-xs uppercase tracking-[0.16em] text-muted-foreground">
              Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </p>
          </div>
          <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
            Status: {order.status}
          </p>
        </div>

        <div className="grid gap-16 lg:grid-cols-[1fr_380px]">
          <section>
            <h2 className="font-serif text-xl">Items</h2>
            <div className="mt-6 divide-y divide-border border border-border">
              {order.items.map((item) => (
                <div
                  key={`${item.productId}-${item.productVariantId}`}
                  className="flex gap-4 py-5 sm:gap-6"
                >
                  <div className="relative size-24 shrink-0 overflow-hidden bg-muted sm:size-28">
                    <Image src={item.imageUrl ?? ''} alt={item.productName} fill className="object-cover" sizes="112px" />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col justify-center">
                    <h3 className="font-serif text-xl">{item.productName}</h3>
                    <p className="mt-2 text-xs uppercase tracking-[0.12em] text-muted-foreground">
                      Size: {item.sizeName} · Qty: {item.quantity}
                    </p>
                    <p className="mt-2 text-sm">${(item.unitPrice * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <aside className="h-fit border-t border-border pt-6 lg:sticky lg:top-8">
            <h2 className="font-serif text-xl">Order Summary</h2>
            <div className="mt-6 space-y-3 border-b border-border pb-5 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{order.shippingFee ? `$${order.shippingFee.toFixed(2)}` : 'Complimentary'}</span>
              </div>
              <div className="flex justify-between border-t border-border pt-4 font-medium">
                <span>Total</span>
                <span>${order.totalAmount.toFixed(2)}</span>
              </div>
            </div>

            <h3 className="mt-8 font-serif text-xl">Shipping Address</h3>
            <div className="mt-4 space-y-1 text-sm text-muted-foreground">
              {order.address && (
                <>
                  <p>
                    {order.address.recipientName}
                  </p>
                  <p>{order.address.street}</p>
                  <p>
                    {order.address.city}, {order.address.postalCode}
                  </p>
                  <p>{order.address.country}</p>
                  {order.address.email && <p>{order.address.email}</p>}
                </>
              )}
            </div>

            <p className="mt-8 text-xs uppercase tracking-[0.16em] text-muted-foreground">
              Payment: {order.paymentStatus}
            </p>
          </aside>
        </div>
      </div>
    </main>
  )
}
