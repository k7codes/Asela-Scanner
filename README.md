# Asela Dork Scanner

<p align="center">
  <svg width="900" height="150" viewBox="0 0 900 150" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="ice" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#dff8ff"/>
        <stop offset="45%" stop-color="#61d9ff"/>
        <stop offset="100%" stop-color="#1478c9"/>
      </linearGradient>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#07121d"/>
        <stop offset="50%" stop-color="#0b2435"/>
        <stop offset="100%" stop-color="#07121d"/>
      </linearGradient>
    </defs>

```
<rect width="900" height="150" rx="18" fill="url(#bg)"/>

<path d="M0 118 L150 40 L230 100 L330 28 L430 112 L530 45 L650 105 L760 35 L900 110"
      fill="none" stroke="#183e56" stroke-width="2"/>

<path d="M0 120 L150 42 L230 101 L330 30 L430 113 L530 47 L650 106 L760 37 L900 112"
      fill="none" stroke="#5edcff" stroke-opacity=".22"/>

<circle cx="92" cy="75" r="32" fill="none" stroke="url(#ice)" stroke-width="2"/>
<circle cx="92" cy="75" r="20" fill="none" stroke="#61d9ff" stroke-opacity=".35"/>
<path d="M92 53 V97 M70 75 H114 M77 60 L107 90 M107 60 L77 90"
      stroke="#9beaff" stroke-width="2" stroke-linecap="round"/>

<text x="145" y="76"
      fill="url(#ice)"
      font-family="Arial, Helvetica, sans-serif"
      font-size="42"
      font-weight="700"
      letter-spacing="7">
  ASELA
</text>

<text x="149" y="106"
      fill="#8baabd"
      font-family="Arial, Helvetica, sans-serif"
      font-size="16"
      letter-spacing="6">
  DORK SCANNER
</text>

<line x1="650" y1="61" x2="820" y2="61"
      stroke="#39758f" stroke-width="1"/>

<text x="650" y="88"
      fill="#a6d9e9"
      font-family="Arial, Helvetica, sans-serif"
      font-size="12"
      letter-spacing="3">
  API-LESS
</text>

<text x="650" y="109"
      fill="#5edcff"
      font-family="Arial, Helvetica, sans-serif"
      font-size="12"
      letter-spacing="3">
  SEARCH RECON
</text>
```

  </svg>
</p>

<p align="center">
  Lightweight search reconnaissance utility
</p>

<p align="center">
  <img src="https://img.shields.io/badge/version-1.0-0ea5e9?style=flat-square" alt="Version">
  <img src="https://img.shields.io/badge/node.js-18%2B-0ea5e9?style=flat-square&logo=nodedotjs&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/API-none-334155?style=flat-square" alt="No API">
  <img src="https://img.shields.io/badge/license-MIT-334155?style=flat-square" alt="License">
</p>

---

## <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="2"/><path d="m16 16 5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg> Overview

**Asela Dork Scanner** is a lightweight search-based reconnaissance utility for automated dork queries, result collection and URL analysis.

The project keeps the workflow simple:

```text
┌──────────┐
│  INPUT   │
└────┬─────┘
     │
     ▼
┌──────────┐
│  QUERY   │
└────┬─────┘
     │
     ▼
┌──────────┐
│  SEARCH  │
└────┬─────┘
     │
     ▼
┌──────────┐
│  PARSE   │
└────┬─────┘
     │
     ▼
┌──────────┐
│  FILTER  │
└────┬─────┘
     │
     ▼
┌──────────┐
│  OUTPUT  │
└──────────┘
```

No commercial search API is required.

---

## <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 3v18M3 12h18M5.6 5.6l12.8 12.8M18.4 5.6 5.6 18.4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg> Features

