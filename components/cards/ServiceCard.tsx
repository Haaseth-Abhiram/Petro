import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Flame,
  Briefcase,
  ShieldCheck,
  Users,
  Ship,
  Wrench,
  Check,
} from "lucide-react";
import { ServiceItem } from "@/data/services";

interface ServiceCardProps {
  service: ServiceItem;
}

const iconMap: Record<string, React.ElementType> = {
  Flame,
  Briefcase,
  ShieldCheck,
  Users,
  Ship,
  Wrench,
};

export default function ServiceCard({ service }: ServiceCardProps) {
  const IconComponent = iconMap[service.iconName] || Wrench;

  return (
    <div
      id={service.slug}
      className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col h-full group"
    >
      <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
        <Image
          src={service.image}
          alt={service.title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-navy-950/20 to-transparent" />
        <div className="absolute top-4 left-4 w-10 h-10 rounded-lg bg-brand-600/90 text-white flex items-center justify-center backdrop-blur-sm shadow-md">
          <IconComponent className="w-5 h-5" />
        </div>
        <h3 className="absolute bottom-3 left-4 right-4 text-base sm:text-lg font-bold text-white leading-tight">
          {service.title}
        </h3>
      </div>

      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {service.overview}
          </p>

          <div className="mt-4 pt-4 border-t border-slate-100">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Key Activities
            </span>
            <ul className="space-y-1.5 text-xs text-slate-700">
              {service.keyActivities.slice(0, 3).map((act, i) => (
                <li key={i} className="flex items-start">
                  <Check className="w-3.5 h-3.5 text-emerald-600 mr-2 shrink-0 mt-0.5" />
                  <span>{act}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
          <Link
            href={`/request-a-quote?service=${encodeURIComponent(service.title)}`}
            className="text-xs font-bold text-brand-700 hover:text-brand-800 flex items-center"
          >
            <span>Consult Engineering Team</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Link>
        </div>
      </div>
    </div>
  );
}
