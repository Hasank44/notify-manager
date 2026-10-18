import { Eye, MoreVertical, Pencil, Trash2, Users } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import DataTable from "../../shared/DataTable";
import StatusBadge from "../../shared/StatusBadge";
import EmptyState from "../../shared/EmptyState";
import { formatRelative } from "@/utils/formatDate";

const UserSubscriptionTable = ({
    items,
    loading,
    onView,
    onEdit,
    onDelete,
}) => {
    const columns = [
        {
            key: "customer",
            label: "Customer",
            render: (s) => (
                <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-gray-100">
                        {s.name || s.externalUserId}
                    </p>
                    <p className="truncate text-xs text-muted">
                        <code className="rounded bg-white/5 px-1 py-0.5 text-[10px]">
                            {s.externalUserId}
                        </code>
                    </p>
                </div>
            ),
        },
        {
            key: "chatId",
            label: "Chat ID",
            render: (s) => (
                <code className="rounded bg-white/5 px-1.5 py-0.5 text-[11px] text-cyan-300">
                    {s.chatId}
                </code>
            ),
        },
        {
            key: "domain",
            label: "Domain",
            render: (s) => (
                <span className="text-sm text-gray-300">
                    {s.domainId?.domain ?? "—"}
                </span>
            ),
        },
        {
            key: "bot",
            label: "Bot",
            render: (s) => (
                <div>
                    <p className="text-sm text-gray-100">{s.botId?.name ?? "—"}</p>
                    <p className="text-[10px] text-muted">
                        {s.botId?.isSystem ? "System" : "Own"}
                    </p>
                </div>
            ),
        },
        {
            key: "status",
            label: "Status",
            render: (s) => (
                <StatusBadge status={s.active ? "approved" : "suspended"} />
            ),
        },
        {
            key: "notified",
            label: "Received",
            render: (s) => (
                <span className="text-xs text-muted">{s.totalReceived ?? 0}</span>
            ),
        },
        {
            key: "createdAt",
            label: "Since",
            render: (s) => (
                <span className="text-xs text-muted">
                    {formatRelative(s.createdAt)}
                </span>
            ),
        },
        {
            key: "actions",
            label: "",
            headerClassName: "text-right",
            className: "text-right",
            render: (s) => (
                <ActionMenu
                    onView={() => onView(s)}
                    onEdit={() => onEdit(s)}
                    onDelete={() => onDelete(s)}
                />
            ),
        },
    ];

    return (
        <DataTable
            columns={columns}
            data={items}
            loading={loading}
            rowKey={(r) => r.id}
            emptyState={
                <EmptyState
                    icon={Users}
                    title="No subscribers yet"
                    description="Add a B2C customer manually or bulk-upload a CSV."
                />
            }
        />
    );
};

const ActionMenu = ({ onView, onEdit, onDelete }) => {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const handler = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    return (
        <div ref={ref} className="relative inline-block">
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-white/60 hover:bg-white/10 hover:text-white"
                aria-label="Open actions"
            >
                <MoreVertical size={16} />
            </button>

            {open && (
                <div className="absolute right-0 top-9 z-20 w-40 overflow-hidden rounded-lg border border-white/10 bg-[#0B1220] p-1 shadow-xl">
                    <button
                        type="button"
                        onClick={() => {
                            setOpen(false);
                            onView();
                        }}
                        className="flex w-full items-center gap-2 rounded px-2.5 py-1.5 text-left text-xs text-gray-200 hover:bg-white/10"
                    >
                        <Eye size={12} /> View
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            setOpen(false);
                            onEdit();
                        }}
                        className="flex w-full items-center gap-2 rounded px-2.5 py-1.5 text-left text-xs text-gray-200 hover:bg-white/10"
                    >
                        <Pencil size={12} /> Edit
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            setOpen(false);
                            onDelete();
                        }}
                        className="flex w-full items-center gap-2 rounded px-2.5 py-1.5 text-left text-xs text-red-400 hover:bg-red-500/10"
                    >
                        <Trash2 size={12} /> Delete
                    </button>
                </div>
            )}
        </div>
    );
};

export default UserSubscriptionTable;