import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert } from "@/integrations/supabase/types";

export const VEHICLE_BUCKET = "vehicle-images";

export type AdminVehicle = Tables<"vehicles">;
export type VehicleInput = TablesInsert<"vehicles">;

export const VEHICLE_STATUSES = ["Available", "Reserved", "Sold"] as const;
export const FUEL_TYPES = ["Petrol", "Diesel", "Hybrid", "Electric", "Plug-in Hybrid"];
export const TRANSMISSIONS = ["Automatic", "Manual", "Semi-Automatic"];
export const BODY_TYPES = [
  "SUV",
  "Sedan",
  "Coupe",
  "Convertible",
  "Hatchback",
  "Estate",
  "Pickup",
  "MPV",
];

/** Signed URL cache so grids don't re-request the same object on every render. */
const signedCache = new Map<string, string>();

export async function resolveImageUrl(path: string | null | undefined): Promise<string | null> {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  const cached = signedCache.get(path);
  if (cached) return cached;
  const { data } = await supabase.storage.from(VEHICLE_BUCKET).createSignedUrl(path, 60 * 60 * 24 * 7);
  if (!data?.signedUrl) return null;
  signedCache.set(path, data.signedUrl);
  return data.signedUrl;
}

export async function uploadVehicleImage(file: File): Promise<string> {
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const path = `vehicles/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from(VEHICLE_BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });
  if (error) throw error;
  return path;
}

export async function removeVehicleImage(path: string) {
  if (!path || path.startsWith("http")) return;
  await supabase.storage.from(VEHICLE_BUCKET).remove([path]);
}

export async function listVehicles(): Promise<AdminVehicle[]> {
  const { data, error } = await supabase
    .from("vehicles")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function getVehicleById(id: string): Promise<AdminVehicle> {
  const { data, error } = await supabase.from("vehicles").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  if (!data) throw new Error("Vehicle not found");
  return data;
}

export async function createVehicle(input: VehicleInput) {
  const { data, error } = await supabase.from("vehicles").insert(input).select("id").single();
  if (error) throw error;
  return data;
}

export async function updateVehicle(id: string, input: Partial<VehicleInput>) {
  const { error } = await supabase.from("vehicles").update(input).eq("id", id);
  if (error) throw error;
}

export async function deleteVehicle(vehicle: AdminVehicle) {
  const { error } = await supabase.from("vehicles").delete().eq("id", vehicle.id);
  if (error) throw error;
  const paths = [vehicle.main_image, ...(vehicle.gallery_images ?? [])].filter(
    (p): p is string => !!p && !p.startsWith("http"),
  );
  if (paths.length) await supabase.storage.from(VEHICLE_BUCKET).remove(paths);
}

export const gbp = (n: number) =>
  new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 }).format(n);

export const miles = (n: number) => `${new Intl.NumberFormat("en-GB").format(n)} mi`;

export const shortDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
