import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
    HiOutlineSearch,
    HiOutlineTrash,
    HiOutlineUsers,
    HiOutlineUserAdd,
    HiOutlineCalendar,
} from "react-icons/hi";
import { employeeAPI } from "../services/api";
import { LoadingSkeleton } from "../components/Loading";
import EmptyState from "../components/EmptyState";
import ErrorState from "../components/ErrorState";
import ConfirmModal from "../components/ConfirmModal";
import toast from "react-hot-toast";

export default function EmployeeList() {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState("");
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const fetchEmployees = async (searchQuery = "") => {
        setLoading(true);
        setError(null);
        try {
            const params = searchQuery ? { search: searchQuery } : {};
            const res = await employeeAPI.getAll(params);
            setEmployees(res.data.results || res.data);
        } catch (err) {
            setError(err.userMessage || "Failed to load employees.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearch(value);
        // Debounce search
        clearTimeout(window._searchTimeout);
        window._searchTimeout = setTimeout(() => {
            fetchEmployees(value);
        }, 300);
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;
        setDeleting(true);
        try {
            await employeeAPI.delete(deleteTarget.id);
            toast.success(`${deleteTarget.full_name} has been deleted.`);
            setEmployees((prev) => prev.filter((e) => e.id !== deleteTarget.id));
            setDeleteTarget(null);
        } catch (err) {
            toast.error(err.userMessage || "Failed to delete employee.");
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div>
            <div className="page-header">
                <div className="page-header-top">
                    <div>
                        <h1 className="page-title">Employees</h1>
                        <p className="page-subtitle">
                            Manage and view all employee records
                        </p>
                    </div>
                    <Link to="/employees/add" className="btn btn-primary">
                        <HiOutlineUserAdd /> Add Employee
                    </Link>
                </div>
            </div>

            {/* Search */}
            <div style={{ marginBottom: "1.5rem" }}>
                <div className="search-bar">
                    <span className="search-bar-icon">
                        <HiOutlineSearch />
                    </span>
                    <input
                        type="text"
                        placeholder="Search by name..."
                        value={search}
                        onChange={handleSearch}
                    />
                </div>
            </div>

            {/* Content */}
            {loading ? (
                <LoadingSkeleton rows={6} columns={5} />
            ) : error ? (
                <ErrorState message={error} onRetry={() => fetchEmployees(search)} />
            ) : employees.length === 0 ? (
                <EmptyState
                    icon={<HiOutlineUsers />}
                    title="No employees found"
                    description={
                        search
                            ? `No employees matching "${search}". Try a different search.`
                            : "You haven't added any employees yet. Start by adding your first employee."
                    }
                    action={
                        !search && (
                            <Link to="/employees/add" className="btn btn-primary">
                                <HiOutlineUserAdd /> Add First Employee
                            </Link>
                        )
                    }
                />
            ) : (
                <div className="card" style={{ padding: 0 }}>
                    <div className="table-container" style={{ border: "none" }}>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Employee ID</th>
                                    <th>Full Name</th>
                                    <th>Email</th>
                                    <th>Department</th>
                                    <th style={{ width: "120px" }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {employees.map((emp) => (
                                    <tr key={emp.id}>
                                        <td>
                                            <span className="badge badge-primary">
                                                {emp.employee_id}
                                            </span>
                                        </td>
                                        <td style={{ fontWeight: 500 }}>{emp.full_name}</td>
                                        <td style={{ color: "var(--color-text-secondary)" }}>
                                            {emp.email}
                                        </td>
                                        <td>{emp.department_display}</td>
                                        <td>
                                            <div style={{ display: "flex", gap: "0.5rem" }}>
                                                <Link
                                                    to={`/attendance/view?employee=${emp.id}`}
                                                    className="btn btn-ghost btn-sm"
                                                    title="View Attendance"
                                                >
                                                    <HiOutlineCalendar />
                                                </Link>
                                                <button
                                                    className="btn btn-ghost btn-sm"
                                                    style={{ color: "var(--color-danger)" }}
                                                    onClick={() => setDeleteTarget(emp)}
                                                    title="Delete Employee"
                                                >
                                                    <HiOutlineTrash />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            <ConfirmModal
                isOpen={!!deleteTarget}
                title="Delete Employee"
                message={`Are you sure you want to delete "${deleteTarget?.full_name}" (${deleteTarget?.employee_id})? This will also remove all their attendance records. This action cannot be undone.`}
                confirmLabel={deleting ? "Deleting..." : "Delete"}
                onConfirm={handleDelete}
                onCancel={() => setDeleteTarget(null)}
                danger
            />
        </div>
    );
}
