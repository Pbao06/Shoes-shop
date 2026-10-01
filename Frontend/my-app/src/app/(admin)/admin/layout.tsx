'use client';

/**
 * Admin dashboard layout — passthrough.
 *
 * The full admin chrome (sidebar, header, toast provider) is already
 * provided by the parent (admin)/layout.tsx, which imports AdminLayout
 * and wraps ALL admin routes.  This layout previously *also* rendered
 * AdminLayout, causing the chrome to be nested inside itself (double
 * sidebar, double header, double ToastProvider).  By passing children
 * through unchanged we preserve the shared layout without duplication.
 */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
