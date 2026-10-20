import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
    AlertTriangle,
    Copy,
    Key,
    MoreVertical,
    Plus,
    RefreshCw,
    RotateCw,
    Trash2,
    X,
} from "lucide-react";
import { toast } from "sonner";
import axiosInstance from "@/api/axiosInstance";
import ENDPOINTS from "@/api/endpoints";
import ConfirmModal from "../../shared/ConfirmModal";
import ApiKeyReveal from "./ApiKeyReveal";
import { formatRelative } from "@/utils/formatDate";

const ApiKeyManager = ({ open, domain, onClose }) => {
    const [keys, setKeys] = useState([]);
    const [loading, setLoading] = useState(false);
    const [creating, setCreating] = useState(false);
    const [newKeyName, setNewKeyName] = useState("");
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [revealKey, setRevealKey] = useState(null);
    const [confirmAction, setConfirmAction] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);

    const loadKeys = useCallback(async () => {
        if (!domain?.id) return;
        setLoading(true);
        try {
            const response = await axiosInstance.get(
                ENDPOINTS.domains.keys.list(domain.id)
            );
            setKeys(response?.data?.items ?? []);
        } catch {
            /* interceptor toasts */
        } finally {
            setLoading(false);
        }
    }, [domain?.id]);
    useEffect(() => {
        if (open && domain?.id) {
            loadKeys();
            setShowCreateForm(false);
            setNewKeyName("");
            setRevealKey(null);
            setConfirmAction(null);
        }
    }, [open, domain?.id, loadKeys]);
    if (!open || !domain) return null;

    const isVerified = domain.status === "approved" && domain.verified === true;
    const activeKeyCount = keys.filter((k) => k.active).length;
    const handleCreate = async () => {
        if (!isVerified) {
            toast.error("Domain must be verified by admin first");
            return;
        }

        setCreating(true);
        try {
            const response = await axiosInstance.post(
                ENDPOINTS.domains.keys.create(domain.id),
                { name: newKeyName.trim() || "Default Key" }
            );
            setRevealKey({
                plaintextKey: response.data.plaintextKey,
                keyName: response.data.name,
            });

            setShowCreateForm(false);
            setNewKeyName("");
            await loadKeys();
        } catch {
            /* interceptor toasts */
        } finally {
            setCreating(false);
        }
    };
    const handleRevoke = async () => {
        if (!confirmAction?.key) return;
        setActionLoading(true);
        try {
            await axiosInstance.post(
                ENDPOINTS.domains.keys.revoke(domain.id, confirmAction.key.id),
                { reason: "Manually revoked from dashboard" }
            );
            toast.success("API key revoked");
            setConfirmAction(null);
            await loadKeys();
        } catch {
            /* interceptor toasts */
        } finally {
            setActionLoading(false);
        }
    };
    const handleRotate = async () => {
        if (!confirmAction?.key) return;
        setActionLoading(true);
        try {
            const response = await axiosInstance.post(
                ENDPOINTS.domains.keys.rotate(domain.id, confirmAction.key.id)
            );
            setRevealKey({
                plaintextKey: response.data.plaintextKey,
                keyName: response.data.name,
            });

            setConfirmAction(null);
            await loadKeys();
        } catch {
            /* interceptor toasts */
        } finally {
            setActionLoading(false);
        }
    };

    return createPortal(
        <>
            <div className="fixed inset-0 z-[100] flex items-center justify-center px-3 py-6">
                <div
                    className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                    onClick={onClose}
                />
                <div className="relative z-10 w-full max-w-2xl animate-fade-in">
                    <div className="card max-h-[90vh] overflow-y-auto">
                        <button
                            type="button"
                            onClick={onClose}
                            className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full text-white/40 hover:bg-white/10 hover:text-white"
                            aria-label="Close"
                        >
                            <X size={16} />
                        </button>
                        <div className="mb-3 pr-8">
                            <div className="flex items-center gap-2">
                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
                                    <Key size={18} />
                                </div>
                                <div className="min-w-0">
                                    <h3 className="text-base font-semibold text-gray-100">
                                        API Keys
                                    </h3>
                                    <p className="truncate text-xs text-white/50">
                                        {domain.domain}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Not verified warning */}
                        {!isVerified && (
                            <div className="mb-3 flex items-start gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-200">
                                <AlertTriangle
                                    size={16}
                                    className="mt-0.5 flex-shrink-0 text-amber-400"
                                />
                                <div>
                                    <p className="font-semibold">Domain not verified</p>
                                    <p className="mt-0.5 text-xs text-amber-200/80">
                                        Admin must verify this domain before you can generate API
                                        keys.
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Create form */}
                        {showCreateForm && isVerified && (
                            <div className="mb-3 rounded-lg border border-indigo-500/20 bg-indigo-500/5 p-3">
                                <p className="mb-2 text-sm font-medium text-gray-100">
                                    New API Key
                                </p>
                                <input
                                    type="text"
                                    value={newKeyName}
                                    onChange={(e) => setNewKeyName(e.target.value)}
                                    placeholder="Production Key"
                                    maxLength={60}
                                    className="input mb-2"
                                />
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowCreateForm(false);
                                            setNewKeyName("");
                                        }}
                                        disabled={creating}
                                        className="btn-secondary flex-1"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleCreate}
                                        disabled={creating}
                                        className="btn-primary flex-1"
                                    >
                                        {creating ? (
                                            <>
                                                <span className="h-3 w-3 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                                Generating...
                                            </>
                                        ) : (
                                            <>
                                                <Plus size={14} />
                                                Generate Key
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}
                        {loading && (
                            <div className="flex items-center justify-center py-8">
                                <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/20 border-t-indigo-400" />
                            </div>
                        )}
                        {!loading && keys.length === 0 && (
                            <div className="mb-4 rounded-lg border border-dashed border-white/10 bg-white/[0.02] p-6 text-center">
                                <div className="mb-2 flex justify-center">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500/10 text-indigo-400">
                                        <Key size={18} />
                                    </div>
                                </div>
                                <p className="text-sm font-medium text-gray-100">
                                    No API keys yet
                                </p>
                                <p className="mt-1 text-xs text-white/50">
                                    Generate a key to start using the public API
                                </p>
                            </div>
                        )}
                        {!loading && keys.length > 0 && (
                            <div className="mb-4 space-y-2">
                                {keys.map((key) => (
                                    <KeyRow
                                        key={key.id}
                                        apiKey={key}
                                        onRotate={() =>
                                            setConfirmAction({ type: "rotate", key })
                                        }
                                        onRevoke={() =>
                                            setConfirmAction({ type: "revoke", key })
                                        }
                                    />
                                ))}
                            </div>
                        )}
                        <div className="flex items-center justify-between gap-2 border-t border-white/5 pt-3">
                            <p className="text-[11px] text-white/40">
                                {activeKeyCount} active{" "}
                                {activeKeyCount === 1 ? "key" : "keys"} ·{" "}
                                {keys.filter((k) => !k.active).length} revoked
                            </p>
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={loadKeys}
                                    disabled={loading}
                                    className="btn-ghost btn-sm"
                                >
                                    <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
                                </button>
                                {!showCreateForm && isVerified && (
                                    <button
                                        type="button"
                                        onClick={() => setShowCreateForm(true)}
                                        className="btn-primary btn-sm"
                                    >
                                        <Plus size={13} />
                                        New Key
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ApiKeyReveal
                open={!!revealKey}
                plaintextKey={revealKey?.plaintextKey}
                keyName={revealKey?.keyName}
                onClose={() => setRevealKey(null)}
            />
            <ConfirmModal
                open={!!confirmAction}
                title={
                    confirmAction?.type === "rotate"
                        ? "Rotate API key?"
                        : "Revoke API key?"
                }
                description={
                    confirmAction?.type === "rotate"
                        ? `The current key for "${confirmAction?.key?.name}" will be revoked immediately. You'll get a new key — update your server code before making more requests.`
                        : `The key "${confirmAction?.key?.name}" will stop working immediately. Any app using it will fail with 401.`
                }
                confirmText={
                    confirmAction?.type === "rotate" ? "Rotate Key" : "Revoke Key"
                }
                variant="danger"
                loading={actionLoading}
                onConfirm={
                    confirmAction?.type === "rotate" ? handleRotate : handleRevoke
                }
                onCancel={() => setConfirmAction(null)}
            />
        </>,
        document.body
    );
};

const KeyRow = ({ apiKey, onRotate, onRevoke }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const isExpired = apiKey.expiresAt && new Date(apiKey.expiresAt) < new Date();

    return (
        <div className="rounded-lg border border-white/10 bg-[#0B1220] p-3">
            <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                        <p className="truncate text-sm font-medium text-gray-100">
                            {apiKey.name}
                        </p>
                        {!apiKey.active && (
                            <span className="badge border border-red-500/30 bg-red-500/15 text-red-300">
                                Revoked
                            </span>
                        )}
                        {apiKey.active && isExpired && (
                            <span className="badge border border-amber-500/30 bg-amber-500/15 text-amber-300">
                                Expired
                            </span>
                        )}
                        {apiKey.active && !isExpired && (
                            <span className="badge border border-emerald-500/30 bg-emerald-500/15 text-emerald-300">
                                Active
                            </span>
                        )}
                    </div>

                    <div className="mt-1.5 flex items-center gap-2">
                        <code className="rounded bg-white/5 px-1.5 py-0.5 text-[11px] font-mono text-indigo-300">
                            {apiKey.keyPreview}
                        </code>
                    </div>

                    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[10px] text-white/40">
                        <span>Created {formatRelative(apiKey.createdAt)}</span>
                        {apiKey.lastUsedAt && (
                            <span>Last used {formatRelative(apiKey.lastUsedAt)}</span>
                        )}
                        {apiKey.usageCount > 0 && (
                            <span>{apiKey.usageCount.toLocaleString()} requests</span>
                        )}
                        {apiKey.expiresAt && (
                            <span>Expires {formatRelative(apiKey.expiresAt)}</span>
                        )}
                    </div>
                </div>

                {apiKey.active && !isExpired && (
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => setMenuOpen((v) => !v)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-white/60 hover:bg-white/10 hover:text-white"
                            aria-label="Key actions"
                        >
                            <MoreVertical size={14} />
                        </button>

                        {menuOpen && (
                            <>
                                <div
                                    className="fixed inset-0 z-[1]"
                                    onClick={() => setMenuOpen(false)}
                                />
                                <div className="absolute right-0 top-9 z-10 w-36 overflow-hidden rounded-lg border border-white/10 bg-[#0B1220] p-1 shadow-xl">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setMenuOpen(false);
                                            onRotate();
                                        }}
                                        className="flex w-full items-center gap-2 rounded px-2.5 py-1.5 text-left text-xs text-amber-300 hover:bg-amber-500/10"
                                    >
                                        <RotateCw size={11} />
                                        Rotate
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setMenuOpen(false);
                                            onRevoke();
                                        }}
                                        className="flex w-full items-center gap-2 rounded px-2.5 py-1.5 text-left text-xs text-red-400 hover:bg-red-500/10"
                                    >
                                        <Trash2 size={11} />
                                        Revoke
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ApiKeyManager;