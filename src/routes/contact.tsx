import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Reveal } from "@/components/site/Reveal";
import { submitEnquiry } from "@/lib/cms";
import { cardsField, field, useBusiness, usePageSections } from "@/lib/site-content";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact J1 Auto Trade | Manchester Showroom" },
      {
        name: "description",
        content:
          "Call 0161 496 0100, message us on WhatsApp or visit the J1 Auto Trade showroom in Manchester. Open seven days a week.",
      },
      { property: "og:title", content: "Contact J1 Auto Trade" },
      { property: "og:description", content: "Call, WhatsApp or visit our Manchester showroom, open seven days." },
    ],
  }),
  component: Contact,
});

type DetailCard = { title: string; text: string; url?: string };
type HourCard = { title: string; text: string };

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const business = useBusiness();

  const sections = usePageSections("contact");
  const hero = sections["hero"];
  const detailsS = sections["details"];
  const formS = sections["form"];
  const hoursS = sections["hours"];
  const mapS = sections["map"];

  const DETAILS_FALLBACK: DetailCard[] = [
    { title: "Call the showroom", text: business.phone, url: business.phone_href },
    { title: "Email us", text: business.email, url: `mailto:${business.email}` },
    { title: "Visit us", text: business.address },
  ];
  const HOURS_FALLBACK: HourCard[] = business.hours.map((h) => ({ title: h.day, text: h.time }));

  const details = cardsField<DetailCard>(detailsS, DETAILS_FALLBACK);
  const hours = cardsField<HourCard>(hoursS, HOURS_FALLBACK);

  const detailIcons = [Phone, Mail, MapPin];

  return (
    <>
      <section className="surface-ink pb-16 pt-32">
        <div className="shell max-w-3xl">
          <p className="eyebrow">{field(hero, "eyebrow", "Get in touch")}</p>
          <h1 className="mt-3 font-display text-4xl font-semibold text-ink-foreground sm:text-6xl">
            {field(hero, "heading", "We're here seven days a week")}
          </h1>
          <p className="mt-5 text-ink-muted">
            {field(
              hero,
              "description",
              "Whether you want a walkaround video, a finance quote or directions to the showroom — just ask.",
            )}
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="shell grid gap-10 lg:grid-cols-[minmax(0,1fr)_380px]">
          <Reveal>
            <form
              className="rounded-2xl border border-border bg-card p-8 shadow-soft"
              onSubmit={async (e) => {
                e.preventDefault();
                if (form.name.trim().length < 2 || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email) || form.message.trim().length < 5) {
                  toast.error("Please complete the form with a valid email");
                  return;
                }
                try {
                  await submitEnquiry({
                    name: form.name.trim(),
                    email: form.email.trim(),
                    phone: form.phone.trim() || null,
                    subject: "Website contact enquiry",
                    message: form.message.trim(),
                    source: "contact",
                  });
                } catch {
                  toast.error("Could not send your message — please try again");
                  return;
                }
                toast.success("Message sent — we'll reply within the hour");
                setForm({ name: "", email: "", phone: "", message: "" });
              }}
            >
              <h2 className="font-display text-2xl font-semibold">
                {field(formS, "heading", "Send us a message")}
              </h2>
              {field(formS, "description", "") && (
                <p className="mt-2 text-sm text-muted-foreground">{field(formS, "description", "")}</p>
              )}
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div>
                  <Label className="mb-1.5 block text-xs uppercase tracking-widest text-muted-foreground">Full name</Label>
                  <Input maxLength={100} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </div>
                <div>
                  <Label className="mb-1.5 block text-xs uppercase tracking-widest text-muted-foreground">Email</Label>
                  <Input type="email" maxLength={255} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                </div>
                <div className="sm:col-span-2">
                  <Label className="mb-1.5 block text-xs uppercase tracking-widest text-muted-foreground">Phone</Label>
                  <Input maxLength={40} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                </div>
              </div>
              <div className="mt-4">
                <Label className="mb-1.5 block text-xs uppercase tracking-widest text-muted-foreground">Message</Label>
                <Textarea rows={6} maxLength={1000} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
              </div>
              <Button type="submit" size="xl" variant="accent" className="mt-7 w-full">
                {field(formS, "button_text", "Send message")}
              </Button>
            </form>

            {(field(mapS, "heading", "") || field(mapS, "description", "")) && (
              <div className="mt-8">
                {field(mapS, "heading", "") && (
                  <h3 className="font-display text-xl font-semibold">{field(mapS, "heading", "")}</h3>
                )}
                {field(mapS, "description", "") && (
                  <p className="mt-2 text-sm text-muted-foreground">{field(mapS, "description", "")}</p>
                )}
              </div>
            )}

            <div className="mt-8 overflow-hidden rounded-2xl border border-border shadow-soft">
              <iframe
                title="J1 Auto Trade showroom map"
                src="https://www.openstreetmap.org/export/embed.html?bbox=-2.35%2C53.44%2C-2.19%2C53.52&layer=mapnik"
                className="h-[360px] w-full"
                loading="lazy"
              />
            </div>

            {field(mapS, "button_text", "") && (
              <Button asChild size="lg" variant="outline" className="mt-4">
                <a href={field(mapS, "button_url", "#")} target="_blank" rel="noreferrer">
                  {field(mapS, "button_text", "")}
                </a>
              </Button>
            )}
          </Reveal>

          <Reveal delay={100} className="lg:sticky lg:top-28 lg:h-fit">
            <div className="space-y-4">
              {field(detailsS, "eyebrow", "") && <p className="eyebrow">{field(detailsS, "eyebrow", "")}</p>}
              {field(detailsS, "heading", "") && (
                <h2 className="font-display text-xl font-semibold">{field(detailsS, "heading", "")}</h2>
              )}
              {field(detailsS, "description", "") && (
                <p className="text-sm text-muted-foreground">{field(detailsS, "description", "")}</p>
              )}
              {details.map((d, i) => (
                <ContactCard key={d.title} icon={detailIcons[i] ?? Phone} title={d.title} body={d.text} href={d.url} />
              ))}

              <div className="rounded-2xl border border-border bg-card p-7 shadow-soft">
                <Clock className="h-5 w-5 text-accent" />
                <h3 className="mt-4 font-semibold">{field(hoursS, "heading", "Opening hours")}</h3>
                {field(hoursS, "description", "") && (
                  <p className="mt-1 text-sm text-muted-foreground">{field(hoursS, "description", "")}</p>
                )}
                <ul className="mt-4 space-y-2 text-sm">
                  {hours.map((h) => (
                    <li key={h.title} className="flex justify-between gap-4">
                      <span className="text-muted-foreground">{h.title}</span>
                      <span className="font-medium">{h.text}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Button asChild size="xl" variant="accent" className="w-full">
                <a href={business.whatsapp} target="_blank" rel="noreferrer">
                  <MessageCircle /> Chat on WhatsApp
                </a>
              </Button>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

function ContactCard({
  icon: Icon,
  title,
  body,
  href,
}: {
  icon: typeof Phone;
  title: string;
  body: string;
  href?: string | undefined;
}) {
  const content = (
    <div className="rounded-2xl border border-border bg-card p-7 shadow-soft transition-all duration-400 hover:-translate-y-1 hover:border-accent">
      <Icon className="h-5 w-5 text-accent" />
      <h3 className="mt-4 font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{body}</p>
    </div>
  );
  return href ? <a href={href}>{content}</a> : content;
}
