import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Reveal } from "@/components/site/Reveal";
import { PageHero } from "@/components/site/PageHero";
import { BRAND } from "@/lib/brand";
import heroFindUs from "@/assets/hero-findus.jpg";
import { submitEnquiry } from "@/lib/cms";
import {
  cardsField,
  field,
  useBusiness,
  useMediaUrl,
  usePageSections,
} from "@/lib/site-content";

export const Route = createFileRoute("/find-us")({
  head: () => ({
    meta: [
      { title: "Find Us | J1 Auto Trade, Birmingham" },
      {
        name: "description",
        content:
          "Visit J1 Auto Trade at 31 York Road, Birmingham B21 9EB. Opening hours, directions, phone, email and WhatsApp contact.",
      },
      { property: "og:title", content: "Find Us | J1 Auto Trade" },
      { property: "og:description", content: "Come and view our latest vehicles and speak with our team." },
    ],
  }),
  component: FindUs,
});

const HOURS_FALLBACK = [
  { title: "Monday", text: "09:00 – 18:30" },
  { title: "Tuesday", text: "09:00 – 18:30" },
  { title: "Wednesday", text: "09:00 – 18:30" },
  { title: "Thursday", text: "09:00 – 18:30" },
  { title: "Friday", text: "09:00 – 18:30" },
  { title: "Saturday", text: "09:00 – 17:00" },
  { title: "Sunday", text: "11:00 – 16:00" },
];

const MAP_SRC =
  "https://www.openstreetmap.org/export/embed.html?bbox=-1.95%2C52.48%2C-1.85%2C52.54&layer=mapnik";

