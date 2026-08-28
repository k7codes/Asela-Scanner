import React, { useState } from "react";
import { Search, Loader2, SlidersHorizontal, Layers, ArrowRight, ShieldCheck } from "lucide-react";
import { motion } from "motion/react";

interface SearchFormProps {
  onSearch: (keyword: string, pages: number, hl: string, gl: string) => void;
  isLoading: boolean;
}

const PAGE_PRESETS = [1, 2, 3, 5, 10];

export const SearchForm: React.FC<SearchFormProps> = ({ onSearch, isLoading }) => {
  const [keyword, setKeyword] = useState("");
  const [pages, setPages] = useState(2);
  const [hl, setHl] = useState("tr");
  const [gl, setGl] = useState("tr");
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyword.trim() || isLoading) return;
    onSearch(keyword.trim(), pages, hl, gl);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-zinc-900/90 rounded-2xl p-5 md:p-6 border border-zinc-800 shadow-xl mb-6 text-zinc-100 relative overflow-hidden"
    >
      {/* Decorative ambient gradient backdrop */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
        {/* Main Search Input Field */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="keyword-input" className="text-xs font-mono uppercase tracking-wider text-indigo-400 font-bold flex items-center gap-1.5">
              <span>Arama Anahtar Kelimesi</span>
            </label>
            <span className="text-[11px] text-zinc-400 font-mono">
              Hedef Tarama: <strong className="text-white font-bold">{pages} Sayfa</strong> (~{pages * 10} Sonuç)
            </span>
          </div>

          <div className="relative flex items-center">
            <div className="absolute left-4 text-zinc-500 pointer-events-none">
              <Search className="w-5 h-5 text-indigo-400" />
            </div>
            <input
              id="keyword-input"
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Aranacak anahtar kelimeyi yazın (örn: node.js web scraping, siber güvenlik)..."
              className="w-full pl-12 pr-36 sm:pr-48 py-4 bg-zinc-950 hover:bg-black focus:bg-black text-white placeholder:text-zinc-500 border border-zinc-700/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition text-sm sm:text-base font-medium"
              disabled={isLoading}
              autoFocus
            />
            <div className="absolute right-2 flex items-center gap-2">
              <button
                id="search-submit-btn"
                type="submit"
                disabled={!keyword.trim() || isLoading}
                className="flex items-center gap-2 px-4 sm:px-5 py-2.5 bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-600 hover:from-indigo-400 hover:to-violet-500 disabled:from-zinc-800 disabled:to-zinc-800 text-white disabled:text-zinc-500 rounded-lg font-bold text-xs sm:text-sm tracking-wide transition shadow-lg shadow-indigo-950/50 cursor-pointer disabled:cursor-not-allowed uppercase"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Taranıyor...</span>
                  </>
                ) : (
                  <>
                    <span>Taramayı Başlat</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Page Selector Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 border-t border-zinc-800/80">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-mono font-bold text-zinc-400 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-indigo-400" /> Taranacak Sayfa Sayısı:
            </span>
            <div className="flex items-center bg-zinc-950 p-1 rounded-xl border border-zinc-800 gap-1">
              {PAGE_PRESETS.map((p) => (
                <button
                  key={p}
                  type="button"
                  id={`page-select-btn-${p}`}
                  onClick={() => setPages(p)}
                  disabled={isLoading}
                  className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition cursor-pointer ${
                    pages === p
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "text-zinc-400 hover:text-white hover:bg-zinc-800"
                  }`}
                >
                  {p} Sayfa
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-indigo-400 transition cursor-pointer self-start sm:self-auto font-medium"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Gelişmiş Arama Filtreleri</span>
          </button>
        </div>

        {/* Advanced Regional / Language Filter Dropdowns */}
        {showAdvanced && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-zinc-950 rounded-xl border border-zinc-800 text-xs"
          >
            <div>
              <label className="block font-mono text-zinc-400 mb-1">Arama Dili (hl)</label>
              <select
                value={hl}
                onChange={(e) => setHl(e.target.value)}
                className="w-full p-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white font-mono focus:ring-1 focus:ring-indigo-500"
              >
                <option value="tr">Türkçe (tr)</option>
                <option value="en">İngilizce (en)</option>
                <option value="de">Almanca (de)</option>
                <option value="fr">Fransızca (fr)</option>
                <option value="es">İspanyolca (es)</option>
              </select>
            </div>

            <div>
              <label className="block font-mono text-zinc-400 mb-1">Arama Bölgesi / Ülke (gl)</label>
              <select
                value={gl}
                onChange={(e) => setGl(e.target.value)}
                className="w-full p-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white font-mono focus:ring-1 focus:ring-indigo-500"
              >
                <option value="tr">Türkiye (TR)</option>
                <option value="us">Amerika Birleşik Devletleri (US)</option>
                <option value="gb">Birleşik Krallık (GB)</option>
                <option value="de">Almanya (DE)</option>
                <option value="global">Global (Tüm Dünya)</option>
              </select>
            </div>
          </motion.div>
        )}
      </form>
    </motion.div>
  );
};
