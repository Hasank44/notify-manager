import { useEffect, useState } from "react";
import { CheckSquare, Eye } from "lucide-react";
import axiosInstance from "@/api/axiosInstance";
import ENDPOINTS from "@/api/endpoints";
import PageHeader from "../../shared/PageHeader";
import DataTable from "../../shared/DataTable";
import EmptyState from "../../shared/EmptyState";
import StatusBadge from "../../shared/StatusBadge";
import Loader from "../../shared/Loader";
import { formatRelative } from "@/utils/formatDate";
import { RESOURCE_TYPE_LABELS } from "@/utils/constants";

const STATUS_FILTERS = [
    { value: "pending", label: "Pending" },
    { value: "approved", label: "Approved" },
    { value: "rejected", label: "Rejected" },
    { value: "", label: "All statuses" },
];

const getPrimaryLabel = (approval) => {
    const d = approval.submittedData ?? {};
    return d.domain || d.name || d.botName || d.notificationType || "—";
};

const Approvals = () => {
    const [items, setItems] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [statusFilter, setStatusFilter] = useState("pending");

    const load = async (showSpinner = false) => {
        if (showSpinner) setRefreshing(true);
        else setLoading(true);

        try {
            const params = { limit: 50 };
            if (statusFilter) params.status = statusFilter;
            const response = await axiosInstance.get(ENDPOINTS.approvals.list, {
                params,
            });
            setItems(response?.data?.items ?? []);
            setTotal(response?.data?.pagination?.total ?? 0);
        } catch {
            /* interceptor toasts */
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [statusFilter]);

    const handleRefresh = () => load(true);

    const columns = [
        {
            key: "resource",
            label: "Resource",
            render: (a) => (
                <div>
                    <p className="text-sm font-medium text-gray-100">
                        {RESOURCE_TYPE_LABELS[a.resourceType] ?? a.resourceType}
                    </p>
                    <p className="truncate text-xs text-muted">{getPrimaryLabel(a)}</p>
                </div>
            ),
        },
        {
            key: "status",
            label: "Status",
            render: (a) => <StatusBadge status={a.status} />,
        },
        {
            key: "requested",
            label: "Requested",
            render: (a) => (
                <span className="text-xs text-muted">
                    {formatRelative(a.createdAt)}
                </span>
            ),
        },
        {
            key: "reviewed",
            label: "Reviewed",
            render: (a) =>
                a.reviewedAt ? (
                    <span className="text-xs text-muted">
                        {formatRelative(a.reviewedAt)}
                    </span>
                ) : (
                    <span className="text-xs text-white/30">Pending</span>
                ),
        },
        {
            key: "adminNote",
            label: "Admin Note",
            render: (a) => (
                <span className="text-xs text-muted line-clamp-1">
                    {a.adminNote || "—"}
                </span>
            ),
        },
    ];

    return (
        <div className="space-y-3">
            <PageHeader
                title="Approvals"
                onRefresh={handleRefresh}
                refreshing={refreshing}
            />

            <div className="card">
                <div className="flex items-center justify-between">
                    <div className="text-sm text-muted">
                        {total > 0 ? (
                            <>
                                <span className="text-gray-100">{total}</span>{" "}
                                {total === 1 ? "request" : "requests"}
                            </>
                        ) : (
                            "No requests match the filter"
                        )}
                    </div>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="select w-40"
                    >
                        {STATUS_FILTERS.map((f) => (
                            <option key={f.value} value={f.value}>
                                {f.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {loading && <Loader />}

            {!loading && (
                <DataTable
                    columns={columns}
                    data={items}
                    loading={false}
                    rowKey={(r) => r.id}
                    emptyState={
                        <EmptyState
                            icon={CheckSquare}
                            title={
                                statusFilter === "pending"
                                    ? "All caught up!"
                                    : "No requests found"
                            }
                            description={
                                statusFilter === "pending"
                                    ? "You have no pending approvals right now."
                                    : "Try changing the filter."
                            }
                        />
                    }
                />
            )}
        </div>
    );
};

export default Approvals;