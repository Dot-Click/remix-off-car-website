import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

export function PageHero({
  image,
  label,
  title,
  description,
  crumb,
  children,
}: {
  image: string;
  label: string;
  title: string;
  description?: string;
  crumb: string;
  children?: ReactNode;
}) {
  return (
    <section className="relative isolate flex min-h-[420px] items-end overflow-hidden pb-14 pt-36 lg:min-h-[500px]">
      <img
        src={image}
        alt=""
        width={1600}
        height={900}
        className="absolute inset-0 -z-10 h-full w-full object-cover"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/90 via-black/70 to-black/35" />
      <div className="shell w-full">
        <nav className="mb-5 flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-ink-muted">
          <Link to="/" className="transition-colors hover:text-accent">
            Home
          </Link>
          <span>/</span>
          <span className="text-ink-foreground">{crumb}</span>
        </nav>
        <p className="eyebrow">{label}</p>
        <h1 className="mt-3 max-w-3xl font-display text-4xl font-semibold text-ink-foreground sm:text-5xl lg:text-6xl">
          {title}
        </h1>
        {description && (
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink-muted">{description}</p>
        )}
        {children && <div className="mt-8 flex flex-wrap gap-3">{children}</div>}
      </div>
    </section>
  );
}
