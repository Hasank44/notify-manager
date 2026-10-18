import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router";
import { AlertTriangle, Bell, CheckCircle, Globe, RefreshCw, Send, Bot, GitBranch, Users } from "lucide-react";
import { toast } from "sonner";
import axiosInstance from "@/api/axiosInstance";
import ENDPOINTS from "@/api/endpoints";
import StatCard from "./StatCard";
import PackageCard from "./PackageCard";
import RecentNotifications from "./RecentNotifications";
import PendingApprovals from "./PendingApprovals";

const QUICK_ACTIONS = [
    { to: "/domains", label: "Add Domain", emoji: <Globe /> },
    { to: "/bots", label: "Add Bot", emoji: <Bot /> },
    { to: "/routes", label: "Add Route", emoji: <GitBranch /> },
    { to: "/user-subscriptions", label: "Add Customer", emoji: <Users /> },
];

const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
};

const Dashboard = () => {
    const user = useSelector((state) => state.user.user);

    const [summary, setSummary] = useState(null);
    const [domainCount, setDomainCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const load = useCallback(async (showSpinner = false) => {
        if (showSpinner) setRefreshing(true);

        try {
            const [summaryRes, domainsRes] = await Promise.all([
                axiosInstance.get(ENDPOINTS.dashboard),
                axiosInstance.get(ENDPOINTS.domains.list, { params: { limit: 100 } }),
            ]);
            setSummary(summaryRes?.data ?? null);
            setDomainCount(domainsRes?.data?.items?.length ?? 0);
        } catch {
            /* interceptor toasts */
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        load();
    }, [load]);

    const handleRefresh = () => {
        load(true);
        toast.info("Refreshing dashboard…");
    };

    const firstName = user?.name?.split(" ")[0] || user?.username || "there";

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between rounded-lg border border-white/10 bg-gradient-to-br from-[#141827] to-[#0b0f1a] p-2 shadow-xl">
                <span className="text-sm font-semibold text-white">Dashboard</span>
                <button
                    type="button"
                    onClick={handleRefresh}
                    disabled={refreshing}
                    className="btn-secondary btn-sm self-start sm:self-auto"
                >
                    <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
                    Refresh
                </button>
            </div>
            <PackageCard user={user} summary={summary} domainCount={domainCount} />
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    icon={Send}
                    label="Total Sent"
                    value={summary?.totalSent ?? 0}
                    subtitle="Successful deliveries"
                    variant="success"
                    loading={loading}
                />
                <StatCard
                    icon={AlertTriangle}
                    label="Total Failed"
                    value={summary?.totalFailed ?? 0}
                    subtitle="Failed deliveries"
                    variant="danger"
                    loading={loading}
                />
                <StatCard
                    icon={Bell}
                    label="This Month"
                    value={summary?.thisMonth ?? 0}
                    subtitle="Current month volume"
                    variant="info"
                    loading={loading}
                />
                <StatCard
                    icon={CheckCircle}
                    label="Pending"
                    value={summary?.pendingApprovals ?? 0}
                    subtitle="Awaiting admin review"
                    variant="warning"
                    loading={loading}
                    onClick={() => {
                        window.location.href = "/approvals";
                    }}
                />
            </div>
            <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
                <div className="lg:col-span-2">
                    <RecentNotifications />
                </div>
                <div className="lg:col-span-1">
                    <PendingApprovals />
                </div>
            </div>
            <div className="card">
                <h2 className="mb-3 text-base font-semibold text-gray-100">
                    Quick Actions
                </h2>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {QUICK_ACTIONS.map((action) => (
                        <Link
                            key={action.to}
                            to={action.to}
                            className="flex flex-col items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.02] p-4 text-center transition hover:border-indigo-500/30 hover:bg-indigo-500/5"
                        >
                            <span className="text-2xl" aria-hidden="true">
                                {action.emoji}
                            </span>
                            <span className="text-xs font-medium text-gray-100">
                                {action.label}
                            </span>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;