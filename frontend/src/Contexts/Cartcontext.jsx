import { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import API from "../utils/api";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [wishitem, setwishitems] = useState([])
    const [cartitems, setCartitems] = useState([]);
    const [searchinput, setsearchinput] = useState('')
    const [searchedproducts, setsearchedproducts] = useState([]);


    const addToCart = async ({ eachproductId, size, quantity }) => {
        if (!size) {
            toast.warn("Please select a size");
            return;
        }

        try {
            const res = await fetch(`${API}/api/cart/add`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    eachproductId,
                    size,
                    quantity,
                }),
            });
            const data = await res.json();
            if (!res.ok) {
                toast.error(data.message || "Failed to add to cart");
                return;
            }
            toast.success("Added to cart");
            getcartitems();

        } catch (err) {
            console.log(err);
        }
    };

    const addToWishlist = async (productId) => {
        try {
            const res = await fetch(`${API}/api/wishlist`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ productId }),
            });
            const data = await res.json();
            if (!res.ok) {
                toast.error(data.message || "Failed to add to wishlist");
                return;
            }
            fetchwishlist();

            toast.success("Added to wishlist");
        } catch (err) {
            console.log(err);
        }
    };

    async function getcartitems() {
        try {
            const res = await fetch(`${API}/api/cart/fetch`, {
                method: "GET",
                credentials: "include",
            });

            if (!res.ok) {
                console.error("Failed to fetch cart");
                return;
            }

            const data = await res.json();
            setCartitems(data.fcartitems?.items || []);

        } catch (error) {
            console.error("Fetch cart error:", error);
        }
    }


    async function fetchwishlist() {
        
        try {
            const res = await fetch(`${API}/api/wishlist/wish`, {
                method: "GET",
                credentials: "include",
            })
            if (!res.ok) {
                console.error("Failed to fetch wishlist");
                return;
            }
            const data = await res.json()
            setwishitems(data.items.wishitems);
        }
        catch (error) {
            console.error("error")

        }
    }

    const removeFromWishlist = async (productid) => {
        try {
            const res = await fetch(`${API}/api/wishlist/${productid}`, {
                method: "DELETE",
                credentials: "include"
            })
            const data = await res.json();
            fetchwishlist();
            toast.success("Item removed from wishlist ")
        }
        catch (error) {
            console.error("error in deleteing", error)
        }
    }

    const removeFromCart = async (eachproductid) => {
        try {
            const res = await fetch(`${API}/api/cart/${eachproductid}`, {
                method: "DELETE",
                credentials: "include"
            });
            const data = await res.json()
            if(!res.ok){
                toast.error(data.message || "Failed to remove from cart");
                return;

            }
            getcartitems()
            toast.success("Item removed from cart ")


        }
        catch (error) {
            console.error('error in removing', error)
        }
    }

    const clearcart=()=>{
        setCartitems([])
    }

    const searchproducts = async (text) => {
        try {
            if (!text) {
                setsearchedproducts([]);
                return;
            }
            const res = await fetch(`${API}/api/products/search?q=${encodeURIComponent(text)}`, {
                method: "GET",
                credentials: "include"
            })
            const data = await res.json();
            if (!res.ok) 
                {

                console.error("Failed to get searched item");
                return;
            }
            setsearchedproducts(data)
            console.log("searched item", data)

        }
        catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        fetchwishlist();
        getcartitems();
    }, [])
    useEffect(() => {
        const timer = setTimeout(() => {
            searchproducts(searchinput);
        }, 300);

        return () => clearTimeout(timer);
    }, [searchinput]);


    return (
        <CartContext.Provider value={{
            addToCart, cartitems, removeFromCart,clearcart,
            addToWishlist, wishitem, removeFromWishlist,
            searchinput, setsearchinput, searchedproducts
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const userCart = () => useContext(CartContext);
