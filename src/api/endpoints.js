export const ENDPOINTS = {
    /* ─── Auth ──────────────────────────────────────────── */
    auth: {
        register: "/user/auth/register",
        login: "/user/auth/login",
        refresh: "/user/auth/refresh",
        me: "/user/auth/me",
        profile: "/user/auth/profile",
        changePassword: "/user/auth/password",
        logout: "/user/auth/logout",
    },

    /* ─── Dashboard ─────────────────────────────────────── */
    dashboard: "/user/dashboard",

    /* ─── Notification Types (read-only) ────────────────── */
    notificationTypes: {
        list: "/user/notification-types",
    },

    /* ─── Package Subscription (upgrade requests) ───────── */
    subscriptions: {
        list: "/user/subscriptions",
        create: "/user/subscriptions",
    },

    /* ─── Packages (public pricing) ─────────────────────── */
    packages: {
        list: "/user/packages",
    },

    /* ─── Approvals (view own pending) ──────────────────── */
    approvals: {
        list: "/user/approvals",
    },

    /* ─── Domains ───────────────────────────────────────── */
    domains: {
        list: "/user/domains",
        create: "/user/domains",
        detail: (id) => `/user/domains/${id}`,
        update: (id) => `/user/domains/${id}`,
        remove: (id) => `/user/domains/${id}`,
        // API Keys
        keys: {
            list: (domainId) => `/user/domains/${domainId}/keys`,
            create: (domainId) => `/user/domains/${domainId}/keys`,
            update: (domainId, keyId) => `/user/domains/${domainId}/keys/${keyId}`,
            rotate: (domainId, keyId) => `/user/domains/${domainId}/keys/${keyId}/rotate`,
            revoke: (domainId, keyId) => `/user/domains/${domainId}/keys/${keyId}/revoke`,
        },
    },
    systemBot: "/user/system-bot",
    /* ─── Bots ──────────────────────────────────────────── */
    bots: {
        list: "/user/bots",
        create: "/user/bots",
        detail: (id) => `/user/bots/${id}`,
        update: (id) => `/user/bots/${id}`,
        remove: (id) => `/user/bots/${id}`,
    },

    /* ─── Destinations ──────────────────────────────────── */
    destinations: {
        list: "/user/destinations",
        create: "/user/destinations",
        detail: (id) => `/user/destinations/${id}`,
        update: (id) => `/user/destinations/${id}`,
        remove: (id) => `/user/destinations/${id}`,
    },

    /* ─── Routes ────────────────────────────────────────── */
    routes: {
        list: "/user/routes",
        create: "/user/routes",
        detail: (id) => `/user/routes/${id}`,
        update: (id) => `/user/routes/${id}`,
        remove: (id) => `/user/routes/${id}`,
    },

    /* ─── B2C User Subscriptions ────────────────────────── */
    userSubscriptions: {
        list: "/user/user-subscriptions",
        create: "/user/user-subscriptions",
        bulk: "/user/user-subscriptions/bulk",
        detail: (id) => `/user/user-subscriptions/${id}`,
        update: (id) => `/user/user-subscriptions/${id}`,
        remove: (id) => `/user/user-subscriptions/${id}`,
    },

    /* ─── Notifications (own history) ───────────────────── */
    notifications: {
        list: "/user/notifications",
        detail: (id) => `/user/notifications/${id}`,
        deliveries: (id) => `/user/notifications/${id}/deliveries`,
    },
};

export default ENDPOINTS;