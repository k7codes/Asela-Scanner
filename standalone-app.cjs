const express = require("express");
const path = require("path");
const { exec } = require("child_process");
const axios = require("axios");
const cheerio = require("cheerio");
const readline = require("readline");

// CLI Argument check
const args = process.argv.slice(2);
const isCliMode = args.includes("--cli") || args.includes("-c") || args.some((a) => a.startsWith("-k") || a.startsWith("--keyword"));

// Helper: Open default browser
function openBrowser(url) {
  const platform = process.platform;
  let command = "";
  if (platform === "win32") {
    command = `start "" "${url}"`;
  } else if (platform === "darwin") {
    command = `open "${url}"`;
  } else {
    command = `xdg-open "${url}"`;
  }
  exec(command, () => {});
}

// Scrape single page of Google SERP
async function scrapeGoogleSinglePage(keyword, pageNumber, hl = "tr", gl = "tr") {
  const startParam = (pageNumber - 1) * 10;
  const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(keyword)}&start=${startParam}&hl=${hl}&gl=${gl}`;

  const headers = {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    Accept:
      "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
    "Accept-Language": `${hl}-${gl.toUpperCase()},${hl};q=0.9,en-US;q=0.8,en;q=0.7`,
    "Accept-Encoding": "gzip, deflate, br",
    "Cache-Control": "max-age=0",
    "Sec-Ch-Ua": '"Chromium";v="124", "Google Chrome";v="124", "Not-A.Brand";v="99"',
    "Sec-Ch-Ua-Mobile": "?0",
    "Sec-Ch-Ua-Platform": '"Windows"',
    "Sec-Fetch-Dest": "document",
    "Sec-Fetch-Mode": "navigate",
    "Sec-Fetch-Site": "none",
    "Sec-Fetch-User": "?1",
    "Upgrade-Insecure-Requests": "1",
  };

  try {
    const res = await axios.get(searchUrl, {
      headers,
      timeout: 12000,
      validateStatus: () => true,
    });

    if (res.status !== 200) {
      return {
        searchUrl,
        results: [],
        log: `[WARN] Sayfa ${pageNumber} HTTP ${res.status} döndürdü.`,
        rawStatus: res.status,
      };
    }

    const $ = cheerio.load(res.data);
    const pageResults = [];
    const seenOnPage = new Set();

    $("a").each((_, element) => {
      const $el = $(element);
      let href = $el.attr("href");
      if (!href) return;

      if (href.startsWith("/url?q=")) {
        try {
          const parsed = new URL("https://www.google.com" + href);
          href = parsed.searchParams.get("q") || href;
        } catch {
          // ignore
        }
      }

      if (!href.startsWith("http://") && !href.startsWith("https://")) return;

      try {
        const urlObj = new URL(href);
        const host = urlObj.hostname.toLowerCase();

        if (
          host.endsWith("google.com") ||
          host.endsWith("google.com.tr") ||
          host.endsWith("googleadservices.com") ||
          host.endsWith("googlevideo.com") ||
          host.endsWith("gstatic.com") ||
          host.endsWith("schema.org") ||
          host.endsWith("w3.org") ||
          href.includes("accounts.google") ||
          href.includes("support.google") ||
          href.includes("/preferences") ||
          href.includes("/search?")
        ) {
          return;
        }

        let title = $el.find("h3").first().text().trim();
        if (!title) {
          const container = $el.closest("div.g, div.MjjYud, div.yuRUbf, div.N54PNb, div.tF2Cxc");
          title = container.find("h3").first().text().trim();
        }
        if (!title) {
          title = $el.text().trim();
        }

        title = title.replace(/\s+/g, " ").trim();
        if (!title || title.length < 2) title = host;

        const normalizedUrl = href.split("#")[0].replace(/\/$/, "");

        if (!seenOnPage.has(normalizedUrl)) {
          seenOnPage.add(normalizedUrl);
          pageResults.push({
            rank: 0,
            page: pageNumber,
            title,
            url: href,
            domain: host.replace(/^www\./, ""),
          });
        }
      } catch {
        // ignore
      }
    });

    return {
      searchUrl,
      results: pageResults,
      log: `[OK] Sayfa ${pageNumber}: ${pageResults.length} adet bağlantı toplandı.`,
      rawStatus: 200,
    };
  } catch (err) {
    return {
      searchUrl,
      results: [],
      log: `[HATA] Sayfa ${pageNumber}: ${err.message}`,
      rawStatus: 0,
    };
  }
}

// Multi-page scanner
async function scanGoogleMultiPage(keyword, totalPages = 1, hl = "tr", gl = "tr") {
  const startTime = Date.now();
  const clampedPages = Math.min(Math.max(Number(totalPages) || 1, 1), 10);
  const primarySearchUrl = `https://www.google.com/search?q=${encodeURIComponent(keyword)}&hl=${hl}&gl=${gl}`;

  const allResults = [];
  const pageDetails = [];
  const logs = [];
  const globalSeenUrls = new Set();

  logs.push(`[BAŞLATILDI] Anahtar Kelime: "${keyword}" | Sayfa Hedefi: ${clampedPages}`);

  for (let page = 1; page <= clampedPages; page++) {
    const pageData = await scrapeGoogleSinglePage(keyword, page, hl, gl);

    let newForThisPage = 0;
    pageData.results.forEach((item) => {
      const norm = item.url.split("#")[0].replace(/\/$/, "");
      if (!globalSeenUrls.has(norm)) {
        globalSeenUrls.add(norm);
        allResults.push({
          ...item,
          rank: allResults.length + 1,
        });
        newForThisPage++;
      }
    });

    logs.push(pageData.log);

    pageDetails.push({
      pageNumber: page,
      searchUrl: pageData.searchUrl,
      urlsFound: newForThisPage,
      status: pageData.rawStatus === 200 ? "success" : "warning",
    });

    if (page < clampedPages) {
      await new Promise((r) => setTimeout(r, 600));
    }
  }

  // Domain statistics
  const domainMap = new Map();
  allResults.forEach((item) => {
    domainMap.set(item.domain, (domainMap.get(item.domain) || 0) + 1);
  });

  const domainStats = Array.from(domainMap.entries())
    .map(([domain, count]) => ({
      domain,
      count,
      percentage: Number(((count / (allResults.length || 1)) * 100).toFixed(1)),
    }))
    .sort((a, b) => b.count - a.count);

  return {
    keyword,
    searchUrl: primarySearchUrl,
    totalCount: allResults.length,
    requestedPages: clampedPages,
    scannedPages: clampedPages,
    results: allResults,
    pageDetails,
    domainStats,
    timestamp: new Date().toLocaleTimeString("tr-TR"),
    executionTimeMs: Date.now() - startTime,
    logs,
  };
}

