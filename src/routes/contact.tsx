import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Us — Styling & Order Support | ShivAmrit Healers" },
      {
        name: "description",
        content:
          "Questions about sizing, stones, an order or gifting? Contact ShivAmrit Healers.",
      },
      { property: "og:title", content: "Contact Us | ShivAmrit Healers" },
      { property: "og:description", content: "Styling, sizing and order support from the ShivAmrit Healers team." },
    ],
  }),
  component: Contact,
});

function Contact() {
  const [sent, setSent] = useState(false);

  return (
    <>
      <section className="border-b border-border bg-sand/50">
        <div className="shell py-14 text-center md:py-20">
          <p className="eyebrow">We&apos;re here</p>
          <h1 className="mt-3 text-4xl text-ink md:text-6xl">Contact us</h1>
          <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-muted-foreground">
            Sizing help or an order question? Our contact details will be available here soon.
          </p>
        </div>
      </section>

      <section className="shell grid gap-12 py-14 md:py-20 lg:grid-cols-[minmax(0,1fr)_320px]">
        <form
          className="flex flex-col gap-5"
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
            toast("Message not sent — contact service is not connected yet.");
            (e.target as HTMLFormElement).reset();
          }}
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" required className="h-11" placeholder="Your name" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" required className="h-11" placeholder="you@email.com" />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="subject">Subject</Label>
            <Input id="subject" className="h-11" placeholder="Order, sizing, gifting…" />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="message">Message</Label>
            <Textarea id="message" required rows={6} placeholder="How can we help?" />
          </div>
          <Button type="submit" variant="ink" size="xl" className="self-start">
            Send message
          </Button>
          {sent && (
            <p className="text-sm text-muted-foreground">
               This form does not send messages yet.
            </p>
          )}
        </form>

        <aside className="border-t border-border pt-6 text-sm text-muted-foreground lg:border-t-0 lg:border-l lg:pl-7">
          Please share the store’s WhatsApp number or support email to enable direct enquiries.
        </aside>
      </section>
    </>
  );
}
