import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  current: number;
  total: number;
  pageSize: number;
  onChange: (page: number) => void;
}

export default function Pagination({ current, total, pageSize, onChange }: PaginationProps) {
  const totalPages = Math.ceil(total / pageSize);

  if (totalPages <= 1) {
    return null;
  }

  const pages: (number | string)[] = [];
  const showPages = 5;
  
  let start = Math.max(1, current - Math.floor(showPages / 2));
  let end = Math.min(totalPages, start + showPages - 1);
  
  if (end - start + 1 < showPages) {
    start = Math.max(1, end - showPages + 1);
  }

  if (start > 1) {
    pages.push(1);
    if (start > 2) {
      pages.push('...');
    }
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (end < totalPages) {
    if (end < totalPages - 1) {
      pages.push('...');
    }
    pages.push(totalPages);
  }

  return (
    <div className="flex items-center justify-between px-6 py-4 bg-white rounded-xl shadow-sm mt-4">
      <div className="text-sm text-gray-500">
        共 {total} 条记录，第 {current}/{totalPages} 页
      </div>
      
      <div className="flex items-center space-x-1">
        <button
          onClick={() => onChange(current - 1)}
          disabled={current <= 1}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        
        {pages.map((page, index) => (
          page === '...' ? (
            <span key={`ellipsis-${index}`} className="px-2 text-gray-400">
              ...
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onChange(page as number)}
              className={`w-8 h-8 rounded-lg transition-colors ${
                current === page
                  ? 'bg-primary text-white'
                  : 'hover:bg-gray-100 text-gray-700'
              }`}
            >
              {page}
            </button>
          )
        ))}
        
        <button
          onClick={() => onChange(current + 1)}
          disabled={current >= totalPages}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
