import { useEffect, useState } from "react";

/* ─────────────────────────────────────────────────────────────
 * Debounce a value — useful for search inputs.
 * Usage: const debounced = useDebounce(searchText, 300);
 * ───────────────────────────────────────────────────────────── */
const useDebounce = (value, delay = 300) => {
    const [debounced, setDebounced] = useState(value);

    useEffect(() => {
        const timer = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(timer);
    }, [value, delay]);

    return debounced;
};

export default useDebounce;