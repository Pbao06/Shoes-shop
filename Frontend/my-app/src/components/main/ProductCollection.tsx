'use client'

import { useProducts } from '@/hooks/useProducts'
import type { Product } from '@/types/product'
import Image from 'next/image'
import Link from 'next/link'

// ── MOCK DATA (commented out, kept for reference) ───────────────────────────
// type Product = {
//   name: string
//   category: string
//   price: string
//   image: string | StaticImageData
//   alt: string
// }
//
// const products: Product[] = [
//   { name: 'Classic Leather Loafer', category: 'LOAFERS', price: '$320', image: womenCollection, alt: 'Classic black leather loafer on a stone pedestal' },
//   { name: 'Minimal Leather Sneaker', category: 'SNEAKERS', price: '$450', image: menCollection, alt: 'Minimal ivory leather sneaker on a stone pedestal' },
//   { name: 'Structured Chelsea Boot', category: 'BOOTS', price: '$380', image: heroCampaign, alt: 'Structured dark brown Chelsea boot on a stone pedestal' },
//   { name: 'Signature Leather Bag', category: 'BAGS', price: '$520', image: womenCollection, alt: 'Structured black leather handbag on a stone pedestal' },
// ]
// ─────────────────────────────────────────────────────────────────────────────

export function ProductCollection() {
  const { products, loading, error } = useProducts({ pageSize: 12 })
  const displayProducts = products.slice(0, 4)

  if (error) {
    return (
      <section aria-labelledby="collection-heading" className="bg-background px-6 py-24 md:px-12 md:py-36 lg:px-20">
        <div className="mx-auto max-w-[1400px]">
          <header className="text-center">
            <p className="text-[10px] font-medium tracking-[0.24em] text-muted-foreground">THE COLLECTION</p>
            <h2 id="collection-heading" className="mt-5 font-serif text-5xl leading-[0.95] tracking-[-0.04em] text-foreground md:text-7xl">
              Featured Pieces
            </h2>
          </header>
          <p className="mt-12 text-center text-[13px] tracking-[0.02em] text-red-600">{error}</p>
        </div>
      </section>
    )
  }

  if (loading) {
    return (
      <section aria-labelledby="collection-heading" className="bg-background px-6 py-24 md:px-12 md:py-36 lg:px-20">
        <div className="mx-auto max-w-[1400px]">
          <header className="text-center">
            <p className="text-[10px] font-medium tracking-[0.24em] text-muted-foreground">THE COLLECTION</p>
            <h2 id="collection-heading" className="mt-5 font-serif text-5xl leading-[0.95] tracking-[-0.04em] text-foreground md:text-7xl">
              Featured Pieces
            </h2>
          </header>
          <div className="mt-16 grid grid-cols-2 gap-x-4 gap-y-12 md:mt-24 md:gap-x-6 md:gap-y-16 lg:grid-cols-4 lg:gap-x-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-square bg-[#e9e4da]" />
                <div className="mt-4 h-3 w-2/3 bg-[#e9e4da] rounded" />
                <div className="mt-2 h-2 w-1/3 bg-[#e9e4da] rounded" />
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section aria-labelledby="collection-heading" className="bg-background px-6 py-24 md:px-12 md:py-36 lg:px-20">
      <div className="mx-auto max-w-[1400px]">
        <header className="text-center">
          <p className="text-[10px] font-medium tracking-[0.24em] text-muted-foreground">THE COLLECTION</p>
          <h2 id="collection-heading" className="mt-5 font-serif text-5xl leading-[0.95] tracking-[-0.04em] text-foreground md:text-7xl">
            Featured Pieces
          </h2>
        </header>

        {displayProducts.length === 0 ? (
          <p className="py-20 text-center text-[13px] tracking-[0.02em] text-muted-foreground">
            No products found.
          </p>
        ) : (
          <div className="mt-16 grid grid-cols-2 gap-x-4 gap-y-12 md:mt-24 md:gap-x-6 md:gap-y-16 lg:grid-cols-4 lg:gap-x-8">
            {displayProducts.map((product) => (
              <article key={product.id}>
                <Link href={`/product/${product.id}`} className="group block" aria-label={`View ${product.name}`}>
                  <div className="relative aspect-square overflow-hidden bg-muted">
                    {product.image ? (
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        sizes="(max-width: 767px) 46vw, (max-width: 1023px) 46vw, 23vw"
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.035]"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-[#e9e4da]" />
                    )}
                  </div>
                </Link>
                <div className="mt-4">
                  <h3 className="text-sm leading-5 text-foreground md:text-base">{product.name}</h3>
                  <p className="mt-1 text-[10px] font-medium tracking-[0.18em] text-muted-foreground">{product.category}</p>
                  <p className="mt-2 text-sm text-foreground">{product.priceDisplay || `$${product.price}`}</p>
                </div>
              </article>
            ))}
          </div>
        )}

        <div className="mt-20 flex justify-center md:mt-28">
          <Link href="/collections" className="border-b border-foreground/50 pb-2 text-[10px] font-medium tracking-[0.2em] text-foreground transition-colors hover:border-foreground">
            EXPLORE COLLECTION
          </Link>
        </div>
      </div>
    </section>
  )
}

export default ProductCollection
