import type { StaticImageData } from 'next/image'

export interface CartItem {
  id: number
  productVariantId: number
  name: string
  brand: string
  size: string
  color: string | null
  image: string | null | StaticImageData
  unitPrice: number
  quantity: number
  totalPrice: number
}

export interface CartDto {
  id: number
  totalItems: number
  totalPrice: number
  items: CartItem[]
}
