import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { AdminShell } from "@/components/admin/AdminShell";
import { SectionEditor } from "@/components/admin/SectionEditor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getPage, listSections, updatePage } from "@/lib/cms";

export const Route = createFileRoute("/admin/_authed/website/$slug")({
  head: () => ({
    meta: [
      { title: "Edit Page | J1 Autoland CMS" },
      { name: "description", content: "Edit the sections and content of a J1 Autoland website page." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Edit Page | J1 Autoland CMS" },
      { property: "og:description", content: "Edit website page sections and content." },
    ],
  }),
  component: EditPage,
});

function EditPage() {
  const { slug } = Route.useParams();
  const queryClient = useQueryClient();

  const page = useQuery({ queryKey: ["admin", "page", slug], queryFn: () => getPage(slug) });
  const sections = useQuery({
    queryKey: ["admin", "sections", slug],
    queryFn: async () => (page.data ? listSections(page.data.id) : []),
    enabled: !!page.data,
  });

  return (
    <AdminShell
      title={page.data?.title ?? "Page"}
      description="Each section below maps to a section on the live page. Editing here updates the website."
      breadcrumbs={[{ label: "Website", to: "/admin/website" }, { label: page.data?.title ?? slug }]}
    >
      {page.isLoading ? (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading page…
        </div>
      ) : !page.data ? (
        <p className="text-sm text-muted-foreground">This page does not exist in the CMS.</p>
      ) : (
        <div className="space-y-6">
          <SeoCard
            pageId={page.data.id}
            slug={slug}
            title={page.data.seo_title ?? ""}
            description={page.data.seo_description ?? ""}
            onSaved={() => queryClient.invalidateQueries({ queryKey: ["admin", "page", slug] })}
          />

          <div className="space-y-4">
            {(sections.data ?? []).map((section) => (
              <SectionEditor key={section.id} section={section} pageSlug={slug} />
            ))}
            {sections.data?.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No editable sections registered for this page yet.
              </p>
            )}
          </div>
        </div>
      )}
    </AdminShell>
  );
}

function SeoCard({
  pageId,
  slug,
  title,
  description,
  onSaved,
}: {
  pageId: string;
  slug: string;
  title: string;
  description: string;
  onSaved: () => void;
}) {
  const [seoTitle, setSeoTitle] = useState(title);
  const [seoDescription, setSeoDescription] = useState(description);

  const save = useMutation({
    mutationFn: () =>
      updatePage(pageId, {
        seo_title: seoTitle || null,
        seo_description: seoDescription || null,
      }),
    onSuccess: () => {
      toast.success("Page details saved");
      onSaved();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
      <h2 className="font-display text-lg font-semibold">Page details</h2>
      <p className="mt-1 text-xs text-muted-foreground">/{slug === "home" ? "" : slug}</p>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <Label className="mb-1.5 block text-xs uppercase tracking-widest text-muted-foreground">
            SEO title
          </Label>
          <Input value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} />
        </div>
        <div>
          <Label className="mb-1.5 block text-xs uppercase tracking-widest text-muted-foreground">
            SEO description
          </Label>
          <Textarea rows={2} value={seoDescription} onChange={(e) => setSeoDescription(e.target.value)} />
        </div>
      </div>
      <Button className="mt-4" size="sm" variant="outline" disabled={save.isPending} onClick={() => save.mutate()}>
        {save.isPending ? <Loader2 className="animate-spin" /> : <Save />} Save page details
      </Button>
    </div>
  );
}
