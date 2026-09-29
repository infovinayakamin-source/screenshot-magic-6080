import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { products, type Product } from "@/lib/products";

export type CartLine = { id: string; qty: number };

type StoreValue = {
  lines: CartLine[];
  items: { product: Product; qty: number }[];
  subtotal: number;
  count: number;
  add: (id: string, qty?: number) => void;
  setQty: (id: string, qty: number) => void;
  remove: (id: string) => void;
  clear: () => void;
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  wishlist: string[];
  toggleWishlist: (id: string) => void;
  recentlyViewed: string[];
  markViewed: (id: string) => void;
};

const StoreContext = createContext<StoreValue | null>(null);

function usePersisted<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) setValue(JSON.parse(raw) as T);
    } catch {
      /* ignore */
    }
    setReady(true);
  }, [key]);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* ignore */
    }
  }, [key, value, ready]);

  return [value, setValue] as const;
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = usePersisted<CartLine[]>("aarohi-cart", []);
  const [wishlist, setWishlist] = usePersisted<string[]>("aarohi-wishlist", []);
  const [recentlyViewed, setRecentlyViewed] = usePersisted<string[]>("aarohi-viewed", []);
  const [cartOpen, setCartOpen] = useState(false);

  const add = useCallback(
    (id: string, qty = 1) => {
      setLines((prev) => {
        const found = prev.find((l) => l.id === id);
        if (found) return prev.map((l) => (l.id === id ? { ...l, qty: l.qty + qty } : l));
        return [...prev, { id, qty }];
      });
      setCartOpen(true);
    },
    [setLines],
  );

  const setQty = useCallback(
    (id: string, qty: number) =>
      setLines((prev) =>
        qty <= 0 ? prev.filter((l) => l.id !== id) : prev.map((l) => (l.id === id ? { ...l, qty } : l)),
      ),
    [setLines],
  );

  const remove = useCallback((id: string) => setLines((prev) => prev.filter((l) => l.id !== id)), [setLines]);
  const clear = useCallback(() => setLines([]), [setLines]);

  const toggleWishlist = useCallback(
    (id: string) =>
      setWishlist((prev) => (prev.includes(id) ? prev.filter((w) => w !== id) : [...prev, id])),
    [setWishlist],
  );

  const markViewed = useCallback(
    (id: string) => setRecentlyViewed((prev) => [id, ...prev.filter((p) => p !== id)].slice(0, 6)),
    [setRecentlyViewed],
  );

  const items = useMemo(
    () =>
      lines
        .map((l) => {
          const product = products.find((p) => p.id === l.id);
          return product ? { product, qty: l.qty } : null;
        })
        .filter((v): v is { product: Product; qty: number } => v !== null),
    [lines],
  );

  const subtotal = items.reduce((sum, i) => sum + i.product.price * i.qty, 0);
  const count = items.reduce((sum, i) => sum + i.qty, 0);

  const value: StoreValue = {
    lines,
    items,
    subtotal,
    count,
    add,
    setQty,
    remove,
    clear,
    cartOpen,
    setCartOpen,
    wishlist,
    toggleWishlist,
    recentlyViewed,
    markViewed,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}
