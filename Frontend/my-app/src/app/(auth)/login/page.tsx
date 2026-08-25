"use client";

import { useRouter } from "next/navigation";
import LoginForm from "@/components/auth/LoginFrom";
import { useLogin } from "@/hooks/useAuth";

export default function LoginPage() {
  const router = useRouter();
  const { login, error, isLoading } = useLogin();

  const handleSubmit = async (data: { email: string; password: string }) => {
    await login(data);
    router.push("/home");
  };

  return <LoginForm onSubmit={handleSubmit} isLoading={isLoading} error={error} />;
}