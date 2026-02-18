import { useState, useEffect } from "react";
import {
    HiOutlineClipboardList,
    HiOutlineCheck,
    HiOutlineX,
} from "react-icons/hi";
import { employeeAPI, attendanceAPI } from "../services/api";
import { LoadingSpinner } from "../components/Loading";
import EmptyState from "../components/EmptyState";
import ErrorState from "../components/ErrorState";
import toast from "react-hot-toast";

export default function MarkAttendance() {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
    const [attendance, setAttendance] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [existingRecords, setExistingRecords] = useState({});

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await employeeAPI.getAll({ page_size: 100 });
            const emps = res.data.results || res.data;
            setEmployees(emps);

            // Check for existing records on selected date
            const attRes = await attendanceAPI.getAll({ date });
            const existing = {};
            (attRes.data.results || attRes.data).forEach((rec) => {
                existing[rec.employee] = rec.status;
            });
            setExistingRecords(existing);
            setAttendance(existing);
        } catch (err) {
            setError(err.userMessage || "Failed to load employees.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [date]);

    const toggleStatus = (empId, status) => {
        setAttendance((prev) => ({
            ...prev,
            [empId]: prev[empId] === status ? undefined : status,
        }));
    };

    const handleSubmit = async () => {
        const records = Object.entries(attendance)
            .filter(([_, status]) => status)
            .map(([employee_id, status]) => ({
                employee_id: parseInt(employee_id),
                status,
            }));

        if (records.length === 0) {
            toast.error("Please mark attendance for at least one employee.");
            return;
        }

        setSubmitting(true);
        try {
            const res = await attendanceAPI.bulkMark({ date, records });
            toast.success(res.data.message || "Attendance marked successfully!");
            // Update existing records
            const newExisting = {};
            records.forEach((rec) => {
                newExisting[rec.employee_id] = rec.status;
            });
            setExistingRecords((prev) => ({ ...prev, ...newExisting }));
        } catch (err) {
            toast.error(err.userMessage || "Failed to mark attendance.");
        } finally {
            setSubmitting(false);
        }
    };

    const markedCount = Object.values(attendance).filter(Boolean).length;
    const presentCount = Object.values(attendance).filter(
        (s) => s === "present"
    ).length;
    const absentCount = Object.values(attendance).filter(
        (s) => s === "absent"
    ).length;

    return (
        <div>
            <div className="page-header">
                <div className="page-header-top">
                    <div>
                        <h1 className="page-title">Mark Attendance</h1>
                        <p className="page-subtitle">
                            Record daily attendance for employees
                        </p>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                        <div className="form-group" style={{ margin: 0 }}>
                            <input
                                type="date"
                                className="form-input"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                style={{ width: "auto" }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Summary Bar */}
            {employees.length > 0 && (
                <div
                    className="stats-grid"
                    style={{ gridTemplateColumns: "repeat(3, 1fr)", marginBottom: "1.5rem" }}
                >
                    <div className="stat-card">
                        <div className="stat-icon primary">
                            <HiOutlineClipboardList />
                        </div>
                        <div className="stat-info">
                            <h3>Marked</h3>
                            <div className="stat-value">
                                {markedCount}/{employees.length}
                            </div>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon success">
                            <HiOutlineCheck />
                        </div>
                        <div className="stat-info">
                            <h3>Present</h3>
                            <div className="stat-value">{presentCount}</div>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon danger">
                            <HiOutlineX />
                        </div>
                        <div className="stat-info">
                            <h3>Absent</h3>
                            <div className="stat-value">{absentCount}</div>
                        </div>
                    </div>
                </div>
            )}

            {/* Content */}
            {loading ? (
                <LoadingSpinner text="Loading employees..." />
            ) : error ? (
                <ErrorState message={error} onRetry={fetchData} />
            ) : employees.length === 0 ? (
                <EmptyState
                    icon={<HiOutlineClipboardList />}
                    title="No employees to mark"
                    description="Add employees first before marking attendance."
                />
            ) : (
                <>
                    <div className="attendance-grid">
                        {employees.map((emp) => {
                            const status = attendance[emp.id];
                            return (
                                <div key={emp.id} className="attendance-employee-card">
                                    <div className="attendance-employee-header">
                                        <div>
                                            <div style={{ fontWeight: 600, marginBottom: "0.25rem" }}>
                                                {emp.full_name}
                                            </div>
                                            <div
                                                style={{
                                                    fontSize: "0.8rem",
                                                    color: "var(--color-text-muted)",
                                                }}
                                            >
                                                {emp.employee_id} · {emp.department_display}
                                            </div>
                                        </div>
                                        {existingRecords[emp.id] && (
                                            <span
                                                className={`badge badge-${existingRecords[emp.id]}`}
                                            >
                                                <span className="badge-dot" />
                                                Saved
                                            </span>
                                        )}
                                    </div>
                                    <div className="attendance-actions">
                                        <button
                                            className={`attendance-btn ${status === "present" ? "selected-present" : ""
                                                }`}
                                            onClick={() => toggleStatus(emp.id, "present")}
                                        >
                                            <HiOutlineCheck
                                                style={{ marginRight: "4px", verticalAlign: "middle" }}
                                            />
                                            Present
                                        </button>
                                        <button
                                            className={`attendance-btn ${status === "absent" ? "selected-absent" : ""
                                                }`}
                                            onClick={() => toggleStatus(emp.id, "absent")}
                                        >
                                            <HiOutlineX
                                                style={{ marginRight: "4px", verticalAlign: "middle" }}
                                            />
                                            Absent
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Submit */}
                    <div
                        style={{
                            position: "sticky",
                            bottom: "1rem",
                            display: "flex",
                            justifyContent: "center",
                            marginTop: "2rem",
                            zIndex: 10,
                        }}
                    >
                        <button
                            className="btn btn-primary btn-lg"
                            onClick={handleSubmit}
                            disabled={submitting || markedCount === 0}
                            style={{
                                padding: "0.75rem 3rem",
                                boxShadow: "var(--shadow-lg)",
                            }}
                        >
                            {submitting
                                ? "Saving..."
                                : `Save Attendance (${markedCount} employees)`}
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
