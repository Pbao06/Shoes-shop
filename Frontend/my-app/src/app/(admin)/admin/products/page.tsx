'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAdminProducts } from '@/hooks/admin';
import { useAdminBrands } from '@/hooks/admin';
import { useAdminCategories } from '@/hooks/admin';
import { adminProductService } from '@/services/admin';
import { Package, Plus, Search, Trash2, Pencil, RefreshCcw } from 'lucide-react';

export default function AdminProductsPage() {
  const { products, loading, error, refetch } = useAdminProducts();
  const { brands } = useAdminBrands();
  const { categories } = useAdminCategories();
  const [searchQuery, setSearchQuery] = useState('');
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const brandMap = useMemo(() => {
    const map = new Map<number, string>();
    for (const brand of brands) map.set(brand.id, brand.name);
    return map;
  }, [brands]);

  const categoryMap = useMemo(() => {
    const map = new Map<number, string>();
    for (const category of categories) map.set(category.id, category.name);
    return map;
  }, [categories]);

  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return products;
    const q = searchQuery.toLowerCase();
    return products.filter((product) => product.name.toLowerCase().includes(q));
  }, [products, searchQuery]);

  const handleDelete = async (id: number) => {
    setDeletingId(id);
    try {
      await adminProductService.delete(id);
      refetch();
    } catch {
      // error is handled by the hook
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="px-6 py-10 md:px-12 md:py-16">
        <div className="mb-10">
          <div className="h-8 w-32 bg-[#1a1714]/10" />
          <div className="mt-2 h-3 w-64 bg-[#1a1714]/10" />
        </div>
        <div className="border border-[#1a1714]/10 bg-[#fcfbf8]">
          <div className="space-y-0">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="h-16 w-full border-b border-[#1a1714]/10 bg-[#1a1714]/[0.02] animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 py-16">
        <p className="font-serif text-2xl text-[#1a1714]">Failed to load products</p>
        <p className="mt-2 text-[13px] tracking-[0.02em] text-[#1a1714]/60">{error}</p>
        <button
          type="button"
          onClick={refetch}
          className="mt-8 flex items-center gap-2 border border-[#1a1714]/10 px-6 py-3 text-[11px] font-medium uppercase tracking-[0.18em] text-[#1a1714] transition-colors hover:border-[#1a1714] hover:text-[#1a1714]"
        >
          <RefreshCcw strokeWidth={1.4} className="h-4 w-4" />
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="px-6 py-10 md:px-12 md:py-16">
      <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl tracking-[-0.03em] md:text-4xl">Products</h1>
          <p className="mt-2 text-[13px] tracking-[0.02em] text-[#1a1714]/60">
            Manage your product catalog, variants, and inventory.
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center justify-center gap-2 border border-[#1a1714] bg-[#1a1714] px-6 py-3 text-[11px] font-medium uppercase tracking-[0.18em] text-[#fcfbf8] transition-opacity hover:opacity-80"
        >
          <Plus strokeWidth={1.4} className="h-4 w-4" />
          Add Product
        </Link>
      </div>

      <div className="border border-[#1a1714]/10 bg-[#fcfbf8]">
        <div className="border-b border-[#1a1714]/10 px-6 py-5 md:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-serif text-xl tracking-[-0.02em]">All Products</h2>
              <p className="mt-1 text-[11px] uppercase tracking-[0.16em] text-[#1a1714]/60">
                {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
              </p>
            </div>
            <div className="relative">
              <Search strokeWidth={1.4} className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#1a1714]/50" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full border border-[#1a1714]/10 bg-[#fcfbf8] py-2.5 pl-9 pr-4 text-[13px] outline-none transition-colors focus:border-[#1a1714] placeholder:text-[#1a1714]/40"
              />
            </div>
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="px-6 py-20 text-center md:px-8">
            <Package strokeWidth={1.4} className="mx-auto h-8 w-8 text-[#1a1714]/30" />
            <p className="mt-4 text-[13px] tracking-[0.02em] text-[#1a1714]/60">
              {searchQuery ? 'No products match your search.' : 'No products yet.'}
            </p>
            {!searchQuery && (
              <Link
                href="/admin/products/new"
                className="mt-6 inline-flex items-center gap-2 border border-[#1a1714]/10 px-5 py-2.5 text-[11px] font-medium uppercase tracking-[0.18em] text-[#1a1714] transition-colors hover:border-[#1a1714]"
              >
                <Plus strokeWidth={1.4} className="h-4 w-4" />
                Add Product
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[13px]">
              <thead>
                <tr className="border-b border-[#1a1714]/10 text-[11px] uppercase tracking-[0.16em] text-[#1a1714]/60">
                  <th className="px-6 py-4 font-medium md:px-8">Product</th>
                  <th className="px-4 py-4 font-medium">Brand</th>
                  <th className="px-4 py-4 font-medium">Category</th>
                  <th className="px-4 py-4 font-medium text-right">Price</th>
                  <th className="px-4 py-4 font-medium">Stock</th>
                  <th className="px-4 py-4 font-medium">Status</th>
                  <th className="px-4 py-4 md:px-8" />
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1a1714]/10">
                {filteredProducts.map((product) => {
                  const displayPrice = product.salePrice ?? product.price;
                  const brandName = brandMap.get(product.brandId) ?? `#${product.brandId}`;
                  const categoryName = categoryMap.get(product.categoryId) ?? `#${product.categoryId}`;

                  return (
                    <tr key={product.id} className="transition-colors hover:bg-[#1a1714]/[0.02]">
                      <td className="px-6 py-4 md:px-8">
                        <div className="flex items-center gap-4">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden border border-[#1a1714]/10 bg-[#1a1714]/[0.02]">
                            {product.primaryImageUrl ? (
                              <Image src={product.primaryImageUrl} alt={product.name} width={48} height={48} className="h-full w-full object-cover" />
                            ) : (
                              <Package strokeWidth={1.4} className="h-5 w-5 text-[#1a1714]/40" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-[#1a1714] truncate">{product.name}</p>
                            <p className="mt-0.5 text-[11px] uppercase tracking-[0.12em] text-[#1a1714]/50">
                              {product.slug}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-[#1a1714]/80">{brandName}</td>
                      <td className="px-4 py-4 text-[#1a1714]/80">{categoryName}</td>
                      <td className="px-4 py-4 text-right">
                        <span className="font-medium text-[#1a1714]">${displayPrice.toFixed(2)}</span>
                        {product.salePrice !== null && product.salePrice !== undefined && (
                          <span className="ml-2 text-[11px] text-[#1a1714]/50 line-through">
                            ${product.price.toFixed(2)}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-4 text-[#1a1714]/70">—</td>
                      <td className="px-4 py-4">
                        <span
                          className={`inline-block px-3 py-1 text-[10px] font-medium uppercase tracking-[0.14em] ${
                            product.isActive
                              ? 'bg-[#1a1714]/10 text-[#1a1714]'
                              : 'bg-[#1a1714]/5 text-[#1a1714]/60'
                          }`}
                        >
                          {product.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-4 py-4 md:px-8">
                        <div className="flex items-center gap-1">
                          <Link
                            href={`/admin/products/${product.id}/edit`}
                            className="flex h-8 w-8 items-center justify-center text-[#1a1714]/70 transition-colors hover:text-[#1a1714]"
                            aria-label="Edit product"
                          >
                            <Pencil strokeWidth={1.4} className="h-4 w-4" />
                          </Link>
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm(`Delete "${product.name}"? This action cannot be undone.`)) {
                                handleDelete(product.id);
                              }
                            }}
                            disabled={deletingId === product.id}
                            className="flex h-8 w-8 items-center justify-center text-[#1a1714]/70 transition-colors hover:text-[#1a1714] disabled:opacity-40"
                            aria-label="Delete product"
                          >
                            <Trash2 strokeWidth={1.4} className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
