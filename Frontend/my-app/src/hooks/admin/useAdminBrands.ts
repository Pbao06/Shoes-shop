'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { adminBrandService } from '@/services/admin';
import type { AdminBrand } from '@/types/admin/products';

/**
 * useAdminBrands — list all admin brands.
 */
export function useAdminBrands() {
  const [brands, setBrands] = useState<AdminBrand[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const abortRef = useRef<AbortController | null>(null);

  const fetchBrands = useCallback(async () => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);
    try {
      const response = await adminBrandService.getAll({ signal: controller.signal });
      setBrands(response.data);
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
    fetchBrands();
  }, [fetchBrands]);

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  const refetch = useCallback(() => {
    fetchBrands();
  }, [fetchBrands]);

  return { brands, loading, error, refetch };
}

/**
 * useAdminBrand — single brand detail.
 */
export function useAdminBrand(id: number) {
  const [brand, setBrand] = useState<AdminBrand | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const abortRef = useRef<AbortController | null>(null);

  const fetchBrand = useCallback(
    async (brandId: number) => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setLoading(true);
      setError(null);
      try {
        const response = await adminBrandService.getById(brandId, {
          signal: controller.signal,
        });
        setBrand(response.data);
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
    fetchBrand(id);
  }, [id, fetchBrand]);

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  const refetch = useCallback(() => {
    fetchBrand(id);
  }, [fetchBrand, id]);

  return { brand, loading, error, refetch };
}
