'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

// ── MOCK DATA (commented out, kept for reference) ───────────────────────────
// import { getProductById, getRelatedProducts, type Product } from '@/data/products'
// import { useCart } from '@/context/CartContext'
//
// type ProductDetailProps = {
//   id: string
// }
//
// export default function ProductDetail({ id }: ProductDetailProps) {
//   const product = getProductById(id)
//   if (!product) {
//     return (
//       <main className="min-h-screen bg-background text-foreground">
//         <div className="mx-auto max-w-[1400px] px-5 pb-24 pt-20 md:px-10 md:pt-28 lg:px-16">
//           <Link href="/shop" className="mb-10 inline-block text-[10px] uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground">← Back to shop</Link>
//           <p className="font-serif text-3xl tracking-[-0.03em]">Product not found.</p>
//         </div>
//       </main>
//     )
//   }
//
//   return <ProductDetailContent product={product} />
// }
//
// function ProductDetailContent({ product }: { product: Product }) {
//   const [activeImage, setActiveImage] = useState(0)
//   const [size, setSize] = useState('')
//   const [open, setOpen] = useState('Description')
//   const { addToCart } = useCart()
//
//   const relatedProducts = getRelatedProducts(product, 4)
//   const price = Number(product.price.replace(/[^0-9.]/g, ''))
//
//   function handleAddToCart() {
//     if (!size) return
//     addToCart({
//       productId: product.id,
//       name: product.name,
//       brand: product.brand,
//       price,
//       image: product.image,
//       size,
//       color: product.color,
//     })
//   }
//
//   return (
//     <main className="min-h-screen bg-background text-foreground">
//       <div className="mx-auto max-w-[1400px] px-5 pb-24 pt-20 md:px-10 md:pt-28 lg:px-16">
//         <Link href="/shop" className="mb-10 inline-block text-[10px] uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground">← Back to shop</Link>
//         <section className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
//           <div className="flex flex-col gap-4">
//             <div className="relative aspect-square overflow-hidden bg-secondary md:aspect-[1.08/1]">
//               <Image src={product.gallery[activeImage]} alt={product.name} fill priority sizes="(min-width: 1024px) 55vw, 100vw" className="object-cover" />
//             </div>
//             <div className="grid grid-cols-4 gap-3" aria-label="Product images">
//               {product.gallery.map((image, index) => {
//                 const src = typeof image === 'string' ? image : image.src
//                 return <button key={src} type="button" onClick={() => setActiveImage(index)} aria-label={`View product image ${index + 1}`} className={`relative aspect-square overflow-hidden bg-secondary ${activeImage === index ? 'ring-1 ring-foreground' : 'opacity-60 hover:opacity-100'}`}><Image src={image} alt="" fill sizes="25vw" className="object-cover" /></button>
//               })}
//             </div>
//           </div>
//           <div className="flex flex-col justify-center py-2 lg:py-8">
//             <p className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">{product.brand}</p>
//             <h1 className="mt-4 font-serif text-5xl leading-[0.95] tracking-[-0.04em] md:text-6xl">{product.name}</h1>
//             <p className="mt-6 text-lg">{product.price}</p>
//             <p className="mt-8 max-w-md text-sm leading-7 text-muted-foreground">{product.description}</p>
//             <div className="mt-10 border-t border-border pt-6"><p className="text-[10px] uppercase tracking-[0.2em]">Color <span className="text-muted-foreground">{product.color}</span></p><span className="mt-4 block h-5 w-5 rounded-full bg-foreground ring-2 ring-foreground ring-offset-2 ring-offset-background" aria-label={product.color} /></div>
//             <div className="mt-8"><p className="text-[10px] uppercase tracking-[0.2em]">Size</p><div className="mt-4 flex gap-2">{product.sizes.map((item) => <button key={item} type="button" onClick={() => setSize(item)} className={`h-11 w-11 border text-xs transition-colors ${size === item ? 'border-foreground bg-foreground text-background' : 'border-border hover:border-foreground'}`} aria-pressed={size === item}>{item}</button>)}</div></div>
//             <button type="button" onClick={handleAddToCart} disabled={!size} className={`mt-10 w-full px-6 py-4 text-[10px] uppercase tracking-[0.24em] transition-opacity ${size ? 'bg-foreground text-background hover:opacity-80' : 'cursor-not-allowed bg-muted text-muted-foreground'}`}>Add to Bag</button>
//             {!size && <p className="mt-3 text-center text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Select a size to add to bag</p>}
//           </div>
//         </section>
//         <section className="mx-auto mt-24 max-w-3xl border-t border-border" aria-label="Product information">{['Description','Materials','Shipping & Returns'].map((item) => <div key={item} className="border-b border-border"><button type="button" onClick={() => setOpen(open === item ? '' : item)} className="flex w-full items-center justify-between py-6 text-left text-[10px] uppercase tracking-[0.2em]">{item}<span className="text-lg font-light">{open === item ? '−' : '+'}</span></button>{open === item && <p className="max-w-2xl pb-7 text-sm leading-7 text-muted-foreground">{item === 'Materials' ? 'Full-grain leather upper, leather lining, and a refined rubber sole.' : item === 'Shipping & Returns' ? 'Complimentary delivery and considered returns within 14 days.' : product.description}</p>}</div>)}</section>
//         <section className="mt-28"><h2 className="mb-8 text-center font-serif text-4xl tracking-[-0.03em]">YOU MAY ALSO LIKE</h2><div className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4 lg:gap-6">{relatedProducts.map((item) => <Link href={`/product/${item.id}`} key={item.id} className="group"><div className="relative aspect-square overflow-hidden bg-secondary"><Image src={item.image} alt={item.name} fill sizes="25vw" className="object-cover transition-transform duration-700 group-hover:scale-105" /></div><div className="flex justify-between gap-3 pt-4 text-sm"><span>{item.name}</span><span>{item.price}</span></div></Link>)}</div></section>
//       </div>
//     </main>
//   )
// }
// ─────────────────────────────────────────────────────────────────────────────

