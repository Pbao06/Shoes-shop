"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import productService, {
  GetProductsParams,
} from "@/services/productService";
import { Product, ProductDetail } from "@/types/product";

/**
 * useProducts — data hook for the Shop / product grid.
 *
 * Wraps `productService.getProducts`, exposing the product list plus
 * loading/error state and the current query params. The API is refetched
 * automatically (via useEffect) whenever any param changes.
 *
 * - Race-safe: each request is aborted (AbortController) when a newer request
 *   starts or on unmount, and AbortError is silently ignored.
 * - Search (`q`) is debounced (~400ms) so typing doesn't spam the API.
 *
 * Note: `initialParams` is only read once on mount (standard lazy-init). If the
 * parent changes `initialParams` later, the hook will NOT re-sync — that's the
 * intended behaviour (treat `initialParams` as initial state, not reactive input).
 */
export function useProducts(initialParams: GetProductsParams = {}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [params, setParams] = useState<GetProductsParams>({
    q: undefined,
    categoryId: undefined,
    brandId: undefined,
    page: 1,
    pageSize: 12,
    ...initialParams,
  });

  // Always-current params, so fetchProducts never depends on the `params` closure.
  const paramsRef = useRef(params);
  paramsRef.current = params;

  // Tracks the in-flight request so we can abort it on change/unmount.
  const abortRef = useRef<AbortController | null>(null);
  // Debounce timer for the search box.
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchProducts = useCallback(async (override?: GetProductsParams) => {
    // Abort any still-running request before starting a new one.
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    const nextParams = override ?? paramsRef.current;
    setLoading(true);
    setError(null);
    try {
      const response = await productService.getProducts(nextParams, {
        signal: controller.signal,
      });
      setProducts(response.data);
      return response.data;
    } catch (err) {
      // Ignore aborted requests — a newer request superseded this one.
      if ((err as Error)?.name === "AbortError") {
        return;
      }
      const message =
        err instanceof Error ? err.message : "An unexpected error occurred";
      setError(message);
      throw err;
    } finally {
      // Only clear loading if this is still the active request.
      if (abortRef.current === controller) {
        setLoading(false);
      }
    }
  }, []);

  // Auto-refetch whenever any query param changes. fetchProducts is stable ([])
  // thanks to paramsRef, so it can live in the deps array without causing loops.
  useEffect(() => {
    fetchProducts();
  }, [
    params.q,
    params.category,
    params.categoryId,
    params.brandId,
    params.page,
    params.pageSize,
    fetchProducts,
  ]);

  // Abort in-flight request and pending debounce on unmount.
  useEffect(() => {
    return () => {
      abortRef.current?.abort();
      if (searchTimer.current) clearTimeout(searchTimer.current);
    };
  }, []);

  /** Change filters (category name, categoryId, brandId) and reset to page 1. */
  const setFilters = useCallback(
    (
      filters: {
        category?: string;
        categoryId?: number;
        brandId?: number;
      },
    ) => {
      setParams((prev) => ({ ...prev, ...filters, page: 1 }));
    },
    [],
  );

  /** Debounced search. Commits after ~400ms idle and resets to page 1. */
  const setSearchQuery = useCallback((q: string) => {
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      setParams((prev) => ({ ...prev, q, page: 1 }));
    }, 400);
  }, []);

  const setPage = useCallback((page: number) => {
    setParams((prev) => ({ ...prev, page }));
  }, []);

  const setPageSize = useCallback((pageSize: number) => {
    setParams((prev) => ({ ...prev, pageSize, page: 1 }));
  }, []);

  /** Re-run the last request with current params. */
  const refetch = useCallback(() => {
    fetchProducts();
  }, [fetchProducts]);

  return useMemo(
    () => ({
      products,
      loading,
      error,
      params,
      setFilters,
      setSearchQuery,
      setPage,
      setPageSize,
      refetch,
    }),
    [
      products,
      loading,
      error,
      params,
      setFilters,
      setSearchQuery,
      setPage,
      setPageSize,
      refetch,
    ],
  );
}

/**
 * useProduct — detail hook for a single product.
 *
 * Wraps `productService.getProductById`, exposing the product detail plus
 * loading/error state. The request is aborted when `id` changes or on unmount,
 * and AbortError is silently ignored (so a stale detail can't overwrite the
 * current one).
 */
export function useProduct(id: number) {
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const abortRef = useRef<AbortController | null>(null);

  const fetchProduct = useCallback(async (productId: number) => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);
    try {
      const response = await productService.getProductById(productId, {
        signal: controller.signal,
      });
      setProduct(response.data);
      return response.data;
    } catch (err) {
      if ((err as Error)?.name === "AbortError") {
        return;
      }
      const message =
        err instanceof Error ? err.message : "An unexpected error occurred";
      setError(message);
      throw err;
    } finally {
      if (abortRef.current === controller) {
        setLoading(false);
      }
    }
  }, []);

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

  return useMemo(
    () => ({ product, loading, error, refetch }),
    [product, loading, error, refetch],
  );
}
