import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const lineSchema = z.object({ id: z.string().min(1).max(100), qty: z.number().int().min(1).max(50) });
const customerSchema = z.object({
  email: z.string().email().max(255),
  phone: z.string().min(6).max(20),
  first: z.string().min(1).max(100),
  last: z.string().min(1).max(100),
  address: z.string().min(1).max(500),
  city: z.string().min(1).max(100),
  state: z.string().min(1).max(100),
  pin: z.string().min(4).max(10),
});
const orderInput = z.object({ lines: z.array(lineSchema).min(1).max(50), customer: customerSchema });

async function priceCart(lines: z.infer<typeof lineSchema>[]) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const ids = lines.map((l) => l.id);
  if (ids.some((id) => !/^[0-9a-f-]{36}$/i.test(id))) throw new Error("Your cart has an old item. Please remove it and add it again.");
  const { data, error } = await supabaseAdmin.from("products").select("id, name, price, stock, status").in("id", ids);
  if (error) throw new Error("Could not check prices");
  const items = lines.map((l) => {
    const p = data?.find((x) => x.id === l.id);
    if (!p || p.status !== "active") throw new Error("A product in your cart is no longer available");
    if (p.stock < l.qty) throw new Error(p.stock === 0 ? `${p.name} is out of stock` : `Only a few of ${p.name} left — please reduce the quantity`);
    return { id: p.id, name: p.name, price: p.price, qty: l.qty };
  });
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping = 0;
  return { items, total: subtotal + shipping };
}

export const createRazorpayOrder = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => orderInput.parse(d))
  .handler(async ({ data }) => {
    const keyId = process.env["RAZORPAY_KEY_ID"];
    const keySecret = process.env["RAZORPAY_KEY_SECRET"];
    if (!keyId || !keySecret) throw new Error("Payments are not configured");
    const { items, total } = await priceCart(data.lines);
    const amount = total * 100;

    const res = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${btoa(`${keyId}:${keySecret}`)}`,
      },
      body: JSON.stringify({ amount, currency: "INR", receipt: `rcpt_${Date.now()}` }),
    });
    if (!res.ok) {
      console.error("Razorpay order failed", res.status, await res.text());
      throw new Error("Could not start payment. Please try again.");
    }
    const rzp = (await res.json()) as { id: string };

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("orders").insert({
      razorpay_order_id: rzp.id,
      amount,
      items,
      customer: data.customer,
      status: "created",
    });
    if (error) {
      console.error(error);
      throw new Error("Could not save order");
    }
    return { orderId: rzp.id, amount, keyId };
  });

export const verifyRazorpayPayment = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    z
      .object({
        razorpay_order_id: z.string().min(1).max(100),
        razorpay_payment_id: z.string().min(1).max(100),
        razorpay_signature: z.string().min(1).max(200),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    const keySecret = process.env["RAZORPAY_KEY_SECRET"];
    if (!keySecret) throw new Error("Payments are not configured");
    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey("raw", enc.encode(keySecret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
    const sig = await crypto.subtle.sign("HMAC", key, enc.encode(`${data.razorpay_order_id}|${data.razorpay_payment_id}`));
    const expected = Array.from(new Uint8Array(sig)).map((b) => b.toString(16).padStart(2, "0")).join("");
    if (expected !== data.razorpay_signature) return { ok: false as const };

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    // Only the first successful verification flips the order to paid and reduces stock.
    const { data: order } = await supabaseAdmin
      .from("orders")
      .update({ status: "paid", razorpay_payment_id: data.razorpay_payment_id, paid_at: new Date().toISOString() })
      .eq("razorpay_order_id", data.razorpay_order_id)
      .neq("status", "paid")
      .select("id, items")
      .maybeSingle();
    if (order) {
      const { error: stockErr } = await supabaseAdmin.rpc("consume_stock", { _items: order.items, _reason: `order ${order.id}` });
      if (stockErr) console.error("Stock update failed for paid order", order.id, stockErr);
    }
    return { ok: true as const, paymentId: data.razorpay_payment_id };
  });

export const placeCodOrder = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => orderInput.parse(d))
  .handler(async ({ data }) => {
    const { items, total } = await priceCart(data.lines);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error: stockErr } = await supabaseAdmin.rpc("consume_stock", { _items: items, _reason: "COD order" });
    if (stockErr) throw new Error("Sorry, some items just sold out. Please refresh your cart.");
    const { error } = await supabaseAdmin
      .from("orders")
      .insert({ amount: total * 100, items, customer: data.customer, status: "cod" });
    if (error) {
      console.error(error);
      throw new Error("Could not save order");
    }
    return { ok: true };
  });
