import { createFileRoute, Link } from "@tanstack/react-router";
import { stockSearch } from "@/lib/stock-search";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Reveal } from "@/components/site/Reveal";
import { formatPrice } from "@/data/vehicles";
import { field, listField, usePageSections } from "@/lib/site-content";
import { submitEnquiry } from "@/lib/cms";

export const Route = createFileRoute("/part-exchange")({
  head: () => ({
    meta: [
      { title: "Part Exchange Your Car | J1 Auto Trade" },
      {
        name: "description",
        content:
          "Trade in your current car against any vehicle in our stock. Instant estimate, fair pricing and any outstanding finance settled.",
      },
      { property: "og:title", content: "Part Exchange Your Car | J1 Auto Trade" },
      { property: "og:description", content: "Trade in your car against any vehicle in our stock." },
    ],
  }),
  component: PartExchange,
});

const BENEFITS_FALLBACK = [
  "We settle outstanding finance directly with your lender.",
  "Any equity goes straight towards your new car's deposit.",
  "No admin fees, ever.",
  "Valuations held for 7 days or 250 miles.",
];

function PartExchange() {
  const [form, setForm] = useState({
    registration: "",
    mileage: "",
    condition: "good",
    outstanding: "",
    name: "",
    email: "",
    phone: "",
  });
  const [estimate, setEstimate] = useState<number | null>(null);

  const sections = usePageSections("part-exchange");
  const hero = sections["hero"];
  const benefitsS = sections["benefits"];

  const benefits = listField(benefitsS, BENEFITS_FALLBACK);

  const calculate = () => {
    const miles = Number(form.mileage) || 0;
    if (form.registration.trim().length < 4) {
      toast.error("Enter your registration to get an estimate");
      return;
    }
    const conditionFactor = form.condition === "excellent" ? 1.12 : form.condition === "fair" ? 0.84 : 1;
    const base = Math.max(24000 - miles * 0.16, 1200) * conditionFactor;
    setEstimate(Math.round(base / 50) * 50);
  };

  return (
    <>
      <section className="surface-ink pb-16 pt-32">
        <div className="shell max-w-3xl">
          <p className="eyebrow">{field(hero, "eyebrow", "Part exchange")}</p>
          <h1 className="mt-3 font-display text-4xl font-semibold text-ink-foreground sm:text-6xl">
            {field(hero, "heading", "Trade in, drive out")}
          </h1>
          <p className="mt-5 text-ink-muted">
            {field(
              hero,
              "description",
              "Use your current car as your deposit. We settle any outstanding finance directly with your lender and handle the DVLA paperwork for you.",
            )}
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="shell grid gap-10 lg:grid-cols-[minmax(0,1fr)_360px]">
          <Reveal className="rounded-2xl border border-border bg-card p-8 shadow-soft">
            <h2 className="font-display text-2xl font-semibold">Your current vehicle</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <Field label="Registration" value={form.registration} onChange={(v) => setForm({ ...form, registration: v.toUpperCase() })} placeholder="LM24 AXV" />
              <Field label="Mileage" value={form.mileage} onChange={(v) => setForm({ ...form, mileage: v.replace(/[^0-9]/g, "") })} placeholder="42000" />
              <div>
                <Label className="mb-1.5 block text-xs uppercase tracking-widest text-muted-foreground">
                  Condition
                </Label>
                <div className="flex gap-2">
                  {["fair", "good", "excellent"].map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setForm({ ...form, condition: c })}
                      className={`flex-1 rounded-lg border px-3 py-2 text-xs font-semibold capitalize transition-colors ${
                        form.condition === c
                          ? "border-accent bg-accent text-accent-foreground"
                          : "border-border hover:border-accent"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
              <Field label="Outstanding finance" value={form.outstanding} onChange={(v) => setForm({ ...form, outstanding: v.replace(/[^0-9]/g, "") })} placeholder="0" />
            </div>

            <Button className="mt-7" size="lg" onClick={calculate}>
              Calculate my estimate
            </Button>

            {estimate !== null && (
              <div className="mt-8 rounded-xl surface-ink p-7">
                <p className="text-xs uppercase tracking-widest text-ink-muted">Estimated trade-in value</p>
                <p className="mt-2 font-display text-4xl font-bold text-accent">{formatPrice(estimate)}</p>
                <p className="mt-2 text-sm text-ink-muted">
                  Indicative only — confirmed after a physical inspection, usually within 24 hours.
                </p>
              </div>
            )}

            <h2 className="mt-12 font-display text-2xl font-semibold">Contact details</h2>
            <form
              className="mt-6 grid gap-4 sm:grid-cols-2"
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
                    subject: `Part exchange: ${form.registration.trim().toUpperCase() || "Vehicle details requested"}`,
                    message: [
                      `Registration: ${form.registration.trim().toUpperCase() || "Not provided"}`,
                      `Mileage: ${form.mileage || "Not provided"}`,
                      `Condition: ${form.condition}`,
                      `Outstanding finance: ${form.outstanding || "Not provided"}`,
                      `Estimated value shown: ${estimate === null ? "Not calculated" : formatPrice(estimate)}`,
                    ].join("\n"),
                    source: "part-exchange",
                  });
                } catch {
                  toast.error("Could not send your part exchange request — please try again");
                  return;
                }
                toast.success("Thanks — we'll confirm your part exchange figure shortly");
              }}
            >
              <Field label="Full name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
              <Field label="Email" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
              <div className="sm:col-span-2">
                <Field label="Phone" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} />
              </div>
              <Button type="submit" size="lg" variant="accent" className="sm:col-span-2">
                Send my part exchange request
              </Button>
            </form>
          </Reveal>

          <Reveal delay={100} className="lg:sticky lg:top-28 lg:h-fit">
            <div className="rounded-2xl border border-border bg-secondary p-8">
              <h2 className="font-display text-xl font-semibold">{field(benefitsS, "heading", "Good to know")}</h2>
              <ul className="mt-5 space-y-4 text-sm text-muted-foreground">
                {benefits.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
              <Button asChild variant="accent" className="mt-7 w-full">
                <Link to="/stocklist" search={stockSearch()}>
                  Find your next car <ArrowRight />
                </Link>
              </Button>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <Label className="mb-1.5 block text-xs uppercase tracking-widest text-muted-foreground">
        {label}
      </Label>
      <Input type={type} value={value} placeholder={placeholder} maxLength={255} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}
