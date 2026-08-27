'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { adminOrderService } from '@/services/admin';
import type { AdminOrder, AdminOrderDetail } from '@/types/admin/orders';

/**
 * useAdminOrders — list all admin orders.
 *
 * @param status - optional filter (e.g. 'Pending', 'Processing', etc.)
 */
export function useAdminOrders(status?: string) {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
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
      const response = await adminOrderService.getAll(status, { signal: controller.signal });
      setOrders(response.data);
    } catch (err) {
      if ((err as Error)?.name === 'AbortError') return;
      const message = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(message);
    } finally {
      if (abortRef.current === controller) {
        setLoading(false);
      }
    }
  }, [status]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  const refetch = useCallback(() => {
    fetchOrders();
  }, [fetchOrders]);

  return { orders, loading, error, refetch };
}

/**
 * useAdminOrder — single order detail.
 */
export function useAdminOrder(orderId: number) {
  const [order, setOrder] = useState<AdminOrderDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string |null>(null);

  const abortRef = useRef<AbortController | null>(null);

  const fetchOrder = useCallback(
    async (id: number) => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setLoading(true);
      setError(null);
      try {
        const response = await adminOrderService.getById(id, { signal: controller.signal });
        setOrder(response.data);
        return response.data;
      } catch (err) {
        if ((err as Error)?.name === 'AbortError') return;
        const message = err instanceof Error ? err.message : 'An unexpected error occurred';
        setError(message);
        throw err;
      } finally {
        if (abortRef.current === controller) {
          setLoading(false);
        }
      }
    },
    [],
  );

  useEffect(() => {
    fetchOrder(orderId);
  }, [orderId, fetchOrder]);

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  const refetch = useCallback(() => {
    fetchOrder(orderId);
  }, [fetchOrder, orderId]);

  return { order, loading, error, refetch };
}
