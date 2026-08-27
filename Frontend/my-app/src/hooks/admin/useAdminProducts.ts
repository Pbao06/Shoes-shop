'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { adminProductService } from '@/services/admin';
import type { AdminProduct, AdminProductVariant, AdminProductImage, AdminSize } from '@/types/admin/products';

/**
 * useAdminProducts — list all admin products.
 */
export function useAdminProducts() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const abortRef = useRef<AbortController | null>(null);

  const fetchProducts = useCallback(async () => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);
    try {
      const response = await adminProductService.getAll({ signal: controller.signal });
      setProducts(response.data);
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
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  const refetch = useCallback(() => {
    fetchProducts();
  }, [fetchProducts]);

  return { products, loading, error, refetch };
}

/**
 * useAdminProduct — single product detail.
 */
export function useAdminProduct(id: number) {
  const [product, setProduct] = useState<AdminProduct | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const abortRef = useRef<AbortController | null>(null);

  const fetchProduct = useCallback(
    async (productId: number) => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setLoading(true);
      setError(null);
      try {
        const response = await adminProductService.getById(productId, {
          signal: controller.signal,
        });
        setProduct(response.data);
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
    fetchProduct(id);
  }, [id, fetchProduct]);

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  const refetch = useCallback(() => {
    fetchProduct(id);
  }, [fetchProduct, id]);

  return { product, loading, error, refetch };
}

/**
 * useAdminProductVariants — list variants for a product.
 */
export function useAdminProductVariants(productId: number) {
  const [variants, setVariants] = useState<AdminProductVariant[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const abortRef = useRef<AbortController | null>(null);

  const fetchVariants = useCallback(async () => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);
    try {
      const response = await adminProductService.getVariants(productId, {
        signal: controller.signal,
      });
      setVariants(response.data);
    } catch (err) {
      if ((err as Error)?.name === 'AbortError') return;
      const message = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(message);
    } finally {
      if (abortRef.current === controller) {
        setLoading(false);
      }
    }
  }, [productId]);

  useEffect(() => {
    fetchVariants();
  }, [fetchVariants]);

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  const refetch = useCallback(() => {
    fetchVariants();
  }, [fetchVariants]);

  return { variants, loading, error, refetch };
}

/**
 * useAdminProductImages — list images for a product.
 */
export function useAdminProductImages(productId: number) {
  const [images, setImages] = useState<AdminProductImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const abortRef = useRef<AbortController | null>(null);

  const fetchImages = useCallback(async () => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);
    try {
      const response = await adminProductService.getImages(productId, {
        signal: controller.signal,
      });
      setImages(response.data);
    } catch (err) {
      if ((err as Error)?.name === 'AbortError') return;
      const message = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(message);
    } finally {
      if (abortRef.current === controller) {
        setLoading(false);
      }
    }
  }, [productId]);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  const refetch = useCallback(() => {
    fetchImages();
  }, [fetchImages]);

  return { images, loading, error, refetch };
}

/**
 * useAdminSizes — list all sizes.
 */
export function useAdminSizes() {
  const [sizes, setSizes] = useState<AdminSize[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const abortRef = useRef<AbortController | null>(null);

  const fetchSizes = useCallback(async () => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);
    try {
      const response = await adminProductService.getSizes({ signal: controller.signal });
      setSizes(response.data);
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
    fetchSizes();
  }, [fetchSizes]);

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  const refetch = useCallback(() => {
    fetchSizes();
  }, [fetchSizes]);

  return { sizes, loading, error, refetch };
}
