'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { adminCategoryService } from '@/services/admin';
import type { AdminCategory } from '@/types/admin/products';

/**
 * useAdminCategories — list all admin categories.
 */
export function useAdminCategories() {
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const abortRef = useRef<AbortController | null>(null);

  const fetchCategories = useCallback(async () => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);
    try {
      const response = await adminCategoryService.getAll({ signal: controller.signal });
      setCategories(response.data);
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
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  const refetch = useCallback(() => {
    fetchCategories();
  }, [fetchCategories]);

  return { categories, loading, error, refetch };
}

/**
 * useAdminCategory — single category detail.
 */
export function useAdminCategory(id: number) {
  const [category, setCategory] = useState<AdminCategory | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const abortRef = useRef<AbortController | null>(null);

  const fetchCategory = useCallback(
    async (categoryId: number) => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setLoading(true);
      setError(null);
      try {
        const response = await adminCategoryService.getById(categoryId, {
          signal: controller.signal,
        });
        setCategory(response.data);
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
    fetchCategory(id);
  }, [id, fetchCategory]);

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  const refetch = useCallback(() => {
    fetchCategory(id);
  }, [fetchCategory, id]);

  return { category, loading, error, refetch };
}
