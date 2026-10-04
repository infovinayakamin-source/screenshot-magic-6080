import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { BRAND, formatINR } from "@/lib/products";
import {
  claimAdminAccess,
  getAdminAccess,
  getOrderSummary,
  listOrders,
  updateOrder,
  type AdminOrder,
  type OrderStatus,
} from "@/lib/admin.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import logo from "@/assets/logo.jpg";

const STATUS_LABEL: Record<string, string> = {
  created: "Awaiting payment",
  paid: "Paid",
  cod: "Cash on delivery",
  shipped: "Shipped",
  cancelled: "Cancelled",
  refunded: "Refunded",
};

const STATUS_CLASS: Record<string, string> = {
  created: "border border-border bg-sand text-ink",
  paid: "border border-navy bg-navy text-gold",
  cod: "border border-champagne text-ink",
  shipped: "border border-gold bg-gold text-navy-foreground",
  cancelled: "border border-border text-muted-foreground",
  refunded: "border border-border text-muted-foreground",
};

const FILTERS: Array<{ value: "all" | OrderStatus; label: string }> = [
  { value: "all", label: "All orders" },
  { value: "created", label: "Awaiting payment" },
  { value: "paid", label: "Paid" },
  { value: "cod", label: "Cash on delivery" },
  { value: "shipped", label: "Shipped" },
  { value: "cancelled", label: "Cancelled" },
  { value: "refunded", label: "Refunded" },
];

const ALL_STATUSES: OrderStatus[] = ["created", "paid", "cod", "shipped", "cancelled", "refunded"];

export const Route = createFileRoute("/_authenticated/admin/orders")({
  head: () => ({
    meta: [
      { title: `Orders — ${BRAND}` },
      {
        name: "description",
        content: `Private order dashboard for the ${BRAND} team. Owners only.`,
      },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminOrders,
});

function AdminOrders() {
  const fetchAccess = useServerFn(getAdminAccess);
  const access = useQuery({
    queryKey: ["admin-access"],
    queryFn: () => fetchAccess(),
    retry: false,
  });

  if (access.isPending) {
    return (
      <PageShell>
        <LoadingList />
      </PageShell>
    );
  }

  if (access.isError) {
    return (
      <PageShell>
        <Panel
          eyebrow="Problem"
          title="Could not check your access"
          body="Refresh this page, or sign out and sign in again."
        />
      </PageShell>
    );
  }

  if (!access.data.isAdmin) {
    return access.data.adminExists ? (
      <PageShell>
        <NoAccess />
      </PageShell>
    ) : (
      <PageShell>
        <ClaimGate />
      </PageShell>
    );
  }

  return <Dashboard />;
}

/* ---------------------------------------------------------------- layout -- */

function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh bg-background">
      <header className="bg-navy">
        <div className="shell flex items-center justify-between gap-3 py-3">
          <div className="flex min-w-0 items-center gap-2.5">
            <img
              src={logo}
              alt=""
              width={320}
              height={320}
              className="size-8 shrink-0 rounded-full object-contain"
            />
            <span className="truncate font-display text-lg text-navy-foreground">{BRAND}</span>
            <span className="hidden text-[11px] uppercase tracking-[0.18em] text-gold sm:inline">
              Orders
            </span>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Link
              to="/"
              className="text-xs text-navy-foreground/70 underline-offset-4 hover:text-gold hover:underline"
            >
              Store
            </Link>
            <SignOutButton />
          </div>
        </div>
      </header>
      <main className="shell py-6">{children}</main>
    </div>
  );
}

function SignOutButton({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [busy, setBusy] = useState(false);

  async function signOut() {
    setBusy(true);
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    void router.navigate({ to: "/auth", replace: true });
  }

  return (
    <button
      type="button"
      onClick={signOut}
      disabled={busy}
      className={
        tone === "dark"
          ? "rounded-full border border-gold/40 px-3 py-1 text-xs text-gold hover:bg-gold hover:text-navy disabled:opacity-60"
          : "rounded-full border border-border px-3 py-1 text-xs text-ink hover:bg-sand disabled:opacity-60"
      }
    >
      {busy ? "Signing out…" : "Sign out"}
    </button>
  );
}

function Panel({
  eyebrow,
  title,
  body,
  children,
}: {
  eyebrow: string;
  title: string;
  body: string;
  children?: ReactNode;
}) {
  return (
    <section className="mx-auto max-w-md rounded-lg border border-border bg-card p-6">
      <p className="eyebrow text-gold">{eyebrow}</p>
      <h2 className="mt-2 font-display text-2xl text-ink">{title}</h2>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{body}</p>
      {children && <div className="mt-5 flex flex-wrap items-center gap-2">{children}</div>}
    </section>
  );
}

function LoadingList() {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-24 animate-pulse rounded-lg border border-border bg-sand/60" />
        ))}
      </div>
      <div className="h-10 animate-pulse rounded-lg border border-border bg-sand/60" />
      <div className="h-64 animate-pulse rounded-lg border border-border bg-sand/60" />
    </div>
  );
}

