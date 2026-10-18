import { useEffect, useMemo, useState } from "react";
import { Bell, Eye } from "lucide-react";
import { useEntity } from "@/hooks/useEntity";
import entities from "@/redux/entities";
import useDebounce from "@/hooks/useDebounce";
import PageHeader from "../../shared/PageHeader";
import SearchBar from "../../shared/SearchBar";
import Pagination from "../../shared/Pagination";
import DataTable from "../../shared/DataTable";
import StatusBadge from "../../shared/StatusBadge";
import EmptyState from "../../shared/EmptyState";
import NotificationDetails from "./NotificationDetails";
import { formatDateTime, formatRelative } from "@/utils/formatDate";
import {
    DEFAULT_PAGE_SIZE,
    PAGE_SIZES,
    NOTIFICATION_STATUS_LABELS,
} from "@/utils/constants";

const STATUS_FILTERS = [
    { value: "", label: "All statuses" },
    ...Object.entries(NOTIFICATION_STATUS_LABELS).map(([value, label]) => ({
        value,
        label,
    })),
];

const Notifications = () => {
    const notifications = useEntity(entities.notifications);
    const notificationTypes = useEntity(entities.notificationTypes);

    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(DEFAULT_PAGE_SIZE);
    const [search, setSearch] = useState("");
    const [domain, setDomain] = useState("");
    const [typeFilter, setTypeFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [since, setSince] = useState("");
    const [until, setUntil] = useState("");

    const [selected, setSelected] = useState(null);
    const [detailOpen, setDetailOpen] = useState(false);

    const debouncedSearch = useDebounce(search, 350);
    const debouncedDomain = useDebounce(domain, 350);

    useEffect(() => {
        notificationTypes.fetchAll({ limit: 100 }).catch(() => { });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const queryParams = useMemo(() => {
        const params = { page, limit };
        if (debouncedSearch.trim()) params.search = debouncedSearch.trim();
        if (debouncedDomain.trim())
            params.domain = debouncedDomain.trim().toLowerCase();
        if (typeFilter) params.type = typeFilter;
        if (statusFilter) params.status = statusFilter;
        if (since) params.since = since;
        if (until) params.until = until;
        return params;
    }, [
        page,
        limit,
        debouncedSearch,
        debouncedDomain,
        typeFilter,
        statusFilter,
        since,
        until,
    ]);

    /* Cache-aware fetch */
    useEffect(() => {
        notifications.fetchAll(queryParams).catch(() => { });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        page,
        limit,
        debouncedSearch,
        debouncedDomain,
        typeFilter,
        statusFilter,
        since,
        until,
    ]);

    useEffect(() => {
        setPage(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        debouncedSearch,
        debouncedDomain,
        typeFilter,
        statusFilter,
        since,
        until,
        limit,
    ]);

    const handleRefresh = () => {
        notifications.refresh(queryParams).catch(() => { });
    };

    const handleClearFilters = () => {
        setSearch("");
        setDomain("");
        setTypeFilter("");
        setStatusFilter("");
        setSince("");
        setUntil("");
        setPage(1);
    };

    const hasFilters = search || domain || typeFilter || statusFilter || since || until;

    const handleView = async (notification) => {
        try {
            const detail = await notifications.fetchById(notification.id);
            setSelected(detail);
        } catch {
            setSelected(notification);
        }
        setDetailOpen(true);
    };

    const columns = [
        {
            key: "requestId",
            label: "Request ID",
            render: (n) => (
                <code className="rounded bg-white/5 px-1.5 py-0.5 text-[11px] text-indigo-300">
                    {n.requestId}
                </code>
            ),
        },
        {
            key: "type",
            label: "Type",
            render: (n) => (
                <span className="text-sm capitalize text-gray-100">{n.type}</span>
            ),
        },
        {
            key: "domain",
            label: "Domain",
            render: (n) => <span className="text-sm text-gray-300">{n.domain}</span>,
        },
        {
            key: "status",
            label: "Status",
            render: (n) => <StatusBadge status={n.status} type="notification" />,
        },
        {
            key: "deliveries",
            label: "Deliveries",
            render: (n) => {
                const total = n.deliveries?.length ?? 0;
                const sent = (n.deliveries ?? []).filter(
                    (d) => d.status === "sent"
                ).length;
                const failed = (n.deliveries ?? []).filter(
                    (d) => d.status === "failed"
                ).length;
                return (
                    <div className="text-xs">
                        <span className="text-emerald-400">{sent}</span>
                        <span className="text-white/30"> / </span>
                        <span className="text-red-400">{failed}</span>
                        <span className="text-white/30"> / {total}</span>
                    </div>
                );
            },
        },
        {
            key: "createdAt",
            label: "Time",
            render: (n) => (
                <div title={formatDateTime(n.createdAt)}>
                    <p className="text-xs text-muted">{formatRelative(n.createdAt)}</p>
                </div>
            ),
        },
        {
            key: "actions",
            label: "",
            headerClassName: "text-right",
            className: "text-right",
            render: (n) => (
                <button
                    type="button"
                    onClick={() => handleView(n)}
                    className="btn-secondary btn-sm"
                >
                    <Eye size={12} />
                    View
                </button>
            ),
        },
    ];

    const typeList = notificationTypes.items ?? [];

    return (
        <div className="space-y-3">
            <PageHeader
                title="Notifications"
                onRefresh={handleRefresh}
                refreshing={notifications.loading}
            />

            <div className="card space-y-2">
                <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
                    <div className="flex-1">
                        <SearchBar
                            value={search}
                            onChange={setSearch}
                            placeholder="Search request ID, domain, type…"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            value={domain}
                            onChange={(e) => setDomain(e.target.value)}
                            placeholder="domain.com"
                            className="input w-40"
                        />
                        <select
                            value={typeFilter}
                            onChange={(e) => setTypeFilter(e.target.value)}
                            className="select w-36"
                        >
                            <option value="">All types</option>
                            {typeList.map((t) => (
                                <option key={t.id} value={t.name}>
                                    {t.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                    <div className="flex flex-1 items-center gap-2">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="select w-36"
                        >
                            {STATUS_FILTERS.map((f) => (
                                <option key={f.value} value={f.value}>
                                    {f.label}
                                </option>
                            ))}
                        </select>
                        <input
                            type="date"
                            value={since}
                            onChange={(e) => setSince(e.target.value)}
                            className="input w-40"
                            placeholder="From"
                        />
                        <span className="text-xs text-muted">to</span>
                        <input
                            type="date"
                            value={until}
                            onChange={(e) => setUntil(e.target.value)}
                            className="input w-40"
                            placeholder="To"
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        {hasFilters && (
                            <button
                                type="button"
                                onClick={handleClearFilters}
                                className="btn-secondary btn-sm"
                            >
                                Clear
                            </button>
                        )}
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

            <DataTable
                columns={columns}
                data={notifications.items}
                loading={notifications.loading}
                rowKey={(r) => r.id}
                emptyState={
                    <EmptyState
                        icon={Bell}
                        title="No notifications yet"
                        description="Notifications sent to your domains will appear here."
                    />
                }
            />

            <Pagination
                page={notifications.pagination.page}
                limit={notifications.pagination.limit}
                total={notifications.pagination.total}
                onPageChange={setPage}
            />

            <NotificationDetails
                open={detailOpen}
                notification={selected}
                onClose={() => {
                    setDetailOpen(false);
                    setSelected(null);
                }}
            />
        </div>
    );
};

export default Notifications;