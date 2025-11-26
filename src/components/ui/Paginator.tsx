import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginatorProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Paginator: React.FC<PaginatorProps> = ({ currentPage, totalPages, onPageChange }) => {
    
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav aria-label="Page navigation" className="flex justify-center mt-8">
      <ul className="flex items-center gap-2 select-none">
        
        {/* Previous Button */}
        <li>
          <button
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
            className={`flex items-center justify-center w-10 h-10 rounded-lg border border-gray-300 bg-white font-medium text-sm transition-all duration-200
              ${
                currentPage === 1
                  ? "opacity-50 cursor-not-allowed text-gray-400"
                  : "hover:border-primary hover:text-primary text-gray-700 cursor-pointer"
              }`}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        </li>

        {/* Page Numbers */}
        {pages.map((page) => (
          <li key={page}>
            <button
              onClick={() => onPageChange(page)}
              className={`flex items-center justify-center w-10 h-10 rounded-lg border font-medium text-sm transition-all duration-200 cursor-pointer
                ${
                  currentPage === page
                    ? "bg-primary text-white border-primary"
                    : "bg-white text-gray-700 border-gray-300 hover:border-primary hover:text-primary"
                }`}
            >
              {page}
            </button>
          </li>
        ))}

        {/* Next Button */}
        <li>
          <button
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(currentPage + 1)}
            className={`flex items-center justify-center w-10 h-10 rounded-lg border border-gray-300 bg-white font-medium text-sm transition-all duration-200
              ${
                currentPage === totalPages
                  ? "opacity-50 cursor-not-allowed text-gray-400"
                  : "hover:border-primary hover:text-primary text-gray-700 cursor-pointer"
              }`}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </li>

      </ul>
    </nav>
  );
};

export default Paginator;
