/* ─────────────────────────────────────────────────────────────
 * Custom storage engine for redux-persist.
 *
 * Why custom?
 *   `redux-persist/lib/storage` sometimes resolves incorrectly
 *   under Vite (returns the module object instead of the storage
 *   engine). This custom implementation talks directly to
 *   `window.localStorage` and works everywhere — Vite, Next.js,
 *   SSR, tests.
 *
 * API: { getItem, setItem, removeItem } → all return Promises.
 * ───────────────────────────────────────────────────────────── */

const noopStorage = {
    getItem: () => Promise.resolve(null),
    setItem: () => Promise.resolve(),
    removeItem: () => Promise.resolve(),
};

const createLocalStorage = () => {
    if (typeof window === "undefined" || !window.localStorage) {
        return noopStorage;
    }

    return {
        getItem: (key) => {
            try {
                return Promise.resolve(window.localStorage.getItem(key));
            } catch {
                return Promise.resolve(null);
            }
        },
        setItem: (key, value) => {
            try {
                window.localStorage.setItem(key, value);
                return Promise.resolve(value);
            } catch {
                return Promise.resolve(value);
            }
        },
        removeItem: (key) => {
            try {
                window.localStorage.removeItem(key);
                return Promise.resolve();
            } catch {
                return Promise.resolve();
            }
        },
    };
};

const storage = createLocalStorage();

export default storage;