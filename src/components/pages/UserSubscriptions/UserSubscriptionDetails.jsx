import { createPortal } from "react-dom";
import { Copy, Edit3, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { formatDateTime, formatRelative } from "@/utils/formatDate";

const UserSubscriptionDetails = ({
    open,
    subscription,
    onClose,
    onEdit,
    onDelete,
}) => {
    if (!open || !subscription) return null;

    const handleCopyChatId = () => {
        navigator.clipboard.writeText(subscription.chatId).then(() => {
            toast.success("Chat ID copied");
        });
    };

    const metadataEntries = Object.entries(subscription.metadata ?? {});

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-6">
            <div
                className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                onClick={onClose}
            />

            <div className="relative z-10 w-full max-w-lg animate-fade-in">
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
                        <h3 className="text-base font-semibold text-gray-100">
                            {subscription.name || subscription.externalUserId}
                        </h3>
                        <p className="text-xs text-muted">
                            B2C subscriber · {subscription.domainId?.domain ?? "—"}
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Row label="External ID">
                            <code className="rounded bg-white/5 px-1.5 py-0.5 text-xs text-indigo-300">
                                {subscription.externalUserId}
                            </code>
                        </Row>

                        <Row label="Chat ID">
                            <div className="flex items-center gap-2">
                                <code className="rounded bg-white/5 px-1.5 py-0.5 text-xs text-cyan-300">
                                    {subscription.chatId}
                                </code>
                                <button
                                    type="button"
                                    onClick={handleCopyChatId}
                                    className="flex h-5 w-5 items-center justify-center rounded text-white/40 hover:bg-white/10 hover:text-white"
                                    aria-label="Copy chatId"
                                >
                                    <Copy size={10} />
                                </button>
                            </div>
                        </Row>

                        {subscription.username && (
                            <Row label="Username">@{subscription.username}</Row>
                        )}
                        {subscription.email && <Row label="Email">{subscription.email}</Row>}
                        {subscription.phone && <Row label="Phone">{subscription.phone}</Row>}

                        <Row label="Domain">{subscription.domainId?.domain ?? "—"}</Row>
                        <Row label="Bot">
                            {subscription.botId?.name ?? "—"}
                            {subscription.botId?.isSystem && (
                                <span className="ml-1 text-[10px] text-amber-400">(system)</span>
                            )}
                        </Row>
                        <Row label="Status">
                            {subscription.active ? (
                                <span className="badge border border-emerald-500/30 bg-emerald-500/15 text-emerald-300">
                                    Active
                                </span>
                            ) : (
                                <span className="badge border border-gray-500/30 bg-gray-500/15 text-gray-400">
                                    Inactive
                                </span>
                            )}
                        </Row>
                        <Row label="Subscribed">{formatDateTime(subscription.createdAt)}</Row>
                        {subscription.lastNotifiedAt && (
                            <Row label="Last notified">
                                {formatRelative(subscription.lastNotifiedAt)}
                            </Row>
                        )}
                        <Row label="Total received">
                            {subscription.totalReceived ?? 0} notifications
                        </Row>
                    </div>

                    {metadataEntries.length > 0 && (
                        <div className="mt-4">
                            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-white/40">
                                Metadata
                            </p>
                            <div className="rounded-lg border border-white/10 bg-white/[0.02] p-3">
                                {metadataEntries.map(([key, value]) => (
                                    <div key={key} className="flex gap-2 text-xs">
                                        <span className="min-w-[100px] flex-shrink-0 font-medium capitalize text-white/50">
                                            {key}:
                                        </span>
                                        <span className="min-w-0 break-all text-gray-100">
                                            {typeof value === "object"
                                                ? JSON.stringify(value)
                                                : String(value ?? "—")}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="mt-4 flex gap-2">
                        <button onClick={onClose} className="btn-secondary flex-1">
                            Close
                        </button>
                        <button onClick={onEdit} className="btn-primary flex-1">
                            <Edit3 size={14} /> Edit
                        </button>
                        <button onClick={onDelete} className="btn-danger flex-1">
                            <Trash2 size={14} /> Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};

const Row = ({ label, children }) => (
    <div className="flex items-start justify-between gap-3 text-sm">
        <span className="flex-shrink-0 text-white/50">{label}</span>
        <span className="min-w-0 break-all text-right text-gray-100">{children}</span>
    </div>
);

export default UserSubscriptionDetails;