import React from "react";
import { History, Trash2, ArrowRight, Layers, Clock } from "lucide-react";
import { SearchHistoryItem } from "../types";

interface SearchHistoryProps {
  history: SearchHistoryItem[];
  onSelect: (item: SearchHistoryItem) => void;
  onClear: () => void;
}

export const SearchHistory: React.FC<SearchHistoryProps> = ({ history, onSelect, onClear }) => {
  if (!history || history.length === 0) return null;

  return (
    <div className="bg-zinc-900/90 rounded-2xl p-4 sm:p-5 border border-zinc-800 shadow-xl mb-6 text-zinc-100">
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-indigo-400" />
          <h4 className="font-bold text-xs uppercase tracking-wider text-zinc-300 font-mono">
            Son Yapılan Taramalar (Geçmiş)
          </h4>
        </div>

        <button
          onClick={onClear}
          className="flex items-center gap-1 text-[11px] text-zinc-500 hover:text-red-400 transition cursor-pointer font-mono"
          title="Tüm geçmişi temizle"
        >
          <Trash2 className="w-3 h-3" />
          <span>Temizle</span>
        </button>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {history.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelect(item)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-xs font-mono text-zinc-300 transition cursor-pointer shrink-0 group"
          >
            <span className="text-white font-bold group-hover:text-indigo-300 transition">
              "{item.keyword}"
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 group-hover:bg-indigo-950 group-hover:text-indigo-300 transition">
              {item.totalCount} URL ({item.scannedPages}S)
            </span>
            <ArrowRight className="w-3 h-3 text-zinc-500 group-hover:text-indigo-400 transition" />
          </button>
        ))}
      </div>
    </div>
  );
};
