import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert } from "@/integrations/supabase/types";

export const MEDIA_BUCKET = "media";

export type Page = Tables<"pages">;
export type PageSection = Tables<"page_sections">;
export type MediaItem = Tables<"media">;
export type NavItem = Tables<"navigation_items">;
export type Testimonial = Tables<"testimonials">;
export type Enquiry = Tables<"enquiries">;
export type VehicleCategory = Tables<"vehicle_categories">;
export type Order = Tables<"orders">;

export type ContentStatus = "draft" | "published";

/* ------------------------------------------------------------------ */
/* Media URLs                                                          */
/* ------------------------------------------------------------------ */

const urlCache = new Map<string, string>();

/** Resolves a stored media path (or absolute URL) into a usable image src. */
export async function resolveMediaUrl(path: string | null | undefined): Promise<string | null> {
  if (!path) return null;
  if (path.startsWith("http") || path.startsWith("/") || path.startsWith("data:")) return path;
  const cached = urlCache.get(path);
  if (cached) return cached;
  const { data } = await supabase.storage
    .from(MEDIA_BUCKET)
    .createSignedUrl(path, 60 * 60 * 24 * 7);
  if (!data?.signedUrl) return null;
  urlCache.set(path, data.signedUrl);
  return data.signedUrl;
}

/* ------------------------------------------------------------------ */
/* Site settings                                                       */
/* ------------------------------------------------------------------ */

export type BusinessSettings = {
  name: string;
  name_title: string;
  legal: string;
  tagline: string;
  phone: string;
  phone_href: string;
  whatsapp: string;
  email: string;
  address: string;
  website: string;
  hours: { day: string; time: string }[];
    social: { instagram: string; facebook: string; youtube: string; linkedin: string; tiktok: string };
};

export type HeaderSettings = {
  show_phone: boolean;
  cta_label: string;
  cta_url: string;
  logo_path: string | null;
};

export type FooterSettings = {
  description: string;
  newsletter_placeholder: string;
  newsletter_button: string;
  copyright: string;
  small_print: string;
  logo_path: string | null;
};

export async function getSetting<T>(key: string): Promise<T | null> {
  const { data, error } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", key)
    .maybeSingle();
  if (error) throw error;
  return (data?.value as T) ?? null;
}

export async function saveSetting(key: string, value: unknown) {
  const { error } = await supabase
    .from("site_settings")
    .upsert({ key, value: value as never }, { onConflict: "key" });
  if (error) throw error;
}

/* ------------------------------------------------------------------ */
/* Pages & sections                                                    */
/* ------------------------------------------------------------------ */

export async function listPages(): Promise<Page[]> {
  const { data, error } = await supabase.from("pages").select("*").order("sort_order");
  if (error) throw error;
  return data ?? [];
}

export async function getPage(slug: string): Promise<Page | null> {
  const { data, error } = await supabase.from("pages").select("*").eq("slug", slug).maybeSingle();
  if (error) throw error;
  return data;
}

export async function updatePage(id: string, patch: Partial<Page>) {
  const { error } = await supabase.from("pages").update(patch).eq("id", id);
  if (error) throw error;
}

export async function listSections(pageId: string): Promise<PageSection[]> {
  const { data, error } = await supabase
    .from("page_sections")
    .select("*")
    .eq("page_id", pageId)
    .order("sort_order");
  if (error) throw error;
  return data ?? [];
}

