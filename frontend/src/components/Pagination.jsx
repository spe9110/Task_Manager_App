import React from "react";
import { FaAnglesLeft, FaAngleLeft, FaAngleRight, FaAnglesRight } from "react-icons/fa6";

function Pagination({ itemCount, pageSize, currentPage, onPageChange }) {
  const pageCount = Math.ceil(itemCount / pageSize);

  if (pageCount <= 1) return null;

  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < pageCount;

  return (
    <div className="flex justify-center items-center gap-4 mt-6">
      <p>
        Page {currentPage} of {pageCount}
      </p>

      <div className="flex gap-2">
        <button
          onClick={() => onPageChange(1)}
          disabled={!canGoPrevious}
          className="bg-neutral-300 p-2 rounded disabled:opacity-50"
        >
          <FaAnglesLeft />
        </button>

        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!canGoPrevious}
          className="bg-neutral-300 p-2 rounded disabled:opacity-50"
        >
          <FaAngleLeft />
        </button>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!canGoNext}
          className="bg-neutral-300 p-2 rounded disabled:opacity-50"
        >
          <FaAngleRight />
        </button>

        <button
          onClick={() => onPageChange(pageCount)}
          disabled={!canGoNext}
          className="bg-neutral-300 p-2 rounded disabled:opacity-50"
        >
          <FaAnglesRight />
        </button>
      </div>
    </div>
  );
}

export default Pagination;
