import { createFileRoute } from "@tanstack/react-router";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About ShivAmrit Healers — Parul Suthar" },
      { name: "description", content: "Meet Parul Suthar and explore ShivAmrit Healers’ spiritual practices, personal guidance and self-care offerings." },
      { property: "og:title", content: "About ShivAmrit Healers — Parul Suthar" },
      { property: "og:description", content: "Spiritual practices, personal guidance and self-care offerings for people exploring their own path to wellbeing." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: About,
});

const offerings = [
  "Reiki sessions and learning programmes",
  "Crystal healing and crystal products",
  "Astrology consultations",
  "Tarot card readings",
  "Akashic record readings",
  "Bath salts and self-care products",
];

function About() {
  return (
    <div className="shell py-10 md:py-14">
      <div className="mx-auto max-w-2xl">
        <section aria-labelledby="about-heading" className="border-b border-border pb-8">
          <h1 id="about-heading" className="text-3xl leading-tight text-foreground">About ShivAmrit Healers</h1>
          <p className="mt-3 text-xs font-semibold text-muted-foreground">ALIGN • HEAL • EVOLVE</p>
          <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
            A little time for yourself can make space for reflection, renewed intention and a more mindful everyday life. ShivAmrit Healers brings together spiritual practices, personal guidance and self-care rituals for people exploring their own path to wellbeing.
          </p>
        </section>

        <section aria-labelledby="approach-heading" className="pt-8">
          <h2 id="approach-heading" className="text-xl text-foreground">Our Approach</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            We believe personal growth begins with taking time to understand yourself. Our approach encourages self-awareness, thoughtful reflection and meaningful moments of pause, while respecting each person’s individual beliefs and journey.
          </p>
        </section>

        <section aria-labelledby="practitioner-heading" className="pt-8">
          <h2 id="practitioner-heading" className="text-xl text-foreground">Meet Parul Suthar</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            ShivAmrit Healers is led by Parul Suthar. Through its sessions, learning experiences and self-care offerings, the brand invites you to explore spiritual wellbeing at your own pace.
          </p>
        </section>

        <section aria-labelledby="offerings-heading" className="py-8">
          <h2 id="offerings-heading" className="text-xl text-foreground">What We Offer</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">
            {offerings.map(offering => <li key={offering}>{offering}</li>)}
          </ul>
        </section>

        <section aria-labelledby="contact-heading" className="border-t border-border pt-8">
          <h2 id="contact-heading" className="text-xl text-foreground">Let’s Connect</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Want to learn more about our sessions, courses or products? Connect with ShivAmrit Healers for details and help choosing where to begin.
          </p>
          <Button asChild className="mt-5">
            <a href="https://wa.me/919016330390" target="_blank" rel="noopener noreferrer"><MessageCircle aria-hidden="true" />Chat on WhatsApp</a>
          </Button>
          <p className="mt-6 text-xs leading-relaxed text-muted-foreground">
            Our spiritual and wellness offerings are intended for personal reflection and complementary self-care. They do not replace medical or mental health care. Individual experiences vary.
          </p>
        </section>
      </div>
    </div>
  );
}
