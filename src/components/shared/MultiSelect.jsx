import { useEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronDown, Search, X } from "lucide-react";
import StatusBadge from "./StatusBadge";

const MultiSelect = ({
    options = [],
    values = [],
    onChange,
    placeholder = "Select…",
    searchable = true,
    loading = false,
    emptyText = "No options available",
}) => {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const containerRef = useRef(null);
    useEffect(() => {
        const handler = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        if (!open) setQuery("");
    }, [open]);

    const filteredOptions = useMemo(() => {
        if (!query.trim()) return options;
        const q = query.trim().toLowerCase();
        return options.filter(
            (o) =>
                o.label.toLowerCase().includes(q) ||
                (o.sublabel ?? "").toLowerCase().includes(q)
        );
    }, [options, query]);

    const toggle = (value) => {
        if (values.includes(value)) {
            onChange(values.filter((v) => v !== value));
        } else {
            onChange([...values, value]);
        }
    };

    const clearAll = () => onChange([]);
    const selectAll = () => {
        const enabled = options.filter((o) => !o.disabled).map((o) => o.value);
        onChange(enabled);
    };
    const selectedOptions = options.filter((o) => values.includes(o.value));
    const isEmpty = values.length === 0;

    return (
        <div ref={containerRef} className="relative">
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="input flex min-h-[38px] w-full items-center justify-between gap-2 text-left"
            >
                <span className="min-w-0 flex-1 truncate">
                    {isEmpty ? (
                        <span className="text-white/30">{placeholder}</span>
                    ) : (
                        <span className="text-gray-100">
                            {values.length} selected
                        </span>
                    )}
                </span>
                <ChevronDown
                    size={14}
                    className={`flex-shrink-0 text-white/50 transition-transform ${open ? "rotate-180" : ""}`}
                />
            </button>
            {!open && !isEmpty && (
                <div className="mt-1.5 flex flex-wrap gap-1">
                    {selectedOptions.slice(0, 3).map((o) => (
                        <span
                            key={o.value}
                            className="inline-flex items-center gap-1 rounded border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] text-gray-200"
                        >
                            {o.label}
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    toggle(o.value);
                                }}
                                className="text-white/40 hover:text-white"
                                aria-label={`Remove ${o.label}`}
                            >
                                <X size={10} />
                            </button>
                        </span>
                    ))}
                    {selectedOptions.length > 3 && (
                        <span className="text-[11px] text-white/40">
                            + {selectedOptions.length - 3} more
                        </span>
                    )}
                </div>
            )}

            {open && (
                <div className="absolute z-30 mt-1 w-full animate-fade-in overflow-hidden rounded-lg border border-white/10 bg-[#0B1220] shadow-2xl">
                    {searchable && options.length > 5 && (
                        <div className="border-b border-white/5 p-2">
                            <div className="relative">
                                <Search
                                    size={12}
                                    className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-white/40"
                                />
                                <input
                                    type="text"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Search…"
                                    className="w-full rounded border border-white/10 bg-[#0B1220] py-1.5 pl-7 pr-2 text-xs text-gray-100 placeholder:text-white/30 focus:border-indigo-500/50 focus:outline-none"
                                />
                            </div>
                        </div>
                    )}
                    <div className="flex items-center justify-between border-b border-white/5 px-2 py-1.5 text-[11px] text-white/40">
                        <span>
                            {values.length} of {options.length} selected
                        </span>
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={selectAll}
                                className="text-indigo-400 hover:text-indigo-300"
                            >
                                All
                            </button>
                            <button
                                type="button"
                                onClick={clearAll}
                                className="text-red-400 hover:text-red-300"
                            >
                                Clear
                            </button>
                        </div>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                        {loading && (
                            <div className="flex items-center justify-center p-3">
                                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-indigo-400" />
                            </div>
                        )}

                        {!loading && filteredOptions.length === 0 && (
                            <div className="p-4 text-center text-xs text-white/40">
                                {emptyText}
                            </div>
                        )}

                        {!loading &&
                            filteredOptions.map((opt) => {
                                const selected = values.includes(opt.value);
                                return (
                                    <button
                                        key={opt.value}
                                        type="button"
                                        onClick={() => !opt.disabled && toggle(opt.value)}
                                        disabled={opt.disabled}
                                        className={`flex w-full items-start gap-2 border-t border-white/[0.03] px-2.5 py-2 text-left transition hover:bg-white/5 ${opt.disabled ? "cursor-not-allowed opacity-50" : ""
                                            }`}
                                    >
                                        <div
                                            className={`mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded border ${selected
                                                    ? "border-indigo-500 bg-indigo-500"
                                                    : "border-white/20 bg-transparent"
                                                }`}
                                        >
                                            {selected && <Check size={10} className="text-white" />}
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center gap-1.5">
                                                <p className="truncate text-xs font-medium text-gray-100">
                                                    {opt.label}
                                                </p>
                                                {opt.badge && (
                                                    <StatusBadge
                                                        status={opt.badge}
                                                        type={opt.badgeType ?? "approval"}
                                                    />
                                                )}
                                            </div>
                                            {opt.sublabel && (
                                                <p className="truncate text-[10px] text-white/40">
                                                    {opt.sublabel}
                                                </p>
                                            )}
                                        </div>
                                    </button>
                                );
                            })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default MultiSelect;