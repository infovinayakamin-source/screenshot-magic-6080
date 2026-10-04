import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { adminClient } from "./admin.server";

export const ORDER_STATUSES = ["created", "paid", "cod", "shipped", "cancelled", "refunded"] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export type OrderItem = { id: string; name: string; price: number; qty: number };

export type OrderCustomer = {
  first?: string;
  last?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  pin?: string;
};

export type AdminOrder = {
  id: string;
  status: string;
  amount: number;
  currency: string;
  items: OrderItem[];
  customer: OrderCustomer;
  notes: string | null;
  created_at: string;
  paid_at: string | null;
  razorpay_order_id: string | null;
  razorpay_payment_id: string | null;
};

export type OrderSummary = {
  total: number;
  paidCount: number;
  paidRevenue: number;
  codCount: number;
  codValue: number;
  awaitingCount: number;
  shippedCount: number;
  cancelledCount: number;
  units: number;
};

const orderSelect =
  "id, status, amount, currency, items, customer, notes, created_at, paid_at, razorpay_order_id, razorpay_payment_id";

type OrderRow = {
  id: string;
  status: string;
  amount: number;
  currency: string;
  items: unknown;
  customer: unknown;
  notes: string | null;
  created_at: string;
  paid_at: string | null;
  razorpay_order_id: string | null;
  razorpay_payment_id: string | null;
};

function toOrder(row: OrderRow): AdminOrder {
  return {
    id: row.id,
    status: row.status,
    amount: row.amount,
    currency: row.currency,
    items: Array.isArray(row.items) ? (row.items as OrderItem[]) : [],
    customer: row.customer && typeof row.customer === "object" ? (row.customer as OrderCustomer) : {},
    notes: row.notes,
    created_at: row.created_at,
    paid_at: row.paid_at,
    razorpay_order_id: row.razorpay_order_id,
    razorpay_payment_id: row.razorpay_payment_id,
  };
}

/** Is this account an admin, and does an owner account exist yet? */
export const getAdminAccess = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const [role, owners] = await Promise.all([
      supabaseAdmin.rpc("has_role", { _user_id: context.userId, _role: "admin" }),
      supabaseAdmin.from("user_roles").select("id").eq("role", "admin").limit(1),
    ]);
    if (role.error) {
      console.error(role.error);
      throw new Error("Could not verify access");
    }
    return { isAdmin: Boolean(role.data), adminExists: (owners.data?.length ?? 0) > 0 };
  });

/**
 * One-time bootstrap: the very first confirmed account can make itself owner.
 * Refuses as soon as any admin exists, so it can never be used twice.
 */
export const claimAdminAccess = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin.rpc("claim_admin", { _user_id: context.userId });
    if (error) {
      console.error(error);
      throw new Error("Could not grant access");
    }
    return { claimed: Boolean(data) };
  });

export const listOrders = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z
      .object({
        status: z
          .enum(["all", "created", "paid", "cod", "shipped", "cancelled", "refunded"])
          .default("all"),
        limit: z.number().int().min(1).max(500).default(300),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    const db = await adminClient(context.userId);
    let query = db
      .from("orders")
      .select(orderSelect)
      .order("created_at", { ascending: false })
      .limit(data.limit);
    if (data.status !== "all") query = query.eq("status", data.status);
    const { data: rows, error } = await query;
    if (error) {
      console.error(error);
      throw new Error("Could not load orders");
    }
    return { orders: (rows ?? []).map(toOrder) };
  });

/** All-time totals, calculated on the server from every order. */
export const getOrderSummary = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const db = await adminClient(context.userId);
    const { data, error } = await db.from("orders").select("status, amount, items");
    if (error) {
      console.error(error);
      throw new Error("Could not load totals");
    }
    const summary: OrderSummary = {
      total: 0,
      paidCount: 0,
      paidRevenue: 0,
      codCount: 0,
      codValue: 0,
      awaitingCount: 0,
      shippedCount: 0,
      cancelledCount: 0,
      units: 0,
    };
    for (const row of data ?? []) {
      summary.total += 1;
      const amount = Number(row.amount) || 0;
      const qty = Array.isArray(row.items)
        ? (row.items as OrderItem[]).reduce((s, i) => s + (Number(i.qty) || 0), 0)
        : 0;
      summary.units += qty;
      if (row.status === "paid") {
        summary.paidCount += 1;
        summary.paidRevenue += amount;
      } else if (row.status === "cod") {
        summary.codCount += 1;
        summary.codValue += amount;
      } else if (row.status === "created") {
        summary.awaitingCount += 1;
      } else if (row.status === "shipped") {
        summary.shippedCount += 1;
      } else if (row.status === "cancelled") {
        summary.cancelledCount += 1;
      }
    }
    return summary;
  });

export const updateOrder = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z
      .object({
        id: z.string().uuid(),
        status: z.enum(["created", "paid", "cod", "shipped", "cancelled", "refunded"]).optional(),
        notes: z.string().max(2000).nullable().optional(),
      })
      .refine((x) => x.status !== undefined || x.notes !== undefined, { message: "Nothing to update" })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    const db = await adminClient(context.userId);
    const patch: Record<string, unknown> = {};
    if (data.status) {
      patch.status = data.status;
      if (data.status === "paid") patch.paid_at = new Date().toISOString();
    }
    if (data.notes !== undefined) patch.notes = data.notes;
    const { error } = await db.from("orders").update(patch).eq("id", data.id);
    if (error) {
      console.error(error);
      throw new Error("Could not save changes");
    }
    return { ok: true };
  });
