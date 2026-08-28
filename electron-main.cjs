const { app, BrowserWindow, shell, ipcMain, clipboard } = require("electron");
const path = require("path");
const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");

let mainWindow = null;
let expressServer = null;
const PORT = 38472; // Internal port for desktop app

const USER_AGENTS = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Linux; Android 14; Pixel 8 Pro) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.6422.113 Mobile Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1",
];

function isInternalSearchDomain(host, href) {
  const h = (host || "").toLowerCase();
  const raw = (href || "").toLowerCase();
  return (
    h.includes("google.") ||
    h.includes("googleadservices") ||
    h.includes("googlesyndication") ||
    h.includes("googlevideo") ||
    h.includes("gstatic") ||
    h.includes("schema.org") ||
    h.includes("w3.org") ||
    h.includes("duckduckgo.com") ||
    h.includes("bing.com") ||
    h.includes("microsoft.com") ||
    h.includes("yahoo.com") ||
    h.includes("yimg.com") ||
    raw.includes("accounts.google") ||
    raw.includes("support.google") ||
    raw.includes("policies.google") ||
    raw.includes("/preferences") ||
    raw.includes("/search?") ||
    raw.includes("/advanced_search") ||
    raw.includes("maps.google") ||
    raw.includes("yandex.") ||
    raw.includes("facebook.com/sharer") ||
    raw.includes("twitter.com/share") ||
    raw.includes("linkedin.com/share")
  );
}

function decodeSearchUrl(rawHref) {
  let clean = (rawHref || "").trim();
  if (!clean) return "";

  // 1. Google redirect: /url?q=https://example.com
  if (clean.startsWith("/url?q=")) {
    try {
      const parsed = new URL("https://www.google.com" + clean);
      clean = parsed.searchParams.get("q") || clean;
    } catch {}
  } else if (clean.includes("/url?q=")) {
    try {
      const idx = clean.indexOf("/url?q=");
      const sub = clean.substring(idx);
      const parsed = new URL("https://www.google.com" + sub);
      clean = parsed.searchParams.get("q") || clean;
    } catch {}
  }

  // 2. Bing redirect: /ck/a?!...&u=a1aHR0cHM6Ly...
  if (clean.includes("/ck/a?!") || clean.includes("bing.com/ck/a")) {
    try {
      const u = new URL(clean.startsWith("http") ? clean : "https://www.bing.com" + clean);
      const uParam = u.searchParams.get("u");
      if (uParam && uParam.startsWith("a1")) {
        clean = Buffer.from(uParam.substring(2), "base64").toString("utf-8");
      }
    } catch {}
  }

  // 3. DuckDuckGo redirect: uddg=...
  if (clean.includes("uddg=")) {
    try {
      const u = new URL(clean.startsWith("http") ? clean : "https://duckduckgo.com" + clean);
      clean = u.searchParams.get("uddg") || clean;
    } catch {}
  }

  // 4. Yahoo redirect: /RU=...
  if (clean.includes("/RU=")) {
    try {
      const match = clean.match(/\/RU=([^/]+)/);
      if (match && match[1]) {
        clean = decodeURIComponent(match[1]);
      }
    } catch {}
  }

  return clean;
}

function cleanAndNormalizeUrl(rawHref) {
  try {
    const decoded = decodeSearchUrl(rawHref);
    if (!decoded) return null;

    if (!decoded.startsWith("http://") && !decoded.startsWith("https://")) {
      return null;
    }

    const u = new URL(decoded);
    u.searchParams.delete("sa");
    u.searchParams.delete("ved");
    u.searchParams.delete("usg");
    u.searchParams.delete("source");

    const host = u.hostname.toLowerCase();
    if (isInternalSearchDomain(host, decoded)) return null;

    return u.toString().split("#")[0].replace(/\/$/, "");
  } catch {
    return null;
  }
}

