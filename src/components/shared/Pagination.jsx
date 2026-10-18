import { ChevronLeft, ChevronRight } from "lucide-react";

const buildPageNumbers = (page, totalPages, maxButtons = 5) => {
    if (totalPages <= maxButtons) {
        return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const half = Math.floor(maxButtons / 2);
    let start = Math.max(1, page - half);
    let end = Math.min(totalPages, start + maxButtons - 1);

    if (end - start + 1 < maxButtons) {
        start = Math.max(1, end - maxButtons + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
};

const Pagination = ({
    page = 1,
    limit = 20,
    total = 0,
    onPageChange,
    className = "",
}) => {
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const from = total === 0 ? 0 : (page - 1) * limit + 1;
    const to = Math.min(page * limit, total);
    const pages = buildPageNumbers(page, totalPages);

    if (total === 0) return null;

    return (
        <div
            className={`rounded-b-lg border border-white/10 bg-[#0B1220] p-3 flex flex-col items-center justify-between gap-3 sm:flex-row ${className}`}
        >
            <p className="text-xs text-muted">
                Showing <span className="text-gray-100">{from}</span>–
                <span className="text-gray-100">{to}</span> of{" "}
                <span className="text-gray-100">{total}</span>
            </p>
            <div className="flex items-center gap-1">
                <button
                    type="button"
                    onClick={() => onPageChange(page - 1)}
                    disabled={page <= 1}
                    className="btn-secondary btn-sm"
                    aria-label="Previous page"
                >
                    <ChevronLeft size={14} />
                </button>
                {pages[0] > 1 && (
                    <>
                        <button
                            type="button"
                            onClick={() => onPageChange(1)}
                            className="btn-secondary btn-sm min-w-[2rem]"
                        >
                            1
                        </button>
                        {pages[0] > 2 && <span className="px-1 text-white/40">…</span>}
                    </>
                )}
                {pages.map((p) => (
                    <button
                        key={p}
                        type="button"
                        onClick={() => onPageChange(p)}
                        className={`btn-sm min-w-[2rem] rounded-lg border px-3 py-1.5 text-xs font-medium transition ${p === page
                                ? "border-indigo-500/50 bg-indigo-500/20 text-indigo-300"
                                : "border-white/10 bg-white/5 text-gray-100 hover:bg-white/10"
                            }`}
                    >
                        {p}
                    </button>
                ))}
                {pages[pages.length - 1] < totalPages && (
                    <>
                        {pages[pages.length - 1] < totalPages - 1 && (<span className="px-1 text-white/40">…</span>)}
                        <button
                            type="button"
                            onClick={() => onPageChange(totalPages)}
                            className="btn-secondary btn-sm min-w-[2rem]"
                        >
                            {totalPages}
                        </button>
                    </>
                )}
                <button
                    type="button"
                    onClick={() => onPageChange(page + 1)}
                    disabled={page >= totalPages}
                    className="btn-secondary btn-sm"
                    aria-label="Next page"
                >
                    <ChevronRight size={14} />
                </button>
            </div>
        </div>
    );
};

export default Pagination;