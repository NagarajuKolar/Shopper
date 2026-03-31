import React from 'react'
import '../CSS/Addproduct.css'
import { useState } from 'react'
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import API from '../utils/api';

function Addproduct() {
    const [product, setproduct] = useState({
        productname: "",
        desc: "",
        price: "",
        stock: "",
        image: "",
        brand: ""
    });
    const [brands, setBrands] = useState([])
    const handlechange = (e) => {
        setproduct({
            ...product,
            [e.target.name]: e.target.value
        });
    };
    const handlesubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${API}api/products`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(product)
            })
            if (response.ok) {
                const data = await response.json();
                console.log(data)
                toast.success("product added");
                setproduct({
                    productname: "",
                    desc: "",
                    price: "",
                    stock: "",
                    image: "",
                    brand: ""
                })

            }
            else {
                console.error("Failed to add product");
            }
        }
        catch (error) {
            console.log(error)
        }
    }

    async function getallbrands() {
        try {
            const res = await fetch(`${API}/api/brands/getallbrands`, {
                method: "GET"
            })
            if (!res.ok) {
                console.error("Error in Fetching brands")
            }
            const data = await res.json()
            setBrands(data.allBrands)

        }
        catch (error) {
            console.error("error in fetching", error)
        }

    }

    useEffect(() => {
        getallbrands()
    }, [])

    return (
        <>
            <div className="form-container">
                <h2>Product Form</h2>
                <form className="product-form" onSubmit={handlesubmit}>
                    <div className="form-group">
                        <label htmlFor="productname">Product Name</label>
                        <input type="text" id="productname" name="productname" value={product.productname} onChange={handlechange} placeholder="Enter product name" />
                    </div>

                    <div className="form-group">
                        <label htmlFor="desc">Description</label>
                        <textarea id="desc" name="desc" value={product.desc} onChange={handlechange} placeholder="Enter product description"></textarea>
                    </div>

                    <div className="form-group">
                        <label htmlFor="price">Price</label>
                        <input type="number" id="price" name="price" onChange={handlechange} value={product.price} placeholder="Enter price" />
                    </div>

                    <div className="form-group">
                        <label htmlFor="brand">Brand</label>
                        <select id="brand" name="brand" value={product.brand} onChange={handlechange} >
                            <option value="">Select Brand</option>
                            {brands?.map((b) => (
                                <option key={b._id} value={b._id}>
                                    {b.name}
                                </option>
                            ))}
                        </select>
                    </div>


                    <div className="form-group">
                        <label htmlFor="stock">Stock</label>
                        <input type="number" id="stock" name="stock" onChange={handlechange} value={product.stock} placeholder="Enter stock quantity" />
                    </div>

                    <div className="form-group">
                        <label htmlFor="image">Image URL</label>
                        <input type="text" id="image" name="image" onChange={handlechange} value={product.image} placeholder="Enter image URL" />
                    </div>

                    <div className="form-buttons">
                        <button type="submit" className="btn add">Add Product</button>
                        <button type="button" className="btn edit">Edit Product</button>
                    </div>
                </form>
            </div>

        </>
    )
}

export default Addproduct