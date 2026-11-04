"use client";

import React, { useEffect, useState } from "react";

/** Fixed dot navigation that highlights the section in view (desktop only). */
export default function SectionDots({ items }: { items: { id: string; label: string }[] }) {
  const [active, setActive] = useState(items[0]?.id);

  useEffect(() => {
    const els = items.map((i) => document.getElementById(i.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [items]);

  return (
    <nav aria-label="Page sections" className="hidden xl:flex fixed right-5 top-1/2 -translate-y-1/2 z-[60] flex-col gap-3">
      {items.map((i) => (
        <a key={i.id} href={`#${i.id}`} aria-label={i.label} className="group relative flex items-center justify-end">
          <span className="absolute right-6 whitespace-nowrap rounded-full bg-[#17191C] text-white text-xs font-bold px-3 py-1 opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all">{i.label}</span>
          <span className={`block rounded-full border-2 transition-all duration-300 ${active === i.id ? "w-4 h-4 bg-[#C80808] border-[#C80808] shadow-[0_0_0_5px_rgba(200,8,8,0.2)]" : "w-3 h-3 bg-white border-[#929DA7] group-hover:border-[#C80808]"}`} />
        </a>
      ))}
    </nav>
  );
}
