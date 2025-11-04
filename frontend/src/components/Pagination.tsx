import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  hasNext: boolean;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  hasNext,
  onPageChange,
  isLoading = false
}) => {
  const canGoPrevious = currentPage > 0;
  const canGoNext = hasNext;

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 0; i < totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage < 3) {
        for (let i = 0; i < 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages - 1);
      } else if (currentPage > totalPages - 4) {
        pages.push(0);
        pages.push('...');
        for (let i = totalPages - 4; i < totalPages; i++) pages.push(i);
      } else {
        pages.push(0);
        pages.push('...');
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push('...');
        pages.push(totalPages - 1);
      }
    }
    
    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!canGoPrevious || isLoading}
        className="px-4 py-2 rounded-xl border-2 border-gray-200 hover:border-[#7CA1FF] hover:bg-[#7CA1FF]/5 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium text-gray-700"
        aria-label="Página anterior"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <div className="flex items-center gap-1">
        {getPageNumbers().map((page, index) => (
          typeof page === 'number' ? (
            <button
              key={index}
              onClick={() => onPageChange(page)}
              disabled={isLoading}
              className={`px-4 py-2 rounded-xl font-medium transition-all ${
                page === currentPage
                  ? 'bg-gradient-to-r from-[#7CA1FF] to-[#9878DD] text-white shadow-lg'
                  : 'border-2 border-gray-200 hover:border-[#7CA1FF] hover:bg-[#7CA1FF]/5 text-gray-700'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {page + 1}
            </button>
          ) : (
            <span key={index} className="px-2 text-gray-400">
              {page}
            </span>
          )
        ))}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!canGoNext || isLoading}
        className="px-4 py-2 rounded-xl border-2 border-gray-200 hover:border-[#7CA1FF] hover:bg-[#7CA1FF]/5 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium text-gray-700"
        aria-label="Página siguiente"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
};
