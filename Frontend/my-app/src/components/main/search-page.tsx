'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Search } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useMemo } from 'react'
import { products } from '@/lib/products'

const categories = ['Shoes', 'Bags', 'Accessories', 'Men', 'Women']

export default function SearchPage() {
  const router = useRouter()
  const pathname = usePathname()
  const params = useSearchParams()
  const query = params.get('q') ?? ''
  const results = useMemo(() => {
    const term = query.trim().toLowerCase()
    if (!term) return []
    return products.filter((product) => [product.name, product.category, 'Atelier'].some((value) => value.toLowerCase().includes(term)))
  }, [query])
  const updateQuery = (value: string) => router.replace(value ? `${pathname}?q=${encodeURIComponent(value)}` : pathname)

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="mx-auto max-w-[1400px] px-6 pb-24 pt-24 md:px-10 md:pt-32 lg:px-16">
        <h1 className="font-serif text-3xl tracking-[-0.04em]">Search</h1>
        <label className="relative mt-10 block">
          <span className="sr-only">Search products</span>
          <input value={query} onChange={(event) => updateQuery(event.target.value)} placeholder="Search products..." className="w-full border border-border bg-background px-5 py-5 pr-14 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-foreground" />
          <Search className="pointer-events-none absolute right-5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
        </label>
        {!query && <div className="mt-16"><p className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">Suggested</p><div className="mt-6 flex flex-wrap gap-x-8 gap-y-4">{categories.map((category) => <button key={category} type="button" onClick={() => updateQuery(category)} className="text-sm transition-colors hover:text-muted-foreground">{category}</button>)}</div></div>}
        {query && <section className="mt-16" aria-live="polite"><h2 className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">Search Results</h2>{results.length ? <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-6 lg:gap-y-14">{results.map((product) => <Link href={`/product/${product.id}`} key={product.id} className="group"><div className="relative aspect-square overflow-hidden bg-secondary"><Image src={product.image} alt={product.name} fill sizes="(min-width: 1024px) 25vw, 50vw" className="object-cover transition-transform duration-700 group-hover:scale-105" /></div><div className="flex items-start justify-between gap-3 pt-4"><div><h3 className="text-sm leading-5">{product.name}</h3><p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-muted-foreground">Atelier</p></div><p className="shrink-0 text-sm">${product.price}</p></div></Link>)}</div> : <div className="py-28 text-center"><p className="font-serif text-3xl">No products found.</p><p className="mt-3 text-sm text-muted-foreground">Try searching for another product.</p></div>}</section>}
      </section>
    </main>
  )
}