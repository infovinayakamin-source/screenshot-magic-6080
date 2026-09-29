import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Reveal } from "@/components/Reveal";

export function Newsletter() {
  const [email, setEmail] = useState("");

  return (
    <section className="shell py-20 md:py-24">
      <Reveal className="rounded-3xl bg-sand px-6 py-14 text-center md:px-16 md:py-20">
        <p className="eyebrow">Newsletter</p>
        <h2 className="mx-auto mt-4 max-w-2xl text-3xl text-ink md:text-5xl">
          Find your next favourite piece
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
          Join our community for new collection launches, styling inspiration and exclusive offers.
        </p>
        <form
          className="mx-auto mt-8 flex w-full max-w-md flex-col gap-3 sm:flex-row"
          onSubmit={(e) => {
            e.preventDefault();
            if (!email.trim()) return;
            setEmail("");
            toast.success("Welcome to the community.");
          }}
        >
          <Input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="h-12 rounded-md border-border bg-background"
          />
          <Button type="submit" variant="ink" size="xl" className="shrink-0">
            Join the community
          </Button>
        </form>
        <p className="mt-6 text-xs text-muted-foreground">
          Have a question?{" "}
          <a
            href="https://wa.me/910000000000"
            target="_blank"
            rel="noreferrer"
            className="text-ink underline underline-offset-4"
          >
            Chat with us on WhatsApp
          </a>
        </p>
      </Reveal>
    </section>
  );
}
