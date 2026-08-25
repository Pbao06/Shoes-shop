"use client";

import { useCallback, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import authService from "@/services/authService";
import type { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from "@/types/auth";

export function useLogin() {
  const { login, user, error, isLoading } = useAuth();

  return {
    login: useCallback(async (payload: LoginRequest) => login(payload), [login]),
    data: user,
    error,
    isLoading,
  };
}

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