"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { products } from "@/data/products"

const categories = ["All", "Men", "Women", "Shoes", "Bags", "Accessories"]

const sortOptions = ["Featured", "Price: low to high", "Price: high to low"] as const
type SortOption = (typeof sortOptions)[number]

export default function ShopCollection() {
  const [activeCategory, setActiveCategory] = useState("All")
  const [sort, setSort] = useState<SortOption>("Featured")

  const visibleProducts = useMemo(() => {
    const filtered =
      activeCategory === "All"
        ? products
        : products.filter((product) => product.category === activeCategory)
    return [...filtered].sort((a, b) => {
      if (sort === "Price: low to high") return Number(a.price.slice(1)) - Number(b.price.slice(1))
      if (sort === "Price: high to low") return Number(b.price.slice(1)) - Number(a.price.slice(1))
      return 0
    })
  }, [activeCategory, sort])

  return (
    <section className="bg-[#fcfbf8] text-[#1a1714]">
      {/* ── Header block: grouped close, no dividers ── */}
      <div className="mx-auto max-w-[1400px] px-6 md:px-10 lg:px-16 pt-16 md:pt-24 pb-0">
        {/* <h1 className="font-serif text-[44px] md:text-[64px] leading-[1.02] tracking-[0.04em]">
          SHOP
        </h1>
        <p className="mt-3 text-[12px] uppercase tracking-[0.28em] text-[#8a8178]">
          Explore the collection
        </p> */}

        {/* Category bar — no full-width line, tight to header */}
        <nav className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-3">
          {categories.map((category) => {
            const active = activeCategory === category
            return (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                aria-pressed={active}
                className={`group relative text-[11px] uppercase tracking-[0.22em] transition-colors ${
                  active ? "text-[#1a1714]" : "text-[#9a9189] hover:text-[#1a1714]"
                }`}
              >
                <span className={active ? "font-semibold" : "font-normal"}>{category}</span>
                {/* short elegant underline, only as wide as the word, only on active */}
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

      {/* ── Filter / Sort row — whitespace separation, aligned with grid margins ── */}
      <div className="mx-auto max-w-[1400px] px-6 md:px-10 lg:px-16 mt-10 md:mt-14 flex items-center justify-between">
        <span className="text-[11px] uppercase tracking-[0.22em] text-[#8a8178]">Filter</span>
        <div className="flex items-center gap-3">
          <label
            htmlFor="sort"
            className="text-[11px] uppercase tracking-[0.22em] text-[#8a8178]"
          >
            Sort by
          </label>
          <select
            id="sort"
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
            className="bg-transparent text-[11px] uppercase tracking-[0.22em] text-[#1a1714] outline-none cursor-pointer"
          >
            {sortOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ── Product grid ── */}
      <div className="mx-auto max-w-[1400px] px-6 md:px-10 lg:px-16 mt-8 md:mt-10">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12 md:gap-x-8 md:gap-y-16">
          {visibleProducts.map((product) => (
            <Link href={`/product/${product.id}`} key={product.id} className="group cursor-pointer">
              <article>
                <div className="relative aspect-[3/4] overflow-hidden bg-[#f2efe8]">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="(max-width: 767px) 46vw, (max-width: 1023px) 30vw, 23vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  />
                </div>
                <div className="mt-4 flex flex-col">
                  <h3 className="font-serif text-[15px] tracking-[0.01em] text-[#1a1714]">
                    {product.name}
                  </h3>
                  <p className="mt-1 text-[10px] uppercase tracking-[0.22em] text-[#9a9189]">
                    {product.brand} / {product.category}
                  </p>
                  <p className="mt-2 text-[13px] tracking-[0.02em] text-[#1a1714]">
                    {product.price}
                  </p>
                </div>
              </article>
            </Link>
          ))}
        </div>

        {/* ── Pagination ── */}
        <div className="mt-16 md:mt-24 mb-20 md:mb-28 flex items-center justify-center gap-6">
          <button
            aria-label="Previous page"
            className="text-[11px] uppercase tracking-[0.22em] text-[#9a9189] hover:text-[#1a1714] transition-colors"
          >
            ←
          </button>
          <span className="text-[11px] uppercase tracking-[0.22em] text-[#1a1714]">1 2 3 4</span>
          <button
            aria-label="Next page"
            className="text-[11px] uppercase tracking-[0.22em] text-[#9a9189] hover:text-[#1a1714] transition-colors"
          >
            →
          </button>
        </div>
      </div>
    </section>
  )
}