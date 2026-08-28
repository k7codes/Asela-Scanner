# Asela Dork Scanner

<p align="center">
  <img src="https://raw.githubusercontent.com/yourname/asela-dork-scanner/main/banner.png" width="900" alt="Asela Dork Scanner">
</p>

<p align="center">
  <strong>Lightweight search reconnaissance utility</strong>
</p>

<p align="center">

![Version](https://img.shields.io/badge/version-1.0-38bdf8?style=flat-square)

![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?style=flat-square\&logo=node.js\&logoColor=white)

![API](https://img.shields.io/badge/API-none-475569?style=flat-square)

![License](https://img.shields.io/badge/license-MIT-475569?style=flat-square)

</p>

---

## 🔎 Overview

**Asela Dork Scanner** is a lightweight search-based reconnaissance utility designed for automated dork queries, result collection and URL analysis.

The scanner follows a simple workflow:

```text
Input
  │
  ▼
Query Builder
  │
  ▼
Search
  │
  ▼
Parser
  │
  ▼
Deduplication
  │
  ▼
Output
```

No commercial search API is required.

---

## ✦ Features

| Feature              | Description                          |
| :------------------- | :----------------------------------- |
| 🔍 **Dork Queries**  | Custom search operators and keywords |
| 🌐 **Search Based**  | No commercial API dependency         |
| 📄 **Result Parser** | Extracts discovered URLs             |
| ⊘ **Deduplication**  | Removes duplicate results            |
| ⚡ **Lightweight**    | Minimal runtime overhead             |
| 💾 **Local Output**  | Saves collected results locally      |
| ⚙️ **Configurable**  | Adjustable scanner parameters        |

---

## ⚙ Installation

```bash
git clone https://github.com/yourname/asela-dork-scanner.git
cd asela-dork-scanner
npm install
```

---

## ▶ Usage

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

## ⌕ Dork Syntax

Asela supports standard search operators:

```text
site:example.com
inurl:login
inurl:admin
intitle:"index of"
filetype:pdf
```

Operators can be combined:

```text
site:example.com inurl:login
```

---

## ⚙ Configuration

Available parameters can be adjusted according to your setup:

```text
keyword
search_engine
result_limit
delay
output
```

---

## ⇩ Output

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

## ◈ CAPTCHA & Rate Limits

Search providers may apply CAPTCHA challenges, rate limits or temporary restrictions when automated traffic is detected.

Asela does not guarantee that these protections will never appear.

---

## ⛨ Responsible Use

Asela Dork Scanner is intended for:

* Authorized security research
* OSINT
* Reconnaissance
* CTF environments
* Educational purposes

Only investigate targets you are authorized to assess.

The author is not responsible for misuse of the software.

---

## About

```text
Project    Asela Dork Scanner
Version    1.0
Runtime    Node.js
API        None
Author     K7
```

<p align="center">
  <sub>ASELA · DORK SCANNER · K7</sub>
</p>
