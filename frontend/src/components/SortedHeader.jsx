import React from "react";
import { FaArrowUpLong, FaArrowDownLong } from "react-icons/fa6";
import { useSearchParams } from "react-router-dom";

function SortedHeader({ label, field }) {
  const [searchParams, setSearchParams] = useSearchParams();

  const currentSort = searchParams.get("sort");
  const currentOrder = searchParams.get("order") || "desc";

  const handleSort = () => {
    const params = new URLSearchParams(searchParams);

    let newOrder = "asc";

    // If already sorting this column ASC → switch to DESC
    if (currentSort === field && currentOrder === "asc") {
      newOrder = "desc";
    }

    params.set("sort", field);
    params.set("order", newOrder);
    params.set("page", 1); // Reset to first page when sorting

    setSearchParams(params);
  };

  return (
    <button
      type="button"
      onClick={handleSort}
      className="flex items-center gap-1"
    >
      {label}

      {currentSort === field && (
        <span>
          {currentOrder === "asc" ? (
            <FaArrowUpLong size={12} />
          ) : (
            <FaArrowDownLong size={12} />
          )}
        </span>
      )}
    </button>
  );
}

export default SortedHeader;
