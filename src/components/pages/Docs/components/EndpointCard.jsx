const METHOD_COLORS = {
    GET: "border-emerald-500/30 bg-emerald-500/15 text-emerald-300",
    POST: "border-indigo-500/30 bg-indigo-500/15 text-indigo-300",
    PATCH: "border-amber-500/30 bg-amber-500/15 text-amber-300",
    PUT: "border-amber-500/30 bg-amber-500/15 text-amber-300",
    DELETE: "border-red-500/30 bg-red-500/15 text-red-300",
};

const EndpointCard = ({ method = "POST", path, description, meta }) => {
    const methodClass = METHOD_COLORS[method.toUpperCase()] ?? METHOD_COLORS.GET;

    return (
        <div className="my-3 rounded-lg border border-white/10 bg-[#0B1220] p-3">
            <div className="flex flex-wrap items-center gap-2">
                <span className={`badge border font-mono ${methodClass}`}>
                    {method.toUpperCase()}
                </span>
                <code className="rounded bg-white/5 px-1.5 py-0.5 text-sm font-mono text-indigo-300">
                    {path}
                </code>
            </div>
            {description && (
                <p className="mt-2 text-sm text-gray-300">{description}</p>
            )}
            {meta && (
                <div className="mt-2 flex flex-wrap gap-3 text-[11px] text-white/40">
                    {meta}
                </div>
            )}
        </div>
    );
};

export default EndpointCard;