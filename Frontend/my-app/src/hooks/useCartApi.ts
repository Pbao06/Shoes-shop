"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import cartService, { AddToCartPayload } from "@/services/cartService";
import type { CartDto, CartItem } from "@/types/cart";

/**
 * useCartApi — API-backed cart hook.
 *
 * Wraps `cartService` and exposes cart state + actions backed by the real
 * backend (`C_CartController`). Requires `userId` to build endpoint URLs.
 *
 * State: items, loading, error, totalItems, totalPrice.
 * Actions: getCart, addToCart, updateItem, removeItem, clearCart, refetch.
 */
export function useCartApi(userId: number) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const abortRef = useRef<AbortController | null>(null);

  const fetchCart = useCallback(async () => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);
    try {
      const response = await cartService.getCart(userId, {
        signal: controller.signal,
      });
      setItems(response.data.items);
    } catch (err) {
      if ((err as Error)?.name === "AbortError") return;
      const message =
        err instanceof Error ? err.message : "An unexpected error occurred";
      setError(message);
    } finally {
      if (abortRef.current === controller) {
        setLoading(false);
      }
    }
  }, [userId]);

  useEffect(() => {
    fetchCart();
  }, [userId, fetchCart]);

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  const addToCart = useCallback(
    async (payload: AddToCartPayload) => {
      setLoading(true);
      setError(null);
      try {
        const response = await cartService.addToCart(userId, payload);
        setItems(response.data.items);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "An unexpected error occurred";
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [userId],
  );

  const updateItem = useCallback(
    async (cartItemId: number, quantity: number) => {
      setLoading(true);
      setError(null);
      try {
        const response = await cartService.updateItem(userId, cartItemId, quantity);
        setItems(response.data.items);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "An unexpected error occurred";
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [userId],
  );

  const removeItem = useCallback(
    async (cartItemId: number) => {
      setLoading(true);
      setError(null);
      try {
        await cartService.removeItem(userId, cartItemId);
        setItems((current) => current.filter((item) => item.id !== cartItemId));
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "An unexpected error occurred";
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [userId],
  );

  const clearCart = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await cartService.clearCart(userId);
      setItems([]);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "An unexpected error occurred";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.totalPrice, 0);

  return {
    items,
    loading,
    error,
    totalItems,
    totalPrice,
    addToCart,
    updateItem,
    removeItem,
    clearCart,
    refetch: fetchCart,
  };
}
