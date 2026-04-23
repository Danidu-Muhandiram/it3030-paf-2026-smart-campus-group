import React from 'react';

const WINDOW = 2; // pages visible on each side of the current page

/**
 * Generic pagination bar.
 * Only rendered when totalPages > 1.
 */
export const CataloguePagination = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;

    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
        <div className="flex items-center justify-center gap-1 pt-2 flex-wrap">
            <button
                disabled={currentPage === 1}
                onClick={() => onPageChange(currentPage - 1)}
                className="px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm rounded-lg border border-gray-200 text-text-muted hover:border-primary hover:text-primary disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
                ‹ Prev
            </button>

            {pages.map((page) => {
                const distanceFromCurrent = Math.abs(page - currentPage);
                const isEdge    = page === 1 || page === totalPages;
                const isVisible = isEdge || distanceFromCurrent <= WINDOW;
                const isEllipsisSlot =
                    !isVisible &&
                    totalPages > 7 &&
                    (page === currentPage - WINDOW - 1 || page === currentPage + WINDOW + 1);

                if (isEllipsisSlot) {
                    return <span key={page} className="px-1 text-text-muted text-sm select-none">…</span>;
                }
                if (!isVisible) return null;

                return (
                    <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        className={`w-7 h-7 sm:w-8 sm:h-8 text-xs sm:text-sm rounded-lg border transition-colors ${
                            currentPage === page
                                ? 'bg-primary text-white border-primary font-semibold'
                                : 'border-gray-200 text-text-muted hover:border-primary hover:text-primary'
                        }`}
                    >
                        {page}
                    </button>
                );
            })}

            <button
                disabled={currentPage === totalPages}
                onClick={() => onPageChange(currentPage + 1)}
                className="px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm rounded-lg border border-gray-200 text-text-muted hover:border-primary hover:text-primary disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
                Next ›
            </button>
        </div>
    );
};
