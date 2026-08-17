"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";
import RegisterForm from "@/components/auth/RegisterFrom";
import { useRegister } from "@/hooks/useAuth";

/**
 * /register — the sign-up page.
 *
 * Composes the presentational <RegisterForm /> with the `useRegister` mutation
 * hook: on submit it calls `POST /api/Auth/register`, surfaces API errors in
 * the form, disables the button while loading, and navigates to `/login` on
 * success so the user can sign in with their new credentials.
 *
 * Token persistence is deliberately not handled here — the register response
 * carries no token, only a confirmation message and email.
 */
export default function RegisterPage() {
  const router = useRouter();
  const { register, error, isLoading } = useRegister();

  const handleSubmit = useCallback(
    async (data: {
      firstName: string;
      lastName: string;
      email: string;
      password: string;
      confirmPassword: string;
    }) => {
      await register(data);
      
    },
    [register, router],
  );

  return (
    <RegisterForm onSubmit={handleSubmit} isLoading={isLoading} error={error} />
  );
}