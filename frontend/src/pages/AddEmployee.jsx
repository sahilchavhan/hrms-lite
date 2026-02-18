import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { employeeAPI } from "../services/api";
import { LoadingSpinner } from "../components/Loading";
import toast from "react-hot-toast";

export default function AddEmployee() {
    const navigate = useNavigate();
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        employee_id: "",
        full_name: "",
        email: "",
        department: "",
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        loadDepartments();
    }, []);

    const loadDepartments = async () => {
        try {
            const res = await employeeAPI.getDepartments();
            setDepartments(res.data);
        } catch {
            // Fallback departments
            setDepartments([
                { value: "engineering", label: "Engineering" },
                { value: "marketing", label: "Marketing" },
                { value: "sales", label: "Sales" },
                { value: "hr", label: "Human Resources" },
                { value: "finance", label: "Finance" },
                { value: "operations", label: "Operations" },
                { value: "design", label: "Design" },
                { value: "product", label: "Product" },
                { value: "support", label: "Customer Support" },
                { value: "other", label: "Other" },
            ]);
        }
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.employee_id.trim())
            newErrors.employee_id = "Employee ID is required.";
        if (!formData.full_name.trim())
            newErrors.full_name = "Full name is required.";
        if (formData.full_name.trim().length > 0 && formData.full_name.trim().length < 2)
            newErrors.full_name = "Full name must be at least 2 characters.";
        if (!formData.email.trim()) {
            newErrors.email = "Email is required.";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Please enter a valid email address.";
        }
        if (!formData.department)
            newErrors.department = "Department is required.";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        // Clear field error on change
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setSubmitting(true);
        try {
            await employeeAPI.create({
                ...formData,
                employee_id: formData.employee_id.trim().toUpperCase(),
                email: formData.email.trim().toLowerCase(),
                full_name: formData.full_name.trim(),
            });
            toast.success(`Employee ${formData.full_name} added successfully!`);
            navigate("/employees");
        } catch (err) {
            if (err.response?.status === 409) {
                toast.error("An employee with this ID already exists.");
                setErrors((prev) => ({
                    ...prev,
                    employee_id: "This Employee ID is already taken.",
                }));
            } else if (err.response?.data?.details) {
                // Map server validation errors to form fields
                const serverErrors = {};
                for (const [field, messages] of Object.entries(
                    err.response.data.details
                )) {
                    serverErrors[field] = Array.isArray(messages)
                        ? messages[0]
                        : messages;
                }
                setErrors(serverErrors);
                toast.error("Please fix the errors below.");
            } else {
                toast.error(err.userMessage || "Failed to add employee.");
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">Add Employee</h1>
                <p className="page-subtitle">
                    Create a new employee record in the system
                </p>
            </div>

            <div className="card" style={{ maxWidth: "640px" }}>
                <form onSubmit={handleSubmit}>
                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">
                                Employee ID <span className="required">*</span>
                            </label>
                            <input
                                type="text"
                                name="employee_id"
                                className={`form-input ${errors.employee_id ? "error" : ""}`}
                                placeholder="e.g., EMP001"
                                value={formData.employee_id}
                                onChange={handleChange}
                                maxLength={20}
                            />
                            {errors.employee_id && (
                                <span className="form-error">{errors.employee_id}</span>
                            )}
                        </div>

                        <div className="form-group">
                            <label className="form-label">
                                Department <span className="required">*</span>
                            </label>
                            <select
                                name="department"
                                className={`form-select ${errors.department ? "error" : ""}`}
                                value={formData.department}
                                onChange={handleChange}
                            >
                                <option value="">Select department</option>
                                {departments.map((dept) => (
                                    <option key={dept.value} value={dept.value}>
                                        {dept.label}
                                    </option>
                                ))}
                            </select>
                            {errors.department && (
                                <span className="form-error">{errors.department}</span>
                            )}
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">
                            Full Name <span className="required">*</span>
                        </label>
                        <input
                            type="text"
                            name="full_name"
                            className={`form-input ${errors.full_name ? "error" : ""}`}
                            placeholder="Enter full name"
                            value={formData.full_name}
                            onChange={handleChange}
                            maxLength={150}
                        />
                        {errors.full_name && (
                            <span className="form-error">{errors.full_name}</span>
                        )}
                    </div>

                    <div className="form-group">
                        <label className="form-label">
                            Email Address <span className="required">*</span>
                        </label>
                        <input
                            type="email"
                            name="email"
                            className={`form-input ${errors.email ? "error" : ""}`}
                            placeholder="employee@company.com"
                            value={formData.email}
                            onChange={handleChange}
                        />
                        {errors.email && (
                            <span className="form-error">{errors.email}</span>
                        )}
                    </div>

                    <div
                        style={{
                            display: "flex",
                            gap: "0.75rem",
                            justifyContent: "flex-end",
                            marginTop: "2rem",
                            paddingTop: "1.5rem",
                            borderTop: "1px solid var(--color-border)",
                        }}
                    >
                        <button
                            type="button"
                            className="btn btn-ghost"
                            onClick={() => navigate("/employees")}
                            disabled={submitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary btn-lg"
                            disabled={submitting}
                        >
                            {submitting ? "Adding..." : "Add Employee"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
