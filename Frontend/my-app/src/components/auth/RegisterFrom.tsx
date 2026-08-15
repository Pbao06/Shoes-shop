import { useState, type FormEvent } from "react";

/**
 * RegisterForm — the sign-up surface, designed to live inside <AuthLayout />.
 *
 * Mirrors LoginForm's visual language exactly: editorial serif heading,
 * underline inputs (no rounded input boxes), uppercase micro-labels with
 * wide tracking, and a rectangular sharp-cornered primary button. No cards,
 * pills, gradients, or shadows. The cream background and ink text come from
 * AuthLayout; this component only contributes the form content.
 *
 * UI only — no auth logic, API, or session handling (intentional).
 */
export function RegisterForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // Auth wiring is intentionally deferred.
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

        {/* Primary action — rectangular, sharp corners, no shadow */}
        <button
          type="submit"
          className="mt-2 w-full rounded-none bg-[#1a1714] py-4 text-[12px] font-medium uppercase tracking-[0.2em] text-[#fcfbf8] transition-colors hover:bg-[#1a1714]/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#1a1714] focus-visible:ring-offset-2 focus-visible:ring-offset-[#fcfbf8]"
        >
          Create Account
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
