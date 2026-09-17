import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { AdminShell } from "@/components/admin/AdminShell";
import { MediaImage } from "@/components/admin/MediaImage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { deleteMedia, listMedia, updateMedia, uploadMedia, type MediaItem } from "@/lib/cms";

export const Route = createFileRoute("/admin/_authed/media")({
  head: () => ({
    meta: [
      { title: "Media Library | J1 Autoland CMS" },
      { name: "description", content: "Upload, replace and manage website images for J1 Autoland." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Media Library | J1 Autoland CMS" },
      { property: "og:description", content: "Upload and manage website images." },
    ],
  }),
  component: MediaLibrary,
});

function MediaLibrary() {
  const queryClient = useQueryClient();
  const inputRef = useRef<HTMLInputElement>(null);
  const [pending, setPending] = useState<MediaItem | null>(null);
  const [previews, setPreviews] = useState<string[]>([]);

  const { data: items = [], isLoading } = useQuery({
    queryKey: ["admin", "media"],
    queryFn: listMedia,
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["admin", "media"] });

  const upload = useMutation({
    mutationFn: async (files: FileList) => {
      for (const file of Array.from(files)) await uploadMedia(file);
    },
    onSuccess: () => {
      toast.success("Upload complete");
      setPreviews([]);
      void invalidate();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: deleteMedia,
    onSuccess: () => {
      toast.success("File deleted");
      setPending(null);
      void invalidate();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const saveAlt = useMutation({
    mutationFn: ({ id, alt }: { id: string; alt: string }) => updateMedia(id, { alt_text: alt || null }),
    onSuccess: () => {
      toast.success("Alt text saved");
      void invalidate();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <AdminShell
      title="Media library"
      description="JPG, PNG, WEBP, AVIF and SVG supported. Images are stored securely and reusable across the site."
      breadcrumbs={[{ label: "Media Library" }]}
      actions={
        <>
          <input
            ref={inputRef}
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp,image/svg+xml,image/avif"
            className="hidden"
            onChange={(e) => {
              const files = e.target.files;
              if (!files?.length) return;
              setPreviews(Array.from(files).map((f) => URL.createObjectURL(f)));
              upload.mutate(files);
            }}
          />
          <Button variant="accent" disabled={upload.isPending} onClick={() => inputRef.current?.click()}>
            {upload.isPending ? <Loader2 className="animate-spin" /> : <Upload />} Upload images
          </Button>
        </>
      }
    >
      {previews.length > 0 && (
        <div className="mb-6 rounded-2xl border border-border bg-card p-4">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Uploading preview</p>
          <div className="mt-3 flex flex-wrap gap-3">
            {previews.map((src) => (
              <img key={src} src={src} alt="Upload preview" className="h-20 w-28 rounded-lg object-cover" />
            ))}
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading media…
        </div>
      ) : items.length === 0 ? (
        <p className="text-sm text-muted-foreground">No media uploaded yet.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => (
            <div key={item.id} className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
              <MediaImage path={item.path} alt={item.alt_text ?? item.file_name} className="h-36 w-full" />
              <div className="space-y-2 p-3">
                <p className="truncate text-xs font-medium">{item.file_name}</p>
                <Input
                  defaultValue={item.alt_text ?? ""}
                  placeholder="Alt text"
                  className="h-8 text-xs"
                  onBlur={(e) => {
                    if (e.target.value !== (item.alt_text ?? "")) {
                      saveAlt.mutate({ id: item.id, alt: e.target.value });
                    }
                  }}
                />
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    className="text-[11px] text-muted-foreground hover:text-foreground"
                    onClick={() => {
                      void navigator.clipboard.writeText(item.path);
                      toast.success("Path copied");
                    }}
                  >
                    Copy path
                  </button>
                  <Button size="sm" variant="ghost" onClick={() => setPending(item)}>
                    <Trash2 className="h-3.5 w-3.5 text-destructive" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <AlertDialog open={pending !== null} onOpenChange={(open) => !open && setPending(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this file?</AlertDialogTitle>
            <AlertDialogDescription>
              {pending?.file_name} will be permanently removed. Any section still using it will fall back to
              its default image.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                if (pending) remove.mutate(pending);
              }}
            >
              {remove.isPending ? <Loader2 className="animate-spin" /> : null} Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminShell>
  );
}
