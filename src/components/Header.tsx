import { useEffect, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Menu, Search, User, Heart, ShoppingBag, X, Home, LayoutGrid } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { BRAND, formatINR, products } from "@/lib/products";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const nav = [
  { label: "Shop", to: "/shop" as const },
  { label: "Collections", to: "/collections" as const },
  { label: "About", to: "/about" as const },
  { label: "Contact", to: "/contact" as const },
];

export function Header() {
  const { count, setCartOpen, wishlist } = useStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const results = query.trim()
    ? products.filter((p) => (p.name + p.stoneType + p.category).toLowerCase().includes(query.toLowerCase()))
    : products.slice(0, 3);

  return (
    <>
      <div className="bg-ink py-2 text-center text-[11px] tracking-[0.18em] text-background uppercase">
        Complimentary shipping on orders above ₹2,500
      </div>

      <header
        className={cn(
          "sticky top-0 z-50 border-b transition-all duration-300",
          scrolled
            ? "border-border bg-background/85 backdrop-blur-xl"
            : "border-transparent bg-background",
        )}
      >
        <div className="shell grid h-16 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 md:h-20">
          <div className="flex items-center gap-1">
            <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
              <SheetTrigger
                aria-label="Open menu"
                className="grid size-9 shrink-0 place-items-center text-ink lg:hidden"
              >
                <Menu className="size-5" />
              </SheetTrigger>
              <SheetContent side="left" className="w-[85vw] max-w-sm p-0">
                <div className="flex items-center justify-between border-b border-border px-5 py-4">
                  <span className="font-display text-xl tracking-[0.16em] text-ink">{BRAND}</span>
                  <button aria-label="Close menu" onClick={() => setMenuOpen(false)}>
                    <X className="size-5" />
                  </button>
                </div>
                <nav className="flex flex-col px-5 py-4">
                  {nav.map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={() => setMenuOpen(false)}
                      className="border-b border-border/70 py-4 font-display text-2xl text-ink"
                    >
                      {item.label}
                    </Link>
                  ))}
                  <Link
                    to="/faq"
                    onClick={() => setMenuOpen(false)}
                    className="py-4 font-display text-2xl text-ink"
                  >
                    FAQ
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>

            <nav className="hidden items-center gap-7 lg:flex">
              {nav.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="text-xs tracking-[0.16em] text-ink/75 uppercase transition-colors hover:text-ink"
                  activeProps={{ className: "text-ink" }}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <Link
            to="/"
            className="justify-self-center font-display text-2xl tracking-[0.22em] text-ink md:text-3xl"
          >
            {BRAND}
          </Link>

          <div className="flex items-center gap-0.5 justify-self-end">
            <button
              aria-label="Search"
              onClick={() => setSearchOpen(true)}
              className="grid size-9 place-items-center text-ink"
            >
              <Search className="size-[18px]" />
            </button>
            <Link
              to="/contact"
              aria-label="Account"
              className="hidden size-9 place-items-center text-ink sm:grid"
            >
              <User className="size-[18px]" />
            </Link>
            <Link
              to="/shop"
              search={{ wishlist: true }}
              aria-label="Wishlist"
              className="relative hidden size-9 place-items-center text-ink sm:grid"
            >
              <Heart className="size-[18px]" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-0.5 size-1.5 rounded-full bg-primary" />
              )}
            </Link>
            <button
              aria-label="Open cart"
              onClick={() => setCartOpen(true)}
              className="relative grid size-9 place-items-center text-ink"
            >
              <ShoppingBag className="size-[18px]" />
              {count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 grid min-w-4 place-items-center rounded-full bg-primary px-1 text-[10px] leading-4 text-primary-foreground">
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
        <DialogContent className="top-24 max-w-xl translate-y-0 p-0">
          <DialogTitle className="sr-only">Search products</DialogTitle>
          <div className="border-b border-border p-3">
            <Input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search jewellery, stones, collections"
              className="border-0 shadow-none focus-visible:ring-0"
            />
          </div>
          <ul className="max-h-80 overflow-y-auto p-2">
            {results.length === 0 && (
              <li className="p-4 text-sm text-muted-foreground">No pieces match that search.</li>
            )}
            {results.map((p) => (
              <li key={p.id}>
                <button
                  className="flex w-full items-center gap-3 rounded-lg p-2 text-left hover:bg-sand"
                  onClick={() => {
                    setSearchOpen(false);
                    setQuery("");
                    navigate({ to: "/product/$slug", params: { slug: p.slug } });
                  }}
                >
                  <img src={p.images[0]} alt="" loading="lazy" className="size-12 rounded-md object-cover" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm text-ink">{p.name}</span>
                    <span className="block text-xs text-muted-foreground">{formatINR(p.price)}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </DialogContent>
      </Dialog>

      <MobileNav />
    </>
  );
}

function MobileNav() {
  const { count, setCartOpen } = useStore();
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-4 border-t border-border bg-background/95 backdrop-blur-xl md:hidden">
      <Link to="/" className="flex flex-col items-center gap-1 py-2.5 text-[10px] tracking-[0.1em] text-ink uppercase">
        <Home className="size-[18px]" /> Home
      </Link>
      <Link to="/shop" className="flex flex-col items-center gap-1 py-2.5 text-[10px] tracking-[0.1em] text-ink uppercase">
        <LayoutGrid className="size-[18px]" /> Shop
      </Link>
      <Link
        to="/shop"
        search={{ wishlist: true }}
        className="flex flex-col items-center gap-1 py-2.5 text-[10px] tracking-[0.1em] text-ink uppercase"
      >
        <Heart className="size-[18px]" /> Saved
      </Link>
      <button
        onClick={() => setCartOpen(true)}
        className="relative flex flex-col items-center gap-1 py-2.5 text-[10px] tracking-[0.1em] text-ink uppercase"
      >
        <ShoppingBag className="size-[18px]" /> Cart
        {count > 0 && (
          <span className="absolute top-1.5 right-[22%] grid min-w-4 place-items-center rounded-full bg-primary px-1 text-[10px] leading-4 text-primary-foreground">
            {count}
          </span>
        )}
      </button>
    </nav>
  );
}
