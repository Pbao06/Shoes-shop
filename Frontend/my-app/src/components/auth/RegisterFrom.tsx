import { useState, type FormEvent } from "react";

interface RegisterFormProps {
  /** Called with the submit payload when the form is submitted. */
  onSubmit: (data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) => void | Promise<void>;
  /** Disables the submit button while the request is in flight. */
  isLoading?: boolean;
  /** Optional server/API error message rendered above the button. */
  error?: string | null;
}

/**
 * RegisterForm — the sign-up surface, designed to live inside <AuthLayout />.
 *
 * Mirrors LoginForm's visual language exactly: editorial serif heading,
 * underline inputs (no rounded input boxes), uppercase micro-labels with
 * wide tracking, and a rectangular sharp-cornered primary button. No cards,
 * pills, gradients, or shadows. The cream background and ink text come from
 * AuthLayout; this component only contributes the form content.
 *
 * Presentational only: it collects the fields locally and delegates the
 * API call to the `onSubmit` prop so the parent page can wire in the
 * `useRegister` hook without coupling this UI to a specific hook.
 */
export function RegisterForm({
  onSubmit,
  isLoading = false,
  error = null,
}: RegisterFormProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setValidationError(null);

    const trimmedFirstName = firstName.trim();
    const trimmedLastName = lastName.trim();

    if (trimmedFirstName.length < 2) {
      setValidationError("First Name must be at least 2 characters.");
      return;
    }
    if (trimmedLastName.length < 2) {
      setValidationError("Last Name must be at least 2 characters.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setValidationError("Please enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      setValidationError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setValidationError("Password and Confirm Password do not match.");
      return;
    }

    void onSubmit({
      firstName: trimmedFirstName,
      lastName: trimmedLastName,
      email: email.trim(),
      password,
      confirmPassword,
    });
  }

  return (
    <div className="flex flex-col">
      {/* Brand */}
      <p className="font-serif text-[13px] uppercase tracking-[0.3em] text-[#1a1714]/70">
        Maison
      </p>

      {/* Heading */}
      <h1 className="mt-6 font-serif text-[2rem] leading-tight tracking-[-0.01em] text-[#1a1714] sm:text-[2.25rem]">
        Create Account
      </h1>
      <p className="mt-3 text-[13px] leading-relaxed tracking-[0.01em] text-[#1a1714]/55">
        Join Maison to manage your orders and saved pieces.
      </p>

      {/* Form */}
      <form onSubmit={handleSubmit} className="mt-10 flex flex-col gap-7" noValidate>
        {/* First + Last Name — two-column on wider screens, stacked on mobile */}
        <div className="grid grid-cols-1 gap-7 sm:grid-cols-2">
          <label className="block">
            <span className="block text-[11px] font-medium uppercase tracking-[0.2em] text-[#1a1714]/60">
              First Name
            </span>
            <input
              type="text"
              autoComplete="given-name"
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="mt-3 w-full border-0 border-b border-[#1a1714]/20 bg-transparent rounded-none px-0 py-3 text-[15px] text-[#1a1714] placeholder:text-[#1a1714]/30 focus:border-[#1a1714] focus:outline-none focus:ring-0 transition-colors"
            />
          </label>

          <label className="block">
            <span className="block text-[11px] font-medium uppercase tracking-[0.2em] text-[#1a1714]/60">
              Last Name
            </span>
            <input
              type="text"
              autoComplete="family-name"
              required
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="mt-3 w-full border-0 border-b border-[#1a1714]/20 bg-transparent rounded-none px-0 py-3 text-[15px] text-[#1a1714] placeholder:text-[#1a1714]/30 focus:border-[#1a1714] focus:outline-none focus:ring-0 transition-colors"
            />
          </label>
        </div>

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

        {/* Password */}
        <label className="block">
          <span className="block text-[11px] font-medium uppercase tracking-[0.2em] text-[#1a1714]/60">
            Password
          </span>
          <input
            type="password"
            autoComplete="new-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="mt-3 w-full border-0 border-b border-[#1a1714]/20 bg-transparent rounded-none px-0 py-3 text-[15px] text-[#1a1714] placeholder:text-[#1a1714]/30 focus:border-[#1a1714] focus:outline-none focus:ring-0 transition-colors"
          />
        </label>

        {/* Confirm Password */}
        <label className="block">
          <span className="block text-[11px] font-medium uppercase tracking-[0.2em] text-[#1a1714]/60">
            Confirm Password
          </span>
          <input
            type="password"
            autoComplete="new-password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            className="mt-3 w-full border-0 border-b border-[#1a1714]/20 bg-transparent rounded-none px-0 py-3 text-[15px] text-[#1a1714] placeholder:text-[#1a1714]/30 focus:border-[#1a1714] focus:outline-none focus:ring-0 transition-colors"
          />
        </label>

        {/* Client-side validation error */}
        {validationError && (
          <p className="text-[13px] leading-relaxed text-red-600" role="alert">
            {validationError}
          </p>
        )}

        {/* API error */}
        {error && (
          <p className="text-[13px] leading-relaxed text-red-600" role="alert">
            {error}
          </p>
        )}

        {/* Primary action — rectangular, sharp corners, no shadow */}
        <button
          type="submit"
          disabled={isLoading}
          className="mt-2 w-full rounded-none bg-[#1a1714] py-4 text-[12px] font-medium uppercase tracking-[0.2em] text-[#fcfbf8] transition-colors hover:bg-[#1a1714]/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#1a1714] focus-visible:ring-offset-2 focus-visible:ring-offset-[#fcfbf8] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? "Creating account..." : "Create Account"}
        </button>
      </form>

      {/* Login link */}
      <p className="mt-10 text-[13px] tracking-[0.01em] text-[#1a1714]/55">
        Already have an account?{" "}
        <a
          href="/login"
          className="text-[#1a1714] underline underline-offset-4 transition-opacity hover:opacity-70"
        >
          Sign in
        </a>
      </p>
    </div>
  );
}

export default RegisterForm;