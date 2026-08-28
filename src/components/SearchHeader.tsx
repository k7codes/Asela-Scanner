import React from "react";
import { Globe, ExternalLink, Cpu, ShieldCheck } from "lucide-react";

export const SearchHeader: React.FC = () => {
  return (
    <header className="border-b border-zinc-800/80 bg-zinc-950/90 backdrop-blur-md sticky top-0 z-40 text-zinc-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand Identity */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-blue-600 to-violet-700 flex items-center justify-center text-white font-black shadow-lg shadow-indigo-950/60 border border-indigo-400/30">
            <Cpu className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-black tracking-wider text-white flex items-center gap-1.5 font-mono">
                <span>ASELA</span>
                <span className="text-indigo-400 font-light">SCANNER</span>
              </h1>
              <span className="text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 font-mono font-bold border border-indigo-500/30">
                v2.5 STANDALONE
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 hidden sm:flex items-center gap-1.5">
              <span>Google SERP Multi-Page URL Harvester</span>
              <span className="text-zinc-600">•</span>
              <span className="text-indigo-400/90 font-mono">Core Engine Active</span>
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-400 font-mono">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>High Speed Scraper</span>
          </div>

          <a
            id="google-home-link"
            href="https://www.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium transition shadow-xs cursor-pointer border border-zinc-700"
          >
            <Globe className="w-3.5 h-3.5 text-zinc-400" />
            <span>Google.com</span>
            <ExternalLink className="w-3 h-3 opacity-60" />
          </a>
        </div>
      </div>
    </header>
  );
};

