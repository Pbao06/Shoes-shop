import apiClient from '@/libs/apiClient';
import type { ApiResponse } from '@/types/auth';
import type {
  AdminProduct,
  CreateAdminProduct,
  AdminProductVariant,
  CreateAdminProductVariant,
  UpdateAdminProductVariant,
  AdminProductImage,
  AdminSize,
  AdminCategory,
  CreateAdminCategory,
  UpdateAdminCategory,
  AdminBrand,
  CreateAdminBrand,
  UpdateAdminBrand,
} from '@/types/admin/products';

/**
 * Admin Product service — wraps the .NET Admin Product APIs.
 *
 * Endpoints:
 *   GET    /api/admin/products                      → ApiResponse<AdminProduct[]>
 *   GET    /api/admin/products/{id}                 → ApiResponse<AdminProduct>
 *   POST   /api/admin/products                      → ApiResponse<AdminProduct>
 *   PUT    /api/admin/products/{id}                 → ApiResponse<AdminProduct>
 *   DELETE /api/admin/products/{id}                 → ApiResponse<string>
 *
 *   GET    /api/admin/products/{productId}/variants → ApiResponse<AdminProductVariant[]>
 *   POST   /api/admin/products/{productId}/variants → ApiResponse<AdminProductVariant>
 *   PUT    /api/admin/products/variants/{variantId} → ApiResponse<AdminProductVariant>
 *   DELETE /api/admin/products/variants/{variantId} → ApiResponse<string>
 *   GET    /api/admin/products/sizes                → ApiResponse<AdminSize[]>
 *
 *   GET    /api/admin/products/{productId}/images   → ApiResponse<AdminProductImage[]>
 *   POST   /api/admin/products/{productId}/images   → ApiResponse<AdminProductImage>
 *   DELETE /api/admin/products/images/{imageId}     → ApiResponse<string>
 *   PUT    /api/admin/products/images/{imageId}/primary → ApiResponse<AdminProductImage>
 */

export const adminProductService = {
  // Products
  getAll(options?: { signal?: AbortSignal }): Promise<ApiResponse<AdminProduct[]>> {
    return apiClient.get<ApiResponse<AdminProduct[]>>('/api/admin/products', {
      signal: options?.signal,
    });
  },

  getById(
    id: number,
    options?: { signal?: AbortSignal },
  ): Promise<ApiResponse<AdminProduct>> {
    return apiClient.get<ApiResponse<AdminProduct>>(`/api/admin/products/${id}`, {
      signal: options?.signal,
    });
  },

  create(
    payload: CreateAdminProduct,
    options?: { signal?: AbortSignal },
  ): Promise<ApiResponse<AdminProduct>> {
    return apiClient.post<ApiResponse<AdminProduct>>('/api/admin/products', payload, {
      signal: options?.signal,
    });
  },

  update(
    id: number,
    payload: AdminProduct,
    options?: { signal?: AbortSignal },
  ): Promise<ApiResponse<AdminProduct>> {
    return apiClient.put<ApiResponse<AdminProduct>>(`/api/admin/products/${id}`, payload, {
      signal: options?.signal,
    });
  },

  delete(
    id: number,
    options?: { signal?: AbortSignal },
  ): Promise<ApiResponse<string>> {
    return apiClient.delete<ApiResponse<string>>(`/api/admin/products/${id}`, {
      signal: options?.signal,
    });
  },

  // Variants
  getVariants(
    productId: number,
    options?: { signal?: AbortSignal },
  ): Promise<ApiResponse<AdminProductVariant[]>> {
    return apiClient.get<ApiResponse<AdminProductVariant[]>>(
      `/api/admin/products/${productId}/variants`,
      { signal: options?.signal },
    );
  },

  createVariant(
    productId: number,
    payload: CreateAdminProductVariant,
    options?: { signal?: AbortSignal },
  ): Promise<ApiResponse<AdminProductVariant>> {
    return apiClient.post<ApiResponse<AdminProductVariant>>(
      `/api/admin/products/${productId}/variants`,
      payload,
      { signal: options?.signal },
    );
  },

  updateVariant(
    variantId: number,
    payload: UpdateAdminProductVariant,
    options?: { signal?: AbortSignal },
  ): Promise<ApiResponse<AdminProductVariant>> {
    return apiClient.put<ApiResponse<AdminProductVariant>>(
      `/api/admin/products/variants/${variantId}`,
      payload,
      { signal: options?.signal },
    );
  },

  deleteVariant(
    variantId: number,
    options?: { signal?: AbortSignal },
  ): Promise<ApiResponse<string>> {
    return apiClient.delete<ApiResponse<string>>(
      `/api/admin/products/variants/${variantId}`,
      { signal: options?.signal },
    );
  },

  getSizes(options?: { signal?: AbortSignal }): Promise<ApiResponse<AdminSize[]>> {
    return apiClient.get<ApiResponse<AdminSize[]>>('/api/admin/products/sizes', {
      signal: options?.signal,
    });
  },

  // Images
  getImages(
    productId: number,
    options?: { signal?: AbortSignal },
  ): Promise<ApiResponse<AdminProductImage[]>> {
    return apiClient.get<ApiResponse<AdminProductImage[]>>(
      `/api/admin/products/${productId}/images`,
      { signal: options?.signal },
    );
  },

  uploadImage(
    productId: number,
    file: File,
    altText?: string | null,
    options?: { signal?: AbortSignal },
  ): Promise<ApiResponse<AdminProductImage>> {
    const formData = new FormData();
    formData.append('file', file);
    if (altText !== undefined && altText !== null) {
      formData.append('altText', altText);
    }

    return apiClient.post<ApiResponse<AdminProductImage>>(
      `/api/admin/products/${productId}/images`,
      formData,
      {
        signal: options?.signal,
        headers: { 'Content-Type': 'multipart/form-data' },
      },
    );
  },

  deleteImage(
    imageId: number,
    options?: { signal?: AbortSignal },
  ): Promise<ApiResponse<string>> {
    return apiClient.delete<ApiResponse<string>>(
      `/api/admin/products/images/${imageId}`,
      { signal: options?.signal },
    );
  },

  setPrimaryImage(
    imageId: number,
    options?: { signal?: AbortSignal },
  ): Promise<ApiResponse<AdminProductImage>> {
    return apiClient.put<ApiResponse<AdminProductImage>>(
      `/api/admin/products/images/${imageId}/primary`,
      {},
      { signal: options?.signal },
    );
  },
};

export default adminProductService;
