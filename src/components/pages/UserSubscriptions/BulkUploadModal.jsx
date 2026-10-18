import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { AlertTriangle, FileSpreadsheet, Upload, X } from "lucide-react";
import { useEntity } from "@/hooks/useEntity";
import entities from "@/redux/entities";
import axiosInstance from "@/api/axiosInstance";
import ENDPOINTS from "@/api/endpoints";

const parseCSVLine = (line) => {
    const out = [];
    let cur = "";
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
        const ch = line[i];
        if (inQuotes) {
            if (ch === '"') {
                if (line[i + 1] === '"') {
                    cur += '"';
                    i += 1;
                } else {
                    inQuotes = false;
                }
            } else {
                cur += ch;
            }
        } else if (ch === '"') {
            inQuotes = true;
        } else if (ch === ",") {
            out.push(cur);
            cur = "";
        } else {
            cur += ch;
        }
    }

    out.push(cur);
    return out.map((v) => v.trim());
};

const parseCSV = (text) => {
    const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
    if (lines.length === 0) return [];
    let rows = lines.map(parseCSVLine);
    const first = rows[0]?.map((v) => v.toLowerCase()) ?? [];
    const hasHeader =
        first.includes("externaluserid") ||
        first.includes("chatid") ||
        first.includes("externalid");
    if (hasHeader) rows = rows.slice(1);
    return rows
        .map((cells, idx) => {
            const [
                externalUserId = "",
                chatId = "",
                name = "",
                email = "",
                phone = "",
            ] = cells;
            return {
                externalUserId: externalUserId.trim(),
                chatId: chatId.trim(),
                name: name.trim(),
                email: email.trim(),
                phone: phone.trim(),
                _row: idx + (hasHeader ? 2 : 1),
            };
        })
        .filter((r) => r.externalUserId && r.chatId);
};

const SAMPLE_CSV = `externalUserId,chatId,name,email,phone
customer-hasina,5114883679,Hasina,hasina@example.com,01712345678
customer-karim,5114883680,Karim,karim@example.com,01712345679`;

