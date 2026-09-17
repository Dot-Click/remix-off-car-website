import { createFileRoute, Link } from "@tanstack/react-router";
import { stockSearch } from "@/lib/stock-search";
import { useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Reveal } from "@/components/site/Reveal";
import { PageHero } from "@/components/site/PageHero";
import heroFinance from "@/assets/hero-finance.jpg";
import { formatPrice } from "@/data/vehicles";
import { toast } from "sonner";
import { cardsField, field, useMediaUrl, usePageSections } from "@/lib/site-content";
import { submitEnquiry } from "@/lib/cms";

export const Route = createFileRoute("/finance")({
  head: () => ({
    meta: [
      { title: "Car Finance from 6.9% APR | J1 Auto Trade" },
      {
        name: "description",
        content:
          "PCP, HP and lease purchase car finance from 6.9% APR. Soft-search quotes, decisions in 60 seconds, no deposit options available.",
      },
      { property: "og:title", content: "Car Finance from 6.9% APR | J1 Auto Trade" },
      { property: "og:description", content: "Soft-search car finance quotes with decisions in 60 seconds." },
    ],
  }),
  component: Finance,
});

const STEPS: { title: string; text: string }[] = [
  { title: "Choose Your Vehicle", text: "Pick any car from our stock list — finance is available across the range." },
  { title: "Calculate Your Payments", text: "Set your deposit and term to see an accurate monthly figure." },
  { title: "Apply For Finance", text: "One short soft-search application, checked across 22 lenders." },
  { title: "Drive Away", text: "Sign digitally and collect, or we deliver nationwide to your door." },
];

const BENEFITS: { title: string; text: string }[] = [
  { title: "22 lenders, one form", text: "We shop your application across the market to find the sharpest rate." },
  { title: "No credit footprint", text: "Soft-search quotes are invisible to other lenders." },
  { title: "Flexible terms", text: "12 to 60 months, with or without a deposit." },
  { title: "Settle any time", text: "No early repayment penalties on any agreement." },
];

const FAQS: { title: string; text: string }[] = [
  { title: "Will a quote affect my credit score?", text: "No. We run a soft search to give you an accurate quote, which is invisible to other lenders and leaves no footprint." },
  { title: "What deposit do I need?", text: "None. We offer zero-deposit agreements, though a larger deposit reduces your monthly payment and total interest." },
  { title: "Can I settle the agreement early?", text: "Yes. Every agreement we arrange allows early settlement with no penalty charges." },
  { title: "Do you accept part exchange as a deposit?", text: "Absolutely. Any equity in your current car can be used as all or part of your deposit." },
  { title: "Can I get finance with poor credit?", text: "We work with 22 lenders including specialists in adverse credit, so we can usually find an option." },
];