// START CLI OR WEB APP
if (isCliMode) {
  // Terminal Interactive Mode
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  console.log("\n=======================================================");
  console.log("       ASELA SCANNER - Terminal Arama Modu (v2.5)       ");
  console.log("=======================================================\n");

  rl.question("Aranacak Kelime: ", async (keyword) => {
    if (!keyword || !keyword.trim()) {
      console.log("[!] Kelime girilmedi. Çıkılıyor.");
      rl.close();
      return;
    }

    rl.question("Taranacak Sayfa Sayısı (Varsayılan 2, Maks 10): ", async (pagesInput) => {
      const pages = parseInt(pagesInput, 10) || 2;
      console.log(`\n[+] "${keyword}" için ${pages} sayfa taranıyor... Lütfen bekleyin.\n`);

      try {
        const data = await scanGoogleMultiPage(keyword.trim(), pages);
        console.log("-------------------------------------------------------");
        console.log(`[SONUÇ] Toplam ${data.totalCount} adet organik bağlantı bulundu:\n`);

        data.results.forEach((item) => {
          console.log(`[#${item.rank}] (Sayfa ${item.page}) ${item.url}`);
        });

        console.log("\n=======================================================");
        console.log(`Tarama Tamamlandı (${data.executionTimeMs}ms)`);
      } catch (err) {
        console.error("[HATA]", err.message);
      }

      rl.close();
    });
  });
} else {
  // Web Server & Auto-Browser Launch Mode
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(express.json());

  // Search API
  app.post("/api/search", async (req, res) => {
    const { keyword, pages = 1, hl = "tr", gl = "tr" } = req.body;
    if (!keyword || typeof keyword !== "string" || !keyword.trim()) {
      return res.status(400).json({ error: "Aranacak 'keyword' parametresi gereklidir." });
    }

    try {
      const data = await scanGoogleMultiPage(keyword.trim(), Number(pages) || 1, hl, gl);
      return res.json(data);
    } catch (error) {
      return res.status(500).json({ error: error.message || "Arama hatası oluştu." });
    }
  });

  // Browser Launch API
  app.post("/api/open-browser", (req, res) => {
    const { url } = req.body;
    if (url) openBrowser(url);
    res.json({ success: true });
  });

  // Serve static UI assets
  const distDir = path.join(__dirname, "dist");
  app.use(express.static(distDir));
  app.get("*", (req, res) => {
    res.sendFile(path.join(distDir, "index.html"));
  });

  app.listen(PORT, "0.0.0.0", () => {
    const appUrl = `http://localhost:${PORT}`;
    console.log("\n=======================================================");
    console.log("       ASELA SCANNER - SERP Harvester (v2.5)          ");
    console.log("=======================================================");
    console.log(` [STATUS] Sunucu Aktif: ${appUrl}`);
    console.log(` [INFO]   Web Arayüzü Tarayıcınızda Açılıyor...`);
    console.log("-------------------------------------------------------");
    console.log(" (Uygulamayı kapatmak için bu pencereyi kapatabilirsiniz)");
    console.log("=======================================================\n");

    // Automatically open browser on startup
    openBrowser(appUrl);
  });
}
