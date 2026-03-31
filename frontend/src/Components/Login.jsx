import React, { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import '../CSS/Login.css'
import { useNavigate } from 'react-router-dom';
import { userAuth } from '../Contexts/Usercontext';
import API from '../utils/api';
function Login() {
    const navigate = useNavigate()
    const { user, isLoggedIn, setUser, setIsLoggedIn } = userAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`${API}/api/user/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
                credentials: "include",
            });

            const data = await response.json();

            if (!response.ok) {
                alert("Invalid credentials");
                return;
            }

            alert("Login successful!");
            setUser({
                userId: data.user._id,          
                role: data.user.role,
                name: data.user.username
            });
            setIsLoggedIn(true);


            if (data?.user?.role === "admin") {
                navigate("/admin");
            } else {
                navigate("/products");
            }

        } catch (error) {
            console.error("Error:", error);
            alert("Something went wrong!");
        }
    };
    return (
        <>
            <div className="login-form">
                <form onSubmit={handleSubmit} method="POST">
                    <label>Email Address *</label>
                    <input type="text" placeholder="Enter Your Email Address" name="email" value={formData.email} onChange={handleChange} />

                    <label>Password *</label>
                    <input type="password" placeholder="Enter password" name="password" value={formData.password} onChange={handleChange} />

                    <div className="forgot">
                        <a href="#" className="password-forgot">Forgot Password?</a>
                    </div>

                    <div className="logins">
                        <Link to="/register">Create Account?</Link>
                        <button type="submit">Login</button>
                    </div>
                </form>
            </div>
        </>
    );
}

export default Login;
