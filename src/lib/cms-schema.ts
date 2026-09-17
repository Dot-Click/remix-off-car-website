/**
 * Declares which fields each CMS section actually uses, so the admin editor
 * only shows relevant inputs (and knows how to edit repeatable cards/stats).
 * Key format: `${pageSlug}:${sectionKey}`.
 */

export type TextFieldKey =
  | "eyebrow"
  | "heading"
  | "subheading"
  | "description"
  | "body_html"
  | "button_text"
  | "button_url"
  | "secondary_button_text"
  | "secondary_button_url"
  | "image_path"
  | "background_image_path";

export type CardField = {
  key: string;
  label: string;
  type?: "text" | "textarea" | "image" | "number";
};

export type NumberField = { key: string; label: string };

export type SectionSchema = {
  fields: TextFieldKey[];
  /** Simple string list (one per line). */
  list?: { label: string };
  /** Repeatable structured cards stored in `items`. */
  cards?: { label: string; fields: CardField[] };
  /** Numeric values stored in `settings`. */
  numbers?: NumberField[];
};

const HERO: SectionSchema = {
  fields: ["eyebrow", "heading", "description", "button_text", "button_url", "background_image_path"],
};

const HEADING_ONLY: SectionSchema = { fields: ["eyebrow", "heading", "description"] };

const CTA: SectionSchema = {
  fields: [
    "heading",
    "description",
    "button_text",
    "button_url",
    "secondary_button_text",
    "secondary_button_url",
  ],
};

const FEATURE_CARDS: CardField[] = [
  { key: "title", label: "Title" },
  { key: "text", label: "Text", type: "textarea" },
];

const IMAGE_TEXT: SectionSchema = {
  fields: ["eyebrow", "heading", "description", "image_path"],
};

