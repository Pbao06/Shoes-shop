import apiClient from "@/libs/apiClient";
import type { ApiResponse } from "@/types/auth";
import type { OrderDto, CheckoutRequest } from "@/types/order";

/**
 * Order service — wraps the .NET Order APIs (C_OrderController).
 *
 * Endpoints (Backend/.../Controllers/Customer/C_OrderController.cs):
 *   POST   /api/orders/{userId}                          → ApiResponse<OrderDto>
 *   GET    /api/orders/{orderId}/user/{userId}           → ApiResponse<OrderDto>
 *   GET    /api/orders/user/{userId}                     → ApiResponse<OrderDto[]>
 *   POST   /api/orders/{orderId}/cancel/user/{userId}    → ApiResponse<OrderDto>
 */

export const orderService = {
  createOrder(
    userId: number,
    payload: CheckoutRequest,
    options?: { signal?: AbortSignal },
  ): Promise<ApiResponse<OrderDto>> {
    return apiClient.post<ApiResponse<OrderDto>>(`/api/orders/${userId}`, payload, {
      signal: options?.signal,
    });
  },

  getOrderById(
    orderId: number,
    userId: number,
    options?: { signal?: AbortSignal },
  ): Promise<ApiResponse<OrderDto>> {
    return apiClient.get<ApiResponse<OrderDto>>(`/api/orders/${orderId}/user/${userId}`, {
      signal: options?.signal,
    });
  },

  getOrders(
    userId: number,
    options?: { signal?: AbortSignal },
  ): Promise<ApiResponse<OrderDto[]>> {
    return apiClient.get<ApiResponse<OrderDto[]>>(`/api/orders/user/${userId}`, {
      signal: options?.signal,
    });
  },

  cancelOrder(
    orderId: number,
    userId: number,
    options?: { signal?: AbortSignal },
  ): Promise<ApiResponse<OrderDto>> {
    return apiClient.post<ApiResponse<OrderDto>>(`/api/orders/${orderId}/cancel/user/${userId}`, {}, {
      signal: options?.signal,
    });
  },
};

export default orderService;
