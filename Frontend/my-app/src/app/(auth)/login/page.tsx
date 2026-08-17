"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";
import LoginForm from "@/components/auth/LoginFrom";
import { useLogin } from "@/hooks/useAuth";

/**
 * /login — the sign-in page.
 *
 * Composes the presentational <LoginForm /> with the `useLogin` mutation
 * hook: on submit it calls `POST /api/Auth/login`, surfaces API errors in
 * the form, disables the button while loading, and navigates to `/home`
 * on success.
 *
 * Token persistence is deliberately not handled here yet — wire it into
 * `setAccessTokenProvider` (src/libs/apiClient.ts) once auth storage lands.
 */
export default function LoginPage() {
  const router = useRouter();
  const { login, error, isLoading } = useLogin();

  const handleSubmit = useCallback(
    async (data: { email: string; password: string }) => {
      await login(data);
      
      // router.push("/home");
    },
    [login, router],
  );

  return <LoginForm onSubmit={handleSubmit} isLoading={isLoading} error={error} />;
}