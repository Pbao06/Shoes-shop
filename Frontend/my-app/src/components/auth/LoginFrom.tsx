import { useState, type FormEvent } from "react";

interface LoginFormProps {
  /** Called with the submit payload when the form is submitted. */
  onSubmit: (data: { email: string; password: string }) => void | Promise<void>;
  /** Disables the submit button while the request is in flight. */
  isLoading?: boolean;
  /** Optional server/API error message rendered above the button. */
  error?: string | null;
}

/**
 * LoginForm — the sign-in surface, designed to live inside <AuthLayout />.
 *
 * Visual language: quiet luxury / editorial. Underline inputs, uppercase
 * micro-labels, an editorial serif heading, and a rectangular sharp-cornered
 * primary button. The cream background and ink text come from AuthLayout.
 *
 * Presentational only: it collects email/password locally and delegates the
 * API call to the `onSubmit` prop so the parent page can wire in the
 * `useLogin` hook without coupling this UI to a specific hook.
 */
export function LoginForm({
  onSubmit,
  isLoading = false,
  error = null,
}: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void onSubmit({ email, password });
  }

  return (
    <div className="flex flex-col">
      {/* Brand */}
      <p className="font-serif text-[13px] uppercase tracking-[0.3em] text-[#1a1714]/70">
        Maison
      </p>

      {/* Heading */}
      <h1 className="mt-6 font-serif text-[2rem] leading-tight tracking-[-0.01em] text-[#1a1714] sm:text-[2.25rem]">
        Sign In
      </h1>
      <p className="mt-3 text-[13px] leading-relaxed tracking-[0.01em] text-[#1a1714]/55">
        Welcome back. Sign in to access your account and orders.
      </p>

      {/* Form */}
      <form onSubmit={handleSubmit} className="mt-10 flex flex-col gap-7" noValidate>
        {/* Email */}
        <label className="block">
          <span className="block text-[11px] font-medium uppercase tracking-[0.2em] text-[#1a1714]/60">
            Email
          </span>
          <input
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="mt-3 w-full border-0 border-b border-[#1a1714]/20 bg-transparent rounded-none px-0 py-3 text-[15px] text-[#1a1714] placeholder:text-[#1a1714]/30 focus:border-[#1a1714] focus:outline-none focus:ring-0 transition-colors"
          />
        </label>

        {/* Password + forgot password */}
        <div className="block">
          <div className="flex items-baseline justify-between">
            <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#1a1714]/60">
              Password
            </span>
            <a
              href="/forgot-password"
              className="text-[11px] tracking-[0.04em] text-[#1a1714]/55 underline-offset-4 transition-colors hover:text-[#1a1714] hover:underline"
            >
              Forgot password?
            </a>
          </div>
          <input
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="mt-3 w-full border-0 border-b border-[#1a1714]/20 bg-transparent rounded-none px-0 py-3 text-[15px] text-[#1a1714] placeholder:text-[#1a1714]/30 focus:border-[#1a1714] focus:outline-none focus:ring-0 transition-colors"
          />
        </div>

        {/* API error */}
        {error && (
          <p className="text-[13px] leading-relaxed text-red-600" role="alert">
            {error}
          </p>
        )}

        {/* Primary action - rectangular, sharp corners, no shadow */}
        <button
          type="submit"
          disabled={isLoading}
          className="mt-2 w-full rounded-none bg-[#1a1714] py-4 text-[12px] font-medium uppercase tracking-[0.2em] text-[#fcfbf8] transition-colors hover:bg-[#1a1714]/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#1a1714] focus-visible:ring-offset-2 focus-visible:ring-offset-[#fcfbf8] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? "Signing in..." : "Sign In"}
        </button>
      </form>

      {/* Register link */}
      <p className="mt-10 text-[13px] tracking-[0.01em] text-[#1a1714]/55">
        New here?{" "}
        <a
          href="/register"
          className="text-[#1a1714] underline underline-offset-4 transition-opacity hover:opacity-70"
        >
          Create an account
        </a>
      </p>
    </div>
  );
}

export default LoginForm;