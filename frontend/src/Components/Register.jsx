import React from 'react'
import { useState } from 'react';
import '../CSS/Register.css'
import { Link, Navigate, useNavigate } from "react-router-dom";
import { userAuth } from "../Contexts/Usercontext";
import API from '../utils/api';
function Register() {
const { user, isLoggedIn, setUser, setIsLoggedIn } = userAuth();
    const [formData, setFormData] = useState({
        fullname: '',
        username: '',
        email: '',
        mobile: '',
        password: '',
        confirmpassword: ''
    });
    const [errors, seterrors] = useState({});

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    }

    const Validate = () => {
        const newerrors = {};
        let isValid = true;

        if (!formData.fullname.trim()) {
            newerrors.fullname = "Name is Required"
            isValid = false;
        }
        if (!formData.username.trim()) {
            newerrors.username = "username is Required"
            isValid = false;
        }

        if (!formData.email.trim()) {
            newerrors.email = "Email is required";
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newerrors.email = "Invalid email format";
            isValid = false;
        }

        if (!formData.mobile.trim()) {
            newerrors.mobile = "Mobile number is required";
            isValid = false;
        } else if (!/^\d{10}$/.test(formData.mobile)) {
            newerrors.mobile = "Mobile number must be 10 digits";
            isValid = false;
        }

        if (!formData.password) {
            newerrors.password = "Password is required";
            isValid = false;
        } else if (!/^(?=.*[0-9])(?=.*[!@#$%^&*])/.test(formData.password)) {
            newerrors.password = "Must contain at least one number and one special character";
            isValid = false;
        }

        if (!formData.confirmpassword) {
            newerrors.confirmpassword = "Confirm your password";
            isValid = false;
        } else if (formData.password !== formData.confirmpassword) {
            newerrors.confirmpassword = "Passwords do not match";
            isValid = false;
        }

        seterrors(newerrors)
        return isValid;
    };

const handleSubmit = async (e) => {
    e.preventDefault();
    const isValid = Validate();
    if (isValid) {
        try {
            const { fullname, username, email, mobile, password } = formData; 
            const response = await fetch(`${API}/api/user/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ fullname, username, email, mobile, password }),
            });

            const data = await response.json();
            if (response.ok) {
                alert("Registered successfully!");
                console.log("User:", data);
                setIsLoggedIn(false)
                Navigate('/login')
                setFormData({
                    fullname: '',
                    username: '',
                    email: '',
                    mobile: '',
                    password: '',
                    confirmpassword: ''
                });
                seterrors({});
            } else {
                alert(data.message || "Error saving user");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Something went wrong!");
        }
    }
};


    return (
        <>
            <form onSubmit={handleSubmit} method='POST'>
                <div className="row">
                    <div className="col">
                        <label htmlFor="fname">Full Name*</label>
                        <input type="text" id="fname" placeholder="Enter your first name"
                            name='fullname'
                            value={formData.fullname}
                            onChange={handleChange} />
                        {errors.fullname && <small className="text-danger">{errors.fullname}</small>}
                    </div>
                    <div className="col">
                        <label htmlFor="lname">User Name*</label>
                        <input type="text" id="lname" placeholder="Enter your last name"
                            name='username'
                            value={formData.username}
                            onChange={handleChange} />
                        {errors.username && <small className="text-danger">{errors.username}</small>}
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <label>Email*</label>
                        <input type="email" placeholder="Enter your Email"
                            name='email'
                            value={formData.email}
                            onChange={handleChange} />
                        {errors.email && <small className="text-danger">{errors.email}</small>}
                    </div>
                    <div className="col">
                        <label>Phone number</label>
                        <input type="number" placeholder="Enter your Phone number"
                            name='mobile'
                            value={formData.mobile}
                            onChange={handleChange} />
                        {errors.mobile && <small className="text-danger">{errors.mobile}</small>}
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <label>PassWord*</label>
                        <input type="password" placeholder="Type your password"
                            name='password'
                            value={formData.password}
                            onChange={handleChange} />
                        {errors.password && <small className="text-danger">{errors.password}</small>}
                    </div>
                    <div className="col">
                        <label>Confirm Password *</label>
                        <input type="password" placeholder="Confirm Password"
                            name='confirmpassword'
                            value={formData.confirmpassword}
                            onChange={handleChange} />
                        {errors.confirmpassword && <small className="text-danger">{errors.confirmpassword}</small>}
                    </div>
                </div>
                <div className="form-footer">
                    <p>Have an account? <a href="#">Login</a></p>
                    <button type="submit">Register</button>
                </div>



            </form>

        </>
    )
}

export default Register