// 1. Google Live Scraper per Page
async function scrapeGooglePage(keyword, pageNumber, hl = "tr", gl = "tr") {
  const start = (pageNumber - 1) * 10;
  const encoded = encodeURIComponent(keyword);
  const searchUrl = `https://www.google.com/search?q=${encoded}&start=${start}&num=10&hl=${hl}&gl=${gl}&ie=UTF-8&oe=UTF-8`;
  const ua = USER_AGENTS[(pageNumber - 1) % USER_AGENTS.length];

  try {
    const res = await axios.get(searchUrl, {
      headers: {
        "User-Agent": ua,
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
        "Accept-Language": `${hl}-${gl.toUpperCase()},${hl};q=0.9,en-US;q=0.8,en;q=0.7`,
        "Accept-Encoding": "gzip, deflate, br",
        "Cache-Control": "no-cache",
        Cookie: "SOCS=CAESHAgBEhJnd3NfMjAyNDA1MDgtMF9SQzIaAmVuIAEaBgiA_LmwBg; 1P_JAR=2024-05-15-12; AEC=AUEFqZf4; NID=511",
      },
      timeout: 8000,
      validateStatus: () => true,
    });

    if (res.status !== 200) {
      return { results: [], status: res.status, log: `Google S${pageNumber}: HTTP ${res.status}` };
    }

    const $ = cheerio.load(res.data);
    const items = [];
    const seen = new Set();

    $("a").each((_, el) => {
      const raw = $(el).attr("href");
      if (!raw) return;
      const clean = cleanAndNormalizeUrl(raw);
      if (!clean || seen.has(clean)) return;

      try {
        const u = new URL(clean);
        const host = u.hostname.replace(/^www\./, "");
        let title = $(el).find("h3").first().text().trim();
        if (!title) {
          title = $(el).closest("div.g, div.MjjYud, div.yuRUbf, div.tF2Cxc, div.kCrYT").find("h3").first().text().trim();
        }
        if (!title) {
          title = $(el).find("div.BNeawe, div.vvjwJb, span").first().text().trim();
        }
        if (!title) {
          title = $(el).text().trim();
        }
        title = title.replace(/\s+/g, " ").trim();
        if (!title || title.length < 2) title = host;

        seen.add(clean);
        items.push({
          rank: 0,
          page: pageNumber,
          title,
          url: clean,
          domain: host,
        });
      } catch {}
    });

    return { results: items, status: 200, log: `Google S${pageNumber}: ${items.length} URL ayıklandı.` };
  } catch (err) {
    return { results: [], status: 0, log: `Google S${pageNumber}: ${err.message}` };
  }
}

// 2. Bing Live Scraper per Page (with Base64 Decode)
async function scrapeBingPage(keyword, pageNumber) {
  const first = (pageNumber - 1) * 10 + 1;
  const url = `https://www.bing.com/search?q=${encodeURIComponent(keyword)}&first=${first}&rdr=1&FORM=PORE`;

  try {
    const res = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7",
      },
      timeout: 8000,
      validateStatus: () => true,
    });

    if (res.status !== 200) return [];

    const $ = cheerio.load(res.data);
    const items = [];
    const seen = new Set();

    $("li.b_algo").each((_, el) => {
      const a = $(el).find("h2 a, a").first();
      const raw = a.attr("href");
      if (!raw) return;
      const clean = cleanAndNormalizeUrl(raw);
      if (!clean || seen.has(clean)) return;

      try {
        const u = new URL(clean);
        const host = u.hostname.replace(/^www\./, "");
        let title = $(el).find("h2").text().trim() || a.text().trim() || host;
        title = title.replace(/\s+/g, " ").trim();

        seen.add(clean);
        items.push({
          rank: 0,
          page: pageNumber,
          title,
          url: clean,
          domain: host,
        });
      } catch {}
    });

    return items;
  } catch {
    return [];
  }
}

// 3. DuckDuckGo Lite Scraper
async function scrapeDuckDuckGoLitePage(keyword, pageNumber) {
  const start = (pageNumber - 1) * 30;
  const url = "https://lite.duckduckgo.com/lite/";
  const params = new URLSearchParams();
  params.append("q", keyword);
  if (start > 0) {
    params.append("s", String(start));
    params.append("next", "1");
  }

  try {
    const res = await axios.post(url, params.toString(), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        Origin: "https://lite.duckduckgo.com",
        Referer: "https://lite.duckduckgo.com/",
      },
      timeout: 8000,
      validateStatus: () => true,
    });

    if (res.status !== 200) return [];

    const $ = cheerio.load(res.data);
    const items = [];
    const seen = new Set();

    $("a.result-link, tr td a, .results_links_deep a").each((_, el) => {
      const raw = $(el).attr("href");
      if (!raw) return;
      const clean = cleanAndNormalizeUrl(raw);
      if (!clean || seen.has(clean)) return;

      try {
        const u = new URL(clean);
        const host = u.hostname.replace(/^www\./, "");
        let title = $(el).text().trim() || host;
        title = title.replace(/\s+/g, " ").trim();
        if (title.length < 2 || title.toLowerCase().includes("duckduckgo")) return;

        seen.add(clean);
        items.push({
          rank: 0,
          page: pageNumber,
          title,
          url: clean,
          domain: host,
        });
      } catch {}
    });

    return items;
  } catch {
    return [];
  }
}

