import { useQuery } from "@tanstack/react-query";
import {
  getSections,
  listNav,
  listTestimonials,
  getSetting,
  resolveMediaUrl,
  type BusinessSettings,
  type FooterSettings,
  type HeaderSettings,
  type NavItem,
  type PageSection,
  type Testimonial,
} from "@/lib/cms";
import { BRAND } from "@/lib/brand";

/**
 * Public-site content hooks.
 * Every hook falls back to the original hardcoded values, so the site keeps
 * rendering identically if the CMS has not been filled in.
 */

export const BUSINESS_FALLBACK: BusinessSettings = {
  name: BRAND.name,
  name_title: BRAND.nameTitle,
  legal: BRAND.legal,
  tagline: BRAND.tagline,
  phone: BRAND.phone,
  phone_href: BRAND.phoneHref,
  whatsapp: BRAND.whatsapp,
  email: BRAND.email,
  address: BRAND.address,
  website: BRAND.website,
  hours: [
    { day: "Monday – Friday", time: "09:00 – 18:30" },
    { day: "Saturday", time: "09:00 – 17:00" },
    { day: "Sunday", time: "11:00 – 16:00" },
    { day: "Bank Holidays", time: "By appointment" },
  ],
  social: { instagram: "#", facebook: "#", youtube: "#", linkedin: "#" },
};

export const HEADER_FALLBACK: HeaderSettings = {
  show_phone: true,
  cta_label: "Browse Stock",
  cta_url: "/stocklist",
  logo_path: null,
};

export const FOOTER_FALLBACK: FooterSettings = {
  description:
    "An independent motor group with over 100 hand-selected vehicles, in-house finance and nationwide delivery.",
  newsletter_placeholder: "Email for new arrivals",
  newsletter_button: "Join",
  copyright: "All rights reserved.",
  small_print: "FCA registered credit broker, not a lender. Finance subject to status.",
  logo_path: null,
};

export function useBusiness(): BusinessSettings {
  const { data } = useQuery({
    queryKey: ["cms", "settings", "business"],
    queryFn: () => getSetting<BusinessSettings>("business"),
    staleTime: 60_000,
  });
  return { ...BUSINESS_FALLBACK, ...(data ?? {}) };
}

export function useHeaderSettings(): HeaderSettings {
  const { data } = useQuery({
    queryKey: ["cms", "settings", "header"],
    queryFn: () => getSetting<HeaderSettings>("header"),
    staleTime: 60_000,
  });
  return { ...HEADER_FALLBACK, ...(data ?? {}) };
}

export function useFooterSettings(): FooterSettings {
  const { data } = useQuery({
    queryKey: ["cms", "settings", "footer"],
    queryFn: () => getSetting<FooterSettings>("footer"),
    staleTime: 60_000,
  });
  return { ...FOOTER_FALLBACK, ...(data ?? {}) };
}

/** All published sections of a page, keyed by section_key. */
export function usePageSections(slug: string): Record<string, PageSection> {
  const { data } = useQuery({
    queryKey: ["cms", "sections", slug],
    queryFn: () => getSections(slug),
    staleTime: 60_000,
  });
  return data ?? {};
}

/** Reads a section field with a hardcoded fallback so design never breaks. */
export function field(
  section: PageSection | undefined,
  key: keyof PageSection,
  fallback: string,
): string {
  const value = section?.[key];
  return typeof value === "string" && value.trim() ? value : fallback;
}

export function listField(section: PageSection | undefined, fallback: string[]): string[] {
  const items = section?.items;
  if (Array.isArray(items) && items.length && items.every((i) => typeof i === "string")) {
    return items as string[];
  }
  return fallback;
}

/**
 * Repeatable cards stored in `items` as an array of objects.
 * Falls back to the hardcoded design content when the CMS list is empty.
 */
export function cardsField<T>(section: PageSection | undefined, fallback: T[]): T[] {
  const items = section?.items;
  if (
    Array.isArray(items) &&
    items.length &&
    items.every((i) => i !== null && typeof i === "object" && !Array.isArray(i))
  ) {
    return items as T[];
  }
  return fallback;
}


export function numberSetting(
  section: PageSection | undefined,
  key: string,
  fallback: number,
): number {
  const settings = section?.settings as Record<string, unknown> | undefined;
  const raw = settings?.[key];
  const n = typeof raw === "number" ? raw : Number(raw);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

export function useNavItems(location: "header" | "footer" | "footer_secondary", fallback: NavItem[] = []) {
  const { data } = useQuery({
    queryKey: ["cms", "nav", location],
    queryFn: () => listNav(location),
    staleTime: 60_000,
  });
  return data?.length ? data.filter((n) => n.enabled) : fallback;
}

export function usePublishedTestimonials(fallback: Testimonial[] = []) {
  const { data } = useQuery({
    queryKey: ["cms", "testimonials", "published"],
    queryFn: () => listTestimonials(true),
    staleTime: 60_000,
  });
  return data?.length ? data : fallback;
}

/** Resolves a CMS image path, falling back to a bundled asset. */
export function useMediaUrl(path: string | null | undefined, fallback: string): string {
  const { data } = useQuery({
    queryKey: ["cms", "media-url", path],
    queryFn: () => resolveMediaUrl(path),
    enabled: !!path,
    staleTime: 60 * 60_000,
  });
  return data ?? fallback;
}
