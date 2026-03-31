import { useState } from "react"
import React from 'react'
import '../CSS/AddProductdetails.css'
import { toast } from "react-toastify";
import API from "../utils/api";
function AddProductdetails({ products }) {
    const [formData, setFormData] = useState({
        product: "",
        Productdesc: "",
        actualprice: "",
        discountprice: "",
        availablesizes: "",
        category: "",
        subcategory: "",
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formattedData = {
            ...formData,
            availablesizes: formData.availablesizes
                .split(",")
                .map((size) => size.trim()),
        };
        try {
            const res = await fetch(`${API}/api/addeachproduct`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(formattedData),
            })
            const data = await res.json();

            if (!res.ok) {
                toast.error(data.message || "Failed to save address");
                return;
            }
        }
        catch (error) {
            console.error(error)
        }

        console.log(formattedData);
    };




    return (
        <>
            <div className="eachproduct-form-container">
                <h2 className="eachproduct-title">Add Each Product</h2>

                <form className="eachproduct-form" onSubmit={handleSubmit}>

                    <div className="form-group">
                        <label className="form-label">Select Product</label>
                        <select className="form-input" name="product" value={formData.product}
                            onChange={handleChange}
                            required
                        >
                            <option value="">-- Select Product --</option>
                            {products.map((item) => (
                                <option key={item._id} value={item._id}>
                                    {item.productname}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Product Description</label>
                        <textarea
                            className="form-textarea"
                            name="Productdesc"
                            value={formData.Productdesc}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Actual Price</label>
                        <input
                            className="form-input"
                            type="number"
                            name="actualprice"
                            value={formData.actualprice}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Discount Price</label>
                        <input
                            className="form-input"
                            type="number"
                            name="discountprice"
                            value={formData.discountprice}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Available Sizes</label>
                        <input
                            className="form-input"
                            type="text"
                            name="availablesizes"
                            placeholder="S, M, L, XL"
                            value={formData.availablesizes}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Category</label>
                        <input
                            className="form-input"
                            type="text"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Subcategory</label>
                        <input
                            className="form-input"
                            type="text"
                            name="subcategory"
                            value={formData.subcategory}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button className="form-button" type="submit">
                        Add Each Product
                    </button>

                </form>
            </div>

        </>

    )
}

export default AddProductdetails