import {
    APPROVAL_STATUS_COLORS,
    APPROVAL_STATUS_LABELS,
    NOTIFICATION_STATUS_COLORS,
    NOTIFICATION_STATUS_LABELS,
    DELIVERY_STATUS_COLORS,
    SUBSCRIPTION_STATUS_COLORS,
} from "@/utils/constants";

/* ─────────────────────────────────────────────────────────────
 * StatusBadge
 *
 * Usage:
 *   <StatusBadge status="pending" />
 *   <StatusBadge status="pending" type="approval" />
 *   <StatusBadge status="sent" type="notification" />
 *   <StatusBadge status="sent" type="delivery" />
 *   <StatusBadge status="active" type="subscription" />
 * ───────────────────────────────────────────────────────────── */

const COLOR_MAP = {
    approval: APPROVAL_STATUS_COLORS,
    notification: NOTIFICATION_STATUS_COLORS,
    delivery: DELIVERY_STATUS_COLORS,
    subscription: SUBSCRIPTION_STATUS_COLORS,
};

const LABEL_MAP = {
    approval: APPROVAL_STATUS_LABELS,
    notification: NOTIFICATION_STATUS_LABELS,
};

const formatLabel = (status) => {
    if (!status) return "—";
    return status
        .replace(/([A-Z])/g, " $1")
        .replace(/[_-]/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .replace(/^\w/, (c) => c.toUpperCase());
};

const StatusBadge = ({ status, type = "approval", className = "" }) => {
    const colorMap = COLOR_MAP[type] ?? APPROVAL_STATUS_COLORS;
    const labelMap = LABEL_MAP[type];
    const colorClass = colorMap[status] ?? "bg-gray-500/15 text-gray-300 border-gray-500/30";
    const label = labelMap?.[status] ?? formatLabel(status);

    return (
        <span className={`badge border ${colorClass} ${className}`}>{label}</span>
    );
};

export default StatusBadge;