import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { CreditCard, Send, X } from "lucide-react";

const PAYMENT_METHODS = [
    { value: "manual", label: "Manual / Bank Transfer" },
    { value: "bkash", label: "bKash" },
    { value: "nagad", label: "Nagad" },
    { value: "stripe", label: "Card (Stripe)" },
    { value: "bank", label: "Bank Transfer" },
    { value: "other", label: "Other" },
];

const EMPTY_FORM = {
    paymentMethod: "manual",
    paymentRef: "",
    paymentProof: "",
    userNote: "",
};

const UpgradeModal = ({ open, pkg, saving = false, onClose, onSubmit }) => {
    const [form, setForm] = useState(EMPTY_FORM);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (open) {
            setForm(EMPTY_FORM);
            setErrors({});
        }
    }, [open, pkg?.id]);

    if (!open || !pkg) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const validate = () => {
        const next = {};
        if (!form.paymentMethod) next.paymentMethod = "Select a payment method";
        if (form.paymentRef.length > 200) next.paymentRef = "Too long";
        if (form.paymentProof.length > 500) next.paymentProof = "Too long";
        if (form.userNote.length > 500) next.userNote = "Too long";
        setErrors(next);
        return Object.keys(next).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        try {
            await onSubmit({
                packageId: pkg.id,
                paymentMethod: form.paymentMethod,
                paymentRef: form.paymentRef.trim(),
                paymentProof: form.paymentProof.trim(),
                userNote: form.userNote.trim(),
            });
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
                            Request Upgrade
                        </h3>
                        <p className="text-xs text-muted">
                            Subscribe to <span className="font-medium text-indigo-300">{pkg.label}</span>{" "}
                            — {pkg.currency} {pkg.price}/{pkg.billingPeriod}
                        </p>
                    </div>

                    <div className="mb-4 rounded-lg border border-indigo-500/20 bg-indigo-500/5 p-3 text-xs">
                        <p className="font-medium text-indigo-300">How it works</p>
                        <ol className="mt-1 list-inside list-decimal space-y-0.5 text-white/60">
                            <li>Submit this form with your payment details</li>
                            <li>Admin verifies your payment</li>
                            <li>Your plan activates automatically</li>
                        </ol>
                    </div>

                    <div className="space-y-3">
                        <div>
                            <label className="label">Payment Method</label>
                            <select
                                name="paymentMethod"
                                value={form.paymentMethod}
                                onChange={handleChange}
                                disabled={saving}
                                className="select"
                            >
                                {PAYMENT_METHODS.map((m) => (
                                    <option key={m.value} value={m.value}>
                                        {m.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="label">
                                Transaction Reference
                                <span className="ml-1 text-[10px] font-normal text-white/30">
                                    (optional)
                                </span>
                            </label>
                            <input
                                name="paymentRef"
                                value={form.paymentRef}
                                onChange={handleChange}
                                disabled={saving}
                                placeholder="TXN-12345 or TrxID"
                                maxLength={200}
                                className={`input ${errors.paymentRef ? "input-error" : ""}`}
                            />
                            {errors.paymentRef && (
                                <p className="error-text">{errors.paymentRef}</p>
                            )}
                        </div>

                        <div>
                            <label className="label">
                                Payment Proof URL
                                <span className="ml-1 text-[10px] font-normal text-white/30">
                                    (optional)
                                </span>
                            </label>
                            <input
                                name="paymentProof"
                                value={form.paymentProof}
                                onChange={handleChange}
                                disabled={saving}
                                placeholder="https://imgur.com/…"
                                maxLength={500}
                                className={`input ${errors.paymentProof ? "input-error" : ""}`}
                            />
                            <p className="mt-1 text-[10px] text-white/40">
                                Screenshot or receipt link (Google Drive, imgur, etc.)
                            </p>
                        </div>

                        <div>
                            <label className="label">
                                Note for Admin
                                <span className="ml-1 text-[10px] font-normal text-white/30">
                                    (optional)
                                </span>
                            </label>
                            <textarea
                                name="userNote"
                                value={form.userNote}
                                onChange={handleChange}
                                disabled={saving}
                                rows={3}
                                maxLength={500}
                                className="input resize-none"
                                placeholder="Any additional info about your payment"
                            />
                        </div>
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
                                    Submitting…
                                </>
                            ) : (
                                <>
                                    <Send size={14} /> Submit Request
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

export default UpgradeModal;