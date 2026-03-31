import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { userCart } from '../Contexts/Cartcontext';
import { useNavigate } from "react-router-dom";
import { userCheckout } from "../Contexts/Checkoutcontext";
import { toast } from "react-toastify";
import '../CSS/EachProduct.css'
import API from "../utils/api";
function EachProduct() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const { checkoutItems, setcheckoutItems, setCheckoutType, setTotalAmount } = userCheckout();
  const [selectedSize, setSelectedSize] = useState(null);
  const { addToCart, addToWishlist } = userCart()
  const navigate = useNavigate()


  async function geteach() {
    try {
      const res = await fetch(`${API}/api/${slug}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      const result = await res.json();
      setProduct(result);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    geteach();
  }, [slug]);

  const handleBuyNow = () => {
    if (!selectedSize) {
      toast.error("Please select a size");
      return;
    }

    const item = {
      product: {
        _id: product?.product?._id,
        image: product?.product?.image,
        productname: product?.product?.productname,
        price: product?.product?.price,
      },
      productname: product?.product?.productname,
      priceofeach: product?.product?.price,
      quantity,
      size: selectedSize,
    };

    setcheckoutItems([item]);
    setCheckoutType('Buynow')
    setTotalAmount(item.priceofeach * quantity);

    navigate("/checkout");
  };


  if (!product) {
    return <h2>Loading...</h2>;
  }

  return (
    <div className="eachproduct-container">

      <div className="eachproduct-card">

        {/* LEFT - IMAGE */}
        <div className="eachproduct-image">
          <img src={product?.product?.image} alt={product.productname} />
        </div>

        {/* RIGHT - DETAILS */}
        <div className="eachproduct-details">
          <h1 className="eachproduct-title">{product?.product?.productname}</h1>
          <p className="eachproduct-desc">{product?.Productdesc}</p>
          <p className="eachproduct-category">{product?.subcategory}</p>

          <h4>Available Sizes</h4>
          <div className="sizes">
            {product?.availablesizes?.map((size, index) => (
              <span
                key={index}
                className={`size-box ${selectedSize === size ? "active" : ""}`}
                onClick={() => setSelectedSize(size)}
              >
                {size}
              </span>
            ))}
          </div>

          {/* <h4>Rating</h4> */}
          <div className="each-product-review">
            <span>{product?.avgrating}⭐</span>

          </div>

          <div className="actions">
            <button className="btn cart-btn" onClick={() =>
              addToCart({
                eachproductId: product?._id,
                size: selectedSize,
                quantity,
              })}>Add to Cart</button>

            <button className="btn wishlist-btn"
              onClick={() => addToWishlist(product?.product?._id)}>
              Wishlist
            </button>

            <button className="btn buy-btn" onClick={handleBuyNow}>
              Buy Now
            </button>
          </div>

        </div>
      </div>


    </div>
  );
}

export default EachProduct;
