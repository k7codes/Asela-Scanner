import React from "react";
import { BarChart3, Globe, PieChart, Layers } from "lucide-react";
import { DomainStat, PageScanDetail } from "../types";

interface DomainAnalyticsProps {
  stats: DomainStat[];
  pageDetails?: PageScanDetail[];
  totalResults: number;
}

export const DomainAnalytics: React.FC<DomainAnalyticsProps> = ({ stats, pageDetails, totalResults }) => {
  if (!stats || stats.length === 0) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
      {/* Domain Distribution Card */}
      <div className="lg:col-span-2 bg-zinc-900/90 rounded-2xl p-5 border border-zinc-800 shadow-xl text-zinc-100">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-indigo-400" />
            <h4 className="font-bold text-xs uppercase tracking-wider text-zinc-300 font-mono">
              En Çok Listelenen Alan Adları (Domainler)
            </h4>
          </div>
          <span className="text-[11px] font-mono text-zinc-400">
            {stats.length} Farklı Kaynak
          </span>
        </div>

        <div className="space-y-2.5 max-h-52 overflow-y-auto pr-1">
          {stats.slice(0, 6).map((item) => (
            <div key={item.domain} className="space-y-1">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-zinc-200 truncate font-semibold">{item.domain}</span>
                <span className="text-indigo-400 font-bold shrink-0 ml-2">
                  {item.count} Bağlantı ({item.percentage}%)
                </span>
              </div>
              <div className="w-full bg-zinc-950 rounded-full h-1.5 overflow-hidden border border-zinc-800">
                <div
                  className="bg-gradient-to-r from-indigo-500 to-violet-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.max(5, item.percentage)}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Page Scan Breakdown Card */}
      <div className="bg-zinc-900/90 rounded-2xl p-5 border border-zinc-800 shadow-xl text-zinc-100 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 pb-3 mb-3 border-b border-zinc-800">
            <Layers className="w-4 h-4 text-indigo-400" />
            <h4 className="font-bold text-xs uppercase tracking-wider text-zinc-300 font-mono">
              Sayfa Bazlı Dağılım
            </h4>
          </div>

          <div className="space-y-2 max-h-52 overflow-y-auto">
            {pageDetails && pageDetails.length > 0 ? (
              pageDetails.map((pd) => (
                <div
                  key={pd.pageNumber}
                  className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between text-xs font-mono"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-zinc-800 flex items-center justify-center font-bold text-indigo-300">
                      {pd.pageNumber}
                    </span>
                    <span className="text-zinc-300 font-medium">Sayfa #{pd.pageNumber}</span>
                  </div>
                  <span className="text-emerald-400 font-bold">
                    +{pd.urlsFound} Link
                  </span>
                </div>
              ))
            ) : (
              <div className="p-3 text-center text-zinc-500 text-xs">
                Sayfa detayları mevcut değil.
              </div>
            )}
          </div>
        </div>

        <div className="pt-3 mt-3 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-400 font-mono">
          <span>Toplam Ayıklanan:</span>
          <span className="font-bold text-white text-sm">{totalResults} URL</span>
        </div>
      </div>
    </div>
  );
};
