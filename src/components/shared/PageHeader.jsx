import { useNavigate } from "react-router";
import { ArrowLeft, RefreshCw } from "lucide-react";

/* ─────────────────────────────────────────────────────────────
 * PageHeader — consistent header bar across all admin pages.
 *
 * Props:
 *   title         — page name shown in the middle (required)
 *   onBack        — custom back handler (default: navigate(-1))
 *   onRefresh     — refresh handler (if omitted, no refresh button)
 *   refreshing    — spinner state for refresh button
 *   backLabel     — optional text next to back arrow
 *   refreshLabel  — optional text next to refresh icon
 *   actions       — extra buttons on the right side (ReactNode)
 * ───────────────────────────────────────────────────────────── */

const PageHeader = ({
    title,
    onBack,
    onRefresh,
    refreshing = false,
    backLabel = "",
    refreshLabel = "",
    actions = null,
}) => {
    const navigate = useNavigate();
    const handleBack = onBack ?? (() => navigate(-1));

    return (
        <div className="flex items-center justify-between gap-2 rounded-lg border border-white/10 bg-gradient-to-br from-[#141827] to-[#0b0f1a] p-2 shadow-xl">
            <button
                type="button"
                onClick={handleBack}
                className="btn-secondary btn-sm flex-shrink-0"
            >
                <ArrowLeft size={18} />
                {backLabel && <span className="hidden sm:inline">{backLabel}</span>}
            </button>
            <span className="flex-1 truncate px-2 text-center text-sm font-semibold text-white">
                {title}
            </span>
            <div className="flex flex-shrink-0 items-center gap-1">
                {actions}
                {onRefresh && (
                    <button
                        type="button"
                        onClick={onRefresh}
                        disabled={refreshing}
                        className="btn-secondary btn-sm"
                    >
                        <RefreshCw
                            size={14}
                            className={refreshing ? "animate-spin" : ""}
                        />
                        {refreshLabel && (
                            <span className="hidden sm:inline">{refreshLabel}</span>
                        )}
                    </button>
                )}
            </div>
        </div>
    );
};

export default PageHeader;