const BulkUploadModal = ({ open, saving = false, onClose, onSubmit }) => {
    const domains = useEntity(entities.domains);
    const bots = useEntity(entities.bots);
    const [domainId, setDomainId] = useState("");
    const [botId, setBotId] = useState("");
    const [rawText, setRawText] = useState("");
    const [fileName, setFileName] = useState("");
    const [errors, setErrors] = useState({});
    const [systemBot, setSystemBot] = useState(null);

    useEffect(() => {
        if (!open) return;
        setDomainId("");
        setBotId("");
        setRawText("");
        setFileName("");
        setErrors({});
    }, [open]);

    useEffect(() => {
        if (!open) return;
        domains.fetchAll({ limit: 100, active: true }).catch(() => { });
        bots.fetchAll({ limit: 100, active: true }).catch(() => { });
        axiosInstance
            .get(ENDPOINTS.systemBot)
            .then((res) => setSystemBot(res?.data ?? null))
            .catch(() => setSystemBot(null));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);

    /* Combined bot list: own + system */
    const botList = useMemo(() => {
        const own = (bots.items ?? []).filter(
            (b) => b.active && b.status === "approved"
        );
        if (!systemBot) return own;
        const exists = own.some((b) => String(b.id) === String(systemBot.id));
        if (exists) return own;
        return [systemBot, ...own];
    }, [bots.items, systemBot]);

    const approvedDomains = (domains.items ?? []).filter((d) => d.status === "approved" && d.active);
    const parsed = useMemo(() => (rawText.trim() ? parseCSV(rawText) : []), [rawText]);
    const invalidCount = useMemo(() => parsed.filter((r) => !/^-?\d{5,20}$/.test(r.chatId)).length, [parsed]);
    if (!open) return null;
    const handleFile = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!file.name.toLowerCase().endsWith(".csv") && !file.name.toLowerCase().endsWith(".txt")) {
            setErrors({ file: "Please upload a .csv file" });
            return;
        }
        if (file.size > 2 * 1024 * 1024) {
            setErrors({ file: "File too large (max 2MB)" });
            return;
        }
        try {
            const text = await file.text();
            setRawText(text);
            setFileName(file.name);
            setErrors({});
        } catch {
            setErrors({ file: "Failed to read file" });
        }
    };

    const handleLoadSample = () => {
        setRawText(SAMPLE_CSV);
        setFileName("sample.csv");
        setErrors({});
    };

    const validate = () => {
        const next = {};
        if (!domainId) next.domainId = "Domain is required";
        if (!botId) next.botId = "Bot is required";
        if (parsed.length === 0) next.csv = "No valid rows found in CSV";
        if (parsed.length > 5000) next.csv = "Maximum 5000 rows per upload";
        if (invalidCount > 0) next.csv = `${invalidCount} row(s) have invalid chatId`;
        setErrors(next);
        return Object.keys(next).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        const subscriptions = parsed.map((r) => ({
            externalUserId: r.externalUserId,
            chatId: r.chatId,
            name: r.name,
            email: r.email,
            phone: r.phone,
        }));
        try {
            await onSubmit({ domainId, botId, subscriptions });
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
            <div className="relative z-10 w-full max-w-2xl animate-fade-in">
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
                        <h3 className="flex items-center gap-2 text-base font-semibold text-gray-100">
                            <FileSpreadsheet size={18} className="text-indigo-400" />
                            Bulk Upload Subscribers
                        </h3>
                        <p className="text-xs text-muted">
                            Import multiple B2C customers at once from a CSV file.
                        </p>
                    </div>
                    <div className="space-y-3">
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            <div>
                                <label className="label">Domain</label>
                                <select
                                    value={domainId}
                                    onChange={(e) => setDomainId(e.target.value)}
                                    disabled={saving}
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
                            </div>

                            <div>
                                <label className="label">Bot</label>
                                <select
                                    value={botId}
                                    onChange={(e) => setBotId(e.target.value)}
                                    disabled={saving}
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
                                        No bots available. Contact admin to enable a system bot.
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className="rounded-lg border border-white/10 bg-white/[0.02] p-3 text-xs">
                            <p className="mb-1 font-medium text-white/70">
                                CSV format (in order):
                            </p>
                            <code className="block rounded bg-black/30 px-2 py-1 font-mono text-[10px] text-indigo-300">
                                externalUserId, chatId, name?, email?, phone?
                            </code>
                            <p className="mt-2 text-white/40">
                                First row can be a header (auto-detected). Example:
                            </p>
                            <pre className="mt-1 overflow-x-auto rounded bg-black/30 p-2 font-mono text-[10px] text-emerald-300">
                                {`customer-hasina,5114883679,Hasina,hasina@example.com,01712345678 customer-karim,5114883680,Karim,,`}
                            </pre>
                            <button
                                type="button"
                                onClick={handleLoadSample}
                                disabled={saving}
                                className="mt-2 text-[11px] font-medium text-indigo-400 hover:text-indigo-300"
                            >
                                Load sample
                            </button>
                        </div>
                        <div>
                            <label className="label">
                                Upload CSV File
                                {fileName && (
                                    <span className="ml-1 text-[10px] font-normal text-emerald-400">
                                        ✓ {fileName}
                                    </span>
                                )}
                            </label>
                            <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-white/20 bg-white/[0.02] px-4 py-6 text-sm text-white/60 transition hover:border-indigo-500/40 hover:bg-indigo-500/5">
                                <Upload size={16} />
                                <span>
                                    {fileName ? `Loaded ${fileName}` : "Click to select .csv file"}
                                </span>
                                <input
                                    type="file"
                                    accept=".csv,.txt,text/csv"
                                    onChange={handleFile}
                                    disabled={saving}
                                    className="hidden"
                                />
                            </label>
                            {errors.file && <p className="error-text">{errors.file}</p>}
                        </div>
                        <div>
                            <label className="label">
                                Or paste CSV directly
                                {parsed.length > 0 && (
                                    <span className="ml-1 text-[10px] font-normal text-emerald-400">
                                        ({parsed.length} rows detected)
                                    </span>
                                )}
                            </label>
                            <textarea
                                value={rawText}
                                onChange={(e) => {
                                    setRawText(e.target.value);
                                    setFileName("");
                                }}
                                disabled={saving}
                                rows={6}
                                placeholder={SAMPLE_CSV}
                                className="input resize-y font-mono text-xs"
                            />
                            {errors.csv && <p className="error-text">{errors.csv}</p>}
                        </div>
                        {parsed.length > 0 && (
                            <div>
                                <p className="mb-2 text-xs font-medium text-white/70">
                                    Preview ({parsed.length} valid rows)
                                    {invalidCount > 0 && (
                                        <span className="ml-2 text-red-400">
                                            ⚠ {invalidCount} invalid
                                        </span>
                                    )}
                                </p>
                                <div className="max-h-48 overflow-y-auto rounded-lg border border-white/10 bg-white/[0.02]">
                                    <table className="w-full text-xs">
                                        <thead className="sticky top-0 bg-[#0B1220]">
                                            <tr className="text-left text-white/50">
                                                <th className="px-2 py-1.5 font-medium">Row</th>
                                                <th className="px-2 py-1.5 font-medium">External ID</th>
                                                <th className="px-2 py-1.5 font-medium">Chat ID</th>
                                                <th className="px-2 py-1.5 font-medium">Name</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {parsed.slice(0, 20).map((r, i) => {
                                                const chatValid = /^-?\d{5,20}$/.test(r.chatId);
                                                return (
                                                    <tr
                                                        key={i}
                                                        className="border-t border-white/5 text-gray-300"
                                                    >
                                                        <td className="px-2 py-1 text-white/40">
                                                            {r._row}
                                                        </td>
                                                        <td className="px-2 py-1 font-mono text-[10px]">
                                                            {r.externalUserId}
                                                        </td>
                                                        <td
                                                            className={`px-2 py-1 font-mono text-[10px] ${chatValid ? "text-cyan-300" : "text-red-400"
                                                                }`}
                                                        >
                                                            {r.chatId || "—"}
                                                        </td>
                                                        <td className="px-2 py-1">{r.name || "—"}</td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                    {parsed.length > 20 && (
                                        <p className="border-t border-white/5 p-2 text-center text-[10px] text-white/40">
                                            + {parsed.length - 20} more rows
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}

                        {invalidCount > 0 && (
                            <div className="flex items-start gap-2 rounded-lg border border-red-500/30 bg-red-500/10 p-2.5 text-xs">
                                <AlertTriangle
                                    size={14}
                                    className="mt-0.5 flex-shrink-0 text-red-400"
                                />
                                <p className="text-red-300/80">
                                    {invalidCount} row(s) have invalid chatId (must be 5-20
                                    digits). Fix them before submitting.
                                </p>
                            </div>
                        )}
                    </div>
                    <div className="mt-3 flex justify-end gap-2">
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
                            disabled={saving || parsed.length === 0}
                            className="btn-primary"
                        >
                            {saving ? (
                                <>
                                    <span className="h-3 w-3 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                    Uploading…
                                </>
                            ) : (
                                <>
                                    <Upload size={14} />
                                    Upload {parsed.length || ""} Subscriber
                                    {parsed.length === 1 ? "" : "s"}
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

export default BulkUploadModal;