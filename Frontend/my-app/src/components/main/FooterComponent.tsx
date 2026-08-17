import { Link } from "@tanstack/react-router";
import { forwardRef } from "react";
import type { LucideIcon, LucideProps } from "lucide-react";
import type { ReactNode } from "react";

/**
 * Footer — the bottom brand footer for Maison.
 *
 * Design language: quiet luxury / editorial. Sharp corners, hairline top
 * border, generous whitespace, serif brand mark, uppercase micro-tracked sans
 * column headings and links. No filled buttons, no badges, no floating
 * cards, no heavy shadows.
 *
 * Color: unlike the rest of the site (off-white #fcfbf8 body), the footer
 * uses an inverted charcoal/off-white palette (#16140f bg, #f3ede2 ink) so it
 * reads as a deliberate closing band rather than blending into the page —
 * a common device on luxury fashion sites. Still strictly within the brand's
 * neutral palette — no new hues introduced, just Black/Charcoal + Off-white.
 *
 * Layout:
 *   [left: logo + description]   [middle: Shop links]   [right: Company links]
 *   ─────────────────────────────────────────────────────────────
 *   [bottom: copyright]                              [social icons]
 *
 * On mobile the three columns stack vertically and the bottom bar wraps.
 */
export function Footer() {
  return (
    <footer className="w-full border-t border-[#f3ede2]/10 bg-[#16140f] text-[#f3ede2]">
      <div className="mx-auto w-full max-w-[1400px] px-6 sm:px-8 md:px-12">
        {/* Top band — brand + link columns */}
        <div className="grid grid-cols-1 gap-12 py-16 md:grid-cols-12 md:gap-8 md:py-20">
          {/* Left — brand */}
          <div className="md:col-span-5">
            <Link
              to="/"
              aria-label="Maison — home"
              className="font-serif text-[1.25rem] tracking-[0.18em] text-[#f3ede2] md:text-[1.5rem]"
            >
              MAISON
            </Link>
            <p className="mt-5 max-w-xs text-[13px] leading-[1.7] text-[#f3ede2]/60">
              Timeless pieces, carefully considered. A curated edit of modern
              essentials and quiet luxury, made to last beyond the season.
            </p>
          </div>

          {/* Middle — Shop links */}
          <nav aria-label="Shop" className="md:col-span-3 md:col-start-8">
            <h2 className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#f3ede2]/45">
              Shop
            </h2>
            <ul className="mt-5 space-y-3">
              {SHOP_LINKS.map(({ label, href }) => (
                <li key={label}>
                  <FooterLink href={href}>{label}</FooterLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* Right — Company links */}
          <nav aria-label="Company" className="md:col-span-2 md:col-start-11">
            <h2 className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#f3ede2]/45">
              Company
            </h2>
            <ul className="mt-5 space-y-3">
              {COMPANY_LINKS.map(({ label, href }) => (
                <li key={label}>
                  <FooterLink href={href}>{label}</FooterLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Bottom bar — copyright + socials */}
        <div className="flex flex-col items-start justify-between gap-6 border-t border-[#f3ede2]/10 py-8 sm:flex-row sm:items-center">
          <p className="text-[11px] uppercase tracking-[0.18em] text-[#f3ede2]/45">
            © {new Date().getFullYear()} Maison. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            {SOCIALS.map(({ label, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="text-[#f3ede2]/70 transition-colors hover:text-[#f3ede2] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#f3ede2] focus-visible:ring-offset-2 focus-visible:ring-offset-[#16140f]"
              >
                <Icon strokeWidth={1.4} className="h-[18px] w-[18px]" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

/**
 * FooterLink — a restrained underline-on-hover link.
 * Plain anchors: /collections, /about etc. are not yet typed routes, so a
 * typed <Link to=...> would fail to compile. This matches Navbar's pattern.
 */
function FooterLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      className="text-[13px] text-[#f3ede2]/70 underline-offset-6 transition-colors hover:text-[#f3ede2] hover:underline"
    >
      {children}
    </a>
  );
}

/**
 * Brand icons — Lucide removed brand/social icons (Instagram, Twitter,
 * Facebook) from recent versions, so we ship minimal stroke-based equivalents
 * that match Lucide's design language.
 */
const InstagramIcon = forwardRef<SVGSVGElement, LucideProps>(
  (props, ref) => (
    <svg
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  )
);
InstagramIcon.displayName = "InstagramIcon";

const TwitterIcon = forwardRef<SVGSVGElement, LucideProps>(
  (props, ref) => (
    <svg
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4 -.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
    </svg>
  )
);
TwitterIcon.displayName = "TwitterIcon";

const FacebookIcon = forwardRef<SVGSVGElement, LucideProps>(
  (props, ref) => (
    <svg
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  )
);
FacebookIcon.displayName = "FacebookIcon";

const SHOP_LINKS: { label: string; href: string }[] = [
  { label: "Collections", href: "/collections" },
  { label: "New Arrivals", href: "/collections/new-arrivals" },
  { label: "Best Sellers", href: "/collections/best-sellers" },
];

const COMPANY_LINKS: { label: string; href: string }[] = [
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "FAQ", href: "/faq" },
];

const SOCIALS: { label: string; href: string; icon: LucideIcon }[] = [
  { label: "Instagram", href: "https://instagram.com", icon: InstagramIcon },
  { label: "Twitter", href: "https://twitter.com", icon: TwitterIcon },
  { label: "Facebook", href: "https://facebook.com", icon: FacebookIcon },
];

export default Footer;