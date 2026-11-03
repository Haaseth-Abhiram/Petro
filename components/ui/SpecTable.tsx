import React from "react";

interface SpecTableProps {
  specifications: Record<string, string>;
  caption?: string;
}

export default function SpecTable({ specifications, caption }: SpecTableProps) {
  const entries = Object.entries(specifications);

  return (
    <div className="w-full overflow-hidden border border-slate-200 rounded-lg shadow-sm bg-white">
      {caption && (
        <div className="bg-slate-50 px-4 py-3 border-b border-slate-200">
          <h4 className="text-sm font-bold text-navy-950 uppercase tracking-wider">
            {caption}
          </h4>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <tbody className="divide-y divide-slate-100">
            {entries.map(([key, value], idx) => (
              <tr
                key={key}
                className={idx % 2 === 0 ? "bg-white" : "bg-slate-50/60"}
              >
                <td className="px-4 py-3 font-semibold text-slate-700 w-1/3 text-xs sm:text-sm bg-slate-50/40">
                  {key}
                </td>
                <td className="px-4 py-3 text-slate-900 font-medium text-xs sm:text-sm">
                  {value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
