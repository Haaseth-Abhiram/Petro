"use client";

import React, { useState } from "react";
import PetroLogo from "@/components/common/PetroLogo";
import { RotateCcw } from "lucide-react";

const CSS = `
@keyframes t-fade{0%,35%{opacity:1}100%{opacity:0}}
@keyframes t-splitL{0%,35%{transform:translateX(0)}100%{transform:translateX(-101%)}}
@keyframes t-splitR{0%,35%{transform:translateX(0)}100%{transform:translateX(101%)}}
@keyframes t-up{0%,35%{transform:translateY(0)}100%{transform:translateY(-101%)}}
@keyframes t-down{0%,35%{transform:translateY(0)}100%{transform:translateY(101%)}}
@keyframes t-left{0%,35%{transform:translateX(0)}100%{transform:translateX(-101%)}}
@keyframes t-iris{0%,35%{clip-path:circle(150% at 50% 50%)}100%{clip-path:circle(0% at 50% 50%)}}
@keyframes t-irisout{0%,35%{clip-path:circle(0% at 50% 50%)}100%{clip-path:circle(150% at 50% 50%)}}
@keyframes t-diag{0%,35%{clip-path:polygon(0 0,100% 0,100% 100%,0 100%)}100%{clip-path:polygon(0 0,0 0,0 100%,0 100%)}}
@keyframes t-zoom{0%,30%{transform:scale(1);opacity:1}100%{transform:scale(14);opacity:0}}
@keyframes t-blur{0%,30%{filter:blur(0);opacity:1;transform:scale(1)}100%{filter:blur(18px);opacity:0;transform:scale(1.2)}}
@keyframes t-blind{0%,35%{transform:scaleY(1)}100%{transform:scaleY(0)}}
@keyframes t-tile{0%,30%{opacity:1}100%{opacity:0}}
@keyframes t-flash{0%,35%{opacity:0}45%{opacity:.95}100%{opacity:0}}
@keyframes t-sweep{0%,30%{transform:translateX(-120%) skewX(-18deg)}100%{transform:translateX(320%) skewX(-18deg)}}
@keyframes t-shrink{0%,30%{transform:scale(1);opacity:1}100%{transform:scale(.2) translateY(-260%);opacity:0}}
@keyframes t-page{0%,40%{transform:scale(.96);opacity:.0}100%{transform:scale(1);opacity:1}}
@keyframes t-load{0%{width:0}35%,100%{width:100%}}
.t-a{animation-duration:2.4s;animation-fill-mode:both;animation-timing-function:cubic-bezier(.77,0,.18,1)}
`;

const Cover = ({ children, style, className = "" }: { children?: React.ReactNode; style?: React.CSSProperties; className?: string }) => (
  <div className={`absolute inset-0 bg-[#14161A] flex items-center justify-center ${className}`} style={style}>{children}</div>
);
const Brand = () => (<div className="flex flex-col items-center"><div className="w-[130px]"><PetroLogo variant="dark" width="100%" /></div><div className="mt-3 h-[3px] w-[100px] rounded-full bg-white/15 overflow-hidden"><div className="h-full bg-gradient-to-r from-[#C80808] to-[#F2B93B]" style={{ animation: "t-load 2.4s ease-out both" }} /></div></div>);
const Page = () => (
  <div className="absolute inset-0 bg-[#FFF8F0] overflow-hidden" style={{ animation: "t-page 2.4s ease-out both" }}>
    <div className="h-5 bg-white border-b border-[#E7E9EE] flex items-center px-3 gap-2"><span className="w-10 h-2 rounded bg-[#C80808]" /><span className="w-6 h-1.5 rounded bg-[#D8DDE2]" /><span className="w-6 h-1.5 rounded bg-[#D8DDE2]" /></div>
    <div className="m-3 h-14 rounded-lg bg-gradient-to-r from-[#8A0A0A] to-[#C80808]" />
    <div className="mx-3 grid grid-cols-3 gap-2"><span className="h-10 rounded bg-white border border-[#E7E9EE]" /><span className="h-10 rounded bg-white border border-[#E7E9EE]" /><span className="h-10 rounded bg-white border border-[#E7E9EE]" /></div>
  </div>
);
const a = (name: string, extra = "") => ({ animationName: name, ...(extra ? { animationDelay: extra } : {}) });

