import { createFileRoute, Link } from "@tanstack/react-router";
import { stockSearch } from "@/lib/stock-search";
import { CheckCircle2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/data/vehicles";
import { useCatalogue } from "@/lib/public-vehicles";

export const Route = createFileRoute("/order-confirmed")({
  validateSearch: (s: Record<string, unknown>) => ({
    id: typeof s["id"] === "string" ? (s["id"] as string) : "",
    mode: s['mode'] === "deposit" ? ("deposit" as const) : ("full" as const),
    email: typeof s["email"] === "string" ? (s["email"] as string) : "",
  }),
  head: () => ({
    meta: [
      { title: "Order Confirmed | J1 Auto Trade" },
      { name: "description", content: "Your J1 Auto Trade order has been confirmed." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Order Confirmed | J1 Auto Trade" },
      { property: "og:description", content: "Your J1 Auto Trade order has been confirmed." },
    ],
  }),
  component: Confirmed,
});

function Confirmed() {
  const { id, mode, email } = Route.useSearch();
  const catalogue = useCatalogue();
  const vehicle = catalogue.find((v) => v.id === id);

  return (
    <section className="pb-24 pt-36">
      <div className="shell max-w-2xl text-center">
        <span className="mx-auto grid h-20 w-20 place-items-center rounded-full accent-gradient text-accent-foreground shadow-glow">
          <CheckCircle2 className="h-9 w-9" />
        </span>
        <h1 className="mt-8 font-display text-4xl font-semibold sm:text-5xl">
          {mode === "deposit" ? "Vehicle reserved" : "Order confirmed"}
        </h1>
        <p className="mt-4 text-muted-foreground">
          {mode === "deposit"
            ? "Your deposit has been received and this vehicle is now marked as reserved for 7 days."
            : "Thank you — your purchase is complete and your vehicle is being prepared for delivery."}
        </p>

        {vehicle && (
          <div className="mt-10 overflow-hidden rounded-2xl border border-border bg-card text-left shadow-float">
            <img src={vehicle.image} alt={`${vehicle.make} ${vehicle.model}`} loading="lazy" className="aspect-[16/9] w-full object-cover" />
            <div className="p-7">
              <span className="rounded-full bg-accent/10 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-accent">
                {mode === "deposit" ? "Reserved" : "Sold"}
              </span>
              <h2 className="mt-4 font-display text-2xl font-semibold">
                {vehicle.year} {vehicle.make} {vehicle.model}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">{vehicle.variant}</p>
              <div className="mt-5 flex justify-between border-t border-border pt-5 text-sm">
                <span className="text-muted-foreground">Paid today</span>
                <span className="font-semibold">
                  {formatPrice(mode === "deposit" ? 199 : vehicle.price)}
                </span>
              </div>
              <div className="mt-3 flex justify-between text-sm">
                <span className="text-muted-foreground">Order reference</span>
                <span className="font-semibold uppercase">AX-{vehicle.id.slice(-6)}</span>
              </div>
            </div>
          </div>
        )}

        <p className="mt-8 flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Mail className="h-4 w-4 text-accent" />
          A confirmation email has been sent{email ? ` to ${email}` : ""}.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Button asChild size="lg" variant="accent">
            <Link to="/stocklist" search={stockSearch()}>Browse more stock</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link to="/contact">Contact the team</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
