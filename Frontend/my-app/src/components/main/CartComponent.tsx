'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/context/CartContext'

const formatPrice = (price: number) => `$${price.toLocaleString('en-US')}`

export default function CartPage() {
  const { items, increaseQuantity, decreaseQuantity, removeItem, subtotal } = useCart()
  const shipping = 0

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-[1400px] px-5 pb-24 pt-6 md:px-10 md:pt-10 lg:px-16">
        {/* <header className=" pb-10 md:pb-14">
          <p className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">Atelier / Your selection</p>
          <h1 className="mt-5 font-serif text-6xl tracking-[-0.05em] md:text-8xl">Cart</h1>
        </header> */}
        <header className="pb-10 md:pb-14">
          <p className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">Atelier / Your selection</p>
         <div className="mt-5 flex items-start justify-between">
            <h1 className="font-serif text-4xl tracking-[-0.05em] md:text-5xl">Cart</h1>
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground pt-2">
              {items.length} {items.length === 1 ? 'Item' : 'Items'}
            </p>
        </div>
        </header>

        {items.length ? (
          <div className="grid gap-16 pt-2 lg:grid-cols-[1fr_360px] lg:gap-24">
            <section aria-labelledby="cart-items-heading">
              <h2 id="cart-items-heading" className="sr-only">Cart items</h2>
              <div className="border-t border-border">
                {items.map((item) => (
                  <article key={`${item.productId}-${item.size}-${item.color}`} className="grid gap-5 border-b border-border py-7 sm:grid-cols-[150px_1fr] md:grid-cols-[180px_1fr]">
                    <div className="relative aspect-square overflow-hidden bg-secondary">
                      <Image src={item.image} alt={item.name} fill sizes="180px" className="object-cover" />
                    </div>
                    <div className="flex min-h-full flex-col justify-between gap-8">
                      <div className="flex items-start justify-between gap-5">
                        <div>
                          <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{item.brand}</p>
                          <h3 className="mt-3 font-serif text-3xl tracking-[-0.03em]">{item.name}</h3>
                          <dl className="mt-5 grid grid-cols-2 gap-x-8 gap-y-2 text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                            <div><dt className="sr-only">Size</dt><dd>Size / {item.size}</dd></div>
                            <div><dt className="sr-only">Color</dt><dd>Color / {item.color}</dd></div>
                          </dl>
                        </div>
                        <p className="shrink-0 text-sm">{formatPrice(item.price * item.quantity)}</p>
                      </div>
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center border border-border" aria-label={`Quantity for ${item.name}`}>
                          <button type="button" onClick={() => decreaseQuantity(item.productId, item.size, item.color)} className="h-9 w-9 text-lg text-muted-foreground transition-colors hover:text-foreground" aria-label={`Decrease ${item.name} quantity`}>−</button>
                          <span className="w-8 text-center text-xs" aria-live="polite">{item.quantity}</span>
                          <button type="button" onClick={() => increaseQuantity(item.productId, item.size, item.color)} className="h-9 w-9 text-lg text-muted-foreground transition-colors hover:text-foreground" aria-label={`Increase ${item.name} quantity`}>+</button>
                        </div>
                        <button type="button" onClick={() => removeItem(item.productId, item.size, item.color)} className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">Remove</button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <aside className="h-fit border-t border-border pt-7 lg:sticky lg:top-8" aria-labelledby="summary-heading">
              <h2 id="summary-heading" className="font-serif text-3xl tracking-[-0.03em]">Order Summary</h2>
              <dl className="mt-8 space-y-4 border-b border-border pb-7 text-sm">
                <div className="flex justify-between"><dt className="text-muted-foreground">Subtotal</dt><dd>{formatPrice(subtotal)}</dd></div>
                <div className="flex justify-between"><dt className="text-muted-foreground">Shipping</dt><dd>{shipping ? formatPrice(shipping) : 'Complimentary'}</dd></div>
                <div className="flex justify-between pt-4 text-base"><dt>Total</dt><dd>{formatPrice(subtotal + shipping)}</dd></div>
              </dl>
              <Link href="/checkout" className="mt-7 block w-full bg-foreground px-6 py-4 text-center text-[10px] uppercase tracking-[0.24em] text-background transition-opacity hover:opacity-80">Checkout</Link>
              <Link href="/shop" className="mt-7 block text-center text-[10px] uppercase tracking-[0.2em] text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">Continue Shopping</Link>
            </aside>
          </div>
        ) : (
          <div className="flex min-h-[360px] flex-col items-center justify-center border-b border-border text-center">
            <h2 className="font-serif text-4xl tracking-[-0.03em]">Your cart is empty</h2>
            <Link href="/shop" className="mt-8 bg-foreground px-6 py-4 text-[10px] uppercase tracking-[0.24em] text-background">Continue Shopping</Link>
          </div>
        )}
      </div>
    </main>
  )
}