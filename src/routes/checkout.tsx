import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Lock, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FREE_SHIPPING_THRESHOLD, formatINR } from "@/lib/products";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout | Aarohi" },
      { name: "description", content: "Secure checkout for your Aarohi natural stone jewellery order." },
      { property: "og:title", content: "Checkout | Aarohi" },
      { property: "og:description", content: "Complete your Aarohi order." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Checkout,
});

function Checkout() {
  const { items, subtotal, clear } = useStore();
  const [placed, setPlaced] = useState(false);
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : 99;

  if (placed) {
    return (
      <section className="shell py-24 text-center">
        <Check className="mx-auto size-8 text-primary" />
        <h1 className="mt-6 text-4xl text-ink md:text-5xl">Thank you</h1>
        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
          Your order has been recorded in this demo store. Connect a payment provider to accept real
          orders and send confirmation emails.
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
              clear();
              setPlaced(true);
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
              <RadioGroup defaultValue="card" className="flex flex-col gap-3">
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
                <Lock className="size-3.5" /> No payment is taken in this demo store.
              </p>
            </fieldset>

            <Button type="submit" variant="ink" size="xl" className="self-start">
              Place order
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
      <Input id={id} type={type} required placeholder={placeholder} className="h-11" />
    </div>
  );
}
