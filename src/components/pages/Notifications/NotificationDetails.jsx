import { createPortal } from "react-dom";
import { Copy, X } from "lucide-react";
import { toast } from "sonner";
import StatusBadge from "../../shared/StatusBadge";
import { formatDateTime, formatRelative } from "@/utils/formatDate";

const HIDDEN_DATA_FIELDS = new Set([
    "_id",
    "__v",
    "createdAt",
    "updatedAt",
    "domainId",
    "notificationTypeId",
]);

const NotificationDetails = ({ open, notification, onClose }) => {
    if (!open || !notification) return null;

    const handleCopyId = () => {
        navigator.clipboard.writeText(notification.requestId).then(() => {
            toast.success("Request ID copied");
        });
    };

    const data = notification.data ?? {};
    const dataEntries = Object.entries(data).filter(
        ([k]) => !HIDDEN_DATA_FIELDS.has(k)
    );

    const deliveries = notification.deliveries ?? [];

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-6">
            <div
                className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                onClick={onClose}
            />

            <div className="relative z-10 w-full max-w-2xl animate-fade-in">
                <div className="card max-h-[90vh] overflow-y-auto">
                    <button
                        type="button"
                        onClick={onClose}
                        className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full text-white/40 hover:bg-white/10 hover:text-white"
                        aria-label="Close"
                    >
                        <X size={16} />
                    </button>

                    <div className="mb-4 pr-8">
                        <div className="flex items-center gap-2">
                            <StatusBadge status={notification.status} type="notification" />
                            <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-xs capitalize text-gray-200">
                                {notification.type}
                            </span>
                        </div>
                        <div className="mt-2 flex items-center gap-2">
                            <code className="rounded bg-white/5 px-2 py-1 text-sm text-indigo-300">
                                {notification.requestId}
                            </code>
                            <button
                                type="button"
                                onClick={handleCopyId}
                                className="flex h-6 w-6 items-center justify-center rounded text-white/40 hover:bg-white/10 hover:text-white"
                                aria-label="Copy Request ID"
                            >
                                <Copy size={12} />
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                        <Row label="Domain">{notification.domain}</Row>
                        <Row label="Type">
                            <span className="capitalize">{notification.type}</span>
                        </Row>
                        <Row label="Created">{formatDateTime(notification.createdAt)}</Row>
                        <Row label="Deliveries">{deliveries.length}</Row>
                        <Row label="Sent">
                            {deliveries.filter((d) => d.status === "sent").length}
                        </Row>
                        <Row label="Failed">
                            {deliveries.filter((d) => d.status === "failed").length}
                        </Row>
                    </div>

                    <div className="mt-4">
                        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-white/40">
                            Data Payload
                        </p>
                        <div className="space-y-1 rounded-lg border border-white/10 bg-white/[0.02] p-3">
                            {dataEntries.length === 0 ? (
                                <p className="text-sm text-muted">No data fields provided.</p>
                            ) : (
                                dataEntries.map(([key, value]) => (
                                    <div key={key} className="flex gap-2 text-sm">
                                        <span className="min-w-[120px] flex-shrink-0 font-medium capitalize text-white/50">
                                            {key.replace(/([A-Z])/g, " $1")}:
                                        </span>
                                        <span className="min-w-0 break-all text-gray-100">
                                            {Array.isArray(value)
                                                ? value.join(", ")
                                                : value === "" || value === null || value === undefined
                                                    ? "—"
                                                    : String(value)}
                                        </span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    <div className="mt-4">
                        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-white/40">
                            Deliveries
                        </p>
                        {deliveries.length === 0 ? (
                            <div className="rounded-lg border border-dashed border-white/10 bg-white/[0.01] p-4 text-center text-sm text-muted">
                                No delivery attempts recorded.
                            </div>
                        ) : (
                            <div className="table-wrapper">
                                <table className="table min-w-[520px]">
                                    <thead>
                                        <tr>
                                            <th>Destination</th>
                                            <th>Status</th>
                                            <th>Message ID / Error</th>
                                            <th>Time</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {deliveries.map((d, i) => (
                                            <tr key={i}>
                                                <td>
                                                    <div>
                                                        <p className="text-sm text-gray-100">
                                                            {d.destinationName || "—"}
                                                        </p>
                                                        <p className="text-[11px] capitalize text-muted">
                                                            {d.destinationType?.replace(/_/g, " ")}
                                                        </p>
                                                    </div>
                                                </td>
                                                <td>
                                                    <StatusBadge status={d.status} type="delivery" />
                                                </td>
                                                <td>
                                                    {d.messageId ? (
                                                        <code className="rounded bg-white/5 px-1.5 py-0.5 text-[11px] text-emerald-300">
                                                            {d.messageId}
                                                        </code>
                                                    ) : d.error ? (
                                                        <code className="rounded bg-red-500/10 px-1.5 py-0.5 text-[11px] text-red-300">
                                                            {d.error}
                                                        </code>
                                                    ) : (
                                                        <span className="text-xs text-muted">—</span>
                                                    )}
                                                </td>
                                                <td className="text-xs text-muted">
                                                    {d.sentAt ? formatRelative(d.sentAt) : "—"}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    <div className="mt-4">
                        <button onClick={onClose} className="btn-secondary w-full">
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};

const Row = ({ label, children }) => (
    <div className="rounded-lg border border-white/5 bg-white/[0.02] p-2.5">
        <p className="text-[10px] font-medium uppercase tracking-wider text-white/40">
            {label}
        </p>
        <p className="mt-0.5 truncate text-sm text-gray-100">{children || "—"}</p>
    </div>
);

export default NotificationDetails;