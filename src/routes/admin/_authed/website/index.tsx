import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { FileText, Loader2 } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { Button } from "@/components/ui/button";
import { listPages } from "@/lib/cms";

export const Route = createFileRoute("/admin/_authed/website/")({
  head: () => ({
    meta: [
      { title: "Website Pages | J1 Autoland CMS" },
      { name: "description", content: "Manage the content of every public J1 Autoland website page." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Website Pages | J1 Autoland CMS" },
      { property: "og:description", content: "Manage public website page content." },
    ],
  }),
  component: WebsitePages,
});

function WebsitePages() {
  const { data: pages = [], isLoading } = useQuery({
    queryKey: ["admin", "pages"],
    queryFn: listPages,
  });

  return (
    <AdminShell
      title="Website pages"
      description="Choose a page to edit its sections, headings, text, buttons and images."
      breadcrumbs={[{ label: "Website" }]}
    >
      {isLoading ? (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading pages…
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {pages.map((page) => (
            <div key={page.id} className="rounded-2xl border border-border bg-card p-5 shadow-soft">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-accent/10 text-accent">
                <FileText className="h-5 w-5" />
              </span>
              <h2 className="mt-4 font-display text-lg font-semibold">{page.title}</h2>
              <p className="mt-1 text-xs text-muted-foreground">/{page.slug === "home" ? "" : page.slug}</p>
              <Button asChild size="sm" variant="outline" className="mt-4">
                <Link to="/admin/website/$slug" params={{ slug: page.slug }}>
                  Edit content
                </Link>
              </Button>
            </div>
          ))}
          {pages.length === 0 && (
            <p className="text-sm text-muted-foreground">No pages found in the CMS.</p>
          )}
        </div>
      )}
    </AdminShell>
  );
}
