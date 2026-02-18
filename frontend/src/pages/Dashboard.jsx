import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
    HiOutlineUsers,
    HiOutlineClipboardCheck,
    HiOutlineUserAdd,
    HiOutlineCalendar,
} from "react-icons/hi";
import { employeeAPI, attendanceAPI } from "../services/api";
import { LoadingSpinner } from "../components/Loading";
import ErrorState from "../components/ErrorState";

export default function Dashboard() {
    const [stats, setStats] = useState(null);
    const [recentEmployees, setRecentEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const [statsRes, employeesRes] = await Promise.all([
                employeeAPI.getStats(),
                employeeAPI.getAll(),
            ]);
            setStats(statsRes.data);
            setRecentEmployees(
                (employeesRes.data.results || employeesRes.data).slice(0, 5)
            );
        } catch (err) {
            setError(err.userMessage || "Failed to load dashboard data.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (loading) return <LoadingSpinner text="Loading dashboard..." />;
    if (error) return <ErrorState message={error} onRetry={fetchData} />;

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">Dashboard</h1>
                <p className="page-subtitle">
                    Welcome to HRMS Lite — your employee management overview
                </p>
            </div>

            {/* Stats Grid */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon primary">
                        <HiOutlineUsers />
                    </div>
                    <div className="stat-info">
                        <h3>Total Employees</h3>
                        <div className="stat-value">{stats?.total_employees || 0}</div>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon success">
                        <HiOutlineClipboardCheck />
                    </div>
                    <div className="stat-info">
                        <h3>Departments</h3>
                        <div className="stat-value">
                            {stats?.by_department
                                ? Object.keys(stats.by_department).length
                                : 0}
                        </div>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon info">
                        <HiOutlineCalendar />
                    </div>
                    <div className="stat-info">
                        <h3>Today</h3>
                        <div className="stat-value">
                            {new Date().toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="stats-grid" style={{ marginBottom: "2rem" }}>
                <Link to="/employees/add" style={{ textDecoration: "none" }}>
                    <div className="stat-card" style={{ cursor: "pointer" }}>
                        <div className="stat-icon primary">
                            <HiOutlineUserAdd />
                        </div>
                        <div className="stat-info">
                            <h3>Quick Action</h3>
                            <div className="stat-value" style={{ fontSize: "1rem" }}>
                                Add New Employee
                            </div>
                        </div>
                    </div>
                </Link>
                <Link to="/attendance/mark" style={{ textDecoration: "none" }}>
                    <div className="stat-card" style={{ cursor: "pointer" }}>
                        <div className="stat-icon warning">
                            <HiOutlineClipboardCheck />
                        </div>
                        <div className="stat-info">
                            <h3>Quick Action</h3>
                            <div className="stat-value" style={{ fontSize: "1rem" }}>
                                Mark Attendance
                            </div>
                        </div>
                    </div>
                </Link>
            </div>

            {/* Department Breakdown */}
            {stats?.by_department && Object.keys(stats.by_department).length > 0 && (
                <div className="card" style={{ marginBottom: "2rem" }}>
                    <div className="card-header">
                        <h2 className="card-title">Department Overview</h2>
                    </div>
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
                            gap: "0.75rem",
                        }}
                    >
                        {Object.entries(stats.by_department).map(([dept, count]) => (
                            <div
                                key={dept}
                                style={{
                                    padding: "1rem",
                                    background: "var(--color-bg-tertiary)",
                                    borderRadius: "var(--radius-md)",
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                }}
                            >
                                <span style={{ color: "var(--color-text-secondary)", fontSize: "0.875rem" }}>
                                    {dept}
                                </span>
                                <span className="badge badge-primary">{count}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Recent Employees */}
            {recentEmployees.length > 0 && (
                <div className="card">
                    <div className="card-header">
                        <h2 className="card-title">Recent Employees</h2>
                        <Link to="/employees" className="btn btn-ghost btn-sm">
                            View All
                        </Link>
                    </div>
                    <div className="table-container" style={{ border: "none" }}>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Employee ID</th>
                                    <th>Name</th>
                                    <th>Department</th>
                                    <th>Email</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentEmployees.map((emp) => (
                                    <tr key={emp.id}>
                                        <td>
                                            <span className="badge badge-primary">
                                                {emp.employee_id}
                                            </span>
                                        </td>
                                        <td style={{ fontWeight: 500 }}>{emp.full_name}</td>
                                        <td>{emp.department_display}</td>
                                        <td style={{ color: "var(--color-text-secondary)" }}>
                                            {emp.email}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
