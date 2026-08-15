import { type ReactNode } from "react";
import authEditorial from "@/assets/auth-editorial.jpg";

interface AuthLayoutProps {
  children: ReactNode;
}

/**
 * Shared layout for auth surfaces (login / register).
 *
 * Desktop: ~55% full-height editorial image (left) + ~45% content area (right).
 * The image is full-bleed, object-cover, no radius, no card container.
 * Content is vertically centered within a ~420px constrained column on a
 * neutral background.
 *
 * Mobile: content becomes full-width and vertically centered; the editorial
 * image collapses to a compact banner above it to preserve brand presence
 * without dominating the small screen.
 */
export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-dvh w-full bg-[#fcfbf8] text-[#1a1714]">
      <div className="grid min-h-dvh grid-cols-1 md:grid-cols-[55fr_45fr]">
        {/* Editorial image — full-bleed, object-cover, sharp corners.
            Left ~55% on desktop. Hidden on mobile; the compact banner
            inside <main> replaces it there. */}
        <aside className="relative hidden min-h-dvh md:block">
          <img
            src={authEditorial.src}
            alt="Editorial fashion campaign"
            loading="eager"
            width={1104}
            height={1600}
            className="absolute inset-0 h-full w-full object-cover"
          />
          {/* Subtle tonal overlay to keep the image editorial, not busy */}
          <div className="absolute inset-0 bg-[#1a1714]/5" />
        </aside>

        {/* Content area — right ~45% on desktop, full-width on mobile.
            Vertically centers children within a ~420px constrained column. */}
        <main className="flex min-h-dvh flex-col">
          {/* Mobile-only compact editorial banner */}
          <div className="relative h-40 w-full overflow-hidden md:hidden">
            <img
              src={authEditorial.src}
              alt=""
              aria-hidden="true"
              loading="lazy"
              width={1104}
              height={1600}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-[#1a1714]/10" />
          </div>

          <div className="flex flex-1 items-center justify-center px-6 py-16 sm:px-10 md:px-16">
            <div className="w-full max-w-[420px]">{children}</div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default AuthLayout;
