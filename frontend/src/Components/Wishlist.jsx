import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react'
import { useParams } from 'react-router-dom';
import { userCart } from '../Contexts/Cartcontext';
import API from '../utils/api';
function Wishlist() {
const{wishitem,setwishitems,removeFromWishlist }=userCart();
    return (
        <>
            <h1 className='m-3'>your wishlist</h1>
            {wishitem.map((item) => (
                <div key={item._id}>
                    <h3>{item.product?.productname}</h3>
                    <img src={item.product?.image} width="150" />
                    <div className="btn btn-danger" onClick={() => removeFromWishlist(item.product._id)}>Remove from wishlist</div>
                </div>
            ))}

        </>
    )
}

export default Wishlist