function FindUs() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });

  const sections = usePageSections("find-us");
  const hero = sections["hero"];
  const detailsS = sections["details"];
  const hoursS = sections["hours"];
  const ctaS = sections["cta"];
  const business = useBusiness();

  const heroImage = useMediaUrl(hero?.background_image_path ?? null, heroFindUs);
  const hours = cardsField<{ title: string; text: string }>(hoursS, HOURS_FALLBACK);

  return (
    <>
      <PageHero
        image={heroImage}
        crumb="Find Us"
        label={field(hero, "eyebrow", "Visit Our Showroom")}
        title={field(hero, "heading", `Visit ${BRAND.nameTitle}`)}
        description={field(hero, "description", "Come and view our latest vehicles and speak with our team.")}
      >
        <Button asChild variant="accent" size="lg">
          <a href={business.phone_href}>{field(hero, "button_text", "Call Us")}</a>
        </Button>
        <Button asChild variant="outline" size="lg">
          <a href={business.whatsapp} target="_blank" rel="noreferrer">
            {field(hero, "secondary_button_text", "WhatsApp")}
          </a>
        </Button>
      </PageHero>

      <section className="py-16">
        <div className="shell">
          <Reveal className="overflow-hidden rounded-3xl border border-border shadow-float">
            <iframe
              title={`${BRAND.nameTitle} location map`}
              src={MAP_SRC}
              className="h-[380px] w-full lg:h-[460px]"
              loading="lazy"
            />
          </Reveal>

          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            <Reveal className="rounded-3xl border border-border bg-card p-8 shadow-soft">
              <span className="grid h-11 w-11 place-items-center rounded-xl accent-gradient text-accent-foreground">
                <MapPin className="h-5 w-5" />
              </span>
              <h2 className="mt-5 font-display text-lg font-semibold">{field(detailsS, "heading", "Address")}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{business.address}</p>
              <p className="mt-4 text-sm text-muted-foreground">
                {field(detailsS, "description", "Free customer parking on site. Five minutes from the A41.")}
              </p>
            </Reveal>

            <Reveal delay={80} className="rounded-3xl border border-border bg-card p-8 shadow-soft">
              <span className="grid h-11 w-11 place-items-center rounded-xl accent-gradient text-accent-foreground">
                <Phone className="h-5 w-5" />
              </span>
              <h2 className="mt-5 font-display text-lg font-semibold">Get in touch</h2>
              <a href={business.phone_href} className="mt-3 block text-sm font-medium hover:text-accent">
                {business.phone}
              </a>
              <a
                href={`mailto:${business.email}`}
                className="mt-2 flex items-center gap-2 text-sm text-muted-foreground hover:text-accent"
              >
                <Mail className="h-4 w-4" /> {business.email}
              </a>
              <a
                href={business.whatsapp}
                target="_blank"
                rel="noreferrer"
                className="mt-2 flex items-center gap-2 text-sm text-muted-foreground hover:text-accent"
              >
                <MessageCircle className="h-4 w-4" /> Message us on WhatsApp
              </a>
            </Reveal>

            <Reveal delay={160} className="rounded-3xl border border-border bg-card p-8 shadow-soft">
              <span className="grid h-11 w-11 place-items-center rounded-xl accent-gradient text-accent-foreground">
                <Clock className="h-5 w-5" />
              </span>
              <h2 className="mt-5 font-display text-lg font-semibold">{field(hoursS, "heading", "Opening hours")}</h2>
              <ul className="mt-4 space-y-2 text-sm">
                {hours.map((h) => (
                  <li key={h.title} className="flex justify-between gap-4">
                    <span className="text-muted-foreground">{h.title}</span>
                    <span className="font-medium">{h.text}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="surface-ink py-20">
        <div className="shell grid gap-12 lg:grid-cols-2">
          <Reveal>
            <p className="eyebrow">{field(ctaS, "eyebrow", "Have A Question?")}</p>
            <h2 className="mt-3 font-display text-3xl font-semibold text-ink-foreground sm:text-4xl">
              {field(ctaS, "heading", "Send us an enquiry")}
            </h2>
            <p className="mt-4 max-w-md text-ink-muted">
              {field(
                ctaS,
                "description",
                "Ask about a specific vehicle, book a viewing or arrange a test drive. We reply to every message within one working hour.",
              )}
            </p>
            <div className="mt-8 grid gap-3 sm:max-w-sm">
              <Button asChild variant="accent" className="h-12">
                <a href={business.phone_href}>
                  <Phone className="h-4 w-4" /> Call Us
                </a>
              </Button>
              <Button asChild variant="outline" className="h-12 text-black hover:text-black">
                <a href={`mailto:${business.email}`}>
                  <Mail className="h-4 w-4" /> Email Us
                </a>
              </Button>
              <Button asChild variant="outline" className="h-12 text-black hover:text-black">
                <a href={business.whatsapp} target="_blank" rel="noreferrer">
                  <MessageCircle className="h-4 w-4" /> WhatsApp
                </a>
              </Button>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <form
              className="rounded-3xl border border-ink-border bg-white/5 p-8 backdrop-blur-xl"
              onSubmit={async (e) => {
                e.preventDefault();
                if (!form.name.trim() || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email.trim())) {
                  toast.error("Please add your name and a valid email");
                  return;
                }
                try {
                  await submitEnquiry({
                    name: form.name.trim(),
                    email: form.email.trim(),
                    phone: form.phone.trim() || null,
                    subject: "Find us page enquiry",
                    message: form.message.trim() || "General showroom enquiry",
                    source: "find-us",
                  });
                } catch {
                  toast.error("Could not send your enquiry — please try again");
                  return;
                }
                toast.success("Enquiry sent — we'll be in touch shortly");
                setForm({ name: "", email: "", phone: "", message: "" });
              }}
            >
              <div className="grid gap-5">
                {([
                  ["Name", "name", "text", "Jane Smith"],
                  ["Email", "email", "email", "jane@email.com"],
                  ["Phone", "phone", "tel", "07…"],
                ] as const).map(([label, key, type, placeholder]) => (
                  <div key={key}>
                    <Label className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
                      {label}
                    </Label>
                    <Input
                      type={type}
                      value={form[key]}
                      placeholder={placeholder}
                      onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value.slice(0, 160) }))}
                      className="mt-2 border-ink-border bg-white/5 text-ink-foreground placeholder:text-ink-muted"
                    />
                  </div>
                ))}
                <div>
                  <Label className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
                    Message
                  </Label>
                  <Textarea
                    rows={5}
                    value={form.message}
                    placeholder="How can we help?"
                    onChange={(e) => setForm((f) => ({ ...f, message: e.target.value.slice(0, 1500) }))}
                    className="mt-2 border-ink-border bg-white/5 text-ink-foreground placeholder:text-ink-muted"
                  />
                </div>
              </div>
              <Button type="submit" variant="accent" size="lg" className="mt-7 w-full">
                {field(ctaS, "button_text", "Send Enquiry")}
              </Button>
            </form>
          </Reveal>
        </div>
      </section>
    </>
  );
}
