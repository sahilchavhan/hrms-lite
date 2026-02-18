import { HiOutlineExclamation } from "react-icons/hi";

export default function ConfirmModal({
    isOpen,
    title,
    message,
    confirmLabel = "Delete",
    cancelLabel = "Cancel",
    onConfirm,
    onCancel,
    danger = true,
}) {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onCancel}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <div className={`modal-icon ${danger ? "danger" : ""}`}>
                        <HiOutlineExclamation />
                    </div>
                    <h2 className="modal-title">{title}</h2>
                </div>
                <div className="modal-body">
                    <p>{message}</p>
                </div>
                <div className="modal-actions">
                    <button className="btn btn-ghost" onClick={onCancel}>
                        {cancelLabel}
                    </button>
                    <button
                        className={`btn ${danger ? "btn-danger" : "btn-primary"}`}
                        onClick={onConfirm}
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}
