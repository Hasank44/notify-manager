import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { AlertTriangle, Plus } from "lucide-react";
import { toast } from "sonner";
import { useEntity } from "@/hooks/useEntity";
import entities from "@/redux/entities";
import useDebounce from "@/hooks/useDebounce";
import PageHeader from "../../shared/PageHeader";
import SearchBar from "../../shared/SearchBar";
import Pagination from "../../shared/Pagination";
import ConfirmModal from "../../shared/ConfirmModal";
import DomainTable from "./DomainTable";
import ApiKeyManager from "./ApiKeyManager";
import DomainForm from "./DomainForm";
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

const Domains = () => {
    const user = useSelector((state) => state.user.user);
    const pkg = user?.packageId ?? user?.package ?? null;
    const domainLimit = pkg?.domainLimit ?? 0;
    const domains = useEntity(entities.domains);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(DEFAULT_PAGE_SIZE);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [activeFilter, setActiveFilter] = useState("");
    const [formOpen, setFormOpen] = useState(false);
    const [editTarget, setEditTarget] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [saving, setSaving] = useState(false);
    const [keyManagerTarget, setKeyManagerTarget] = useState(null);
    const debouncedSearch = useDebounce(search, 350);
    const queryParams = useMemo(() => {
        const params = { page, limit };
        if (debouncedSearch.trim()) params.search = debouncedSearch.trim();
        if (statusFilter) params.status = statusFilter;
        if (activeFilter === "true") params.active = true;
        if (activeFilter === "false") params.active = false;
        return params;
    }, [page, limit, debouncedSearch, statusFilter, activeFilter]);

    /* Cache-aware fetch — first mount hits API, return visits use cache */
    useEffect(() => {
        domains.fetchAll(queryParams).catch(() => { });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, limit, debouncedSearch, statusFilter, activeFilter]);

    useEffect(() => {
        setPage(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedSearch, statusFilter, activeFilter, limit]);

    const handleRefresh = () => {
        domains
            .refresh(queryParams)
            .then(() => toast.success("Domains refreshed"))
            .catch(() => { });
    };

    const openCreate = () => {
        setEditTarget(null);
        setFormOpen(true);
    };

    const openEdit = (dom) => {
        setEditTarget(dom);
        setFormOpen(true);
    };

    const handleSubmit = async (payload) => {
        setSaving(true);
        try {
            if (editTarget) {
                await domains.update(editTarget.id, payload);
                toast.success("Domain updated — may require re-approval");
            } else {
                await domains.create(payload);
                toast.success("Domain submitted for approval");
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
            await domains.remove(deleteTarget.id);
            toast.success("Domain deleted");
            setDeleteTarget(null);
        } catch {
            /* interceptor toasts */
        } finally {
            setSaving(false);
        }
    };

    const totalUsed = domains.pagination.total;
    const limitReached = domainLimit > 0 && totalUsed >= domainLimit;
    return (
        <div className="space-y-3">
            <PageHeader
                title="Domains"
                onRefresh={handleRefresh}
                refreshing={domains.loading}
                actions={
                    <button
                        type="button"
                        onClick={openCreate}
                        disabled={limitReached}
                        className="btn-primary btn-sm"
                        title={
                            limitReached
                                ? `Domain limit reached (${domainLimit}). Upgrade your plan.`
                                : ""
                        }
                    >
                        <Plus size={14} />
                        <span className="hidden sm:inline">Add Domain</span>
                    </button>
                }
            />
            <div className="flex items-start gap-2 rounded-lg border border-indigo-500/20 bg-indigo-500/5 p-3 text-xs">
                <AlertTriangle size={14} className="mt-0.5 flex-shrink-0 text-indigo-400" />
                <p className="text-white/70">
                    New domains are submitted for admin approval. They won't receive
                    notifications until verified.
                    {domainLimit > 0 && (
                        <span className="ml-1 font-medium text-white">
                            {totalUsed} / {domainLimit} domains used on your plan.
                        </span>
                    )}
                </p>
            </div>
            <div className="card">
                <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
                    <div className="flex-1">
                        <SearchBar
                            value={search}
                            onChange={setSearch}
                            placeholder="Search by domain or name…"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
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
                            {ACTIVE_FILTERS.map((f) => (
                                <option key={f.value} value={f.value}>
                                    {f.label}
                                </option>
                            ))}
                        </select>
                        <select
                            value={limit}
                            onChange={(e) => setLimit(Number(e.target.value))}
                            className="select col-span-2 sm:col-span-2"
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
                <DomainTable
                    items={domains.items}
                    loading={domains.loading}
                    onEdit={openEdit}
                    onDelete={setDeleteTarget}
                    onManageKeys={setKeyManagerTarget}
                />
                <Pagination
                    page={domains.pagination.page}
                    limit={domains.pagination.limit}
                    total={domains.pagination.total}
                    onPageChange={setPage}
                />
            </div>
            <DomainForm
                open={formOpen}
                domain={editTarget}
                saving={saving}
                onClose={() => {
                    setFormOpen(false);
                    setEditTarget(null);
                }}
                onSubmit={handleSubmit}
            />
            <ConfirmModal
                open={!!deleteTarget}
                title="Delete domain?"
                description={`This will permanently remove ${deleteTarget?.domain} and all its notification routes. This action cannot be undone.`}
                confirmText="Delete"
                variant="danger"
                loading={saving}
                onConfirm={handleDelete}
                onCancel={() => setDeleteTarget(null)}
            />
            <ApiKeyManager
                open={!!keyManagerTarget}
                domain={keyManagerTarget}
                onClose={() => setKeyManagerTarget(null)}
            />
        </div>
    );
};

export default Domains;