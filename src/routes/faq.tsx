import { createFileRoute } from "@tanstack/react-router";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Newsletter } from "@/components/Newsletter";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ — Stones, Sizing, Shipping & Returns | ShivAmrit Healers" },
      {
        name: "description",
        content:
          "Answers on natural stones, jewellery care, sizing, shipping timelines, returns and gift packaging at ShivAmrit Healers.",
      },
      { property: "og:title", content: "FAQ | ShivAmrit Healers" },
      {
        property: "og:description",
        content: "Stones, care, sizing, shipping, returns and gifting — answered.",
      },
    ],
  }),
  component: Faq,
});

const faqs = [
  {
    id: "stones",
    q: "Are the stones natural?",
    a: "Yes. We work with natural stones, which means small variations in colour, veining and texture are normal and expected. No two pieces are exactly alike.",
  },
  {
    id: "care",
    q: "How should I care for my jewelry?",
    a: "Keep your piece away from water, perfume and lotions. Wipe gently with a soft dry cloth and store it in the pouch provided when you are not wearing it.",
  },
  {
    id: "choose",
    q: "How do I choose a bracelet?",
    a: "Start with your zodiac sign or a colour you are drawn to. Check each product page for its listed bead size, materials and available fit before ordering.",
  },
  {
    id: "size",
    q: "What size should I choose?",
    a: "Sizes vary by piece. Check the size listed on the product page; if only a bead size is listed, the wrist circumference has not been confirmed. Measure your wrist before ordering and ask us about fit if you are unsure.",
  },
  {
    id: "daily",
    q: "Can I wear the jewelry every day?",
    a: "Yes. Our pieces are designed for everyday wear. Removing them before showering, swimming or sleeping will keep the finish looking new for longer.",
  },
  {
    id: "shipping",
    q: "How long does shipping take?",
    a: "Orders are dispatched within 1–2 business days. Delivery typically takes 3–6 business days across India. Orders above ₹2,500 ship free.",
  },
  {
    id: "returns",
    q: "What is your return policy?",
    a: "Unworn pieces in their original packaging can be returned within 7 days of delivery. Contact us and we will arrange a pickup where available.",
  },
  {
    id: "gift",
    q: "Do you offer gift packaging?",
    a: "Every order arrives in our beige gift box with a ribbon and a care and meaning card. You can add a handwritten note at checkout.",
  },
  {
    id: "support",
    q: "How can I contact support?",
    a: "Visit our contact page for the currently available support options.",
  },
  {
    id: "privacy",
    q: "How do you handle my data?",
    a: "We collect only what we need to process your order and send updates you have asked for. We never sell your data to third parties.",
  },
  {
    id: "terms",
    q: "Terms of use",
    a: "Our pieces are sold as jewellery for style, symbolism and personal ritual. Descriptions of traditional meanings are cultural, not medical claims.",
  },
];

function Faq() {
  return (
    <>
      <section className="border-b border-border bg-sand/50">
        <div className="shell py-14 text-center md:py-20">
          <p className="eyebrow">Support</p>
          <h1 className="mt-3 text-4xl text-ink md:text-6xl">Frequently asked</h1>
        </div>
      </section>

      <section className="shell max-w-3xl py-12 md:py-16">
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((f) => (
            <AccordionItem key={f.id} value={f.id} id={f.id}>
              <AccordionTrigger className="text-left font-display text-lg">{f.q}</AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      <Newsletter />
    </>
  );
}
