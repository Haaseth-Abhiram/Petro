"use client";

import React, { useEffect } from "react";
import { X, Trash2, AlertTriangle } from "lucide-react";

const SIZES = { md: "max-w-xl", lg: "max-w-2xl", xl: "max-w-4xl" } as const;

/**
 * Standard admin popup: dark red header with a gold line, roomy scrolling body,
 * and consistent field styling for any form placed inside it.
 */
export function ModalFrame({
  onClose,
  eyebrow,
  title,
  subtitle,
  size = "lg",
  children,
}: {
  onClose: () => void;
  eyebrow?: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  size?: keyof typeof SIZES;
  children: React.ReactNode;
}) {
  useEffect(() => {
    const k = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [onClose]);

  // Normalises any plain form placed inside: big readable labels, rounded roomy inputs, red focus ring.
  const body =
    "[&_label]:!normal-case [&_label]:!tracking-normal [&_label]:!text-[12px] [&_label]:!font-bold [&_label]:!text-[#17191C] [&_label]:!mb-1.5 " +
    "[&_input:not([type=checkbox]):not([type=radio]):not([type=file])]:!rounded-xl [&_input:not([type=checkbox]):not([type=radio]):not([type=file])]:!border-[#D8DDE2] [&_input:not([type=checkbox]):not([type=radio]):not([type=file])]:!px-3.5 [&_input:not([type=checkbox]):not([type=radio]):not([type=file])]:!py-2.5 [&_input:not([type=checkbox]):not([type=radio]):not([type=file])]:!text-[13.5px] " +
    "[&_textarea]:!rounded-xl [&_textarea]:!border-[#D8DDE2] [&_textarea]:!px-3.5 [&_textarea]:!py-2.5 [&_textarea]:!text-[13.5px] " +
    "[&_select]:!rounded-xl [&_select]:!border-[#D8DDE2] [&_select]:!px-3.5 [&_select]:!py-2.5 [&_select]:!text-[13.5px] " +
    "[&_input:focus]:!border-[#C80808] [&_input:focus]:!ring-4 [&_input:focus]:!ring-[#C80808]/10 [&_textarea:focus]:!border-[#C80808] [&_textarea:focus]:!ring-4 [&_textarea:focus]:!ring-[#C80808]/10 [&_select:focus]:!border-[#C80808] [&_select:focus]:!ring-4 [&_select:focus]:!ring-[#C80808]/10 " +
    "[&_form]:!space-y-5 [&_button[type=submit]]:!rounded-xl [&_button[type=submit]]:!px-6 [&_button[type=submit]]:!py-2.5 [&_button[type=submit]]:!text-[13.5px] [&_button[type=button]]:!rounded-xl [&_button[type=button]]:!px-5 [&_button[type=button]]:!py-2.5 [&_button[type=button]]:!text-[13.5px]";

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-[#14161A]/70 p-3 backdrop-blur-sm sm:items-center sm:p-5" onClick={onClose}>
      <div role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()} className={`relative my-4 flex max-h-[94vh] w-full ${SIZES[size]} flex-col overflow-hidden rounded-[26px] bg-white shadow-[0_40px_120px_rgba(0,0,0,0.5)] animate-[routepop2_.35s_cubic-bezier(.2,.9,.25,1.1)_both]`}>
        <div className="relative shrink-0 overflow-hidden bg-gradient-to-r from-[#17191C] via-[#22171A] to-[#2D161A] px-6 py-4 text-white sm:px-7">
          <div className="pointer-events-none absolute -right-8 -top-10 h-32 w-48 rounded-full bg-[#E0A21A]/15 blur-3xl" />
          <span className="absolute inset-x-0 bottom-0 h-[3px] bg-gradient-to-r from-[#C80808] via-[#E0A21A] to-[#F2B93B]" />
          <button type="button" onClick={onClose} className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/25" aria-label="Close"><X className="h-4 w-4" /></button>
          {eyebrow && <p className="text-[10.5px] font-extrabold uppercase tracking-[0.2em] text-[#F2B93B]">{eyebrow}</p>}
          <h3 className="pr-10 text-[1.15rem] font-black leading-tight !text-white">{title}</h3>
          {subtitle && <p className="mt-0.5 text-[12px] text-white/60">{subtitle}</p>}
        </div>
        <div className={`min-h-0 flex-1 overflow-y-auto p-6 sm:p-7 ${body}`}>{children}</div>
      </div>
    </div>
  );
}

/** Confirmation popup (delete etc.) in the same style as the other admin popups. */
export function ConfirmDialog({
  title,
  message,
  confirmLabel = "Yes, delete",
  busy = false,
  danger = true,
  onConfirm,
  onClose,
}: {
  title: string;
  message: React.ReactNode;
  confirmLabel?: string;
  busy?: boolean;
  danger?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}) {
  useEffect(() => {
    const k = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-[#14161A]/70 p-4 backdrop-blur-sm" onClick={onClose}>
      <div role="alertdialog" aria-modal="true" onClick={(e) => e.stopPropagation()} className="w-full max-w-lg overflow-hidden rounded-[26px] bg-white shadow-[0_40px_120px_rgba(0,0,0,0.5)] animate-[routepop2_.3s_cubic-bezier(.2,.9,.25,1.1)_both]">
        <div className="relative overflow-hidden bg-gradient-to-r from-[#17191C] via-[#22171A] to-[#2D161A] px-7 py-5 text-white">
          <div className="pointer-events-none absolute -right-8 -top-10 h-32 w-48 rounded-full bg-[#E0A21A]/15 blur-3xl" />
          <span className="absolute inset-x-0 bottom-0 h-[3px] bg-gradient-to-r from-[#C80808] via-[#E0A21A] to-[#F2B93B]" />
          <button type="button" onClick={onClose} className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/25" aria-label="Close"><X className="h-4 w-4" /></button>
          <div className="flex items-center gap-4 pr-10">
            <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ring-1 ring-white/25 ${danger ? "bg-[#C80808]" : "bg-white/15"}`}>{danger ? <Trash2 className="h-5 w-5" /> : <AlertTriangle className="h-5 w-5" />}</span>
            <div><p className="text-[10.5px] font-extrabold uppercase tracking-[0.2em] text-[#F2B93B]">{danger ? "Please confirm" : "Confirm"}</p><h3 className="text-[1.15rem] font-black leading-tight !text-white">{title}</h3></div>
          </div>
        </div>
        <div className="px-7 py-6 text-[14px] leading-relaxed text-[#52525B]">{message}</div>
        <div className="flex items-center justify-end gap-3 border-t border-[#EEF0F3] bg-[#FAFAFB] px-7 py-4">
          <button type="button" onClick={onClose} className="rounded-xl border-2 border-[#E7E9EE] bg-white px-5 py-2.5 text-[13.5px] font-bold text-[#17191C] transition-colors hover:border-[#17191C]">Cancel</button>
          <button type="button" onClick={onConfirm} disabled={busy} className={`rounded-xl px-6 py-2.5 text-[13.5px] font-extrabold text-white transition-colors disabled:opacity-60 ${danger ? "bg-[#C80808] hover:bg-[#A81010]" : "bg-[#17191C] hover:bg-[#C80808]"}`}>{busy ? "Please wait…" : confirmLabel}</button>
        </div>
      </div>
    </div>
  );
}
