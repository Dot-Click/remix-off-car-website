import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { stockSearch } from "@/lib/stock-search";
import { useEffect, useState } from "react";
import { submitEnquiry } from "@/lib/cms";
import {
  CalendarDays,
  Car,
  CheckCircle2,
  Cog,
  Fuel,
  Gauge,
  Palette,
  ShieldCheck,
  Zap,
  Phone,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { VehicleCard } from "@/components/site/VehicleCard";
import { Reveal } from "@/components/site/Reveal";
import { VEHICLES, formatMiles, formatPrice, getVehicle, type Vehicle } from "@/data/vehicles";
import { getPublicVehicleRow } from "@/lib/public-vehicles.functions";
import { mapRowToVehicle } from "@/lib/vehicle-map";
import { VehicleGallery } from "@/components/site/VehicleGallery";
import { BRAND } from "@/lib/brand";

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.999-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

export const Route = createFileRoute("/vehicle/$id")({
  loader: async ({ params }) => {
    const staticVehicle = getVehicle(params.id);
    if (staticVehicle) return { vehicle: staticVehicle };

    const result = await getPublicVehicleRow({ data: { id: params.id } });
    if (!result) throw notFound();

    const { row, image, gallery } = result;
    const vehicle = mapRowToVehicle(row, image, gallery);
    return { vehicle };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Vehicle unavailable | J1 Auto Trade" }, { name: "robots", content: "noindex" }] };
    }
    const v = loaderData.vehicle;
    const title = `${v.year} ${v.make} ${v.model} — ${formatPrice(v.price)} | J1 Auto Trade`;
    const description = `${v.year} ${v.make} ${v.model} ${v.variant}, ${formatMiles(v.mileage)}, ${v.transmission}, ${v.fuel}. Finance from ${formatPrice(v.monthly)} per month.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  component: VehiclePage,
});

function VehiclePage() {
  const { vehicle } = Route.useLoaderData();
  const [deposit, setDeposit] = useState([Math.round(vehicle.price * 0.1)]);
  const [term, setTerm] = useState([48]);
  const [enquiry, setEnquiry] = useState({
  name: "",
  email: "",
  whatsapp: "",
  message: "",
});

  const canBuyOnline = vehicle.onlinePurchase !== false && vehicle.status !== "Sold";

  const whatsappHref = `${BRAND.whatsapp}?text=${encodeURIComponent(
    `Hi, I'm interested in the ${vehicle.year} ${vehicle.make} ${vehicle.model}. Please provide more details.`,
  )}`;

  const scrollToEnquiry = () => {
    document.getElementById("enquire")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Scroll to the enquiry form when arriving with #enquire (after data has loaded).
  useEffect(() => {
    if (window.location.hash !== "#enquire") return;
    const t = window.setTimeout(scrollToEnquiry, 150);
    return () => window.clearTimeout(t);
  }, [vehicle.id]);

  const depositValue = deposit[0] ?? 0;
  const termValue = term[0] ?? 48;
  const financed = Math.max(vehicle.price - depositValue, 0);
  const monthly = Math.round((financed * (1 + 0.069 * (termValue / 12))) / termValue);

  const related = VEHICLES.filter(
    (v) => v.id !== vehicle.id && (v.make === vehicle.make || v.bodyType === vehicle.bodyType),
  ).slice(0, 4);

  const specs = [
    { icon: CalendarDays, label: "Year", value: String(vehicle.year) },
    { icon: Gauge, label: "Mileage", value: formatMiles(vehicle.mileage) },
    { icon: Cog, label: "Transmission", value: vehicle.transmission },
    { icon: Fuel, label: "Fuel", value: vehicle.fuel },
    { icon: Zap, label: "Engine", value: vehicle.engine },
    { icon: Palette, label: "Colour", value: vehicle.colour },
    ...(vehicle.interiorColour
      ? [{ icon: Palette, label: "Interior", value: vehicle.interiorColour }]
      : []),
    { icon: Car, label: "Body / Drive", value: `${vehicle.bodyType} · ${vehicle.driveType}` },
    { icon: ShieldCheck, label: "Doors", value: `${vehicle.doors} doors` },
  ];

  return (
    <>
      <section className="surface-ink pb-10 pt-28">
        <div className="shell">
          <nav className="text-xs text-ink-muted">
            <Link to="/" className="hover:text-accent">Home</Link> ·{" "}
            <Link to="/stocklist" search={stockSearch()} className="hover:text-accent">Stock</Link> ·{" "}
            <span className="text-ink-foreground">{vehicle.make} {vehicle.model}</span>
          </nav>
          <h1 className="mt-4 font-display text-3xl font-semibold text-ink-foreground sm:text-5xl">
            {vehicle.year} {vehicle.make} {vehicle.model}
          </h1>
          <p className="mt-3 text-ink-muted">{vehicle.variant} · {formatMiles(vehicle.mileage)} · {vehicle.transmission}</p>
        </div>
      </section>

      <section className="py-14">
        <div className="shell grid gap-10 lg:grid-cols-[minmax(0,1fr)_380px]">
          <div className="min-w-0">
            {/* Gallery */}
            <VehicleGallery
              images={vehicle.gallery.length ? vehicle.gallery : [vehicle.image]}
              alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
            />

            {/* Specs */}
            <div className="mt-12">
              <h2 className="font-display text-2xl font-semibold">Specification</h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {specs.map((s) => (
                  <div key={s.label} className="rounded-xl border border-border bg-card p-4 shadow-soft">
                    <s.icon className="h-4 w-4 text-accent" />
                    <p className="mt-3 text-[11px] uppercase tracking-widest text-muted-foreground">{s.label}</p>
                    <p className="mt-1 truncate text-sm font-semibold">{s.value}</p>
                  </div>
                ))}
              </div>
              <dl className="mt-6 grid gap-3 rounded-xl border border-border bg-secondary p-5 text-sm sm:grid-cols-2">
                {vehicle.vin !== "\u2014" && (
                  <div className="flex justify-between gap-4"><dt className="text-muted-foreground">VIN</dt><dd className="font-medium">{vehicle.vin}</dd></div>
                )}
                {vehicle.registration !== "\u2014" && (
                  <div className="flex justify-between gap-4"><dt className="text-muted-foreground">Registration</dt><dd className="font-medium">{vehicle.registration}</dd></div>
                )}
                <div className="flex justify-between gap-4"><dt className="text-muted-foreground">Stock status</dt><dd className="font-medium">{vehicle.status}</dd></div>
                <div className="flex justify-between gap-4"><dt className="text-muted-foreground">Stock ref</dt><dd className="font-medium uppercase">{vehicle.id.slice(-4)}</dd></div>
              </dl>
            </div>

            {/* Description */}
            <div className="mt-12">
              <h2 className="font-display text-2xl font-semibold">Description</h2>
              <p className="mt-4 leading-relaxed text-muted-foreground">{vehicle.description}</p>
            </div>

            {/* Video */}
            {vehicle.videoUrl && (
              <div className="mt-12">
                <h2 className="font-display text-2xl font-semibold">Video</h2>
                <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-secondary shadow-soft">
                  <video src={vehicle.videoUrl} controls className="aspect-video w-full" />
                </div>
              </div>
            )}

            {/* Features */}
            {vehicle.features.length > 0 && (
              <div className="mt-12">
                <h2 className="font-display text-2xl font-semibold">Features</h2>
                <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {vehicle.features.map((f: string) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-accent" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Finance calculator */}
            <div className="mt-12 rounded-2xl surface-ink p-8">
              <h2 className="font-display text-2xl font-semibold text-ink-foreground">
                Finance calculator
              </h2>
              <div className="mt-7 grid gap-8 sm:grid-cols-2">
                <div>
                  <div className="flex justify-between text-sm text-ink-muted">
                    <span>Deposit</span>
                    <span className="font-semibold text-ink-foreground">{formatPrice(depositValue)}</span>
                  </div>
                  <Slider className="mt-4" value={deposit} onValueChange={setDeposit} min={0} max={Math.round(vehicle.price * 0.5)} step={250} />
                </div>
                <div>
                  <div className="flex justify-between text-sm text-ink-muted">
                    <span>Term</span>
                    <span className="font-semibold text-ink-foreground">{termValue} months</span>
                  </div>
                  <Slider className="mt-4" value={term} onValueChange={setTerm} min={12} max={60} step={12} />
                </div>
              </div>
              <div className="mt-8 flex flex-wrap items-end justify-between gap-4 border-t border-ink-border pt-6">
                <div>
                  <p className="text-xs uppercase tracking-widest text-ink-muted">Estimated monthly</p>
                  <p className="font-display text-4xl font-bold text-accent">{formatPrice(monthly)}</p>
                  <p className="mt-1 text-xs text-ink-muted">Representative 6.9% APR. Subject to status.</p>
                </div>
                <Button asChild size="lg" variant="accent">
                  <Link to="/finance">Apply for finance</Link>
                </Button>
              </div>
            </div>

            {/* History + map */}
            <div className="mt-12 grid gap-6 lg:grid-cols-2">
              <div className="rounded-2xl border border-border bg-card p-7 shadow-soft">
                <h3 className="font-display text-xl font-semibold">Vehicle history</h3>
                <ul className="mt-5 space-y-3 text-sm">
                  {["HPI clear — no outstanding finance", "Full main dealer service history", "Two former keepers", "MOT valid with no advisories", "165-point J1 inspection passed"].map((h) => (
                    <li key={h} className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-accent" />
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="overflow-hidden rounded-2xl border border-border shadow-soft">
                <iframe
                  title="Vehicle location"
                  src="https://www.openstreetmap.org/export/embed.html?bbox=-2.35%2C53.44%2C-2.19%2C53.52&layer=mapnik"
                  className="h-full min-h-[260px] w-full"
                  loading="lazy"
                />
              </div>
            </div>

            {/* Enquiry */}
            <form
              id="enquire"
              className="mt-12 scroll-mt-28 rounded-2xl border border-border bg-secondary p-8"
              onSubmit={async (e) => {
                e.preventDefault();
                if (enquiry.name.trim().length < 2 || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(enquiry.email)) {
                  toast.error("Please add your name and a valid email");
                  return;
                }
                const isUuid =
                  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(vehicle.id);
                try {
                  await submitEnquiry({
              name: enquiry.name.trim(),
              email: enquiry.email.trim(),
              phone: enquiry.whatsapp.trim(),
              message: enquiry.message.trim() || "Enquiry from vehicle page",
             subject: `Enquiry: ${vehicle.year} ${vehicle.make} ${vehicle.model}`,
            source: "vehicle",
            vehicle_id: isUuid ? vehicle.id : null,
            vehicle_label: `${vehicle.year} ${vehicle.make} ${vehicle.model}`,
             });
                } catch {
                  toast.error("Could not send your enquiry — please try again");
                  return;
                }
                toast.success("Enquiry sent — a specialist will call you shortly");
                setEnquiry({ name: "", email: "", whatsapp: "", message: "" });
              }}
            >
              <h3 className="font-display text-xl font-semibold">Request Inquiry</h3>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <Input placeholder="Your name" maxLength={100} value={enquiry.name} onChange={(e) => setEnquiry({ ...enquiry, name: e.target.value })} />
                <Input type="email" placeholder="Email address" maxLength={255} value={enquiry.email} onChange={(e) => setEnquiry({ ...enquiry, email: e.target.value })} />
              </div>
              <Textarea className="mt-4" rows={4} maxLength={1000} placeholder="Your message" value={enquiry.message} onChange={(e) => setEnquiry({ ...enquiry, message: e.target.value })} />
              <Button type="submit" className="mt-5" size="lg" variant="accent">Send Inquiry Request</Button>
            </form>
          </div>

          {/* Sticky purchase panel */}
          <aside className="lg:sticky lg:top-28 lg:h-fit">
            <div className="rounded-2xl border border-border bg-card p-7 shadow-float">
              <p className="text-xs uppercase tracking-widest text-muted-foreground">Our price</p>
              <p className="mt-1 font-display text-4xl font-bold">{formatPrice(vehicle.price)}</p>
              <p className="mt-2 text-sm text-muted-foreground">
                or <span className="font-semibold text-accent">{formatPrice(vehicle.monthly)}/mo</span> on finance
              </p>

              <div className="mt-6 grid gap-2.5">
                {canBuyOnline ? (
                  <>
                    <Button asChild size="lg" variant="accent">
                      <Link to="/checkout/$id" params={{ id: vehicle.id }} search={{ mode: "full" }}>
                        Buy Now <ArrowRight />
                      </Link>
                    </Button>
                    <Button asChild size="lg">
                      <Link to="/checkout/$id" params={{ id: vehicle.id }} search={{ mode: "deposit" }}>
                        Reserve with £199 deposit
                      </Link>
                    </Button>
                  </>
                ) : null}
                <Button
                  size="lg"
                  variant={canBuyOnline ? "outline" : "accent"}
                  onClick={scrollToEnquiry}
                >
                  Request Inquiry <ArrowRight />
                </Button>
                <Button asChild size="lg" variant="outline">
                  <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
                    <WhatsAppIcon className="h-5 w-5" /> WhatsApp
                  </a>
                </Button>
                <Button size="lg" variant="outline" onClick={() => toast.success("Test drive request received")}>
                  Book a test drive
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link to="/finance">Apply for finance</Link>
                </Button>
                <Button asChild size="lg" variant="ghost">
                  <a href="tel:+441614960100">
                    <Phone /> Contact dealer
                  </a>
                </Button>
              </div>

              <ul className="mt-7 space-y-2 border-t border-border pt-6 text-xs text-muted-foreground">
                <li>✓ 12-month warranty included</li>
                <li>✓ Free nationwide delivery over £30,000</li>
                <li>✓ Part exchange welcome</li>
              </ul>
            </div>
          </aside>
        </div>
      </section>

      <section className="bg-secondary py-20">
        <div className="shell">
          <h2 className="font-display text-3xl font-semibold">Related vehicles</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((v, i) => (
              <Reveal key={v.id} delay={i * 60}>
                <VehicleCard vehicle={v} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
