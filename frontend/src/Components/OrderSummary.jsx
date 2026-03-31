import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../CSS/Ordersummary.css";
import Pagination from "./Pagination";
import { useNavigate } from "react-router-dom";
import API from "../utils/api";
function OrderSummary() {
  const [orders, setOrders] = useState([]);
  const [searchdOrders, SetsearchedOrders] = useState([]);
  const [input, setinput] = useState("");
  const [currentPage, setcurrentPage] = useState(0);
  const [statusFilters, setStatusFilters] = useState([]);
  const navigate = useNavigate()

  const pageSize = 4;
  const start = currentPage * pageSize;
  const end = start + pageSize;

  const orderStatuses = [
    { label: "On the way", value: "shipped" },
    { label: "Delivered", value: "delivered" },
    { label: "Cancelled", value: "cancelled" },
    { label: "Returned", value: "returned" },
  ];


  //  FETCH ORDERS 
  async function fetchOrderSummary() {
    try {
      let url = `${API}/api/order/order-summary`;

      if (statusFilters.length > 0) {
        url += "?status=" + statusFilters.join(",");
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
      setOrders(data.orders);
      SetsearchedOrders(data.orders);
    } catch (error) {
      console.error("Error ", error);
    }
  }


  //  SEARCH 
  const searchproducts = async (text) => {
    try {
      if (!text) {
        SetsearchedOrders(orders);
        return;
      }

      const res = await fetch(`${API}/api/order/search?query=${encodeURIComponent(text)}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (!res.ok) return;

      const data = await res.json();
      SetsearchedOrders(data.orders);
    } catch (error) {
      console.error(error);
    }
  };

  // STATUS FILTER HANDLER 
  const handleFilterStatus = (status) => { //statusFilters = ["cancelled", "delivered"] like thiss;
    let updatedFilters;

    if (statusFilters.includes(status)) {
      updatedFilters = statusFilters.filter((s) => s !== status);
    } else {
      updatedFilters = [...statusFilters, status];
    }

    setStatusFilters(updatedFilters);
  };


  useEffect(() => {
    fetchOrderSummary();
  }, [statusFilters]);

  useEffect(() => {
    const timer = setTimeout(() => {
      searchproducts(input);
    }, 400);

    return () => clearTimeout(timer);
  }, [input]);

  useEffect(() => {
    setcurrentPage(0);
  }, [input, statusFilters]);

  const displayOrders = input ? searchdOrders : orders;

  return (
    <>
      <section className="summary">
        <h3>Your Orders</h3>

        <div className="filter-sec">
          <h4>Filters</h4>
          <h5>ORDER STATUS</h5>
          {orderStatuses.map((s) => (
            <label key={s.value}>
              <input
                type="checkbox"
                checked={statusFilters.includes(s.value)}
                onChange={() => handleFilterStatus(s.value)}
              />
              {s.label}
            </label>
          ))}

        </div>

        <div className="order-summary-sec">
          <div className="top-sec">
            <input
              type="text"
              placeholder="Search your Orders here"
              value={input}
              onChange={(e) => setinput(e.target.value)}
            />
          </div>

          <div className="order-sec">
            {displayOrders.length === 0 && <p>No orders yet.</p>}

            {displayOrders.slice(start, end).map((order) => (
              <div className="order-box" onClick={() => navigate(`/order-detail-/${order._id}`)} key={order._id}>

                <h5>Order ID: {order._id}</h5>
                <p>Status: {order.orderStatus}</p>
                <p>Total: ₹{order.totalAmount}</p>

                {order.orderItems.map((item) => (
                  <div className="order-grid"
                    key={item._id || item.product?._id} >
                    <div>
                      <img src={item.product?.image}
                        alt={item.productname}
                        width="80"
                      />
                    </div>

                    <div className="order-details">
                      <h5>
                        {item.product?.productname || item.productname}
                      </h5>
                      <p>Size: {item.size}</p>
                      <p>Quantity: {item.quantity}</p>
                    </div>

                    <div className="order-price">
                      <h6>₹{item.priceofeach}</h6>
                    </div>

                    <div className="order-status">
                      <p>Your item is {order.orderStatus}</p>
                      <Link to={`/product/${item.product._id}/write-review`}
                        onClick={(e) => e.stopPropagation()}>
                        <h5>Rate & Review Product</h5>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      <Pagination
        pageSize={pageSize}
        totalProducts={displayOrders.length}
        currentPage={currentPage}
        onPageChange={setcurrentPage}
      />
    </>
  );
}

export default OrderSummary;
