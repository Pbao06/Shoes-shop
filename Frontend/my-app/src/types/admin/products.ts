/**
 * Admin Product types mirrored from the .NET backend.
 *
 * Backend sources:
 *   - DTOs/ProductDto.cs (ProductDto, CreateProductDto, ProductVariantDto,
 *     CreateProductVariantDto, UpdateProductVariantDto, ProductImageDto)
 *   - Services/Admin/ProductService.cs
 *   - Controllers/Admin/AdminProductController.cs
 */

import type { ApiResponse } from '@/types/auth';

/** Admin product list/item response. */
export interface AdminProduct {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  price: number;
  salePrice?: number | null;
  color?: string | null;
  isActive: boolean;
  brandId: number;
  categoryId: number;
  createdAt: string;
  primaryImageUrl?: string | null;
}

/** Create product request. */
export interface CreateAdminProduct {
  name: string;
  slug?: string | null;
  description?: string | null;
  price: number;
  salePrice?: number | null;
  color?: string | null;
  brandId: number;
  categoryId: number;
}

/** Admin product variant response. */
export interface AdminProductVariant {
  id: number;
  productId: number;
  sizeId: number;
  sizeName: string;
  sku: string;
  stockQuantity: number;
  price: number;
  salePrice?: number | null;
}

/** Create product variant request. */
export interface CreateAdminProductVariant {
  sizeId: number;
  sku: string;
  stockQuantity: number;
  price: number;
  salePrice?: number | null;
}

/** Update product variant request. */
export interface UpdateAdminProductVariant {
  sizeId: number;
  sku: string;
  stockQuantity: number;
  price: number;
  salePrice?: number | null;
}

/** Admin product image response. */
export interface AdminProductImage {
  id: number;
  imageUrl: string;
  altText?: string | null;
  isPrimary: boolean;
  createdAt: string;
}

/** Size lookup response. */
export interface AdminSize {
  id: number;
  name: string;
  description?: string | null;
}

/** Category response (reused from backend CategoryDto). */
export interface AdminCategory {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  createdAt: string;
}

/** Brand response (reused from backend BrandDto). */
export interface AdminBrand {
  id: number;
  name: string;
  description?: string | null;
  logoUrl?: string | null;
  createdAt: string;
}

/** Create category request. */
export interface CreateAdminCategory {
  name: string;
  slug?: string | null;
  description?: string | null;
}

/** Update category request. */
export interface UpdateAdminCategory {
  name: string;
  slug?: string | null;
  description?: string | null;
}

/** Create brand request. */
export interface CreateAdminBrand {
  name: string;
  description?: string | null;
  logoUrl?: string | null;
}

/** Update brand request. */
export interface UpdateAdminBrand {
  name: string;
  description?: string | null;
  logoUrl?: string | null;
}
