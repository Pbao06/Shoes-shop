'use client'

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import type { StaticImageData } from 'next/image'
import type { CartItem } from '@/context/CartContext'

export type OrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled'

export type OrderItem = {
  productId: number
  name: string
  brand: string
  price: number
  image: string | StaticImageData
  size: string
  color: string
  quantity: number
}

export type ShippingAddress = {
  firstName: string
  lastName: string
  email: string
  address: string
  city: string
  postalCode: string
  country: string
}

export type Order = {
  id: string
  date: string
  status: OrderStatus
  items: OrderItem[]
  subtotal: number
  shipping: number
  total: number
  shippingAddress: ShippingAddress
  paymentMethod: string
}

type OrderContextValue = {
  orders: Order[]
  addOrder: (items: CartItem[], shipping: number, address: ShippingAddress, paymentMethod: string) => Order
  getOrderById: (id: string) => Order | undefined
}

const OrderContext = createContext<OrderContextValue | undefined>(undefined)

export function OrderProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([])

  const addOrder = useCallback(
    (items: CartItem[], shipping: number, address: ShippingAddress, paymentMethod: string) => {
      const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
      const total = subtotal + shipping
      const orderNumber = `AT-${Math.floor(1000 + Math.random() * 9000)}`
      const order: Order = {
        id: orderNumber,
        date: new Date().toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        }),
        status: 'Pending',
        items: items.map((item) => ({
          productId: item.productId,
          name: item.name,
          brand: item.brand,
          price: item.price,
          image: item.image,
          size: item.size,
          color: item.color,
          quantity: item.quantity,
        })),
        subtotal,
        shipping,
        total,
        shippingAddress: address,
        paymentMethod,
      }
      setOrders((prev) => [order, ...prev])
      return order
    },
    [],
  )

  const getOrderById = useCallback(
    (id: string) => orders.find((order) => order.id === id),
    [orders],
  )

  const value = useMemo(() => ({ orders, addOrder, getOrderById }), [orders, addOrder, getOrderById])

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>
}

export function useOrders() {
  const context = useContext(OrderContext)
  if (!context) {
    throw new Error('useOrders must be used within an OrderProvider')
  }
  return context
}