import { getRelatedProducts, products as mockProducts } from '@/data/products'
import { useProduct } from '@/hooks/useProducts'
import type { ProductDetail } from '@/types/product'
import { useCart } from '@/context/CartContext'

type ProductDetailProps = {
  id: string
}

export default function ProductDetail({ id }: ProductDetailProps) {
  const { product, loading, error } = useProduct(Number(id))

  if (loading) {
    return (
      <main className="min-h-screen bg-background text-foreground">
        <div className="mx-auto max-w-[1400px] px-5 pb-24 pt-20 md:px-10 md:pt-28 lg:px-16">
          <Link href="/shop" className="mb-10 inline-block text-[10px] uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground">← Back to shop</Link>
          <p className="font-serif text-3xl tracking-[-0.03em]">Loading…</p>
        </div>
      </main>
    )
  }

  if (error || !product) {
    return (
      <main className="min-h-screen bg-background text-foreground">
        <div className="mx-auto max-w-[1400px] px-5 pb-24 pt-20 md:px-10 md:pt-28 lg:px-16">
          <Link href="/shop" className="mb-10 inline-block text-[10px] uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground">← Back to shop</Link>
          <p className="font-serif text-3xl tracking-[-0.03em]">Product not found.</p>
        </div>
      </main>
    )
  }

  return <ProductDetailContent product={product} />
}

