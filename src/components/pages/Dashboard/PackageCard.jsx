import { Link } from "react-router";
import { ArrowRight, Bell, Globe, Package as PackageIcon } from "lucide-react";
import { formatDateTime } from "@/utils/formatDate";

const ProgressBar = ({ used, limit, color = "indigo" }) => {
    if (!limit || limit <= 0) {
        return (
            <span className="text-xs text-muted">Unlimited</span>
        );
    };
    const pct = Math.min(100, Math.round((used / limit) * 100));
    const colorMap = {
        indigo: "from-indigo-500 to-purple-500",
        emerald: "from-emerald-500 to-teal-500",
        amber: "from-amber-500 to-orange-500",
        red: "from-red-500 to-rose-500",
    };
    const barColor = pct >= 90 ? colorMap.red : pct >= 75 ? colorMap.amber : colorMap[color] ?? colorMap.indigo;

    return (
        <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
                <span className="text-gray-100">
                    {used.toLocaleString()}{" "}
                    <span className="text-white/40">
                        / {limit.toLocaleString()}
                    </span>
                </span>
                <span
                    className={`font-medium ${pct >= 90 ? "text-red-400" : pct >= 75 ? "text-amber-400" : "text-emerald-400"
                        }`}
                >
                    {pct}%
                </span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/5">
                <div
                    className={`h-full rounded-full bg-gradient-to-r ${barColor} transition-all duration-500`}
                    style={{ width: `${pct}%` }}
                />
            </div>
        </div>
    );
};

const PackageCard = ({ user, summary, domainCount }) => {
    const pkg = user?.packageId ?? user?.package ?? null;
    if (!pkg) return null;

    const notifUsed = summary?.usage?.monthCount ?? 0;
    const notifLimit = pkg?.monthlyNotificationLimit ?? 0;
    const domainLimit = pkg?.domainLimit ?? 0;

    const features = [];
    if (pkg?.allowOwnBot) features.push("Own Bot");
    if (pkg?.allowB2C) features.push("B2C");
    if (pkg?.allowChannel) features.push("Channels");
    if (pkg?.allowGroup) features.push("Groups");

    return (
        <div className="card">
            <div className="mb-3 flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                <div className="flex items-start gap-3">
                    <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 shadow-lg shadow-indigo-500/20">
                        <PackageIcon size={20} className="text-white" />
                    </div>
                    <div className="min-w-0">
                        <p className="text-xs uppercase tracking-wider text-white/50">
                            Current Plan
                        </p>
                        <h3 className="text-lg font-semibold text-gray-100">
                            {pkg?.label ?? pkg.name}
                            <span className="ml-2 text-sm font-normal text-muted">
                                {pkg?.currency ?? "USD"} {pkg.price ?? 0}/{pkg.billingPeriod ?? "month"}
                            </span>
                        </h3>
                        {user?.packageExpiresAt && (
                            <p className="text-xs text-white/40">
                                Renews/expires on {formatDateTime(user?.packageExpiresAt)}
                            </p>
                        )}
                    </div>
                </div>

                <Link
                    to="/packages"
                    className="btn-secondary btn-sm self-start"
                >
                    Upgrade <ArrowRight size={12} />
                </Link>
            </div>

            {features.length > 0 && (
                <div className="mb-4 flex flex-wrap gap-1.5">
                    {features.map((f) => (
                        <span
                            key={f}
                            className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-300"
                        >
                            ✓ {f}
                        </span>
                    ))}
                </div>
            )}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-lg border border-white/5 bg-white/[0.02] p-3">
                    <div className="mb-2 flex items-center gap-1.5 text-xs font-medium text-white/60">
                        <Bell size={12} />
                        Notifications this month
                    </div>
                    <ProgressBar used={notifUsed} limit={notifLimit} color="indigo" />
                </div>

                <div className="rounded-lg border border-white/5 bg-white/[0.02] p-3">
                    <div className="mb-2 flex items-center gap-1.5 text-xs font-medium text-white/60">
                        <Globe size={12} />
                        Domains
                    </div>
                    <ProgressBar used={domainCount} limit={domainLimit} color="emerald" />
                </div>
            </div>
        </div>
    );
};

export default PackageCard;