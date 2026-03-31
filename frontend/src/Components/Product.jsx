import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import '../CSS/product.css'
import { userAuth } from "../Contexts/Usercontext"
import { FaHeart } from "react-icons/fa"
import { userCart } from '../Contexts/Cartcontext'
import { FaStar } from "react-icons/fa6"
import API from '../utils/api'
function Product() {

  const [products, setproducts] = useState([])
  const { user } = userAuth()
  const { addToWishlist, removeFromWishlist, wishitem } = userCart()
  const [searchParams] = useSearchParams()
  const [popularbrands, setPopularbrands] = useState([])
  const category = searchParams.get("category")
  const subcategory = searchParams.get("subcategory")
  const search = searchParams.get("search")
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedRatings, setSelectedRatings] = useState(null)
  const navigate = useNavigate()

  async function getProducts() {
    try {
      let url = `${API}/api/products`

      if (subcategory) {
        url = `${API}/api/products/search?q=${encodeURIComponent(subcategory)}`
      } else if (category) {
        url = `${API}/api/products/search?q=${encodeURIComponent(category)}`
      } else if (search) {
        url = `${API}/api/products/search?q=${encodeURIComponent(search)}`
      }

      const response = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      })

      if (response.status === 401) {
        navigate("/login")
        return
      }

      const data = await response.json()
      const normalizedProducts = data.map(item => item.product ? item.product : item)

      setproducts(normalizedProducts)

    } catch (error) {
      console.log(error)
    }
  }

  async function getfilteredProducts(brands = [], rating = null) {
    try {
      let url = `${API}`/api/products``;
      const params = [];
      if (brands.length > 0) {
        const brandString = brands.join(",");
        params.push(`brands=${brandString}`);
      }
      if (rating) {
        params.push(`ratings=${rating}`);
      }
      if (params.length > 0) {
        url += "?" + params.join("&");//adding & aftereach filter ?brands=nike,boat&ratings=3
      }

      const response = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      })

      const data = await response.json()
      const normalizedProducts = data.map(item => item.product ? item.product : item)

      setproducts(normalizedProducts)

    } catch (error) {
      console.log(error)
    }
  }


  async function getpopularbrands() {
    try {
      const res = await fetch(`${API}/api/brands/getpopular`)

      const data = await res.json()
      setPopularbrands(data.popularbrand)

    } catch (error) {
      console.error("error in fetching brands", error)
    }
  }

  useEffect(() => {
    getpopularbrands()
  }, [])

  useEffect(() => {
    let brandSlugs = [];

    if (selectedBrands.length > 0) {
      brandSlugs = popularbrands
        .filter((b) => selectedBrands.includes(b._id))//finding id
        .map((b) => b.slug);//getting name
    }

    if (brandSlugs.length > 0 || selectedRatings) {
      getfilteredProducts(brandSlugs, selectedRatings);
      return;
    }

    getProducts();//fetch all

  }, [selectedBrands, popularbrands, selectedRatings, category, subcategory, search]);

  const activeFilterChips = [];

  selectedBrands.forEach((id) => {
    const brand = popularbrands.find((b) => b._id === id);

    if (brand) {
      activeFilterChips.push({
        type: "brand",
        id,
        label: brand.name,
      });
    }
  });

  if (selectedRatings) {
    activeFilterChips.push({
      type: "rating",
      value: selectedRatings,
      label: `${selectedRatings}★ & above`,
    });
  }


  const isInWishlist = (productId) =>
    wishitem.some(item => item.product?._id === productId)

  const toggleWishlist = (product) => {
    if (isInWishlist(product._id)) {
      removeFromWishlist(product._id)
    } else {
      addToWishlist(product._id)
    }
  }

  const handleBrandChange = (brandId) => {
    setSelectedBrands((prev) =>
      prev.includes(brandId) ? prev.filter((id) => id !== brandId) // remove
        : [...prev, brandId] // add
    );
  };
  const ratingOptions = [4, 3];


  return (
    <>


      <div className="shop-layout">
        <aside className="filter-panel">

          <div className="header-side-section">
            <h3 className="filter-title">Filters</h3>

            {/* clear all */}
            {(selectedBrands.length > 0 || selectedRatings) && (
              <>
                <div
                  className="clear-filters-btn"
                  onClick={() => {
                    setSelectedBrands([]);
                    setSelectedRatings(null);
                  }}>
                  Clear All
                </div>
              </>
            )}
          </div>

          {/* chips */}
          <div className="active-filters">
            {activeFilterChips.map((chip, idx) => (
              <span key={`${chip.type}-${idx}`} className="filter-chip">
                {chip.label}
                <span onClick={() => {
                  if (chip.type === "brand") {
                    setSelectedBrands((prev) =>
                      prev.filter((bid) => bid !== chip.id)
                    );
                  }
                  if (chip.type === "rating") { setSelectedRatings(null); }
                }}>✕
                </span>

              </span>
            ))}

          </div>

          {/* brand filtering */}
          <div className="filter-section">
            <h4>Brand</h4>
            <div className="filter-options">
              {popularbrands.map((brand) => (
                <label key={brand._id} className="filter-checkbox">
                  <input type="checkbox" value={brand._id} checked={selectedBrands.includes(brand._id)}
                    onChange={() => handleBrandChange(brand._id)} />
                  <span>{brand?.name}</span>
                </label>
              ))}

            </div>
          </div>

          {/* RATING FILTER */}
          <div className="filter-section">
            <h4>Customer Rating</h4>

            <div className="filter-options">

              {ratingOptions.map((rating) => (
                <label key={rating} className="filter-checkbox">

                  <input
                    type="checkbox"
                    checked={selectedRatings === rating}
                    onChange={() =>
                      setSelectedRatings((prev) =>
                        prev === rating ? null : rating)} />

                  <span>{rating}★ & above</span>

                </label>

              ))}

            </div>
          </div>

        </aside>

        <main className="product-area">
          {products && products.length > 0 ? (
            <div className="product-container">
              {products.map((product) => (
                <div key={product._id} className="product-card">
                  <span
                    className="heart-icon"
                    onClick={() => toggleWishlist(product)}
                    style={{
                      color: isInWishlist(product._id) ? "red" : "gray",
                      cursor: "pointer"
                    }}>
                    <FaHeart />
                  </span>

                  <img src={product.image} alt={product.productname} className="product-image" />

                  <p className={`avgrating ${product?.totalNumreviews > 0 ? "has-review" : "no-review"}`}>
                    {product?.totalNumreviews > 0 ? (
                      <>
                        {product.avgrating.toFixed(1)}
                        <span className="star"><FaStar /></span>
                        ({product.totalNumreviews})
                      </>
                    ) : (
                      "No reviews yet"
                    )}
                  </p>

                  <div className="product-body">
                    <h5 className="product-title">{product.productname}</h5>
                    <p className="product-desc">
                      {product.desc.slice(0, 50)}...
                    </p>
                    {user?.role !== "admin" && (
                      <button
                        className="product-btn"
                        onClick={() => navigate(`/${product.slug}`)}
                      >
                        View Product
                      </button>
                    )}

                  </div>

                </div>

              ))}

            </div>

          ) : (
            <h1>No products found</h1>
          )}

        </main>

      </div>

    </>
  )
}

export default Product
