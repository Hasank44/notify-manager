import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { Save, X } from "lucide-react";
import { useEntity } from "@/hooks/useEntity";
import entities from "@/redux/entities";
import axiosInstance from "@/api/axiosInstance";
import ENDPOINTS from "@/api/endpoints";

const EMPTY_FORM = {
  domainId: "",
  botId: "",
  externalUserId: "",
  chatId: "",
  name: "",
  email: "",
  phone: "",
};

const UserSubscriptionForm = ({
  open,
  subscription: sub,
  saving = false,
  onClose,
  onSubmit,
}) => {
  const domains = useEntity(entities.domains);
  const bots = useEntity(entities.bots);

  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [systemBot, setSystemBot] = useState(null);

  const isEdit = !!sub;

  /* ── Prefill on edit ───────────────────────────────────── */
  useEffect(() => {
    if (!open) return;

    if (sub) {
      setForm({
        domainId: sub.domainId?._id ?? sub.domainId?.id ?? sub.domainId ?? "",
        botId: sub.botId?._id ?? sub.botId?.id ?? sub.botId ?? "",
        externalUserId: sub.externalUserId ?? "",
        chatId: sub.chatId ?? "",
        name: sub.name ?? "",
        email: sub.email ?? "",
        phone: sub.phone ?? "",
      });
    } else {
      setForm(EMPTY_FORM);
    }
    setErrors({});
  }, [open, sub]);

  /* ── Fetch domains + bots + system bot (ONCE per open) ── */
  useEffect(() => {
    if (!open) return;

    domains.fetchAll({ limit: 100, active: true }).catch(() => {});
    bots.fetchAll({ limit: 100, active: true }).catch(() => {});

    axiosInstance
      .get(ENDPOINTS.systemBot)
      .then((res) => setSystemBot(res?.data ?? null))
      .catch(() => setSystemBot(null));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  /* ── Combined bot list: own bots + system bot ─────────── */
  const botList = useMemo(() => {
    const own = (bots.items ?? []).filter(
      (b) => b.active && b.status === "approved"
    );
    if (!systemBot) return own;
    const exists = own.some((b) => String(b.id) === String(systemBot.id));
    if (exists) return own;
    return [systemBot, ...own];
  }, [bots.items, systemBot]);

  if (!open) return null;

  const approvedDomains = (domains.items ?? []).filter(
    (d) => d.status === "approved" && d.active
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const next = {};

    if (!form.domainId) next.domainId = "Domain is required";
    if (!form.botId) next.botId = "Bot is required";

    if (!isEdit) {
      if (!form.externalUserId.trim()) {
        next.externalUserId = "External ID is required";
      } else if (form.externalUserId.length > 120) {
        next.externalUserId = "Max 120 characters";
      }
    }

    const chatId = form.chatId.trim();
    if (!chatId) {
      next.chatId = "Chat ID is required";
    } else if (!/^-?\d{5,20}$/.test(chatId)) {
      next.chatId = "5-20 digits (may start with -)";
    }

    if (
      form.email.trim() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())
    ) {
      next.email = "Invalid email format";
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      domainId: form.domainId,
      botId: form.botId,
      chatId: form.chatId.trim(),
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      phone: form.phone.trim(),
    };

    if (!isEdit) {
      payload.externalUserId = form.externalUserId.trim();
    }

    try {
      await onSubmit(payload);
    } catch {
      /* interceptor toasts */
    }
  };

  const submitDisabled =
    saving || approvedDomains.length === 0 || botList.length === 0;

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
              {isEdit ? "Edit Subscriber" : "Add B2C Subscriber"}
            </h3>
            <p className="text-xs text-muted">
              {isEdit
                ? "Update customer info and status."
                : "Register a customer so they can receive notifications."}
            </p>
          </div>

          <div className="space-y-3">
            <div>
              <label className="label">Domain</label>
              <select
                name="domainId"
                value={form.domainId}
                onChange={handleChange}
                disabled={saving || isEdit}
                className={`select ${errors.domainId ? "input-error" : ""}`}
              >
                <option value="">— Select a domain —</option>
                {approvedDomains.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.domain}
                  </option>
                ))}
              </select>
              {errors.domainId && (
                <p className="error-text">{errors.domainId}</p>
              )}
              {approvedDomains.length === 0 && !domains.loading && (
                <p className="mt-1 text-[10px] text-amber-400/80">
                  No approved domains. Add and wait for approval first.
                </p>
              )}
            </div>

            <div>
              <label className="label">Bot</label>
              <select
                name="botId"
                value={form.botId}
                onChange={handleChange}
                disabled={saving || isEdit}
                className={`select ${errors.botId ? "input-error" : ""}`}
              >
                <option value="">— Select a bot —</option>
                {botList.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                    {b.username ? ` (@${b.username})` : ""}
                    {b.isSystem ? " · System" : ""}
                  </option>
                ))}
              </select>
              {errors.botId && <p className="error-text">{errors.botId}</p>}
              {botList.length === 0 && !bots.loading && (
                <p className="mt-1 text-[10px] text-amber-400/80">
                  No approved bots available.
                </p>
              )}
            </div>

            <div>
              <label className="label">
                External User ID
                {isEdit && (
                  <span className="ml-1 text-[10px] font-normal text-white/30">
                    (locked)
                  </span>
                )}
              </label>
              <input
                name="externalUserId"
                value={form.externalUserId}
                onChange={handleChange}
                disabled={saving || isEdit}
                placeholder="customer-hasina"
                maxLength={120}
                className={`input font-mono text-sm ${errors.externalUserId ? "input-error" : ""}`}
              />
              {errors.externalUserId && (
                <p className="error-text">{errors.externalUserId}</p>
              )}
              <p className="mt-1 text-[10px] text-white/40">
                Your own identifier for this customer (used in notify data.userId)
              </p>
            </div>

            <div>
              <label className="label">Chat ID</label>
              <input
                name="chatId"
                value={form.chatId}
                onChange={handleChange}
                disabled={saving}
                placeholder="5114883679 or -1001234567890"
                maxLength={32}
                className={`input font-mono text-sm ${errors.chatId ? "input-error" : ""}`}
              />
              {errors.chatId && <p className="error-text">{errors.chatId}</p>}
              <p className="mt-1 text-[10px] text-white/40">
                Customer's Telegram chat ID
              </p>
            </div>

            <div>
              <label className="label">
                Name
                <span className="ml-1 text-[10px] font-normal text-white/30">
                  (optional)
                </span>
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                disabled={saving}
                placeholder="Hasina"
                maxLength={120}
                className="input"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="label">
                  Email
                  <span className="ml-1 text-[10px] font-normal text-white/30">
                    (optional)
                  </span>
                </label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  disabled={saving}
                  placeholder="you@example.com"
                  className={`input ${errors.email ? "input-error" : ""}`}
                />
                {errors.email && <p className="error-text">{errors.email}</p>}
              </div>

              <div>
                <label className="label">
                  Phone
                  <span className="ml-1 text-[10px] font-normal text-white/30">
                    (optional)
                  </span>
                </label>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  disabled={saving}
                  placeholder="01712345678"
                  maxLength={20}
                  className="input"
                />
              </div>
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
            <button
              type="submit"
              disabled={submitDisabled}
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
                  {isEdit ? "Save Changes" : "Add Subscriber"}
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

export default UserSubscriptionForm;