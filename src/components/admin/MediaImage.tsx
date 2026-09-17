import { useEffect, useState } from "react";
import { ImageOff } from "lucide-react";
import { resolveMediaUrl } from "@/lib/cms";
import { cn } from "@/lib/utils";

/** Renders an image stored in the media library (private bucket → signed URL). */
export function MediaImage({
  path,
  alt,
  className,
}: {
  path: string | null | undefined;
  alt: string;
  className?: string;
}) {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setUrl(null);
    resolveMediaUrl(path).then((u) => {
      if (active) setUrl(u);
    });
    return () => {
      active = false;
    };
  }, [path]);

  if (!url) {
    return (
      <div className={cn("grid place-items-center bg-muted text-muted-foreground", className)}>
        <ImageOff className="h-4 w-4" />
      </div>
    );
  }

  return <img src={url} alt={alt} loading="lazy" className={cn("object-cover", className)} />;
}
