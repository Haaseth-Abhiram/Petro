import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, MessageSquareQuote } from "lucide-react";
import { CategoryItem } from "@/data/categories";

interface CategoryCardProps {
  category: CategoryItem;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  const detailLink =
    category.division === "chemicals"
      ? `/chemicals/${category.slug}`
      : `/instrumentation#${category.slug}`;

  return (
    <div className="group bg-white rounded-xl border border-slate-200 overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col h-full">
      {/* Category Image Header */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-100">
        <Image
          src={category.image}
          alt={category.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950/70 via-transparent to-transparent" />
        <span className="absolute bottom-3 left-3 text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-navy-900/90 text-white backdrop-blur-sm">
          {category.division === "chemicals" ? "Water & Chemicals" : "Instrumentation"}
        </span>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-bold text-navy-950 group-hover:text-brand-700 transition-colors line-clamp-1">
            {category.name}
          </h3>
          <p className="mt-2 text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed">
            {category.shortDescription}
          </p>

          {/* Sample Product Highlights */}
          {category.keyProducts && (
            <div className="mt-3 pt-3 border-t border-slate-100">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                Key Offerings
              </span>
              <ul className="text-xs text-slate-600 space-y-1">
                {category.keyProducts.slice(0, 2).map((prod, idx) => (
                  <li key={idx} className="truncate flex items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-500 mr-2 shrink-0" />
                    <span>{prod}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Card Footer Actions */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
          <Link
            href={detailLink}
            className="text-xs font-bold text-navy-900 hover:text-brand-700 flex items-center group-hover:translate-x-0.5 transition-transform"
          >
            <span>View Details</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Link>
          <Link
            href={`/request-a-quote?category=${encodeURIComponent(category.name)}`}
            className="text-xs font-semibold px-3 py-1.5 rounded-md bg-slate-100 hover:bg-brand-50 hover:text-brand-700 text-slate-700 transition-colors inline-flex items-center"
          >
            <MessageSquareQuote className="w-3.5 h-3.5 mr-1" />
            <span>Enquire</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
