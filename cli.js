#!/usr/bin/env node
/**
 * ============================================================================
 *                         ASELA SCANNER - v2.5 (Core)
 *      Multi-Page Google Search SERP URL Extractor & Terminal Scanner
 * ============================================================================
 * 
 * Standalone Windows / Linux / macOS compatible CLI
 */

import readline from 'readline';
import { exec } from 'child_process';
import axios from 'axios';
import * as cheerio from 'cheerio';

// Function: Open Google Search in Default System Browser
function openInDefaultBrowser(url) {
  const platform = process.platform;
  let command = '';

  if (platform === 'win32') {
    command = `start "" "${url}"`;
  } else if (platform === 'darwin') {
    command = `open "${url}"`;
  } else {
    command = `xdg-open "${url}"`;
  }

  exec(command, (error) => {
    if (error) {
      console.log(`[WARN] Tarayıcı açılamadı:`, error.message);
    } else {
      console.log(`[INFO] Varsayılan sistem tarayıcısında arama açıldı.`);
    }
  });
}

// Scrape single Google SERP page
async function scrapeGooglePage(keyword, pageNumber = 1, options = { hl: 'tr', gl: 'tr' }) {
  const startParam = (pageNumber - 1) * 10;
  const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(keyword)}&start=${startParam}&hl=${options.hl || 'tr'}&gl=${options.gl || 'tr'}`;

  const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
    'Accept-Language': 'tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7',
    'Accept-Encoding': 'gzip, deflate, br',
    'Cache-Control': 'no-cache',
    'Sec-Ch-Ua': '"Chromium";v="124", "Google Chrome";v="124", "Not-A.Brand";v="99"',
    'Sec-Ch-Ua-Mobile': '?0',
    'Sec-Ch-Ua-Platform': '"Windows"',
    'Sec-Fetch-Dest': 'document',
    'Sec-Fetch-Mode': 'navigate',
    'Sec-Fetch-Site': 'none',
    'Sec-Fetch-User': '?1',
    'Upgrade-Insecure-Requests': '1'
  };

  try {
    const response = await axios.get(searchUrl, {
      headers,
      timeout: 10000,
      validateStatus: () => true
    });

    if (response.status !== 200) {
      return { searchUrl, pageNumber, results: [], error: `HTTP ${response.status}` };
    }

    const $ = cheerio.load(response.data);
    const pageResults = [];
    const seenOnPage = new Set();

    $('a').each((_, element) => {
      const $el = $(element);
      let href = $el.attr('href');
      if (!href) return;

      if (href.startsWith('/url?q=')) {
        try {
          const parsed = new URL('https://www.google.com' + href);
          href = parsed.searchParams.get('q') || href;
        } catch {
          // ignore
        }
      }

      if (!href.startsWith('http://') && !href.startsWith('https://')) return;

      try {
        const urlObj = new URL(href);
        const host = urlObj.hostname.toLowerCase();

        if (
          host.endsWith('google.com') ||
          host.endsWith('google.com.tr') ||
          host.endsWith('googleadservices.com') ||
          host.endsWith('gstatic.com') ||
          host.endsWith('schema.org') ||
          host.endsWith('w3.org') ||
          href.includes('accounts.google') ||
          href.includes('support.google') ||
          href.includes('/preferences') ||
          href.includes('/search?')
        ) return;

        const hasH3 = $el.find('h3').length > 0 || $el.closest('div.g, div.MjjYud, div.yuRUbf, div.N54PNb').find('h3').length > 0;
        let title = $el.find('h3').first().text().trim() || 
                    $el.closest('div.g, div.MjjYud, div.yuRUbf').find('h3').first().text().trim() ||
                    $el.text().trim();

        title = title.replace(/\s+/g, ' ').trim();
        if (!title || title.length < 2) title = host;

        if (!seenOnPage.has(href) && (hasH3 || title.length > 5)) {
          seenOnPage.add(href);

          let snippet = '';
          const parent = $el.closest('div.g, div.MjjYud, div.N54PNb');
          if (parent.length) {
            snippet = parent.find('div.VwiC3b, span.aCOpRe, div.yXK7lf').first().text().trim();
          }

          pageResults.push({
            page: pageNumber,
            title,
            url: href,
            domain: host,
            snippet: snippet || ''
          });
        }
      } catch {
        // ignore
      }
    });

    return { searchUrl, pageNumber, results: pageResults };
  } catch (err) {
    return { searchUrl, pageNumber, results: [], error: err.message };
  }
}

// Multi-Page Google Scraper
export async function scrapeMultiPageGoogle(keyword, targetPages = 1, options = { hl: 'tr', gl: 'tr' }) {
  const allResults = [];
  const globalSeenUrls = new Set();
  const pageDetails = [];
  const primarySearchUrl = `https://www.google.com/search?q=${encodeURIComponent(keyword)}&hl=${options.hl || 'tr'}&gl=${options.gl || 'tr'}`;

  const pagesToScan = Math.max(1, Math.min(Number(targetPages) || 1, 10));

  for (let page = 1; page <= pagesToScan; page++) {
    const pageData = await scrapeGooglePage(keyword, page, options);
    
    let addedCount = 0;
    if (pageData.results && pageData.results.length > 0) {
      pageData.results.forEach((item) => {
        if (!globalSeenUrls.has(item.url)) {
          globalSeenUrls.add(item.url);
          allResults.push({
            ...item,
            rank: allResults.length + 1
          });
          addedCount++;
        }
      });
    }

    pageDetails.push({
      pageNumber: page,
      searchUrl: pageData.searchUrl,
      urlsFound: addedCount,
      status: addedCount > 0 ? 'success' : 'warning'
    });

    if (page < pagesToScan) {
      await new Promise((r) => setTimeout(r, 600));
    }
  }

  return {
    keyword,
    searchUrl: primarySearchUrl,
    requestedPages: pagesToScan,
    scannedPages: pageDetails.length,
    totalCount: allResults.length,
    results: allResults,
    pageDetails
  };
}

