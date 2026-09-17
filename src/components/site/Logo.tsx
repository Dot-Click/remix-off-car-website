import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { BRAND } from "@/lib/brand";
import logoUrl from "@/assets/j1-autoland-logo.png";
import headerLogoUrl from "@/assets/j1-autoland-logo-header.png";

export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "relative grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-xl bg-white ring-1 ring-black/10",
        className,
      )}
    >
      <img
        src={logoUrl}
        alt={`${BRAND.name} logo`}
        className="h-full w-full object-contain p-0.5"
      />
    </span>
  );
}

export function Logo({
  className,
  tone = "light",
  size = "md",
  asLink = true,
  variant = "default",
}: {
  className?: string;
  /** "light" = white backing on dark surfaces, "dark" = dark backing, "transparent" = no backing */
  tone?: "light" | "dark" | "transparent";
  size?: "md" | "lg";
  asLink?: boolean;
  /** "header" uses the white wordmark variant for dark headers */
  variant?: "default" | "header";
}) {
  const src = variant === "header" ? headerLogoUrl : logoUrl;
  const inner = (
    <span
      className={cn(
        "inline-flex w-fit min-w-0 items-center",
        tone === "light" && "rounded-xl bg-white px-3 py-1.5 ring-1 ring-white/20",
        tone === "dark" && "rounded-xl bg-black px-3 py-1.5 ring-1 ring-black/20",
        tone === "transparent" && "bg-transparent p-0",
        className,
      )}
    >
      <img
        src={src}
        alt={`${BRAND.name} logo`}
        className={cn("w-auto object-contain", size === "lg" ? "h-14" : "h-12")}
        width={size === "lg" ? 162 : 140}
        height={size === "lg" ? 52 : 44}
      />
    </span>
  );

  if (!asLink) return inner;
  return (
    <Link to="/" aria-label={BRAND.name} className="shrink-0">
      {inner}
    </Link>
  );
}

