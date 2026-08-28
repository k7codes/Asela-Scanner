import React, { useState } from "react";
import { ExternalLink, Copy, Check, Filter, Layers, Globe, Search, ArrowUpRight } from "lucide-react";
import { SearchResultItem } from "../types";
import { motion } from "motion/react";

interface ResultsTableProps {
  results: SearchResultItem[];
  scannedPages: number;
}

export const ResultsTable: React.FC<ResultsTableProps> = ({ results, scannedPages }) => {
  const [filterText, setFilterText] = useState("");
  const [selectedPage, setSelectedPage] = useState<number | "all">("all");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Filtered results
  const filtered = results.filter((item) => {
    const matchesText =
      item.title.toLowerCase().includes(filterText.toLowerCase()) ||
      item.url.toLowerCase().includes(filterText.toLowerCase()) ||
      item.domain.toLowerCase().includes(filterText.toLowerCase());

    const matchesPage = selectedPage === "all" || item.page === selectedPage;

    return matchesText && matchesPage;
  });

  const handleCopySingle = (url: string, index: number) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
    }
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  const pagesArray = Array.from({ length: scannedPages }, (_, i) => i + 1);

  return (
    <div className="bg-zinc-900/90 rounded-2xl border border-zinc-800 shadow-2xl overflow-hidden mb-6 text-zinc-100">
      {/* Table Top Controls & Search Bar */}
      <div className="p-4 sm:p-5 border-b border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-zinc-950/60">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Globe className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <span>Organik Arama Sonuçları</span>
              <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700">
                {filtered.length} / {results.length} Bağlantı
              </span>
            </h3>
            <p className="text-[11px] text-zinc-400">
              Google arama dizininde listelenen gerçek hedef web siteleri
            </p>
          </div>
        </div>

        {/* Filter Input & Page Tabs */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Quick Search inside results */}
          <div className="relative flex-1 sm:w-56">
            <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              placeholder="Sonuçlarda filtrele..."
              className="w-full pl-8 pr-3 py-1.5 bg-zinc-900 border border-zinc-700 rounded-lg text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-indigo-500 font-mono"
            />
          </div>

          {/* Page Filter Tabs */}
          {scannedPages > 1 && (
            <div className="flex items-center bg-zinc-950 p-1 rounded-lg border border-zinc-800 gap-1 text-[11px] font-mono">
              <button
                onClick={() => setSelectedPage("all")}
                className={`px-2.5 py-1 rounded transition cursor-pointer font-bold ${
                  selectedPage === "all"
                    ? "bg-indigo-600 text-white"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                Tümü
              </button>
              {pagesArray.map((p) => (
                <button
                  key={p}
                  onClick={() => setSelectedPage(p)}
                  className={`px-2.5 py-1 rounded transition cursor-pointer font-bold ${
                    selectedPage === p
                      ? "bg-indigo-600 text-white"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  S{p}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Results List */}
      <div className="divide-y divide-zinc-800/60 max-h-[600px] overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-zinc-500 text-xs">
            Arama kriterine uygun sonuç bulunamadı.
          </div>
        ) : (
          filtered.map((item, index) => (
            <motion.div
              key={item.url + index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.15, delay: index * 0.02 }}
              className="p-4 hover:bg-zinc-800/40 transition group flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="flex items-start gap-3 min-w-0 flex-1">
                {/* Rank Badge */}
                <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 text-indigo-300 font-mono font-bold text-xs flex items-center justify-center shrink-0 group-hover:border-indigo-500/50 group-hover:bg-indigo-950/40 transition">
                  #{item.rank}
                </div>

                <div className="min-w-0 flex-1">
                  {/* Title & Domain Info */}
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-xs font-bold text-zinc-100 group-hover:text-indigo-300 transition line-clamp-1">
                      {item.title}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800/80 text-zinc-400 border border-zinc-700/60">
                      {item.domain}
                    </span>
                    {item.page && (
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-indigo-950/60 text-indigo-400 border border-indigo-800/40">
                        Sayfa {item.page}
                      </span>
                    )}
                  </div>

                  {/* URL Text */}
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-zinc-400 hover:text-indigo-400 font-mono break-all line-clamp-1 transition flex items-center gap-1"
                  >
                    <span>{item.url}</span>
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition shrink-0" />
                  </a>

                  {/* Snippet preview if available */}
                  {item.snippet && (
                    <p className="text-[11px] text-zinc-500 mt-1 line-clamp-2 leading-relaxed">
                      {item.snippet}
                    </p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                <button
                  onClick={() => handleCopySingle(item.url, index)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-mono transition cursor-pointer border border-zinc-700 active:scale-95"
                  title="URL Kopyala"
                >
                  {copiedIndex === index ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400 font-bold">Kopyalandı</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-zinc-400" />
                      <span>Kopyala</span>
                    </>
                  )}
                </button>

                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition cursor-pointer border border-zinc-700"
                  title="Yeni Sekmede Aç"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};
