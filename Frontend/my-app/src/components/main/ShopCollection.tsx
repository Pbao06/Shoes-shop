"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
// ── MOCK DATA (commented out, kept for reference) ───────────────────────────
// import { products } from "@/data/products"
//
// const categories = ["All", "Men", "Women", "Shoes", "Bags", "Accessories"]
//
// const sortOptions = ["Featured", "Price: low to high", "Price: high to low"] as const
// type SortOption = (typeof sortOptions)[number]
//
// const visibleProducts = useMemo(() => {
//   const filtered =
//     activeCategory === "All"
//       ? products
//       : products.filter((product) => product.category === activeCategory)
//   return [...filtered].sort((a, b) => {
//     if (sort === "Price: low to high") return Number(a.price.slice(1)) - Number(b.price.slice(1))
//     if (sort === "Price: high to low") return Number(b.price.slice(1)) - Number(a.price.slice(1))
//     return 0
//   })
// }, [activeCategory, sort])
// ─────────────────────────────────────────────────────────────────────────────

import { useProducts } from "@/hooks/useProducts"
import type { Product } from "@/types/product"

const CATEGORIES = ["All", "Men", "Women", "Shoes", "Bags", "Accessories"] as const
const sortOptions = ["Featured", "Price: low to high", "Price: high to low"] as const
type SortOption = (typeof sortOptions)[number]

