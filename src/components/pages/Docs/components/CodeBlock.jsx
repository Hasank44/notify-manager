import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { toast } from "sonner";

const LANGUAGE_LABELS = {
    js: "JavaScript",
    javascript: "JavaScript",
    php: "PHP",
    py: "Python",
    python: "Python",
    bash: "cURL",
    curl: "cURL",
    json: "JSON",
    sh: "Shell",
};

const CodeBlock = ({ language = "js", code, title }) => {
    const [copied, setCopied] = useState(false);
    const handleCopy = () => {
        navigator.clipboard.writeText(code).then(() => {
            setCopied(true);
            toast.success("Copied");
            setTimeout(() => setCopied(false), 1500);
        });
    };
    const label = LANGUAGE_LABELS[language.toLowerCase()] ?? language.toUpperCase();

    return (
        <div className="relative my-3 overflow-hidden rounded-lg border border-white/10 bg-[#03030d]">
            <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.02] px-3 py-1.5">
                <span className="text-[11px] font-medium text-white/50">
                    {title || label}
                </span>
                <button
                    type="button"
                    onClick={handleCopy}
                    className="flex items-center gap-1 rounded px-1.5 py-0.5 text-[11px] text-white/40 transition hover:bg-white/10 hover:text-white"
                >
                    {copied ? (
                        <>
                            <Check size={11} className="text-emerald-400" />
                            <span className="text-emerald-400">Copied</span>
                        </>
                    ) : (
                        <>
                            <Copy size={11} />
                            Copy
                        </>
                    )}
                </button>
            </div>
            <pre className="overflow-x-auto p-3 text-[12px] leading-relaxed">
                <code className="font-mono text-gray-100">{code}</code>
            </pre>
        </div>
    );
};

export default CodeBlock;