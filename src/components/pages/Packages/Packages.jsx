import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Check, Package as PackageIcon, RefreshCw, Star } from "lucide-react";
import { toast } from "sonner";
import axiosInstance from "@/api/axiosInstance";
import ENDPOINTS from "@/api/endpoints";
import PageHeader from "../../shared/PageHeader";
import Loader from "../../shared/Loader";
import UpgradeModal from "./UpgradeModal";

const Packages = () => {
    const user = useSelector((state) => state.user.user);

    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [upgradeTarget, setUpgradeTarget] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const currentPkgId = user?.packageId?._id ?? user?.packageId?.id ?? user?.packageId ?? null;

    const load = useCallback(async (showSpinner = false) => {
        if (showSpinner) setRefreshing(true);
        try {
            const response = await axiosInstance.get(ENDPOINTS.packages.list);
            setPackages(response?.data?.items ?? []);
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
        toast.info("Refreshing packages…");
    };

    const handleUpgrade = async (payload) => {
        setSubmitting(true);
        try {
            await axiosInstance.post(ENDPOINTS.subscriptions.create, payload);
            toast.success(
                "Upgrade request submitted! Admin will verify your payment shortly."
            );
            setUpgradeTarget(null);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="space-y-3">
            <PageHeader
                title="Packages"
                onRefresh={handleRefresh}
                refreshing={refreshing}
            />
            <div className="flex items-start gap-2 rounded-lg border border-indigo-500/20 bg-indigo-500/5 p-3 text-xs">
                <PackageIcon
                    size={14}
                    className="mt-0.5 flex-shrink-0 text-indigo-400"
                />
                <p className="text-white/70">
                    Choose a plan that fits your needs. Submit an upgrade request — admin
                    verifies payment and activates your plan within minutes.
                </p>
            </div>

            {loading && <Loader full />}
            {!loading && packages.length === 0 && (
                <div className="card text-center text-sm text-muted">
                    No packages available right now.
                </div>
            )}

            {!loading && packages.length > 0 && (
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                    {packages.map((pkg) => {
                        const isCurrent = String(pkg.id) === String(currentPkgId);
                        const isHighlighted = pkg.highlighted === true;

                        return (
                            <div
                                key={pkg.id}
                                className={`card relative flex flex-col ${isHighlighted
                                        ? "border-indigo-500/40 shadow-2xl shadow-indigo-500/10"
                                        : ""
                                    }`}
                            >
                                {isHighlighted && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-lg">
                                        <Star size={9} className="mr-1 inline" fill="currentColor" />
                                        Popular
                                    </div>
                                )}

                                <div className="mb-3">
                                    <h3 className="text-lg font-semibold text-gray-100">
                                        {pkg.label}
                                    </h3>
                                    <p className="mt-0.5 text-xs text-muted">
                                        {pkg.description || "—"}
                                    </p>
                                </div>

                                <div className="mb-3">
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-3xl font-bold text-white">
                                            {pkg.currency === "USD" ? "$" : pkg.currency}{" "}
                                            {pkg.price}
                                        </span>
                                        <span className="text-xs text-muted">
                                            /{pkg.billingPeriod}
                                        </span>
                                    </div>
                                </div>

                                <div className="mb-3 space-y-1.5 text-sm">
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-white/60">Domains</span>
                                        <span className="font-medium text-gray-100">
                                            {pkg.domainLimit}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-white/60">Notifications/mo</span>
                                        <span className="font-medium text-gray-100">
                                            {pkg.monthlyNotificationLimit.toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-white/60">Own Bot</span>
                                        <span
                                            className={
                                                pkg.allowOwnBot
                                                    ? "text-emerald-400"
                                                    : "text-white/30"
                                            }
                                        >
                                            {pkg.allowOwnBot ? "✓" : "—"}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-white/60">B2C Customers</span>
                                        <span
                                            className={
                                                pkg.allowB2C ? "text-emerald-400" : "text-white/30"
                                            }
                                        >
                                            {pkg.allowB2C ? "✓" : "—"}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-white/60">Channels</span>
                                        <span
                                            className={
                                                pkg.allowChannel
                                                    ? "text-emerald-400"
                                                    : "text-white/30"
                                            }
                                        >
                                            {pkg.allowChannel ? "✓" : "—"}
                                        </span>
                                    </div>
                                </div>

                                {pkg.features?.length > 0 && (
                                    <div className="mb-3 flex-1 space-y-1.5 border-t border-white/5 pt-3">
                                        {pkg.features.slice(0, 5).map((f, i) => (
                                            <div
                                                key={i}
                                                className="flex items-start gap-1.5 text-xs text-white/70"
                                            >
                                                <Check
                                                    size={12}
                                                    className="mt-0.5 flex-shrink-0 text-emerald-400"
                                                />
                                                <span>{f}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <button
                                    type="button"
                                    onClick={() => setUpgradeTarget(pkg)}
                                    disabled={isCurrent}
                                    className={`w-full ${isCurrent ? "btn-secondary" : "btn-primary"
                                        }`}
                                >
                                    {isCurrent ? (
                                        <>
                                            <Check size={14} />
                                            Current Plan
                                        </>
                                    ) : (
                                        "Upgrade to this plan"
                                    )}
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}
            <UpgradeModal
                open={!!upgradeTarget}
                pkg={upgradeTarget}
                saving={submitting}
                onClose={() => setUpgradeTarget(null)}
                onSubmit={handleUpgrade}
            />
        </div>
    );
};

export default Packages;