export const SECTION_SCHEMAS: Record<string, SectionSchema> = {
  /* ---------------- Homepage ---------------- */
  "home:hero": {
    fields: [
      "eyebrow",
      "heading",
      "subheading",
      "description",
      "button_text",
      "button_url",
      "secondary_button_text",
      "secondary_button_url",
    ],
    list: { label: "Trust badges (one per line)" },
    numbers: [{ key: "autoplay_seconds", label: "Slider seconds per slide" }],
  },
  "home:featured": {
    fields: ["eyebrow", "heading", "button_text", "button_url"],
    numbers: [{ key: "vehicle_count", label: "Vehicles to display" }],
  },
  "home:makes": HEADING_ONLY,
  "home:why": {
    ...HEADING_ONLY,
    cards: { label: "Feature cards", fields: FEATURE_CARDS },
  },
  "home:finance": {
    fields: [
      "eyebrow",
      "heading",
      "description",
      "button_text",
      "secondary_button_text",
      "image_path",
    ],
    list: { label: "Finance highlights (one per line)" },
  },
  "home:reviews": HEADING_ONLY,
  "home:arrivals": {
    fields: ["eyebrow", "heading", "button_text", "button_url"],
    numbers: [{ key: "count", label: "Vehicles to display" }],
  },
  "home:cta": CTA,

  /* ---------------- About ---------------- */
  "about-us:hero": {
    fields: ["eyebrow", "heading", "description", "button_text", "button_url", "background_image_path"],
  },
  "about-us:stats": {
    cards: {
      label: "Statistics",
      fields: [
        { key: "value", label: "Number", type: "number" },
        { key: "suffix", label: "Suffix (e.g. +, -Star)" },
        { key: "label", label: "Label" },
      ],
    },
    fields: [],
  },
  "about-us:story": {
    fields: ["eyebrow", "heading", "description", "image_path"],
    cards: {
      label: "Second block (mission)",
      fields: [
        { key: "title", label: "Heading" },
        { key: "text", label: "Text", type: "textarea" },
      ],
    },
  },
  "about-us:commitment": {
    fields: ["eyebrow", "heading", "description", "image_path"],
    list: { label: "Commitment checklist (one per line)" },
  },
  "about-us:why": {
    ...HEADING_ONLY,
    cards: { label: "Reason cards", fields: FEATURE_CARDS },
  },
  "about-us:cta": CTA,

  /* ---------------- Services ---------------- */
  "services:hero": HERO,
  "services:intro": HEADING_ONLY,
  "services:services": {
    ...HEADING_ONLY,
    cards: {
      label: "Service cards",
      fields: [
        { key: "title", label: "Title" },
        { key: "text", label: "Description", type: "textarea" },
        { key: "image", label: "Image", type: "image" },
        { key: "url", label: "Link URL" },
      ],
    },
  },
  "services:process": {
    ...HEADING_ONLY,
    cards: {
      label: "Process steps",
      fields: [
        { key: "title", label: "Step title" },
        { key: "text", label: "Step text", type: "textarea" },
      ],
    },
  },
  "services:cta": CTA,

  /* ---------------- Finance ---------------- */
  "finance:hero": HERO,
  "finance:calculator": { fields: ["eyebrow", "heading", "description"] },
  "finance:products": {
    ...HEADING_ONLY,
    cards: {
      label: "Finance products",
      fields: [
        { key: "title", label: "Title" },
        { key: "text", label: "Description", type: "textarea" },
      ],
    },
  },
  "finance:why": {
    ...HEADING_ONLY,
    cards: { label: "Benefit cards", fields: FEATURE_CARDS },
    list: { label: "Bullet points (one per line)" },
  },
  "finance:faq": {
    ...HEADING_ONLY,
    cards: {
      label: "Questions",
      fields: [
        { key: "title", label: "Question" },
        { key: "text", label: "Answer", type: "textarea" },
      ],
    },
  },
  "finance:cta": CTA,

  /* ---------------- Contact ---------------- */
  "contact:hero": HERO,
  "contact:details": {
    fields: ["eyebrow", "heading", "description"],
    cards: {
      label: "Contact detail cards",
      fields: [
        { key: "title", label: "Label" },
        { key: "text", label: "Value" },
        { key: "url", label: "Link (optional)" },
      ],
    },
  },
  "contact:form": {
    fields: ["heading", "description", "button_text"],
  },
  "contact:hours": {
    fields: ["heading", "description"],
    cards: {
      label: "Opening hours",
      fields: [
        { key: "title", label: "Day(s)" },
        { key: "text", label: "Hours" },
      ],
    },
  },
  "contact:map": {
    fields: ["heading", "description", "image_path", "button_text", "button_url"],
  },

  /* ---------------- Stocklist ---------------- */
  "stocklist:hero": HERO,
  "stocklist:intro": HEADING_ONLY,

  /* ---------------- Valuation ---------------- */
  "valuation:hero": HERO,
  "valuation:form": { fields: ["eyebrow", "heading", "description", "button_text"] },
  "valuation:steps": {
    ...HEADING_ONLY,
    cards: { label: "Steps", fields: FEATURE_CARDS },
  },
  "valuation:cta": CTA,

  /* ---------------- Warranty ---------------- */
  "warranty:hero": HERO,
  "warranty:plans": {
    ...HEADING_ONLY,
    cards: {
      label: "Warranty plans",
      fields: [
        { key: "title", label: "Plan name" },
        { key: "text", label: "Description", type: "textarea" },
        { key: "price", label: "Price / term" },
      ],
    },
  },
  "warranty:covered": {
    ...HEADING_ONLY,
    list: { label: "What's covered (one per line)" },
  },
  "warranty:cta": CTA,

  /* ---------------- Reviews ---------------- */
  "reviews:hero": HERO,
  "reviews:intro": HEADING_ONLY,
  "reviews:cta": CTA,

  /* ---------------- Find us ---------------- */
  "find-us:hero": HERO,
  "find-us:details": {
    fields: ["eyebrow", "heading", "description"],
    cards: {
      label: "Location details",
      fields: [
        { key: "title", label: "Label" },
        { key: "text", label: "Value" },
      ],
    },
  },
  "find-us:hours": {
    fields: ["heading", "description"],
    cards: {
      label: "Opening hours",
      fields: [
        { key: "title", label: "Day(s)" },
        { key: "text", label: "Hours" },
      ],
    },
  },
  "find-us:cta": CTA,

  /* ---------------- FAQ ---------------- */
  "faq:hero": HERO,
  "faq:faq": {
    ...HEADING_ONLY,
    cards: {
      label: "Questions",
      fields: [
        { key: "title", label: "Question" },
        { key: "text", label: "Answer", type: "textarea" },
      ],
    },
  },
  "faq:cta": CTA,

  /* ---------------- Sell your car ---------------- */
  "sell-your-car:hero": HERO,
  "sell-your-car:steps": {
    ...HEADING_ONLY,
    cards: { label: "Steps", fields: FEATURE_CARDS },
  },
  "sell-your-car:why": {
    ...HEADING_ONLY,
    cards: { label: "Reason cards", fields: FEATURE_CARDS },
  },
  "sell-your-car:cta": CTA,

  /* ---------------- Part exchange ---------------- */
  "part-exchange:hero": HERO,
  "part-exchange:steps": {
    ...HEADING_ONLY,
    cards: { label: "Steps", fields: FEATURE_CARDS },
  },
  "part-exchange:benefits": {
    ...HEADING_ONLY,
    cards: { label: "Benefit cards", fields: FEATURE_CARDS },
    list: { label: "Bullet points (one per line)" },
  },
  "part-exchange:cta": CTA,
};

/** Fallback: show the generic set of fields for unmapped sections. */
export const DEFAULT_SCHEMA: SectionSchema = {
  fields: [
    "eyebrow",
    "heading",
    "subheading",
    "description",
    "body_html",
    "button_text",
    "button_url",
    "secondary_button_text",
    "secondary_button_url",
    "image_path",
    "background_image_path",
  ],
  list: { label: "List items (one per line)" },
};

export function schemaFor(pageSlug: string, sectionKey: string): SectionSchema {
  return SECTION_SCHEMAS[`${pageSlug}:${sectionKey}`] ?? DEFAULT_SCHEMA;
}

export { IMAGE_TEXT };
