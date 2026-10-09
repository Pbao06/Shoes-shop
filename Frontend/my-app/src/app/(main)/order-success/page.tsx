'use client'

import Link from 'next/link'
import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

export const dynamic = 'force-dynamic'

function OrderSuccessContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('orderId')

  return (
    <main data-testid="order-success-page" className="flex min-h-screen justify-center bg-background px-6 pt-30 text-center text-foreground">
      <section data-testid="order-success-content" className="max-w-xl">
        <p data-testid="order-confirmed-label" className="mb-8 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
          Order confirmed
        </p>
        <h1 data-testid="thank-you-heading" className="font-serif text-6xl font-normal">Thank you.</h1>
        {orderId && (
          <p data-testid="order-success-id" className="mt-4 text-sm text-muted-foreground">
            Your order <span data-testid="order-success-number" className="font-medium text-foreground">#{orderId}</span> has been placed.
          </p>
        )}
        <p data-testid="order-success-description" className="mx-auto mt-8 max-w-md text-sm leading-6 text-muted-foreground">
          We'll send a confirmation and delivery details to your email shortly.
        </p>

        <div data-testid="order-success-actions" className="mt-12 flex items-center justify-center gap-8">
          <Link
            href="/orders"
            data-testid="my-orders-link"
            className="inline-block border-b border-foreground pb-2 text-xs uppercase tracking-[0.2em]"
          >
            My Orders
          </Link>
          <Link
            href="/shop"
            data-testid="continue-shopping-link"
            className="inline-block border-b border-foreground pb-2 text-xs uppercase tracking-[0.2em]"
          >
            Continue shopping
          </Link>
        </div>
      </section>
    </main>
  )
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}>
      <OrderSuccessContent />
    </Suspense>
  )
}
