const TypeBadge = ({ type }) => (
    <code className="rounded bg-white/5 px-1.5 py-0.5 text-[11px] text-indigo-300">
        {type}
    </code>
);

const RequiredBadge = ({ required }) => {
    if (required === "required") {
        return (
            <span className="badge border border-emerald-500/30 bg-emerald-500/15 text-emerald-300">
                Required
            </span>
        );
    }
    if (required === "conditional") {
        return (
            <span className="badge border border-amber-500/30 bg-amber-500/15 text-amber-300">
                Conditional
            </span>
        );
    }
    return (
        <span className="badge border border-gray-500/30 bg-gray-500/15 text-gray-400">
            Optional
        </span>
    );
};

const FieldTable = ({ fields = [] }) => {
    if (fields.length === 0) return null;
    return (
        <div className="my-3 overflow-x-auto rounded-lg border border-white/10 bg-[#0B1220]">
            <table className="w-full min-w-[640px] border-collapse text-sm">
                <thead className="bg-white/[0.03]">
                    <tr>
                        <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-white/60">
                            Field
                        </th>
                        <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-white/60">
                            Type
                        </th>
                        <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-white/60">
                            Required
                        </th>
                        <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-white/60">
                            Description
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {fields.map((field, i) => (
                        <tr
                            key={field.name || i}
                            className="border-t border-white/[0.06]"
                        >
                            <td className="px-3 py-2 align-top">
                                <code className="text-[11px] text-indigo-300">{field.name}</code>
                            </td>
                            <td className="px-3 py-2 align-top">
                                <TypeBadge type={field.type} />
                            </td>
                            <td className="px-3 py-2 align-top">
                                <RequiredBadge required={field.required} />
                            </td>
                            <td className="px-3 py-2 align-top text-xs text-gray-300">
                                {field.description}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default FieldTable;