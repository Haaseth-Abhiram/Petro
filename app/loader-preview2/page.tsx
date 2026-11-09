import React from "react";
import Image from "next/image";

export const metadata = { title: "Loader options 2", robots: { index: false, follow: false } };

const R = "#C80808", D = "#8A0A0A", G = "#E0A21A", GL = "#F2B93B";

const css = `
@keyframes q-spin{to{transform:rotate(360deg)}}
@keyframes q-spinr{to{transform:rotate(-360deg)}}
@keyframes q-pulse{0%,100%{transform:scale(1);opacity:.9}50%{transform:scale(1.1);opacity:1}}
@keyframes q-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
@keyframes q-rise{0%{transform:translateY(0) scale(1);opacity:0}15%{opacity:1}100%{transform:translateY(-150px) scale(.2);opacity:0}}
@keyframes q-sweep{to{transform:rotate(360deg)}}
@keyframes q-blip{0%,100%{opacity:0;transform:scale(.4)}20%{opacity:1;transform:scale(1)}}
@keyframes q-dash{to{stroke-dashoffset:-60}}
@keyframes q-draw{0%{stroke-dashoffset:300}55%,100%{stroke-dashoffset:0}}
@keyframes q-wave{from{background-position-x:0}to{background-position-x:-200px}}
@keyframes q-fillup{0%{background-position-y:100%}80%,100%{background-position-y:0%}}
@keyframes q-glowflick{0%,100%{filter:drop-shadow(0 0 6px ${R}) drop-shadow(0 0 16px ${G})}45%{filter:drop-shadow(0 0 2px ${R})}50%{filter:drop-shadow(0 0 14px ${GL}) drop-shadow(0 0 30px ${R})}}
@keyframes q-scan{0%{top:0}100%{top:100%}}
@keyframes q-hex{0%,100%{opacity:.12;transform:scale(.9)}40%{opacity:1;transform:scale(1)}}
@keyframes q-warp{0%{transform:scaleX(.1);opacity:0}30%{opacity:1}100%{transform:scaleX(1);opacity:0}}
@keyframes q-cube{from{transform:rotateX(-20deg) rotateY(0)}to{transform:rotateX(-20deg) rotateY(360deg)}}
@keyframes q-bar{0%{width:0}85%,100%{width:100%}}
@keyframes q-shine{from{transform:translateX(-150%) skewX(-20deg)}to{transform:translateX(300%) skewX(-20deg)}}
@keyframes q-zoom{0%{transform:scale(.6);opacity:0}40%,70%{transform:scale(1);opacity:1}100%{transform:scale(1.15);opacity:0}}
@keyframes q-split{0%,10%{transform:translateX(0)}55%,100%{transform:translateX(var(--d))}}
@keyframes q-smoke{0%{transform:translate(0,0) scale(.5);opacity:.0}20%{opacity:.5}100%{transform:translate(18px,-90px) scale(2);opacity:0}}
@keyframes q-count{0%{--n:0}100%{--n:100}}
.q-s{animation:q-spin 8s linear infinite}.q-sr{animation:q-spinr 6s linear infinite}
`;

const Tile = ({ n, name, desc, children }: { n: number; name: string; desc: string; children: React.ReactNode }) => (
  <div className="rounded-2xl overflow-hidden bg-white border border-[#E7E9EE] shadow-lg">
    <div className="relative h-[300px] bg-[#14161A] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#2a0c0c] via-[#14161A] to-[#2a2108]" />
      <div className="absolute -top-20 -left-16 w-56 h-56 rounded-full bg-[#C80808]/30 blur-[70px]" />
      <div className="absolute -bottom-20 -right-16 w-56 h-56 rounded-full bg-[#E0A21A]/25 blur-[70px]" />
      <div className="absolute inset-0 opacity-70" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.05) 1px,transparent 1px)", backgroundSize: "28px 28px", maskImage: "radial-gradient(ellipse at center,#000,transparent 75%)", WebkitMaskImage: "radial-gradient(ellipse at center,#000,transparent 75%)" }} />
      <div className="relative flex flex-col items-center">{children}</div>
    </div>
    <div className="px-4 py-3"><div className="flex items-center gap-2"><span className="rounded-full bg-[#C80808] text-white text-[11px] font-extrabold px-2.5 py-0.5">M{n}</span><span className="text-[13.5px] font-extrabold text-[#17191C]">{name}</span></div><p className="text-[12px] text-[#4a5159] mt-1">{desc}</p></div>
  </div>
);

