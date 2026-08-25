/**
 * Order DTOs mirrored from the .NET backend
 * (Backend/Source/src/DTOs/{OrderDto,CheckoutDto}.cs).
 */

/** POST /api/orders/{userId} — request body. */
export interface CheckoutRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  recipientName?: string;
  phoneNumber?: string;
  addressId?: number;
  paymentMethod?: string;
  payment?: string;
}

/** POST /api/orders/{userId} — response `data` payload. */
export interface OrderDto {
  id: number;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  subtotal: number;
  shippingFee: number;
  totalAmount: number;
  createdAt: string;
  address: AddressDto | null;
  items: OrderItemDto[];
}

export interface AddressDto {
  recipientName: string;
  phoneNumber: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  email?: string | null;
}

export type OrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled'

export interface OrderItemDto {
  productId: number;
  productVariantId: number;
  productName: string;
  sizeName: string;
  color: string | null;
  imageUrl: string | null;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}
