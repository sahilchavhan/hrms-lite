export default function EmptyState({ icon, title, description, action }) {
    return (
        <div className="empty-state">
            {icon && <div className="empty-state-icon">{icon}</div>}
            <h3>{title || "No data found"}</h3>
            <p>{description || "There's nothing to show here yet."}</p>
            {action && <div style={{ marginTop: "1.5rem" }}>{action}</div>}
        </div>
    );
}
