import Loader from "./Loader";
import EmptyState from "./EmptyState";

const DataTable = ({
    columns = [],
    data = [],
    loading = false,
    rowKey = (row, i) => row.id ?? row._id ?? i,
    onRowClick = null,
    emptyState = null,
    className = "",
}) => {
    const isEmpty = !loading && data.length === 0;
    return (
        <div className={`table-wrapper ${className}`}>
            <table className="table">
                <thead>
                    <tr>
                        {columns.map((col) => (
                            <th
                                key={col.key}
                                className={col.headerClassName ?? ""}
                                style={col.width ? { width: col.width } : undefined}
                            >
                                {col.label}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {loading && (
                        <tr>
                            <td colSpan={columns.length} className="py-10">
                                <Loader />
                            </td>
                        </tr>
                    )}
                    {isEmpty && (
                        <tr>
                            <td colSpan={columns.length} className="p-3">
                                {emptyState ?? (
                                    <EmptyState
                                        title="No data"
                                        description="Nothing to display right now."
                                    />
                                )}
                            </td>
                        </tr>
                    )}

                    {!loading &&
                        data.map((row, index) => (
                            <tr
                                key={rowKey(row, index)}
                                onClick={onRowClick ? () => onRowClick(row) : undefined}
                                className={onRowClick ? "cursor-pointer" : ""}
                            >
                                {columns.map((col) => (
                                    <td key={col.key} className={col.className ?? ""}>
                                        {col.render ? col.render(row, index) : row[col.key] ?? "—"}
                                    </td>
                                ))}
                            </tr>
                        ))}
                </tbody>
            </table>
        </div>
    );
};

export default DataTable;