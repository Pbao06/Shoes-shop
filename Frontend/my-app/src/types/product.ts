/**
 * Product / Shop types mirrored from the .NET backend `C_ProductService`.
 *
 * Source of truth (Backend):
 *   - DTOs:      src/DTOs/ProductDto.cs (ProductPublicDto, ProductDetailDto,
 *                ProductImageDto, ProductVariantDto, ReviewDto)
 *   - Service:   src/Services/Customer/C_ProductService.cs
 *   - Controller:src/Controllers/Customer/C_ProductController.cs
 *
 * Property names are camelCase to match the JSON emitted by ASP.NET Core.
 * Endpoints:
 *   - GET /api/products            -> ApiResponse<Product[]>   (shop / grid)
 *   - GET /api/products/{id:int}   -> ApiResponse<ProductDetail>
 *
 * NOTE: the product endpoints currently flatten Brand/Category to string
 * fields (brand, category, brandName, categoryName). The `Brand` and
 * `Category` interfaces below mirror the backend models and are provided
 * for completeness / future nested payloads.
 */

import type { ApiResponse } from './auth';

/** Mirror of ProductImageDto. */
export interface ProductImage {
  id: number;
  imageUrl: string;
  altText?: string | null;
  isPrimary: boolean;
}

/** Mirror of ProductVariantDto. */
export interface ProductVariant {
  id: number;
  sizeId: number;
  sizeName: string;
  sku: string;
  stockQuantity: number;
  /** Unit price of this variant (decimal in .NET -> number in JSON). */
  price: number;
  salePrice?: number | null;
}

/** Mirror of ReviewDto. */
export interface Review {
  id: number;
  userId: number;
  userName?: string | null;
  /** 1-5. */
  rating: number;
  comment?: string | null;
  /** ISO-8601 date string. */
  createdAt: string;
}

/** Mirror of the Brand model / BrandDto. */
export interface Brand {
  id: number;
  name: string;
  description?: string | null;
  logoUrl?: string | null;
  /** ISO-8601 date string. */
  createdAt?: string;
}

/** Mirror of the Category model. */
export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  /** ISO-8601 date string. */
  createdAt?: string;
}

/**
 * Mirror of ProductPublicDto — the shape returned for the shop grid / search.
 * `price`/`salePrice` arrive as numbers; `priceDisplay` is the formatted
 * string (e.g. "$420") for direct rendering.
 */
export interface Product {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  /** Decimal in .NET -> number in JSON. */
  price: number;
  salePrice?: number | null;
  brandName?: string | null;
  categoryName?: string | null;
  primaryImageUrl?: string | null;
  primaryImageAlt?: string | null;
  totalStock: number;
  isActive: boolean;
  /** ISO-8601 date string. */
  createdAt: string;

  // FE-friendly flattened fields
  categoryId: number;
  brandId: number;
  brand: string;
  category: string;
  priceDisplay: string;
  color?: string | null;
  image?: string | null;
  sizes: string[];
  gallery: string[];
}

/**
 * Mirror of ProductDetailDto — the shape returned for the product detail page.
 * Extends Product with images, variants, reviews and the average rating.
 */
export interface ProductDetail extends Product {
  images: ProductImage[];
  variants: ProductVariant[];
  reviews: Review[];
  /** Average of review ratings, 0 when there are no reviews. */
  averageRating: number;
}

/**
 * Query params for GET /api/products.
 * All optional — omit for defaults (newest first, page 1, pageSize 12).
 */
export interface ProductQueryParams {
  /** Category name (e.g. "Shoes"); "All" or omitted = no category filter. */
  category?: string;
  /** "Price: low to high" | "Price: high to low" | any other = newest first. */
  sortBy?: string;
  /** Keyword search across Name / Brand / Category. */
  q?: string;
  /** 1-based page index, default 1. */
  page?: number;
  /** Page size, default 12. */
  pageSize?: number;
}

/** Response envelope for GET /api/products. */
export type ProductListResponse = ApiResponse<Product[]>;
