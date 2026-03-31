import React from 'react'
import { useState, useEffect } from 'react';
import '../CSS/OrderDetail.css'
import { useParams } from 'react-router-dom';
import { toast } from "react-toastify";
import API from '../utils/api';
function OrderDetail() {
    const { orderId } = useParams();
    const [Orderdetail, setOrderdetail] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showpopup, setshowpopup] = useState(false);
    const [cancelReason, setCancelReason] = useState("");


    async function fetchOrderdetail() {
        try {
            const res = await fetch(
                `${API}/api/order/order-details/${orderId}`, {
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
            setOrderdetail(data.orderdetail);
            setLoading(false);

        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    }

    const CancelOrder = async (orderId) => {
        try {
            const res = await fetch(`${API}/api/order/cancel-order/${orderId}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    cancelReason,
                }),
            })
            const data = await res.json();

            if (!res.ok) {
                toast.error(data.message || "Failed to cancel order");
                return;
            }
            toast.success("Order cancelled successfully")
            setshowpopup(false);
            setCancelReason("");
            fetchOrderdetail()

        }
        catch (error) {
            console.error("Failed to cancel order")
            alert("Something went wrong while cancelling");
        }
    }

    useEffect(() => {
        if (orderId) {
            fetchOrderdetail();
        }
    }, [orderId]);


    if (loading) return <h3>Loading order details...</h3>;

    if (!Orderdetail) return <h3>Order not found</h3>;


    return (
        <>
            <section className="order-detail-page">

                {/* LEFT SIDE */}
                <div className="order-left">


                    {Orderdetail.orderItems.map((item) => (
                        <div className="product-box" key={item._id}>
                            <div className="product-info">
                                <h3>{item.product?.productname}</h3>
                                <p>{item.size}</p>
                                <h2>₹{item.priceofeach}</h2>
                            </div>

                            <img src={item.product?.image} alt={item.product?.productname} />
                        </div>
                    ))}

                    <div className="order-status-timeline">

                        <div className="status-header">
                            <div>
                                <h4>Status</h4>
                                <ul>
                                    <li className="done">
                                        Order {Orderdetail.orderStatus}
                                    </li>
                                </ul>
                            </div>

                            {(Orderdetail.orderStatus === "pending" ||
                                Orderdetail.orderStatus === "confirmed") && (
                                    <button className="cancel-btn" onClick={() => setshowpopup(true)} >
                                        Cancel Order
                                    </button>
                                )}
                        </div>

                    </div>

                    {showpopup && (
                        <div className="popup-overlay">

                            <div className="cancel-form">

                                <div className="top-cancel">
                                    <h4>Cancel Order</h4>
                                    <button
                                        className="close-cancel-btn"
                                        onClick={() => {
                                            setshowpopup(false);
                                            setCancelReason("");
                                        }}
                                    >
                                        ✕
                                    </button>
                                </div>

                                <p className="cancel-text">
                                    Please select a reason for cancellation
                                </p>

                                <div className="reason-options">

                                    {[
                                        "Ordered by mistake",
                                        "Found cheaper elsewhere",
                                        "Delivery taking too long",
                                        "Changed my mind",
                                        "Need to change address/payment",
                                        "Other reason",
                                    ].map((reason) => (
                                        <label key={reason} className="reason-item">
                                            <input
                                                type="radio"
                                                name="cancelReason"
                                                value={reason}
                                                checked={cancelReason === reason}
                                                onChange={() => setCancelReason(reason)}
                                            />
                                            {reason}
                                        </label>
                                    ))}

                                </div>

                                {/* ACTION BUTTONS */}
                                <div className="popup-actions">
                                    <button
                                        className="secondary-btn"
                                        onClick={() => {
                                            setshowpopup(false);
                                            setCancelReason("");
                                        }}>
                                        Go Back
                                    </button>

                                    <button className="cancel-btn" disabled={!cancelReason}
                                      onClick={() => CancelOrder(Orderdetail._id)}>
                                        Confirm Cancel
                                    </button>
                                </div>

                            </div>
                        </div>
                    )}

                    <div className="rating-box">
                        <h4>Rate your experience</h4>
                        <div className="stars">
                            ⭐ ⭐ ⭐ ⭐ ⭐
                        </div>
                        <button>Add photo</button>
                    </div>
                </div>

                {/* RIGHT SIDE */}
                <div className="order-right">

                    {/* DELIVERY */}
                    <div className="card">
                        <h4>Delivery details</h4>
                        <p><b>Adress</b> {Orderdetail.shippingAddress?.address}</p>
                        <p><b>Phone Number </b>{Orderdetail.shippingAddress?.phone}</p>
                    </div>

                    <div className="card">
                        <h4>Price details</h4>

                        <div className="price-row">
                            <span>Total amount</span>
                            <b>₹{Orderdetail.totalAmount}</b>
                        </div>

                        <div className="price-row">
                            <span>Payment method</span>
                            <b>{Orderdetail.paymentMethod}</b>
                        </div>

                        <button className="invoice-btn">
                            Download Invoice
                        </button>
                    </div>

                </div>
            </section>


        </>
    )
}

export default OrderDetail