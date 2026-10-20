import { useEffect, useRef, useState } from "react";
import { CheckCircle2, Edit3, Globe, Key, MoreVertical, Trash2, XCircle } from "lucide-react";
import DataTable from "../../shared/DataTable";
import StatusBadge from "../../shared/StatusBadge";
import EmptyState from "../../shared/EmptyState";
import { formatRelative } from "@/utils/formatDate";

const DomainTable = ({ items, loading, onEdit, onDelete, onManageKeys }) => {
    const columns = [
        {
            key: "domain",
            label: "Domain",
            render: (d) => (
                <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-gray-100">
                        {d.domain}
                    </p>
                    <p className="truncate text-xs text-muted">{d.name}</p>
                </div>
            ),
        },
        {
            key: "status",
            label: "Status",
            render: (d) => <StatusBadge status={d.status} />,
        },
        {
            key: "verified",
            label: "Verified",
            render: (d) =>
                d.verified ? (
                    <CheckCircle2 size={16} className="text-emerald-400" />
                ) : (
                    <XCircle size={16} className="text-red-400/70" />
                ),
        },
        {
            key: "active",
            label: "Active",
            render: (d) =>
                d.active ? (
                    <CheckCircle2 size={16} className="text-emerald-400" />
                ) : (
                    <XCircle size={16} className="text-gray-500" />
                ),
        },
        {
            key: "createdAt",
            label: "Created",
            render: (d) => (
                <span className="text-xs text-muted">
                    {formatRelative(d.createdAt)}
                </span>
            ),
        },
        {
            key: "actions",
            label: "",
            headerClassName: "text-right",
            className: "text-right",
            render: (d) => (
                <ActionMenu
                    domain={d}
                    onEdit={() => onEdit(d)}
                    onDelete={() => onDelete(d)}
                    onManageKeys={() => onManageKeys(d)}
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
                    icon={Globe}
                    title="No domains yet"
                    description="Add your first domain to start receiving notifications."
                />
            }
        />
    );
};

const ActionMenu = ({ domain, onEdit, onDelete, onManageKeys }) => {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);
    useEffect(() => {
        const handler = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const keysEnabled = domain?.status === "approved" && domain?.verified === true;

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
                <div className="absolute right-0 top-9 z-20 w-44 overflow-hidden rounded-lg border border-white/10 bg-[#0B1220] p-1 shadow-xl">
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
                            if (!keysEnabled) return;
                            setOpen(false);
                            onManageKeys();
                        }}
                        disabled={!keysEnabled}
                        className={`flex w-full items-center gap-2 rounded px-2.5 py-1.5 text-left text-xs transition ${keysEnabled
                                ? "text-indigo-300 hover:bg-indigo-500/10"
                                : "cursor-not-allowed text-white/30"
                            }`}
                        title={ keysEnabled ? "Manage API keys" : "Domain must be approved and verified by admin"
                        }
                    >
                        <Key size={12} />
                        API Keys
                        {!keysEnabled && (
                            <span className="ml-auto text-[9px]">(locked)</span>
                        )}
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

export default DomainTable;