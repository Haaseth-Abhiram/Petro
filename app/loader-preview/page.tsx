import React from "react";
import Image from "next/image";

export const metadata = { title: "Loader options", robots: { index: false, follow: false } };

const R = "#C80808";
const G = "#E0A21A";
const GL = "#F2B93B";

const css = `
.lp *{box-sizing:border-box}
@keyframes lp-spin{to{transform:rotate(360deg)}}
@keyframes lp-spinr{to{transform:rotate(-360deg)}}
@keyframes lp-fill{0%{clip-path:inset(0 100% 0 0)}70%,100%{clip-path:inset(0 0 0 0)}}
@keyframes lp-fillup{0%{clip-path:inset(100% 0 0 0)}70%,100%{clip-path:inset(0 0 0 0)}}
@keyframes lp-pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.12)}}
@keyframes lp-ring{0%{transform:scale(.4);opacity:.9}100%{transform:scale(1.5);opacity:0}}
@keyframes lp-bar{0%,100%{transform:scaleY(.25)}50%{transform:scaleY(1)}}
@keyframes lp-flow{from{background-position:0 0}to{background-position:40px 0}}
@keyframes lp-bub{0%{transform:translate(0,0) scale(.4);opacity:0}30%{opacity:1}100%{transform:translate(70px,-10px) scale(1);opacity:0}}
@keyframes lp-dash{0%{stroke-dashoffset:260}60%,100%{stroke-dashoffset:0}}
@keyframes lp-hop{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-16px)}}
@keyframes lp-needle{0%{transform:rotate(-120deg)}60%,100%{transform:rotate(100deg)}}
@keyframes lp-slideL{0%,15%{transform:translateX(0)}60%,100%{transform:translateX(-101%)}}
@keyframes lp-slideR{0%,15%{transform:translateX(0)}60%,100%{transform:translateX(101%)}}
@keyframes lp-belt{from{transform:translateX(-30px)}to{transform:translateX(150px)}}
@keyframes lp-width{0%{width:0}80%,100%{width:100%}}
@keyframes lp-drop{0%{transform:translateY(-30px);opacity:0}30%{opacity:1}100%{transform:translateY(40px);opacity:0}}
@keyframes lp-wave{from{transform:translateX(0)}to{transform:translateX(-50%)}}
.lp .a-spin{animation:lp-spin 2.4s linear infinite}
.lp .a-spinr{animation:lp-spinr 2.4s linear infinite}
`;

const Tile = ({ n, name, children }: { n: number; name: string; children: React.ReactNode }) => (
  <div className="rounded-2xl overflow-hidden bg-white border border-[#E7E9EE] shadow-md">
    <div className="relative h-[250px] bg-gradient-to-br from-[#17191C] via-[#221315] to-[#17191C] flex items-center justify-center overflow-hidden">
      <div className="absolute -top-16 -left-16 w-48 h-48 rounded-full bg-[#C80808]/25 blur-[60px]" />
      <div className="absolute -bottom-16 -right-16 w-48 h-48 rounded-full bg-[#E0A21A]/20 blur-[60px]" />
      <div className="relative flex flex-col items-center">{children}</div>
    </div>
    <div className="px-4 py-3 flex items-center gap-2"><span className="rounded-full bg-[#C80808] text-white text-[11px] font-extrabold px-2.5 py-0.5">L{n}</span><span className="text-[13.5px] font-extrabold text-[#17191C]">{name}</span></div>
  </div>
);

const Word = ({ dim = true }: { dim?: boolean }) => (
  <div className="relative w-[180px] aspect-[200/76]">
    <Image src="/assets/img/logo.png" alt="" fill sizes="200px" className={`object-contain grayscale brightness-200 ${dim ? "opacity-[0.18]" : ""}`} />
    <Image src="/assets/img/logo.png" alt="Petro" fill sizes="200px" className="object-contain" style={{ animation: "lp-fill 2.2s cubic-bezier(.2,.7,.2,1) infinite" }} />
  </div>
);
const Flame = ({ w = 60, h = 88, style }: { w?: number; h?: number; style?: React.CSSProperties }) => (
  <div className="relative" style={{ width: w, height: h, ...style }}><Image src="/assets/img/flame-logo-clean.png" alt="" fill sizes="90px" className="object-contain drop-shadow-[0_6px_20px_rgba(224,162,26,0.5)]" /></div>
);
const Cap = ({ t }: { t: string }) => <div className="mt-4 text-[10.5px] font-bold uppercase tracking-[0.3em] text-white/70">{t}</div>;

