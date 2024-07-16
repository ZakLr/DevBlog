import Link from "next/link";
import React from "react";

interface PaginationProps {
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  totalPages: number;
  reference: React.RefObject<HTMLElement>;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  setCurrentPage,
  totalPages,
  reference
}) => {
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5; // Maximum number of visible page links

    let start = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let end = Math.min(totalPages, start + maxVisiblePages - 1);

    // Ensure 'end' does not exceed 'totalPages'
    end = Math.min(end, totalPages);

    start = Math.max(1, end - maxVisiblePages + 1);

    if (start > 1) {
      pageNumbers.push(
        <span
          key="start-ellipsis"
          className="px-2 py-1 sm:px-4 sm:py-2 mt-2 text-gray-600 rounded-lg focus:outline-none"
        >
          ...
        </span>
      );
    }

    for (let i = start; i <= end; i++) {
      pageNumbers.push(
        <button
          key={i}
          className={`${
            i === currentPage
              ? "ring ring-primary bg-primary/20 px-2 py-1 sm:px-4 sm:py-2 ml-1 mt-2 text-gray-600 border rounded-lg focus:outline-none"
              : "hover:bg-gray-100 px-2 py-1 sm:px-4 sm:py-2 ml-1 mt-2 text-gray-600 border rounded-lg focus:outline-none"
          }`}
          onClick={() => {
            setCurrentPage(i); 
            if (reference.current) {
              reference.current.scrollIntoView({ behavior: "smooth", block:'center' });
            }
          }}
        >
          {i}
        </button>
      );
    }

    if (end < totalPages) {
      pageNumbers.push(
        <span
          key="end-ellipsis"
          className="px-2 py-1 sm:px-4 sm:py-2 mt-2 text-gray-600 rounded-lg focus:outline-none"
        >
          ...
        </span>
      );
    }

    return pageNumbers;
  };

  return (
    <div className="flex justify-center mt-10 space-x-2 ">
      {getPageNumbers()}
      {currentPage < totalPages && (
        <button
          className="px-2 py-1 sm:px-4 sm:py-2 mt-2 text-gray-600 border rounded-lg hover:bg-gray-100 focus:outline-none"
          onClick={() => {
            setCurrentPage((prev) => Math.min(prev + 1, totalPages));
            console.log(reference);
            
          }}
        >
          <svg
            className="h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      )}
    </div>
  );
};

export default Pagination;
