import { useEffect, useRef } from "react";
import { Bold, Italic, Link2, List, ListOrdered, Underline } from "lucide-react";
import { cn } from "@/lib/utils";

/** Lightweight rich-text editor for longer CMS content (stores HTML). */
export function RichText({
  value,
  onChange,
  label,
  className,
}: {
  value: string;
  onChange: (html: string) => void;
  label?: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current && ref.current.innerHTML !== value) {
      ref.current.innerHTML = value ?? "";
    }
    // Only sync when the external value changes identity.
  }, [value]);

  const exec = (command: string, arg?: string) => {
    document.execCommand(command, false, arg);
    if (ref.current) onChange(ref.current.innerHTML);
  };

  const buttons = [
    { icon: Bold, label: "Bold", run: () => exec("bold") },
    { icon: Italic, label: "Italic", run: () => exec("italic") },
    { icon: Underline, label: "Underline", run: () => exec("underline") },
    { icon: List, label: "Bulleted list", run: () => exec("insertUnorderedList") },
    { icon: ListOrdered, label: "Numbered list", run: () => exec("insertOrderedList") },
    {
      icon: Link2,
      label: "Link",
      run: () => {
        const url = window.prompt("Link URL");
        if (url) exec("createLink", url);
      },
    },
  ];

  return (
    <div>
      {label && (
        <p className="mb-1.5 text-xs uppercase tracking-widest text-muted-foreground">{label}</p>
      )}
      <div className={cn("overflow-hidden rounded-lg border border-input bg-background", className)}>
        <div className="flex items-center gap-1 border-b border-border bg-muted/40 px-2 py-1.5">
          {buttons.map((b) => (
            <button
              key={b.label}
              type="button"
              aria-label={b.label}
              title={b.label}
              onMouseDown={(e) => e.preventDefault()}
              onClick={b.run}
              className="grid h-7 w-7 place-items-center rounded text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
            >
              <b.icon className="h-3.5 w-3.5" />
            </button>
          ))}
        </div>
        <div
          ref={ref}
          contentEditable
          suppressContentEditableWarning
          role="textbox"
          aria-multiline="true"
          onInput={(e) => onChange((e.target as HTMLDivElement).innerHTML)}
          className="prose-sm min-h-28 max-w-none px-3 py-2.5 text-sm outline-none [&_a]:underline [&_li]:ml-4 [&_ol]:list-decimal [&_ul]:list-disc"
        />
      </div>
    </div>
  );
}
