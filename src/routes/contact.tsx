import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Mail, MessageCircle, Clock } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Us — Styling & Order Support | Aarohi" },
      {
        name: "description",
        content:
          "Questions about sizing, stones, an order or gifting? Message the Aarohi team by email or WhatsApp and we reply within one business day.",
      },
      { property: "og:title", content: "Contact Us | Aarohi" },
      { property: "og:description", content: "Styling, sizing and order support from the Aarohi team." },
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
            Styling advice, sizing help or an order question — we reply within one business day.
          </p>
        </div>
      </section>

      <section className="shell grid gap-12 py-14 md:py-20 lg:grid-cols-[minmax(0,1fr)_320px]">
        <form
          className="flex flex-col gap-5"
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
            toast.success("Thanks — we'll be in touch shortly.");
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
              Your message has been noted in this demo store. Connect a mailbox to receive it for real.
            </p>
          )}
        </form>

        <aside className="flex flex-col gap-6 rounded-2xl bg-sand p-7">
          <div>
            <Mail className="size-5 text-primary" strokeWidth={1.4} />
            <p className="mt-3 text-xs tracking-[0.16em] text-ink uppercase">Email</p>
            <p className="mt-1 text-sm text-muted-foreground">care@aarohi.example</p>
          </div>
          <div>
            <MessageCircle className="size-5 text-primary" strokeWidth={1.4} />
            <p className="mt-3 text-xs tracking-[0.16em] text-ink uppercase">WhatsApp</p>
            <a
              href="https://wa.me/910000000000"
              target="_blank"
              rel="noreferrer"
              className="mt-1 inline-block text-sm text-muted-foreground underline underline-offset-4 hover:text-ink"
            >
              Start a chat
            </a>
          </div>
          <div>
            <Clock className="size-5 text-primary" strokeWidth={1.4} />
            <p className="mt-3 text-xs tracking-[0.16em] text-ink uppercase">Hours</p>
            <p className="mt-1 text-sm text-muted-foreground">Mon–Sat, 10am–7pm IST</p>
          </div>
        </aside>
      </section>
    </>
  );
}
