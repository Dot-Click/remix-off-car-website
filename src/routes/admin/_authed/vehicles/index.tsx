import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Pencil, Plus, Search, Star, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { StorageImage } from "@/components/admin/StorageImage";
import { AdminShell } from "@/components/admin/AdminShell";
import {
  BODY_TYPES,
  FUEL_TYPES,
  VEHICLE_STATUSES,
  deleteVehicle,
  gbp,
  listVehicles,
  miles,
  shortDate,
  updateVehicle,
  type AdminVehicle,
} from "@/lib/vehicle-admin";

export const Route = createFileRoute("/admin/_authed/vehicles/")({
  head: () => ({
    meta: [
      { title: "Vehicle Management | J1 Autoland Admin" },
      { name: "description", content: "Manage the J1 Autoland vehicle inventory." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Vehicle Management | J1 Autoland Admin" },
      { property: "og:description", content: "Manage the J1 Autoland vehicle inventory." },
    ],
  }),
  component: AdminVehicles,
});

const ALL = "all";

function AdminVehicles() {
  const queryClient = useQueryClient();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<string>(ALL);
  const [bodyType, setBodyType] = useState<string>(ALL);
  const [fuel, setFuel] = useState<string>(ALL);
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [pending, setPending] = useState<AdminVehicle | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-vehicles"],
    queryFn: listVehicles,
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["admin-vehicles"] });

  const removeMutation = useMutation({
    mutationFn: deleteVehicle,
    onSuccess: () => {
      toast.success("Vehicle deleted");
      setPending(null);
      void invalidate();
    },
    onError: (e: Error) => toast.error(e.message || "Delete failed"),
  });

  const patchMutation = useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: Parameters<typeof updateVehicle>[1] }) =>
      updateVehicle(id, patch),
    onSuccess: () => {
      toast.success("Vehicle updated");
      void invalidate();
    },
    onError: (e: Error) => toast.error(e.message || "Update failed"),
  });

  const rows = useMemo(() => {
    const term = q.trim().toLowerCase();
    return (data ?? []).filter((v) => {
      if (term && !`${v.make} ${v.model} ${v.year}`.toLowerCase().includes(term)) return false;
      if (status !== ALL && v.status !== status) return false;
      if (bodyType !== ALL && v.body_type !== bodyType) return false;
      if (fuel !== ALL && v.fuel_type !== fuel) return false;
      if (featuredOnly && !v.featured) return false;
      return true;
    });
  }, [data, q, status, bodyType, fuel, featuredOnly]);

  return (
    <AdminShell
      title="All vehicles"
      description={
        data ? `${data.length} vehicle${data.length === 1 ? "" : "s"} in the database` : "Loading inventory\u2026"
      }
      breadcrumbs={[{ label: "Vehicles" }]}
      actions={
        <Button asChild variant="accent">
          <Link to="/admin/vehicles/new">
            <Plus /> Add new vehicle
          </Link>
        </Button>
      }
    >
      <div>
        <div className="grid gap-3 rounded-2xl border border-border bg-card p-5 shadow-soft md:grid-cols-2 lg:grid-cols-5">
          <div className="relative lg:col-span-2">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder="Search make, model or year"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
          <FilterSelect value={status} onChange={setStatus} label="All statuses" options={[...VEHICLE_STATUSES]} />
          <FilterSelect value={bodyType} onChange={setBodyType} label="All body types" options={BODY_TYPES} />
          <FilterSelect value={fuel} onChange={setFuel} label="All fuel types" options={FUEL_TYPES} />
          <Button
            type="button"
            variant={featuredOnly ? "accent" : "outline"}
            onClick={() => setFeaturedOnly(!featuredOnly)}
            className="lg:col-span-1"
          >
            <Star className={featuredOnly ? "fill-current" : ""} /> Featured only
          </Button>
        </div>

        {isLoading && (
          <div className="mt-16 flex items-center gap-3 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" /> Loading vehicles…
          </div>
        )}

        {error && (
          <p className="mt-16 rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {(error as Error).message}
          </p>
        )}

        {!isLoading && !error && (
          <div className="mt-8 overflow-x-auto rounded-2xl border border-border bg-card shadow-soft">
            <table className="w-full min-w-[1080px] text-sm">
              <thead className="border-b border-border bg-muted/40 text-left text-xs uppercase tracking-widest text-muted-foreground">
                <tr>
                  <th className="px-4 py-4">Vehicle</th>
                  <th className="px-4 py-4">Year</th>
                  <th className="px-4 py-4">Price</th>
                  <th className="px-4 py-4">Mileage</th>
                  <th className="px-4 py-4">Fuel</th>
                  <th className="px-4 py-4">Transmission</th>
                  <th className="px-4 py-4">Status</th>
                  <th className="px-4 py-4">Featured</th>
                  <th className="px-4 py-4">Created</th>
                  <th className="px-4 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((v) => (
                  <tr key={v.id} className="border-b border-border/60 last:border-0">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <StorageImage
                          path={v.main_image}
                          alt={`${v.make} ${v.model}`}
                          className="h-12 w-20 shrink-0 rounded-lg border border-border"
                        />
                        <div>
                          <p className="font-semibold">{v.make}</p>
                          <p className="text-xs text-muted-foreground">{v.model}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">{v.year}</td>
                    <td className="px-4 py-3 font-semibold">{gbp(Number(v.price))}</td>
                    <td className="px-4 py-3">{miles(v.mileage)}</td>
                    <td className="px-4 py-3">{v.fuel_type ?? "—"}</td>
                    <td className="px-4 py-3">{v.transmission ?? "—"}</td>
                    <td className="px-4 py-3">
                      <Select
                        value={v.status}
                        onValueChange={(next) =>
                          patchMutation.mutate({ id: v.id, patch: { status: next as AdminVehicle["status"] } })
                        }
                      >
                        <SelectTrigger className="h-9 w-[130px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {VEHICLE_STATUSES.map((s) => (
                            <SelectItem key={s} value={s}>
                              {s}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        aria-label={v.featured ? "Unfeature vehicle" : "Feature vehicle"}
                        onClick={() => patchMutation.mutate({ id: v.id, patch: { featured: !v.featured } })}
                      >
                        {v.featured ? (
                          <Badge variant="default" className="gap-1">
                            <Star className="h-3 w-3 fill-current" /> Featured
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="gap-1 text-muted-foreground">
                            <Star className="h-3 w-3" /> No
                          </Badge>
                        )}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{shortDate(v.created_at)}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <Button asChild size="sm" variant="outline">
                          <Link to="/admin/vehicles/$id/edit" params={{ id: v.id }}>
                            <Pencil className="h-3.5 w-3.5" /> Edit
                          </Link>
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => setPending(v)}>
                          <Trash2 className="h-3.5 w-3.5 text-destructive" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {rows.length === 0 && (
                  <tr>
                    <td colSpan={10} className="px-4 py-16 text-center text-muted-foreground">
                      No vehicles match these filters yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <AlertDialog open={pending !== null} onOpenChange={(open) => !open && setPending(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this vehicle?</AlertDialogTitle>
            <AlertDialogDescription>
              {pending ? `${pending.year} ${pending.make} ${pending.model}` : ""} and its uploaded images will be
              permanently removed. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                if (pending) removeMutation.mutate(pending);
              }}
            >
              {removeMutation.isPending ? <Loader2 className="animate-spin" /> : null} Delete vehicle
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminShell>
  );
}

function FilterSelect({
  value,
  onChange,
  label,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  label: string;
  options: string[];
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder={label} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={ALL}>{label}</SelectItem>
        {options.map((o) => (
          <SelectItem key={o} value={o}>
            {o}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
