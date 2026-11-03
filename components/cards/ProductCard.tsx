import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CheckCircle2, ShieldAlert } from "lucide-react";
import { ProductItem } from "@/data/products";

interface ProductCardProps {
  product: ProductItem;
}

export default function ProductCard({ product }: ProductCardProps) {
  const detailUrl =
    product.division === "instrumentation"
      ? `/instrumentation/${product.slug}`
      : `/chemicals/${product.categorySlug}#${product.slug}`;

  return (
    <div className="group bg-white rounded-xl border border-slate-200 overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col h-full">
      <div className="relative h-52 w-full bg-slate-100 overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 right-3 flex flex-col gap-1 items-end">
          {product.pressureRating && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-navy-950/90 text-white backdrop-blur-sm">
              {product.pressureRating.split("@")[0]}
            </span>
          )}
          {product.isSampleData && (
            <span className="text-[9px] font-semibold px-2 py-0.5 rounded bg-amber-500/90 text-white backdrop-blur-sm">
              Sample Spec
            </span>
          )}
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-base font-bold text-navy-950 group-hover:text-brand-700 transition-colors line-clamp-2">
            {product.name}
          </h3>
          <p className="mt-2 text-xs text-slate-600 line-clamp-2 leading-relaxed">
            {product.shortDescription}
          </p>

          {/* Key specs highlight */}
          <div className="mt-4 space-y-1.5 text-xs text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
            {product.material && (
              <div className="flex justify-between truncate">
                <span className="font-semibold text-slate-600">Material:</span>
                <span className="truncate ml-2 text-slate-800">{product.material.split("(")[0]}</span>
              </div>
            )}
            {product.size && (
              <div className="flex justify-between truncate">
                <span className="font-semibold text-slate-600">Size:</span>
                <span className="truncate ml-2 text-slate-800">{product.size}</span>
              </div>
            )}
            {product.standards && product.standards.length > 0 && (
              <div className="flex justify-between truncate">
                <span className="font-semibold text-slate-600">Standard:</span>
                <span className="truncate ml-2 text-slate-800">{product.standards[0]}</span>
              </div>
            )}
          </div>
        </div>

        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
          <Link
            href={detailUrl}
            className="text-xs font-bold text-navy-900 hover:text-brand-700 flex items-center"
          >
            <span>Full Specs</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Link>
          <Link
            href={`/request-a-quote?product=${encodeURIComponent(product.name)}`}
            className="text-xs font-bold px-3 py-1.5 rounded-md bg-brand-600 hover:bg-brand-700 text-white shadow-sm transition-colors"
          >
            Request Quote
          </Link>
        </div>
      </div>
    </div>
  );
}
