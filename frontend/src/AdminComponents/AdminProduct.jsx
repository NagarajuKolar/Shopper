import React from 'react'
import { useState, useEffect } from 'react';
import Addproduct from './Addproduct'
import AddProductdetails from './AddProductdetails'
function AdminProduct() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            const res = await fetch(`${API}/api/products`, {
                credentials: "include",
            });

            const data = await res.json();

            if (res.ok) {
                setProducts(data);
            }
        };

        fetchProducts();
    }, []);
    return (
        <>
            <div className="product-management-layout">
                <div className="product-left">
                    <Addproduct />
                </div>

                <div className="product-right">
                    <AddProductdetails products={products} />
                </div>
            </div>


        </>
    )
}

export default AdminProduct