import { useEffect, useState, useMemo } from "react";
import { createPortal } from "react-dom";
import { AlertTriangle, Save, X } from "lucide-react";
import { useEntity } from "@/hooks/useEntity";
import entities from "@/redux/entities";
import axiosInstance from "@/api/axiosInstance";
import ENDPOINTS from "@/api/endpoints";
import {
    DESTINATION_TYPES,
    STATIC_DESTINATION_TYPES,
} from "@/utils/constants";

const IDENTIFIER_RULES = {
    user: {
        hint: "Positive Telegram user ID, e.g. 5114883679",
        placeholder: "5114883679",
        pattern: /^\d{5,20}$/,
        errorMsg: "5-20 digits (positive)",
    },
    group: {
        hint: "Telegram group chat ID, usually negative, e.g. -1001234567890",
        placeholder: "-1001234567890",
        pattern: /^-?\d{5,20}$/,
        errorMsg: "5-20 digits (may start with -)",
    },
    channel: {
        hint: "Telegram channel chat ID, usually negative, e.g. -1009876543210",
        placeholder: "-1009876543210",
        pattern: /^-?\d{5,20}$/,
        errorMsg: "5-20 digits (may start with -)",
    },
    bot: {
        hint: "Bot destination identifier string (max 64 chars)",
        placeholder: "unique-identifier",
        pattern: /^.{1,64}$/,
        errorMsg: "1-64 characters",
    },
};

const EMPTY_FORM = {
    name: "",
    type: "user",
    identifier: "",
    botId: "",
    description: "",
    active: true,
};

const extractBotId = (botIdField) => {
    if (!botIdField) return "";
    if (typeof botIdField === "string") return botIdField;
    return botIdField.id ?? botIdField._id ?? "";
};

