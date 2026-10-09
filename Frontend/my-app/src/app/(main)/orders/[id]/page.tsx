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
      <main data-testid="order-detail-loading" className="flex min-h-screen items-center justify-center bg-background text-foreground">
        <p className="font-serif text-3xl">Loading…</p>
      </main>
    )
  }

  if (error || !order) {
    return (
      <main data-testid="order-detail-error" className="flex min-h-screen items-center justify-center bg-background text-foreground">
        <p className="font-serif text-3xl text-red-600">{error ?? 'Order not found.'}</p>
      </main>
    )
  }

  return (
    <main data-testid="order-detail-page" className="min-h-screen bg-background px-5 py-14 text-foreground sm:px-8 md:py-20 lg:px-16">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/orders"
          data-testid="back-to-orders"
          className="mb-10 inline-block text-[10px] uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground"
        >
          ← Back to orders
        </Link>

        <div data-testid="order-header" className="flex flex-col gap-8 border-b border-border pb-8 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 data-testid="order-detail-number" className="font-serif text-3xl">Order #{order.orderNumber}</h1>
            <p data-testid="order-detail-date" className="mt-2 text-xs uppercase tracking-[0.16em] text-muted-foreground">
              Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </p>
          </div>
          <p data-testid="order-detail-status" className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
            Status: {order.status}
          </p>
        </div>

        <div className="grid gap-16 lg:grid-cols-[1fr_380px]">
          <section data-testid="order-items-section">
            <h2 data-testid="order-items-heading" className="font-serif text-xl">Items</h2>
            <div className="mt-6 divide-y divide-border border border-border">
              {order.items.map((item) => (
                <div
                  key={`${item.productId}-${item.productVariantId}`}
                  data-testid={`order-detail-item-${item.productId}`}
                  className="flex gap-4 py-5 sm:gap-6"
                >
                  <div className="relative size-24 shrink-0 overflow-hidden bg-muted sm:size-28">
                    <Image src={item.imageUrl ?? ''} alt={item.productName} fill className="object-cover" sizes="112px" />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col justify-center">
                    <h3 data-testid={`order-detail-item-name-${item.productId}`} className="font-serif text-xl">{item.productName}</h3>
                    <p data-testid={`order-detail-item-meta-${item.productId}`} className="mt-2 text-xs uppercase tracking-[0.12em] text-muted-foreground">
                      Size: {item.sizeName} · Qty: {item.quantity}
                    </p>
                    <p data-testid={`order-detail-item-price-${item.productId}`} className="mt-2 text-sm">${(item.unitPrice * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <aside data-testid="order-summary" className="h-fit border-t border-border pt-6 lg:sticky lg:top-8">
            <h2 className="font-serif text-xl">Order Summary</h2>
            <div className="mt-6 space-y-3 border-b border-border pb-5 text-sm">
              <div data-testid="order-subtotal" className="flex justify-between">
                <span>Subtotal</span>
                <span>${order.subtotal.toFixed(2)}</span>
              </div>
              <div data-testid="order-shipping" className="flex justify-between">
                <span>Shipping</span>
                <span>{order.shippingFee ? `$${order.shippingFee.toFixed(2)}` : 'Complimentary'}</span>
              </div>
              <div data-testid="order-total" className="flex justify-between border-t border-border pt-4 font-medium">
                <span>Total</span>
                <span>${order.totalAmount.toFixed(2)}</span>
              </div>
            </div>

            <h3 data-testid="shipping-address-heading" className="mt-8 font-serif text-xl">Shipping Address</h3>
            <div data-testid="shipping-address" className="mt-4 space-y-1 text-sm text-muted-foreground">
              {order.address && (
                <>
                  <p data-testid="address-recipient">{order.address.recipientName}</p>
                  <p data-testid="address-street">{order.address.street}</p>
                  <p data-testid="address-city">
                    {order.address.city}, {order.address.postalCode}
                  </p>
                  <p data-testid="address-country">{order.address.country}</p>
                  {order.address.email && <p data-testid="address-email">{order.address.email}</p>}
                </>
              )}
            </div>

            <p data-testid="payment-status" className="mt-8 text-xs uppercase tracking-[0.16em] text-muted-foreground">
              Payment: {order.paymentStatus}
            </p>
          </aside>
        </div>
      </div>
    </main>
  )
}
