/* ─── Roles ─── */
export const ROLES = {
    USER: "user",
};

/* ─── Approval status ─── */
export const APPROVAL_STATUS = {
    PENDING: "pending",
    APPROVED: "approved",
    REJECTED: "rejected",
    SUSPENDED: "suspended",
};

export const APPROVAL_STATUS_LABELS = {
    pending: "Pending",
    approved: "Approved",
    rejected: "Rejected",
    suspended: "Suspended",
};

export const APPROVAL_STATUS_COLORS = {
    pending: "bg-amber-500/15 text-amber-300 border-amber-500/30",
    approved: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
    rejected: "bg-red-500/15 text-red-300 border-red-500/30",
    suspended: "bg-gray-500/15 text-gray-300 border-gray-500/30",
};

/* ─── Resource types ─── */
export const RESOURCE_TYPES = {
    DOMAIN: "domain",
    BOT: "bot",
    DESTINATION: "destination",
    ROUTE: "route",
};

export const RESOURCE_TYPE_LABELS = {
    domain: "Domain",
    bot: "Telegram Bot",
    destination: "Destination",
    route: "Route",
};

/* ─── Destination types ─── */
export const DESTINATION_TYPES = [
    "user",
    "group",
    "channel",
    "bot",
    "user_dynamic",
    "user_dynamic_broadcast",
];

export const STATIC_DESTINATION_TYPES = ["user", "group", "channel", "bot"];
export const DYNAMIC_DESTINATION_TYPES = ["user_dynamic", "user_dynamic_broadcast"];

export const DESTINATION_TYPE_LABELS = {
    user: "User",
    group: "Group",
    channel: "Channel",
    bot: "Bot",
    user_dynamic: "Dynamic User",
    user_dynamic_broadcast: "Dynamic Broadcast",
};

/* ─── Notification status ─── */
export const NOTIFICATION_STATUS = {
    PENDING: "pending",
    PROCESSING: "processing",
    SENT: "sent",
    PARTIAL: "partial",
    FAILED: "failed",
    NO_ROUTE: "noRoute",
    BLOCKED: "blocked",
};

export const NOTIFICATION_STATUS_LABELS = {
    pending: "Pending",
    processing: "Processing",
    sent: "Sent",
    partial: "Partial",
    failed: "Failed",
    noRoute: "No Route",
    blocked: "Blocked",
};

export const NOTIFICATION_STATUS_COLORS = {
    pending: "bg-gray-500/15 text-gray-300 border-gray-500/30",
    processing: "bg-blue-500/15 text-blue-300 border-blue-500/30",
    sent: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
    partial: "bg-amber-500/15 text-amber-300 border-amber-500/30",
    failed: "bg-red-500/15 text-red-300 border-red-500/30",
    noRoute: "bg-purple-500/15 text-purple-300 border-purple-500/30",
    blocked: "bg-red-500/15 text-red-300 border-red-500/30",
};

/* ─── Delivery status ─── */
export const DELIVERY_STATUS_COLORS = {
    pending: "bg-gray-500/15 text-gray-300 border-gray-500/30",
    sent: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
    failed: "bg-red-500/15 text-red-300 border-red-500/30",
    skipped: "bg-gray-500/15 text-gray-400 border-gray-500/30",
};

/* ─── Subscription status ─── */
export const SUBSCRIPTION_STATUS = {
    PENDING: "pending",
    ACTIVE: "active",
    EXPIRED: "expired",
    REJECTED: "rejected",
    CANCELLED: "cancelled",
};

export const SUBSCRIPTION_STATUS_COLORS = {
    pending: "bg-amber-500/15 text-amber-300 border-amber-500/30",
    active: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
    expired: "bg-gray-500/15 text-gray-300 border-gray-500/30",
    rejected: "bg-red-500/15 text-red-300 border-red-500/30",
    cancelled: "bg-gray-500/15 text-gray-400 border-gray-500/30",
};

/* ─── Pagination ─── */
export const PAGE_SIZES = [10, 20, 50, 100];
export const DEFAULT_PAGE_SIZE = 20;