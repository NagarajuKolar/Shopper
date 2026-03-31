import React, { useState } from "react";
import { Link } from "react-router-dom";
import { userAuth } from "../Contexts/Usercontext";
import { GiHamburgerMenu } from "react-icons/gi";
import "../CSS/Navbar.css";
import { useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import { IoIosClose } from "react-icons/io";
import { userCart } from "../Contexts/Cartcontext";


function Navbar() {
  const { user, isLoggedIn, handleLogout } = userAuth();
  // const [searchinput, setsearchinput] = useState('')
  const { searchinput, setsearchinput, searchedproducts } = userCart();
  const suggestedItems = new Set();
  const [open, setOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);

  const closeMenu = () => setOpen(false);
  const [showsuggestion, setshowsuggestion] = useState(false)
  const navigate = useNavigate()
  const handleSuggestionClick = (item) => {
    setshowsuggestion(false);

    let selectedText = "";

    if (
      item.subcategory &&
      item.subcategory.toLowerCase().includes(searchinput.toLowerCase())
    ) {
      selectedText = item.subcategory;
      navigate(`/products?subcategory=${encodeURIComponent(item.subcategory)}`);
    }
    else if (
      item.category &&
      item.category.toLowerCase().includes(searchinput.toLowerCase())
    ) {
      selectedText = item.category;
      navigate(`/products?category=${encodeURIComponent(item.category)}`);
    }
    else {
      selectedText = item.product.productname;
      navigate(`/products?search=${encodeURIComponent(item.product.productname)}`);
    }

    setsearchinput(selectedText);
  };


  return (
    <nav className="navbar navbar-expand-md custom-navbar fixed-top ">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          {isLoggedIn ? user?.fullname || "Shopper" : "Shopper"}
        </Link>


        <div className="hamburger" onClick={() => setOpen(!open)}>
          <GiHamburgerMenu />
        </div>

        <div className="search-wrapper">
          <span className="search-icon"><FaSearch /></span>

          <input type="text" className="search-input" placeholder="Search products..." value={searchinput}
            onChange={(e) => setsearchinput(e.target.value)}
            onFocus={() => setshowsuggestion(true)}
            onBlur={() => setshowsuggestion(false)} />

          {searchinput && (
            <span className="clear-icon" onClick={() => setsearchinput("")}>
              <IoIosClose />
            </span>
          )}


          {showsuggestion && (
            <div className="searched-container">
              {searchedproducts?.map((s, index) => {
                const suggestiontext =
                  s.subcategory?.toLowerCase().includes(searchinput.toLowerCase()) ? s.subcategory
                    : s.category?.toLowerCase().includes(searchinput.toLowerCase()) ? s.category
                      : s.product?.productname;

                if (!suggestiontext || suggestedItems.has(suggestiontext)) return null;//dupilcate skipping

                suggestedItems.add(suggestiontext);//first time adding

                return (
                  <span className="result" key={s._id || index}
                    onMouseDown={() => handleSuggestionClick(s)}>
                    {suggestiontext}
                  </span>

                );
              })}
            </div>
          )}







        </div>

        <ul className={`navbar-nav ms-auto nav-links ${open ? "open" : ""}`}>

          <li className="nav-item">
            <Link className="nav-link" to="/products" onClick={closeMenu}>
              Products
            </Link>
          </li>


          {!isLoggedIn && (
            <>
              <li className="nav-item">
                <Link className="nav-link" to="/register" onClick={closeMenu}>
                  Register
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/login" onClick={closeMenu}>
                  Login
                </Link>
              </li>

            </>
          )}

          {isLoggedIn && (
            <>
              <li className="nav-item">
                <Link className="nav-link" to="/cart" onClick={closeMenu}>
                  Cart
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/wishlist" onClick={closeMenu}>
                  Wishlist
                </Link>
              </li>

              <li className="nav-item user-dropdown">
                <span
                  className="nav-link dropdown-toggle"
                  role="button"
                  onClick={() => setUserOpen(!userOpen)}>
                  {user?.name || "User"}
                </span>

                {userOpen && (
                  <ul className="dropdown-menu dropdown-menu-end show">
                    <li>
                      <Link
                        className="dropdown-item"
                        to="/profile"
                        onClick={() => {
                          setUserOpen(false);
                          closeMenu();
                        }}
                      >
                        My Profile
                      </Link>
                    </li>

                    <li>
                      <Link
                        className="dropdown-item"
                        to="/order-summary"
                        onClick={() => {
                          setUserOpen(false);
                          closeMenu();
                        }}
                      >
                        Orders
                      </Link>
                    </li>
                  </ul>
                )}
              </li>


              <li className="nav-item">
                <button className="nav-link btn-link" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
