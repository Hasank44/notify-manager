import { Link } from "react-router";
import { ArrowRight, Bell } from "lucide-react";
import StatusBadge from "../../shared/StatusBadge";
import EmptyState from "../../shared/EmptyState";
import Loader from "../../shared/Loader";
import { formatRelative } from "@/utils/formatDate";
import { useSelector } from "react-redux";

const RecentNotifications = ({ loading}) => {
    const { items } = useSelector(state => state.recentNotification);
    return (
        <div className="card">
            <div className="mb-3 flex items-center justify-between">
                <div>
                    <h2 className="text-base font-semibold text-gray-100">
                        Recent Notifications
                    </h2>
                    <p className="text-xs text-muted">Your last 5 notifications</p>
                </div>
                <Link
                    to="/notifications"
                    className="flex items-center gap-1 text-xs font-medium text-indigo-400 transition hover:text-indigo-300"
                >
                    View All <ArrowRight size={12} />
                </Link>
            </div>
            {loading && <Loader />}
            {!loading && items.length === 0 && (
                <EmptyState
                    icon={Bell}
                    title="No notifications yet"
                    description="When notifications are sent to your domains, they'll appear here."
                />
            )}
            {!loading && items?.length > 0 && (
                <div className="overflow-x-auto">
                    <table className="table min-w-[500px]">
                        <thead>
                            <tr>
                                <th>Request ID</th>
                                <th>Type</th>
                                <th>Domain</th>
                                <th>Status</th>
                                <th>Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items?.map((n) => (
                                <tr key={n.id}>
                                    <td>
                                        <code className="rounded bg-white/5 px-1.5 py-0.5 text-[11px] text-indigo-300">
                                            {n.requestId}
                                        </code>
                                    </td>
                                    <td className="capitalize">{n.type}</td>
                                    <td>{n.domain}</td>
                                    <td>
                                        <StatusBadge status={n.status} type="notification" />
                                    </td>
                                    <td className="text-xs text-muted">
                                        {formatRelative(n.createdAt)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default RecentNotifications;