export default function Page() {
  return (
    <div className="lp bg-[#FFF8F0] min-h-screen">
      <style>{css}</style>
      <div className="max-w-[1240px] mx-auto px-5 sm:px-8 py-10">
        <h1 className="text-3xl font-black text-[#17191C]">Loader options — 15 designs (L1–L15)</h1>
        <p className="mt-2 mb-8">All in the Petro logo colours (red, gold, charcoal) using your real logo. Tell me the number you like and I&apos;ll make it the site loader. (Temporary page; the live loader is unchanged.)</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">

          <Tile n={1} name="Logo colour-fill"><Word /><Cap t="Loading" /></Tile>

          <Tile n={2} name="Flame pulse with ripples">
            <div className="relative w-[120px] h-[120px] flex items-center justify-center">
              {[0, 1].map((i) => (<span key={i} className="absolute inset-0 rounded-full border-2" style={{ borderColor: i ? G : R, animation: `lp-ring 2s ease-out ${i * 1}s infinite` }} />))}
              <Flame style={{ animation: "lp-pulse 1.4s ease-in-out infinite" }} />
            </div><Cap t="Petro Engineering" /></Tile>

          <Tile n={3} name="Orbiting rings">
            <div className="relative w-[130px] h-[130px] flex items-center justify-center">
              <svg className="absolute inset-0 a-spin" viewBox="0 0 100 100"><circle cx="50" cy="50" r="46" fill="none" stroke={R} strokeWidth="3" strokeDasharray="70 220" strokeLinecap="round" /></svg>
              <svg className="absolute inset-3 a-spinr" viewBox="0 0 100 100"><circle cx="50" cy="50" r="46" fill="none" stroke={G} strokeWidth="3" strokeDasharray="50 240" strokeLinecap="round" /></svg>
              <Flame w={36} h={54} />
            </div><Cap t="Loading" /></Tile>

          <Tile n={4} name="Liquid flowing through a pipe">
            <div className="relative w-[220px] h-[34px] rounded-full border-2 border-white/30 bg-white/5 overflow-hidden">
              <div className="absolute inset-0" style={{ backgroundImage: `repeating-linear-gradient(115deg,${R} 0 14px,${G} 14px 28px)`, backgroundSize: "40px 100%", animation: "lp-flow .8s linear infinite" }} />
              <div className="absolute inset-x-0 top-0 h-1/2 bg-white/20" />
            </div>
            <div className="mt-3 flex gap-1">{[0, 1, 2, 3].map((i) => <span key={i} className="w-2 h-2 rounded-full" style={{ background: GL, animation: `lp-hop 1s ease-in-out ${i * 0.12}s infinite` }} />)}</div>
            <Cap t="Supplying" /></Tile>

          <Tile n={5} name="Water drop filling">
            <svg width="90" height="120" viewBox="0 0 90 120"><path d="M45 6 C45 6 10 50 10 76 a35 35 0 0 0 70 0 C80 50 45 6 45 6Z" fill="none" stroke="rgba(255,255,255,.35)" strokeWidth="3" /><path d="M45 6 C45 6 10 50 10 76 a35 35 0 0 0 70 0 C80 50 45 6 45 6Z" fill={`url(#dg)`} style={{ animation: "lp-fillup 2s ease-in-out infinite" }} /><defs><linearGradient id="dg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={GL} /><stop offset=".5" stopColor={G} /><stop offset="1" stopColor={R} /></linearGradient></defs></svg>
            <Cap t="Water treatment" /></Tile>

          <Tile n={6} name="Pressure gauge sweep">
            <svg width="150" height="110" viewBox="0 0 150 110"><path d="M20 95 A55 55 0 0 1 130 95" fill="none" stroke="rgba(255,255,255,.2)" strokeWidth="10" strokeLinecap="round" /><path d="M20 95 A55 55 0 0 1 130 95" fill="none" stroke="url(#gg)" strokeWidth="10" strokeLinecap="round" /><defs><linearGradient id="gg"><stop offset="0" stopColor={G} /><stop offset="1" stopColor={R} /></linearGradient></defs>
              <g style={{ transformOrigin: "75px 95px", animation: "lp-needle 2.2s cubic-bezier(.4,0,.2,1) infinite alternate" }}><polygon points="75,95 72,92 75,40 78,92" fill="#fff" /></g><circle cx="75" cy="95" r="7" fill={R} stroke="#fff" strokeWidth="2" /></svg>
            <Cap t="Measuring" /></Tile>

          <Tile n={7} name="Valve wheel">
            <div className="relative w-[110px] h-[110px] a-spin">
              <svg viewBox="0 0 100 100" className="w-full h-full"><circle cx="50" cy="50" r="40" fill="none" stroke={R} strokeWidth="8" />{[0, 60, 120].map((a) => <line key={a} x1="50" y1="10" x2="50" y2="90" stroke={G} strokeWidth="6" strokeLinecap="round" transform={`rotate(${a} 50 50)`} />)}<circle cx="50" cy="50" r="10" fill={GL} /></svg>
            </div><Cap t="Valves & fittings" /></Tile>

          <Tile n={8} name="Flame being drawn">
            <svg width="110" height="130" viewBox="0 0 100 120"><path d="M52 6 C70 30 88 48 80 78 C75 98 60 112 46 112 C26 112 14 96 18 74 C20 58 34 52 38 36 C40 26 44 16 52 6Z" fill="none" stroke={`url(#fg)`} strokeWidth="4" strokeLinecap="round" strokeDasharray="260" style={{ animation: "lp-dash 2.4s ease-in-out infinite" }} /><path d="M54 52 C62 66 70 74 66 90 C63 100 56 106 48 106 C40 106 36 98 38 88 C40 76 52 70 54 52Z" fill="none" stroke={GL} strokeWidth="3" strokeDasharray="260" style={{ animation: "lp-dash 2.4s ease-in-out .3s infinite" }} /><defs><linearGradient id="fg"><stop offset="0" stopColor={R} /><stop offset="1" stopColor={G} /></linearGradient></defs></svg>
            <Cap t="Petro" /></Tile>

          <Tile n={9} name="Equaliser bars">
            <div className="flex items-end gap-1.5 h-[70px]">{[0, 1, 2, 3, 4, 5, 6].map((i) => <span key={i} className="w-3 h-full rounded-full origin-bottom" style={{ background: i % 2 ? G : R, animation: `lp-bar 1s ease-in-out ${i * 0.1}s infinite` }} />)}</div>
            <Cap t="Loading" /></Tile>

          <Tile n={10} name="Bouncing letters">
            <div className="flex gap-1 text-[44px] font-black leading-none">{"PETRO".split("").map((c, i) => <span key={i} style={{ color: i % 2 ? GL : "#fff", animation: `lp-hop 1.2s ease-in-out ${i * 0.1}s infinite`, textShadow: `0 0 18px ${i % 2 ? G : R}` }}>{c}</span>)}</div>
            <div className="mt-3 text-[10px] tracking-[0.35em] text-[#F2B93B] font-bold">ENGINEERING PVT LTD</div></Tile>

          <Tile n={11} name="Twin gears">
            <div className="relative w-[150px] h-[100px]">
              {[{ x: 0, y: 14, s: 70, c: R, cls: "a-spin" }, { x: 62, y: 28, s: 56, c: G, cls: "a-spinr" }].map((g, i) => (
                <svg key={i} className={`absolute ${g.cls}`} style={{ left: g.x, top: g.y }} width={g.s} height={g.s} viewBox="0 0 100 100"><circle cx="50" cy="50" r="32" fill="none" stroke={g.c} strokeWidth="14" />{Array.from({ length: 8 }).map((_, k) => <rect key={k} x="43" y="2" width="14" height="18" rx="3" fill={g.c} transform={`rotate(${k * 45} 50 50)`} />)}<circle cx="50" cy="50" r="9" fill="#17191C" /></svg>
              ))}
            </div><Cap t="Engineering" /></Tile>

          <Tile n={12} name="Curtain reveal">
            <div className="relative w-[220px] h-[100px] flex items-center justify-center overflow-hidden rounded-xl">
              <Word dim={false} />
              <span className="absolute inset-y-0 left-0 w-1/2 bg-[#17191C] border-r-2 border-[#E0A21A]" style={{ animation: "lp-slideL 2.4s ease-in-out infinite" }} />
              <span className="absolute inset-y-0 right-0 w-1/2 bg-[#17191C] border-l-2 border-[#E0A21A]" style={{ animation: "lp-slideR 2.4s ease-in-out infinite" }} />
            </div><Cap t="Welcome" /></Tile>

          <Tile n={13} name="Conveyor — supply in motion">
            <div className="relative w-[180px] h-[60px] overflow-hidden">
              <span className="absolute bottom-0 inset-x-0 h-[6px] rounded-full bg-white/25" />
              {[0, 1, 2].map((i) => <span key={i} className="absolute bottom-[6px] w-9 h-9 rounded-md" style={{ left: -30, background: i === 1 ? G : R, animation: `lp-belt 2.4s linear ${i * 0.8}s infinite`, boxShadow: "inset 0 0 0 3px rgba(255,255,255,.25)" }} />)}
            </div>
            <Cap t="Dispatching" /></Tile>

          <Tile n={14} name="Progress bar with counter">
            <Flame w={44} h={64} />
            <div className="mt-4 w-[200px] h-2 rounded-full bg-white/15 overflow-hidden"><div className="h-full rounded-full" style={{ background: `linear-gradient(90deg,${R},${G},${GL})`, animation: "lp-width 2.4s ease-in-out infinite" }} /></div>
            <Cap t="Loading" /></Tile>

          <Tile n={15} name="Rising wave in a circle">
            <div className="relative w-[110px] h-[110px] rounded-full border-2 border-white/40 overflow-hidden bg-white/5">
              <div className="absolute inset-0 flex items-center justify-center z-10"><Flame w={34} h={50} /></div>
              <div className="absolute left-0 w-[200%] h-[200%] top-[45%]" style={{ animation: "lp-wave 2.6s linear infinite" }}>
                <svg viewBox="0 0 200 20" preserveAspectRatio="none" className="w-full h-6"><path d="M0 10 Q25 0 50 10 T100 10 T150 10 T200 10 V20 H0Z" fill={R} fillOpacity=".75" /></svg>
                <div className="w-full h-full" style={{ background: R, opacity: 0.75 }} />
              </div>
            </div><Cap t="Filling up" /></Tile>

        </div>
      </div>
    </div>
  );
}
