import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { FREE_SHIPPING_THRESHOLD, products } from "@/lib/products";

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

function priceCart(lines: z.infer<typeof lineSchema>[]) {
  const items = lines.map((l) => {
    const p = products.find((x) => x.id === l.id);
    if (!p) throw new Error("Unknown product in cart");
    return { id: p.id, name: p.name, price: p.price, qty: l.qty };
  });
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 99;
  return { items, total: subtotal + shipping };
}

export const createRazorpayOrder = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => orderInput.parse(d))
  .handler(async ({ data }) => {
    const keyId = process.env["RAZORPAY_KEY_ID"];
    const keySecret = process.env["RAZORPAY_KEY_SECRET"];
    if (!keyId || !keySecret) throw new Error("Payments are not configured");
    const { items, total } = priceCart(data.lines);
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
    await supabaseAdmin
      .from("orders")
      .update({ status: "paid", razorpay_payment_id: data.razorpay_payment_id, paid_at: new Date().toISOString() })
      .eq("razorpay_order_id", data.razorpay_order_id);
    return { ok: true as const, paymentId: data.razorpay_payment_id };
  });

export const placeCodOrder = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => orderInput.parse(d))
  .handler(async ({ data }) => {
    const { items, total } = priceCart(data.lines);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("orders")
      .insert({ amount: total * 100, items, customer: data.customer, status: "cod" });
    if (error) {
      console.error(error);
      throw new Error("Could not save order");
    }
    return { ok: true };
  });
