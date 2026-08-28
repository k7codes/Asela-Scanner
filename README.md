# Asela Dork Scanner

<p align="center">
  <img src="assets/banner.png" width="900" alt="Asela Dork Scanner">
</p>

<p align="center">
  <strong>API-less search reconnaissance utility</strong>
</p>

<p align="center">
  <img src="assets/icons/version.svg" height="16"> v1.0
  &nbsp;&nbsp;•&nbsp;&nbsp;
  <img src="assets/icons/node.svg" height="16"> Node.js
  &nbsp;&nbsp;•&nbsp;&nbsp;
  <img src="assets/icons/api.svg" height="16"> No API
</p>

---

## <img src="assets/icons/search.svg" width="20"> Overview

**Asela Dork Scanner** is a lightweight search-based reconnaissance tool built for automated dork queries, result collection and URL analysis.

The project focuses on keeping the workflow simple:

```text
QUERY
  │
  ▼
SEARCH
  │
  ▼
PARSE
  │
  ▼
FILTER
  │
  ▼
EXPORT
```

No commercial search API is required.

---

## <img src="assets/icons/layers.svg" width="20"> Features

<table>
<tr>
<td width="50%">

### Search

* Custom dork queries
* Keyword-based scanning
* Search result collection
* Configurable result limits

</td>
<td width="50%">

### Processing

* URL extraction
* Duplicate filtering
* Result normalization
* Local output

</td>
</tr>
</table>

---

## <img src="assets/icons/terminal.svg" width="20"> Installation

```bash
git clone https://github.com/yourname/asela-dork-scanner.git
cd asela-dork-scanner
npm install
```

---

## <img src="assets/icons/play.svg" width="20"> Usage

```bash
node asela.js
```

Example:

```text
┌─────────────────────────────────────────────┐
│              ASELA DORK SCANNER             │
│                    v1.0                     │
└─────────────────────────────────────────────┘

Keyword: example

[+] Initializing scanner
[+] Building query
[+] Searching
[+] Parsing results
[+] Filtering duplicates

Results found : 42
Unique URLs   : 37

[✓] Scan completed
```

---

## <img src="assets/icons/code.svg" width="20"> Query Syntax

Asela supports standard search operators.

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

## <img src="assets/icons/settings.svg" width="20"> Configuration

Scanner parameters can be configured according to the local setup.

```text
keyword
search_engine
result_limit
delay
output
```

Example project structure:

```text
asela-dork-scanner/
│
├── assets/
│   ├── banner.png
│   └── icons/
│       ├── api.svg
│       ├── code.svg
│       ├── layers.svg
│       ├── play.svg
│       ├── search.svg
│       ├── settings.svg
│       ├── terminal.svg
│       └── version.svg
│
├── output/
├── asela.js
├── package.json
└── README.md
```

---

## <img src="assets/icons/folder.svg" width="20"> Output

Collected results can be exported locally.

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

## <img src="assets/icons/activity.svg" width="20"> Workflow

<p align="center">
  <img src="assets/workflow.svg" width="800" alt="Asela Scanner Workflow">
</p>

The scanner follows a simple pipeline:

**Input → Query → Search → Parse → Deduplicate → Output**

---

## <img src="assets/icons/shield.svg" width="20"> CAPTCHA & Rate Limits

Search providers may apply CAPTCHA challenges, rate limits or temporary restrictions when automated traffic is detected.

Asela does not guarantee that these protections will never appear.

---

## <img src="assets/icons/lock.svg" width="20"> Responsible Use

Asela Dork Scanner is intended for:

* Authorized security research
* OSINT
* Reconnaissance
* CTF environments
* Educational purposes

Only investigate targets you are authorized to assess.

The author is not responsible for misuse of the software.

---

## <img src="assets/icons/info.svg" width="20"> Project

```text
Name       Asela Dork Scanner
Version    1.0
Runtime    Node.js
API        None
Author     K7
```

<p align="center">
  <img src="assets/icons/snowflake.svg" width="16">
  <strong>ASELA</strong> · Dork Scanner
</p>
