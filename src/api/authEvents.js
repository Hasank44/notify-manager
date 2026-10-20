const listeners = new Set();

export const onAuthExpired = (callback) => {
    listeners.add(callback);
    return () => listeners.delete(callback);
};

export const emitAuthExpired = (payload = {}) => {
    for (const listener of listeners) {
        try {
            listener(payload);
        } catch {
            /* ignore listener errors — never break the auth flow */
        }
    }
};