import React, { useState, useEffect } from "react";
import { SearchHeader } from "./components/SearchHeader";
import { SearchForm } from "./components/SearchForm";
import { QuickCopyBar } from "./components/QuickCopyBar";
import { TerminalConsole } from "./components/TerminalConsole";
import { ResultsTable } from "./components/ResultsTable";
import { DomainAnalytics } from "./components/DomainAnalytics";
import { SearchHistory } from "./components/SearchHistory";
import { SearchResponse, SearchHistoryItem } from "./types";
import { Cpu, ShieldCheck } from "lucide-react";
import { motion } from "motion/react";

export function App() {
  const [data, setData] = useState<SearchResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeKeyword, setActiveKeyword] = useState("");
  const [history, setHistory] = useState<SearchHistoryItem[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Load history on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("asela_scanner_history_v2");
      if (saved) {
        setHistory(JSON.parse(saved));
      }
    } catch {
      // ignore
    }
  }, []);

  const saveHistory = (item: SearchResponse) => {
    try {
      const newEntry: SearchHistoryItem = {
        id: Date.now().toString(),
        keyword: item.keyword,
        totalCount: item.totalCount,
        scannedPages: item.scannedPages,
        timestamp: item.timestamp,
        results: item.results,
      };

      const updated = [newEntry, ...history.filter((h) => h.keyword !== item.keyword)].slice(0, 8);
      setHistory(updated);
      localStorage.setItem("asela_scanner_history_v2", JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem("asela_scanner_history_v2");
  };

  const handleSearch = async (keyword: string, pages: number, hl = "tr", gl = "tr") => {
    setIsLoading(true);
    setErrorMsg(null);
    setActiveKeyword(keyword);

    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(keyword)}&hl=${hl}&gl=${gl}`;

    // Automatically open Google search page in user's default browser (Chrome/Edge)
    fetch("/api/open-browser", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: searchUrl }),
    }).catch(() => {});

    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword, pages, hl, gl }),
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.error || `Arama sunucusu hatası: HTTP ${response.status}`);
      }

      const result: SearchResponse = await response.json();
      setData(result);
      saveHistory(result);
    } catch (err: any) {
      setErrorMsg(err.message || "Arama sırasında bağlantı hatası oluştu.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectHistory = (item: SearchHistoryItem) => {
    handleSearch(item.keyword, item.scannedPages || 2);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans antialiased selection:bg-indigo-500 selection:text-white">
      {/* Top Fixed Header */}
      <SearchHeader />

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8">
        {/* Banner Section */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-zinc-900 via-zinc-900/90 to-indigo-950/40 border border-zinc-800 shadow-xl">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
                Google SERP Harvester Engine
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              Çok Sayfalı Google Arama & URL Ayıklayıcı
            </h2>
            <p className="text-xs text-zinc-400 max-w-2xl">
              Girilen anahtar kelime için Google arama oturumunu başlatır, SERP sonuçlarındaki tüm gerçek organik bağlantıları ayıklar ve tek tıkla kopyalama listesi sunar.
            </p>
          </div>

          <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl bg-zinc-950/80 border border-zinc-800 text-xs font-mono text-zinc-400">
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
            <span>Desktop Executable Mode</span>
          </div>
        </div>

        {/* Search History Chips */}
        <SearchHistory
          history={history}
          onSelect={handleSelectHistory}
          onClear={handleClearHistory}
        />

        {/* Main Search Controls */}
        <SearchForm onSearch={handleSearch} isLoading={isLoading} />

        {/* Error Alert Box */}
        {errorMsg && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-xl bg-red-950/40 border border-red-800/80 text-red-300 text-xs font-mono mb-6 flex items-center justify-between"
          >
            <span>[HATA] {errorMsg}</span>
            <button
              onClick={() => setErrorMsg(null)}
              className="text-red-400 hover:text-white font-bold px-2 py-1 cursor-pointer"
            >
              Kapat
            </button>
          </motion.div>
        )}

        {/* Quick Copy Master Bar */}
        {data && <QuickCopyBar data={data} />}

        {/* Domain & Page Analytics */}
        {data && (
          <DomainAnalytics
            stats={data.domainStats}
            pageDetails={data.pageDetails}
            totalResults={data.totalCount}
          />
        )}

        {/* Results Table */}
        {data && data.results && data.results.length > 0 && (
          <ResultsTable results={data.results} scannedPages={data.scannedPages} />
        )}

        {/* Terminal Console Output */}
        <TerminalConsole
          data={data}
          isLoading={isLoading}
          activeKeyword={activeKeyword}
        />
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800/80 py-6 bg-zinc-950 text-zinc-500 text-xs font-mono">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-indigo-400" />
            <span className="text-zinc-400 font-bold">ASELA SCANNER</span>
            <span className="text-zinc-600">•</span>
            <span>Electron & Node.js Native Desktop Application</span>
          </div>

          <div className="flex items-center gap-4 text-zinc-400">
            <a
              href="https://www.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-indigo-400 transition"
            >
              Google
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
export default App;
