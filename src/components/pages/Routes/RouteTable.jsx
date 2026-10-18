import { useEffect, useRef, useState } from "react";
import {
    CheckCircle2,
    Edit3,
    GitBranch,
    MoreVertical,
    Trash2,
    XCircle,
} from "lucide-react";
import DataTable from "../../shared/DataTable";
import StatusBadge from "../../shared/StatusBadge";
import EmptyState from "../../shared/EmptyState";
import { formatRelative } from "@/utils/formatDate";

const RouteTable = ({ items, loading, onEdit, onDelete }) => {
    const columns = [
        {
            key: "binding",
            label: "Binding",
            render: (r) => (
                <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-gray-100">
                        {r.domainId?.domain ?? "—"}
                    </p>
                    <p className="truncate text-xs text-muted">
                        {r.notificationTypeId?.label ?? r.notificationTypeId?.name ?? "—"}
                    </p>
                </div>
            ),
        },
        {
            key: "destinations",
            label: "Destinations",
            render: (r) => {
                const list = r.destinations ?? [];
                const activeCount = list.filter(
                    (d) => d.active && d.status === "approved"
                ).length;

                return (
                    <div className="max-w-[220px]">
                        <p className="text-sm text-gray-100">
                            {activeCount}{" "}
                            <span className="text-xs text-muted">
                                active / {list.length} total
                            </span>
                        </p>
                        {list.length > 0 && (
                            <p className="truncate text-[11px] text-muted">
                                {list
                                    .slice(0, 2)
                                    .map((d) => d.name ?? "—")
                                    .join(", ")}
                                {list.length > 2 && ` +${list.length - 2}`}
                            </p>
                        )}
                    </div>
                );
            },
        },
        {
            key: "status",
            label: "Status",
            render: (r) => <StatusBadge status={r.status} />,
        },
        {
            key: "verified",
            label: "Verified",
            render: (r) =>
                r.verified ? (
                    <CheckCircle2 size={16} className="text-emerald-400" />
                ) : (
                    <XCircle size={16} className="text-red-400/70" />
                ),
        },
        {
            key: "active",
            label: "Active",
            render: (r) =>
                r.active ? (
                    <span className="badge border border-emerald-500/30 bg-emerald-500/15 text-emerald-300">
                        On
                    </span>
                ) : (
                    <span className="badge border border-gray-500/30 bg-gray-500/15 text-gray-400">
                        Off
                    </span>
                ),
        },
        {
            key: "createdAt",
            label: "Created",
            render: (r) => (
                <span className="text-xs text-muted">{formatRelative(r.createdAt)}</span>
            ),
        },
        {
            key: "actions",
            label: "",
            headerClassName: "text-right",
            className: "text-right",
            render: (r) => (
                <ActionMenu onEdit={() => onEdit(r)} onDelete={() => onDelete(r)} />
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
                    icon={GitBranch}
                    title="No routes configured"
                    description="Create a route to bind a domain + type to destinations."
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

export default RouteTable;