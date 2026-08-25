import apiClient from "@/libs/apiClient";
import type { ApiResponse } from "@/types/auth";
import { CartDto, CartItem } from "@/types/cart";

/**
 * Cart service — wraps the .NET Cart APIs (C_CartController).
 *
 * Endpoints (Backend/.../Controllers/Customer/C_CartController.cs):
 *   GET    /api/cart/{userId}                        → ApiResponse<CartDto>
 *   POST   /api/cart/{userId}/add                    → ApiResponse<CartDto>
 *   PUT    /api/cart/{userId}/items/{cartItemId}     → ApiResponse<CartDto>
 *   DELETE /api/cart/{userId}/items/{cartItemId}     → ApiResponse<unknown>
 *   DELETE /api/cart/{userId}/clear                  → ApiResponse<unknown>
 */

export interface AddToCartPayload {
  productVariantId: number;
  quantity: number;
}

export const cartService = {
  getCart(
    userId: number,
    options?: { signal?: AbortSignal },
  ): Promise<ApiResponse<CartDto>> {
    return apiClient.get<ApiResponse<CartDto>>(`/api/cart/${userId}`, {
      signal: options?.signal,
    });
  },

  addToCart(
    userId: number,
    payload: AddToCartPayload,
    options?: { signal?: AbortSignal },
  ): Promise<ApiResponse<CartDto>> {
    return apiClient.post<ApiResponse<CartDto>>(`/api/cart/${userId}/add`, payload, {
      signal: options?.signal,
    });
  },

  updateItem(
    userId: number,
    cartItemId: number,
    quantity: number,
    options?: { signal?: AbortSignal },
  ): Promise<ApiResponse<CartDto>> {
    return apiClient.put<ApiResponse<CartDto>>(`/api/cart/${userId}/items/${cartItemId}`, quantity, {
      signal: options?.signal,
    });
  },

  removeItem(
    userId: number,
    cartItemId: number,
    options?: { signal?: AbortSignal },
  ): Promise<ApiResponse<unknown>> {
    return apiClient.delete<ApiResponse<unknown>>(`/api/cart/${userId}/items/${cartItemId}`, {
      signal: options?.signal,
    });
  },

  clearCart(
    userId: number,
    options?: { signal?: AbortSignal },
  ): Promise<ApiResponse<unknown>> {
    return apiClient.delete<ApiResponse<unknown>>(`/api/cart/${userId}/clear`, {
      signal: options?.signal,
    });
  },
};

export default cartService;