const T: { name: string; desc: string; render: () => React.ReactNode }[] = [
  { name: "Soft fade", desc: "The loader gently dissolves to reveal the page.", render: () => <Cover className="t-a" style={a("t-fade")}><Brand /></Cover> },
  { name: "Curtain split", desc: "Two halves part from the centre like gates.", render: () => (<><Cover className="t-a !w-1/2 !right-auto" style={a("t-splitL")}><div className="translate-x-[65px]"><Brand /></div></Cover><Cover className="t-a !w-1/2 !left-auto" style={a("t-splitR")}><div className="-translate-x-[65px] opacity-0"><Brand /></div></Cover></>) },
  { name: "Slide up", desc: "The loader slides upward off the screen.", render: () => <Cover className="t-a" style={a("t-up")}><Brand /></Cover> },
  { name: "Iris close", desc: "A circle closes onto the logo, revealing the page.", render: () => <Cover className="t-a" style={a("t-iris")}><Brand /></Cover> },
  { name: "Diagonal wipe", desc: "A clean wipe sweeps left, uncovering the page.", render: () => <Cover className="t-a" style={a("t-diag")}><Brand /></Cover> },
  { name: "Zoom through logo", desc: "The camera zooms into the flame, then the page appears.", render: () => <Cover className="t-a" style={a("t-zoom")}><Brand /></Cover> },
  { name: "Blur dissolve", desc: "The logo blurs and grows as it fades.", render: () => <Cover className="t-a" style={a("t-blur")}><Brand /></Cover> },
  { name: "Venetian blinds", desc: "Horizontal slats fold away one after another.", render: () => (<div className="absolute inset-0 flex flex-col">{Array.from({ length: 8 }).map((_, i) => (<div key={i} className="t-a flex-1 bg-[#14161A] origin-top border-b border-[#2a2c30]" style={{ animationName: "t-blind", animationDelay: `${i * 0.06}s` }} />))}</div>) },
  { name: "Tile dissolve", desc: "A grid of tiles flickers out at random.", render: () => (<div className="absolute inset-0 grid grid-cols-8 grid-rows-5">{Array.from({ length: 40 }).map((_, i) => (<div key={i} className="t-a bg-[#14161A]" style={{ animationName: "t-tile", animationDelay: `${((i * 37) % 40) * 0.025}s`, animationDuration: ".5s" }} />))}</div>) },
  { name: "Gold flash + sweep", desc: "A light sweeps across, a gold flash, then the page.", render: () => (<><Cover className="t-a" style={a("t-fade")}><Brand /></Cover><div className="absolute inset-0 overflow-hidden pointer-events-none"><span className="t-a absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-transparent via-[#F2B93B]/80 to-transparent" style={a("t-sweep")} /></div><div className="t-a absolute inset-0 bg-[radial-gradient(circle,#F2B93B,#C80808_55%,transparent_75%)]" style={a("t-flash")} /></>) },
];

function Card({ n, i }: { n: (typeof T)[number]; i: number }) {
  const [k, setK] = useState(0);
  return (
    <div className="rounded-2xl overflow-hidden bg-white border border-[#E7E9EE] shadow-lg">
      <div key={k} className="relative h-[190px] overflow-hidden bg-[#FFF8F0]"><Page />{n.render()}</div>
      <div className="px-4 py-3 flex items-start gap-3">
        <div className="flex-1"><div className="flex items-center gap-2"><span className="rounded-full bg-[#C80808] text-white text-[11px] font-extrabold px-2.5 py-0.5">T{i + 1}</span><span className="text-[13.5px] font-extrabold text-[#17191C]">{n.name}</span></div><p className="text-[12px] text-[#4a5159] mt-1">{n.desc}</p></div>
        <button type="button" onClick={() => setK(k + 1)} className="shrink-0 inline-flex items-center gap-1 rounded-full border border-[#E7E9EE] hover:border-[#C80808] hover:text-[#C80808] px-3 py-1.5 text-[12px] font-bold text-[#17191C]"><RotateCcw className="w-3.5 h-3.5" />Replay</button>
      </div>
    </div>
  );
}

export default function Page2() {
  return (
    <div className="bg-[#FFF8F0] min-h-screen">
      <style>{CSS}</style>
      <div className="max-w-[1240px] mx-auto px-5 sm:px-8 py-10">
        <h1 className="text-3xl font-black text-[#17191C]">Loader transitions — 10 options (T1–T10)</h1>
        <p className="mt-2 mb-8">Each box shows the loader leaving and the page appearing. They replay automatically; press Replay to watch again. Tell me the number and I&apos;ll make it the live transition. (Temporary page; the live site is unchanged.)</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">{T.map((n, i) => (<Card key={n.name} n={n} i={i} />))}</div>
      </div>
    </div>
  );
}
