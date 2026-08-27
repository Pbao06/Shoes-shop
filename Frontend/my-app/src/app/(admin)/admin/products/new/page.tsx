'use client';

import { useState, type FormEvent, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { adminProductService } from '@/services/admin';
import { useAdminBrands } from '@/hooks/admin';
import { useAdminCategories } from '@/hooks/admin';
import type { CreateAdminProduct } from '@/types/admin/products';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';

export default function AdminCreateProductPage() {
  const router = useRouter();
  const { brands, loading: brandsLoading } = useAdminBrands();
  const { categories, loading: categoriesLoading } = useAdminCategories();

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [salePrice, setSalePrice] = useState('');
  const [color, setColor] = useState('');
  const [brandId, setBrandId] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loading = brandsLoading || categoriesLoading;

  const handleFileChange = (selected: File | null) => {
    setUploadError(null);
    setFile(selected);
    if (selected) {
      const url = URL.createObjectURL(selected);
      setPreview(url);
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Product name is required.');
      return;
    }

    const parsedPrice = Number(price);
    if (Number.isNaN(parsedPrice) || parsedPrice < 0) {
      setError('Price must be a valid non-negative number.');
      return;
    }

    const parsedSalePrice = salePrice.trim() === '' ? null : Number(salePrice);
    if (parsedSalePrice !== null && (Number.isNaN(parsedSalePrice) || parsedSalePrice < 0)) {
      setError('Sale price must be a valid non-negative number.');
      return;
    }

    if (!brandId) {
      setError('Brand is required.');
      return;
    }

    if (!categoryId) {
      setError('Category is required.');
      return;
    }

    if (file) {
      const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowed.includes(file.type)) {
        setError('Only JPG, PNG, and WEBP images are allowed.');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be 5MB or less.');
        return;
      }
    }

    const payload: CreateAdminProduct = {
      name: name.trim(),
      slug: slug.trim() || undefined,
      description: description.trim() || undefined,
      price: parsedPrice,
      salePrice: parsedSalePrice ?? undefined,
      color: color.trim() || undefined,
      brandId: Number(brandId),
      categoryId: Number(categoryId),
    };

    setIsSubmitting(true);
    try {
      const response = await adminProductService.create(payload);
      const created = response.data;

      if (file) {
        setUploading(true);
        setUploadError(null);
        try {
          await adminProductService.uploadImage(created.id, file, name.trim());
        } catch {
          setUploadError('Product created, but image upload failed. You can add it later.');
        } finally {
          setUploading(false);
        }
      }

      router.push('/admin/products');
    } catch {
      // handled by apiClient
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="px-6 py-10 md:px-12 md:py-16">
        <div className="mb-10">
          <div className="h-8 w-40 bg-[#1a1714]/10" />
          <div className="mt-2 h-3 w-64 bg-[#1a1714]/10" />
        </div>
        <div className="space-y-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="h-16 w-full bg-[#1a1714]/10 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 py-10 md:px-12 md:py-16">
      <div className="mb-10">
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-[#1a1714]/70 transition-colors hover:text-[#1a1714]"
        >
          <ArrowLeft strokeWidth={1.4} className="h-4 w-4" />
          Back
        </button>
        <h1 className="mt-6 font-serif text-3xl tracking-[-0.03em] md:text-4xl">New Product</h1>
        <p className="mt-2 text-[13px] tracking-[0.02em] text-[#1a1714]/60">
          Add a new product to your catalog.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-3xl" noValidate>
        <div className="border border-[#1a1714]/10 bg-[#fcfbf8]">
          <div className="grid grid-cols-1 gap-x-8 gap-y-8 px-6 py-8 md:px-8 md:py-10 md:grid-cols-2">
            <label className="md:col-span-2">
              <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#1a1714]/60">
                Product Name <span className="text-red-600">*</span>
              </span>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Classic Leather Loafer"
                className="mt-3 w-full border-0 border-b border-[#1a1714]/20 bg-transparent py-3 text-[13px] text-[#1a1714] placeholder:text-[#1a1714]/30 focus:border-[#1a1714] focus:outline-none focus:ring-0 transition-colors"
              />
            </label>

            <label className="md:col-span-2">
              <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#1a1714]/60">
                Slug
              </span>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="auto-generated from name if left blank"
                className="mt-3 w-full border-0 border-b border-[#1a1714]/20 bg-transparent py-3 text-[13px] text-[#1a1714] placeholder:text-[#1a1714]/30 focus:border-[#1a1714] focus:outline-none focus:ring-0 transition-colors"
              />
            </label>

            <label className="md:col-span-2">
              <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#1a1714]/60">
                Description
              </span>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Short product description..."
                className="mt-3 w-full border border-[#1a1714]/10 bg-transparent px-4 py-3 text-[13px] text-[#1a1714] placeholder:text-[#1a1714]/30 focus:border-[#1a1714] focus:outline-none focus:ring-0 transition-colors"
              />
            </label>

            <label>
              <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#1a1714]/60">
                Price <span className="text-red-600">*</span>
              </span>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0.00"
                className="mt-3 w-full border-0 border-b border-[#1a1714]/20 bg-transparent py-3 text-[13px] text-[#1a1714] placeholder:text-[#1a1714]/30 focus:border-[#1a1714] focus:outline-none focus:ring-0 transition-colors"
              />
            </label>

            <label>
              <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#1a1714]/60">
                Sale Price
              </span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={salePrice}
                onChange={(e) => setSalePrice(e.target.value)}
                placeholder="Optional"
                className="mt-3 w-full border-0 border-b border-[#1a1714]/20 bg-transparent py-3 text-[13px] text-[#1a1714] placeholder:text-[#1a1714]/30 focus:border-[#1a1714] focus:outline-none focus:ring-0 transition-colors"
              />
            </label>

            <label>
              <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#1a1714]/60">
                Color
              </span>
              <input
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                placeholder="e.g. Black, Ivory"
                className="mt-3 w-full border-0 border-b border-[#1a1714]/20 bg-transparent py-3 text-[13px] text-[#1a1714] placeholder:text-[#1a1714]/30 focus:border-[#1a1714] focus:outline-none focus:ring-0 transition-colors"
              />
            </label>

            <label>
              <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#1a1714]/60">
                Brand <span className="text-red-600">*</span>
              </span>
              <select
                required
                value={brandId}
                onChange={(e) => setBrandId(e.target.value)}
                className="mt-3 w-full border-0 border-b border-[#1a1714]/20 bg-[#fcfbf8] py-3 text-[13px] text-[#1a1714] focus:border-[#1a1714] focus:outline-none focus:ring-0 transition-colors"
              >
                <option value="">Select brand</option>
                {brands.map((brand) => (
                  <option key={brand.id} value={brand.id}>
                    {brand.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="md:col-span-2">
              <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#1a1714]/60">
                Category <span className="text-red-600">*</span>
              </span>
              <select
                required
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="mt-3 w-full border-0 border-b border-[#1a1714]/20 bg-[#fcfbf8] py-3 text-[13px] text-[#1a1714] focus:border-[#1a1714] focus:outline-none focus:ring-0 transition-colors"
              >
                <option value="">Select category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="border-t border-[#1a1714]/10 px-6 py-6 md:px-8">
            {error && (
              <p className="mb-4 text-[13px] text-red-600" role="alert">
                {error}
              </p>
            )}
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => router.push('/admin/products')}
                className="inline-flex items-center justify-center gap-2 border border-[#1a1714]/10 px-6 py-3 text-[11px] font-medium uppercase tracking-[0.18em] text-[#1a1714] transition-colors hover:border-[#1a1714]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || uploading}
                className="inline-flex items-center justify-center gap-2 border border-[#1a1714] bg-[#1a1714] px-6 py-3 text-[11px] font-medium uppercase tracking-[0.18em] text-[#fcfbf8] transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Plus strokeWidth={1.4} className="h-4 w-4" />
                {isSubmitting || uploading ? 'Creating...' : 'Create Product'}
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Image upload */}
      <div className="mt-10 border border-[#1a1714]/10 bg-[#fcfbf8]">
        <div className="border-b border-[#1a1714]/10 px-6 py-5 md:px-8">
          <h2 className="font-serif text-xl tracking-[-0.02em]">Product Image</h2>
          <p className="mt-1 text-[11px] uppercase tracking-[0.16em] text-[#1a1714]/60">
            Upload a primary image for this product.
          </p>
        </div>

        <div className="px-6 py-6 md:px-8">
          {uploadError && (
            <p className="mb-4 text-[13px] text-red-600" role="alert">
              {uploadError}
            </p>
          )}

          <div className="flex flex-col items-start gap-6">
            {preview ? (
              <div className="relative h-48 w-48 overflow-hidden border border-[#1a1714]/10">
                <Image src={preview} alt="Preview" fill className="object-cover" sizes="192px" />
                <button
                  type="button"
                  onClick={() => handleFileChange(null)}
                  className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center border border-[#1a1714]/10 bg-[#fcfbf8] text-[#1a1714] transition-colors hover:border-[#1a1714]"
                  aria-label="Remove image"
                >
                  <Trash2 strokeWidth={1.4} className="h-3 w-3" />
                </button>
              </div>
            ) : (
              <label className="flex h-48 w-48 cursor-pointer items-center justify-center border border-dashed border-[#1a1714]/20 text-[11px] font-medium uppercase tracking-[0.18em] text-[#1a1714]/70 transition-colors hover:border-[#1a1714] hover:text-[#1a1714]">
                <span className="text-center">Select Image</span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  className="hidden"
                  onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)}
                />
              </label>
            )}

            {preview && (
              <label className="flex cursor-pointer items-center gap-2 border border-[#1a1714]/10 px-5 py-3 text-[11px] font-medium uppercase tracking-[0.18em] text-[#1a1714] transition-colors hover:border-[#1a1714]">
                Change Image
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  className="hidden"
                  onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)}
                />
              </label>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
