import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Plus, Star, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AdminShell } from "@/components/admin/AdminShell";
import { MediaPicker } from "@/components/admin/MediaPicker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  createTestimonial,
  deleteTestimonial,
  listTestimonials,
  updateTestimonial,
  type Testimonial,
} from "@/lib/cms";

export const Route = createFileRoute("/admin/_authed/testimonials")({
  head: () => ({
    meta: [
      { title: "Testimonials | J1 Autoland CMS" },
      { name: "description", content: "Add, edit and publish customer reviews shown on the J1 Autoland website." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Testimonials | J1 Autoland CMS" },
      { property: "og:description", content: "Manage customer reviews." },
    ],
  }),
  component: TestimonialsAdmin,
});

function TestimonialsAdmin() {
  const queryClient = useQueryClient();
  const [creating, setCreating] = useState(false);

  const { data = [], isLoading } = useQuery({
    queryKey: ["admin", "testimonials"],
    queryFn: () => listTestimonials(),
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["admin", "testimonials"] });
    queryClient.invalidateQueries({ queryKey: ["cms", "testimonials", "published"] });
  };

  const add = useMutation({
    mutationFn: () =>
      createTestimonial({
        customer_name: "New customer",
        review: "Write the review here.",
        rating: 5,
        status: "draft",
        sort_order: data.length,
      }),
    onSuccess: () => {
      toast.success("Review created");
      setCreating(false);
      invalidate();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <AdminShell
      title="Testimonials"
      description="Published reviews appear in the homepage carousel and on the reviews page."
      breadcrumbs={[{ label: "Testimonials" }]}
      actions={
        <Button
          variant="accent"
          disabled={add.isPending || creating}
          onClick={() => {
            setCreating(true);
            add.mutate();
          }}
        >
          {add.isPending ? <Loader2 className="animate-spin" /> : <Plus />} Add review
        </Button>
      }
    >
      {isLoading ? (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading reviews…
        </div>
      ) : (
        <div className="space-y-4">
          {data.map((t) => (
            <TestimonialCard key={t.id} item={t} onChanged={invalidate} />
          ))}
          {data.length === 0 && <p className="text-sm text-muted-foreground">No reviews yet.</p>}
        </div>
      )}
    </AdminShell>
  );
}

function TestimonialCard({ item, onChanged }: { item: Testimonial; onChanged: () => void }) {
  const [draft, setDraft] = useState({
    customer_name: item.customer_name,
    customer_location: item.customer_location ?? "",
    vehicle: item.vehicle ?? "",
    review: item.review,
    rating: item.rating,
    sort_order: item.sort_order,
    avatar_path: item.avatar_path,
    published: item.status === "published",
  });
  const [confirm, setConfirm] = useState(false);

  const save = useMutation({
    mutationFn: () =>
      updateTestimonial(item.id, {
        customer_name: draft.customer_name,
        customer_location: draft.customer_location || null,
        vehicle: draft.vehicle || null,
        review: draft.review,
        rating: Number(draft.rating),
        sort_order: Number(draft.sort_order),
        avatar_path: draft.avatar_path,
        status: draft.published ? "published" : "draft",
      }),
    onSuccess: () => {
      toast.success("Review saved");
      onChanged();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: () => deleteTestimonial(item.id),
    onSuccess: () => {
      toast.success("Review deleted");
      onChanged();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label className="mb-1.5 block text-xs uppercase tracking-widest text-muted-foreground">
            Customer name
          </Label>
          <Input
            value={draft.customer_name}
            onChange={(e) => setDraft({ ...draft, customer_name: e.target.value })}
          />
        </div>
        <div>
          <Label className="mb-1.5 block text-xs uppercase tracking-widest text-muted-foreground">
            Location
          </Label>
          <Input
            value={draft.customer_location}
            onChange={(e) => setDraft({ ...draft, customer_location: e.target.value })}
          />
        </div>
        <div>
          <Label className="mb-1.5 block text-xs uppercase tracking-widest text-muted-foreground">
            Vehicle
          </Label>
          <Input value={draft.vehicle} onChange={(e) => setDraft({ ...draft, vehicle: e.target.value })} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="mb-1.5 block text-xs uppercase tracking-widest text-muted-foreground">
              Rating
            </Label>
            <Input
              type="number"
              min={1}
              max={5}
              value={draft.rating}
              onChange={(e) => setDraft({ ...draft, rating: Number(e.target.value) })}
            />
          </div>
          <div>
            <Label className="mb-1.5 block text-xs uppercase tracking-widest text-muted-foreground">
              Order
            </Label>
            <Input
              type="number"
              value={draft.sort_order}
              onChange={(e) => setDraft({ ...draft, sort_order: Number(e.target.value) })}
            />
          </div>
        </div>
      </div>

      <div className="mt-4">
        <Label className="mb-1.5 block text-xs uppercase tracking-widest text-muted-foreground">
          Review
        </Label>
        <Textarea
          rows={3}
          value={draft.review}
          onChange={(e) => setDraft({ ...draft, review: e.target.value })}
        />
      </div>

      <div className="mt-5">
        <MediaPicker
          label="Customer image (optional)"
          value={draft.avatar_path}
          onChange={(p) => setDraft({ ...draft, avatar_path: p })}
        />
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-4 border-t border-border pt-4">
        <div className="flex items-center gap-2">
          <Switch
            checked={draft.published}
            onCheckedChange={(on) => setDraft({ ...draft, published: on })}
          />
          <span className="text-sm text-muted-foreground">Published</span>
        </div>
        <span className="flex items-center gap-1 text-accent">
          {Array.from({ length: Math.max(0, Math.min(5, draft.rating)) }).map((_, i) => (
            <Star key={i} className="h-3.5 w-3.5 fill-current" />
          ))}
        </span>
        <div className="ml-auto flex gap-2">
          {confirm ? (
            <>
              <Button size="sm" variant="ghost" onClick={() => setConfirm(false)}>
                Cancel
              </Button>
              <Button size="sm" variant="destructive" onClick={() => remove.mutate()}>
                {remove.isPending ? <Loader2 className="animate-spin" /> : <Trash2 />} Confirm delete
              </Button>
            </>
          ) : (
            <Button size="sm" variant="ghost" onClick={() => setConfirm(true)}>
              <Trash2 className="h-3.5 w-3.5 text-destructive" />
            </Button>
          )}
          <Button size="sm" variant="accent" disabled={save.isPending} onClick={() => save.mutate()}>
            {save.isPending ? <Loader2 className="animate-spin" /> : null} Save
          </Button>
        </div>
      </div>
    </div>
  );
}