function ProductDetailContent({ product }: { product: ProductDetail }) {
  const [activeImage, setActiveImage] = useState(0)
  const [size, setSize] = useState('')
  const [open, setOpen] = useState('Description')
  const { addToCart } = useCart()

  // Related products: no real related-API yet, keep mock data.
  const relatedProducts = getRelatedProducts(mockProducts[0], 4)
  const price = product.price

  function handleAddToCart() {
    if (!size) return
    addToCart({
      productId: product.id,
      name: product.name,
      brand: product.brand,
      price,
      image: product.image ?? product.gallery[0] ?? '',
      size,
      color: product.color ?? '',
    })
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-[1400px] px-5 pb-24 pt-20 md:px-10 md:pt-28 lg:px-16">
        <Link href="/shop" className="mb-10 inline-block text-[10px] uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground">← Back to shop</Link>
        <section className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
          <div className="flex flex-col gap-4">
            <div className="relative aspect-square overflow-hidden bg-secondary md:aspect-[1.08/1]">
              <Image src={product.gallery[activeImage]} alt={product.name} fill priority sizes="(min-width: 1024px) 55vw, 100vw" className="object-cover" />
            </div>
            <div className="grid grid-cols-4 gap-3" aria-label="Product images">
              {product.gallery.map((image, index) => (
                <button
                  key={image}
                  type="button"
                  onClick={() => setActiveImage(index)}
                  aria-label={`View product image ${index + 1}`}
                  className={`relative aspect-square overflow-hidden bg-secondary ${activeImage === index ? 'ring-1 ring-foreground' : 'opacity-60 hover:opacity-100'}`}
                >
                  <Image src={image} alt="" fill sizes="25vw" className="object-cover" />
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-col justify-center py-2 lg:py-8">
            <p className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">{product.brand}</p>
            <h1 className="mt-4 font-serif text-5xl leading-[0.95] tracking-[-0.04em] md:text-6xl">{product.name}</h1>
            <p className="mt-6 text-lg">{product.priceDisplay}</p>
            <p className="mt-8 max-w-md text-sm leading-7 text-muted-foreground">{product.description ?? ''}</p>
            <div className="mt-10 border-t border-border pt-6">
              <p className="text-[10px] uppercase tracking-[0.2em]">
                Color <span className="text-muted-foreground">{product.color ?? ''}</span>
              </p>
              <span
                className="mt-4 block h-5 w-5 rounded-full bg-foreground ring-2 ring-foreground ring-offset-2 ring-offset-background"
                aria-label={product.color ?? ''}
              />
            </div>
            <div className="mt-8">
              <p className="text-[10px] uppercase tracking-[0.2em]">Size</p>
              <div className="mt-4 flex gap-2">
                {product.sizes.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setSize(item)}
                    className={`h-11 w-11 border text-xs transition-colors ${
                      size === item ? 'border-foreground bg-foreground text-background' : 'border-border hover:border-foreground'
                    }`}
                    aria-pressed={size === item}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={!size}
              className={`mt-10 w-full px-6 py-4 text-[10px] uppercase tracking-[0.24em] transition-opacity ${
                size ? 'bg-foreground text-background hover:opacity-80' : 'cursor-not-allowed bg-muted text-muted-foreground'
              }`}
            >
              Add to Bag
            </button>
            {!size && (
              <p className="mt-3 text-center text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                Select a size to add to bag
              </p>
            )}
          </div>
        </section>
        <section
          className="mx-auto mt-24 max-w-3xl border-t border-border"
          aria-label="Product information"
        >
          {['Description', 'Materials', 'Shipping & Returns'].map((item) => (
            <div key={item} className="border-b border-border">
              <button
                type="button"
                onClick={() => setOpen(open === item ? '' : item)}
                className="flex w-full items-center justify-between py-6 text-left text-[10px] uppercase tracking-[0.2em]"
              >
                {item}
                <span className="text-lg font-light">{open === item ? '−' : '+'}</span>
              </button>
              {open === item && (
                <p className="max-w-2xl pb-7 text-sm leading-7 text-muted-foreground">
                  {item === 'Materials'
                    ? 'Full-grain leather upper, leather lining, and a refined rubber sole.'
                    : item === 'Shipping & Returns'
                      ? 'Complimentary delivery and considered returns within 14 days.'
                      : product.description ?? ''}
                </p>
              )}
            </div>
          ))}
        </section>
        <section className="mt-28">
          <h2 className="mb-8 text-center font-serif text-4xl tracking-[-0.03em]">YOU MAY ALSO LIKE</h2>
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4 lg:gap-6">
            {relatedProducts.map((item) => (
              <Link href={`/product/${item.id}`} key={item.id} className="group">
                <div className="relative aspect-square overflow-hidden bg-secondary">
                  <Image src={item.image} alt={item.name} fill sizes="25vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>
                <div className="flex justify-between gap-3 pt-4 text-sm">
                  <span>{item.name}</span>
                  <span>{item.price}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}
