import { AlertTriangle, CheckCircle2, Info, XCircle } from "lucide-react";

const VARIANTS = {
    info: {
        icon: Info,
        className: "border-indigo-500/30 bg-indigo-500/10 text-indigo-300",
        iconClass: "text-indigo-400",
    },
    success: {
        icon: CheckCircle2,
        className: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
        iconClass: "text-emerald-400",
    },
    warning: {
        icon: AlertTriangle,
        className: "border-amber-500/30 bg-amber-500/10 text-amber-300",
        iconClass: "text-amber-400",
    },
    danger: {
        icon: XCircle,
        className: "border-red-500/30 bg-red-500/10 text-red-300",
        iconClass: "text-red-400",
    },
};

const Callout = ({ variant = "info", title, children }) => {
    const config = VARIANTS[variant] ?? VARIANTS.info;
    const Icon = config.icon;
    return (
        <div className={`my-3 flex gap-2.5 rounded-lg border p-3 ${config.className}`}>
            <Icon size={16} className={`mt-0.5 flex-shrink-0 ${config.iconClass}`} />
            <div className="min-w-0 flex-1 text-sm">
                {title && <p className="font-semibold">{title}</p>}
                <div className={title ? "mt-1" : ""}>{children}</div>
            </div>
        </div>
    );
};

export default Callout;