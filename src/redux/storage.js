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