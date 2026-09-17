import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AdminShell } from "@/components/admin/AdminShell";
import { MediaPicker } from "@/components/admin/MediaPicker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  createCategory,
  deleteCategory,
  listCategories,
  slugify,
  updateCategory,
  type VehicleCategory,
} from "@/lib/cms";

export const Route = createFileRoute("/admin/_authed/vehicles/categories")({
  head: () => ({
    meta: [
      { title: "Vehicle Categories | J1 Autoland CMS" },
      { name: "description", content: "Manage the body type and fuel categories used by website filters." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Vehicle Categories | J1 Autoland CMS" },
      { property: "og:description", content: "Manage vehicle categories." },
    ],
  }),
  component: Categories,
});

function Categories() {
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [kind, setKind] = useState("body_type");

  const { data = [], isLoading } = useQuery({
    queryKey: ["admin", "categories"],
    queryFn: () => listCategories(),
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["admin", "categories"] });
    queryClient.invalidateQueries({ queryKey: ["cms", "categories"] });
  };

  const add = useMutation({
    mutationFn: () =>
      createCategory({ name, slug: slugify(name), kind, sort_order: data.length }),
    onSuccess: () => {
      toast.success("Category added");
      setName("");
      invalidate();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <AdminShell
      title="Vehicle categories"
      description="Categories power the body type and fuel filters on the public stocklist."
      breadcrumbs={[{ label: "Vehicles", to: "/admin/vehicles" }, { label: "Categories" }]}
    >
      <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
        <h2 className="font-display text-lg font-semibold">Add category</h2>
        <div className="mt-4 flex flex-wrap items-end gap-3">
          <div className="min-w-[200px] flex-1">
            <Label className="mb-1.5 block text-xs uppercase tracking-widest text-muted-foreground">
              Name
            </Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Estate" />
          </div>
          <div className="min-w-[160px]">
            <Label className="mb-1.5 block text-xs uppercase tracking-widest text-muted-foreground">
              Type
            </Label>
            <select
              value={kind}
              onChange={(e) => setKind(e.target.value)}
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="body_type">Body type</option>
              <option value="fuel_type">Fuel type</option>
              <option value="make">Make</option>
            </select>
          </div>
          <Button variant="accent" disabled={!name.trim() || add.isPending} onClick={() => add.mutate()}>
            {add.isPending ? <Loader2 className="animate-spin" /> : <Plus />} Add
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="mt-6 flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading categories…
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {data.map((cat) => (
            <CategoryCard key={cat.id} item={cat} onChanged={invalidate} />
          ))}
          {data.length === 0 && <p className="text-sm text-muted-foreground">No categories yet.</p>}
        </div>
      )}
    </AdminShell>
  );
}

function CategoryCard({ item, onChanged }: { item: VehicleCategory; onChanged: () => void }) {
  const [draft, setDraft] = useState({
    name: item.name,
    description: item.description ?? "",
    image_path: item.image_path,
    enabled: item.enabled,
    sort_order: item.sort_order,
  });

  const save = useMutation({
    mutationFn: () =>
      updateCategory(item.id, {
        name: draft.name,
        slug: slugify(draft.name),
        description: draft.description || null,
        image_path: draft.image_path,
        enabled: draft.enabled,
        sort_order: Number(draft.sort_order),
      }),
    onSuccess: () => {
      toast.success("Category saved");
      onChanged();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: () => deleteCategory(item.id),
    onSuccess: () => {
      toast.success("Category deleted");
      onChanged();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
      <p className="text-[11px] uppercase tracking-widest text-muted-foreground">{item.kind}</p>
      <div className="mt-3 grid gap-4">
        <div>
          <Label className="mb-1.5 block text-xs uppercase tracking-widest text-muted-foreground">
            Name
          </Label>
          <Input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
        </div>
        <div>
          <Label className="mb-1.5 block text-xs uppercase tracking-widest text-muted-foreground">
            Description
          </Label>
          <Input
            value={draft.description}
            onChange={(e) => setDraft({ ...draft, description: e.target.value })}
          />
        </div>
        <MediaPicker
          label="Category image (optional)"
          value={draft.image_path}
          onChange={(p) => setDraft({ ...draft, image_path: p })}
        />
      </div>
      <div className="mt-5 flex items-center gap-3 border-t border-border pt-4">
        <div className="flex items-center gap-2">
          <Switch checked={draft.enabled} onCheckedChange={(on) => setDraft({ ...draft, enabled: on })} />
          <span className="text-sm text-muted-foreground">Enabled</span>
        </div>
        <div className="ml-auto flex gap-2">
          <Button size="sm" variant="ghost" onClick={() => remove.mutate()}>
            <Trash2 className="h-3.5 w-3.5 text-destructive" />
          </Button>
          <Button size="sm" variant="accent" disabled={save.isPending} onClick={() => save.mutate()}>
            {save.isPending ? <Loader2 className="animate-spin" /> : null} Save
          </Button>
        </div>
      </div>
    </div>
  );
}
