import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Loader2, Plus, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StorageImage } from "@/components/admin/StorageImage";
import {
  BODY_TYPES,
  FUEL_TYPES,
  TRANSMISSIONS,
  VEHICLE_STATUSES,
  createVehicle,
  removeVehicleImage,
  updateVehicle,
  uploadVehicleImage,
  type AdminVehicle,
} from "@/lib/vehicle-admin";

type FormState = {
  make: string;
  model: string;
  year: string;
  price: string;
  mileage: string;
  fuel_type: string;
  transmission: string;
  body_type: string;
  engine: string;
  exterior_color: string;
  interior_color: string;
  description: string;
  featured: boolean;
  status: (typeof VEHICLE_STATUSES)[number];
  main_image: string | null;
  gallery_images: string[];
};

const emptyState: FormState = {
  make: "",
  model: "",
  year: String(new Date().getFullYear()),
  price: "",
  mileage: "",
  fuel_type: "",
  transmission: "",
  body_type: "",
  engine: "",
  exterior_color: "",
  interior_color: "",
  description: "",
  featured: false,
  status: "Available",
  main_image: null,
  gallery_images: [],
};

function toState(v: AdminVehicle): FormState {
  return {
    make: v.make,
    model: v.model,
    year: String(v.year),
    price: String(v.price),
    mileage: String(v.mileage),
    fuel_type: v.fuel_type ?? "",
    transmission: v.transmission ?? "",
    body_type: v.body_type ?? "",
    engine: v.engine ?? "",
    exterior_color: v.exterior_color ?? "",
    interior_color: v.interior_color ?? "",
    description: v.description ?? "",
    featured: v.featured,
    status: v.status,
    main_image: v.main_image,
    gallery_images: v.gallery_images ?? [],
  };
}

