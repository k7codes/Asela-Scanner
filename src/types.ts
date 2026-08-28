export interface SearchResultItem {
  rank: number;
  page: number;
  title: string;
  url: string;
  domain: string;
  snippet?: string;
}

export interface PageScanDetail {
  pageNumber: number;
  searchUrl: string;
  urlsFound: number;
  status: 'success' | 'warning' | 'error';
}

export interface DomainStat {
  domain: string;
  count: number;
  percentage: number;
}

export interface SearchResponse {
  keyword: string;
  searchUrl: string;
  totalCount: number;
  requestedPages: number;
  scannedPages: number;
  results: SearchResultItem[];
  pageDetails: PageScanDetail[];
  domainStats: DomainStat[];
  timestamp: string;
  executionTimeMs?: number;
  logs: string[];
}

export interface SearchHistoryItem {
  id: string;
  keyword: string;
  timestamp: string;
  totalCount: number;
  scannedPages: number;
  results?: SearchResultItem[];
}

