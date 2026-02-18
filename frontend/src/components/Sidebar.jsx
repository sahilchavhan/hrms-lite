import { NavLink, useLocation } from "react-router-dom";
import {
    HiOutlineUsers,
    HiOutlineClipboardList,
    HiOutlineCalendar,
    HiOutlineUserAdd,
    HiOutlineViewGrid,
} from "react-icons/hi";

const navItems = [
    {
        section: "Overview",
        links: [
            { to: "/", icon: <HiOutlineViewGrid />, label: "Dashboard" },
        ],
    },
    {
        section: "Employees",
        links: [
            { to: "/employees", icon: <HiOutlineUsers />, label: "Employee List" },
            { to: "/employees/add", icon: <HiOutlineUserAdd />, label: "Add Employee" },
        ],
    },
    {
        section: "Attendance",
        links: [
            {
                to: "/attendance/mark",
                icon: <HiOutlineClipboardList />,
                label: "Mark Attendance",
            },
            {
                to: "/attendance/view",
                icon: <HiOutlineCalendar />,
                label: "View Records",
            },
        ],
    },
];

export default function Sidebar() {
    const location = useLocation();

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <div className="sidebar-logo">
                    <div className="sidebar-logo-icon">H</div>
                    <div className="sidebar-logo-text">
                        <h1>HRMS Lite</h1>
                        <span>Management System</span>
                    </div>
                </div>
            </div>

            <nav className="sidebar-nav">
                {navItems.map((section) => (
                    <div key={section.section}>
                        <div className="sidebar-section-label">{section.section}</div>
                        {section.links.map((link) => (
                            <NavLink
                                key={link.to}
                                to={link.to}
                                end={link.to === "/"}
                                className={({ isActive }) =>
                                    `sidebar-link ${isActive ? "active" : ""}`
                                }
                            >
                                <span className="sidebar-link-icon">{link.icon}</span>
                                {link.label}
                            </NavLink>
                        ))}
                    </div>
                ))}
            </nav>

            <div className="sidebar-footer">
                <p className="sidebar-footer-text">HRMS Lite v1.0</p>
            </div>
        </aside>
    );
}
