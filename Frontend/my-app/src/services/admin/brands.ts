import apiClient from '@/libs/apiClient';
import type { ApiResponse } from '@/types/auth';
import type { AdminBrand, CreateAdminBrand, UpdateAdminBrand } from '@/types/admin/products';

/**
 * Admin Brand service — wraps the .NET Admin Brand APIs.
 *
 * Endpoints:
 *   GET    /api/admin/brands                        → ApiResponse<AdminBrand[]>
 *   GET    /api/admin/brands/{id}                   → ApiResponse<AdminBrand>
 *   POST   /api/admin/brands                        → ApiResponse<AdminBrand>
 *   PUT    /api/admin/brands/{id}                   → ApiResponse<AdminBrand>
 *   DELETE /api/admin/brands/{id}                   → ApiResponse<string>
 */

export const adminBrandService = {
  getAll(options?: { signal?: AbortSignal }): Promise<ApiResponse<AdminBrand[]>> {
    return apiClient.get<ApiResponse<AdminBrand[]>>('/api/admin/brands', {
      signal: options?.signal,
    });
  },

  getById(
    id: number,
    options?: { signal?: AbortSignal },
  ): Promise<ApiResponse<AdminBrand>> {
    return apiClient.get<ApiResponse<AdminBrand>>(`/api/admin/brands/${id}`, {
      signal: options?.signal,
    });
  },

  create(
    payload: CreateAdminBrand,
    options?: { signal?: AbortSignal },
  ): Promise<ApiResponse<AdminBrand>> {
    return apiClient.post<ApiResponse<AdminBrand>>('/api/admin/brands', payload, {
      signal: options?.signal,
    });
  },

  update(
    id: number,
    payload: UpdateAdminBrand,
    options?: { signal?: AbortSignal },
  ): Promise<ApiResponse<AdminBrand>> {
    return apiClient.put<ApiResponse<AdminBrand>>(`/api/admin/brands/${id}`, payload, {
      signal: options?.signal,
    });
  },

  delete(
    id: number,
    options?: { signal?: AbortSignal },
  ): Promise<ApiResponse<string>> {
    return apiClient.delete<ApiResponse<string>>(`/api/admin/brands/${id}`, {
      signal: options?.signal,
    });
  },
};

export default adminBrandService;
