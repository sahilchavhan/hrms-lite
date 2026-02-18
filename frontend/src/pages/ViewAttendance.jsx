import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { HiOutlineCalendar, HiOutlineUsers } from "react-icons/hi";
import { employeeAPI, attendanceAPI } from "../services/api";
import { LoadingSpinner, LoadingSkeleton } from "../components/Loading";
import EmptyState from "../components/EmptyState";
import ErrorState from "../components/ErrorState";

export default function ViewAttendance() {
    const [searchParams] = useSearchParams();
    const preselectedEmployee = searchParams.get("employee");

    const [employees, setEmployees] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState(
        preselectedEmployee || ""
    );
    const [attendanceData, setAttendanceData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loadingRecords, setLoadingRecords] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchEmployees();
    }, []);

    useEffect(() => {
        if (selectedEmployee) {
            fetchAttendance(selectedEmployee);
        } else {
            setAttendanceData(null);
        }
    }, [selectedEmployee]);

    const fetchEmployees = async () => {
        setLoading(true);
        try {
            const res = await employeeAPI.getAll({ page_size: 100 });
            setEmployees(res.data.results || res.data);
        } catch (err) {
            setError(err.userMessage || "Failed to load employees.");
        } finally {
            setLoading(false);
        }
    };

    const fetchAttendance = async (empId) => {
        setLoadingRecords(true);
        setError(null);
        try {
            const res = await attendanceAPI.getByEmployee(empId);
            setAttendanceData(res.data);
        } catch (err) {
            setError(err.userMessage || "Failed to load attendance records.");
        } finally {
            setLoadingRecords(false);
        }
    };

    if (loading) return <LoadingSpinner text="Loading..." />;

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">Attendance Records</h1>
                <p className="page-subtitle">
                    View attendance history for each employee
                </p>
            </div>

            {employees.length === 0 ? (
                <EmptyState
                    icon={<HiOutlineUsers />}
                    title="No employees found"
                    description="Add employees first to view their attendance records."
                    action={
                        <Link to="/employees/add" className="btn btn-primary">
                            Add Employee
                        </Link>
                    }
                />
            ) : (
                <>
                    {/* Employee Selector */}
                    <div className="card" style={{ marginBottom: "1.5rem" }}>
                        <div className="form-group" style={{ margin: 0 }}>
                            <label className="form-label">Select Employee</label>
                            <select
                                className="form-select"
                                value={selectedEmployee}
                                onChange={(e) => setSelectedEmployee(e.target.value)}
                                style={{ maxWidth: "400px" }}
                            >
                                <option value="">Choose an employee...</option>
                                {employees.map((emp) => (
                                    <option key={emp.id} value={emp.id}>
                                        {emp.employee_id} — {emp.full_name} ({emp.department_display}
                                        )
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Results */}
                    {!selectedEmployee ? (
                        <EmptyState
                            icon={<HiOutlineCalendar />}
                            title="Select an employee"
                            description="Choose an employee from the dropdown above to view their attendance records."
                        />
                    ) : loadingRecords ? (
                        <LoadingSkeleton rows={5} columns={3} />
                    ) : error ? (
                        <ErrorState
                            message={error}
                            onRetry={() => fetchAttendance(selectedEmployee)}
                        />
                    ) : attendanceData ? (
                        <>
                            {/* Summary Cards */}
                            <div
                                className="stats-grid"
                                style={{
                                    gridTemplateColumns: "repeat(4, 1fr)",
                                    marginBottom: "1.5rem",
                                }}
                            >
                                <div className="stat-card">
                                    <div className="stat-info">
                                        <h3>Employee</h3>
                                        <div className="stat-value" style={{ fontSize: "1.125rem" }}>
                                            {attendanceData.employee.full_name}
                                        </div>
                                    </div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-info">
                                        <h3>Total Records</h3>
                                        <div className="stat-value">
                                            {attendanceData.summary.total_records}
                                        </div>
                                    </div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-info">
                                        <h3>Present</h3>
                                        <div className="stat-value" style={{ color: "var(--color-success)" }}>
                                            {attendanceData.summary.present}
                                        </div>
                                    </div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-info">
                                        <h3>Attendance Rate</h3>
                                        <div
                                            className="stat-value"
                                            style={{
                                                color:
                                                    attendanceData.summary.attendance_rate >= 75
                                                        ? "var(--color-success)"
                                                        : attendanceData.summary.attendance_rate >= 50
                                                            ? "var(--color-warning)"
                                                            : "var(--color-danger)",
                                            }}
                                        >
                                            {attendanceData.summary.attendance_rate}%
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Records Table */}
                            {attendanceData.records.length === 0 ? (
                                <EmptyState
                                    icon={<HiOutlineCalendar />}
                                    title="No records yet"
                                    description="No attendance has been recorded for this employee."
                                    action={
                                        <Link to="/attendance/mark" className="btn btn-primary">
                                            Mark Attendance
                                        </Link>
                                    }
                                />
                            ) : (
                                <div className="card" style={{ padding: 0 }}>
                                    <div className="table-container" style={{ border: "none" }}>
                                        <table className="table">
                                            <thead>
                                                <tr>
                                                    <th>Date</th>
                                                    <th>Day</th>
                                                    <th>Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {attendanceData.records.map((record) => {
                                                    const dateObj = new Date(record.date + "T00:00:00");
                                                    const dayName = dateObj.toLocaleDateString("en-US", {
                                                        weekday: "long",
                                                    });
                                                    const formattedDate = dateObj.toLocaleDateString(
                                                        "en-US",
                                                        {
                                                            year: "numeric",
                                                            month: "short",
                                                            day: "numeric",
                                                        }
                                                    );
                                                    return (
                                                        <tr key={record.id}>
                                                            <td style={{ fontWeight: 500 }}>
                                                                {formattedDate}
                                                            </td>
                                                            <td
                                                                style={{
                                                                    color: "var(--color-text-secondary)",
                                                                }}
                                                            >
                                                                {dayName}
                                                            </td>
                                                            <td>
                                                                <span
                                                                    className={`badge badge-${record.status}`}
                                                                >
                                                                    <span className="badge-dot" />
                                                                    {record.status_display}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </>
                    ) : null}
                </>
            )}
        </div>
    );
}
