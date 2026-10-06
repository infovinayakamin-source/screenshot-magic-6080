import { Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { getAdminAccess } from "@/lib/admin.functions";
import { BRAND } from "@/lib/products";
import logo from "@/assets/logo.jpg";

export function AdminNav() {
  const cls = "rounded-full px-3 py-1 text-xs text-navy-foreground/80 hover:text-gold";
  const active = { className: "rounded-full bg-gold px-3 py-1 text-xs text-navy" };
  return (
    <nav className="flex flex-wrap items-center gap-1" aria-label="Admin sections">
      <Link to="/admin/orders" className={cls} activeProps={active}>Orders</Link>
      <Link to="/admin/bracelets" className={cls} activeProps={active}>Zodiac Bracelets</Link>
      <Link to="/admin/branding" className={cls} activeProps={active}>Image Branding</Link>
      <Link to="/" className={cls}>Store</Link>
    </nav>
  );
}

/** Header + admin-only gate. Server functions re-check the role on every call. */
export function AdminShell({ children }: { children: ReactNode }) {
  const fetchAccess = useServerFn(getAdminAccess);
  const access = useQuery({ queryKey: ["admin-access"], queryFn: () => fetchAccess(), retry: false });

  return (
    <div className="min-h-dvh bg-background">
      <header className="bg-navy">
        <div className="shell flex flex-wrap items-center justify-between gap-3 py-3">
          <div className="flex min-w-0 items-center gap-2.5">
            <img src={logo} alt="" width={320} height={320} className="size-8 shrink-0 rounded-full object-contain" />
            <span className="truncate font-display text-lg text-navy-foreground">{BRAND}</span>
          </div>
          <AdminNav />
        </div>
      </header>
      <main className="shell py-6">
        {access.isPending ? (
          <div className="h-40 animate-pulse rounded-lg border border-border bg-sand/60" />
        ) : access.data?.isAdmin ? (
          children
        ) : (
          <section className="mx-auto max-w-md rounded-lg border border-border bg-card p-6">
            <h2 className="font-display text-2xl text-ink">Owner access only</h2>
            <p className="mt-3 text-sm text-muted-foreground">
              This area is for the store owner. Open <Link to="/admin/orders" className="underline">Orders</Link> to claim or check access.
            </p>
          </section>
        )}
      </main>
    </div>
  );
}
