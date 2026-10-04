import { createFileRoute } from "@tanstack/react-router";

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

      <section className="shell py-14 md:py-20">
        <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">Direct enquiries are not available yet. WhatsApp and email contact will be added when the store’s contact details are confirmed.</p>
      </section>
    </>
  );
}
