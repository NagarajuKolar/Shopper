import React, { useEffect, useState } from "react";
import "../CSS/AdminDashboard.css";

import { FaUsers, FaBoxOpen, FaShoppingCart, FaClock, FaCalendarDay, FaRupeeSign } from "react-icons/fa";
import { IoArrowUp, IoArrowDown } from "react-icons/io5";
import API from "../utils/api";

function AdminDashboard() {

  const [getinfo, setGetinfo] = useState(null);

  const getdashboardDetails = async () => {
    try {
      const res = await fetch(`${API}/api/admin/dashboard-summary`, {
        method: "GET",
        credentials: "include",
      });

      const data = await res.json();
      console.log(data)
      setGetinfo(data);

    } catch (error) {
      console.error("failed to fetch");
    }
  };

  useEffect(() => {
    getdashboardDetails();
  }, []);

  if (!getinfo) {
    return <h2>Loading dashboard...</h2>;
  }

  const ordersGrowthPositive = getinfo.ordersGrowth >= 0;
  const revenueGrowthPositive = getinfo.revenueGrowth >= 0;

  return (
    <>
      <h1 className="dashboard-title">Admin Dashboard</h1>

      <section className="dashboard-grid">

        <div className="dashboard-card users">
          <FaUsers className="dashboard-card-icon" />
          <h3>Total Users</h3>
          <p>{getinfo.totalUsers}</p>
        </div>

        <div className="dashboard-card products">
          <FaBoxOpen className="dashboard-card-icon" />
          <h3>Total Products</h3>
          <p>{getinfo.totalProducts}</p>
        </div>

        <div className="dashboard-card revenue">
          <FaRupeeSign className="dashboard-card-icon" />
          <h3>Total Revenue</h3>
          <p>₹ {getinfo.totalRevenue}</p>

          <span className={`growth ${revenueGrowthPositive ? "positive" : "negative"}`}>
            {revenueGrowthPositive ? <IoArrowUp /> : <IoArrowDown />}
            {Math.abs(getinfo.revenueGrowth)}%
          </span>
          <div className="revenue-extra">
            <span>This Month</span>
            <strong>₹ {getinfo.revenueThisMonth}</strong>
          </div>
        </div>

        <div className="dashboard-card orders">
          <FaShoppingCart className="dashboard-card-icon" />
          <h3>Total Orders</h3>
          <p>{getinfo.totalOrders}</p>

          <span className={`growth ${ordersGrowthPositive ? "positive" : "negative"}`}>
            {ordersGrowthPositive ? <IoArrowUp /> : <IoArrowDown />}
            {Math.abs(getinfo.ordersGrowth)}%
          </span>
        </div>

        <div className="dashboard-card pending">
          <FaClock className="dashboard-card-icon" />
          <h3>Pending Orders</h3>
          <p>{getinfo.pendingOrders}</p>
        </div>

        <div className="dashboard-card today">
          <FaCalendarDay className="dashboard-card-icon" />
          <h3>Orders Today</h3>
          <p>{getinfo.ordersToday}</p>
        </div>

      </section>
    </>
  );
}

export default AdminDashboard;