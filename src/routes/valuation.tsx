import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Camera, Clock, HandCoins, Repeat, ShieldCheck, type LucideIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Reveal } from "@/components/site/Reveal";
import { PageHero } from "@/components/site/PageHero";
import { BRAND } from "@/lib/brand";
import heroValuation from "@/assets/hero-valuation.jpg";
import { submitEnquiry } from "@/lib/cms";
import { cardsField, field, useMediaUrl, usePageSections } from "@/lib/site-content";

export const Route = createFileRoute("/valuation")({
  head: () => ({
    meta: [
      { title: "Free Car Valuation | J1 Auto Trade" },
      {
        name: "description",
        content:
          "Find out what your car is worth. Free, no-obligation vehicle valuation with a response within one working hour and part exchange available.",
      },
      { property: "og:title", content: "Free Car Valuation | J1 Auto Trade" },
      { property: "og:description", content: "Get a fair, market-accurate valuation for your vehicle." },
    ],
  }),
  component: Valuation,
});

const WHY_ICONS: LucideIcon[] = [HandCoins, Clock, ShieldCheck, Repeat];
const WHY_FALLBACK = [
  { title: "Fair Valuation", text: "Live market data, auction results and retail demand — not a lowball guess." },
  { title: "Fast Response", text: "A real figure from a real buyer within one working hour, seven days a week." },
  { title: "Simple Process", text: "One short form, no haggling, no obligation and no admin fees." },
  { title: "Part Exchange Available", text: "Put every penny of your valuation straight into your next car." },
];

const CONDITIONS = ["Excellent", "Good", "Fair", "Poor"];
const FUELS = ["Petrol", "Diesel", "Hybrid", "Electric", "Plug-in Hybrid"];
const TRANSMISSIONS = ["Automatic", "Manual"];

