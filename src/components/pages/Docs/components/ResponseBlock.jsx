import { CheckCircle2, XCircle } from "lucide-react";
import CodeBlock from "./CodeBlock";

const STATUS_COLORS = {
    200: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
    201: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
    202: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
    400: "text-amber-400 border-amber-500/30 bg-amber-500/10",
    401: "text-red-400 border-red-500/30 bg-red-500/10",
    402: "text-amber-400 border-amber-500/30 bg-amber-500/10",
    403: "text-red-400 border-red-500/30 bg-red-500/10",
    404: "text-amber-400 border-amber-500/30 bg-amber-500/10",
    429: "text-amber-400 border-amber-500/30 bg-amber-500/10",
    500: "text-red-400 border-red-500/30 bg-red-500/10",
};

const ResponseBlock = ({ status, description, response }) => {
    const colorClass = STATUS_COLORS[status] ?? "text-gray-400 border-gray-500/30 bg-gray-500/10";
    const isSuccess = status >= 200 && status < 300;

    return (
        <div className="my-3">
            <div className="mb-1.5 flex items-center gap-2">
                <span className={`badge border ${colorClass}`}>
                    {isSuccess ? (
                        <CheckCircle2 size={10} />
                    ) : (
                        <XCircle size={10} />
                    )}
                    {status}
                </span>
                {description && (
                    <span className="text-xs text-white/60">{description}</span>
                )}
            </div>
            <CodeBlock language="json" code={response} title="Response" />
        </div>
    );
};

export default ResponseBlock;