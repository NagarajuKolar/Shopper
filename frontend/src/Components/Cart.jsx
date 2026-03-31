import React, { useEffect, useState } from "react";
import { userCart } from "../Contexts/Cartcontext";
import { userCheckout } from "../Contexts/Checkoutcontext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";


function Cart() {
  const { cartitems, removeFromCart } = userCart()
  const { checkoutItems, setcheckoutItems, setCheckoutType, setTotalAmount } = userCheckout();
  const navigate = useNavigate()


  const handleCheckout = () => {
    setcheckoutItems(cartitems);

    let total = 0;

    cartitems.forEach(item => {
      total += item.priceofeach * item.quantity;
    });


    console.log("caltotal:", total);

    setTotalAmount(total);
    setCheckoutType('cart')
    navigate("/checkout");

  };

  if (cartitems.length === 0) {
    return <h2>Your cart is empty</h2>;
  }

  return (
    <>
      <h1>Your Cart Items</h1>

      {cartitems.map((item) => (
        <div key={item._id}>
          <h3>{item.product?.productname}</h3>
          <img src={item.product?.image} width="120" />
          <p>Size: {item.size}</p>
          <p>Quantity: {item.quantity}</p>
          <p>Price: ₹{item.priceofeach}</p>
          <span className="btn btn-danger" onClick={() => removeFromCart(item.eachproduct._id)}>Remove from cart</span>
        </div>
      ))}

      <div className="btn btn-success" onClick={() => handleCheckout()}>
        Checkout
      </div>
    </>
  );
}

export default Cart;
