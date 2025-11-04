import { useState, useEffect } from 'react';
import { SearchBar } from '../components/SearchBar';
import { ResultList } from '../components/ResultList';
import { Pagination } from '../components/Pagination';
import { searchProducts } from '../api/client';
import type { SearchResponse } from '../api/client';

const ITEMS_PER_PAGE = 20;

export const Home = () => {
  const [query, setQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [searchData, setSearchData] = useState<SearchResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const performSearch = async (searchQuery: string, page: number) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await searchProducts(searchQuery, page, ITEMS_PER_PAGE);
      setSearchData(data);
      setHasSearched(true);
    } catch (err) {
      setError('Error al realizar la búsqueda. Por favor intenta de nuevo.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (newQuery: string) => {
    setQuery(newQuery);
    setCurrentPage(0);
    performSearch(newQuery, 0);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    performSearch(query, newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    document.title = hasSearched 
      ? `${query} - Products Search` 
      : 'Products Search - Sistema de Búsqueda';
  }, [query, hasSearched]);

  const totalPages = searchData ? Math.ceil(searchData.total / ITEMS_PER_PAGE) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FF8132] to-[#FF7DA0] flex items-center justify-center">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Products Search</h1>
              <p className="text-sm text-gray-500">Sistema de búsqueda inteligente</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Section */}
        <div className={`transition-all duration-500 ${hasSearched ? 'mb-8' : 'mb-16 mt-24'}`}>
          {!hasSearched && (
            <div className="text-center mb-12">
              <h2 className="text-5xl font-bold text-gray-800 mb-4">
                Encuentra lo que buscas
              </h2>
              <p className="text-xl text-gray-600">
                Búsqueda inteligente con precedencia por título, categoría, marca, SKU y tipo
              </p>
            </div>
          )}
          
          <SearchBar 
            onSearch={handleSearch} 
            initialQuery={query}
            isLoading={isLoading}
          />

          {/* Info Cards */}
          {!hasSearched && (
            <div className="grid md:grid-cols-3 gap-6 mt-12">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="w-12 h-12 rounded-xl bg-[#7CA1FF]/10 flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-[#7CA1FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">Búsqueda Rápida</h3>
                <p className="text-sm text-gray-600">Resultados instantáneos con cache inteligente de Redis</p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="w-12 h-12 rounded-xl bg-[#9878DD]/10 flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-[#9878DD]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">Relevancia Inteligente</h3>
                <p className="text-sm text-gray-600">Ordenamiento por score con pesos configurables</p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="w-12 h-12 rounded-xl bg-[#FF8132]/10 flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-[#FF8132]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">Millones de Productos</h3>
                <p className="text-sm text-gray-600">Escalable con MongoDB y índices optimizados</p>
              </div>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-4 mb-6">
            <div className="flex items-center gap-3">
              <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-800 font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Loading Skeleton */}
        {isLoading && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm animate-pulse">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
                  <div className="flex-1">
                    <div className="h-6 bg-gray-200 rounded-lg w-3/4 mb-3"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
                    <div className="flex gap-2">
                      <div className="h-6 bg-gray-200 rounded-full w-20"></div>
                      <div className="h-6 bg-gray-200 rounded-full w-24"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Results */}
        {!isLoading && searchData && (
          <>
            <ResultList 
              results={searchData.results}
              total={searchData.total}
              query={searchData.q}
              latency={searchData.latency_ms}
            />

            {searchData.total > ITEMS_PER_PAGE && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                hasNext={searchData.hasNext}
                onPageChange={handlePageChange}
                isLoading={isLoading}
              />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-16 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-gray-600 text-sm">
            <p>Sistema de Indexación de Productos • MongoDB + Redis + React</p>
            <p className="mt-1 text-gray-400">Proyecto 2 - Base de Datos 2</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
