import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { CreditCard, Lock, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { formatPrice, getVehicle } from "@/data/vehicles";
import { getPublicVehicleRow } from "@/lib/public-vehicles.functions";
import { mapRowToVehicle } from "@/lib/vehicle-map";

const DEPOSIT = 199;

export const Route = createFileRoute("/checkout/$id")({
  validateSearch: (s: Record<string, unknown>) => ({
    mode: s['mode'] === "deposit" ? ("deposit" as const) : ("full" as const),
  }),
  loader: async ({ params }) => {
    const staticVehicle = getVehicle(params.id);
    if (staticVehicle) return { vehicle: staticVehicle };

    const result = await getPublicVehicleRow({ data: { id: params.id } });
    if (!result) throw notFound();
    return { vehicle: mapRowToVehicle(result.row, result.image, result.gallery) };
  },
  head: () => ({
    meta: [
      { title: "Secure Checkout | J1 Auto Trade" },
      { name: "description", content: "Complete your purchase or reserve your vehicle securely." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Secure Checkout | J1 Auto Trade" },
      { property: "og:description", content: "Complete your purchase or reserve your vehicle." },
    ],
  }),
  component: Checkout,
});

function Checkout() {
  const { vehicle } = Route.useLoaderData();
  const { mode } = Route.useSearch();
  const navigate = useNavigate();
  const [payMode, setPayMode] = useState<"full" | "deposit">(mode);
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "", city: "", postcode: "" });
  const [submitting, setSubmitting] = useState(false);

  const amount = payMode === "full" ? vehicle.price : DEPOSIT;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.name.trim().length < 2 || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email) || form.postcode.trim().length < 4) {
      toast.error("Please complete your billing details");
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      navigate({
        to: "/order-confirmed",
        search: { id: vehicle.id, mode: payMode, email: form.email },
      });
    }, 900);
  };

  return (
    <section className="pb-24 pt-32">
      <div className="shell">
        <p className="eyebrow">Secure checkout</p>
        <h1 className="mt-3 font-display text-4xl font-semibold sm:text-5xl">
          {payMode === "full" ? "Complete your purchase" : "Reserve your vehicle"}
        </h1>

        <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,1fr)_400px]">
          <form onSubmit={submit} className="min-w-0 space-y-8">
            <div className="rounded-2xl border border-border bg-card p-7 shadow-soft">
              <h2 className="font-display text-xl font-semibold">Billing details</h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <Field label="Full name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
                <Field label="Email" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
                <Field label="Phone" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} />
                <Field label="Postcode" value={form.postcode} onChange={(v) => setForm({ ...form, postcode: v })} />
                <div className="sm:col-span-2">
                  <Field label="Address" value={form.address} onChange={(v) => setForm({ ...form, address: v })} />
                </div>
                <div className="sm:col-span-2">
                  <Field label="City" value={form.city} onChange={(v) => setForm({ ...form, city: v })} />
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-7 shadow-soft">
              <h2 className="font-display text-xl font-semibold">Payment method</h2>
              <RadioGroup
                className="mt-6 grid gap-3"
                value={payMode}
                onValueChange={(v) => setPayMode(v as "full" | "deposit")}
              >
                <label className="flex cursor-pointer items-center gap-4 rounded-xl border border-border p-5 transition-colors hover:border-accent">
                  <RadioGroupItem value="full" />
                  <span className="min-w-0">
                    <span className="block font-semibold">Pay in full</span>
                    <span className="block text-sm text-muted-foreground">
                      {formatPrice(vehicle.price)} — vehicle marked sold immediately
                    </span>
                  </span>
                </label>
                <label className="flex cursor-pointer items-center gap-4 rounded-xl border border-border p-5 transition-colors hover:border-accent">
                  <RadioGroupItem value="deposit" />
                  <span className="min-w-0">
                    <span className="block font-semibold">Reserve with deposit</span>
                    <span className="block text-sm text-muted-foreground">
                      {formatPrice(DEPOSIT)} — fully refundable, held for 7 days
                    </span>
                  </span>
                </label>
              </RadioGroup>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <Field label="Card number" placeholder="4242 4242 4242 4242" value="" onChange={() => {}} />
                </div>
                <Field label="Expiry" placeholder="MM/YY" value="" onChange={() => {}} />
                <Field label="CVC" placeholder="123" value="" onChange={() => {}} />
              </div>
              <p className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                <Lock className="h-3.5 w-3.5 text-accent" /> Demo checkout — no card is charged. Connect a
                payment provider to take live payments.
              </p>
            </div>

            <Button type="submit" size="xl" variant="accent" className="w-full" disabled={submitting}>
              <CreditCard /> {submitting ? "Processing…" : `Pay ${formatPrice(amount)}`}
            </Button>
          </form>

          <aside className="lg:sticky lg:top-28 lg:h-fit">
            <div className="rounded-2xl border border-border bg-card p-7 shadow-float">
              <h2 className="font-display text-xl font-semibold">Order summary</h2>
              <div className="mt-5 overflow-hidden rounded-xl">
                <img src={vehicle.image} alt={`${vehicle.make} ${vehicle.model}`} loading="lazy" className="aspect-[16/10] w-full object-cover" />
              </div>
              <p className="mt-4 font-semibold">{vehicle.year} {vehicle.make} {vehicle.model}</p>
              <p className="text-sm text-muted-foreground">{vehicle.variant}</p>

              <dl className="mt-6 space-y-3 border-t border-border pt-5 text-sm">
                <Row label="Vehicle price" value={formatPrice(vehicle.price)} />
                <Row label="Admin fee" value="Included" />
                <Row label="Delivery" value="Free" />
                <div className="flex justify-between border-t border-border pt-4 text-base font-semibold">
                  <dt>{payMode === "full" ? "Total due today" : "Deposit due today"}</dt>
                  <dd className="text-accent">{formatPrice(amount)}</dd>
                </div>
                {payMode === "deposit" && (
                  <Row label="Balance on collection" value={formatPrice(vehicle.price - DEPOSIT)} />
                )}
              </dl>

              <p className="mt-6 flex items-start gap-2 text-xs text-muted-foreground">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                Deposits are fully refundable within 7 days. 12-month warranty included.
              </p>
              <Button asChild variant="ghost" className="mt-4 w-full">
                <Link to="/vehicle/$id" params={{ id: vehicle.id }}>Back to vehicle</Link>
              </Button>
            </div>
          </aside>
        </div>
      </div>
    </section>
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
      <Input
        type={type}
        value={value}
        placeholder={placeholder}
        maxLength={255}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-medium">{value}</dd>
    </div>
  );
}
