import React from 'react';
import type { Product } from '../api/client';

interface ResultListProps {
  results: Product[];
  total: number;
  query: string;
  latency: number;
}

export const ResultList: React.FC<ResultListProps> = ({ results, total, query, latency }) => {
  if (results.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-[#7CA1FF]/20 to-[#9878DD]/20 rounded-full flex items-center justify-center">
          <svg className="w-12 h-12 text-[#7CA1FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <h3 className="text-2xl font-semibold text-gray-700 mb-2">
          No se encontraron resultados
        </h3>
        <p className="text-gray-500">
          Intenta con otra búsqueda para "{query}"
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Results Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            {total.toLocaleString()} resultados
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            para "{query}" • {latency}ms
          </p>
        </div>
      </div>

      {/* Results Grid */}
      <div className="grid gap-4">
        {results.map((product) => (
          <div
            key={product._id}
            className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FF8132]/20 to-[#FF7DA0]/20 flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-[#FF8132]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      {product.title}
                    </h3>
                    {product.description && (
                      <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                        {product.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#7CA1FF]/10 text-[#7CA1FF]">
                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                    </svg>
                    {product.category}
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#9878DD]/10 text-[#9878DD]">
                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                    </svg>
                    {product.brand}
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#FF7DA0]/10 text-[#FF7DA0]">
                    {product.product_type}
                  </span>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                    </svg>
                    SKU: {product.sku}
                  </span>
                  {product.price && (
                    <span className="flex items-center gap-1 font-semibold text-[#FF8132]">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      ${product.price.toFixed(2)}
                    </span>
                  )}
                </div>
              </div>

              {product.score !== undefined && (
                <div className="flex-shrink-0">
                  <div className="bg-gradient-to-br from-[#FF8132] to-[#FF7DA0] text-white px-3 py-1 rounded-lg text-xs font-semibold">
                    Score: {product.score.toFixed(2)}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
