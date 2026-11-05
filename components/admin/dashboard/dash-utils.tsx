"use client";

import React, { useCallback, useEffect, useState } from "react";

export type DayPoint = { day: string; rfqs: number; enquiries: number; applications: number };

export function useDashboard() {
  const [data, setData] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [updatedAt, setUpdatedAt] = useState("");

  const load = useCallback(async () => {
    try {
      setRefreshing(true);
      const [s, u] = await Promise.all([fetch("/api/admin/stats").then((r) => r.json()), fetch("/api/auth/me").then((r) => r.json())]);
      if (s.success) {
        setData(s);
        setUpdatedAt(new Date().toLocaleString(undefined, { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" }));
      }
      if (u.authenticated) setUser(u.user);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const stats = data?.stats || {};
  const activity: DayPoint[] = data?.activity || [];
  const sum = (a: DayPoint[], k: keyof Omit<DayPoint, "day">) => a.reduce((t, d) => t + d[k], 0);
  const last7 = activity.slice(-7);
  const prev7 = activity.slice(0, Math.max(0, activity.length - 7));
  const delta = (k: keyof Omit<DayPoint, "day">) => sum(last7, k) - sum(prev7, k);

  const timeline = [
    ...(data?.recentRfqs || []).map((r: any) => ({ key: "r" + r.id, type: "Quotation", title: r.product_name, sub: `${r.company_name || r.full_name}${r.quantity ? " · " + r.quantity : ""}`, status: r.status, at: r.created_at, href: "/admin/quote-requests" })),
    ...(data?.recentEnquiries || []).map((e: any) => ({ key: "e" + e.id, type: "Enquiry", title: e.subject, sub: `${e.full_name}${e.company_name ? " (" + e.company_name + ")" : ""}`, status: e.status, at: e.created_at, href: "/admin/enquiries" })),
    ...(data?.recentApplications || []).map((a: any) => ({ key: "a" + a.id, type: "Application", title: a.full_name, sub: a.job_title || "General application", status: String(a.status || "new").toLowerCase().replace(" ", "_"), at: a.created_at, href: `/admin/careers/applications/${a.id}` })),
  ].sort((x: any, y: any) => +new Date(y.at) - +new Date(x.at));

  return {
    data, stats, user, loading, refreshing, updatedAt, load, activity, timeline, delta, sum, last7,
    ins: data?.insights || {},
    topCategories: data?.topCategories || [],
    rfqStatus: data?.rfqStatus || [],
    enquiryStatus: data?.enquiryStatus || [],
    recentRfqs: data?.recentRfqs || [],
    recentEnquiries: data?.recentEnquiries || [],
    recentApplications: data?.recentApplications || [],
    name: (user?.name || "").split(" ")[0] || "Administrator",
  };
}

export function greeting() {
  const h = new Date().getHours();
  return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
}

export function ago(iso?: string | null) {
  if (!iso) return "";
  const m = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 60000));
  if (m < 1) return "just now";
  if (m < 60) return `${m} min ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h} hr ago`;
  const d = Math.round(h / 24);
  return d === 1 ? "yesterday" : `${d} days ago`;
}

/** Tiny line chart with soft gradient fill. */
export function Sparkline({ values, color = "#C80808", height = 44, fill = true }: { values: number[]; color?: string; height?: number; fill?: boolean }) {
  const id = React.useId().replace(/:/g, "");
  const w = 200;
  const max = Math.max(1, ...values);
  const step = values.length > 1 ? w / (values.length - 1) : w;
  const pts = values.map((v, i) => [i * step, height - 4 - (v / max) * (height - 10)] as const);
  const line = pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${height}`} preserveAspectRatio="none" className="h-full w-full" style={{ height }}>
      <defs><linearGradient id={id} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={color} stopOpacity=".35" /><stop offset="1" stopColor={color} stopOpacity="0" /></linearGradient></defs>
      {fill && <path d={`${line} L${w} ${height} L0 ${height} Z`} fill={`url(#${id})`} />}
      <path d={line} fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

/** Multi-series smooth line chart with grid. */
export function LineChart({ data, series, height = 230, dark = false }: { data: DayPoint[]; series: { k: keyof Omit<DayPoint, "day">; color: string; label: string }[]; height?: number; dark?: boolean }) {
  const id = React.useId().replace(/:/g, "");
  const W = 700, H = height, padL = 28, padB = 24, padT = 8;
  const max = Math.max(3, ...data.flatMap((d) => series.map((s) => d[s.k])));
  const x = (i: number) => padL + (i * (W - padL - 8)) / Math.max(1, data.length - 1);
  const y = (v: number) => padT + (1 - v / max) * (H - padT - padB);
  const path = (k: keyof Omit<DayPoint, "day">) => {
    const p = data.map((d, i) => [x(i), y(d[k])] as const);
    return p.map(([px, py], i) => {
      if (i === 0) return `M${px} ${py}`;
      const [qx, qy] = p[i - 1];
      const cx = (px + qx) / 2;
      return `C${cx} ${qy} ${cx} ${py} ${px} ${py}`;
    }).join(" ");
  };
  const grid = dark ? "rgba(255,255,255,.07)" : "#EEF0F3";
  const txt = dark ? "rgba(255,255,255,.45)" : "#929DA7";
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height }}>
      <defs>{series.map((s) => <linearGradient key={s.k} id={`${id}${s.k}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={s.color} stopOpacity={dark ? ".32" : ".18"} /><stop offset="1" stopColor={s.color} stopOpacity="0" /></linearGradient>)}</defs>
      {[0, 1, 2, 3].map((i) => { const v = (max / 3) * i; return <g key={i}><line x1={padL} x2={W - 4} y1={y(v)} y2={y(v)} stroke={grid} /><text x={padL - 6} y={y(v) + 3} textAnchor="end" fontSize="9" fill={txt}>{Math.round(v)}</text></g>; })}
      {series.map((s) => (
        <g key={s.k}>
          <path d={`${path(s.k)} L${x(data.length - 1)} ${y(0)} L${x(0)} ${y(0)} Z`} fill={`url(#${id}${s.k})`} />
          <path d={path(s.k)} fill="none" stroke={s.color} strokeWidth="2.4" strokeLinecap="round" />
          {data.map((d, i) => d[s.k] > 0 && <circle key={i} cx={x(i)} cy={y(d[s.k])} r="2.6" fill={dark ? "#0F1114" : "#fff"} stroke={s.color} strokeWidth="1.6" />)}
        </g>
      ))}
      {data.map((d, i) => (i % 2 === 0 || data.length < 8) && <text key={d.day} x={x(i)} y={H - 6} textAnchor="middle" fontSize="9" fill={txt}>{new Date(d.day + "T00:00:00").toLocaleDateString(undefined, { day: "numeric", month: "short" })}</text>)}
    </svg>
  );
}

export function Donut({ parts, size = 120, stroke = 14, center, dark = false }: { parts: { v: number; c: string }[]; size?: number; stroke?: number; center?: React.ReactNode; dark?: boolean }) {
  const total = parts.reduce((a, p) => a + p.v, 0) || 1;
  const r = (size - stroke) / 2, C = 2 * Math.PI * r;
  let off = 0;
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={dark ? "rgba(255,255,255,.08)" : "#EEF0F3"} strokeWidth={stroke} />
        {parts.map((p, i) => { const len = (p.v / total) * C; const el = <circle key={i} cx={size / 2} cy={size / 2} r={r} fill="none" stroke={p.c} strokeWidth={stroke} strokeDasharray={`${Math.max(0, len - 3)} ${C}`} strokeDashoffset={-off} strokeLinecap="round" />; off += len; return el; })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">{center}</div>
    </div>
  );
}
