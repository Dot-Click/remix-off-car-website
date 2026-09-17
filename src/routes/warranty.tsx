import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, LifeBuoy, PhoneCall, ShieldCheck, Smile, X, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Reveal } from "@/components/site/Reveal";
import { PageHero } from "@/components/site/PageHero";
import { stockSearch } from "@/lib/stock-search";
import { BRAND } from "@/lib/brand";
import heroWarranty from "@/assets/hero-warranty.jpg";
import { cardsField, field, listField, useMediaUrl, usePageSections } from "@/lib/site-content";

export const Route = createFileRoute("/warranty")({
  head: () => ({
    meta: [
      { title: "Vehicle Warranty & Protection | J1 Auto Trade" },
      {
        name: "description",
        content:
          "Every J1 Auto Trade vehicle includes 12 months' warranty as standard, with extended cover, nationwide repairs and a simple claims process.",
      },
      { property: "og:title", content: "Vehicle Warranty & Protection | J1 Auto Trade" },
      { property: "og:description", content: "Drive with confidence — 12 months' cover as standard." },
    ],
  }),
  component: Warranty,
});

const BENEFITS_ICONS: LucideIcon[] = [ShieldCheck, LifeBuoy, Smile, PhoneCall];
const BENEFITS_FALLBACK = [
  { title: "Warranty Protection", text: "12 months' comprehensive cover included with every vehicle we sell.", price: "" },
  { title: "Vehicle Support", text: "Repairs at any VAT-registered garage in the UK — no approved-network limits.", price: "" },
  { title: "Peace Of Mind", text: "Parts and labour paid directly to the garage, so there's nothing to reclaim.", price: "" },
  { title: "Professional Assistance", text: "A named advisor handles your claim from first call to completed repair.", price: "" },
];

const COVERED = [
  "Engine and cylinder head",
  "Gearbox, clutch and transmission",
  "Turbocharger and fuel system",
  "Drivetrain, axles and differentials",
  "Braking and steering components",
  "Suspension and wheel bearings",
  "Cooling and heating systems",
  "Electrics, ECUs and sensors",
  "Air conditioning components",
  "Hybrid and EV drive units",
];

const NOT_COVERED = [
  "Routine servicing and consumables",
  "Wear items: tyres, wipers, brake pads and discs",
  "Accident, misuse or track-day damage",
  "Cosmetic paintwork, trim and glass",
  "Faults present or declared at point of sale",
  "Non-manufacturer modifications",
];

const FAQS = [
  ["How long does the warranty last?", "Every vehicle comes with 12 months' cover from the date of handover. Extended plans of 24 and 36 months can be added at purchase or any time within the first year."],
  ["Where can I have repairs carried out?", "At any VAT-registered garage in the UK. Call us first so we can authorise the work — we settle parts and labour directly with the garage."],
  ["How do I make a claim?", "Stop driving the vehicle if it's unsafe, call our warranty line, and we'll authorise diagnosis at a garage of your choice. Most claims are approved the same day."],
  ["Is there a claim limit?", "Each claim is covered up to the retail value of the vehicle, with no cap on the number of claims during the term."],
  ["Is the warranty transferable?", "Yes. If you sell the vehicle privately, the remaining cover transfers to the new owner free of charge."],
  ["Does the warranty affect my statutory rights?", "No. It sits alongside your rights under the Consumer Rights Act 2015 and never replaces them."],
];

