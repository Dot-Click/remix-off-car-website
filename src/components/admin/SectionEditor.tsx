import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Plus, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { updateSection, type PageSection } from "@/lib/cms";
import { schemaFor, type CardField, type TextFieldKey } from "@/lib/cms-schema";
import { MediaPicker } from "@/components/admin/MediaPicker";
import { RichText } from "@/components/admin/RichText";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

type Card = Record<string, unknown>;

type Draft = {
  eyebrow: string;
  heading: string;
  subheading: string;
  description: string;
  body_html: string;
  button_text: string;
  button_url: string;
  secondary_button_text: string;
  secondary_button_url: string;
  image_path: string | null;
  background_image_path: string | null;
  list: string;
  cards: Card[];
  numbers: Record<string, string>;
  status: string;
};

const isCardArray = (items: unknown): items is Card[] =>
  Array.isArray(items) && items.every((i) => i !== null && typeof i === "object");

const isStringArray = (items: unknown): items is string[] =>
  Array.isArray(items) && items.every((i) => typeof i === "string");

export function SectionEditor({ section, pageSlug }: { section: PageSection; pageSlug: string }) {
  const queryClient = useQueryClient();
  const schema = schemaFor(pageSlug, section.section_key);
  const [open, setOpen] = useState(false);

  const [draft, setDraft] = useState<Draft>(() => {
    const settings = (section.settings as Record<string, unknown> | null) ?? {};
    return {
      eyebrow: section.eyebrow ?? "",
      heading: section.heading ?? "",
      subheading: section.subheading ?? "",
      description: section.description ?? "",
      body_html: section.body_html ?? "",
      button_text: section.button_text ?? "",
      button_url: section.button_url ?? "",
      secondary_button_text: section.secondary_button_text ?? "",
      secondary_button_url: section.secondary_button_url ?? "",
      image_path: section.image_path,
      background_image_path: section.background_image_path,
      list: isStringArray(section.items) ? section.items.join("\n") : "",
      cards: schema.cards && isCardArray(section.items) ? (section.items as Card[]) : [],
      numbers: Object.fromEntries(
        (schema.numbers ?? []).map((n) => [n.key, String(settings[n.key] ?? "")]),
      ),
      status: section.status,
    };
  });

  const set = <K extends keyof Draft>(key: K, value: Draft[K]) =>
    setDraft((d) => ({ ...d, [key]: value }));

  const has = (f: TextFieldKey) => schema.fields.includes(f);

  const setCard = (index: number, key: string, value: unknown) =>
    setDraft((d) => ({
      ...d,
      cards: d.cards.map((c, i) => (i === index ? { ...c, [key]: value } : c)),
    }));

  const save = useMutation({
    mutationFn: async (status?: string) => {
      const settings = { ...((section.settings as Record<string, unknown>) ?? {}) };
      for (const n of schema.numbers ?? []) {
        const raw = draft.numbers[n.key]?.trim();
        if (raw) settings[n.key] = Number(raw);
      }

      let items: unknown = section.items;
      if (schema.cards) items = draft.cards;
      else if (schema.list)
        items = draft.list
          .split("\n")
          .map((i) => i.trim())
          .filter(Boolean);

      await updateSection(section.id, {
        eyebrow: draft.eyebrow || null,
        heading: draft.heading || null,
        subheading: draft.subheading || null,
        description: draft.description || null,
        body_html: draft.body_html || null,
        button_text: draft.button_text || null,
        button_url: draft.button_url || null,
        secondary_button_text: draft.secondary_button_text || null,
        secondary_button_url: draft.secondary_button_url || null,
        image_path: draft.image_path,
        background_image_path: draft.background_image_path,
        items: items as never,
        settings: settings as never,
        status: status ?? draft.status,
      });
      if (status) set("status", status);
    },
    onSuccess: () => {
      toast.success("Section saved");
      queryClient.invalidateQueries({ queryKey: ["admin", "sections", pageSlug] });
      queryClient.invalidateQueries({ queryKey: ["cms", "sections", pageSlug] });
    },
    onError: (e: Error) => toast.error(e.message || "Could not save section"),
  });

  return (
    <div className="rounded-2xl border border-border bg-card shadow-soft">
      <div className="flex flex-wrap items-center gap-3 px-5 py-4">
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold">{section.name}</p>
          <p className="truncate text-xs text-muted-foreground">
            {section.heading || section.eyebrow || section.section_key}
          </p>
        </div>
        <span
          className={
            draft.status === "published"
              ? "rounded-full bg-accent/10 px-2.5 py-1 text-[11px] font-medium text-accent"
              : "rounded-full bg-muted px-2.5 py-1 text-[11px] font-medium text-muted-foreground"
          }
        >
          {draft.status === "published" ? "Published" : "Draft"}
        </span>
        <Button size="sm" variant="outline" onClick={() => setOpen(!open)}>
          {open ? "Close" : "Edit"}
        </Button>
      </div>

      {open && (
        <div className="space-y-5 border-t border-border px-5 py-6">
          <div className="grid gap-4 sm:grid-cols-2">
            {has("eyebrow") && (
              <Field label="Eyebrow / label" value={draft.eyebrow} onChange={(v) => set("eyebrow", v)} />
            )}
            {has("heading") && (
              <Field label="Heading" value={draft.heading} onChange={(v) => set("heading", v)} />
            )}
            {has("subheading") && (
              <Field
                label="Highlighted word / subheading"
                value={draft.subheading}
                onChange={(v) => set("subheading", v)}
              />
            )}
            {(schema.numbers ?? []).map((n) => (
              <Field
                key={n.key}
                label={n.label}
                type="number"
                value={draft.numbers[n.key] ?? ""}
                onChange={(v) => set("numbers", { ...draft.numbers, [n.key]: v })}
              />
            ))}
          </div>

          {has("description") && (
            <div>
              <Label className="mb-1.5 block text-xs uppercase tracking-widest text-muted-foreground">
                Paragraph text
              </Label>
              <Textarea
                rows={3}
                value={draft.description}
                onChange={(e) => set("description", e.target.value)}
              />
            </div>
          )}

          {has("body_html") && (
            <RichText
              label="Long content (rich text)"
              value={draft.body_html}
              onChange={(html) => set("body_html", html)}
            />
          )}

          {(has("button_text") ||
            has("button_url") ||
            has("secondary_button_text") ||
            has("secondary_button_url")) && (
            <div className="grid gap-4 sm:grid-cols-2">
              {has("button_text") && (
                <Field label="Button text" value={draft.button_text} onChange={(v) => set("button_text", v)} />
              )}
              {has("button_url") && (
                <Field label="Button URL" value={draft.button_url} onChange={(v) => set("button_url", v)} />
              )}
              {has("secondary_button_text") && (
                <Field
                  label="Secondary button text"
                  value={draft.secondary_button_text}
                  onChange={(v) => set("secondary_button_text", v)}
                />
              )}
              {has("secondary_button_url") && (
                <Field
                  label="Secondary button URL"
                  value={draft.secondary_button_url}
                  onChange={(v) => set("secondary_button_url", v)}
                />
              )}
            </div>
          )}

          {(has("image_path") || has("background_image_path")) && (
            <div className="grid gap-5 sm:grid-cols-2">
              {has("image_path") && (
                <MediaPicker label="Image" value={draft.image_path} onChange={(p) => set("image_path", p)} />
              )}
              {has("background_image_path") && (
                <MediaPicker
                  label="Background image"
                  value={draft.background_image_path}
                  onChange={(p) => set("background_image_path", p)}
                />
              )}
            </div>
          )}

          {schema.list && (
            <div>
              <Label className="mb-1.5 block text-xs uppercase tracking-widest text-muted-foreground">
                {schema.list.label}
              </Label>
              <Textarea rows={4} value={draft.list} onChange={(e) => set("list", e.target.value)} />
            </div>
          )}

          {schema.cards && (
            <div className="space-y-3">
              <Label className="block text-xs uppercase tracking-widest text-muted-foreground">
                {schema.cards.label}
              </Label>
              {draft.cards.map((card, index) => (
                <div key={index} className="rounded-xl border border-border bg-muted/20 p-4">
                  <div className="grid gap-3 sm:grid-cols-2">
                    {schema.cards!.fields.map((f) => (
                      <CardInput
                        key={f.key}
                        field={f}
                        value={card[f.key]}
                        onChange={(v) => setCard(index, f.key, v)}
                      />
                    ))}
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="mt-3 text-destructive"
                    onClick={() =>
                      set(
                        "cards",
                        draft.cards.filter((_, i) => i !== index),
                      )
                    }
                  >
                    <Trash2 /> Remove
                  </Button>
                </div>
              ))}
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  set("cards", [
                    ...draft.cards,
                    Object.fromEntries(schema.cards!.fields.map((f) => [f.key, ""])),
                  ])
                }
              >
                <Plus /> Add item
              </Button>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-4 border-t border-border pt-5">
            <div className="flex items-center gap-2">
              <Switch
                checked={draft.status === "published"}
                onCheckedChange={(on) => set("status", on ? "published" : "draft")}
              />
              <span className="text-sm text-muted-foreground">Published</span>
            </div>
            <div className="ml-auto flex gap-2">
              <Button variant="outline" disabled={save.isPending} onClick={() => save.mutate("draft")}>
                Save as draft
              </Button>
              <Button variant="accent" disabled={save.isPending} onClick={() => save.mutate("published")}>
                {save.isPending ? <Loader2 className="animate-spin" /> : <Save />} Save &amp; publish
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CardInput({
  field,
  value,
  onChange,
}: {
  field: CardField;
  value: unknown;
  onChange: (v: unknown) => void;
}) {
  const text = value === null || value === undefined ? "" : String(value);

  if (field.type === "image") {
    return (
      <div className="sm:col-span-2">
        <MediaPicker label={field.label} value={text || null} onChange={(p) => onChange(p ?? "")} />
      </div>
    );
  }

  if (field.type === "textarea") {
    return (
      <div className="sm:col-span-2">
        <Label className="mb-1.5 block text-xs uppercase tracking-widest text-muted-foreground">
          {field.label}
        </Label>
        <Textarea rows={3} value={text} onChange={(e) => onChange(e.target.value)} />
      </div>
    );
  }

  return (
    <Field
      label={field.label}
      type={field.type === "number" ? "number" : "text"}
      value={text}
      onChange={(v) => onChange(field.type === "number" ? (v === "" ? "" : Number(v)) : v)}
    />
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <div>
      <Label className="mb-1.5 block text-xs uppercase tracking-widest text-muted-foreground">
        {label}
      </Label>
      <Input type={type} value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}
