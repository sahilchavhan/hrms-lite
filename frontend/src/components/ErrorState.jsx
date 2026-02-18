import { HiOutlineExclamationCircle } from "react-icons/hi";

export default function ErrorState({ message, onRetry }) {
    return (
        <div className="error-container">
            <div className="error-icon">
                <HiOutlineExclamationCircle />
            </div>
            <h3>Something went wrong</h3>
            <p>{message || "An unexpected error occurred. Please try again."}</p>
            {onRetry && (
                <button className="btn btn-primary" onClick={onRetry}>
                    Try Again
                </button>
            )}
        </div>
    );
}
