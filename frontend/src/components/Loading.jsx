export function LoadingSpinner({ text = "Loading..." }) {
    return (
        <div className="loading-container">
            <div className="spinner"></div>
            <span className="loading-text">{text}</span>
        </div>
    );
}

export function LoadingSkeleton({ rows = 5, columns = 4 }) {
    return (
        <div className="table-container">
            <table className="table">
                <thead>
                    <tr>
                        {Array.from({ length: columns }).map((_, i) => (
                            <th key={i}>
                                <div
                                    className="loading-skeleton"
                                    style={{ height: "12px", width: `${60 + Math.random() * 40}%` }}
                                />
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {Array.from({ length: rows }).map((_, rowIdx) => (
                        <tr key={rowIdx}>
                            {Array.from({ length: columns }).map((_, colIdx) => (
                                <td key={colIdx}>
                                    <div
                                        className="loading-skeleton"
                                        style={{
                                            height: "14px",
                                            width: `${50 + Math.random() * 50}%`,
                                        }}
                                    />
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
