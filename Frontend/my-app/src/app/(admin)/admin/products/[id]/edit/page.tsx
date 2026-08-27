'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { adminProductService } from '@/services/admin';
import { useAdminBrands } from '@/hooks/admin';
import { useAdminCategories } from '@/hooks/admin';
import { useAdminProductImages } from '@/hooks/admin';
import type { AdminProduct, CreateAdminProduct, AdminProductImage } from '@/types/admin/products';
import { ArrowLeft, Plus, Trash2, RefreshCcw } from 'lucide-react';

export default function AdminEditProductPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const productId = Number(params.id);
  const { brands, loading: brandsLoading } = useAdminBrands();
  const { categories, loading: categoriesLoading } = useAdminCategories();
  const { images, loading: imagesLoading, refetch: refetchImages } = useAdminProductImages(productId);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [product, setProduct] = useState<AdminProduct | null>(null);

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [salePrice, setSalePrice] = useState('');
  const [color, setColor] = useState('');
  const [brandId, setBrandId] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [isActive, setIsActive] = useState(true);

  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    adminProductService
      .getById(productId)
      .then((response) => {
        if (!mounted) return;
        const data = response.data;
        setProduct(data);
        setName(data.name);
        setSlug(data.slug ?? '');
        setDescription(data.description ?? '');
        setPrice(String(data.price));
        setSalePrice(data.salePrice !== null && data.salePrice !== undefined ? String(data.salePrice) : '');
        setColor(data.color ?? '');
        setBrandId(String(data.brandId));
        setCategoryId(String(data.categoryId));
        setIsActive(data.isActive);
      })
      .catch(() => {
        if (mounted) setError('Failed to load product.');
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [productId]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

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

    const payload: AdminProduct = {
      id: productId,
      name: name.trim(),
      slug: slug.trim() || '',
      description: description.trim() || '',
      price: parsedPrice,
      salePrice: parsedSalePrice ?? 0,
      color: color.trim() || '',
      brandId: Number(brandId),
      categoryId: Number(categoryId),
      isActive,
      createdAt: product?.createdAt ?? new Date().toISOString(),
      primaryImageUrl: product?.primaryImageUrl ?? null,
    };

    setSaving(true);
    try {
      await adminProductService.update(productId, payload);
      router.push('/admin/products');
    } catch {
      // handled by apiClient
    } finally {
      setSaving(false);
    }
  };

  const handleUpload = async (file: File) => {
    setUploadError(null);
    setUploading(true);
    try {
      await adminProductService.uploadImage(productId, file, file.name.replace(/\.[^/.]+$/, ''));
      refetchImages();
    } catch {
      setUploadError('Failed to upload image.');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteImage = async (imageId: number) => {
    setUploading(true);
    try {
      await adminProductService.deleteImage(imageId);
      refetchImages();
    } catch {
      setUploadError('Failed to delete image.');
    } finally {
      setUploading(false);
    }
  };

  const handleSetPrimary = async (imageId: number) => {
    setUploading(true);
    try {
      await adminProductService.setPrimaryImage(imageId);
      refetchImages();
    } catch {
      setUploadError('Failed to set primary image.');
    } finally {
      setUploading(false);
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

  if (!product) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 py-16">
        <p className="font-serif text-2xl text-[#1a1714]">Product not found</p>
        <Link href="/admin/products" className="mt-6 text-[11px] uppercase tracking-[0.18em] text-[#1a1714] underline underline-offset-4">
          Back to products
        </Link>
      </div>
    );
  }

  const primaryImage = images.find((img) => img.isPrimary) ?? images[0];

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
        <h1 className="mt-6 font-serif text-3xl tracking-[-0.03em] md:text-4xl">Edit Product</h1>
        <p className="mt-2 text-[13px] tracking-[0.02em] text-[#1a1714]/60">
          Update product details, pricing, and images.
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
                className="mt-3 w-full border-0 border-b border-[#1a1714]/20 bg-transparent py-3 text-[13px] text-[#1a1714] focus:border-[#1a1714] focus:outline-none focus:ring-0 transition-colors"
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
                className="mt-3 w-full border-0 border-b border-[#1a1714]/20 bg-transparent py-3 text-[13px] text-[#1a1714] focus:border-[#1a1714] focus:outline-none focus:ring-0 transition-colors"
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
                className="mt-3 w-full border border-[#1a1714]/10 bg-transparent px-4 py-3 text-[13px] text-[#1a1714] focus:border-[#1a1714] focus:outline-none focus:ring-0 transition-colors"
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
                className="mt-3 w-full border-0 border-b border-[#1a1714]/20 bg-transparent py-3 text-[13px] text-[#1a1714] focus:border-[#1a1714] focus:outline-none focus:ring-0 transition-colors"
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
                className="mt-3 w-full border-0 border-b border-[#1a1714]/20 bg-transparent py-3 text-[13px] text-[#1a1714] focus:border-[#1a1714] focus:outline-none focus:ring-0 transition-colors"
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
                className="mt-3 w-full border-0 border-b border-[#1a1714]/20 bg-transparent py-3 text-[13px] text-[#1a1714] focus:border-[#1a1714] focus:outline-none focus:ring-0 transition-colors"
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

            <label className="md:col-span-2">
              <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#1a1714]/60">
                Status
              </span>
              <select
                value={isActive ? 'true' : 'false'}
                onChange={(e) => setIsActive(e.target.value === 'true')}
                className="mt-3 w-full border-0 border-b border-[#1a1714]/20 bg-[#fcfbf8] py-3 text-[13px] text-[#1a1714] focus:border-[#1a1714] focus:outline-none focus:ring-0 transition-colors"
              >
                <option value="true">Active</option>
                <option value="false">Inactive</option>
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
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 border border-[#1a1714] bg-[#1a1714] px-6 py-3 text-[11px] font-medium uppercase tracking-[0.18em] text-[#fcfbf8] transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? 'Saving...' : 'Save Product'}
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Images */}
      <div className="mt-10 border border-[#1a1714]/10 bg-[#fcfbf8]">
        <div className="border-b border-[#1a1714]/10 px-6 py-5 md:px-8">
          <h2 className="font-serif text-xl tracking-[-0.02em]">Images</h2>
          <p className="mt-1 text-[11px] uppercase tracking-[0.16em] text-[#1a1714]/60">
            {images.length} {images.length === 1 ? 'image' : 'images'}
          </p>
        </div>

        <div className="px-6 py-6 md:px-8">
          {uploadError && (
            <p className="mb-4 text-[13px] text-red-600" role="alert">
              {uploadError}
            </p>
          )}

          <label className="mb-6 flex cursor-pointer items-center justify-center gap-2 border border-dashed border-[#1a1714]/20 px-6 py-6 text-[11px] font-medium uppercase tracking-[0.18em] text-[#1a1714]/70 transition-colors hover:border-[#1a1714] hover:text-[#1a1714]">
            <Plus strokeWidth={1.4} className="h-4 w-4" />
            Upload Image
            <input
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              disabled={uploading}
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleUpload(file);
              }}
            />
          </label>

          {imagesLoading ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="h-32 w-full bg-[#1a1714]/10 animate-pulse" />
              ))}
            </div>
          ) : images.length === 0 ? (
            <p className="text-[13px] tracking-[0.02em] text-[#1a1714]/60">No images uploaded yet.</p>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {images.map((image) => (
                <div key={image.id} className="relative border border-[#1a1714]/10 bg-[#fcfbf8]">
                  <div className="relative aspect-square overflow-hidden bg-[#1a1714]/[0.02]">
                    <Image src={image.imageUrl} alt={image.altText ?? product.name} fill className="object-cover" sizes="200px" />
                    {image.isPrimary && (
                      <span className="absolute left-2 top-2 bg-[#1a1714] px-2 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-[#fcfbf8]">
                        Primary
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between border-t border-[#1a1714]/10 px-3 py-2">
                    <button
                      type="button"
                      onClick={() => handleSetPrimary(image.id)}
                      disabled={uploading || image.isPrimary}
                      className="text-[10px] font-medium uppercase tracking-[0.14em] text-[#1a1714]/70 transition-colors hover:text-[#1a1714] disabled:opacity-40"
                    >
                      {image.isPrimary ? 'Primary' : 'Set Primary'}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteImage(image.id)}
                      disabled={uploading}
                      className="text-[10px] font-medium uppercase tracking-[0.14em] text-[#1a1714]/70 transition-colors hover:text-[#1a1714] disabled:opacity-40"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