// Unified Multi-Engine Multi-Page Scanner Engine
async function scanGoogleMultiPage(keyword, totalPages = 1, hl = "tr", gl = "tr") {
  const startTime = Date.now();
  const clampedPages = Math.min(Math.max(Number(totalPages) || 1, 1), 10);
  const primarySearchUrl = `https://www.google.com/search?q=${encodeURIComponent(keyword)}&hl=${hl}&gl=${gl}`;

  const allResults = [];
  const pageDetails = [];
  const logs = [];
  const globalSeenUrls = new Set();

  logs.push(`[BAŞLATILDI] Anahtar Kelime: "${keyword}" | Hedef: ${clampedPages} Sayfa`);

  for (let page = 1; page <= clampedPages; page++) {
    logs.push(`[TARANIYOR] Sayfa ${page}/${clampedPages} bağlantıları taranıyor...`);

    const googleRes = await scrapeGooglePage(keyword, page, hl, gl);
    let pageLinks = [...googleRes.results];

    const [bingLinks, ddgLinks] = await Promise.all([
      scrapeBingPage(keyword, page),
      scrapeDuckDuckGoLitePage(keyword, page),
    ]);

    pageLinks.push(...bingLinks, ...ddgLinks);

    let newlyAddedForThisPage = 0;
    for (const item of pageLinks) {
      if (!globalSeenUrls.has(item.url)) {
        globalSeenUrls.add(item.url);
        allResults.push({
          ...item,
          page,
          rank: allResults.length + 1,
        });
        newlyAddedForThisPage++;
      }
    }

    logs.push(`[OK] Sayfa ${page}: ${newlyAddedForThisPage} adet gerçek bağlantı toplandı.`);

    pageDetails.push({
      pageNumber: page,
      searchUrl: `https://www.google.com/search?q=${encodeURIComponent(keyword)}&start=${(page - 1) * 10}&hl=${hl}&gl=${gl}`,
      urlsFound: newlyAddedForThisPage,
      status: newlyAddedForThisPage > 0 ? "success" : "warning",
    });

    if (page < clampedPages) {
      await new Promise((r) => setTimeout(r, 300));
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

  const executionTimeMs = Date.now() - startTime;
  logs.push(`[TAMAMLANDI] Toplam ${allResults.length} adet benzersiz canlı web URL'si kaydedildi (${executionTimeMs} ms).`);

  return {
    keyword,
    searchUrl: primarySearchUrl,
    totalCount: allResults.length,
    requestedPages: clampedPages,
    scannedPages: pageDetails.length,
    results: allResults,
    pageDetails,
    domainStats,
    timestamp: new Date().toISOString(),
    executionTimeMs,
    logs,
  };
}

// Start local Express server for UI & APIs
function startInternalServer() {
  const appExp = express();
  appExp.use(express.json());

  appExp.post("/api/search", async (req, res) => {
    const { keyword, pages = 1, hl = "tr", gl = "tr" } = req.body;
    if (!keyword || typeof keyword !== "string" || !keyword.trim()) {
      return res.status(400).json({ error: "Aranacak kelime gereklidir." });
    }
    try {
      const data = await scanGoogleMultiPage(keyword.trim(), Number(pages) || 1, hl, gl);
      return res.json(data);
    } catch (error) {
      return res.status(500).json({ error: error.message || "Arama hatası." });
    }
  });

  appExp.post("/api/open-browser", (req, res) => {
    const { url } = req.body;
    if (url) shell.openExternal(url);
    res.json({ success: true });
  });

  let distDir = path.join(__dirname, "dist");
  if (!require("fs").existsSync(path.join(distDir, "index.html"))) {
    distDir = path.join(process.resourcesPath || __dirname, "app", "dist");
  }
  if (!require("fs").existsSync(path.join(distDir, "index.html"))) {
    distDir = path.join(__dirname, "..", "dist");
  }

  appExp.use(express.static(distDir));
  appExp.get("*", (req, res) => {
    const indexPath = path.join(distDir, "index.html");
    if (require("fs").existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      res.send(`<html><body style="background:#09090b;color:#fff;font-family:sans-serif;padding:40px;text-align:center;">
        <h2>ASELA SCANNER</h2>
        <p>Arayüz yükleniyor...</p>
      </body></html>`);
    }
  });

  return appExp.listen(PORT, "127.0.0.1");
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 860,
    minWidth: 900,
    minHeight: 650,
    title: "ASELA SCANNER - SERP Harvester",
    backgroundColor: "#09090b",
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "electron-preload.cjs"),
    },
  });

  mainWindow.loadURL(`http://127.0.0.1:${PORT}`);

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: "deny" };
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

ipcMain.handle("open-external", async (_, url) => {
  if (url) await shell.openExternal(url);
  return true;
});

ipcMain.handle("write-clipboard", async (_, text) => {
  if (text) clipboard.writeText(text);
  return true;
});

app.whenReady().then(() => {
  expressServer = startInternalServer();
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (expressServer) expressServer.close();
  if (process.platform !== "darwin") app.quit();
});
