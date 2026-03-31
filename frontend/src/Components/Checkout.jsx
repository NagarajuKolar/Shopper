import React from 'react'
import { userCheckout } from '../Contexts/Checkoutcontext'
import '../CSS/Checkout.css'
import { useEffect, useState } from 'react';
import { toast } from "react-toastify";
import checkoutimage from '../assets/check.png'
import { userCart } from '../Contexts/Cartcontext';
import { useNavigate } from "react-router-dom";
import API from '../utils/api';


function Checkout() {
    const { checkoutItems, totalAmount, checkoutType,setcheckoutItems,setCheckoutType,setTotalAmount } = userCheckout();
    const [addresses, setAddresses] = useState([]);
    const [selectedAddressIndex, setSelectedAddressIndex] = useState(null);
    const [editIndex, setEditIndex] = useState(null);
    const { clearcart } = userCart();
const navigate = useNavigate();

    const [address, setAddress] = useState({
        name: "",
        address: "",
        pincode: "",
        phone: "",
        additionalInfo: "",
    });

    const handleSaveAddress = async () => {
        if (!address.name || !address.address || !address.pincode || !address.phone) {
            toast.error("Please fill all required fields");
            return;
        }

        try {
            let url = `${API}/api/user/addAdress`;
            let method = "POST";

            if (editIndex !== null) {
                url = `${API}/api/user/editAdress/${editIndex}`;
                method = "PUT";
            }

            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(address),
            });

            const data = await res.json();

            if (!res.ok) {
                toast.error(data.message || "Failed to save address");
                return;
            }

            fetchadresses();

            setEditIndex(null);
            setSelectedAddressIndex(0);

            setAddress({
                name: "",
                address: "",
                pincode: "",
                phone: "",
                additionalInfo: "",
            });


            toast.success(editIndex !== null ? "Address updated" : "Address added");

        } catch (error) {
            console.error(error);
            toast.error("Server error");
        }
    };


    const handleChange = (e) => {
        setAddress({
            ...address,
            [e.target.name]: e.target.value,
        });
    };

    const handlePlaceOrder = async () => {
        if (selectedAddressIndex === null) {
            toast.error("Please select an address");
            return;
        }

        const finalAddress = addresses[selectedAddressIndex];

        const orderPayload = {
            shippingAddress: finalAddress,
            orderItems: checkoutItems,
            paymentMethod: "COD",
            totalAmount: totalAmount,
            checkoutType,
        };


        try {
            const res = await fetch(`${API}/api/order/postorder`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(orderPayload),
            });

            const data = await res.json();

            if (!res.ok) {
                toast.error(data.message || "Failed to place order");
                return;
            }

            toast.success("Order placed successfully");
            if (checkoutType === "cart") {
                clearcart();
            }
            setcheckoutItems([]);
            setTotalAmount(0);
            setCheckoutType(null);
            navigate(`/order-success/${data.orderId}`);


        } catch (error) {
            console.error(error);
            toast.error("Server error");
        }
    };

    const handleDeleteAddress = async (index) => {
        try {
            const res = await fetch(`${API}/api/user/delAdress/${index}`, {
                method: "DELETE",
                credentials: "include",

            })
            if (!res.ok) {
                console.error("Failed to fetch Adresses");
                return;
            }
            const data = await res.json();
            // setAddresses(prev => prev.filter((_, i) => i !== index));
            fetchadresses();
            toast.success("Adress Deleted")
            setSelectedAddressIndex(null);
        }
        catch (error) {
            console.error(error)
        }

    };

    const handleEditAddress = (index) => {
        setAddress(addresses[index]);
        setEditIndex(index);
    };

    async function fetchadresses() {
        try {
            const res = await fetch(`${API}/api/user/getadress`, {
                method: "GET",
                credentials: "include",
            })
            if (!res.ok) {
                console.error("Failed to fetch Adresses");
                return;
            }
            const data = await res.json();
            setAddresses(data.addresses)
        }
        catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        fetchadresses()
    }, [])


    return (
        <>

            <div className="check-banner">
                <img src={checkoutimage} alt="Checkout banner" className="checkout-banner-img" />
            </div>

            <div className="checkout">
                <div className="checkout-left">

                    <div className="saved-addresses">
                        {addresses.map((addr, index) => (
                            <div key={index}
                                className={`address-card ${selectedAddressIndex === index ? "selected" : ""}`} onClick={() => setSelectedAddressIndex(index)}>
                                <p><b>Name:</b> {addr.name}</p>
                                <p><b>Address:</b> {addr.address}</p>
                                <p><b>pincode:</b> {addr.pincode}</p>
                                <p><b>Phone:</b> {addr.phone}</p>
                                <p><b>Additinal Info:</b> {addr.additionalInfo}</p>

                                <div className="address-actions">
                                    <button onClick={() => handleEditAddress(index)}>Edit</button>
                                    <button onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteAddress(index);
                                    }}> Delete </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="checkout-container">


                        <h2 className='text-center'>Delivery Address</h2>

                        <form className="checkout-form">

                            <div className="form-group">
                                <label htmlFor="name">Full Name *</label>
                                <input id="name" type="text" name="name" placeholder="Enter your full name" value={address.name} onChange={handleChange} />
                            </div>

                            <div className="form-group">
                                <label htmlFor="address">Address *</label>
                                <textarea id="address" name="address" placeholder="House no, street, city, state" value={address.address} onChange={handleChange} />
                            </div>

                            <div className="form-group">
                                <label htmlFor="pincode">Pincode *</label>
                                <input id="pincode" type="text" name="pincode" placeholder="Enter pincode" value={address.pincode} onChange={handleChange} />
                            </div>

                            <div className="form-group">
                                <label htmlFor="phone">Phone Number *</label>
                                <input id="phone" type="text" name="phone" placeholder="Enter phone number" value={address.phone} onChange={handleChange} />
                            </div>

                            <div className="form-group">
                                <label htmlFor="additionalInfo">Additional Info (Optional)</label>
                                <textarea id="additionalInfo" name="additionalInfo" placeholder="Landmark, delivery instructions" value={address.additionalInfo} onChange={handleChange} />
                            </div>
                            <button type="button" className='mx-3' onClick={handleSaveAddress}>
                                Save Address
                            </button>



                        </form>

                    </div>

                </div>
                <div className="checkout-summary">
                    {checkoutItems.map(item => (
                        <div key={item._id}>
                            <p>{item.productname}</p>
                            <img src={item.product?.image} alt="" width="120" />
                            <p>Qty: {item.quantity}</p>
                            <p>₹{item.priceofeach}</p>
                        </div>
                    ))}

                    <h3>Total: ₹{totalAmount}</h3>

                    <button type="button " className="w-100 my-4" onClick={handlePlaceOrder}>
                        Place Order
                    </button>
                </div>




            </div>

        </>
    )
}

export default Checkout