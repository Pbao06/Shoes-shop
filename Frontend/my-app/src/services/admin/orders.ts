import apiClient from '@/libs/apiClient';
import type { ApiResponse } from '@/types/auth';
import type {
  AdminOrder,
  AdminOrderDetail,
  UpdateAdminOrderStatus,
} from '@/types/admin/orders';

/**
 * Admin Order service — wraps the .NET Admin Order APIs.
 *
 * Endpoints:
 *   GET    /api/admin/orders?status=                  → ApiResponse<AdminOrder[]>
 *   GET    /api/admin/orders/{id}                     → ApiResponse<AdminOrderDetail>
 *   PUT    /api/admin/orders/{id}/status              → ApiResponse<AdminOrderDetail>
 */

export const adminOrderService = {
  getAll(
    status?: string,
    options?: { signal?: AbortSignal },
  ): Promise<ApiResponse<AdminOrder[]>> {
    return apiClient.get<ApiResponse<AdminOrder[]>>('/api/admin/orders', {
      params: status ? { status } : undefined,
      signal: options?.signal,
    });
  },

  getById(
    orderId: number,
    options?: { signal?: AbortSignal },
  ): Promise<ApiResponse<AdminOrderDetail>> {
    return apiClient.get<ApiResponse<AdminOrderDetail>>(`/api/admin/orders/${orderId}`, {
      signal: options?.signal,
    });
  },

  updateStatus(
    orderId: number,
    payload: UpdateAdminOrderStatus,
    options?: { signal?: AbortSignal },
  ): Promise<ApiResponse<AdminOrderDetail>> {
    return apiClient.put<ApiResponse<AdminOrderDetail>>(
      `/api/admin/orders/${orderId}/status`,
      payload,
      { signal: options?.signal },
    );
  },
};

export default adminOrderService;