const DestinationForm = ({
    open,
    destination: dest,
    saving = false,
    onClose,
    onSubmit,
}) => {
    const bots = useEntity(entities.bots);

    const [form, setForm] = useState(EMPTY_FORM);
    const [errors, setErrors] = useState({});
    const [systemBot, setSystemBot] = useState(null);

    const isEdit = !!dest;

    const isDynamic = !STATIC_DESTINATION_TYPES.includes(form.type);
    const rule = isDynamic
        ? null
        : IDENTIFIER_RULES[form.type] ?? IDENTIFIER_RULES.user;

    /* Prefill */
    useEffect(() => {
        if (!open) return;
        if (dest) {
            setForm({
                name: dest.name ?? "",
                type: dest.type ?? "user",
                identifier: dest.identifier ?? "",
                botId: extractBotId(dest.botId),
                description: dest.description ?? "",
                active: dest.active ?? true,
            });
        } else {
            setForm(EMPTY_FORM);
        }
        setErrors({});
    }, [open, dest]);

    /* Fetch own bots + system bot */
    useEffect(() => {
        if (!open) return;

        bots.fetchAll({ limit: 100 }).catch((err) => {
            console.error("[DestinationForm] Failed to fetch bots:", err);
        });

        /* System bot — silent, may not exist */
        axiosInstance
            .get(ENDPOINTS.systemBot)
            .then((res) => setSystemBot(res?.data ?? null))
            .catch(() => setSystemBot(null));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);

    /* Re-validate identifier when type changes */
    useEffect(() => {
        if (!open) return;
        if (errors.identifier && form.identifier && !isDynamic) {
            const newRule = IDENTIFIER_RULES[form.type];
            if (newRule?.pattern.test(form.identifier.trim())) {
                setErrors((prev) => ({ ...prev, identifier: "" }));
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [form.type, open]);

    /* Combined bot list: own bots + system bot */
    const botList = useMemo(() => {
        const own = bots.items ?? [];
        if (!systemBot) return own;
        const exists = own.some((b) => String(b.id) === String(systemBot.id));
        if (exists) return own;
        return [systemBot, ...own];
    }, [bots.items, systemBot]);

    if (!open) return null;

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const validate = () => {
        const next = {};

        if (!form.name.trim()) {
            next.name = "Name is required";
        } else if (form.name.length > 120) {
            next.name = "Max 120 characters";
        }

        if (!form.botId) next.botId = "Bot is required";

        if (!isDynamic) {
            const identifier = form.identifier.trim();
            if (!identifier) {
                next.identifier = "Identifier is required";
            } else if (!rule.pattern.test(identifier)) {
                next.identifier = rule.errorMsg;
            }
        }

        setErrors(next);
        return Object.keys(next).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        const payload = {
            name: form.name.trim(),
            type: form.type,
            identifier: isDynamic ? "" : form.identifier.trim(),
            botId: form.botId,
            description: form.description.trim(),
            active: !!form.active,
        };

        try {
            await onSubmit(payload);
        } catch {
            /* interceptor toasts */
        }
    };

    const botsLoading = bots.loading;
    const botsError = bots.error;
    const noBots = !botsLoading && botList.length === 0;

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-6">
            <div
                className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                onClick={() => !saving && onClose()}
            />

            <div className="relative z-10 w-full max-w-md animate-fade-in">
                <form onSubmit={handleSubmit} className="card">
                    <button
                        type="button"
                        onClick={() => !saving && onClose()}
                        disabled={saving}
                        className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full text-white/40 hover:bg-white/10 hover:text-white disabled:opacity-50"
                        aria-label="Close"
                    >
                        <X size={16} />
                    </button>

                    <div className="mb-4 pr-8">
                        <h3 className="text-base font-semibold text-gray-100">
                            {isEdit ? "Edit Destination" : "New Destination"}
                        </h3>
                        <p className="text-xs text-muted">
                            {isEdit
                                ? "Changes may require re-approval by admin."
                                : "New destinations are submitted for admin approval."}
                        </p>
                    </div>

                    {botsError && (
                        <div className="mb-3 flex items-start gap-2 rounded-lg border border-red-500/30 bg-red-500/10 p-2.5 text-xs">
                            <AlertTriangle
                                size={14}
                                className="mt-0.5 flex-shrink-0 text-red-400"
                            />
                            <div className="min-w-0 flex-1">
                                <p className="font-medium text-red-300">Failed to load bots</p>
                                <p className="mt-0.5 text-red-300/70">{String(botsError)}</p>
                            </div>
                        </div>
                    )}

                    <div className="space-y-3">
                        <div>
                            <label className="label">Name</label>
                            <input
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                disabled={saving}
                                placeholder="My Personal Chat"
                                maxLength={120}
                                className={`input ${errors.name ? "input-error" : ""}`}
                            />
                            {errors.name && <p className="error-text">{errors.name}</p>}
                        </div>

                        <div>
                            <label className="label">Type</label>
                            <select
                                name="type"
                                value={form.type}
                                onChange={handleChange}
                                disabled={saving}
                                className="select capitalize"
                            >
                                {DESTINATION_TYPES.map((t) => (
                                    <option key={t} value={t}>
                                        {t.replace(/_/g, " ")}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="label">
                                Bot
                                {botsLoading && (
                                    <span className="ml-1 text-[10px] font-normal text-indigo-400">
                                        (loading…)
                                    </span>
                                )}
                            </label>
                            <select
                                name="botId"
                                value={form.botId}
                                onChange={handleChange}
                                disabled={saving || botsLoading}
                                className={`select ${errors.botId ? "input-error" : ""}`}
                            >
                                <option value="">— Select a bot —</option>
                                {botList.map((b) => (
                                    <option key={b.id} value={b.id}>
                                        {b.name}
                                        {b.username ? ` (@${b.username})` : ""}
                                        {b.isSystem ? " · System" : ""}
                                        {!b.active ? " · Inactive" : ""}
                                    </option>
                                ))}
                            </select>
                            {errors.botId && <p className="error-text">{errors.botId}</p>}
                            {noBots && !botsError && (
                                <p className="mt-1 text-[10px] text-amber-400/80">
                                    No bots available. Contact admin to enable a system bot.
                                </p>
                            )}
                        </div>

                        {!isDynamic && (
                            <div>
                                <label className="label">Identifier</label>
                                <input
                                    name="identifier"
                                    value={form.identifier}
                                    onChange={handleChange}
                                    disabled={saving}
                                    placeholder={rule?.placeholder ?? ""}
                                    maxLength={64}
                                    className={`input font-mono text-sm ${errors.identifier ? "input-error" : ""}`}
                                />
                                {errors.identifier && (
                                    <p className="error-text">{errors.identifier}</p>
                                )}
                                <p className="mt-1 text-[10px] text-white/40">
                                    {rule?.hint ?? ""}
                                </p>
                            </div>
                        )}

                        {isDynamic && (
                            <div className="rounded-lg border border-indigo-500/20 bg-indigo-500/5 p-2.5 text-xs">
                                <p className="font-medium text-indigo-300">
                                    {form.type === "user_dynamic"
                                        ? "Single dynamic — resolves one customer per notification"
                                        : "Broadcast — sends to all active subscribers of the domain"}
                                </p>
                                <p className="mt-0.5 text-white/60">
                                    Chat ID is resolved at runtime from User Subscriptions.
                                </p>
                            </div>
                        )}

                        <div>
                            <label className="label">
                                Description
                                <span className="ml-1 text-[10px] font-normal text-white/30">
                                    (optional)
                                </span>
                            </label>
                            <textarea
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                disabled={saving}
                                rows={2}
                                maxLength={500}
                                className="input resize-none"
                                placeholder="Note about this destination"
                            />
                        </div>

                        <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2">
                            <input
                                type="checkbox"
                                name="active"
                                checked={form.active}
                                onChange={handleChange}
                                disabled={saving}
                                className="h-4 w-4 rounded border-white/20 bg-white/5 accent-indigo-500"
                            />
                            <span className="text-sm text-gray-200">
                                Active (available for routing)
                            </span>
                        </label>
                    </div>

                    <div className="mt-4 flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={saving}
                            className="btn-secondary"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={saving || (noBots && !isEdit)}
                            className="btn-primary"
                        >
                            {saving ? (
                                <>
                                    <span className="h-3 w-3 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                    Saving…
                                </>
                            ) : (
                                <>
                                    <Save size={14} />
                                    {isEdit ? "Save Changes" : "Submit Destination"}
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
};

export default DestinationForm;