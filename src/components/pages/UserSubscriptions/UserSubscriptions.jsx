import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FileSpreadsheet, Lock, Plus, Upload, Users } from "lucide-react";
import { toast } from "sonner";
import { useEntity } from "@/hooks/useEntity";
import entities from "@/redux/entities";
import { userSubscriptionsThunks } from "@/redux/slices/userSubscriptionsSlice";
import useDebounce from "@/hooks/useDebounce";
import PageHeader from "../../shared/PageHeader";
import SearchBar from "../../shared/SearchBar";
import Pagination from "../../shared/Pagination";
import ConfirmModal from "../../shared/ConfirmModal";
import UserSubscriptionTable from "./UserSubscriptionTable";
import UserSubscriptionForm from "./UserSubscriptionForm";
import UserSubscriptionDetails from "./UserSubscriptionDetails";
import BulkUploadModal from "./BulkUploadModal";
import { DEFAULT_PAGE_SIZE, PAGE_SIZES } from "@/utils/constants";

const UserSubscriptions = () => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user.user);
    const pkg = user?.packageId ?? user?.package ?? null;
    const allowB2C = pkg?.allowB2C === true;
    const subscriptions = useEntity(entities.userSubscriptions);
    const domains = useEntity(entities.domains);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(DEFAULT_PAGE_SIZE);
    const [search, setSearch] = useState("");
    const [domainFilter, setDomainFilter] = useState("");
    const [activeFilter, setActiveFilter] = useState("");
    const [formOpen, setFormOpen] = useState(false);
    const [editTarget, setEditTarget] = useState(null);
    const [bulkOpen, setBulkOpen] = useState(false);
    const [detailOpen, setDetailOpen] = useState(false);
    const [selected, setSelected] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [saving, setSaving] = useState(false);

    const debouncedSearch = useDebounce(search, 350);

    /* Load domains for filter */
    useEffect(() => {
        if (!allowB2C) return;
        domains.fetchAll({ limit: 100, active: true }).catch(() => { });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [allowB2C]);

    const queryParams = useMemo(() => {
        const params = { page, limit };
        if (debouncedSearch.trim()) params.search = debouncedSearch.trim();
        if (domainFilter) params.domainId = domainFilter;
        if (activeFilter === "true") params.active = true;
        if (activeFilter === "false") params.active = false;
        return params;
    }, [page, limit, debouncedSearch, domainFilter, activeFilter]);

    useEffect(() => {
        if (!allowB2C) return;
        subscriptions.fetchAll(queryParams).catch(() => { });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, limit, debouncedSearch, domainFilter, activeFilter, allowB2C]);

    useEffect(() => {
        setPage(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedSearch, domainFilter, activeFilter, limit]);

    const handleRefresh = () => {
        subscriptions
            .refresh(queryParams)
            .then(() => toast.success("Subscribers refreshed"))
            .catch(() => { });
    };

    const openCreate = () => {
        setEditTarget(null);
        setFormOpen(true);
    };

    const openEdit = (sub) => {
        setDetailOpen(false);
        setEditTarget(sub);
        setFormOpen(true);
    };

    const openView = (sub) => {
        setSelected(sub);
        setDetailOpen(true);
    };

    const handleSubmit = async (payload) => {
        setSaving(true);
        try {
            if (editTarget) {
                await subscriptions.update(editTarget.id, payload);
                toast.success("Subscriber updated");
            } else {
                await subscriptions.create(payload);
                toast.success("Subscriber added");
            }
            setFormOpen(false);
            setEditTarget(null);
        } finally {
            setSaving(false);
        }
    };

    const handleBulkUpload = async ({ domainId, botId, subscriptions: rows }) => {
        setSaving(true);
        try {
            const result = await dispatch(userSubscriptionsThunks.bulkCreate({ domainId, botId, subscriptions: rows })).unwrap();
            const created = result?.created ?? 0;
            const skipped = result?.skipped ?? 0;
            const total = result?.total ?? rows.length;

            if (skipped > 0) {
                toast.warning(`${created} added, ${skipped} skipped (already exist). Total: ${total}`);
            } else {
                toast.success(`${created} subscriber${created === 1 ? "" : "s"} added`);
            }
            setBulkOpen(false);
            subscriptions.refresh(queryParams).catch(() => { });
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;
        setSaving(true);
        try {
            await subscriptions.remove(deleteTarget.id);
            toast.success("Subscriber deleted");
            setDeleteTarget(null);
            setDetailOpen(false);
            setSelected(null);
        } catch {
            /* interceptor toasts */
        } finally {
            setSaving(false);
        }
    };

    if (!allowB2C) {
        return (
            <div className="space-y-3">
                <PageHeader title="User Subscriptions" />
                <div className="card">
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-amber-500/10 text-amber-400">
                            <Lock size={24} />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-100">
                            B2C Subscriptions Not Available
                        </h3>
                        <p className="mt-1 max-w-md text-sm text-muted">
                            Your current plan ({pkg?.label ?? pkg?.name ?? "Free"}) does not
                            support B2C customer subscriptions. Upgrade to Starter or higher.
                        </p>
                        <a href="/packages" className="btn-primary btn-sm mt-4">
                            View Plans
                        </a>
                    </div>
                </div>
            </div>
        );
    }

    const domainOptions = (domains.items ?? []).filter((d) => d.status === "approved");

    return (
        <div className="space-y-3">
            <PageHeader
                title="User Subscriptions"
                onRefresh={handleRefresh}
                refreshing={subscriptions.loading}
                actions={
                    <div className="flex items-center gap-1">
                        <button
                            type="button"
                            onClick={() => setBulkOpen(true)}
                            className="btn-secondary btn-sm"
                        >
                            <Upload size={14} />
                            <span className="hidden sm:inline">Bulk</span>
                        </button>
                        <button
                            type="button"
                            onClick={openCreate}
                            className="btn-primary btn-sm"
                        >
                            <Plus size={14} />
                            <span className="hidden sm:inline">Add</span>
                        </button>
                    </div>
                }
            />
            <div className="flex items-start gap-2 rounded-lg border border-indigo-500/20 bg-indigo-500/5 p-3 text-xs">
                <FileSpreadsheet
                    size={14}
                    className="mt-0.5 flex-shrink-0 text-indigo-400"
                />
                <p className="text-white/70">
                    These are your B2C customers. When you send a notification with{" "}
                    <code className="rounded bg-white/10 px-1 py-0.5 text-[10px] text-indigo-300">
                        data.userId
                    </code>
                    , the matching customer receives it. Add them manually or upload a
                    CSV.
                </p>
            </div>
            <div className="card">
                <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
                    <div className="flex-1">
                        <SearchBar
                            value={search}
                            onChange={setSearch}
                            placeholder="Search external ID, name, email, chat ID…"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                        <select
                            value={domainFilter}
                            onChange={(e) => setDomainFilter(e.target.value)}
                            className="select"
                        >
                            <option value="">All domains</option>
                            {domainOptions.map((d) => (
                                <option key={d.id} value={d.id}>
                                    {d.domain}
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
                <UserSubscriptionTable
                    items={subscriptions.items}
                    loading={subscriptions.loading}
                    onView={openView}
                    onEdit={openEdit}
                    onDelete={setDeleteTarget}
                />
                <Pagination
                    page={subscriptions.pagination.page}
                    limit={subscriptions.pagination.limit}
                    total={subscriptions.pagination.total}
                    onPageChange={setPage}
                />
            </div>
            <UserSubscriptionForm
                open={formOpen}
                subscription={editTarget}
                saving={saving}
                onClose={() => {
                    setFormOpen(false);
                    setEditTarget(null);
                }}
                onSubmit={handleSubmit}
            />

            {/* Bulk upload */}
            <BulkUploadModal
                open={bulkOpen}
                saving={saving}
                onClose={() => setBulkOpen(false)}
                onSubmit={handleBulkUpload}
            />

            {/* Details */}
            <UserSubscriptionDetails
                open={detailOpen}
                subscription={selected}
                onClose={() => {
                    setDetailOpen(false);
                    setSelected(null);
                }}
                onEdit={() => openEdit(selected)}
                onDelete={() => setDeleteTarget(selected)}
            />

            {/* Delete confirm */}
            <ConfirmModal
                open={!!deleteTarget}
                title="Delete subscriber?"
                description={`This will remove ${deleteTarget?.name || deleteTarget?.externalUserId || "this customer"
                    } from the domain's subscriber list. They will stop receiving notifications.`}
                confirmText="Delete"
                variant="danger"
                loading={saving}
                onConfirm={handleDelete}
                onCancel={() => setDeleteTarget(null)}
            />
        </div>
    );
};

export default UserSubscriptions;