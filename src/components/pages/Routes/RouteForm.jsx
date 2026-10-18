import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { Save, X } from "lucide-react";
import { useEntity } from "@/hooks/useEntity";
import entities from "@/redux/entities";
import MultiSelect from "../../shared/MultiSelect";

const EMPTY_FORM = {
    domainId: "",
    notificationTypeId: "",
    destinations: [],
    description: "",
    active: true,
};

const RouteForm = ({ open, route, saving = false, onClose, onSubmit }) => {
    const domains = useEntity(entities.domains);
    const types = useEntity(entities.notificationTypes);
    const destinations = useEntity(entities.destinations);

    const [form, setForm] = useState(EMPTY_FORM);
    const [errors, setErrors] = useState({});

    const isEdit = !!route;

    useEffect(() => {
        if (!open) return;

        if (route) {
            setForm({
                domainId:
                    route.domainId?._id ?? route.domainId?.id ?? route.domainId ?? "",
                notificationTypeId:
                    route.notificationTypeId?._id ??
                    route.notificationTypeId?.id ??
                    route.notificationTypeId ??
                    "",
                destinations: (route.destinations ?? [])
                    .map((d) => d?._id ?? d?.id ?? d)
                    .filter(Boolean)
                    .map(String),
                description: route.description ?? "",
                active: route.active ?? true,
            });
        } else {
            setForm(EMPTY_FORM);
        }
        setErrors({});
    }, [open, route]);

    useEffect(() => {
        if (!open) return;
        domains.fetchAll({ limit: 100, active: true }).catch(() => { });
        types.fetchAll({ limit: 100, active: true }).catch(() => { });
        destinations.fetchAll({ limit: 100 }).catch(() => { });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);

    const domainOptions = useMemo(
        () =>
            (domains.items ?? [])
                .filter((d) => d.status === "approved" && d.active)
                .map((d) => ({
                    value: d.id,
                    label: d.domain,
                    sublabel: d.name,
                })),
        [domains.items]
    );

    const typeOptions = useMemo(
        () =>
            (types.items ?? [])
                .filter((t) => t.active)
                .map((t) => ({
                    value: t.id,
                    label: t.label,
                    sublabel: `@${t.name}`,
                })),
        [types.items]
    );

    const destinationOptions = useMemo(
        () =>
            (destinations.items ?? []).map((d) => ({
                value: d.id,
                label: d.name,
                sublabel: `${d.type.replace(/_/g, " ")} · ${d.identifier || "runtime"}${d.botId?.name ? ` · ${d.botId.name}` : ""
                    }`,
                badge: d.status,
                badgeType: "approval",
            })),
        [destinations.items]
    );

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

        if (!form.domainId) next.domainId = "Domain is required";
        if (!form.notificationTypeId)
            next.notificationTypeId = "Notification type is required";
        if (form.destinations.length === 0)
            next.destinations = "At least one destination is required";
        if (form.destinations.length > 50)
            next.destinations = "Max 50 destinations per route";

        setErrors(next);
        return Object.keys(next).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        const payload = {
            destinations: form.destinations,
            description: form.description.trim(),
            active: !!form.active,
        };

        /* Domain + type locked on edit */
        if (!isEdit) {
            payload.domainId = form.domainId;
            payload.notificationTypeId = form.notificationTypeId;
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

            <div className="relative z-10 w-full max-w-lg animate-fade-in">
                <form
                    onSubmit={handleSubmit}
                    className="card max-h-[90vh] overflow-y-auto"
                >
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
                            {isEdit ? "Edit Route" : "New Notification Route"}
                        </h3>
                        <p className="text-xs text-muted">
                            {isEdit
                                ? "Domain and type cannot be changed after creation."
                                : "Bind a domain + type pair to one or more destinations."}
                        </p>
                    </div>

                    <div className="space-y-3">
                        <div>
                            <label className="label">
                                Domain
                                {isEdit && (
                                    <span className="ml-1 text-[10px] font-normal text-white/30">
                                        (locked)
                                    </span>
                                )}
                            </label>
                            <select
                                name="domainId"
                                value={form.domainId}
                                onChange={handleChange}
                                disabled={saving || isEdit}
                                className={`select ${errors.domainId ? "input-error" : ""}`}
                            >
                                <option value="">— Select a domain —</option>
                                {domainOptions.map((d) => (
                                    <option key={d.value} value={d.value}>
                                        {d.label}
                                        {d.sublabel ? ` · ${d.sublabel}` : ""}
                                    </option>
                                ))}
                            </select>
                            {errors.domainId && (
                                <p className="error-text">{errors.domainId}</p>
                            )}
                            {domainOptions.length === 0 && !domains.loading && (
                                <p className="mt-1 text-[10px] text-amber-400/80">
                                    No approved domains. Add and wait for approval first.
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="label">
                                Notification Type
                                {isEdit && (
                                    <span className="ml-1 text-[10px] font-normal text-white/30">
                                        (locked)
                                    </span>
                                )}
                            </label>
                            <select
                                name="notificationTypeId"
                                value={form.notificationTypeId}
                                onChange={handleChange}
                                disabled={saving || isEdit}
                                className={`select ${errors.notificationTypeId ? "input-error" : ""}`}
                            >
                                <option value="">— Select a type —</option>
                                {typeOptions.map((t) => (
                                    <option key={t.value} value={t.value}>
                                        {t.label}
                                        {t.sublabel ? ` ${t.sublabel}` : ""}
                                    </option>
                                ))}
                            </select>
                            {errors.notificationTypeId && (
                                <p className="error-text">{errors.notificationTypeId}</p>
                            )}
                        </div>

                        <div>
                            <label className="label">
                                Destinations
                                <span className="ml-1 text-[10px] font-normal text-white/30">
                                    (active only receive delivery)
                                </span>
                            </label>
                            <MultiSelect
                                options={destinationOptions}
                                values={form.destinations}
                                onChange={(vals) =>
                                    setForm((prev) => ({ ...prev, destinations: vals }))
                                }
                                loading={destinations.loading}
                                placeholder="Pick destinations…"
                                emptyText="No destinations available. Create one first."
                            />
                            {errors.destinations && (
                                <p className="error-text">{errors.destinations}</p>
                            )}
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
                                placeholder="Optional note about this route"
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
                                Active (receive notifications)
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
                                    {isEdit ? "Save Changes" : "Submit Route"}
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

export default RouteForm;