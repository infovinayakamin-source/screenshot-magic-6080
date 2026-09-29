import { MessageCircle } from "lucide-react";

export function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/910000000000"
      target="_blank"
      rel="noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed right-4 bottom-20 z-40 grid size-12 place-items-center rounded-full bg-ink text-background shadow-[var(--shadow-lift)] transition-transform duration-300 hover:scale-105 md:bottom-6"
    >
      <MessageCircle className="size-5" />
    </a>
  );
}