/* ------------------------------------------------------------- no access -- */

function NoAccess() {
  return (
    <Panel
      eyebrow="Restricted"
      title="This account can't open orders"
      body="Only store owners can see customer details and delivery lists. Ask an owner to add your account, or sign in with the owner account."
    >
      <Button
        asChild
        variant="outline"
        size="sm"
        className="rounded-full border-border text-ink hover:bg-sand"
      >
        <Link to="/">Back to store</Link>
      </Button>
      <SignOutButton tone="light" />
    </Panel>
  );
}

function ClaimGate() {
  const claim = useServerFn(claimAdminAccess);
  const queryClient = useQueryClient();
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void supabase.auth.getSession().then(({ data }) => {
      const address = data.session?.user.email;
      if (address) setEmail(address);
    });
  }, []);

  async function onClaim() {
    setBusy(true);
    setError(null);
    try {
      const { claimed } = await claim();
      if (claimed) await queryClient.invalidateQueries({ queryKey: ["admin-access"] });
      else setError("Owner access has already been claimed by another account.");
    } catch {
      setError("Could not grant access. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Panel
      eyebrow="First account"
      title="Claim owner access"
      body={
        email
          ? `You are signed in as ${email}. Nobody holds owner access yet, so this account can take it. This can only be done once.`
          : "Nobody holds owner access yet, so this account can take it. This can only be done once."
      }
    >
      <Button
        onClick={onClaim}
        disabled={busy}
        className="rounded-full bg-navy text-navy-foreground hover:bg-gold hover:text-navy"
      >
        {busy ? "Please wait…" : "Claim owner access"}
      </Button>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </Panel>
  );
}

/* ------------------------------------------------------------- dashboard -- */

function Dashboard() {
  const queryClient = useQueryClient();
  const fetchOrders = useServerFn(listOrders);
  const fetchSummary = useServerFn(getOrderSummary);
  const saveOrder = useServerFn(updateOrder);

  const [status, setStatus] = useState<"all" | OrderStatus>("all");
  const [term, setTerm] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  const ordersQuery = useQuery({
    queryKey: ["orders", status],
    queryFn: () => fetchOrders({ data: { status, limit: 300 } }),
    retry: false,
  });

  const summaryQuery = useQuery({
    queryKey: ["order-summary"],
    queryFn: () => fetchSummary(),
    retry: false,
  });

  const rows = useMemo(() => {
    const all = ordersQuery.data?.orders ?? [];
    const q = term.trim().toLowerCase();
    if (!q) return all;
    return all.filter((o) =>
      [
        `${o.customer.first ?? ""} ${o.customer.last ?? ""}`,
        o.customer.email,
        o.customer.phone,
        o.customer.address,
        o.customer.city,
        o.customer.state,
        o.customer.pin,
        o.razorpay_payment_id,
        o.razorpay_order_id,
        o.id,
        o.notes,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(q),
    );
  }, [ordersQuery.data, term]);

  const mutation = useMutation({
    mutationFn: (input: { id: string; status?: OrderStatus; notes?: string | null }) =>
      saveOrder({ data: input }),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["orders"] }),
        queryClient.invalidateQueries({ queryKey: ["order-summary"] }),
      ]);
    },
  });

  const summary = summaryQuery.data;

  return (
    <div className="space-y-6">
      <div>
        <p className="eyebrow text-gold">Owner dashboard</p>
        <h1 className="mt-1 font-display text-3xl text-ink">Orders</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Everything here is private to owners. Customers never see this page.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Total orders" value={summary ? String(summary.total) : "—"} />
        <Stat
          label="Paid revenue"
          value={summary ? formatINR(summary.paidRevenue / 100) : "—"}
          hint={summary ? `${summary.paidCount} paid` : undefined}
        />
        <Stat
          label="To collect (COD)"
          value={summary ? formatINR(summary.codValue / 100) : "—"}
          hint={summary ? `${summary.codCount} orders` : undefined}
        />
        <Stat
          label="Awaiting payment"
          value={summary ? String(summary.awaitingCount) : "—"}
          hint={summary ? `${summary.shippedCount} shipped` : undefined}
        />
      </div>

      <div className="flex flex-col gap-3 rounded-lg border border-border bg-card p-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-1.5">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => setStatus(f.value)}
              className={
                status === f.value
                  ? "rounded-full bg-navy px-3 py-1 text-xs text-gold"
                  : "rounded-full border border-border px-3 py-1 text-xs text-muted-foreground hover:bg-sand hover:text-ink"
              }
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <Input
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="Search name, phone, city…"
            className="h-9 w-full sm:w-56"
            aria-label="Search orders"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => exportCsv(rows)}
            disabled={rows.length === 0}
            className="shrink-0 rounded-full border-border text-ink hover:bg-sand"
          >
            Download CSV
          </Button>
        </div>
      </div>

      {ordersQuery.isPending && <LoadingList />}

      {ordersQuery.isError && (
        <Panel
          eyebrow="Problem"
          title="Could not load orders"
          body="Please refresh the page. If it keeps happening, sign out and sign in again."
        />
      )}

      {ordersQuery.data && rows.length === 0 && (
        <div className="rounded-lg border border-dashed border-border bg-card px-5 py-12 text-center">
          <p className="font-display text-xl text-ink">
            {ordersQuery.data.orders.length === 0 ? "No orders yet" : "Nothing matches that search"}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            {ordersQuery.data.orders.length === 0
              ? "New orders from the store appear here automatically."
              : "Try a different name, phone number or city."}
          </p>
        </div>
      )}

      {rows.length > 0 && (
        <ul className="divide-y divide-border overflow-hidden rounded-lg border border-border bg-card">
          {rows.map((o) => (
            <OrderItem
              key={o.id}
              order={o}
              open={openId === o.id}
              onToggle={() => setOpenId(openId === o.id ? null : o.id)}
              busy={mutation.isPending}
              onStatus={(s) => {
                void mutation.mutate({ id: o.id, status: s });
              }}
              onNote={(n) => {
                void mutation.mutate({ id: o.id, notes: n });
              }}
            />
          ))}
        </ul>
      )}

      {mutation.isError && (
        <p className="text-sm text-destructive">
          Could not save that change. Please try again.
        </p>
      )}

      <p className="text-xs text-muted-foreground">
        Showing the newest {ordersQuery.data?.orders.length ?? 0} orders
        {status !== "all" ? " with this status" : ""}. Totals above cover every order ever placed.
      </p>
    </div>
  );
}

