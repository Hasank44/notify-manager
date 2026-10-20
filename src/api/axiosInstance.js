import axios from "axios";
import { toast } from "sonner";
import { emitAuthExpired } from "./authEvents";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1";

const TOKEN_KEY = "accessToken";
const REFRESH_KEY = "refreshToken";

export const authStorage = {
    getAccessToken: () => localStorage.getItem(TOKEN_KEY),
    getRefreshToken: () => localStorage.getItem(REFRESH_KEY),
    setTokens: ({ accessToken, refreshToken }) => {
        if (accessToken) localStorage.setItem(TOKEN_KEY, accessToken);
        if (refreshToken) localStorage.setItem(REFRESH_KEY, refreshToken);
    },
    clear: () => {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(REFRESH_KEY);
    },
};

const AUTH_FAILURE_CODES = new Set([
    "UNAUTHORIZED",
    "TOKEN_INVALID",
    "TOKEN_EXPIRED",
    "INVALID_CREDENTIALS",
    "ACCOUNT_INACTIVE",
    "ACCOUNT_LOCKED",
    "ACCOUNT_DELETED",
]);

let handlingAuthFailure = false;

const handleAuthFailure = (code = "UNAUTHORIZED") => {
    if (handlingAuthFailure) return;
    handlingAuthFailure = true;
    authStorage.clear();
    emitAuthExpired({ code });
    setTimeout(() => {
        handlingAuthFailure = false;
    }, 100);
};

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 20000,
    headers: { "Content-Type": "application/json" },
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = authStorage.getAccessToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

let isRefreshing = false;
let refreshSubscribers = [];
const subscribeToRefresh = (cb) => refreshSubscribers.push(cb);
const onRefreshSuccess = (token) => {
    refreshSubscribers.forEach((cb) => cb(token));
    refreshSubscribers = [];
};
const onRefreshFailure = () => {
    refreshSubscribers = [];
};

const performRefresh = async () => {
    const refreshToken = authStorage.getRefreshToken();
    if (!refreshToken) throw new Error("No refresh token");
    const response = await axios.post(
        `${BASE_URL}/user/auth/refresh`,
        { refreshToken },
        { headers: { "Content-Type": "application/json" } }
    );
    const payload = response?.data?.data;
    if (!payload?.accessToken) throw new Error("Refresh failed");
    authStorage.setTokens({
        accessToken: payload.accessToken,
        refreshToken: payload.refreshToken,
    });

    return payload.accessToken;
};

axiosInstance.interceptors.response.use(
    (response) => {
        const body = response?.data;
        if (body && typeof body === "object" && "success" in body) {
            if (body.success === false) {
                const err = new Error(body.message || "Request failed");
                err.code = body.code;
                err.requestId = body.requestId;
                err.details = body.details;
                err.response = response;
                return Promise.reject(err);
            }
            return body;
        };
        return body;
    },

    async (error) => {
        const original = error.config;
        const status = error?.response?.status;
        const payload = error?.response?.data;
        const code = payload?.code;
        const message = payload?.message || error?.message;
        const isAuthEndpoint =
            original?.url?.includes("/auth/login") ||
            original?.url?.includes("/auth/register") ||
            original?.url?.includes("/auth/refresh");

        if (status === 401 && !original?._retry && !isAuthEndpoint && authStorage.getRefreshToken()) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    subscribeToRefresh((newToken) => {
                        if (!newToken) {
                            reject(error);
                            return;
                        }
                        original.headers.Authorization = `Bearer ${newToken}`;
                        resolve(axiosInstance(original));
                    });
                });
            };
            original._retry = true;
            isRefreshing = true;
            try {
                const newToken = await performRefresh();
                isRefreshing = false;
                onRefreshSuccess(newToken);
                original.headers.Authorization = `Bearer ${newToken}`;
                return axiosInstance(original);
            } catch (refreshErr) {
                isRefreshing = false;
                onRefreshFailure();
                handleAuthFailure(code || "TOKEN_INVALID");
                return Promise.reject(refreshErr);
            }
        };
        if (code && AUTH_FAILURE_CODES.has(code) && !isAuthEndpoint) {
            handleAuthFailure(code);
        };
        const friendlyError = new Error(message || "Something went wrong");
        friendlyError.status = status;
        friendlyError.code = code;
        friendlyError.requestId = payload?.requestId;
        friendlyError.details = payload?.details;
        friendlyError.response = error.response;

        const shouldToast = status !== 401 && !AUTH_FAILURE_CODES.has(code) && !isAuthEndpoint;
        if (shouldToast) {
            if (status === 429) {
                toast.error("Too many requests. Please slow down.");
            } else if (status >= 500) {
                toast.error("Server error. Please try again.");
            } else if (message) {
                toast.error(message);
            }
        };
        return Promise.reject(friendlyError);
    }
);

export default axiosInstance;