// CLI Entrypoint
async function runCLI() {
  console.log('\n================================================================');
  console.log('                   ASELA SCANNER - v2.5 (CLI)                   ');
  console.log('       Google Search SERP URL Extractor & Terminal Tool        ');
  console.log('================================================================\n');

  const args = process.argv.slice(2);
  let keyword = '';
  let pageCount = 1;

  if (args.length > 0) {
    const pageIndex = args.indexOf('--pages');
    if (pageIndex !== -1 && args[pageIndex + 1]) {
      pageCount = parseInt(args[pageIndex + 1], 10) || 1;
      args.splice(pageIndex, 2);
    } else if (args.length >= 2 && !isNaN(Number(args[args.length - 1]))) {
      pageCount = parseInt(args.pop(), 10) || 1;
    }
    keyword = args.join(' ').trim();
  }

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  if (!keyword) {
    keyword = await new Promise((resolve) => {
      rl.question('[?] Aranacak kelime (Keyword): ', (ans) => {
        resolve(ans.trim());
      });
    });
  }

  if (!keyword) {
    console.log('[ERR] Hata: Kelime girilmedi.');
    rl.close();
    process.exit(1);
  }

  if (args.length === 0) {
    const pageInput = await new Promise((resolve) => {
      rl.question('[?] Taranacak sayfa sayisi (1-10) [Varsayilan: 1]: ', (ans) => {
        resolve(ans.trim());
      });
    });
    if (pageInput && !isNaN(Number(pageInput))) {
      pageCount = Math.max(1, Math.min(parseInt(pageInput, 10), 10));
    }
  }

  rl.close();

  const googleUrl = `https://www.google.com/search?q=${encodeURIComponent(keyword)}&hl=tr`;

  console.log(`\n[1/3] Varsayilan sistem tarayicisinda arama oturumu baslatiliyor...`);
  openInDefaultBrowser(googleUrl);

  console.log(`[2/3] ASELA SCANNER baslatildi. Toplam ${pageCount} sayfa taranıyor...\n`);

  try {
    const data = await scrapeMultiPageGoogle(keyword, pageCount);

    console.log('----------------------------------------------------------------');
    console.log(`  TARAMA RAPORU`);
    console.log(`  Keyword       : "${data.keyword}"`);
    console.log(`  Taranan Sayfa : ${data.scannedPages} / ${data.requestedPages}`);
    console.log(`  Toplam URL    : ${data.totalCount} adet baglanti`);
    console.log('----------------------------------------------------------------\n');

    if (data.results.length === 0) {
      console.log('[WARN] Organik sonuc bulunamadi.');
      console.log(`[URL]  Tarayicidan kontrol edin: ${googleUrl}\n`);
    } else {
      data.results.forEach((item) => {
        console.log(`[#${item.rank}] (Sayfa ${item.page}) ${item.title}`);
        console.log(`    URL: ${item.url}`);
        if (item.snippet) {
          console.log(`    DETAY: ${item.snippet.slice(0, 110)}...`);
        }
        console.log('');
      });

      console.log('================================================================');
      console.log('BULUNAN TUM URL LISTESI:');
      console.log('================================================================');
      data.results.forEach((item) => {
        console.log(item.url);
      });
      console.log('================================================================');
      console.log(`[OK] ${pageCount} sayfadan toplam ${data.totalCount} adet link konsola aktarildi.`);
      console.log('================================================================\n');
    }
  } catch (error) {
    console.error('[ERR] ASELA SCANNER tarama hatasi:', error.message);
  }
}

if (import.meta.url === `file://${process.argv[1]}` || process.argv[1]?.endsWith('cli.js')) {
  runCLI();
}
