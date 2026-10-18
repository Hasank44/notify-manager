/* Same structure as admin's StatCard — copy of admin version */

const VARIANTS = {
    default: {
        iconBg: "bg-indigo-500/10",
        iconColor: "text-indigo-400",
        valueColor: "text-gray-100",
    },
    success: {
        iconBg: "bg-emerald-500/10",
        iconColor: "text-emerald-400",
        valueColor: "text-emerald-300",
    },
    danger: {
        iconBg: "bg-red-500/10",
        iconColor: "text-red-400",
        valueColor: "text-red-300",
    },
    warning: {
        iconBg: "bg-amber-500/10",
        iconColor: "text-amber-400",
        valueColor: "text-amber-300",
    },
    info: {
        iconBg: "bg-cyan-500/10",
        iconColor: "text-cyan-400",
        valueColor: "text-cyan-300",
    },
};

const StatCard = ({
    icon: Icon,
    label,
    value,
    subtitle = "",
    variant = "default",
    loading = false,
    onClick = null,
}) => {
    const config = VARIANTS[variant] ?? VARIANTS.default;
    const Component = onClick ? "button" : "div";

    const displayValue =
        value === null || value === undefined
            ? "—"
            : typeof value === "number"
                ? value.toLocaleString()
                : value;

    return (
        <Component
            onClick={onClick}
            type={onClick ? "button" : undefined}
            className={`card relative w-full overflow-hidden text-left ${onClick ? "card-hover cursor-pointer" : ""
                }`}
        >
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium uppercase tracking-wider text-white/50">
                        {label}
                    </p>

                    {loading ? (
                        <div className="mt-2 h-8 w-20 animate-pulse rounded bg-white/10" />
                    ) : (
                        <p className={`mt-2 text-3xl font-bold ${config.valueColor}`}>
                            {displayValue}
                        </p>
                    )}

                    {subtitle && (
                        <p className="mt-1 text-xs text-white/40">{subtitle}</p>
                    )}
                </div>

                {Icon && (
                    <div
                        className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg ${config.iconBg} ${config.iconColor}`}
                    >
                        <Icon size={20} />
                    </div>
                )}
            </div>
        </Component>
    );
};

export default StatCard;