export default function ShopCollection() {
  const { products, loading, error, params, setFilters, setPage, refetch } =
    useProducts({ pageSize: 12 })

  const [sort, setSort] = useState<SortOption>("Featured")
  const [activeCategory, setActiveCategory] = useState<string>("All")

  // Normalize optional params (always set by the hook, but typed as optional).
  const page = params.page ?? 1
  const pageSize = params.pageSize ?? 12


  // Client-side sort on the current page (price-based options).
  const visibleProducts = useMemo(() => {
    const list = [...products]
    if (sort === "Price: low to high") list.sort((a, b) => a.price - b.price)
    else if (sort === "Price: high to low") list.sort((a, b) => b.price - a.price)
    return list
  }, [products, sort])

  // Clicking a category nav item sends its NAME to the backend, which already
  // supports filtering by category name (case-sensitive match on Category.Name).
  // "All" clears the filter. This is reliable regardless of which products are
  // currently loaded (unlike deriving ids from the product list).
  const onCategoryClick = (label: string) => {
    setActiveCategory(label)
    setFilters({ category: label === "All" ? undefined : label })
  }

  const sortLabel = sort === "Featured" ? "Featured" : sort.toUpperCase()
  const cycleSort = () => {
    setSort((prev) =>
      prev === "Featured"
        ? "Price: low to high"
        : prev === "Price: low to high"
          ? "Price: high to low"
          : "Featured",
    )
  }

  const handlePrev = () => {
    if (page > 1) setPage(page - 1)
  }
  const handleNext = () => {
    // Backend returns no total count; assume last page when fewer than pageSize.
    if (products.length === pageSize) setPage(page + 1)
  }

  return (
    <section className="bg-[#fcfbf8] text-[#1a1714]">
      {/* ── Header block: grouped close, no dividers ── */}
      <div className="mx-auto max-w-[1400px] px-6 md:px-10 lg:px-16 pt-8 md:pt-12 pb-0">
        {/* Category bar — subtle underline, only as wide as the word, on active */}
        <nav className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-3">
          {CATEGORIES.map((category) => {
            const active = activeCategory === category
            return (
              <button
                key={category}
                onClick={() => onCategoryClick(category)}
                aria-pressed={active}
                className={`group relative text-[11px] uppercase tracking-[0.22em] transition-colors ${
                  active ? "text-[#1a1714]" : "text-[#9a9189] hover:text-[#1a1714]"
                }`}
              >
                <span className={active ? "font-semibold" : "font-normal"}>
                  {category}
                </span>
                <span
                  className={`mt-1.5 block h-px bg-[#1a1714] transition-all duration-300 ${
                    active ? "w-full opacity-100" : "w-0 opacity-0"
                  }`}
                />
              </button>
            )
          })}
        </nav>
      </div>

      {/* ── Filter / Sort row ── */}
      <div className="mx-auto max-w-[1400px] px-6 md:px-10 lg:px-16 mt-10 md:mt-14 flex items-center justify-between">
        <span className="text-[11px] uppercase tracking-[0.22em] text-[#8a8178]">
          Filter
        </span>
        <button
          onClick={cycleSort}
          className="flex items-center gap-1 text-[11px] uppercase tracking-[0.22em] text-[#1a1714] hover:opacity-70 transition-opacity"
        >
          Sort by {sortLabel}
          <span className="text-[9px] leading-none">⌄</span>
        </button>
      </div>

      {/* ── Product grid / states ── */}
      <div className="mx-auto max-w-[1400px] px-6 md:px-10 lg:px-16 mt-8 md:mt-10">
        {error ? (
          <div className="py-20 text-center">
            <p className="text-[13px] tracking-[0.02em] text-[#b3261e]">
              {error}
            </p>
            <button
              onClick={() => refetch()}
              className="mt-4 text-[11px] uppercase tracking-[0.22em] text-[#1a1714] underline underline-offset-4 hover:opacity-70"
            >
              Retry
            </button>
          </div>
        ) : loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12 md:gap-x-8 md:gap-y-16">
            {Array.from({ length: pageSize }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[3/4] bg-[#e9e4da]" />
                <div className="mt-4 h-3 w-2/3 bg-[#e9e4da] rounded" />
                <div className="mt-2 h-2 w-1/3 bg-[#e9e4da] rounded" />
              </div>
            ))}
          </div>
        ) : visibleProducts.length === 0 ? (
          <p className="py-20 text-center text-[13px] tracking-[0.02em] text-[#9a9189]">
            No products found.
          </p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12 md:gap-x-8 md:gap-y-16">
            {visibleProducts.map((product: Product) => (
              <Link
                href={`/product/${product.id}`}
                key={product.id}
                className="group cursor-pointer"
              >
                <article>
                  <div className="relative aspect-[3/4] overflow-hidden bg-[#f2efe8]">
                    {product.image ? (
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        sizes="(max-width: 767px) 46vw, (max-width: 1023px) 30vw, 23vw"
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-[#e9e4da]" />
                    )}
                  </div>
                  <div className="mt-4 flex flex-col">
                    <h3 className="font-serif text-[15px] tracking-[0.01em] text-[#1a1714]">
                      {product.name}
                    </h3>
                    <p className="mt-1 text-[10px] uppercase tracking-[0.22em] text-[#9a9189]">
                      {product.brand} / {product.category}
                    </p>
                    <p className="mt-2 text-[13px] tracking-[0.02em] text-[#1a1714]">
                      {product.priceDisplay || `$${product.price}`}
                    </p>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}

        {/* ── Pagination ── */}
        <div className="mt-16 md:mt-24 mb-20 md:mb-28 flex items-center justify-center gap-6">
          <button
            aria-label="Previous page"
            onClick={handlePrev}
            disabled={page <= 1 || loading}
            className="text-[11px] uppercase tracking-[0.22em] text-[#9a9189] hover:text-[#1a1714] transition-colors disabled:opacity-30 disabled:hover:text-[#9a9189]"
          >
            ←
          </button>
          <span className="text-[11px] uppercase tracking-[0.22em] text-[#1a1714]">
            Page {page}
          </span>
          <button
            aria-label="Next page"
            onClick={handleNext}
            disabled={loading || products.length < pageSize}
            className="text-[11px] uppercase tracking-[0.22em] text-[#9a9189] hover:text-[#1a1714] transition-colors disabled:opacity-30 disabled:hover:text-[#9a9189]"
          >
            →
          </button>
        </div>
      </div>
    </section>
  )
}
