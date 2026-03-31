import React from 'react'
import { NavLink } from 'react-router-dom'
import '../CSS/Adminsidebar.css'

function Adminsidebar({ open, closeSidebar }) {

    return (
        <>
            {open && <div className="overlay" onClick={closeSidebar} />}

            <aside className={`admin-sidebar ${open ? "open" : ""}`}>
                <NavLink to="/admin" end onClick={closeSidebar}>
                    Dashboard
                </NavLink>
                <NavLink to="/admin/orders" onClick={closeSidebar}>
                    Orders
                </NavLink>
                <NavLink to="/admin/add" onClick={closeSidebar}>
                    Products
                </NavLink>
                <NavLink to="/admin/users" onClick={closeSidebar}>
                    Users
                </NavLink>
            </aside>
        </>
    )
}

export default Adminsidebar