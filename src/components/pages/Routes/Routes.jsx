import { useEffect, useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { useEntity } from "@/hooks/useEntity";
import entities from "@/redux/entities";
import PageHeader from "../../shared/PageHeader";
import Pagination from "../../shared/Pagination";
import ConfirmModal from "../../shared/ConfirmModal";
import RouteTable from "./RouteTable";
import RouteForm from "./RouteForm";
import { DEFAULT_PAGE_SIZE, PAGE_SIZES } from "@/utils/constants";

const STATUS_FILTERS = [
    { value: "", label: "All status" },
    { value: "pending", label: "Pending" },
    { value: "approved", label: "Approved" },
    { value: "rejected", label: "Rejected" },
    { value: "suspended", label: "Suspended" },
];

const ACTIVE_FILTERS = [
    { value: "", label: "Any state" },
    { value: "true", label: "Active" },
    { value: "false", label: "Inactive" },
];

const Routes = () => {
    const routes = useEntity(entities.routes);

    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(DEFAULT_PAGE_SIZE);
    const [statusFilter, setStatusFilter] = useState("");
    const [activeFilter, setActiveFilter] = useState("");

    const [formOpen, setFormOpen] = useState(false);
    const [editTarget, setEditTarget] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [saving, setSaving] = useState(false);

    const queryParams = useMemo(() => {
        const params = { page, limit };
        if (statusFilter) params.status = statusFilter;
        if (activeFilter === "true") params.active = true;
        if (activeFilter === "false") params.active = false;
        return params;
    }, [page, limit, statusFilter, activeFilter]);

    useEffect(() => {
        routes.fetchAll(queryParams).catch(() => { });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, limit, statusFilter, activeFilter]);

    const handleRefresh = () => {
        routes
            .refresh(queryParams)
            .then(() => toast.success("Routes refreshed"))
            .catch(() => { });
    };

    const openCreate = () => {
        setEditTarget(null);
        setFormOpen(true);
    };

    const openEdit = (route) => {
        setEditTarget(route);
        setFormOpen(true);
    };

    const handleSubmit = async (payload) => {
        setSaving(true);
        try {
            if (editTarget) {
                await routes.update(editTarget.id, payload);
                toast.success("Route updated — may require re-approval");
            } else {
                await routes.create(payload);
                toast.success("Route submitted for approval");
            }
            setFormOpen(false);
            setEditTarget(null);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;
        setSaving(true);
        try {
            await routes.remove(deleteTarget.id);
            toast.success("Route deleted");
            setDeleteTarget(null);
        } catch {
            /* interceptor toasts */
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-3">
            <PageHeader
                title="Notification Routes"
                onRefresh={handleRefresh}
                refreshing={routes.loading}
                actions={
                    <button
                        type="button"
                        onClick={openCreate}
                        className="btn-primary btn-sm"
                    >
                        <Plus size={14} />
                        <span className="hidden sm:inline">Add Route</span>
                    </button>
                }
            />
            <div className="card">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                    <div className="flex-1 text-sm text-muted">
                        {routes.pagination.total} route
                        {routes.pagination.total === 1 ? "" : "s"} configured
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 items-center gap-2">
                        <select
                            value={statusFilter}
                            onChange={(e) => {
                                setStatusFilter(e.target.value);
                                setPage(1);
                            }}
                            className="select w-38"
                        >
                            {STATUS_FILTERS.map((f) => (
                                <option key={f.value} value={f.value}>
                                    {f.label}
                                </option>
                            ))}
                        </select>
                        <select
                            value={activeFilter}
                            onChange={(e) => {
                                setActiveFilter(e.target.value);
                                setPage(1);
                            }}
                            className="select w-38"
                        >
                            {ACTIVE_FILTERS.map((f) => (
                                <option key={f.value} value={f.value}>
                                    {f.label}
                                </option>
                            ))}
                        </select>
                        <select
                            value={limit}
                            onChange={(e) => setLimit(Number(e.target.value))}
                            className="select w-24"
                        >
                            {PAGE_SIZES.map((size) => (
                                <option key={size} value={size}>
                                    {size}/page
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
            <div>
                <RouteTable
                    items={routes.items}
                    loading={routes.loading}
                    onEdit={openEdit}
                    onDelete={setDeleteTarget}
                />
                <Pagination
                    page={routes.pagination.page}
                    limit={routes.pagination.limit}
                    total={routes.pagination.total}
                    onPageChange={setPage}
                />
            </div>
            <RouteForm
                open={formOpen}
                route={editTarget}
                saving={saving}
                onClose={() => {
                    setFormOpen(false);
                    setEditTarget(null);
                }}
                onSubmit={handleSubmit}
            />
            <ConfirmModal
                open={!!deleteTarget}
                title="Delete route?"
                description={`This will permanently remove the route for "${deleteTarget?.domainId?.domain ?? "—"
                    }" → ${deleteTarget?.notificationTypeId?.label ?? "—"
                    }. Notifications for this pair will no longer be delivered.`}
                confirmText="Delete"
                variant="danger"
                loading={saving}
                onConfirm={handleDelete}
                onCancel={() => setDeleteTarget(null)}
            />
        </div>
    );
};

export default Routes;