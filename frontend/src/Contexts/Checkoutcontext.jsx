import { useState, useContext, createContext } from "react";
const checkoutcontext = createContext()

export const CheckoutProvider = ({ children }) => {
    const [checkoutItems, setcheckoutItems] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [checkoutType, setCheckoutType] = useState(null);


    return <checkoutcontext.Provider value={{
        checkoutItems, setcheckoutItems,totalAmount, setTotalAmount,checkoutType,setCheckoutType
    }}>
        {children}
    </checkoutcontext.Provider>
};

export const userCheckout = () => {
  return useContext(checkoutcontext);
};