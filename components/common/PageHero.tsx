import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Home as HomeIcon, ChevronRight } from "lucide-react";

export type HeroChip = { icon: React.ElementType; text: string };

type Props = {
  crumb: string;
  eyebrow: string;
  title: string;
  accent: string;
  text: string;
  actions: React.ReactNode;
  marquee: string[];
  bg: string;
  /** "split" (default): copy left, visual right. "centered": copy centered, `strip` shown under it. */
  layout?: "split" | "centered";
  /** Custom right-hand visual for the split layout. Falls back to the photo collage. */
  visual?: React.ReactNode;
  photos?: [string, string, string];
  chips?: [HeroChip, HeroChip];
  /** Row of content shown under the centered layout (e.g. stats). */
  strip?: React.ReactNode;
};

function Collage({ photos, chips }: { photos: [string, string, string]; chips: [HeroChip, HeroChip] }) {
  const C1 = chips[0].icon;
  const C2 = chips[1].icon;
  return (
    <div className="relative hidden lg:block h-[290px]">
      <div className="absolute left-2 top-6 w-[62%] h-[210px] rounded-2xl overflow-hidden border-4 border-white/90 shadow-2xl -rotate-3 animate-floaty">
        <Image src={photos[0]} alt="" fill sizes="340px" className="object-cover" priority />
      </div>
      <div className="absolute right-0 top-0 w-[48%] h-[160px] rounded-2xl overflow-hidden border-4 border-white/90 shadow-2xl rotate-3 animate-floaty [animation-delay:-2.5s]">
        <Image src={photos[1]} alt="" fill sizes="260px" className="object-cover" />
      </div>
      <div className="absolute right-6 bottom-0 w-[50%] h-[130px] rounded-2xl overflow-hidden border-4 border-white/90 shadow-2xl -rotate-2 animate-floaty [animation-delay:-4.5s]">
        <Image src={photos[2]} alt="" fill sizes="260px" className="object-cover" />
      </div>
      <span className="absolute left-0 bottom-4 inline-flex items-center gap-2 rounded-xl bg-white text-[#17191C] text-[12px] font-extrabold px-3 py-2 shadow-xl animate-floaty [animation-delay:-1s]"><span className="w-7 h-7 rounded-lg bg-[#C80808] text-white flex items-center justify-center"><C1 className="w-4 h-4" /></span>{chips[0].text}</span>
      <span className="absolute right-[38%] -top-1 inline-flex items-center gap-2 rounded-xl bg-[#E0A21A] text-[#17191C] text-[12px] font-extrabold px-3 py-2 shadow-xl animate-floaty [animation-delay:-3.5s]"><C2 className="w-4 h-4" />{chips[1].text}</span>
    </div>
  );
}

/** Compact dark page hero with breadcrumb, headline, actions and a keyword marquee. Two layouts so pages don't look alike. */
export default function PageHero({ crumb, eyebrow, title, accent, text, actions, marquee, bg, layout = "split", visual, photos, chips, strip }: Props) {
  const centered = layout === "centered";
  return (
    <section className="relative bg-[#17191C] text-white overflow-hidden">
      <div className={`absolute inset-0 bg-cover bg-center ${centered ? "opacity-50" : "opacity-40"}`} style={{ backgroundImage: `url('${bg}')` }} />
      <div className={`absolute inset-0 ${centered ? "bg-gradient-to-b from-[#17191C]/70 via-[#17191C]/55 to-[#17191C]/90" : "bg-gradient-to-r from-[#17191C]/85 via-[#17191C]/75 to-[#17191C]/45"}`} />
      <div className="absolute -top-28 -right-20 w-[460px] h-[460px] rounded-full bg-[#E0A21A]/25 blur-[120px] animate-blob" />
      <div className="absolute -bottom-32 -left-24 w-[420px] h-[420px] rounded-full bg-[#C80808]/30 blur-[120px] animate-blob" />
      <div className="absolute inset-0 dot-grid opacity-25 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />

      {centered ? (
        <div className="relative max-w-[1000px] mx-auto px-5 sm:px-8 pt-8 pb-8 text-center">
          <nav aria-label="Breadcrumb" className="flex items-center justify-center gap-1.5 text-[12px] text-white/70 mb-3">
            <Link href="/" className="hover:text-white inline-flex items-center gap-1"><HomeIcon className="w-3.5 h-3.5" />Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-[#F2B93B] font-semibold">{crumb}</span>
          </nav>
          <span className="inline-flex items-center gap-3 text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#F2B93B] mb-2"><span className="h-[3px] w-9 rounded bg-[#F2B93B]" />{eyebrow}<span className="h-[3px] w-9 rounded bg-[#F2B93B]" /></span>
          <h1 className="text-white text-[1.8rem] sm:text-[2.5rem] lg:text-[3rem] font-black tracking-tight leading-[1.08] mb-3">{title} <span className="text-gradient animate-gradient">{accent}</span></h1>
          <p className="text-white/80 text-[14.5px] sm:text-base leading-relaxed max-w-[640px] mx-auto mb-5">{text}</p>
          <div className="flex flex-wrap justify-center gap-3 mb-7">{actions}</div>
          {strip}
        </div>
      ) : (
        <div className="relative max-w-[1240px] mx-auto px-5 sm:px-8 pt-8 pb-10 grid lg:grid-cols-[1.1fr_1fr] gap-8 items-center">
          <div>
            <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[12px] text-white/70 mb-3">
              <Link href="/" className="hover:text-white inline-flex items-center gap-1"><HomeIcon className="w-3.5 h-3.5" />Home</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-[#F2B93B] font-semibold">{crumb}</span>
            </nav>
            <span className="inline-flex items-center gap-3 text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#F2B93B] mb-2"><span className="h-[3px] w-9 rounded bg-[#F2B93B]" />{eyebrow}</span>
            <h1 className="text-white text-[1.75rem] sm:text-[2.3rem] lg:text-[2.6rem] font-black tracking-tight leading-[1.1] mb-3">{title} <span className="text-gradient animate-gradient">{accent}</span></h1>
            <p className="text-white/80 text-[14.5px] sm:text-[15px] leading-relaxed max-w-[540px] mb-5">{text}</p>
            <div className="flex flex-wrap gap-3">{actions}</div>
          </div>
          {visual ?? (photos && chips ? <Collage photos={photos} chips={chips} /> : null)}
        </div>
      )}

      {/* keyword marquee */}
      <div className="relative border-t border-white/10 bg-black/25 overflow-hidden">
        <div className="flex w-max animate-marquee py-2.5">
          {[0, 1].map((r) => (
            <div key={r} className="flex items-center gap-8 pr-8 text-[11.5px] font-extrabold uppercase tracking-[0.22em] text-white/70 whitespace-nowrap">
              {marquee.map((m) => (<span key={m + r} className="inline-flex items-center gap-8">{m}<span className="w-1.5 h-1.5 rounded-full bg-[#E0A21A]" /></span>))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
