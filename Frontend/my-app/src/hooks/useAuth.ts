"use client";

import { useCallback, useState } from "react";
import authService from "@/services/authService";
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from "@/types/auth";

/**
 * useLogin — login mutation hook.
 *
 * Calls `POST /api/Auth/login` via the auth service. Exposes loading/error
 * states plus a `login` action. The returned data is the unwrapped `data`
 * payload from the API envelope.
 *
 * Token persistence is intentionally NOT handled here; wire it into your
 * auth storage via `setAccessTokenProvider` (src/libs/apiClient.ts) later.
 */
export function useLogin() {
  const [data, setData] = useState<LoginResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback(async (payload: LoginRequest) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.login(payload);
      setData(response.data);
      console.log("login tu server gui ve : ",response);
      return response.data;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "An unexpected error occurred";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { login, data, error, isLoading };
}

/**
 * useRegister — register mutation hook.
 *
 * Calls `POST /api/Auth/register` via the authService and exposes
 * loading/error state plus the unwrapped API response data.
 */
export function useRegister() {
  const [data, setData] = useState<RegisterResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const register = useCallback(async (payload: RegisterRequest) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.register(payload);
      setData(response.data);
      console.log(" Data get is : ",response.data);
      return response.data;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "An unexpected error occurred";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { register, data, error, isLoading };
}