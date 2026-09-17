import { useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, ImagePlus, Loader2, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { listMedia, uploadMedia, type MediaItem } from "@/lib/cms";
import { MediaImage } from "@/components/admin/MediaImage";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/** Field that lets an admin pick an image from the library or upload a new one. */
export function MediaPicker({
  value,
  onChange,
  label = "Image",
}: {
  value: string | null;
  onChange: (path: string | null) => void;
  label?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <p className="mb-1.5 text-xs uppercase tracking-widest text-muted-foreground">{label}</p>
      <div className="flex items-center gap-3">
        <div className="h-20 w-28 overflow-hidden rounded-lg border border-border bg-muted">
          {value ? (
            <MediaImage path={value} alt={label} className="h-full w-full" />
          ) : (
            <div className="grid h-full w-full place-items-center text-muted-foreground">
              <ImagePlus className="h-5 w-5" />
            </div>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <Button type="button" size="sm" variant="outline" onClick={() => setOpen(true)}>
            {value ? "Replace image" : "Choose image"}
          </Button>
          {value && (
            <Button type="button" size="sm" variant="ghost" onClick={() => onChange(null)}>
              <X className="h-3.5 w-3.5" /> Remove
            </Button>
          )}
        </div>
      </div>

      {open && (
        <MediaBrowser
          selected={value}
          onClose={() => setOpen(false)}
          onSelect={(item) => {
            onChange(item.path);
            setOpen(false);
          }}
        />
      )}
    </div>
  );
}

export function MediaBrowser({
  selected,
  onSelect,
  onClose,
}: {
  selected?: string | null;
  onSelect: (item: MediaItem) => void;
  onClose: () => void;
}) {
  const queryClient = useQueryClient();
  const inputRef = useRef<HTMLInputElement>(null);
  const { data: items = [], isLoading } = useQuery({
    queryKey: ["admin", "media"],
    queryFn: listMedia,
  });

  const upload = useMutation({
    mutationFn: async (files: FileList) => {
      const results: MediaItem[] = [];
      for (const file of Array.from(files)) results.push(await uploadMedia(file));
      return results;
    },
    onSuccess: (results) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "media"] });
      toast.success(`${results.length} file(s) uploaded`);
      const first = results[0];
      if (first) onSelect(first);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="flex max-h-[85vh] w-full max-w-4xl flex-col rounded-2xl border border-border bg-card shadow-float">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="font-display text-lg font-semibold">Media library</h2>
          <div className="flex items-center gap-2">
            <input
              ref={inputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/svg+xml,image/avif"
              multiple
              className="hidden"
              onChange={(e) => e.target.files?.length && upload.mutate(e.target.files)}
            />
            <Button
              size="sm"
              variant="accent"
              disabled={upload.isPending}
              onClick={() => inputRef.current?.click()}
            >
              {upload.isPending ? <Loader2 className="animate-spin" /> : <Upload />} Upload
            </Button>
            <button type="button" aria-label="Close" onClick={onClose}>
              <X className="h-5 w-5 text-muted-foreground" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {isLoading ? (
            <div className="grid place-items-center py-16 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" />
            </div>
          ) : items.length === 0 ? (
            <p className="py-16 text-center text-sm text-muted-foreground">
              No media yet. Upload your first image.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-5">
              {items.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelect(item)}
                  className={cn(
                    "group relative overflow-hidden rounded-xl border-2 transition-colors",
                    selected === item.path ? "border-accent" : "border-border hover:border-accent/60",
                  )}
                >
                  <MediaImage path={item.path} alt={item.alt_text ?? item.file_name} className="h-24 w-full" />
                  <span className="block truncate px-2 py-1.5 text-[11px] text-muted-foreground">
                    {item.file_name}
                  </span>
                  {selected === item.path && (
                    <span className="absolute right-1.5 top-1.5 grid h-5 w-5 place-items-center rounded-full bg-accent text-accent-foreground">
                      <Check className="h-3 w-3" />
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
