import { useEffect, useState } from "react";
import { Link } from "react-router";
import { ArrowRight, CheckSquare, Inbox } from "lucide-react";
import axiosInstance from "@/api/axiosInstance";
import ENDPOINTS from "@/api/endpoints";
import Loader from "../../shared/Loader";
import { formatRelative } from "@/utils/formatDate";
import { RESOURCE_TYPE_LABELS } from "@/utils/constants";

const PendingApprovals = () => {
    const [items, setItems] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;
        const load = async () => {
            try {
                const response = await axiosInstance.get(ENDPOINTS.approvals.list, {
                    params: { status: "pending", limit: 3 },
                });
                if (!cancelled) {
                    setItems(response?.data?.items ?? []);
                    setTotal(response?.data?.pagination?.total ?? 0);
                }
            } catch {
                /* silent */
            } finally {
                if (!cancelled) setLoading(false);
            }
        };
        load();
        return () => {
            cancelled = true;
        };
    }, []);

    return (
        <div className="card h-full">
            <div className="mb-4 flex items-center justify-between">
                <div>
                    <h2 className="text-base font-semibold text-gray-100">
                        Pending Approvals
                    </h2>
                    <p className="text-xs text-muted">
                        {total > 0 ? `${total} awaiting admin review` : "Nothing pending"}
                    </p>
                </div>
                {total > 0 && (
                    <Link
                        to="/approvals"
                        className="flex items-center gap-1 text-xs font-medium text-indigo-400 transition hover:text-indigo-300"
                    >
                        View <ArrowRight size={12} />
                    </Link>
                )}
            </div>

            {loading && <Loader />}

            {!loading && items.length === 0 && (
                <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-white/10 bg-white/[0.01] py-8 text-center">
                    <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
                        <Inbox size={18} />
                    </div>
                    <p className="text-sm font-medium text-gray-100">All caught up!</p>
                    <p className="text-xs text-muted">No pending approvals</p>
                </div>
            )}

            {!loading && items.length > 0 && (
                <div className="space-y-2">
                    {items.map((item) => (
                        <Link
                            key={item.id}
                            to="/approvals"
                            className="flex items-start gap-3 rounded-lg border border-white/5 bg-white/[0.02] p-3 transition hover:border-white/10 hover:bg-white/[0.04]"
                        >
                            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400">
                                <CheckSquare size={14} />
                            </div>

                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-medium text-gray-100">
                                    {RESOURCE_TYPE_LABELS[item.resourceType] ?? item.resourceType}
                                </p>
                                <p className="truncate text-xs text-muted">
                                    {item.submittedData?.domain ||
                                        item.submittedData?.name ||
                                        "Awaiting review"}
                                </p>
                            </div>

                            <span className="flex-shrink-0 text-[10px] text-white/40">
                                {formatRelative(item.createdAt)}
                            </span>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PendingApprovals;