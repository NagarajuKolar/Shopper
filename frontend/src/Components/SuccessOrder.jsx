import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../utils/api";
function SuccessOrder() {
  const { orderId } = useParams();

  const [successOrder, setSuccessOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  async function fetchSuccessOrder() {
    try {
      const res = await fetch(
        `${API}/api/order/order-success/${orderId}`,{
          method: "GET",
          credentials: "include",
        }
      );

      if (!res.ok) {
        console.error("Failed to fetch order");
        setLoading(false);
        return;
      }

      const data = await res.json();
      setSuccessOrder(data);
      setLoading(false);

    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  }

  useEffect(() => {
    if (orderId) {
      fetchSuccessOrder();
    }
  }, [orderId]);

 
  if (loading) return <h3>Loading order details...</h3>;

  if (!successOrder) return <h3>Order not found</h3>;

  return (
    <section className="success-order">
      <h1>Thank you! Your order was placed successfully </h1>

      <h5>Order ID: {successOrder.orderId}</h5>

      {successOrder.orderItems.map((item) => (
        <div className="order" key={item._id || item.product?._id}>
          <p>{item.productname}</p>

          <img  src={item.product?.image} alt={item.productname}width="120"/>

          <p>Qty: {item.quantity}</p>
        </div>
      ))}

      <h4>Delivery Address</h4>
      <p>{successOrder.shippingAddress.name}</p>
      <p>{successOrder.shippingAddress.address}</p>
      <p>{successOrder.shippingAddress.pincode}</p>
      <p>{successOrder.shippingAddress.phone}</p>

      <h4>Total Paid: ₹{successOrder.totalAmount}</h4>
      <p>Payment Method: {successOrder.paymentMethod}</p>
      <p>Status: {successOrder.orderStatus}</p>
    </section>
  );
}

export default SuccessOrder;
