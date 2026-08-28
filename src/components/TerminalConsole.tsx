import React, { useState } from "react";
import { Terminal, Copy, Check, ChevronDown, ChevronUp, ExternalLink, Activity } from "lucide-react";
import { SearchResponse } from "../types";

interface TerminalConsoleProps {
  data: SearchResponse | null;
  isLoading: boolean;
  activeKeyword: string;
}

export const TerminalConsole: React.FC<TerminalConsoleProps> = ({ data, isLoading, activeKeyword }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [copied, setCopied] = useState(false);

  const formatConsoleOutput = () => {
    if (!data) {
      if (isLoading) {
        return `[ASELA SCANNER] Google SERP motoru başlatılıyor...\n[SCAN] Hedef anahtar kelime: "${activeKeyword}"\n[HTTP] Arama oturumu ve canlı DOM parse işlemi devam ediyor...`;
      }
      return `[ASELA SCANNER] Hazır. Aramak istediğiniz kelimeyi girip 'Taramayı Başlat' butonuna basın.`;
    }

    const lines = [
      `================================================================`,
      `                   ASELA SCANNER - SERP RAPORU                  `,
      `================================================================`,
      `[SORGULAMA]   : "${data.keyword}"`,
      `[TARANAN]     : ${data.scannedPages} / ${data.requestedPages} Sayfa`,
      `[TOPLAM URL]  : ${data.totalCount} Benzersiz Bağlantı`,
      `[SURE]        : ${data.executionTimeMs} ms`,
      `[TARIH]       : ${data.timestamp || new Date().toLocaleString("tr-TR")}`,
      `----------------------------------------------------------------`,
      `TARAMA GUNLUGU:`,
      ...(data.logs || []).map((l) => `  > ${l}`),
      `----------------------------------------------------------------`,
      `BULUNAN URL LISTESI:`,
      ...data.results.map((r) => `[#${r.rank.toString().padStart(2, "0")}] (P${r.page}) ${r.url}`),
      `================================================================`,
    ];

    return lines.join("\n");
  };

  const handleCopyLogs = () => {
    const text = formatConsoleOutput();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-zinc-950 rounded-2xl border border-zinc-800 shadow-2xl mb-6 overflow-hidden text-zinc-300 font-mono text-xs">
      {/* Terminal Window Header Bar */}
      <div className="px-4 py-3 bg-zinc-900/90 border-b border-zinc-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* OS Window Buttons */}
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
          </div>

          <div className="flex items-center gap-2">
            <Terminal className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-zinc-200 font-bold text-[11px] tracking-wide">
              asela-scanner@node-engine:~
            </span>
          </div>

          {isLoading && (
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 text-[10px] font-bold border border-indigo-500/20">
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping"></span>
              <span>CANLI TARAMA AKTIF</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyLogs}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[11px] transition cursor-pointer"
            title="Tüm konsol çıktısını kopyala"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-400" />
                <span className="text-emerald-400 font-bold">Kopyalandı</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3 text-zinc-400" />
                <span>Konsolu Kopyala</span>
              </>
            )}
          </button>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition cursor-pointer"
          >
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Terminal Body */}
      {isExpanded && (
        <div className="p-4 bg-black/90 max-h-64 overflow-y-auto font-mono text-[11px] leading-relaxed text-zinc-400 space-y-1 select-text">
          {isLoading ? (
            <div className="space-y-2 py-2">
              <div className="flex items-center gap-2 text-indigo-400 font-bold">
                <Activity className="w-4 h-4 animate-spin text-indigo-400" />
                <span>[SCANNING] Google SERP sayfaları taranıyor...</span>
              </div>
              <p className="text-zinc-500">Anahtar kelime: "{activeKeyword}"</p>
              <div className="w-full bg-zinc-900 rounded-full h-1.5 overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-500 to-violet-500 h-1.5 rounded-full w-2/3 animate-pulse"></div>
              </div>
            </div>
          ) : (
            <pre className="whitespace-pre-wrap break-all text-zinc-300 font-mono">
              {formatConsoleOutput()}
            </pre>
          )}
        </div>
      )}
    </div>
  );
};
