import { useEffect, useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { useEntity } from "@/hooks/useEntity";
import entities from "@/redux/entities";
import useDebounce from "@/hooks/useDebounce";
import PageHeader from "../../shared/PageHeader";
import SearchBar from "../../shared/SearchBar";
import Pagination from "../../shared/Pagination";
import ConfirmModal from "../../shared/ConfirmModal";
import DestinationTable from "./DestinationTable";
import DestinationForm from "./DestinationForm";
import {
    DEFAULT_PAGE_SIZE,
    PAGE_SIZES,
    DESTINATION_TYPES,
} from "@/utils/constants";

const TYPE_FILTERS = [
    { value: "", label: "All types" },
    ...DESTINATION_TYPES.map((t) => ({
        value: t,
        label: t.charAt(0).toUpperCase() + t.slice(1).replace(/_/g, " "),
    })),
];

const STATUS_FILTERS = [
    { value: "", label: "All status" },
    { value: "pending", label: "Pending" },
    { value: "approved", label: "Approved" },
    { value: "rejected", label: "Rejected" },
    { value: "suspended", label: "Suspended" },
];

const Destinations = () => {
    const destinations = useEntity(entities.destinations);

    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(DEFAULT_PAGE_SIZE);
    const [search, setSearch] = useState("");
    const [typeFilter, setTypeFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [activeFilter, setActiveFilter] = useState("");

    const [formOpen, setFormOpen] = useState(false);
    const [editTarget, setEditTarget] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [saving, setSaving] = useState(false);

    const debouncedSearch = useDebounce(search, 350);

    const queryParams = useMemo(() => {
        const params = { page, limit };
        if (debouncedSearch.trim()) params.search = debouncedSearch.trim();
        if (typeFilter) params.type = typeFilter;
        if (statusFilter) params.status = statusFilter;
        if (activeFilter === "true") params.active = true;
        if (activeFilter === "false") params.active = false;
        return params;
    }, [page, limit, debouncedSearch, typeFilter, statusFilter, activeFilter]);

    /* Cache-aware fetch */
    useEffect(() => {
        destinations.fetchAll(queryParams).catch(() => { });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, limit, debouncedSearch, typeFilter, statusFilter, activeFilter]);

    useEffect(() => {
        setPage(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedSearch, typeFilter, statusFilter, activeFilter, limit]);

    const handleRefresh = () => {
        destinations
            .refresh(queryParams)
            .then(() => toast.success("Destinations refreshed"))
            .catch(() => { });
    };

    const openCreate = () => {
        setEditTarget(null);
        setFormOpen(true);
    };

    const openEdit = (dest) => {
        setEditTarget(dest);
        setFormOpen(true);
    };

    const handleSubmit = async (payload) => {
        setSaving(true);
        try {
            if (editTarget) {
                await destinations.update(editTarget.id, payload);
                toast.success("Destination updated — may require re-approval");
            } else {
                await destinations.create(payload);
                toast.success("Destination submitted for approval");
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
            await destinations.remove(deleteTarget.id);
            toast.success("Destination deleted");
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
                title="Destinations"
                onRefresh={handleRefresh}
                refreshing={destinations.loading}
                actions={
                    <button
                        type="button"
                        onClick={openCreate}
                        className="btn-primary btn-sm"
                    >
                        <Plus size={14} />
                        <span className="hidden sm:inline">Add Destination</span>
                    </button>
                }
            />
            <div className="card">
                <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
                    <div className="flex-1">
                        <SearchBar
                            value={search}
                            onChange={setSearch}
                            placeholder="Search by name or identifier…"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                        <select
                            value={typeFilter}
                            onChange={(e) => setTypeFilter(e.target.value)}
                            className="select"
                        >
                            {TYPE_FILTERS.map((f) => (
                                <option key={f.value} value={f.value}>
                                    {f.label}
                                </option>
                            ))}
                        </select>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="select"
                        >
                            {STATUS_FILTERS.map((f) => (
                                <option key={f.value} value={f.value}>
                                    {f.label}
                                </option>
                            ))}
                        </select>
                        <select
                            value={activeFilter}
                            onChange={(e) => setActiveFilter(e.target.value)}
                            className="select"
                        >
                            <option value="">Any state</option>
                            <option value="true">Active</option>
                            <option value="false">Inactive</option>
                        </select>
                        <select
                            value={limit}
                            onChange={(e) => setLimit(Number(e.target.value))}
                            className="select"
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
                <DestinationTable
                    items={destinations.items}
                    loading={destinations.loading}
                    onEdit={openEdit}
                    onDelete={setDeleteTarget}
                />
                <Pagination
                    page={destinations.pagination.page}
                    limit={destinations.pagination.limit}
                    total={destinations.pagination.total}
                    onPageChange={setPage}
                />
            </div>
            <DestinationForm
                open={formOpen}
                destination={editTarget}
                saving={saving}
                onClose={() => {
                    setFormOpen(false);
                    setEditTarget(null);
                }}
                onSubmit={handleSubmit}
            />
            <ConfirmModal
                open={!!deleteTarget}
                title="Delete destination?"
                description={`This will permanently remove "${deleteTarget?.name}". Deletion is blocked if any routes still reference it.`}
                confirmText="Delete"
                variant="danger"
                loading={saving}
                onConfirm={handleDelete}
                onCancel={() => setDeleteTarget(null)}
            />
        </div>
    );
};

export default Destinations;