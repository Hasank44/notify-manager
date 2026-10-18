import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Save, X } from "lucide-react";

const EMPTY_FORM = {
    domain: "",
    name: "",
    description: "",
    active: true,
};

const DomainForm = ({ open, domain: dom, saving = false, onClose, onSubmit }) => {
    const [form, setForm] = useState(EMPTY_FORM);
    const [errors, setErrors] = useState({});

    const isEdit = !!dom;

    useEffect(() => {
        if (!open) return;

        if (dom) {
            setForm({
                domain: dom.domain ?? "",
                name: dom.name ?? "",
                description: dom.description ?? "",
                active: dom.active ?? true,
            });
        } else {
            setForm(EMPTY_FORM);
        }
        setErrors({});
    }, [open, dom]);

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

        const normalized = form.domain
            .trim()
            .toLowerCase()
            .replace(/^https?:\/\//, "")
            .replace(/^www\./, "")
            .split("/")[0];

        if (!normalized) {
            next.domain = "Domain is required";
        } else if (
            !/^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)+$/.test(
                normalized
            )
        ) {
            next.domain = "Enter a valid domain, e.g. example.com";
        }

        if (!form.name.trim()) {
            next.name = "Name is required";
        } else if (form.name.length > 120) {
            next.name = "Max 120 characters";
        }

        setErrors(next);
        return Object.keys(next).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        const payload = {
            name: form.name.trim(),
            description: form.description.trim(),
            active: !!form.active,
            domain: form.domain
                .trim()
                .toLowerCase()
                .replace(/^https?:\/\//, "")
                .replace(/^www\./, "")
                .split("/")[0],
        };

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
                            {isEdit ? "Edit Domain" : "New Domain"}
                        </h3>
                        <p className="text-xs text-muted">
                            {isEdit
                                ? "Changes may require re-approval by admin."
                                : "Your domain will be submitted for admin approval."}
                        </p>
                    </div>

                    <div className="space-y-3">
                        <div>
                            <label className="label">
                                Domain
                                <span className="ml-1 text-[10px] font-normal text-white/30">
                                    (no http:// or www)
                                </span>
                            </label>
                            <input
                                name="domain"
                                value={form.domain}
                                onChange={handleChange}
                                disabled={saving}
                                placeholder="example.com"
                                className={`input ${errors.domain ? "input-error" : ""}`}
                            />
                            {errors.domain && <p className="error-text">{errors.domain}</p>}
                        </div>

                        <div>
                            <label className="label">Display Name</label>
                            <input
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                disabled={saving}
                                placeholder="My Website"
                                maxLength={120}
                                className={`input ${errors.name ? "input-error" : ""}`}
                            />
                            {errors.name && <p className="error-text">{errors.name}</p>}
                        </div>

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
                                placeholder="Optional context about this domain"
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
                                Active (accept notifications)
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
                                    Saving…
                                </>
                            ) : (
                                <>
                                    <Save size={14} />
                                    {isEdit ? "Save Changes" : "Submit Domain"}
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

export default DomainForm;