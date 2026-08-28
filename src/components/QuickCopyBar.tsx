import React, { useState } from "react";
import { Copy, Check, Download, Layers, ShieldCheck, FileText } from "lucide-react";
import { SearchResponse } from "../types";
import { motion } from "motion/react";

interface QuickCopyBarProps {
  data: SearchResponse;
}

export const QuickCopyBar: React.FC<QuickCopyBarProps> = ({ data }) => {
  const [copyFormat, setCopyFormat] = useState<"plain" | "numbered" | "markdown" | "json" | "domains">("plain");
  const [copied, setCopied] = useState(false);
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);

  const getFormattedText = (format: "plain" | "numbered" | "markdown" | "json" | "domains") => {
    const results = data.results;
    if (!results || results.length === 0) return "";

    switch (format) {
      case "plain":
        return results.map((r) => r.url).join("\n");
      case "numbered":
        return results.map((r, i) => `${i + 1}. ${r.url}`).join("\n");
      case "markdown":
        return results.map((r) => `- [${r.title}](${r.url})`).join("\n");
      case "json":
        return JSON.stringify(
          results.map((r) => ({
            rank: r.rank,
            page: r.page,
            title: r.title,
            url: r.url,
            domain: r.domain,
          })),
          null,
          2
        );
      case "domains":
        return Array.from(new Set(results.map((r) => r.domain))).join("\n");
      default:
        return results.map((r) => r.url).join("\n");
    }
  };

  const handleCopy = (format = copyFormat) => {
    const text = getFormattedText(format);
    if (!text) return;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
    }

    setCopied(true);
    setCopiedFormat(format);
    setTimeout(() => {
      setCopied(false);
      setCopiedFormat(null);
    }, 2000);
  };

  const handleDownloadFile = (type: "txt" | "csv" | "json") => {
    let content = "";
    let mimeType = "text/plain";
    let extension = type;

    if (type === "txt") {
      content = [
        `======================================================`,
        `  ASELA SCANNER - SERP URL RAPORU`,
        `  Anahtar Kelime : "${data.keyword}"`,
        `  Taranan Sayfa  : ${data.scannedPages} / ${data.requestedPages}`,
        `  Toplam URL     : ${data.totalCount}`,
        `  Tarih          : ${new Date().toLocaleString("tr-TR")}`,
        `======================================================\n`,
        `[TUM BAGLANTILAR]`,
        ...data.results.map((r) => `[#${r.rank}] (Sayfa ${r.page}) ${r.title}\nURL: ${r.url}\n`),
        `\n[DUZ URL LISTESI]`,
        ...data.results.map((r) => r.url),
      ].join("\n");
    } else if (type === "csv") {
      mimeType = "text/csv;charset=utf-8";
      const headers = ["Sira", "Sayfa", "Baslik", "URL", "AlanAdi", "Aciklama"];
      const rows = data.results.map((r) => [
        r.rank,
        r.page,
        `"${(r.title || "").replace(/"/g, '""')}"`,
        `"${(r.url || "").replace(/"/g, '""')}"`,
        `"${(r.domain || "").replace(/"/g, '""')}"`,
        `"${(r.snippet || "").replace(/"/g, '""')}"`,
      ]);
      content = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
    } else if (type === "json") {
      mimeType = "application/json";
      content = JSON.stringify(data, null, 2);
    }

    const blob = new Blob([content], { type: `${mimeType};charset=utf-8` });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `asela-scanner-${data.keyword.replace(/\s+/g, "_")}.${extension}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.25 }}
      className="bg-gradient-to-r from-zinc-950 via-indigo-950/40 to-zinc-950 rounded-2xl p-5 border border-indigo-500/30 shadow-2xl mb-6 text-white relative overflow-hidden"
    >
      {/* Top Banner Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-zinc-800/80">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-mono font-bold text-xl shadow-lg shadow-indigo-950/60 border border-indigo-400/30">
            {data.totalCount}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white tracking-wide">
                Toplam {data.totalCount} Adet URL Toplandı
              </h3>
              <span className="px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 font-mono text-xs font-bold border border-indigo-500/30">
                {data.scannedPages} Sayfa Tarandı
              </span>
            </div>
            <p className="text-xs text-zinc-400">
              "{data.keyword}" sorgusu için tüm sonuçlar tek tıkla kopyalanmaya hazır.
            </p>
          </div>
        </div>

        {/* Master One-Click Copy Button */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            id="master-copy-all-btn"
            onClick={() => handleCopy("plain")}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm tracking-wide shadow-lg shadow-indigo-950/50 transition cursor-pointer active:scale-95 border border-indigo-400/30"
          >
            {copied && copiedFormat === "plain" ? (
              <>
                <Check className="w-4 h-4 text-emerald-400 stroke-[3]" />
                <span className="text-emerald-300">Tüm Linkler Kopyalandı! ({data.totalCount})</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Tüm Linkleri Kopyala ({data.totalCount})</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Format Selectors & Secondary Quick Actions */}
      <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-zinc-400 font-mono text-[11px] mr-1">Format ile Kopyala:</span>
          
          <button
            onClick={() => handleCopy("plain")}
            className="px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 hover:text-white font-mono transition cursor-pointer"
            title="Düz URL listesi"
          >
            {copied && copiedFormat === "plain" ? "[✓] Düz URL" : "Düz URL"}
          </button>

          <button
            onClick={() => handleCopy("numbered")}
            className="px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 hover:text-white font-mono transition cursor-pointer"
            title="1. https://... şeklinde numaralı liste"
          >
            {copied && copiedFormat === "numbered" ? "[✓] Numaralı" : "# Numaralı"}
          </button>

          <button
            onClick={() => handleCopy("markdown")}
            className="px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 hover:text-white font-mono transition cursor-pointer"
            title="Markdown link formatı: [Title](URL)"
          >
            {copied && copiedFormat === "markdown" ? "[✓] Markdown" : "Markdown"}
          </button>

          <button
            onClick={() => handleCopy("json")}
            className="px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 hover:text-white font-mono transition cursor-pointer"
            title="JSON dizi formatı"
          >
            {copied && copiedFormat === "json" ? "[✓] JSON" : "{ } JSON"}
          </button>

          <button
            onClick={() => handleCopy("domains")}
            className="px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 hover:text-white font-mono transition cursor-pointer"
            title="Sadece benzersiz alan adları"
          >
            {copied && copiedFormat === "domains" ? "[✓] Domainler" : "Domainler"}
          </button>
        </div>

        {/* Download Buttons */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto">
          <span className="text-zinc-400 font-mono text-[11px] mr-1">Dışa Aktar:</span>
          
          <button
            id="download-txt-quick-btn"
            onClick={() => handleDownloadFile("txt")}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-[11px] font-mono transition cursor-pointer border border-zinc-700"
          >
            <Download className="w-3 h-3" />
            <span>TXT</span>
          </button>

          <button
            id="download-csv-quick-btn"
            onClick={() => handleDownloadFile("csv")}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-[11px] font-mono transition cursor-pointer border border-zinc-700"
          >
            <Download className="w-3 h-3" />
            <span>CSV</span>
          </button>

          <button
            id="download-json-quick-btn"
            onClick={() => handleDownloadFile("json")}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-[11px] font-mono transition cursor-pointer border border-zinc-700"
          >
            <Download className="w-3 h-3" />
            <span>JSON</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};
