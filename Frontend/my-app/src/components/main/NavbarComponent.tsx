// import { Link } from "@tanstack/react-router";
import Link from "next/link";
import { Search, ShoppingBag, User, type LucideIcon } from "lucide-react";

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
        <div className="flex flex-1 items-center justify-end gap-4 sm:gap-6">
          <IconButton href="/search" label="Search" icon={Search} />
          <IconButton href="/cart" label="Cart" icon={ShoppingBag} />
          <IconButton href="/login" label="Account" icon={User} />
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
          <a
            href={href}
            className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#1a1714]/75 underline-offset-8 transition-colors hover:text-[#1a1714] hover:underline"
          >
            {label}
          </a>
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
    <a
      href={href}
      aria-label={label}
      className="flex h-9 w-9 items-center justify-center text-[#1a1714]/80 transition-colors hover:text-[#1a1714] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#1a1714] focus-visible:ring-offset-2 focus-visible:ring-offset-[#fcfbf8]"
    >
      <Icon strokeWidth={1.4} className="h-[18px] w-[18px]" />
    </a>
  );
}

const NAV_ITEMS: { label: string; href: string }[] = [
  { label: "Home", href: "/home" },
  { label: "Collections", href: "/collections" },
  { label: "About", href: "/about" },
];

export default Navbar;