export function VehicleForm({ vehicle }: { vehicle?: AdminVehicle }) {
  const navigate = useNavigate();
  const [form, setForm] = useState<FormState>(vehicle ? toState(vehicle) : emptyState);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<"main" | "gallery" | null>(null);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const onMainUpload = async (file: File | undefined) => {
    if (!file) return;
    setUploading("main");
    try {
      const path = await uploadVehicleImage(file);
      if (form.main_image) await removeVehicleImage(form.main_image);
      set("main_image", path);
      toast.success("Main image uploaded");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(null);
    }
  };

  const onGalleryUpload = async (files: FileList | null) => {
    if (!files?.length) return;
    setUploading("gallery");
    try {
      const paths = await Promise.all(Array.from(files).map((f) => uploadVehicleImage(f)));
      set("gallery_images", [...form.gallery_images, ...paths]);
      toast.success(`${paths.length} gallery image${paths.length > 1 ? "s" : ""} uploaded`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(null);
    }
  };

  const removeGalleryItem = async (path: string) => {
    set(
      "gallery_images",
      form.gallery_images.filter((p) => p !== path),
    );
    await removeVehicleImage(path);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      make: form.make.trim(),
      model: form.model.trim(),
      year: Number(form.year),
      price: Number(form.price || 0),
      mileage: Number(form.mileage || 0),
      fuel_type: form.fuel_type || null,
      transmission: form.transmission || null,
      body_type: form.body_type || null,
      engine: form.engine.trim() || null,
      exterior_color: form.exterior_color.trim() || null,
      interior_color: form.interior_color.trim() || null,
      description: form.description.trim() || null,
      featured: form.featured,
      status: form.status,
      main_image: form.main_image,
      gallery_images: form.gallery_images,
    };

    try {
      if (vehicle) {
        await updateVehicle(vehicle.id, payload);
        toast.success("Vehicle updated");
      } else {
        await createVehicle(payload);
        toast.success("Vehicle created");
      }
      navigate({ to: "/admin/vehicles" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save vehicle");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="mt-10 space-y-10" onSubmit={onSubmit}>
      <div className="rounded-2xl border border-border bg-card p-6 shadow-soft sm:p-8">
        <h2 className="font-display text-xl font-semibold">Vehicle details</h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="Make" required value={form.make} onChange={(v) => set("make", v)} />
          <Field label="Model" required value={form.model} onChange={(v) => set("model", v)} />
          <Field label="Year" required type="number" value={form.year} onChange={(v) => set("year", v)} />
          <Field label="Price (£)" required type="number" value={form.price} onChange={(v) => set("price", v)} />
          <Field label="Mileage" required type="number" value={form.mileage} onChange={(v) => set("mileage", v)} />
          <Field label="Engine" value={form.engine} onChange={(v) => set("engine", v)} placeholder="3.0L" />
          <Picker label="Fuel type" value={form.fuel_type} options={FUEL_TYPES} onChange={(v) => set("fuel_type", v)} />
          <Picker
            label="Transmission"
            value={form.transmission}
            options={TRANSMISSIONS}
            onChange={(v) => set("transmission", v)}
          />
          <Picker label="Body type" value={form.body_type} options={BODY_TYPES} onChange={(v) => set("body_type", v)} />
          <Field label="Exterior colour" value={form.exterior_color} onChange={(v) => set("exterior_color", v)} />
          <Field label="Interior colour" value={form.interior_color} onChange={(v) => set("interior_color", v)} />
          <Picker
            label="Status"
            value={form.status}
            options={[...VEHICLE_STATUSES]}
            onChange={(v) => set("status", v as FormState["status"])}
          />
        </div>

        <div className="mt-6">
          <Label className="mb-1.5 block text-xs uppercase tracking-widest text-muted-foreground">
            Description
          </Label>
          <Textarea
            rows={5}
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            placeholder="Specification highlights, service history, warranty…"
          />
        </div>

        <div className="mt-6 flex items-center gap-3 rounded-xl border border-border bg-muted/30 px-4 py-3">
          <Switch checked={form.featured} onCheckedChange={(v) => set("featured", v)} id="featured" />
          <Label htmlFor="featured" className="cursor-pointer text-sm">
            Feature this vehicle on the homepage
          </Label>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-soft sm:p-8">
        <h2 className="font-display text-xl font-semibold">Imagery</h2>

        <div className="mt-6">
          <Label className="mb-2 block text-xs uppercase tracking-widest text-muted-foreground">
            Main image
          </Label>
          <div className="flex flex-wrap items-center gap-4">
            {form.main_image && (
              <StorageImage
                path={form.main_image}
                alt="Main vehicle image"
                className="h-24 w-36 rounded-xl border border-border"
              />
            )}
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm transition-colors hover:bg-muted">
              {uploading === "main" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
              {form.main_image ? "Replace image" : "Upload image"}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => void onMainUpload(e.target.files?.[0])}
              />
            </label>
            {form.main_image && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={async () => {
                  const path = form.main_image!;
                  set("main_image", null);
                  await removeVehicleImage(path);
                }}
              >
                <Trash2 className="h-4 w-4" /> Remove
              </Button>
            )}
          </div>
        </div>

        <div className="mt-8">
          <Label className="mb-2 block text-xs uppercase tracking-widest text-muted-foreground">
            Gallery images
          </Label>
          <div className="flex flex-wrap gap-3">
            {form.gallery_images.map((path) => (
              <div key={path} className="group relative">
                <StorageImage path={path} alt="Gallery image" className="h-20 w-28 rounded-lg border border-border" />
                <button
                  type="button"
                  onClick={() => void removeGalleryItem(path)}
                  className="absolute right-1 top-1 grid h-6 w-6 place-items-center rounded-full bg-background/90 text-destructive opacity-0 transition-opacity group-hover:opacity-100"
                  aria-label="Remove gallery image"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
            <label className="grid h-20 w-28 cursor-pointer place-items-center rounded-lg border border-dashed border-border text-muted-foreground transition-colors hover:bg-muted">
              {uploading === "gallery" ? <Loader2 className="h-5 w-5 animate-spin" /> : <Plus className="h-5 w-5" />}
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => void onGalleryUpload(e.target.files)}
              />
            </label>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button type="submit" size="lg" variant="accent" disabled={saving || uploading !== null}>
          {saving && <Loader2 className="animate-spin" />}
          {vehicle ? "Save changes" : "Create vehicle"}
        </Button>
        <Button type="button" size="lg" variant="outline" onClick={() => navigate({ to: "/admin/vehicles" })}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <Label className="mb-1.5 block text-xs uppercase tracking-widest text-muted-foreground">{label}</Label>
      <Input
        type={type}
        required={required}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function Picker({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <Label className="mb-1.5 block text-xs uppercase tracking-widest text-muted-foreground">{label}</Label>
      <Select {...(value ? { value } : {})} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
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