const Flame = ({ w = 64, h = 94, glow = true, style }: { w?: number; h?: number; glow?: boolean; style?: React.CSSProperties }) => (
  <div className="relative" style={{ width: w, height: h, ...style }}><Image src="/assets/img/flame-logo-clean.png" alt="" fill sizes="100px" className={`object-contain ${glow ? "drop-shadow-[0_6px_22px_rgba(224,162,26,0.6)]" : ""}`} /></div>
);
const Logo = ({ w = 190, dim = false }: { w?: number; dim?: boolean }) => (
  <div className="relative" style={{ width: w, aspectRatio: "200/76" }}><Image src="/assets/img/logo.png" alt="Petro" fill sizes="220px" className={`object-contain ${dim ? "grayscale brightness-200 opacity-20" : ""}`} /></div>
);
const Cap = ({ t, c = "text-white/70" }: { t: string; c?: string }) => <div className={`mt-4 text-[10.5px] font-bold uppercase tracking-[0.32em] ${c}`}>{t}</div>;
const Prog = ({ w = 190 }: { w?: number }) => (<div className="mt-3 h-[5px] rounded-full bg-white/15 overflow-hidden" style={{ width: w }}><div className="h-full rounded-full" style={{ background: `linear-gradient(90deg,${R},${G},${GL})`, animation: "q-bar 2.6s cubic-bezier(.3,.7,.2,1) infinite" }} /></div>);

