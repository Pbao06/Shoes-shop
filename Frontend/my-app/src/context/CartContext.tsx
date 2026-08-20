'use client'

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import type { StaticImageData } from 'next/image'

export type CartItem = {
  productId: number
  name: string
  brand: string
  price: number
  image: string | StaticImageData
  size: string
  color: string
  quantity: number
}

type CartContextValue = {
  items: CartItem[]
  addToCart: (item: Omit<CartItem, 'quantity'>) => void
  increaseQuantity: (productId: number, size: string, color: string) => void
  decreaseQuantity: (productId: number, size: string, color: string) => void
  removeItem: (productId: number, size: string, color: string) => void
  clearCart: () => void
  subtotal: number
  itemCount: number
}

const CartContext = createContext<CartContextValue | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  const addToCart = useCallback((item: Omit<CartItem, 'quantity'>) => {
    setItems((current) => {
      const existing = current.find(
        (i) => i.productId === item.productId && i.size === item.size && i.color === item.color
      )
      if (existing) {
        return current.map((i) =>
          i.productId === item.productId && i.size === item.size && i.color === item.color
            ? { ...i, quantity: i.quantity + 1 }
            : i
        )
      }
      return [...current, { ...item, quantity: 1 }]
    })
  }, [])

  const increaseQuantity = useCallback((productId: number, size: string, color: string) => {
    setItems((current) =>
      current.map((item) =>
        item.productId === productId && item.size === size && item.color === color
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    )
  }, [])

  const decreaseQuantity = useCallback((productId: number, size: string, color: string) => {
    setItems((current) =>
      current.map((item) =>
        item.productId === productId && item.size === size && item.color === color
          ? { ...item, quantity: Math.max(1, item.quantity - 1) }
          : item
      )
    )
  }, [])

  const removeItem = useCallback((productId: number, size: string, color: string) => {
    setItems((current) =>
      current.filter(
        (item) => !(item.productId === productId && item.size === size && item.color === color)
      )
    )
  }, [])

  const clearCart = useCallback(() => {
    setItems([])
  }, [])

  const subtotal = useMemo(
    () => items.reduce((total, item) => total + item.price * item.quantity, 0),
    [items]
  )

  const itemCount = useMemo(() => items.reduce((total, item) => total + item.quantity, 0), [items])

  const value = useMemo(
    () => ({
      items,
      addToCart,
      increaseQuantity,
      decreaseQuantity,
      removeItem,
      clearCart,
      subtotal,
      itemCount,
    }),
    [items, addToCart, increaseQuantity, decreaseQuantity, removeItem, clearCart, subtotal, itemCount]
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}