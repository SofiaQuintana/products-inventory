export interface Product {
  _id?: string;
  title: string;
  category: string;
  brand: string;
  product_type: string;
  sku: string;
  price?: number;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ProductWithScore extends Product {
  score?: number;
}

export interface LoadResult {
  ok: boolean;
  inserted: number;
  updated: number;
  errors: number;
  totalProcessed: number;
  durationMs: number;
  docsPerSecond: number;
}

export interface SearchResult {
  q: string;
  page: number;
  limit: number;
  total: number;
  hasNext: boolean;
  results: ProductWithScore[];
  latency_ms: number;
}

export interface SuggestResult {
  q: string;
  suggestions: string[];
  latency_ms: number;
}