export default function Page() {
  const hex = Array.from({ length: 19 });
  const rays = Array.from({ length: 24 });
  return (
    <div className="bg-[#FFF8F0] min-h-screen">
      <style>{css}</style>
      <div className="max-w-[1240px] mx-auto px-5 sm:px-8 py-10">
        <h1 className="text-3xl font-black text-[#17191C]">Loader options, round 2 — 18 cinematic designs (M1–M18)</h1>
        <p className="mt-2 mb-8">Richer scenes, all built around your real flame and logo in red, gold and charcoal. Tell me the number(s) you like. (Temporary page; the live loader is unchanged.)</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">

          <Tile n={1} name="Reactor core" desc="Rotating hex-style rings with a glowing flame core.">
            <div className="relative w-[190px] h-[190px] flex items-center justify-center">
              <svg className="absolute inset-0 q-s" viewBox="0 0 200 200"><polygon points="100,6 181,53 181,147 100,194 19,147 19,53" fill="none" stroke={G} strokeOpacity=".7" strokeWidth="2" strokeDasharray="6 8" /></svg>
              <svg className="absolute inset-4 q-sr" viewBox="0 0 200 200"><polygon points="100,6 181,53 181,147 100,194 19,147 19,53" fill="none" stroke={R} strokeWidth="3" strokeDasharray="90 160" strokeLinecap="round" /></svg>
              <svg className="absolute inset-9 q-s" style={{ animationDuration: "5s" }} viewBox="0 0 200 200"><circle cx="100" cy="100" r="92" fill="none" stroke={GL} strokeWidth="2" strokeDasharray="30 270" strokeLinecap="round" /></svg>
              <div className="absolute w-24 h-24 rounded-full bg-[#C80808]/40 blur-2xl" style={{ animation: "q-pulse 1.8s ease-in-out infinite" }} />
              <Flame w={52} h={76} style={{ animation: "q-float 2.4s ease-in-out infinite" }} />
            </div><Cap t="Initialising" /></Tile>

          <Tile n={2} name="Molecule network" desc="Connected nodes pulse around the flame.">
            <div className="relative w-[210px] h-[190px]">
              <svg viewBox="0 0 210 190" className="absolute inset-0">
                {[[105, 95, 40, 30], [105, 95, 175, 40], [105, 95, 30, 150], [105, 95, 180, 155], [40, 30, 175, 40], [30, 150, 180, 155], [40, 30, 30, 150], [175, 40, 180, 155]].map(([a, b, c, d], i) => (<line key={i} x1={a} y1={b} x2={c} y2={d} stroke={i < 4 ? G : "rgba(255,255,255,.25)"} strokeWidth="1.5" strokeDasharray="4 6" style={{ animation: "q-dash 1.2s linear infinite" }} />))}
                {[[40, 30, R], [175, 40, G], [30, 150, G], [180, 155, R]].map(([x, y, c], i) => (<g key={i}><circle cx={x as number} cy={y as number} r="14" fill={c as string} opacity=".25" style={{ animation: `q-pulse 1.8s ease-in-out ${i * 0.3}s infinite`, transformOrigin: `${x}px ${y}px` }} /><circle cx={x as number} cy={y as number} r="7" fill={c as string} /></g>))}
              </svg>
              <div className="absolute inset-0 flex items-center justify-center"><Flame w={44} h={64} /></div>
            </div><Cap t="Connecting suppliers" /></Tile>

          <Tile n={3} name="Blueprint draw" desc="The flame is drawn like an engineering drawing, with dimension lines.">
            <div className="relative">
              <svg width="190" height="150" viewBox="0 0 190 150">
                <path d="M96 8 C122 40 150 62 138 104 C130 130 110 142 92 142 C64 142 46 122 52 92 C56 70 76 62 82 40 C85 28 90 18 96 8Z" fill="none" stroke={GL} strokeWidth="2.5" strokeDasharray="300" style={{ animation: "q-draw 3s ease-in-out infinite" }} />
                <path d="M100 70 C112 90 124 100 118 120 C114 132 104 138 94 138 C84 138 78 128 82 116 C86 100 98 94 100 70Z" fill="none" stroke={R} strokeWidth="2.5" strokeDasharray="300" style={{ animation: "q-draw 3s ease-in-out .3s infinite" }} />
                <g stroke="rgba(255,255,255,.45)" strokeWidth="1"><line x1="20" y1="8" x2="20" y2="142" /><line x1="14" y1="8" x2="26" y2="8" /><line x1="14" y1="142" x2="26" y2="142" /><line x1="46" y1="148" x2="150" y2="148" /></g>
                <text x="28" y="80" fill="rgba(255,255,255,.55)" fontSize="9" fontFamily="monospace">134.0</text><text x="82" y="146" fill="rgba(255,255,255,.55)" fontSize="9" fontFamily="monospace" textAnchor="middle">104.0 mm</text>
              </svg>
            </div><Prog /><Cap t="Drafting" /></Tile>

          <Tile n={4} name="Refinery at dusk" desc="A plant skyline with a burning flare and rising smoke.">
            <div className="relative w-[240px] h-[170px]">
              <svg viewBox="0 0 240 170" className="absolute inset-0"><g fill="#0b0c0e"><rect x="0" y="130" width="240" height="40" /><rect x="14" y="80" width="26" height="52" /><rect x="46" y="100" width="20" height="32" /><rect x="76" y="70" width="12" height="62" /><rect x="96" y="96" width="38" height="36" /><rect x="142" y="84" width="22" height="48" /><rect x="170" y="108" width="40" height="24" /></g><g stroke="#0b0c0e" strokeWidth="3"><line x1="82" y1="70" x2="82" y2="30" /></g><g fill={G} opacity=".8">{[22, 30, 52, 100, 112, 148, 156, 180, 196].map((x, i) => <rect key={i} x={x} y={92 + (i % 3) * 12} width="3" height="3" style={{ animation: `q-hex 2s ease-in-out ${i * 0.2}s infinite` }} />)}</g></svg>
              <div className="absolute" style={{ left: 66, top: -6 }}><Flame w={32} h={46} style={{ animation: "q-pulse 1.1s ease-in-out infinite" }} /></div>
              {[0, 1, 2].map((i) => <span key={i} className="absolute rounded-full bg-white/40 blur-md" style={{ left: 82, top: 18, width: 22, height: 22, animation: `q-smoke 3.2s ease-out ${i * 1.05}s infinite` }} />)}
            </div><Prog w={220} /><Cap t="Starting up" /></Tile>

          <Tile n={5} name="Liquid flame" desc="The flame silhouette fills with a rolling wave of red and gold.">
            <div className="relative" style={{ width: 96, height: 140 }}>
              <div className="absolute inset-0 opacity-25" style={{ WebkitMaskImage: "url(/assets/img/flame-logo-clean.png)", maskImage: "url(/assets/img/flame-logo-clean.png)", WebkitMaskSize: "contain", maskSize: "contain", WebkitMaskRepeat: "no-repeat", maskRepeat: "no-repeat", WebkitMaskPosition: "center", maskPosition: "center", background: "#fff" }} />
              <div className="absolute inset-0" style={{ WebkitMaskImage: "url(/assets/img/flame-logo-clean.png)", maskImage: "url(/assets/img/flame-logo-clean.png)", WebkitMaskSize: "contain", maskSize: "contain", WebkitMaskRepeat: "no-repeat", maskRepeat: "no-repeat", WebkitMaskPosition: "center", maskPosition: "center", backgroundImage: `linear-gradient(180deg,${GL},${G} 45%,${R} 80%,${D})`, backgroundSize: "100% 220%", animation: "q-fillup 2.8s ease-in-out infinite" }} />
            </div><Cap t="Igniting" /></Tile>

          <Tile n={6} name="Radar scan" desc="A radar sweep finds supply points around your logo.">
            <div className="relative w-[200px] h-[200px] rounded-full border border-white/25">
              {[0.66, 0.33].map((s) => <span key={s} className="absolute rounded-full border border-white/20" style={{ inset: `${(1 - s) * 50}%` }} />)}
              <span className="absolute inset-0 rounded-full" style={{ background: `conic-gradient(from 0deg,transparent 0 300deg,${G}aa 340deg,${GL} 360deg)`, animation: "q-sweep 2.4s linear infinite", maskImage: "radial-gradient(circle,#000 0,#000 70%,transparent 71%)", WebkitMaskImage: "radial-gradient(circle,#000 0,#000 70%,transparent 71%)" }} />
              {[[30, 28], [150, 50], [120, 150], [50, 130]].map(([x, y], i) => <span key={i} className="absolute w-2.5 h-2.5 rounded-full" style={{ left: x, top: y, background: i % 2 ? G : R, boxShadow: `0 0 12px ${i % 2 ? G : R}`, animation: `q-blip 2.4s linear ${i * 0.6}s infinite` }} />)}
              <div className="absolute inset-0 flex items-center justify-center"><Flame w={38} h={56} /></div>
            </div><Cap t="Locating" /></Tile>

          <Tile n={7} name="Rising embers" desc="Glowing embers lift off the flame — warm, premium.">
            <div className="relative w-[180px] h-[200px] flex items-end justify-center">
              {Array.from({ length: 16 }).map((_, i) => <span key={i} className="absolute rounded-full" style={{ left: 20 + ((i * 37) % 140), bottom: 40, width: 3 + (i % 3) * 2, height: 3 + (i % 3) * 2, background: i % 2 ? GL : R, boxShadow: `0 0 8px ${i % 2 ? G : R}`, animation: `q-rise ${2.2 + (i % 5) * 0.5}s ease-out ${(i % 7) * 0.35}s infinite` }} />)}
              <Flame w={62} h={92} style={{ animation: "q-glowflick 2.6s ease-in-out infinite", marginBottom: 20 }} />
            </div><Cap t="Warming up" /></Tile>

          <Tile n={8} name="3D logo cube" desc="A rotating cube with brand-coloured faces.">
            <div style={{ perspective: 600 }}>
              <div className="relative w-[90px] h-[90px]" style={{ transformStyle: "preserve-3d", animation: "q-cube 6s linear infinite" }}>
                {[{ t: "rotateY(0deg)", c: R }, { t: "rotateY(90deg)", c: G }, { t: "rotateY(180deg)", c: D }, { t: "rotateY(270deg)", c: GL }, { t: "rotateX(90deg)", c: "#17191C" }, { t: "rotateX(-90deg)", c: "#17191C" }].map((f, i) => (
                  <div key={i} className="absolute inset-0 flex items-center justify-center border border-white/30" style={{ transform: `${f.t} translateZ(45px)`, background: `${f.c}d9` }}>{i < 4 && <Flame w={34} h={50} glow={false} />}</div>
                ))}
              </div>
            </div><Cap t="Building" /></Tile>

          <Tile n={9} name="Pipeline network" desc="Flowing lines converge on the flame hub.">
            <svg width="240" height="170" viewBox="0 0 240 170">
              {["M0 30 H70 V85 H105", "M0 140 H60 V100 H105", "M240 30 H170 V85 H135", "M240 140 H180 V100 H135"].map((d, i) => (<g key={i}><path d={d} fill="none" stroke="rgba(255,255,255,.18)" strokeWidth="8" strokeLinejoin="round" /><path d={d} fill="none" stroke={i % 2 ? G : R} strokeWidth="4" strokeDasharray="10 14" strokeLinejoin="round" style={{ animation: "q-dash .9s linear infinite" }} /></g>))}
            </svg>
            <div className="absolute"><Flame w={44} h={64} style={{ animation: "q-pulse 1.6s ease-in-out infinite" }} /></div><Cap t="Supplying" /></Tile>

          <Tile n={10} name="Compliance ring" desc="Text circling the flame: right equipment, fully compliant, delivered on time.">
            <div className="relative w-[200px] h-[200px] flex items-center justify-center">
              <svg viewBox="0 0 200 200" className="absolute inset-0 q-s" style={{ animationDuration: "14s" }}><defs><path id="cr" d="M100 100 m-80 0 a80 80 0 1 1 160 0 a80 80 0 1 1 -160 0" /></defs><text fill={GL} fontSize="10.5" fontWeight="800" letterSpacing="2.4"><textPath href="#cr">RIGHT EQUIPMENT • FULLY COMPLIANT • DELIVERED ON TIME •</textPath></text></svg>
              <svg viewBox="0 0 200 200" className="absolute inset-6 q-sr"><circle cx="100" cy="100" r="92" fill="none" stroke={R} strokeWidth="3" strokeDasharray="120 460" strokeLinecap="round" /></svg>
              <Flame w={50} h={74} />
            </div></Tile>

          <Tile n={11} name="Hex grid wave" desc="A honeycomb lights up in a wave around the logo.">
            <div className="relative w-[200px] h-[190px]">
              {hex.map((_, i) => { const rows = [3, 4, 5, 4, 3]; let r = 0, c = i; while (c >= rows[r]) { c -= rows[r]; r++; } const x = 100 + (c - (rows[r] - 1) / 2) * 38; const y = 28 + r * 33; return (<svg key={i} className="absolute" width="36" height="40" viewBox="0 0 36 40" style={{ left: x - 18, top: y - 20, animation: `q-hex 2.4s ease-in-out ${(r + c) * 0.18}s infinite` }}><polygon points="18,1 34,10 34,30 18,39 2,30 2,10" fill={(r + c) % 2 ? G : R} stroke="#fff" strokeOpacity=".4" /></svg>); })}
            </div><Cap t="Aligning" /></Tile>

          <Tile n={12} name="Warp speed" desc="Light streaks rush past, then the logo locks in.">
            <div className="relative w-[240px] h-[200px] flex items-center justify-center overflow-hidden">
              {rays.map((_, i) => <span key={i} className="absolute left-1/2 top-1/2 h-[2px] w-[110px] origin-left" style={{ transform: `rotate(${i * 15}deg)` }}><span className="block h-full origin-left" style={{ background: `linear-gradient(90deg,transparent,${i % 2 ? G : R})`, animation: `q-warp 1.6s ease-out ${(i % 6) * 0.2}s infinite` }} /></span>)}
              <div style={{ animation: "q-zoom 2.4s ease-in-out infinite" }}><Logo w={150} /></div>
            </div></Tile>

          <Tile n={13} name="Neon outline" desc="The logo glows like neon with a scanning light.">
            <div className="relative" style={{ animation: "q-glowflick 3s ease-in-out infinite" }}>
              <Logo w={210} />
              <span className="absolute inset-0 overflow-hidden"><span className="absolute inset-y-0 w-1/4 bg-gradient-to-r from-transparent via-white/60 to-transparent" style={{ animation: "q-shine 2.2s ease-in-out infinite" }} /></span>
            </div><Prog /><Cap t="Powering on" /></Tile>

          <Tile n={14} name="Gyroscope" desc="Three 3D-tilted rings spin around the flame.">
            <div className="relative w-[190px] h-[190px] flex items-center justify-center" style={{ perspective: 500 }}>
              {[{ c: R, d: 6, rx: 70 }, { c: G, d: 8, rx: -55 }, { c: GL, d: 10, rx: 20 }].map((r, i) => (
                <span key={i} className="absolute inset-3 rounded-full" style={{ border: `3px solid ${r.c}`, borderTopColor: "transparent", transform: `rotateX(${r.rx}deg)`, animation: `q-spin ${r.d}s linear infinite${i === 1 ? " reverse" : ""}`, boxShadow: `0 0 14px ${r.c}66` }} />
              ))}
              <Flame w={42} h={62} style={{ animation: "q-float 2.2s ease-in-out infinite" }} />
            </div><Cap t="Calibrating" /></Tile>

          <Tile n={15} name="Gauge cluster" desc="Three dials fill up, like a control room.">
            <div className="flex items-end gap-3">
              {[0.0, 0.4, 0.8].map((dl, i) => (
                <svg key={i} width={i === 1 ? 96 : 78} height={i === 1 ? 96 : 78} viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,.15)" strokeWidth="9" /><circle cx="50" cy="50" r="40" fill="none" stroke={i === 1 ? R : G} strokeWidth="9" strokeLinecap="round" strokeDasharray="251" transform="rotate(-90 50 50)" style={{ animation: `q-draw 2.4s ease-in-out ${dl}s infinite`, strokeDashoffset: 251 }} /><text x="50" y="57" textAnchor="middle" fill="#fff" fontSize="20" fontWeight="800">{["PSI", "TDS", "pH"][i]}</text></svg>
              ))}
            </div><Cap t="Checking systems" /></Tile>

          <Tile n={16} name="Split-screen opening" desc="Two panels part like gates to reveal the logo.">
            <div className="relative w-[240px] h-[150px] rounded-xl overflow-hidden flex items-center justify-center bg-[#0e0f12] border border-white/15">
              <Logo w={170} />
              <span className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-[#8A0A0A] to-[#C80808]" style={{ ["--d" as string]: "-100%", animation: "q-split 2.6s ease-in-out infinite" }} />
              <span className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-[#B07A0A] to-[#E0A21A]" style={{ ["--d" as string]: "100%", animation: "q-split 2.6s ease-in-out infinite" }} />
            </div><Cap t="Opening" /></Tile>

          <Tile n={17} name="Logo + big counter" desc="A large percentage counts up beside the wordmark.">
            <Logo w={170} />
            <div className="mt-3 flex items-end gap-1"><span className="text-[64px] font-black leading-none text-transparent bg-clip-text" style={{ backgroundImage: `linear-gradient(180deg,${GL},${R})` }}>87</span><span className="text-[22px] font-extrabold text-white/60 mb-2">%</span></div>
            <Prog w={210} /></Tile>

          <Tile n={18} name="Signal pulse" desc="Expanding gold and red waves from a glowing flame.">
            <div className="relative w-[200px] h-[200px] flex items-center justify-center">
              {[0, 1, 2, 3].map((i) => <span key={i} className="absolute inset-[18%] rounded-full" style={{ border: `2px solid ${i % 2 ? G : R}`, animation: `q-blip 2.4s ease-out ${i * 0.6}s infinite`, transform: "scale(1)", boxShadow: `0 0 18px ${i % 2 ? G : R}55` }} />)}
              {[0, 1, 2].map((i) => <span key={i} className="absolute inset-[15%] rounded-full" style={{ background: `radial-gradient(circle,${i % 2 ? G : R}33,transparent 70%)`, animation: `q-pulse ${1.8 + i * 0.4}s ease-in-out infinite` }} />)}
              <Flame w={52} h={76} style={{ animation: "q-glowflick 2.2s ease-in-out infinite" }} />
            </div><Cap t="Transmitting" /></Tile>

        </div>
      </div>
    </div>
  );
}
