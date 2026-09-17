import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/site/Reveal";
import { cardsField, field, usePageSections } from "@/lib/site-content";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "Frequently Asked Questions | J1 Auto Trade" },
      {
        name: "description",
        content:
          "Answers on buying, finance, payments, warranty, delivery and part exchange at J1 Auto Trade.",
      },
      { property: "og:title", content: "Frequently Asked Questions | J1 Auto Trade" },
      { property: "og:description", content: "Answers on buying, finance, warranty and delivery." },
    ],
  }),
  component: FAQ,
});

const GROUP_NAMES = ["Buying", "Finance", "Payments", "Warranty", "Delivery", "Trade-in"];

const FAQ_FALLBACK: { title: string; text: string }[] = [
  { title: "Can I view a car before buying?", text: "Yes — our Manchester showroom is open seven days a week, and appointments guarantee the car is unlocked, charged and ready." },
  { title: "Do you sell nationally?", text: "We deliver anywhere in mainland UK, usually within 72 hours of the sale completing." },
  { title: "Can I reserve a car online?", text: "Yes. A £199 refundable deposit holds any vehicle for seven days." },
  { title: "What rates do you offer?", text: "Rates start at 6.9% APR representative and depend on your credit profile, deposit and term." },
  { title: "Will applying hurt my credit score?", text: "No. Our quotes use a soft search that is invisible to other lenders." },
  { title: "Can I overpay or settle early?", text: "Yes, with no early repayment penalties on any agreement we arrange." },
  { title: "What payment methods do you accept?", text: "Bank transfer, debit card and finance. Card payments are capped at £5,000." },
  { title: "Is my deposit refundable?", text: "Fully refundable within seven days if you change your mind." },
  { title: "Are there admin fees?", text: "None. The price you see is the price you pay." },
  { title: "What's included?", text: "A 12-month comprehensive warranty covering engine, transmission, electrics and more, with unlimited claims." },
  { title: "Can I extend it?", text: "Yes — 24 and 36 month extensions are available at the point of sale." },
  { title: "Where can I get work done?", text: "At any VAT-registered garage in the UK, or at our own workshop." },
  { title: "How long does delivery take?", text: "Typically 48–72 hours after funds clear and paperwork is signed." },
  { title: "Is delivery free?", text: "Free on vehicles over £30,000. Below that it's a flat £149 anywhere in mainland UK." },
  { title: "Can I return the car?", text: "Yes — a 14-day money-back guarantee applies to all distance sales, up to 500 miles." },
  { title: "Do you take part exchange?", text: "On every car we sell. Get an estimate on our part exchange page in under a minute." },
  { title: "What if I still owe finance?", text: "We settle the outstanding balance directly with your lender and offset any equity." },
  { title: "How long is a valuation valid?", text: "Seven days or 250 additional miles, whichever comes first." },
];

function FAQ() {
  const sections = usePageSections("faq");
  const hero = sections["hero"];
  const faqS = sections["faq"];
  const ctaS = sections["cta"];

  const items = cardsField<{ title: string; text: string }>(faqS, FAQ_FALLBACK);
  const groups = GROUP_NAMES.map((name, i) => [name, items.slice(i * 3, i * 3 + 3)] as const).filter(
    ([, qs]) => qs.length,
  );

  return (
    <>
      <section className="surface-ink pb-16 pt-32">
        <div className="shell max-w-3xl">
          <p className="eyebrow">{field(hero, "eyebrow", "Help centre")}</p>
          <h1 className="mt-3 font-display text-4xl font-semibold text-ink-foreground sm:text-6xl">
            {field(hero, "heading", "Frequently asked questions")}
          </h1>
          <p className="mt-5 text-ink-muted">
            {field(hero, "description", "Everything about buying, financing, warranty and delivery — in plain English.")}
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="shell grid gap-14 lg:grid-cols-2">
          {groups.map(([group, qs], i) => (
            <Reveal key={group} delay={(i % 2) * 80}>
              <h2 className="font-display text-2xl font-semibold">{group}</h2>
              <Accordion type="single" collapsible className="mt-4">
                {qs.map((q) => (
                  <AccordionItem key={q.title} value={q.title}>
                    <AccordionTrigger className="text-left">{q.title}</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">{q.text}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </Reveal>
          ))}
        </div>

        <div className="shell mt-16">
          <div className="rounded-3xl surface-ink p-12 text-center">
            <h2 className="font-display text-3xl font-semibold text-ink-foreground">
              {field(ctaS, "heading", "Still have a question?")}
            </h2>
            <p className="mt-3 text-ink-muted">
              {field(ctaS, "description", "Our team answers calls and messages seven days a week.")}
            </p>
            <Button asChild size="lg" variant="accent" className="mt-8">
              <Link to="/contact">{field(ctaS, "button_text", "Contact us")}</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
