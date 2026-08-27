import apiClient from '@/libs/apiClient';
import type { ApiResponse } from '@/types/auth';
import type {
  AdminCategory,
  CreateAdminCategory,
  UpdateAdminCategory,
} from '@/types/admin/products';

/**
 * Admin Category service — wraps the .NET Admin Category APIs.
 *
 * Endpoints:
 *   GET    /api/admin/categories                   → ApiResponse<AdminCategory[]>
 *   GET    /api/admin/categories/{id}              → ApiResponse<AdminCategory>
 *   POST   /api/admin/categories                   → ApiResponse<AdminCategory>
 *   PUT    /api/admin/categories/{id}              → ApiResponse<AdminCategory>
 *   DELETE /api/admin/categories/{id}              → ApiResponse<string>
 */

export const adminCategoryService = {
  getAll(options?: { signal?: AbortSignal }): Promise<ApiResponse<AdminCategory[]>> {
    return apiClient.get<ApiResponse<AdminCategory[]>>('/api/admin/categories', {
      signal: options?.signal,
    });
  },

  getById(
    id: number,
    options?: { signal?: AbortSignal },
  ): Promise<ApiResponse<AdminCategory>> {
    return apiClient.get<ApiResponse<AdminCategory>>(`/api/admin/categories/${id}`, {
      signal: options?.signal,
    });
  },

  create(
    payload: CreateAdminCategory,
    options?: { signal?: AbortSignal },
  ): Promise<ApiResponse<AdminCategory>> {
    return apiClient.post<ApiResponse<AdminCategory>>('/api/admin/categories', payload, {
      signal: options?.signal,
    });
  },

  update(
    id: number,
    payload: UpdateAdminCategory,
    options?: { signal?: AbortSignal },
  ): Promise<ApiResponse<AdminCategory>> {
    return apiClient.put<ApiResponse<AdminCategory>>(`/api/admin/categories/${id}`, payload, {
      signal: options?.signal,
    });
  },

  delete(
    id: number,
    options?: { signal?: AbortSignal },
  ): Promise<ApiResponse<string>> {
    return apiClient.delete<ApiResponse<string>>(`/api/admin/categories/${id}`, {
      signal: options?.signal,
    });
  },
};

export default adminCategoryService;
