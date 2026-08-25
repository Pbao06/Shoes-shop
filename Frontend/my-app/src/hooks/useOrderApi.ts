"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import orderService from "@/services/orderService";
import type { OrderDto } from "@/types/order";

/**
 * useOrderApi — API-backed order hook.
 *
 * Wraps `orderService` and exposes orders state + actions backed by the real
 * backend (`C_OrderController`). Requires `userId` to build endpoint URLs.
 *
 * State: orders, loading, error.
 * Actions: getOrders, getOrderById, createOrder, cancelOrder, refetch.
 */
export function useOrderApi(userId: number) {
  const [orders, setOrders] = useState<OrderDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const abortRef = useRef<AbortController | null>(null);

  const fetchOrders = useCallback(async () => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);
    try {
      const response = await orderService.getOrders(userId, {
        signal: controller.signal,
      });
      setOrders(response.data);
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
    fetchOrders();
  }, [userId, fetchOrders]);

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  const getOrderById = useCallback(
    async (orderId: number) => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setLoading(true);
      setError(null);
      try {
        const response = await orderService.getOrderById(orderId, userId, {
          signal: controller.signal,
        });
        return response.data;
      } catch (err) {
        if ((err as Error)?.name === "AbortError") return undefined;
        const message =
          err instanceof Error ? err.message : "An unexpected error occurred";
        setError(message);
        throw err;
      } finally {
        if (abortRef.current === controller) {
          setLoading(false);
        }
      }
    },
    [userId],
  );

  const createOrder = useCallback(
    async (payload: Parameters<typeof orderService.createOrder>[1]) => {
      setLoading(true);
      setError(null);
      try {
        const response = await orderService.createOrder(userId, payload);
        const newOrder = response.data;
        setOrders((current) => [newOrder, ...current]);
        return newOrder;
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

  const cancelOrder = useCallback(
    async (orderId: number) => {
      setLoading(true);
      setError(null);
      try {
        const response = await orderService.cancelOrder(orderId, userId);
        setOrders((current) =>
          current.map((order) =>
            order.id === orderId ? response.data : order,
          ),
        );
        return response.data;
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

  const refetch = useCallback(() => {
    fetchOrders();
  }, [fetchOrders]);

  return {
    orders,
    loading,
    error,
    getOrderById,
    createOrder,
    cancelOrder,
    refetch,
  };
}
