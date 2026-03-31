import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { Routes, Route, Navigate } from "react-router-dom";
// import './App.css'
import Navbar from './Components/Navbar'
import Register from './Components/Register';
import Login from './Components/Login';
import Product from './Components/Product';
import Profile from './Components/Profile';
import Addproduct from './AdminComponents/Addproduct';
import EachProduct from './Components/EachProduct';
import Cart from './Components/Cart';
import Wishlist from './Components/Wishlist';
import Adminpanel from './AdminComponents/Adminpanel';
import { userAuth } from './Contexts/Usercontext';
import Home from './Components/Home';
import './App.css'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Checkout from './Components/Checkout';
import SuccessOrder from './Components/SuccessOrder';
import OrderSummary from './Components/OrderSummary';
import OrderDetail from './Components/OrderDetail';
import Review from './Components/Review';
import AdminProduct from './AdminComponents/AdminProduct';
import AdminOrders from './AdminComponents/AdminOrders';
import AdminDashboard from './AdminComponents/AdminDashboard';

function App() {
  const { user, isLoggedIn } = userAuth();

  return (
    
    <>
      <>
        {!(isLoggedIn && user?.role === "admin") && <Navbar />}
        {/* <Routes> */}
        {/* <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} /> 
        <Route path="/products" element={<Product />} />
        <Route path="/profile" element={<Profile />} />  
        <Route path='/admin' element={<Addproduct/>}/>
        <Route path='/:productnames' element={<EachProduct/>}/>
        <Route path='/cart' element={<Cart/>}/>
        <Route path='/wishlist' element={<Wishlist/>}/> */}

        <Routes>

          <Route path="/products" element={<Product />} />
          <Route path="/:slug" element={<EachProduct />} />

          {!isLoggedIn && (
            <>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/" element={<Home />} />

            </>
          )}

          {isLoggedIn && user?.role === "user" && (
            <>
              <Route path="/" element={<Home />} />
              <Route path="/profile" element={<Profile />} />
              
              <Route path='/cart' element={<Cart />} />
              <Route path='/wishlist' element={<Wishlist />} />
              <Route path='/checkout' element={<Checkout/>}/>
              <Route path='/order-success/:orderId' element={<SuccessOrder/>}/>
              <Route path='/order-summary' element={<OrderSummary/>}/>
              <Route path='/order-detail-/:orderId' element={<OrderDetail/>}/>
              <Route path='/product/:productId/write-review/'element={<Review/>}/>
            </>
          )}

          {isLoggedIn && user?.role === "admin" && (
            <>


              <Route path="/admin" element={<Adminpanel />}>
                <Route index element={<AdminDashboard/>}/>
                <Route path='/admin/add' element={<AdminProduct />} />
                <Route path='/admin/orders' element={<AdminOrders/>}/>
                {/* <Route index element={<AdminDashboard />} />
                
                <Route path="orders" element={<AdminOrders />} />
                <Route path="products" element={<AdminProducts />} /> */}
              </Route>

            </>
          )}
        </Routes>
        <ToastContainer position="top-right" autoClose={1500} />

      </>


    </>
  )
}

export default App
