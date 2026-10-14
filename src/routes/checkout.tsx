import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Lock, Check } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { formatINR } from "@/lib/products";
import { useStore } from "@/lib/store";
import { createRazorpayOrder, placeCodOrder, verifyRazorpayPayment } from "@/lib/payments.functions";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Checkout | ShivAmrit Healers" },
      { name: "description", content: "Secure checkout for your ShivAmrit Healers natural stone jewellery order." },
      { property: "og:title", content: "Checkout | ShivAmrit Healers" },
      { property: "og:description", content: "Complete your ShivAmrit Healers order." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Checkout,
});

declare global {
  interface Window {
    Razorpay?: new (opts: Record<string, unknown>) => { open: () => void; on: (e: string, cb: () => void) => void };
  }
}

function loadRazorpay(): Promise<boolean> {
  if (window.Razorpay) return Promise.resolve(true);
  return new Promise((resolve) => {
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

function Checkout() {
  const { items, lines, subtotal, clear } = useStore();
  const [placed, setPlaced] = useState<null | { paymentId?: string }>(null);
  const [method, setMethod] = useState("card");
  const [busy, setBusy] = useState(false);
  const createOrder = useServerFn(createRazorpayOrder);
  const verify = useServerFn(verifyRazorpayPayment);
  const placeCod = useServerFn(placeCodOrder);
  const shipping = 0;

  async function handleSubmit(form: HTMLFormElement) {
    const fd = new FormData(form);
    const get = (k: string) => String(fd.get(k) ?? "").trim();
    const customer = {
      email: get("email"), phone: get("phone"), first: get("first"), last: get("last"),
      address: get("address"), city: get("city"), state: get("state"), pin: get("pin"),
    };
    setBusy(true);
    try {
      if (method === "cod") {
        await placeCod({ data: { lines, customer } });
        clear();
        setPlaced({});
        return;
      }
      if (!(await loadRazorpay()) || !window.Razorpay) throw new Error("Could not load payment window");
      const order = await createOrder({ data: { lines, customer } });
      const rzp = new window.Razorpay({
        key: order.keyId,
        amount: order.amount,
        currency: "INR",
        name: "ShivAmrit Healers",
        description: "Order payment",
        order_id: order.orderId,
        prefill: { name: `${customer.first} ${customer.last}`, email: customer.email, contact: customer.phone },
        theme: { color: "#1f2a44" },
        handler: async (resp: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
          const r = await verify({ data: resp });
          if (r.ok) {
            clear();
            setPlaced({ paymentId: r.paymentId });
          } else {
            toast.error("Payment could not be verified. Please contact us.");
          }
        },
        modal: { ondismiss: () => setBusy(false) },
      });
      rzp.on("payment.failed", () => toast.error("Payment failed. Please try again."));
      rzp.open();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      if (method === "cod") setBusy(false);
      else setTimeout(() => setBusy(false), 1500);
    }
  }

  if (placed) {
    return (
      <section className="shell py-24 text-center">
        <Check className="mx-auto size-8 text-primary" />
        <h1 className="mt-6 text-4xl text-ink md:text-5xl">Thank you</h1>
        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
          {placed.paymentId
            ? `Your payment was successful. Payment ID: ${placed.paymentId}`
            : "Your cash-on-delivery order has been placed. We'll contact you to confirm."}
        </p>
        <Button variant="ink" size="xl" className="mt-8" asChild>
          <Link to="/shop">Continue shopping</Link>
        </Button>
      </section>
    );
  }

  return (
    <section className="shell py-14 md:py-20">
      <h1 className="text-4xl text-ink md:text-6xl">Checkout</h1>

      {items.length === 0 ? (
        <div className="mt-10 rounded-2xl bg-sand p-12 text-center">
          <p className="text-sm text-muted-foreground">There is nothing to check out yet.</p>
          <Button variant="ink" size="xl" className="mt-6" asChild>
            <Link to="/shop">Shop collection</Link>
          </Button>
        </div>
      ) : (
        <div className="mt-10 grid gap-12 lg:grid-cols-[minmax(0,1fr)_340px]">
          <form
            className="flex flex-col gap-8"
            onSubmit={(e) => {
              e.preventDefault();
              void handleSubmit(e.currentTarget);
            }}
          >
            <fieldset className="flex flex-col gap-5">
              <legend className="eyebrow mb-4">Contact</legend>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field id="email" label="Email" type="email" placeholder="you@email.com" />
                <Field id="phone" label="Phone" placeholder="+91" />
              </div>
            </fieldset>

            <fieldset className="flex flex-col gap-5">
              <legend className="eyebrow mb-4">Shipping address</legend>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field id="first" label="First name" />
                <Field id="last" label="Last name" />
              </div>
              <Field id="address" label="Address" placeholder="House no, street, area" />
              <div className="grid gap-5 sm:grid-cols-3">
                <Field id="city" label="City" />
                <Field id="state" label="State" />
                <Field id="pin" label="PIN code" />
              </div>
            </fieldset>

            <fieldset>
              <legend className="eyebrow mb-4">Payment</legend>
              <RadioGroup value={method} onValueChange={setMethod} className="flex flex-col gap-3">
                {[
                  { value: "card", label: "Card / UPI / Netbanking" },
                  { value: "cod", label: "Cash on delivery" },
                ].map((o) => (
                  <label
                    key={o.value}
                    className="flex cursor-pointer items-center gap-3 rounded-xl border border-border p-4 text-sm text-ink"
                  >
                    <RadioGroupItem value={o.value} id={o.value} />
                    {o.label}
                  </label>
                ))}
              </RadioGroup>
              <p className="mt-3 inline-flex items-center gap-2 text-xs text-muted-foreground">
                <Lock className="size-3.5" /> Secure payments by Razorpay — UPI, cards, netbanking & wallets.
              </p>
            </fieldset>

            <Button type="submit" variant="ink" size="xl" className="self-start" disabled={busy}>
              {busy ? "Please wait…" : method === "cod" ? "Place order" : `Pay ${formatINR(subtotal + shipping)}`}
            </Button>
          </form>

          <aside className="h-fit rounded-2xl bg-sand p-7">
            <p className="eyebrow">Order summary</p>
            <ul className="mt-5 flex flex-col gap-4">
              {items.map(({ product, qty }) => (
                <li key={product.id} className="flex items-center gap-3">
                  <img src={product.images[0]} alt="" loading="lazy" className="size-14 rounded-lg object-cover" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm text-ink">{product.name}</span>
                    <span className="block text-xs text-muted-foreground">Qty {qty}</span>
                  </span>
                  <span className="text-sm text-ink">{formatINR(product.price * qty)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-5 border-t border-border pt-4 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="text-ink">{formatINR(subtotal)}</span>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span className="text-ink">{shipping === 0 ? "Free" : formatINR(shipping)}</span>
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
                <span className="text-muted-foreground">Total</span>
                <span className="text-lg text-ink">{formatINR(subtotal + shipping)}</span>
              </div>
            </div>
          </aside>
        </div>
      )}
    </section>
  );
}

function Field({
  id,
  label,
  type = "text",
  placeholder,
}: {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} name={id} type={type} required placeholder={placeholder} className="h-11" />
    </div>
  );
}