|                                                                                                                                                                                                                                                              | Feature        | Description                          |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------- | ------------------------------------ |
| <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="2"/><path d="m16 16 5 5" stroke="currentColor" stroke-width="2"/></svg>                     | Dork Queries   | Custom search operators and keywords |
| <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 5h16v14H4z" stroke="currentColor" stroke-width="2"/><path d="M8 9h8M8 13h5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg> | Result Parsing | Extract and process discovered URLs  |
| <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 6h12v12H6z" stroke="currentColor" stroke-width="2"/><path d="m9 9 6 6M15 9l-6 6" stroke="currentColor" stroke-width="2"/></svg>                   | Deduplication  | Remove duplicate results             |
| <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 3v18M3 12h18" stroke="currentColor" stroke-width="2"/></svg>                                                                                     | Lightweight    | Minimal runtime overhead             |
| <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 4h16v16H4z" stroke="currentColor" stroke-width="2"/><path d="M8 8h8v8H8z" stroke="currentColor" stroke-width="2"/></svg>                          | Local Output   | Export collected results locally     |

---

## <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 5h16v14H4z" stroke="currentColor" stroke-width="2"/><path d="m8 9 3 3-3 3M13 15h3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg> Installation

```bash
git clone https://github.com/yourname/asela-dork-scanner.git
cd asela-dork-scanner
npm install
```

---

## <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="m8 5 11 7-11 7V5Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg> Usage

```bash
node asela.js
```

Example:

```text
╔══════════════════════════════════════════════╗
║              ASELA DORK SCANNER             ║
║                     v1.0                    ║
╚══════════════════════════════════════════════╝

Keyword: example

[+] Initializing scanner
[+] Building query
[+] Searching
[+] Parsing results
[+] Filtering duplicates

Results found : 42
Unique URLs   : 37

[+] Scan completed
```

---

## <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="m8 9 4-4 4 4M12 5v10M5 15v4h14v-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg> Dork Syntax

Asela accepts standard search operators:

```text
site:example.com
inurl:login
inurl:admin
intitle:"index of"
filetype:pdf
```

Operators can be combined with keywords:

```text
site:example.com inurl:login
```

---

## <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" stroke="currentColor" stroke-width="2"/><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-1.42 1.42-.06-.06a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1.03 1.56V21h-2v-.08a1.7 1.7 0 0 0-1.03-1.56 1.7 1.7 0 0 0-1.88.34l-.06.06-1.42-1.42.06-.06A1.7 1.7 0 0 0 9.4 15a1.7 1.7 0 0 0-1.56-1.03H7v-2h.84A1.7 1.7 0 0 0 9.4 10a1.7 1.7 0 0 0-.34-1.88L9 8.06l1.42-1.42.06.06A1.7 1.7 0 0 0 12.36 7.04 1.7 1.7 0 0 0 13.4 5.5V5h2v.5a1.7 1.7 0 0 0 1.03 1.56 1.7 1.7 0 0 0 1.88-.34l.06-.06 1.42 1.42-.06.06A1.7 1.7 0 0 0 19.4 10a1.7 1.7 0 0 0 1.56 1.03H21v2h-.04A1.7 1.7 0 0 0 19.4 15Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg> Configuration

Scanner parameters can be adjusted according to your setup:

```text
keyword
search_engine
result_limit
delay
output
```

---

## <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 5h16v14H4z" stroke="currentColor" stroke-width="2"/><path d="M7 9h10M7 13h7M7 17h4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg> Output

Results can be exported locally:

```text
output/
├── results.txt
├── unique.txt
└── logs.txt
```

Example:

```text
https://example.com/page
https://example.com/login
https://example.com/admin
```

---

## <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 3 5 6v5c0 4.5 3 8.5 7 10 4-1.5 7-5.5 7-10V6l-7-3Z" stroke="currentColor" stroke-width="2"/><path d="m9 12 2 2 4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg> CAPTCHA & Rate Limits

Search providers may apply CAPTCHA challenges, rate limits or temporary restrictions when automated traffic is detected.

Asela does not guarantee that these protections will never appear.

---

## <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="5" y="10" width="14" height="10" rx="2" stroke="currentColor" stroke-width="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3" stroke="currentColor" stroke-width="2"/></svg> Responsible Use

Asela Dork Scanner is intended for:

* Authorized security research
* OSINT
* Reconnaissance
* CTF environments
* Educational purposes

Only investigate targets you are authorized to assess.

The author is not responsible for misuse of the software.

---

## <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2"/><path d="M12 10v6M12 7h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg> Project

```text
Name       Asela Dork Scanner
Version    1.0
Runtime    Node.js
API        None
Author     K7
```

<p align="center">
  <sub>ASELA · DORK SCANNER · K7</sub>
</p>