/** Public helper: single section by page slug + key. */
export async function getSection(
  pageSlug: string,
  sectionKey: string,
): Promise<PageSection | null> {
  const page = await getPage(pageSlug);
  if (!page) return null;
  const { data, error } = await supabase
    .from("page_sections")
    .select("*")
    .eq("page_id", page.id)
    .eq("section_key", sectionKey)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function getSections(pageSlug: string): Promise<Record<string, PageSection>> {
  const page = await getPage(pageSlug);
  if (!page) return {};
  const rows = await listSections(page.id);
  return Object.fromEntries(rows.map((r) => [r.section_key, r]));
}

export async function updateSection(id: string, patch: Partial<PageSection>) {
  const { error } = await supabase.from("page_sections").update(patch).eq("id", id);
  if (error) throw error;
}

export async function createSection(input: TablesInsert<"page_sections">) {
  const { error } = await supabase.from("page_sections").insert(input);
  if (error) throw error;
}

export async function deleteSection(id: string) {
  const { error } = await supabase.from("page_sections").delete().eq("id", id);
  if (error) throw error;
}

/* ------------------------------------------------------------------ */
/* Media library                                                       */
/* ------------------------------------------------------------------ */

export async function listMedia(): Promise<MediaItem[]> {
  const { data, error } = await supabase
    .from("media")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export const ALLOWED_MEDIA_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/svg+xml",
  "image/avif",
];

export async function uploadMedia(file: File): Promise<MediaItem> {
  if (!ALLOWED_MEDIA_TYPES.includes(file.type)) {
    throw new Error("Unsupported file type. Use JPG, PNG, WEBP, AVIF or SVG.");
  }
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const path = `library/${crypto.randomUUID()}.${ext}`;
  const { error: upErr } = await supabase.storage
    .from(MEDIA_BUCKET)
    .upload(path, file, { cacheControl: "3600", upsert: false });
  if (upErr) throw upErr;

  const { data, error } = await supabase
    .from("media")
    .insert({
      path,
      file_name: file.name,
      mime_type: file.type,
      size_bytes: file.size,
    })
    .select("*")
    .single();
  if (error) throw error;
  return data;
}

export async function updateMedia(id: string, patch: Partial<MediaItem>) {
  const { error } = await supabase.from("media").update(patch).eq("id", id);
  if (error) throw error;
}

export async function deleteMedia(item: MediaItem) {
  const { error } = await supabase.from("media").delete().eq("id", item.id);
  if (error) throw error;
  await supabase.storage.from(MEDIA_BUCKET).remove([item.path]);
  urlCache.delete(item.path);
}

/* ------------------------------------------------------------------ */
/* Navigation                                                          */
/* ------------------------------------------------------------------ */

export async function listNav(location?: string): Promise<NavItem[]> {
  let query = supabase.from("navigation_items").select("*").order("sort_order");
  if (location) query = query.eq("location", location);
  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export async function createNav(input: TablesInsert<"navigation_items">) {
  const { error } = await supabase.from("navigation_items").insert(input);
  if (error) throw error;
}

export async function updateNav(id: string, patch: Partial<NavItem>) {
  const { error } = await supabase.from("navigation_items").update(patch).eq("id", id);
  if (error) throw error;
}

export async function deleteNav(id: string) {
  const { error } = await supabase.from("navigation_items").delete().eq("id", id);
  if (error) throw error;
}

/* ------------------------------------------------------------------ */
/* Testimonials                                                        */
/* ------------------------------------------------------------------ */

export async function listTestimonials(publishedOnly = false): Promise<Testimonial[]> {
  let query = supabase.from("testimonials").select("*").order("sort_order");
  if (publishedOnly) query = query.eq("status", "published");
  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export async function createTestimonial(input: TablesInsert<"testimonials">) {
  const { error } = await supabase.from("testimonials").insert(input);
  if (error) throw error;
}

export async function updateTestimonial(id: string, patch: Partial<Testimonial>) {
  const { error } = await supabase.from("testimonials").update(patch).eq("id", id);
  if (error) throw error;
}

export async function deleteTestimonial(id: string) {
  const { error } = await supabase.from("testimonials").delete().eq("id", id);
  if (error) throw error;
}

/* ------------------------------------------------------------------ */
/* Enquiries                                                           */
/* ------------------------------------------------------------------ */

export async function submitEnquiry(input: TablesInsert<"enquiries">) {
  const { error } = await supabase.from("enquiries").insert(input);
  if (error) throw error;
}

export async function listEnquiries(): Promise<Enquiry[]> {
  const { data, error } = await supabase
    .from("enquiries")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function updateEnquiry(id: string, patch: Partial<Enquiry>) {
  const { error } = await supabase.from("enquiries").update(patch).eq("id", id);
  if (error) throw error;
}

export async function deleteEnquiry(id: string) {
  const { error } = await supabase.from("enquiries").delete().eq("id", id);
  if (error) throw error;
}

/* ------------------------------------------------------------------ */
/* Vehicle categories                                                  */
/* ------------------------------------------------------------------ */

export async function listCategories(kind?: string): Promise<VehicleCategory[]> {
  let query = supabase.from("vehicle_categories").select("*").order("sort_order");
  if (kind) query = query.eq("kind", kind);
  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export async function createCategory(input: TablesInsert<"vehicle_categories">) {
  const { error } = await supabase.from("vehicle_categories").insert(input);
  if (error) throw error;
}

export async function updateCategory(id: string, patch: Partial<VehicleCategory>) {
  const { error } = await supabase.from("vehicle_categories").update(patch).eq("id", id);
  if (error) throw error;
}

export async function deleteCategory(id: string) {
  const { error } = await supabase.from("vehicle_categories").delete().eq("id", id);
  if (error) throw error;
}

/* ------------------------------------------------------------------ */
/* Orders                                                              */
/* ------------------------------------------------------------------ */

export async function listOrders(): Promise<Order[]> {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function updateOrder(id: string, patch: Partial<Order>) {
  const { error } = await supabase.from("orders").update(patch).eq("id", id);
  if (error) throw error;
}

export const slugify = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
