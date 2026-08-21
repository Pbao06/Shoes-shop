"use client";

// import { Link } from "@tanstack/react-router";
import Link from "next/link";
import { Search, ShoppingBag, User, type LucideIcon } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useCart } from "@/context/CartContext";

/**
 * Navbar — the primary top navigation for Maison.
 *
 * Design language: quiet luxury / editorial. Sharp corners, no shadow,
 * hairline bottom border, editorial serif wordmark centered, and uppercase
 * micro-tracked sans labels for the primary links. The right-hand icon
 * cluster (Search, Cart, User) uses minimal-stroke lucide icons that match
 * the typographic restraint — no filled/pill buttons, no badges, no floating
 * card chrome.
 *
 * Layout: a single horizontal bar split into three groups:
 *   [left nav links]   [centered wordmark]   [right icon cluster]
 * The nav links collapse below `md` so the wordmark stays the single anchor.
 */
export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#1a1714]/10 bg-[#fcfbf8]/95 backdrop-blur-[2px]">
      <nav
        aria-label="Primary"
        className="mx-auto flex h-16 w-full max-w-[1400px] items-center justify-between px-6 sm:px-8 md:h-20 md:px-12"
      >
        {/* Left — primary links. Hidden on the smallest screens to keep the
            bar calm; the wordmark remains the single anchor there. */}
        <div className="hidden flex-1 items-center md:flex">
          <NavLinks />
        </div>

        {/* Center — editorial wordmark. On mobile it is the leftmost element
            so the bar stays readable and uncluttered. */}
        <div className="flex flex-1 items-center justify-start md:justify-center">
          <Link
            href="/home"
            aria-label="Maison — home"
            className="font-serif text-[1.25rem] tracking-[0.18em] text-[#1a1714] md:text-[1.5rem]"
          >
            MAISON
          </Link>
        </div>

        {/* Right — icon cluster. Always visible. */}
        <div className="flex flex-1 items-center justify-end gap-1 sm:gap-2">
          <IconButton href="/search" label="Search" icon={Search} />
          <CartButton />
          <UserDropdown />
        </div>
      </nav>
    </header>
  );
}

/**
 * Primary text links — Home / Collections / About.
 * Underline on hover only, restrained, no background fills.
 * Plain anchors: the /collections and /about routes are not yet defined, so a
 * typed <Link to=...> would fail to compile. This matches LoginForm's pattern.
 */
function NavLinks() {
  return (
    <ul className="flex items-center gap-7 lg:gap-10">
      {NAV_ITEMS.map(({ label, href }) => (
        <li key={label}>
          <Link
            href={href}
            className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#1a1714]/75 underline-offset-8 transition-colors hover:text-[#1a1714] hover:underline"
          >
            {label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

/**
 * IconButton — a borderless icon anchor that renders a lucide icon inside an
 * accessible, focus-visible ring. Sharp corners, no fill, no shadow.
 */
function IconButton({
  href,
  label,
  icon: Icon,
}: {
  href: string;
  label: string;
  icon: LucideIcon;
}) {
  return (
    <Link
      href={href}
      aria-label={label}
      className="flex h-9 w-9 items-center justify-center text-[#1a1714]/80 transition-colors hover:text-[#1a1714] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#1a1714] focus-visible:ring-offset-2 focus-visible:ring-offset-[#fcfbf8]"
    >
      <Icon strokeWidth={1.4} className="h-[18px] w-[18px]" />
    </Link>
  );
}

/**
 * CartButton — the shopping bag icon with a small count badge.
 * Shows the total number of items currently in the cart.
 */
function CartButton() {
  const { itemCount } = useCart();

  return (
    <Link
      href="/cart"
      aria-label="Cart"
      className="relative flex h-9 w-9 items-center justify-center text-[#1a1714]/80 transition-colors hover:text-[#1a1714] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#1a1714] focus-visible:ring-offset-2 focus-visible:ring-offset-[#fcfbf8]"
    >
      <ShoppingBag strokeWidth={1.4} className="h-[18px] w-[18px]" />
      {itemCount > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#1a1714] px-1 text-[9px] font-medium leading-none text-[#fcfbf8]">
          {itemCount > 99 ? "99+" : itemCount}
        </span>
      )}
    </Link>
  );
}

/**
 * UserDropdown — a borderless icon button with a dropdown menu.
 * Shows Sign In / My Orders when unauthenticated; Account / My Orders / Logout when authenticated.
 * Matches the navbar's quiet-luxury design language: sharp corners, hairline border, no shadow.
 */
function UserDropdown() {
  const [open, setOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    setIsAuthenticated(!!token);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        aria-label="Account"
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        className="flex h-9 w-9 items-center justify-center text-[#1a1714]/80 transition-colors hover:text-[#1a1714] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#1a1714] focus-visible:ring-offset-2 focus-visible:ring-offset-[#fcfbf8]"
      >
        <User strokeWidth={1.4} className="h-[18px] w-[18px]" />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 w-44 border border-[#1a1714]/10 bg-[#fcfbf8] py-1">
          {!isAuthenticated ? (
            <>
              <Link
                href="/login"
                className="block px-4 py-2 text-[11px] font-medium uppercase tracking-[0.22em] text-[#1a1714]/75 transition-colors hover:text-[#1a1714]"
                onClick={() => setOpen(false)}
              >
                Sign In
              </Link>
              <Link
                href="/orders"
                className="block px-4 py-2 text-[11px] font-medium uppercase tracking-[0.22em] text-[#1a1714]/75 transition-colors hover:text-[#1a1714]"
                onClick={() => setOpen(false)}
              >
                My Orders
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/account"
                className="block px-4 py-2 text-[11px] font-medium uppercase tracking-[0.22em] text-[#1a1714]/75 transition-colors hover:text-[#1a1714]"
                onClick={() => setOpen(false)}
              >
                Account
              </Link>
              <Link
                href="/orders"
                className="block px-4 py-2 text-[11px] font-medium uppercase tracking-[0.22em] text-[#1a1714]/75 transition-colors hover:text-[#1a1714]"
                onClick={() => setOpen(false)}
              >
                My Orders
              </Link>
              <button
                onClick={() => {
                  localStorage.removeItem("accessToken");
                  setIsAuthenticated(false);
                  setOpen(false);
                }}
                className="block w-full px-4 py-2 text-left text-[11px] font-medium uppercase tracking-[0.22em] text-[#1a1714]/75 transition-colors hover:text-[#1a1714]"
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

const NAV_ITEMS: { label: string; href: string }[] = [
  { label: "Home", href: "/home" },
  { label: "Collections", href: "/shop" },
  { label: "About", href: "/about" },
];

export default Navbar;
