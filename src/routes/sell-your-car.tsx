import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Camera, Check } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Reveal } from "@/components/site/Reveal";
import showroom from "@/assets/showroom.jpg";
import { submitEnquiry } from "@/lib/cms";
import { cardsField, field, useMediaUrl, usePageSections } from "@/lib/site-content";

export const Route = createFileRoute("/sell-your-car")({
  head: () => ({
    meta: [
      { title: "Sell Your Car — Free Valuation | J1 Auto Trade" },
      {
        name: "description",
        content:
          "Get a free, no-obligation valuation for your car. Same-day payment, free collection and no admin fees at J1 Auto Trade.",
      },
      { property: "og:title", content: "Sell Your Car — Free Valuation | J1 Auto Trade" },
      { property: "og:description", content: "Free valuation, same-day payment and free collection." },
    ],
  }),
  component: SellYourCar,
});

const STEPS_FALLBACK = [
  { title: "Send us the details", text: "Registration, mileage and a few photos is all we need." },
  { title: "Get your valuation", text: "A real buyer prices your car within two working hours." },
  { title: "We collect, you get paid", text: "Free collection nationwide and same-day bank transfer." },
];

function SellYourCar() {
  const [form, setForm] = useState({
    registration: "",
    mileage: "",
    name: "",
    email: "",
    phone: "",
    notes: "",
  });
  const [photos, setPhotos] = useState<string[]>([]);

  const sections = usePageSections("sell-your-car");
  const hero = sections["hero"];
  const stepsS = sections["steps"];

  const heroImage = useMediaUrl(hero?.background_image_path ?? null, showroom);
  const steps = cardsField<{ title: string; text: string }>(stepsS, STEPS_FALLBACK);

  return (
    <>
      <section className="relative overflow-hidden pb-16 pt-32 surface-ink">
        <img src={heroImage} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-20" />
        <div className="shell relative max-w-3xl">
          <p className="eyebrow">{field(hero, "eyebrow", "Sell or part exchange")}</p>
          <h1 className="mt-3 font-display text-4xl font-semibold text-ink-foreground sm:text-6xl">
            {field(hero, "heading", "We'll buy your car today")}
          </h1>
          <p className="mt-5 text-ink-muted">
            {field(
              hero,
              "description",
              "Enter your registration for a free, no-obligation valuation. We pay same day by bank transfer, collect free of charge and handle all the paperwork.",
            )}
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="shell grid gap-10 lg:grid-cols-[minmax(0,1fr)_360px]">
          <Reveal>
            <form
              className="rounded-2xl border border-border bg-card p-8 shadow-soft"
              onSubmit={async (e) => {
                e.preventDefault();
                if (form.registration.trim().length < 4 || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) {
                  toast.error("Please add your registration and a valid email");
                  return;
                }
                try {
                  await submitEnquiry({
                    name: form.name.trim() || "Valuation customer",
                    email: form.email.trim(),
                    phone: form.phone.trim() || null,
                    subject: `Sell my car: ${form.registration.trim().toUpperCase()}`,
                    message: [
                      `Registration: ${form.registration.trim().toUpperCase()}`,
                      `Mileage: ${form.mileage.trim() || "Not provided"}`,
                      `Selected photos: ${photos.length}`,
                      form.notes.trim() ? `Notes: ${form.notes.trim()}` : "",
                    ].filter(Boolean).join("\n"),
                    source: "sell-your-car",
                  });
                } catch {
                  toast.error("Could not send your valuation request — please try again");
                  return;
                }
                toast.success("Valuation requested — expect a figure within 2 working hours");
                setForm({ registration: "", mileage: "", name: "", email: "", phone: "", notes: "" });
                setPhotos([]);
              }}
            >
              <h2 className="font-display text-2xl font-semibold">Vehicle details</h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <Field label="Registration" value={form.registration} onChange={(v) => setForm({ ...form, registration: v.toUpperCase() })} placeholder="LM24 AXV" />
                <Field label="Mileage" value={form.mileage} onChange={(v) => setForm({ ...form, mileage: v.replace(/[^0-9]/g, "") })} placeholder="34500" />
              </div>

              <h2 className="mt-10 font-display text-2xl font-semibold">Photos</h2>
              <label className="mt-4 flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-border p-10 text-center transition-colors hover:border-accent">
                <Camera className="h-6 w-6 text-accent" />
                <span className="text-sm font-medium">Upload up to 8 photos</span>
                <span className="text-xs text-muted-foreground">Front, rear, both sides, interior and dashboard</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    const files = Array.from(e.target.files ?? []).slice(0, 8);
                    setPhotos(files.map((f) => f.name));
                  }}
                />
              </label>
              {photos.length > 0 && (
                <ul className="mt-4 grid gap-2 text-xs text-muted-foreground">
                  {photos.map((p) => (
                    <li key={p} className="flex items-center gap-2">
                      <Check className="h-3.5 w-3.5 text-accent" /> {p}
                    </li>
                  ))}
                </ul>
              )}

              <h2 className="mt-10 font-display text-2xl font-semibold">Contact details</h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <Field label="Full name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
                <Field label="Email" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
                <div className="sm:col-span-2">
                  <Field label="Phone" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} />
                </div>
              </div>
              <div className="mt-4">
                <Label className="mb-1.5 block text-xs uppercase tracking-widest text-muted-foreground">
                  Anything we should know?
                </Label>
                <Textarea rows={4} maxLength={1000} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
              </div>

              <Button type="submit" size="xl" variant="accent" className="mt-8 w-full">
                Submit for valuation
              </Button>
            </form>
          </Reveal>

          <Reveal delay={100} className="lg:sticky lg:top-28 lg:h-fit">
            <div className="rounded-2xl surface-ink p-8">
              <h2 className="font-display text-xl font-semibold text-ink-foreground">
                {field(stepsS, "heading", "How it works")}
              </h2>
              <ol className="mt-6 space-y-6">
                {steps.map((s, i) => (
                  <li key={s.title} className="flex gap-4">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full accent-gradient text-sm font-bold text-accent-foreground">
                      {i + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="font-semibold text-ink-foreground">{s.title}</p>
                      <p className="mt-1 text-sm text-ink-muted">{s.text}</p>
                    </div>
                  </li>
                ))}
              </ol>
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
