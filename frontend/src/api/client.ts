const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export interface Product {
  _id: string;
  title: string;
  category: string;
  brand: string;
  product_type: string;
  sku: string;
  price?: number;
  description?: string;
  score?: number;
}

export interface SearchResponse {
  q: string;
  page: number;
  limit: number;
  total: number;
  hasNext: boolean;
  results: Product[];
  latency_ms: number;
}

export interface SuggestResponse {
  q: string;
  suggestions: string[];
  latency_ms: number;
}

export const searchProducts = async (
  query: string,
  page: number = 0,
  limit: number = 20
): Promise<SearchResponse> => {
  const response = await fetch(
    `${API_URL}/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`
  );
  
  if (!response.ok) {
    throw new Error('Error en la búsqueda');
  }
  
  return response.json();
};

export const getSuggestions = async (query: string): Promise<SuggestResponse> => {
  if (!query || query.trim().length === 0) {
    return { q: query, suggestions: [], latency_ms: 0 };
  }
  
  const response = await fetch(
    `${API_URL}/suggest?q=${encodeURIComponent(query)}`
  );
  
  if (!response.ok) {
    throw new Error('Error obteniendo sugerencias');
  }
  
  return response.json();
};