function Warranty() {
  const sections = usePageSections("warranty");
  const hero = sections["hero"];
  const plansS = sections["plans"];
  const coveredS = sections["covered"];
  const ctaS = sections["cta"];
  const heroImage = useMediaUrl(hero?.background_image_path ?? null, heroWarranty);
  const benefits = cardsField(plansS, BENEFITS_FALLBACK);
  const covered = listField(coveredS, COVERED);

  return (
    <>
      <PageHero
        image={heroImage}
        crumb="Warranty"
        label={field(hero, "eyebrow", "Warranty & Protection")}
        title={field(hero, "heading", "Drive With Confidence")}
        description={field(
          hero,
          "description",
          "Every vehicle deserves peace of mind. Explore our warranty options and vehicle protection.",
        )}
      >
        <Button asChild variant="accent" size="lg">
          <Link to={field(hero, "button_url", "/contact") as "/contact"}>
            {field(hero, "button_text", "Speak To Our Team")}
          </Link>
        </Button>
      </PageHero>

      <section className="py-20">
        <div className="shell grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((b, i) => {
            const Icon = BENEFITS_ICONS[i % BENEFITS_ICONS.length]!;
            return (
              <Reveal key={b.title} delay={i * 70}>
                <div className="h-full rounded-[20px] border border-border bg-card p-7 shadow-soft transition-all duration-500 hover:-translate-y-1.5 hover:border-accent/40 hover:shadow-float">
                  <span className="grid h-11 w-11 place-items-center rounded-xl accent-gradient text-accent-foreground">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-5 font-display text-lg font-semibold">{b.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{b.text}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      <section className="surface-ink py-20">
        <div className="shell">
          <Reveal>
            <p className="eyebrow">{field(coveredS, "eyebrow", "The detail")}</p>
            <h2 className="mt-3 font-display text-3xl font-semibold text-ink-foreground sm:text-4xl">
              {field(coveredS, "heading", "What your cover includes")}
            </h2>
          </Reveal>

          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            <Reveal className="rounded-3xl border border-ink-border bg-white/5 p-8">
              <h3 className="font-display text-xl font-semibold text-ink-foreground">What Is Covered</h3>
              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {covered.map((c) => (
                  <li key={c} className="flex gap-2.5 text-sm text-ink-muted">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                    {c}
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={100} className="rounded-3xl border border-ink-border bg-white/5 p-8">
              <h3 className="font-display text-xl font-semibold text-ink-foreground">What Is Not Covered</h3>
              <ul className="mt-6 grid gap-3">
                {NOT_COVERED.map((c) => (
                  <li key={c} className="flex gap-2.5 text-sm text-ink-muted">
                    <X className="mt-0.5 h-4 w-4 shrink-0 text-ink-muted" />
                    {c}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-3">
            {[
              ["Warranty Duration", "12 months included as standard. Extend to 24 or 36 months at purchase, or upgrade any time within your first year of ownership."],
              ["How To Make A Claim", "Call our warranty line, describe the fault and choose your garage. We authorise diagnosis, then settle the approved repair directly."],
              ["Support", `Warranty advisors are available seven days a week on ${BRAND.phone}, plus WhatsApp and email for non-urgent questions.`],
            ].map(([title, copy], i) => (
              <Reveal key={title} delay={i * 80} className="rounded-3xl border border-ink-border bg-white/5 p-8">
                <h3 className="font-display text-lg font-semibold text-ink-foreground">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-muted">{copy}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="shell max-w-3xl">
          <Reveal>
            <p className="eyebrow">Warranty FAQ</p>
            <h2 className="mt-3 font-display text-3xl font-semibold sm:text-4xl">
              Questions we're asked most
            </h2>
          </Reveal>
          <Reveal delay={100}>
            <Accordion type="single" collapsible className="mt-8">
              {FAQS.map(([q, a]) => (
                <AccordionItem key={q} value={q!}>
                  <AccordionTrigger className="text-left font-medium">{q}</AccordionTrigger>
                  <AccordionContent className="leading-relaxed text-muted-foreground">{a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Reveal>
        </div>
      </section>

      <section className="pb-24">
        <div className="shell">
          <Reveal className="glass-card rounded-3xl border border-border p-10 text-center sm:p-14">
            <h2 className="font-display text-3xl font-semibold sm:text-4xl">
              {field(ctaS, "heading", "Still have a question?")}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
              {field(
                ctaS,
                "description",
                "Our warranty team will talk you through exactly what's covered on the car you're considering.",
              )}
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button asChild variant="accent" size="lg">
                <Link to={field(ctaS, "button_url", "/contact") as "/contact"}>
                  {field(ctaS, "button_text", "Speak To Our Team")}
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to={field(ctaS, "secondary_button_url", "/stocklist") as "/stocklist"} search={stockSearch()}>
                  {field(ctaS, "secondary_button_text", "Browse Our Stock")}
                </Link>
              </Button>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
