import { useEffect, useRef, useState } from "react";
import {
    Edit3,
    MapPin,
    MoreVertical,
    Trash2,
} from "lucide-react";
import DataTable from "../../shared/DataTable";
import StatusBadge from "../../shared/StatusBadge";
import EmptyState from "../../shared/EmptyState";
import { formatRelative } from "@/utils/formatDate";

const TYPE_COLORS = {
    user: "border-cyan-500/30 bg-cyan-500/15 text-cyan-300",
    group: "border-indigo-500/30 bg-indigo-500/15 text-indigo-300",
    channel: "border-purple-500/30 bg-purple-500/15 text-purple-300",
    bot: "border-amber-500/30 bg-amber-500/15 text-amber-300",
    user_dynamic: "border-emerald-500/30 bg-emerald-500/15 text-emerald-300",
    user_dynamic_broadcast:
        "border-teal-500/30 bg-teal-500/15 text-teal-300",
};

const formatType = (type) => {
    if (!type) return "—";
    return type.replace(/_/g, " ");
};

const DestinationTable = ({ items, loading, onEdit, onDelete }) => {
    const columns = [
        {
            key: "name",
            label: "Destination",
            render: (d) => (
                <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-gray-100">{d.name}</p>
                    <p className="truncate text-xs text-muted">{d.description || "—"}</p>
                </div>
            ),
        },
        {
            key: "type",
            label: "Type",
            render: (d) => (
                <span
                    className={`badge border capitalize ${TYPE_COLORS[d.type] ?? ""}`}
                >
                    {formatType(d.type)}
                </span>
            ),
        },
        {
            key: "identifier",
            label: "Identifier",
            render: (d) =>
                d.identifier ? (
                    <code className="rounded bg-white/5 px-1.5 py-0.5 text-[11px] text-gray-200">
                        {d.identifier}
                    </code>
                ) : (
                    <span className="text-xs text-muted">runtime</span>
                ),
        },
        {
            key: "bot",
            label: "Bot",
            render: (d) => (
                <div>
                    <p className="text-sm text-gray-100">{d.botId?.name ?? "—"}</p>
                    <p className="text-[11px] text-muted">
                        {d.botId?.username ? `@${d.botId.username}` : ""}
                        {d.botId?.isSystem && " · System"}
                    </p>
                </div>
            ),
        },
        {
            key: "status",
            label: "Status",
            render: (d) => (
                <div className="flex flex-col gap-1">
                    <StatusBadge status={d.status} />
                    {!d.active && (
                        <span className="text-[10px] text-gray-500">Inactive</span>
                    )}
                </div>
            ),
        },
        {
            key: "createdAt",
            label: "Created",
            render: (d) => (
                <span className="text-xs text-muted">{formatRelative(d.createdAt)}</span>
            ),
        },
        {
            key: "actions",
            label: "",
            headerClassName: "text-right",
            className: "text-right",
            render: (d) => (
                <ActionMenu onEdit={() => onEdit(d)} onDelete={() => onDelete(d)} />
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
                    icon={MapPin}
                    title="No destinations yet"
                    description="Add a destination to start routing notifications."
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

export default DestinationTable;