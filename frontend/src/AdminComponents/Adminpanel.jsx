import React from 'react'
import { Outlet } from 'react-router-dom'
import { useState } from 'react';
import Adminsidebar from './Adminsidebar'
import AdminNavbar from './AdminNavbar';
import { TbLayoutDashboardFilled } from "react-icons/tb";
import '../CSS/Adminpanel.css'

function Adminpanel() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const toggleSidebar=() => setSidebarOpen(!sidebarOpen)
    return (
        <div className="admin-layout">
            <AdminNavbar toggleSidebar={toggleSidebar} />
            <Adminsidebar open={sidebarOpen} closeSidebar={() => setSidebarOpen(false)} />

            <main className="admin-content">
                <Outlet />
            </main>
        </div>
    )
}

export default Adminpanel