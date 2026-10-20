import { useState } from "react";
import { createPortal } from "react-dom";
import { AlertTriangle, Check, Copy, Key } from "lucide-react";
import { toast } from "sonner";

/**
 * Shows the plaintext API key exactly once.
 * User MUST copy it before closing — enforced by disabling backdrop/ESC.
 */
const ApiKeyReveal = ({ open, plaintextKey, keyName, onClose }) => {
    const [copied, setCopied] = useState(false);

    if (!open || !plaintextKey) return null;

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(plaintextKey);
            setCopied(true);
            toast.success("API key copied to clipboard");
        } catch {
            toast.error("Failed to copy. Please select and copy manually.");
        }
    };

    return createPortal(
        <div className="fixed inset-0 z-[110] flex items-center justify-center px-4 py-6">
            {/* Backdrop — NOT closable (safety) */}
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

            <div className="relative z-10 w-full max-w-lg animate-fade-in">
                <div className="card">
                    {/* Warning banner */}
                    <div className="mb-4 flex items-start gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3">
                        <AlertTriangle
                            size={18}
                            className="mt-0.5 flex-shrink-0 text-amber-400"
                        />
                        <div className="min-w-0 text-sm text-amber-200">
                            <p className="font-semibold">Save this key now</p>
                            <p className="mt-0.5 text-xs text-amber-200/80">
                                This is the only time you'll see the full key. We store only a
                                hash — if you lose it, you'll need to rotate the key.
                            </p>
                        </div>
                    </div>

                    <div className="mb-4">
                        <div className="mb-2 flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
                                <Key size={16} />
                            </div>
                            <div className="min-w-0">
                                <p className="text-sm font-semibold text-gray-100">
                                    {keyName || "API Key"}
                                </p>
                                <p className="text-[11px] text-white/40">
                                    Use this in your requests as the X-API-Key header
                                </p>
                            </div>
                        </div>

                        {/* Key display */}
                        <div className="rounded-lg border border-white/10 bg-[#03030d] p-3">
                            <code className="block break-all font-mono text-sm text-emerald-300">
                                {plaintextKey}
                            </code>
                        </div>

                        <div className="mt-2 flex items-center gap-2">
                            <button
                                type="button"
                                onClick={handleCopy}
                                className="btn-primary flex-1"
                            >
                                {copied ? (
                                    <>
                                        <Check size={14} />
                                        Copied!
                                    </>
                                ) : (
                                    <>
                                        <Copy size={14} />
                                        Copy to Clipboard
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Instruction */}
                    <div className="mb-4 rounded-lg border border-white/5 bg-white/[0.02] p-3 text-xs text-white/60">
                        <p className="mb-1.5 font-medium text-gray-200">
                            Example usage:
                        </p>
                        <pre className="overflow-x-auto text-[11px] text-indigo-300">
                            {`curl -X POST https://api.iftyhasan.com/api/v1/notify \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: ${plaintextKey.slice(0, 20)}..." \\
  -d '{
    "type": "custom",
    "domain": "yourdomain.com",
    "data": { "message": "test" }
  }'`}
                        </pre>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end">
                        <button
                            type="button"
                            onClick={onClose}
                            className="btn-secondary"
                        >
                            I've saved it — Close
                        </button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default ApiKeyReveal;