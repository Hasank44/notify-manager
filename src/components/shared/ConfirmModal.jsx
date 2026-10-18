import { useEffect } from "react";
import { createPortal } from "react-dom";
import { AlertTriangle, X } from "lucide-react";

/* ─────────────────────────────────────────────────────────────
 * ConfirmModal
 *
 * Usage:
 *   <ConfirmModal
 *     open={open}
 *     title="Delete domain?"
 *     description="This cannot be undone."
 *     confirmText="Delete"
 *     variant="danger"
 *     loading={loading}
 *     onConfirm={() => …}
 *     onCancel={() => setOpen(false)}
 *   />
 * ───────────────────────────────────────────────────────────── */

const VARIANTS = {
    danger: {
        icon: AlertTriangle,
        iconColor: "text-red-400",
        iconBg: "bg-red-500/15",
        confirmClass: "btn-danger",
    },
    primary: {
        icon: AlertTriangle,
        iconColor: "text-indigo-400",
        iconBg: "bg-indigo-500/15",
        confirmClass: "btn-primary",
    },
};

const ConfirmModal = ({
    open,
    title = "Are you sure?",
    description = "",
    confirmText = "Confirm",
    cancelText = "Cancel",
    variant = "danger",
    loading = false,
    onConfirm,
    onCancel,
    children = null,
}) => {
    useEffect(() => {
        if (!open) return;
        const handleKey = (e) => {
            if (e.key === "Escape" && !loading) onCancel?.();
        };
        window.addEventListener("keydown", handleKey);
        document.body.style.overflow = "hidden";
        return () => {
            window.removeEventListener("keydown", handleKey);
            document.body.style.overflow = "";
        };
    }, [open, loading, onCancel]);

    if (!open) return null;

    const config = VARIANTS[variant] ?? VARIANTS.danger;
    const Icon = config.icon;

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-3 py-5">
            <div
                className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                onClick={() => !loading && onCancel?.()}
            />
            <div className="relative z-10 w-full max-w-md animate-fade-in">
                <div className="card">
                    <button
                        type="button"
                        onClick={() => !loading && onCancel?.()}
                        disabled={loading}
                        className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full text-white/40 transition hover:bg-white/10 hover:text-white disabled:opacity-50"
                        aria-label="Close"
                    >
                        <X size={16} />
                    </button>

                    <div className="flex items-start gap-3 pr-8">
                        <div
                            className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${config.iconBg} ${config.iconColor}`}
                        >
                            <Icon size={20} />
                        </div>
                        <div className="min-w-0 flex-1">
                            <h3 className="text-base font-semibold text-gray-100">{title}</h3>
                            {description && (
                                <p className="mt-1 text-sm text-muted">{description}</p>
                            )}
                            {children && <div className="mt-3">{children}</div>}
                        </div>
                    </div>

                    <div className="mt-5 flex items-center justify-end gap-2">
                        <button
                            type="button"
                            onClick={onCancel}
                            disabled={loading}
                            className="btn-secondary"
                        >
                            {cancelText}
                        </button>
                        <button
                            type="button"
                            onClick={onConfirm}
                            disabled={loading}
                            className={config.confirmClass}
                        >
                            {loading ? (
                                <>
                                    <span className="h-3 w-3 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                                    Working…
                                </>
                            ) : (
                                confirmText
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default ConfirmModal;