function Stat({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string | undefined;
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">{label}</p>
      <p className="mt-1.5 font-display text-2xl text-ink">{value}</p>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

function OrderItem({
  order,
  open,
  onToggle,
  busy,
  onStatus,
  onNote,
}: {
  order: AdminOrder;
  open: boolean;
  onToggle: () => void;
  busy: boolean;
  onStatus: (s: OrderStatus) => void;
  onNote: (n: string) => void;
}) {
  const name = `${order.customer.first ?? ""} ${order.customer.last ?? ""}`.trim() || "Guest";
  const qty = order.items.reduce((s, i) => s + (Number(i.qty) || 0), 0);

  return (
    <li>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-start justify-between gap-3 px-4 py-3 text-left hover:bg-sand/60"
      >
        <span className="min-w-0">
          <span className="block truncate font-medium text-ink">{name}</span>
          <span className="mt-0.5 block truncate text-xs text-muted-foreground">
            {new Date(order.created_at).toLocaleString("en-IN", {
              dateStyle: "medium",
              timeStyle: "short",
            })}
            {" · "}
            {qty} {qty === 1 ? "piece" : "pieces"}
            {" · "}
            {order.customer.city ?? "no city"}
          </span>
        </span>
        <span className="flex shrink-0 flex-col items-end gap-1.5">
          <span className="text-sm text-ink">{formatINR(order.amount / 100)}</span>
          <span
            className={`rounded-full px-2.5 py-0.5 text-[11px] ${STATUS_CLASS[order.status] ?? STATUS_CLASS["created"]}`}
          >
            {STATUS_LABEL[order.status] ?? order.status}
          </span>
        </span>
      </button>

      {open && <OrderDetail order={order} busy={busy} onStatus={onStatus} onNote={onNote} />}
    </li>
  );
}

function OrderDetail({
  order,
  busy,
  onStatus,
  onNote,
}: {
  order: AdminOrder;
  busy: boolean;
  onStatus: (s: OrderStatus) => void;
  onNote: (n: string) => void;
}) {
  const [note, setNote] = useState(order.notes ?? "");
  const [copied, setCopied] = useState(false);
  const [chosen, setChosen] = useState<OrderStatus>(
    (ALL_STATUSES as string[]).includes(order.status) ? (order.status as OrderStatus) : "created",
  );

  const address = [
    order.customer.address,
    order.customer.city,
    order.customer.state,
    order.customer.pin,
  ]
    .filter(Boolean)
    .join(", ");

  function copyAddress() {
    const text = [
      `${order.customer.first ?? ""} ${order.customer.last ?? ""}`.trim(),
      order.customer.phone,
      order.customer.address,
      order.customer.city,
      order.customer.state,
      order.customer.pin,
    ]
      .filter(Boolean)
      .join("\n");
    void navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  }

  return (
    <div className="border-t border-border bg-sand/40 px-4 py-4">
      <div className="grid gap-5 lg:grid-cols-2">
        <div className="space-y-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Deliver to</p>
            <p className="mt-1 text-sm text-ink">
              {`${order.customer.first ?? ""} ${order.customer.last ?? ""}`.trim() || "Guest"}
            </p>
            {order.customer.phone && (
              <a
                href={`tel:${order.customer.phone}`}
                className="mt-0.5 block text-sm text-navy underline-offset-4 hover:underline"
              >
                {order.customer.phone}
              </a>
            )}
            {order.customer.email && (
              <a
                href={`mailto:${order.customer.email}`}
                className="mt-0.5 block break-all text-sm text-navy underline-offset-4 hover:underline"
              >
                {order.customer.email}
              </a>
            )}
            {address && <p className="mt-1 text-sm leading-relaxed text-ink">{address}</p>}
            <button
              type="button"
              onClick={copyAddress}
              className="mt-2 rounded-full border border-border px-3 py-1 text-xs text-ink hover:bg-sand"
            >
              {copied ? "Copied" : "Copy for shipping label"}
            </button>
          </div>

          <div>
            <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Items</p>
            <ul className="mt-1 space-y-1">
              {order.items.map((i, idx) => (
                <li key={`${i.id}-${idx}`} className="flex justify-between gap-3 text-sm text-ink">
                  <span className="min-w-0 truncate">
                    {i.name}
                    <span className="text-muted-foreground"> × {i.qty}</span>
                  </span>
                  <span className="shrink-0">{formatINR(i.price * i.qty)}</span>
                </li>
              ))}
              {order.items.length === 0 && (
                <li className="text-sm text-muted-foreground">No items recorded.</li>
              )}
            </ul>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Status</p>
            <div className="mt-1.5 flex flex-wrap items-center gap-2">
              <select
                value={chosen}
                onChange={(e) => setChosen(e.target.value as OrderStatus)}
                className="h-9 rounded-md border border-border bg-background px-2 text-sm text-ink"
                aria-label="Order status"
              >
                {ALL_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {STATUS_LABEL[s] ?? s}
                  </option>
                ))}
              </select>
              <Button
                type="button"
                size="sm"
                disabled={busy || chosen === order.status}
                onClick={() => onStatus(chosen)}
                className="rounded-full bg-navy text-navy-foreground hover:bg-gold hover:text-navy"
              >
                Update
              </Button>
            </div>
          </div>

          <div>
            <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
              Store note (only you see this)
            </p>
            <Textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              placeholder="Packed on Monday, courier picked up…"
              className="mt-1.5 bg-background"
            />
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={busy || note === (order.notes ?? "")}
              onClick={() => onNote(note)}
              className="mt-2 rounded-full border-border text-ink hover:bg-sand"
            >
              Save note
            </Button>
          </div>

          <div className="rounded-md border border-border bg-background p-3 text-xs text-muted-foreground">
            <p className="break-all">
              <span className="text-ink">Payment ID:</span>{" "}
              {order.razorpay_payment_id ?? "— not paid online yet"}
            </p>
            <p className="mt-1 break-all">
              <span className="text-ink">Razorpay order:</span> {order.razorpay_order_id ?? "—"}
            </p>
            <p className="mt-1">
              <span className="text-ink">Placed:</span>{" "}
              {new Date(order.created_at).toLocaleString("en-IN", {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </p>
            {order.paid_at && (
              <p className="mt-1">
                <span className="text-ink">Paid:</span>{" "}
                {new Date(order.paid_at).toLocaleString("en-IN", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------- csv export -- */

function csvCell(value: string | number | null | undefined) {
  return `"${String(value ?? "").replace(/"/g, '""')}"`;
}

function exportCsv(rows: AdminOrder[]) {
  const header = [
    "Date",
    "Status",
    "Name",
    "Phone",
    "Email",
    "Address",
    "City",
    "State",
    "PIN",
    "Items",
    "Total INR",
    "Payment ID",
    "Razorpay order ID",
    "Store note",
  ];
  const lines = rows.map((o) =>
    [
      new Date(o.created_at).toISOString(),
      STATUS_LABEL[o.status] ?? o.status,
      `${o.customer.first ?? ""} ${o.customer.last ?? ""}`.trim(),
      o.customer.phone ?? "",
      o.customer.email ?? "",
      o.customer.address ?? "",
      o.customer.city ?? "",
      o.customer.state ?? "",
      o.customer.pin ?? "",
      o.items.map((i) => `${i.name} x${i.qty}`).join("; "),
      o.amount / 100,
      o.razorpay_payment_id ?? "",
      o.razorpay_order_id ?? "",
      o.notes ?? "",
    ]
      .map(csvCell)
      .join(","),
  );
  const csv = [header.map(csvCell).join(","), ...lines].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `orders-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
