/**
 * Admin Order types mirrored from the .NET backend.
 *
 * Backend sources:
 *   - DTOs/AdminOrderDto.cs
 *   - DTOs/OrderDto.cs
 *   - Services/Admin/AdminOrderService.cs
 *   - Controllers/Admin/AdminOrderController.cs
 */

import type { ApiResponse } from '@/types/auth';

/** Admin order list/item response. */
export interface AdminOrder {
  id: number;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  totalAmount: number;
  createdAt: string;
  customerName: string;
  customerEmail: string;
  itemCount: number;
}

/** Admin order detail response. */
export interface AdminOrderDetail extends AdminOrder {
  shippingAddress: AdminShippingAddress | null;
  items: AdminOrderItem[];
  payment: AdminPaymentInfo | null;
}

/** Shipping address in admin order detail. */
export interface AdminShippingAddress {
  recipientName: string;
  phoneNumber: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  email?: string | null;
}

/** Order item in admin order detail. */
export interface AdminOrderItem {
  productId: number;
  productName: string;
  sizeName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

/** Payment info in admin order detail. */
export interface AdminPaymentInfo {
  id: number;
  paymentMethod: string;
  status: string;
  amount: number;
  transactionId?: string | null;
  createdAt: string;
}

/** Update order status request. */
export interface UpdateAdminOrderStatus {
  status: string;
}

export type AdminOrderStatus =
  | 'Pending'
  | 'Processing'
  | 'Shipped'
  | 'Delivered'
  | 'Cancelled';
