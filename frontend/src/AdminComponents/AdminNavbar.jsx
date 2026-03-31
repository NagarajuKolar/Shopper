import React from 'react'
import { TbLayoutDashboardFilled } from "react-icons/tb";
import { userAuth } from '../Contexts/Usercontext';
import '../CSS/AdminNavbar.css'
function AdminNavbar({ toggleSidebar }) {
     const { handleLogout, user } = userAuth();
    return (
        <>
            <header className="admin-navbar">
                <button className="hamburger" onClick={toggleSidebar}>
                    <TbLayoutDashboardFilled />
                </button>

                <h3 className="logo">Admin</h3>

                <div className="admin-actions">
                    <span className="admin-name">{user?.name || 'Admin'}</span>
                    <button className="logout-btn" onClick={handleLogout}>Logout</button>
                </div>
            </header>
        </>
    )
}

export default AdminNavbar