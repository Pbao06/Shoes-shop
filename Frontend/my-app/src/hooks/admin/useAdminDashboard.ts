'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { adminDashboardService } from '@/services/admin';
import type { AdminDashboardStats } from '@/types/admin/dashboard';

/**
 * useAdminDashboard — fetch dashboard statistics.
 */
export function useAdminDashboard() {
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const abortRef = useRef<AbortController | null>(null);

  const fetchStats = useCallback(async () => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);
    try {
      const response = await adminDashboardService.getStats({ signal: controller.signal });
      setStats(response.data);
    } catch (err) {
      if ((err as Error)?.name === 'AbortError') return;
      const message = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(message);
    } finally {
      if (abortRef.current === controller) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  const refetch = useCallback(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, loading, error, refetch };
}