function Valuation() {
  const sections = usePageSections("valuation");
  const hero = sections["hero"];
  const formS = sections["form"];
  const stepsS = sections["steps"];
  const ctaS = sections["cta"];
  const heroImage = useMediaUrl(hero?.background_image_path ?? null, heroValuation);
  const why = cardsField(stepsS, WHY_FALLBACK);

  const [form, setForm] = useState({
    reg: "",
    make: "",
    model: "",
    year: "",
    mileage: "",
    fuel: "",
    transmission: "",
    condition: "",
    notes: "",
    name: "",
    email: "",
    phone: "",
  });
  const [photos, setPhotos] = useState(0);

  const set = (k: keyof typeof form) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <>
      <PageHero
        image={heroImage}
        crumb="Valuation"
        label={field(hero, "eyebrow", "Vehicle Valuation")}
        title={field(hero, "heading", "What's Your Car Worth?")}
        description={field(
          hero,
          "description",
          "Get a valuation for your vehicle and discover how much it could be worth.",
        )}
      />

      <section className="py-20">
        <div className="shell grid gap-12 lg:grid-cols-[minmax(0,1fr)_360px]">
          <Reveal>
            <form
              className="rounded-3xl border border-border bg-card p-8 shadow-soft sm:p-10"
              onSubmit={async (e) => {
                e.preventDefault();
                if (!form.reg.trim() || !form.name.trim() || !form.email.trim()) {
                  toast.error("Please add your registration, name and email");
                  return;
                }
                try {
                  await submitEnquiry({
                    name: form.name.trim(),
                    email: form.email.trim(),
                    phone: form.phone.trim() || null,
                    subject: `Valuation request: ${form.reg.trim().toUpperCase()}`,
                    message: [
                      `Registration: ${form.reg.trim().toUpperCase()}`,
                      `Vehicle: ${[form.year, form.make, form.model].filter(Boolean).join(" ") || "Not provided"}`,
                      `Mileage: ${form.mileage || "Not provided"}`,
                      `Fuel: ${form.fuel || "Not provided"}`,
                      `Transmission: ${form.transmission || "Not provided"}`,
                      `Condition: ${form.condition || "Not provided"}`,
                      `Selected photos: ${photos}`,
                      form.notes.trim() ? `Notes: ${form.notes.trim()}` : "",
                    ].filter(Boolean).join("\n"),
                    source: "valuation",
                  });
                } catch {
                  toast.error("Could not send your valuation request — please try again");
                  return;
                }
                toast.success("Valuation request received — we'll be in touch within the hour");
                setForm({
                  reg: "", make: "", model: "", year: "", mileage: "", fuel: "",
                  transmission: "", condition: "", notes: "", name: "", email: "", phone: "",
                });
                setPhotos(0);
              }}
            >
              <h2 className="font-display text-2xl font-semibold">{field(formS, "heading", "Your vehicle")}</h2>

              <div className="mt-7 grid gap-5 sm:grid-cols-2">
                <Field label="Registration" value={form.reg} onChange={set("reg")} placeholder="AB12 CDE" className="uppercase" />
                <Field label="Mileage" value={form.mileage} onChange={set("mileage")} placeholder="34,000" />
                <Field label="Make" value={form.make} onChange={set("make")} placeholder="BMW" />
                <Field label="Model" value={form.model} onChange={set("model")} placeholder="3 Series" />
                <Field label="Year" value={form.year} onChange={set("year")} placeholder="2021" />
                <Picker label="Fuel Type" value={form.fuel} onChange={set("fuel")} options={FUELS} />
                <Picker label="Transmission" value={form.transmission} onChange={set("transmission")} options={TRANSMISSIONS} />
                <Picker label="Condition" value={form.condition} onChange={set("condition")} options={CONDITIONS} />
              </div>

              <div className="mt-6">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Anything we should know?
                </Label>
                <Textarea
                  value={form.notes}
                  onChange={(e) => set("notes")(e.target.value.slice(0, 1200))}
                  rows={4}
                  className="mt-2"
                  placeholder="Service history, previous owners, damage, modifications…"
                />
              </div>

              <div className="mt-6">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Upload vehicle photos (optional)
                </Label>
                <label className="mt-2 flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-secondary/50 px-6 py-10 text-center transition-colors hover:border-accent">
                  <Camera className="h-6 w-6 text-accent" />
                  <span className="mt-3 text-sm font-medium">
                    {photos > 0 ? `${photos} photo${photos > 1 ? "s" : ""} selected` : "Click to add photos"}
                  </span>
                  <span className="mt-1 text-xs text-muted-foreground">JPG or PNG, up to 10 images</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => setPhotos(e.target.files?.length ?? 0)}
                  />
                </label>
              </div>

              <h2 className="mt-10 font-display text-2xl font-semibold">Your details</h2>
              <div className="mt-6 grid gap-5 sm:grid-cols-3">
                <Field label="Name" value={form.name} onChange={set("name")} placeholder="Jane Smith" />
                <Field label="Email" value={form.email} onChange={set("email")} placeholder="jane@email.com" type="email" />
                <Field label="Phone" value={form.phone} onChange={set("phone")} placeholder="07…" type="tel" />
              </div>

              <Button type="submit" variant="accent" size="lg" className="mt-9 w-full sm:w-auto">
                {field(formS, "button_text", "Request Valuation")}
              </Button>
              <p className="mt-4 text-xs text-muted-foreground">
                {field(
                  formS,
                  "description",
                  "No obligation. We'll never pass your details to a third party.",
                )}
              </p>
            </form>
          </Reveal>

          <Reveal delay={120} className="lg:sticky lg:top-28 lg:h-fit">
            <div className="rounded-3xl border border-border bg-card p-8 shadow-soft">
              <h2 className="font-display text-xl font-semibold">
                {field(stepsS, "heading", "Why Value Your Car With Us?")}
              </h2>
              <ul className="mt-6 space-y-6">
                {why.map((w, i) => {
                  const Icon = WHY_ICONS[i % WHY_ICONS.length]!;
                  return (
                    <li key={w.title} className="flex gap-4">
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl accent-gradient text-accent-foreground">
                        <Icon className="h-4 w-4" />
                      </span>
                      <div>
                        <p className="font-semibold">{w.title}</p>
                        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{w.text}</p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="mt-6 rounded-3xl surface-ink p-8">
              <h3 className="font-display text-lg font-semibold text-ink-foreground">
                {field(ctaS, "heading", "Prefer to talk it through?")}
              </h3>
              <p className="mt-2 text-sm text-ink-muted">
                {field(ctaS, "description", "Our buying team is on the phone seven days a week.")}
              </p>
              <div className="mt-6 grid gap-2">
                <Button asChild variant="accent">
                  <a href={BRAND.phoneHref}>{BRAND.phone}</a>
                </Button>
                <Button asChild variant="outline" className="text-black border-black/20 hover:bg-black hover:text-white">
                  <Link to={field(ctaS, "secondary_button_url", "/contact") as "/contact"}>
                    {field(ctaS, "secondary_button_text", "Contact Our Team")}
                  </Link>
                </Button>
              </div>
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
  placeholder,
  type = "text",
  className,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  className?: string;
}) {
  return (
    <div>
      <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </Label>
      <Input
        value={value}
        type={type}
        placeholder={placeholder}
        className={`mt-2 ${className ?? ""}`}
        onChange={(e) => onChange(e.target.value.slice(0, 120))}
      />
    </div>
  );
}

function Picker({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <div>
      <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="mt-2 h-10">
          <SelectValue placeholder="Select" />
        </SelectTrigger>
        <SelectContent>
          {options.map((o) => (
            <SelectItem key={o} value={o}>
              {o}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
