"use client";

import React, { useEffect, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";

export type Option = { value: string; label: string; hint?: string; icon?: React.ReactNode };

/** Styled replacement for <select>: rounded panel, hover/selected states, keyboard + outside-click support. */
export default function Dropdown({
  value,
  onChange,
  options,
  placeholder = "Select…",
  icon,
  className = "",
  menuClassName = "",
  align = "left",
  full = false,
  ariaLabel,
}: {
  value: string;
  onChange: (v: string) => void;
  options: Option[];
  placeholder?: string;
  icon?: React.ReactNode;
  className?: string;
  menuClassName?: string;
  align?: "left" | "right";
  full?: boolean;
  ariaLabel?: string;
}) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const ref = useRef<HTMLDivElement>(null);
  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    if (!open) return;
    const down = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", down);
    return () => document.removeEventListener("mousedown", down);
  }, [open]);

  const choose = (v: string) => { onChange(v); setOpen(false); };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") return setOpen(false);
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      if (!open) { setOpen(true); setActive(Math.max(0, options.findIndex((o) => o.value === value))); return; }
      setActive((i) => (i + (e.key === "ArrowDown" ? 1 : -1) + options.length) % options.length);
    }
    if ((e.key === "Enter" || e.key === " ") && open && active >= 0) { e.preventDefault(); choose(options[active].value); }
  };

  return (
    <div ref={ref} className={`relative ${full ? "w-full" : "inline-block"} ${className}`} onKeyDown={onKey}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
        onClick={() => { setOpen((o) => !o); setActive(Math.max(0, options.findIndex((o2) => o2.value === value))); }}
        className={`flex w-full items-center justify-between gap-2.5 rounded-xl border bg-white px-3.5 py-2.5 text-left text-[13px] font-semibold text-[#17191C] shadow-sm outline-none transition ${open ? "border-[#C80808] ring-4 ring-[#C80808]/10" : "border-[#D8DDE2] hover:border-[#C80808]/40"}`}
      >
        <span className="flex min-w-0 items-center gap-2">{icon}<span className="truncate">{selected ? selected.label : <span className="font-medium text-[#929DA7]">{placeholder}</span>}</span></span>
        <ChevronDown className={`h-4 w-4 shrink-0 text-[#71717A] transition-transform duration-200 ${open ? "rotate-180 text-[#C80808]" : ""}`} />
      </button>

      {open && (
        <ul role="listbox" className={`absolute z-40 mt-2 max-h-72 min-w-full overflow-y-auto rounded-2xl border border-[#E4E4E7] bg-white p-1.5 shadow-[0_24px_48px_-16px_rgba(23,25,28,0.35)] animate-[routefade_.16s_ease-out_both] ${align === "right" ? "right-0" : "left-0"} ${menuClassName || "w-max max-w-[320px]"}`}>
          {options.map((o, i) => {
            const isSel = o.value === value;
            return (
              <li key={o.value} role="option" aria-selected={isSel}>
                <button
                  type="button"
                  onClick={() => choose(o.value)}
                  onMouseEnter={() => setActive(i)}
                  className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-[13px] transition-colors ${isSel ? "bg-[#C80808] font-bold text-white" : active === i ? "bg-[#F4F4F5] font-semibold text-[#17191C]" : "font-medium text-[#3F3F46]"}`}
                >
                  {o.icon}
                  <span className="min-w-0 flex-1"><span className="block truncate">{o.label}</span>{o.hint && <span className={`block truncate text-[11px] ${isSel ? "text-white/75" : "text-[#929DA7]"}`}>{o.hint}</span>}</span>
                  {isSel && <Check className="h-4 w-4 shrink-0" />}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
