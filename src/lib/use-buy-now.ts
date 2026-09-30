import { useNavigate } from "@tanstack/react-router";
import { useStore } from "@/lib/store";

/** Dynamic checkout: add the item and go straight to checkout. */
export function useBuyNow() {
  const { add, lines, setCartOpen } = useStore();
  const navigate = useNavigate();
  return (id: string) => {
    if (!lines.some((l) => l.id === id)) add(id);
    setCartOpen(false);
    void navigate({ to: "/checkout" });
  };
}
