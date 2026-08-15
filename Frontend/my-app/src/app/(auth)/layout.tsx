import type { ReactNode } from "react";
import AuthLayout from "@/components/auth/AuthLayout";

/**
 * Route layout for all auth surfaces (login, register, ...).
 * Wraps content in the shared editorial AuthLayout.
 */
export default function AuthRouteLayout({ children }: { children: ReactNode }) {
  return <AuthLayout>{children}</AuthLayout>;
}