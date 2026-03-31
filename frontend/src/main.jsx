import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from './Contexts/Usercontext.jsx';
import { CartProvider } from './Contexts/Cartcontext.jsx';
import { CheckoutProvider } from './Contexts/Checkoutcontext.jsx';
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AuthProvider>
      <CheckoutProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </CheckoutProvider>
    </AuthProvider>
  </BrowserRouter>


)
