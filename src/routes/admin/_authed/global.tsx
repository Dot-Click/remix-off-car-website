import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { AdminShell } from "@/components/admin/AdminShell";
import { MediaPicker } from "@/components/admin/MediaPicker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { getSetting, saveSetting, type FooterSettings, type HeaderSettings } from "@/lib/cms";
import { FOOTER_FALLBACK, HEADER_FALLBACK } from "@/lib/site-content";

export const Route = createFileRoute("/admin/_authed/global")({
  head: () => ({
    meta: [
      { title: "Header & Footer | J1 Autoland CMS" },
      {
        name: "description",
        content: "Edit the global website header and footer content shown on every public page.",
      },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Header & Footer | J1 Autoland CMS" },
      { property: "og:description", content: "Edit global header and footer content." },
    ],
  }),
  component: GlobalContent,
});

function GlobalContent() {
  return (
    <AdminShell
      title="Header & footer"
      description="Global content that appears on every public page. Contact details and social links live in Website Settings."
      breadcrumbs={[{ label: "Header & Footer" }]}
    >
      <div className="space-y-6">
        <HeaderCard />
        <FooterCard />
        <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
          <h2 className="font-display text-lg font-semibold">Menus</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Header and footer menu links are managed in Navigation / Menu.
          </p>
          <Button asChild size="sm" variant="outline" className="mt-4">
            <Link to="/admin/navigation">Manage navigation</Link>
          </Button>
        </div>
      </div>
    </AdminShell>
  );
}

function HeaderCard() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["admin", "settings", "header"],
    queryFn: () => getSetting<HeaderSettings>("header"),
  });
  const [form, setForm] = useState<HeaderSettings | null>(null);
  const value = form ?? { ...HEADER_FALLBACK, ...(data ?? {}) };
  const set = <K extends keyof HeaderSettings>(k: K, v: HeaderSettings[K]) =>
    setForm({ ...value, [k]: v });

  const save = useMutation({
    mutationFn: () => saveSetting("header", value),
    onSuccess: () => {
      toast.success("Header saved");
      queryClient.invalidateQueries({ queryKey: ["admin", "settings", "header"] });
      queryClient.invalidateQueries({ queryKey: ["cms", "settings", "header"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" /> Loading header…
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
      <h2 className="font-display text-lg font-semibold">Header</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <FieldRow label="Button text" value={value.cta_label} onChange={(v) => set("cta_label", v)} />
        <FieldRow label="Button URL" value={value.cta_url} onChange={(v) => set("cta_url", v)} />
        <div className="sm:col-span-2">
          <MediaPicker
            label="Logo (leave empty to use the built-in logo)"
            value={value.logo_path}
            onChange={(p) => set("logo_path", p)}
          />
        </div>
      </div>
      <div className="mt-4 flex items-center gap-2">
        <Switch checked={value.show_phone} onCheckedChange={(on) => set("show_phone", on)} />
        <span className="text-sm text-muted-foreground">Show phone number in header</span>
      </div>
      <Button className="mt-5" size="sm" variant="accent" disabled={save.isPending} onClick={() => save.mutate()}>
        {save.isPending ? <Loader2 className="animate-spin" /> : <Save />} Save header
      </Button>
    </div>
  );
}

function FooterCard() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["admin", "settings", "footer"],
    queryFn: () => getSetting<FooterSettings>("footer"),
  });
  const [form, setForm] = useState<FooterSettings | null>(null);
  const value = form ?? { ...FOOTER_FALLBACK, ...(data ?? {}) };
  const set = <K extends keyof FooterSettings>(k: K, v: FooterSettings[K]) =>
    setForm({ ...value, [k]: v });

  const save = useMutation({
    mutationFn: () => saveSetting("footer", value),
    onSuccess: () => {
      toast.success("Footer saved");
      queryClient.invalidateQueries({ queryKey: ["admin", "settings", "footer"] });
      queryClient.invalidateQueries({ queryKey: ["cms", "settings", "footer"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" /> Loading footer…
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
      <h2 className="font-display text-lg font-semibold">Footer</h2>
      <div className="mt-4 space-y-4">
        <div>
          <Label className="mb-1.5 block text-xs uppercase tracking-widest text-muted-foreground">
            Description
          </Label>
          <Textarea
            rows={3}
            value={value.description}
            onChange={(e) => set("description", e.target.value)}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <FieldRow
            label="Newsletter placeholder"
            value={value.newsletter_placeholder}
            onChange={(v) => set("newsletter_placeholder", v)}
          />
          <FieldRow
            label="Newsletter button"
            value={value.newsletter_button}
            onChange={(v) => set("newsletter_button", v)}
          />
          <FieldRow label="Copyright line" value={value.copyright} onChange={(v) => set("copyright", v)} />
          <FieldRow label="Small print" value={value.small_print} onChange={(v) => set("small_print", v)} />
        </div>
        <MediaPicker
          label="Logo (leave empty to use the built-in logo)"
          value={value.logo_path}
          onChange={(p) => set("logo_path", p)}
        />
      </div>
      <Button className="mt-5" size="sm" variant="accent" disabled={save.isPending} onClick={() => save.mutate()}>
        {save.isPending ? <Loader2 className="animate-spin" /> : <Save />} Save footer
      </Button>
    </div>
  );
}

function FieldRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <Label className="mb-1.5 block text-xs uppercase tracking-widest text-muted-foreground">
        {label}
      </Label>
      <Input value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}
