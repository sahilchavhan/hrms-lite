import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

export default function Layout() {
    return (
        <div className="app-layout">
            <Sidebar />
            <main className="main-content">
                <div className="page-transition">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
