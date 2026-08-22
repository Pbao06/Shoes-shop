import apiClient from "@/libs/apiClient";
import type { ApiResponse } from "@/types/auth";
import { Product, ProductDetail } from "@/types/product";

/**
 * Product service — wraps the .NET Product APIs (C_ProductController).
 *
 * Endpoints (Backend/.../Controllers/Customer/C_ProductController.cs):
 *   GET /api/products          → ApiResponse<Product[]>
 *   GET /api/products/{id:int} → ApiResponse<ProductDetail>
 *
 * The controller's supported query params are:
 *   q (keyword), category (name), categoryId, brandId, sortBy, page, pageSize.
 *
 * `categoryId` / `brandId` are forwarded as-is; the backend filters by those
 * numeric ids when provided (and ignores them when omitted).
 */
export interface GetProductsParams {
  q?: string;
  /** Category name (e.g. "Shoes", "Bags") — matches the backend's `category` filter. */
  category?: string;
  categoryId?: number;
  brandId?: number;
  page?: number;
  pageSize?: number;
}

export const productService = {
  getProducts(
    params: GetProductsParams = {},
    options?: { signal?: AbortSignal },
  ): Promise<ApiResponse<Product[]>> {
    const { q, category, categoryId, brandId, page, pageSize } = params;
    return apiClient.get<ApiResponse<Product[]>>("/api/products", {
      params: {
        q,
        category,
        categoryId,
        brandId,
        page,
        pageSize,
      },
      signal: options?.signal,
    });
  },

  getProductById(id: number): Promise<ApiResponse<ProductDetail>> {
    return apiClient.get<ApiResponse<ProductDetail>>(`/api/products/${id}`);
  },
};

export default productService;
