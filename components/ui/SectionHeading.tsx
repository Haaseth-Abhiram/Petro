import React from "react";

interface SectionHeadingProps {
  badge?: string;
  title: string;
  description?: string;
  centered?: boolean;
  dark?: boolean;
  className?: string;
}

export default function SectionHeading({
  badge,
  title,
  description,
  centered = false,
  dark = false,
  className = "",
}: SectionHeadingProps) {
  return (
    <div
      className={`mb-10 sm:mb-14 ${centered ? "text-center mx-auto max-w-3xl" : "max-w-3xl"} ${className}`}
    >
      {badge && (
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3 ${
            dark
              ? "bg-navy-800 text-brand-300 border border-navy-700"
              : "bg-brand-50 text-brand-700 border border-brand-100"
          }`}
        >
          {badge}
        </span>
      )}
      <h2
        className={`text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight ${
          dark ? "text-white" : "text-navy-950"
        }`}
      >
        {title}
      </h2>
      {description && (
        <p
          className={`mt-4 text-base sm:text-lg leading-relaxed ${
            dark ? "text-slate-300" : "text-slate-600"
          }`}
        >
          {description}
        </p>
      )}
    </div>
  );
}
