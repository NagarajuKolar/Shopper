import React, { useEffect, useState } from 'react';
import '../CSS/Adminorders.css';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaSearch, FaTimes } from "react-icons/fa";
import API from '../utils/api';
function AdminOrders() {
  const [orderproducts, setOrderproducts] = useState([]);
  const [detailorder, setDetailorder] = useState('')
  const [showModal, setShowModal] = useState(false);
  const [updatedStatus, setUpdatedStatus] = useState("");
  const [statusFilters, setStatusFilters] = useState([]);
  const [searchinput, setSearchinput] = useState("")

  const orderStatuses = [
    { label: "Pending", value: "pending" },
    { label: "On the way", value: "shipped" },
    { label: "Delivered", value: "delivered" },
    { label: "Cancelled", value: "cancelled" },
    { label: "Returned", value: "returned" },
  ];
  const statusTransitions = {
    pending: ["confirmed", "shipped", "cancelled"],
    confirmed: ["shipped", "cancelled"],
    shipped: ["delivered"],
    delivered: ["returned"],
    cancelled: [],
    returned: [],
  };

  async function GetOrders(searchValue = "") {
    try {
      let url = `${API}/api/order/admin/allorders`;
      let params = [];

      if (statusFilters.length > 0) {
        params.push("status=" + statusFilters.join(","));
      }
      if (searchValue.trim() !== "") {
        params.push("search=" + searchValue.trim());
      }
      // attach query params
      if (params.length > 0) {
        url += "?" + params.join("&");
      }


      const res = await fetch(url, {
        method: "GET",
        credentials: "include",
      });

      if (!res.ok) {
        console.error("Failed to fetch orders");
        return;
      }

      const data = await res.json();
      setOrderproducts(data.orders);

    } catch (error) {
      console.error("failed to fetch");
    }
  }

  async function GetOrderDetail(orderid) {
    try {
      const response = await fetch(`${API}/api/order/admin/order-details/${orderid}`, {
        method: "GET",
        credentials: "include"

      })
      if (!response.ok) {
        console.error("Failed to fetch orders");
        return;
      }
      const Data = await response.json()
      setDetailorder(Data.orderdetail)
      const nextStatuses = statusTransitions[Data.orderdetail.orderStatus];

      if (nextStatuses.length > 0) {
        setUpdatedStatus(nextStatuses[0]); // auto-select first valid next step
      } else {
        setUpdatedStatus(Data.orderdetail.orderStatus);
      }


    }
    catch (error) {
      console.error("Order detail Fetched Failed ", error)
    }

  }

  const handleStatusUpdate = async () => {
    try {
      const res = await fetch(
        `${API}/api/order/admin/update-status/${detailorder._id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ status: updatedStatus }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      // Update table instantly
      setOrderproducts((prev) =>
        prev.map((order) =>
          order._id === detailorder._id
            ? { ...order, orderStatus: updatedStatus }
            : order
        )
      );

      setDetailorder({ ...detailorder, orderStatus: updatedStatus });
      await GetOrderDetail(detailorder._id);
      toast.success("Status updated successfully");
      setShowModal(false)
      setStatusFilters([]);

    } catch (error) {
      console.error(error);
    }
  };

  const handleFilterStatus = (status) => { //statusFilters = ["cancelled", "delivered"] like thiss;
    let updatedFilters;

    if (statusFilters.includes(status)) {
      updatedFilters = statusFilters.filter((s) => s !== status);
    } else {
      updatedFilters = [...statusFilters, status];
    }

    setStatusFilters(updatedFilters);
  };


  const ViewDetails = (id) => {
    GetOrderDetail(id);
    setShowModal(true);
  }

useEffect(() => {
  GetOrders();
}, [statusFilters]);


  return (

    <>
      <section className="filtering">
        <h5>ORDER STATUS</h5>
        {orderStatuses.map((s) => (
          <label key={s.value}>
            <input
              type="checkbox" className='order-checkbox'
              checked={statusFilters.includes(s.value)}
              onChange={() => handleFilterStatus(s.value)}
            />
            {s.label}
          </label>
        ))}

      </section>

      <section className="searching-order">
        <div className="search-box">

          <input
            type="text"
            placeholder="Search orderId, Product name, username"
            value={searchinput}
            onChange={(e) => setSearchinput(e.target.value)}
          />

          <button
            className="search-btn"
            onClick={() => GetOrders(searchinput)}
          >
            <FaSearch />
          </button>

          {searchinput && (
            <button
              className="clear-btn"
              onClick={() => {
                setSearchinput("");
                GetOrders("");
              }}
            >
              <FaTimes />
            </button>
          )}

        </div>
      </section>


      <section className="order-table">
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Date</th>
              <th>Status</th>
              <th>Price</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {orderproducts.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{new Date(order.createdAt).toISOString().split("T")[0]}</td>

                <td>
                  <span className={`status-badge ${order.orderStatus}`}>
                    {order.orderStatus}
                  </span>
                </td>

                <td className="price-cell">
                  <img
                    src={order.orderItems?.[0]?.product?.image}
                    alt="product"
                    className="price-img"
                  />
                  ${order.totalAmount}
                </td>

                <td>
                  <button className="view-btn" onClick={() => ViewDetails(order._id)}>View Details</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {
        showModal && detailorder && (
          <div className="modal-overlay">
            <div className="modal-container">

              <div className="modal-header">
                <h3>Order Details</h3>
                <button
                  className="close-btn"
                  onClick={() => setShowModal(false)} >
                  ✕
                </button>
              </div>

              <div className="modal-body">
                <p><strong>Order ID:</strong> {detailorder._id}</p>
                <h4>Status</h4>

                {statusTransitions[detailorder.orderStatus].length > 0 ? (
                  <>
                    <select
                      className="status-select"
                      value={updatedStatus}
                      onChange={(e) => setUpdatedStatus(e.target.value)}
                    >
                      <option value={detailorder.orderStatus} disabled>
                        Current: {detailorder.orderStatus}
                      </option>

                      {statusTransitions[detailorder.orderStatus].map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>

                    <button
                      className="update-status-btn"
                      onClick={handleStatusUpdate}
                    >
                      Update Status
                    </button>
                  </>
                ) : (
                  <p>No further status changes allowed.</p>
                )}
                <p><strong>Payment:</strong> {detailorder.paymentMethod}</p>
                <p><strong>Total:</strong> ₹{detailorder.totalAmount}</p>

                <h4>Items</h4>
                {detailorder.orderItems.map((item, index) => (
                  <div key={index} className="modal-item">
                    <img
                      src={item.product?.image}
                      alt="product"
                      className="modal-item-img"
                    />
                    <div>
                      <p>{item.productname}</p>
                      <p>Qty: {item.quantity}</p>
                      <p>Size: {item.size}</p>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>
        )
      }
    </>
  );
}

export default AdminOrders;