function Finance() {
  const sections = usePageSections("finance");
  const hero = sections["hero"];
  const productsS = sections["products"];
  const calculatorS = sections["calculator"];
  const whyS = sections["why"];
  const faqS = sections["faq"];
  const ctaS = sections["cta"];

  const heroImage = useMediaUrl(hero?.background_image_path, heroFinance);

  const [amount, setAmount] = useState([38000]);
  const [deposit, setDeposit] = useState([4000]);
  const [term, setTerm] = useState([48]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    employment: "",
    income: "",
    deposit: "",
    vehicle: "",
  });

  const amountValue = amount[0] ?? 0;
  const depositValue = deposit[0] ?? 0;
  const termValue = term[0] ?? 48;
  const financed = Math.max(amountValue - depositValue, 0);
  const monthly = Math.round((financed * (1 + 0.069 * (termValue / 12))) / termValue);
  const total = monthly * termValue + depositValue;

  const steps = cardsField(productsS, STEPS);
  const benefits = cardsField(whyS, BENEFITS);
  const faqs = cardsField(faqS, FAQS);

  return (
    <>
      <PageHero
        image={heroImage}
        crumb="Finance"
        label={field(hero, "eyebrow", "Finance")}
        title={field(hero, "heading", "Make Your Next Car More Affordable")}
        description={field(
          hero,
          "description",
          "Explore flexible finance options designed around your budget. FCA-registered credit broker working with 22 lenders — soft-search quotes with no impact on your credit score.",
        )}
      >
        <Button asChild variant="accent" size="lg">
          <a href={field(hero, "button_url", "#calculator")}>{field(hero, "button_text", "Calculate Finance")}</a>
        </Button>
        <Button asChild variant="outline" size="lg">
          <a href={field(hero, "secondary_button_url", "#apply")}>{field(hero, "secondary_button_text", "Apply For Finance")}</a>
        </Button>
      </PageHero>

      <section className="py-20">
        <div className="shell">
          <p className="eyebrow">{field(productsS, "eyebrow", "How finance works")}</p>
          <h2 className="mt-3 font-display text-3xl font-semibold sm:text-4xl">
            {field(productsS, "heading", "Four simple steps")}
          </h2>
          {field(productsS, "description", "") && (
            <p className="mt-3 max-w-2xl text-muted-foreground">{field(productsS, "description", "")}</p>
          )}
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <Reveal key={s.title} delay={i * 70} className="h-full">
                <div className="h-full rounded-[20px] border border-border bg-card p-7 shadow-soft transition-all duration-500 hover:-translate-y-1.5 hover:border-accent/40 hover:shadow-float">
                  <span className="grid h-11 w-11 place-items-center rounded-xl accent-gradient font-display text-lg font-bold text-accent-foreground">
                    {i + 1}
                  </span>
                  <h3 className="mt-5 font-display text-lg font-semibold">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="calculator" className="scroll-mt-28 pb-20">
        <div className="shell grid gap-10 lg:grid-cols-[minmax(0,1fr)_400px]">
          <Reveal className="rounded-2xl border border-border bg-card p-8 shadow-soft">
            {field(calculatorS, "eyebrow", "") && (
              <p className="eyebrow">{field(calculatorS, "eyebrow", "")}</p>
            )}
            <h2 className="font-display text-2xl font-semibold">
              {field(calculatorS, "heading", "Monthly payment estimator")}
            </h2>
            <div className="mt-8 space-y-8">
              <SliderRow label="Vehicle price" value={formatPrice(amountValue)} sliderValue={amount} onChange={setAmount} min={5000} max={200000} step={500} />
              <SliderRow label="Deposit" value={formatPrice(depositValue)} sliderValue={deposit} onChange={setDeposit} min={0} max={Math.round(amountValue * 0.5)} step={250} />
              <SliderRow label="Term" value={`${termValue} months`} sliderValue={term} onChange={setTerm} min={12} max={60} step={12} />
            </div>

            <div className="mt-10 grid gap-6 rounded-xl surface-ink p-7 sm:grid-cols-3">
              <div>
                <p className="text-xs uppercase tracking-widest text-ink-muted">Monthly</p>
                <p className="font-display text-3xl font-bold text-accent">{formatPrice(monthly)}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-ink-muted">Amount financed</p>
                <p className="font-display text-3xl font-bold text-ink-foreground">{formatPrice(financed)}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-ink-muted">Total payable</p>
                <p className="font-display text-3xl font-bold text-ink-foreground">{formatPrice(total)}</p>
              </div>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              {field(
                calculatorS,
                "description",
                "Representative example based on 6.9% APR. Figures are indicative and subject to status.",
              )}
            </p>
          </Reveal>

          <Reveal delay={100} className="lg:sticky lg:top-28 lg:h-fit">
            <form
              id="apply"
              className="scroll-mt-28 rounded-2xl border border-border bg-card p-8 shadow-float"
              onSubmit={async (e) => {
                e.preventDefault();
                if (form.name.trim().length < 2 || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) {
                  toast.error("Please add your name and a valid email");
                  return;
                }
                try {
                  await submitEnquiry({
                    name: form.name.trim(),
                    email: form.email.trim(),
                    phone: form.phone.trim() || null,
                    subject: "Finance application",
                    message: [
                      `Employment: ${form.employment || "Not provided"}`,
                      `Monthly income: ${form.income || "Not provided"}`,
                      `Deposit available: ${form.deposit || "Not provided"}`,
                      `Vehicle interested in: ${form.vehicle || "Not provided"}`,
                      `Calculator vehicle price: ${formatPrice(amountValue)}`,
                      `Calculator term: ${termValue} months`,
                    ].join("\n"),
                    source: "finance",
                  });
                } catch {
                  toast.error("Could not send your application — please try again");
                  return;
                }
                toast.success("Application received — we'll be in touch within the hour");
                setForm({ name: "", email: "", phone: "", employment: "", income: "", deposit: "", vehicle: "" });
              }}
            >
              <h2 className="font-display text-xl font-semibold">Apply for finance</h2>
              <p className="mt-2 text-sm text-muted-foreground">Soft search only. Two minutes.</p>
              <div className="mt-6 grid gap-4">
                {([
                  ["Full name", "name", "text"],
                  ["Email", "email", "email"],
                  ["Phone", "phone", "tel"],
                  ["Employment status", "employment", "text"],
                  ["Monthly income", "income", "text"],
                  ["Deposit available", "deposit", "text"],
                  ["Vehicle interested in", "vehicle", "text"],
                ] as const).map(([label, key, type]) => (
                  <div key={key}>
                    <Label className="mb-1.5 block text-xs uppercase tracking-widest text-muted-foreground">
                      {label}
                    </Label>
                    <Input
                      type={type}
                      maxLength={255}
                      value={form[key]}
                      onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    />
                  </div>
                ))}
              </div>
              <Button type="submit" size="lg" variant="accent" className="mt-6 w-full">
                Apply For Finance
              </Button>
            </form>
          </Reveal>
        </div>
      </section>

      <section className="bg-secondary py-20">
        <div className="shell">
          {field(whyS, "eyebrow", "") && <p className="eyebrow">{field(whyS, "eyebrow", "")}</p>}
          <h2 className="font-display text-3xl font-semibold sm:text-4xl">
            {field(whyS, "heading", "Why finance with J1 Auto Trade")}
          </h2>
          {field(whyS, "description", "") && (
            <p className="mt-3 max-w-2xl text-muted-foreground">{field(whyS, "description", "")}</p>
          )}
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {benefits.map((b, i) => (
              <Reveal key={b.title} delay={i * 60} className="h-full">
                <div className="h-full rounded-2xl border border-border bg-card p-7 shadow-soft">
                  <Check className="h-5 w-5 text-accent" />
                  <h3 className="mt-4 font-semibold">{b.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{b.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="shell max-w-3xl">
          {field(faqS, "eyebrow", "") && <p className="eyebrow">{field(faqS, "eyebrow", "")}</p>}
          <h2 className="font-display text-3xl font-semibold sm:text-4xl">
            {field(faqS, "heading", "Finance questions")}
          </h2>
          {field(faqS, "description", "") && (
            <p className="mt-3 text-muted-foreground">{field(faqS, "description", "")}</p>
          )}
          <Accordion type="single" collapsible className="mt-8">
            {faqs.map((f) => (
              <AccordionItem key={f.title} value={f.title}>
                <AccordionTrigger className="text-left">{f.title}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{f.text}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          {(field(ctaS, "heading", "") || field(ctaS, "description", "")) && (
            <div className="mt-10">
              {field(ctaS, "heading", "") && (
                <h3 className="font-display text-2xl font-semibold">{field(ctaS, "heading", "")}</h3>
              )}
              {field(ctaS, "description", "") && (
                <p className="mt-2 text-muted-foreground">{field(ctaS, "description", "")}</p>
              )}
            </div>
          )}
          <Button asChild size="lg" variant="accent" className="mt-10">
            <Link to={field(ctaS, "button_url", "/stocklist") as "/stocklist"} search={stockSearch()}>
              {field(ctaS, "button_text", "Find a car to finance")}
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}

function SliderRow({
  label,
  value,
  sliderValue,
  onChange,
  min,
  max,
  step,
}: {
  label: string;
  value: string;
  sliderValue: number[];
  onChange: (v: number[]) => void;
  min: number;
  max: number;
  step: number;
}) {
  return (
    <div>
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-semibold">{value}</span>
      </div>
      <Slider className="mt-4" value={sliderValue} onValueChange={onChange} min={min} max={max} step={step} />
    </div>
  );
}
