import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Save, X } from "lucide-react";

const TOKEN_PATTERN = /^\d{5,}:[A-Za-z0-9_-]{20,}$/;
const USERNAME_PATTERN = /^[A-Za-z0-9_]{3,64}$/;

const EMPTY_FORM = {
    name: "",
    username: "",
    token: "",
    active: true,
};

const BotForm = ({ open, bot, saving = false, onClose, onSubmit }) => {
    const [form, setForm] = useState(EMPTY_FORM);
    const [errors, setErrors] = useState({});

    const isEdit = !!bot;

    useEffect(() => {
        if (!open) return;

        if (bot) {
            setForm({
                name: bot.name ?? "",
                username: bot.username ?? "",
                token: "",
                active: bot.active ?? true,
            });
        } else {
            setForm(EMPTY_FORM);
        }
        setErrors({});
    }, [open, bot]);

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

        if (form.username.trim()) {
            const username = form.username.trim().replace(/^@/, "");
            if (!USERNAME_PATTERN.test(username)) {
                next.username = "3-64 chars: letters, numbers, underscore only";
            }
        }

        if (!isEdit) {
            if (!form.token.trim()) {
                next.token = "Token is required";
            } else if (!TOKEN_PATTERN.test(form.token.trim())) {
                next.token = "Invalid token format (e.g. 123456:ABC-DEF…)";
            }
        } else if (form.token.trim() && !TOKEN_PATTERN.test(form.token.trim())) {
            next.token = "Invalid token format";
        }

        setErrors(next);
        return Object.keys(next).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        const payload = {
            name: form.name.trim(),
            username: form.username.trim().replace(/^@/, "").toLowerCase(),
            active: !!form.active,
        };

        if (form.token.trim()) {
            payload.token = form.token.trim();
        }

        try {
            await onSubmit(payload);
        } catch {
            /* interceptor toasts */
        }
    };

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
                            {isEdit ? "Edit Bot" : "New Telegram Bot"}
                        </h3>
                        <p className="text-xs text-muted">
                            {isEdit
                                ? "Leave the token blank to keep the current one."
                                : "Your bot will be submitted for admin approval."}
                        </p>
                    </div>

                    <div className="space-y-3">
                        <div>
                            <label className="label">Bot Name</label>
                            <input
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                disabled={saving}
                                placeholder="My Bot"
                                maxLength={120}
                                className={`input ${errors.name ? "input-error" : ""}`}
                            />
                            {errors.name && <p className="error-text">{errors.name}</p>}
                        </div>

                        <div>
                            <label className="label">
                                Bot Username
                                <span className="ml-1 text-[10px] font-normal text-white/30">
                                    (optional)
                                </span>
                            </label>
                            <div className="relative">
                                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-white/40">
                                    @
                                </span>
                                <input
                                    name="username"
                                    value={form.username}
                                    onChange={handleChange}
                                    disabled={saving}
                                    placeholder="my_notif_bot"
                                    maxLength={64}
                                    className={`input pl-7 ${errors.username ? "input-error" : ""}`}
                                />
                            </div>
                            {errors.username && <p className="error-text">{errors.username}</p>}
                            <p className="mt-1 text-[10px] text-white/40">
                                Auto-detected from Telegram if left blank
                            </p>
                        </div>

                        <div>
                            <label className="label">
                                Bot Token
                                {isEdit && (
                                    <span className="ml-1 text-[10px] font-normal text-white/30">
                                        (leave blank to keep current)
                                    </span>
                                )}
                            </label>
                            <input
                                name="token"
                                type="password"
                                value={form.token}
                                onChange={handleChange}
                                disabled={saving}
                                placeholder={
                                    isEdit
                                        ? bot?.tokenPreview
                                            ? `Current: ${bot.tokenPreview}`
                                            : "••••••••"
                                        : "123456789:ABC-DEF…"
                                }
                                autoComplete="off"
                                className={`input font-mono text-xs ${errors.token ? "input-error" : ""}`}
                            />
                            {errors.token && <p className="error-text">{errors.token}</p>}
                            <p className="mt-1 text-[10px] text-white/40">
                                Get this from @BotFather. Never share it publicly.
                            </p>
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
                                Active (available for delivery)
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
                        <button type="submit" disabled={saving} className="btn-primary">
                            {saving ? (
                                <>
                                    <span className="h-3 w-3 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                    Verifying…
                                </>
                            ) : (
                                <>
                                    <Save size={14} />
                                    {isEdit ? "Save Changes" : "Submit Bot"}
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

export default BotForm;