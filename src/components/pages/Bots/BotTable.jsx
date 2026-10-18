import { useEffect, useRef, useState } from "react";
import {
    Bot,
    CheckCircle2,
    Crown,
    Edit3,
    MoreVertical,
    Trash2,
    XCircle,
} from "lucide-react";
import DataTable from "../../shared/DataTable";
import StatusBadge from "../../shared/StatusBadge";
import EmptyState from "../../shared/EmptyState";
import { formatRelative } from "@/utils/formatDate";

const BotTable = ({ items, loading, onEdit, onDelete }) => {
    const columns = [
        {
            key: "name",
            label: "Bot",
            render: (b) => (
                <div className="flex items-start gap-2">
                    <div className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
                        <Bot size={16} />
                    </div>
                    <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                            <p className="truncate text-sm font-medium text-gray-100">
                                {b.name}
                            </p>
                            {b.isSystem && (
                                <Crown
                                    size={12}
                                    className="flex-shrink-0 text-amber-400"
                                    fill="currentColor"
                                />
                            )}
                        </div>
                        <p className="truncate text-xs text-muted">
                            {b.username ? `@${b.username}` : "—"}
                        </p>
                    </div>
                </div>
            ),
        },
        {
            key: "token",
            label: "Token",
            render: (b) => (
                <code className="rounded bg-white/5 px-1.5 py-0.5 text-[11px] text-indigo-300">
                    {b.tokenPreview || "—"}
                </code>
            ),
        },
        {
            key: "status",
            label: "Status",
            render: (b) => <StatusBadge status={b.status} />,
        },
        {
            key: "flags",
            label: "Flags",
            render: (b) => (
                <div className="flex items-center gap-2">
                    {b.verified ? (
                        <span title="Verified">
                            <CheckCircle2 size={14} className="text-emerald-400" />
                        </span>
                    ) : (
                        <span title="Not verified">
                            <XCircle size={14} className="text-red-400/70" />
                        </span>
                    )}
                    {b.active ? (
                        <span title="Active">
                            <CheckCircle2 size={14} className="text-emerald-400" />
                        </span>
                    ) : (
                        <span title="Inactive">
                            <XCircle size={14} className="text-gray-500" />
                        </span>
                    )}
                </div>
            ),
        },
        {
            key: "createdAt",
            label: "Created",
            render: (b) => (
                <span className="text-xs text-muted">{formatRelative(b.createdAt)}</span>
            ),
        },
        {
            key: "actions",
            label: "",
            headerClassName: "text-right",
            className: "text-right",
            render: (b) => (
                <ActionMenu onEdit={() => onEdit(b)} onDelete={() => onDelete(b)} />
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
                    icon={Bot}
                    title="No bots yet"
                    description="Add your first Telegram bot to start sending from your own bot."
                />
            }
        />
    );
};

const ActionMenu = ({ onEdit, onDelete }) => {
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
                            onEdit();
                        }}
                        className="flex w-full items-center gap-2 rounded px-2.5 py-1.5 text-left text-xs text-gray-200 hover:bg-white/10"
                    >
                        <Edit3 size={12} /> Edit
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

export default BotTable;