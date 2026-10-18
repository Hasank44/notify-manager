import { Search, X } from "lucide-react";

const SearchBar = ({ value, onChange, placeholder = "Search…", className = "" }) => (
    <div className={`relative ${className}`}>
        <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
        <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="input pl-9 pr-9"
        />
        {value && (
            <button
                type="button"
                onClick={() => onChange("")}
                aria-label="Clear search"
                className="absolute right-2 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full text-white/40 hover:bg-white/10 hover:text-white"
            >
                <X size={14} />
            </button>
        )}
    </div>
);

export default SearchBar;