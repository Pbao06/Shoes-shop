'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

export default function OrderSuccessPage() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('orderId')

  return (
    <main className="flex min-h-screen justify-center bg-background px-6 pt-30 text-center text-foreground">
      <section className="max-w-xl">
        <p className="mb-8 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
          Order confirmed
        </p>
        <h1 className="font-serif text-6xl font-normal">Thank you.</h1>
        {orderId && (
          <p className="mt-4 text-sm text-muted-foreground">
            Your order <span className="font-medium text-foreground">#{orderId}</span> has been placed.
          </p>
        )}
        <p className="mx-auto mt-8 max-w-md text-sm leading-6 text-muted-foreground">
          We'll send a confirmation and delivery details to your email shortly.
        </p>

        <div className="mt-12 flex items-center justify-center gap-8">
          <Link
            href="/orders"
            className="inline-block border-b border-foreground pb-2 text-xs uppercase tracking-[0.2em]"
          >
            My Orders
          </Link>
          <Link
            href="/shop"
            className="inline-block border-b border-foreground pb-2 text-xs uppercase tracking-[0.2em]"
          >
            Continue shopping
          </Link>
        </div>
      </section>
    </main>
  )
}
