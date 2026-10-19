import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { BRAND } from "@/lib/products";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import logo from "@/assets/logo.png";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: `Sign in — ${BRAND}` },
      {
        name: "description",
        content: `Owner sign-in for the ${BRAND} order dashboard. Not open to shoppers.`,
      },
      { property: "og:title", content: `Sign in — ${BRAND}` },
      {
        property: "og:description",
        content: `Owner sign-in for the ${BRAND} order dashboard.`,
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Already signed in? Go straight to the dashboard.
  useEffect(() => {
    let alive = true;
    void supabase.auth.getSession().then(({ data }) => {
      if (alive && data.session) void router.navigate({ to: "/admin/orders", replace: true });
    });
    return () => {
      alive = false;
    };
  }, [router]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const email = String(form.get("email") ?? "").trim();
    const password = String(form.get("password") ?? "");
    setBusy(true);
    setError(null);
    setNotice(null);

    if (mode === "signup") {
      const { data, error: err } = await supabase.auth.signUp({ email, password });
      setBusy(false);
      if (err) {
        setError("Could not create the account. Try a different email.");
        return;
      }
      if (data.session) {
        await router.navigate({ to: "/admin/orders", replace: true });
        return;
      }
      setNotice(
        "Account created. Open the confirmation email we just sent, click the link, then sign in below.",
      );
      setMode("signin");
      return;
    }

    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (err) {
      setError("Email or password is not correct.");
      return;
    }
    await router.navigate({ to: "/admin/orders", replace: true });
  }

  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      <aside className="relative hidden flex-col justify-between bg-navy px-10 py-12 lg:flex">
        <div className="flex items-center gap-3">
          <img src={logo} alt="" width={320} height={320} className="size-12 rounded-full object-contain" />
          <span className="font-display text-2xl text-navy-foreground">{BRAND}</span>
        </div>
        <div className="max-w-md">
          <p className="eyebrow text-gold">Owner access only</p>
          <h1 className="mt-3 font-display text-4xl leading-tight text-navy-foreground">
            Every order, in one place.
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-navy-foreground/70">
            New orders, customer details, delivery addresses and payment status — visible only to
            accounts you have marked as owners. Shoppers never see this page.
          </p>
        </div>
        <p className="text-xs text-navy-foreground/50">
          Keep this address private. Share it with nobody outside the store.
        </p>
      </aside>

      <main className="flex items-center justify-center px-5 py-12">
        <div className="w-full max-w-sm">
          <div className="flex items-center gap-3 lg:hidden">
            <img src={logo} alt="" width={320} height={320} className="size-10 rounded-full object-contain" />
            <span className="font-display text-xl text-ink">{BRAND}</span>
          </div>

          <h2 className="mt-8 font-display text-3xl text-ink lg:mt-0">
            {mode === "signin" ? "Sign in" : "Create your account"}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {mode === "signin"
              ? "Use the email and password you set for the store owner."
              : "This becomes the owner account. Choose an email you control."}
          </p>

          <form onSubmit={onSubmit} className="mt-7 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="you@store.com"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete={mode === "signin" ? "current-password" : "new-password"}
                required
                minLength={6}
                placeholder="At least 6 characters"
              />
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}
            {notice && <p className="text-sm text-ink">{notice}</p>}

            <Button
              type="submit"
              disabled={busy}
              className="w-full bg-navy text-navy-foreground hover:bg-gold hover:text-navy"
            >
              {busy
                ? "Please wait…"
                : mode === "signin"
                  ? "Sign in to the dashboard"
                  : "Create owner account"}
            </Button>
          </form>

          <button
            type="button"
            onClick={() => {
              setMode(mode === "signin" ? "signup" : "signin");
              setError(null);
              setNotice(null);
            }}
            className="mt-5 text-sm text-muted-foreground underline-offset-4 hover:underline"
          >
            {mode === "signin" ? "No account yet? Create one" : "Already have an account? Sign in"}
          </button>

          <p className="mt-8 text-xs leading-relaxed text-muted-foreground">
            If this is the first account created, it can claim owner access on the next screen.
            After that, only an existing owner can add more people.
          </p>
        </div>
      </main>
    </div>
  );
}
