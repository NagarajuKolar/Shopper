import React from 'react'
import '../CSS/Home.css'
import { useState } from 'react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../utils/api'
function Home() {
  const [category, setcategory] = useState([])
  const navigate = useNavigate()
  async function fetchcategories() {
    try {
      const res = await fetch(`${API}/api/categories`, {
        method: 'GET'
      })
      if (!res.ok) {
        console.log('server error')
        return;
      }
      const data = await res.json()
      setcategory(data)

    }
    catch (error) {
      console.log(error)

    }
  }



  useEffect(() => {
    fetchcategories()
  }, [])

  return (
    <>
      <div className="container-fluid banner">
        <div className="left-text">
          <h1 className="heading">Shopper</h1>
          <p>
            Welcome to our online store, your one-stop destination for quality
            products at unbeatable prices. Explore a wide range of categories
            including fashion, electronics, home essentials, and more. Enjoy fast
            shipping, secure payments, and 24/7 customer support for a seamless
            shopping experience. Discover deals, save more, and shop with
            confidence — all from the comfort of your home.
          </p>
        </div>
        <div className="right">
          <div
            className="box" id="box1"
            style={{ backgroundImage: "url('https://media.istockphoto.com/id/1428709516/photo/shopping-online-woman-hand-online-shopping-on-laptop-computer-with-virtual-graphic-icon.jpg?s=612x612&w=0&k=20&c=ROAncmFL4lbSQdU4VOhyXu-43ngzfEqHE5ZZAw5FtYk=')" }}>
            <div className="label">Online Shopping</div>
          </div>

          <div
            className="box" id="box2"
            style={{ backgroundImage: "url('https://media.istockphoto.com/id/864505242/photo/mens-clothing-and-personal-accessories.jpg?s=612x612&w=0&k=20&c=TaJuW3UY9IZMijRrj1IdJRwd6iWzXBlrZyQd1uyBzEY=')" }}>
            <div className="label">Men's Fashion</div>
          </div>

          <div
            className="box"
            id="box3"
            style={{ backgroundImage: "url('https://mccoymart.com/post/wp-content/webp-express/webp-images/uploads/2019/04/kitchen-items-List.jpg.webp')" }} >
            <div className="label">Home & Kitchen</div>
          </div>

          <div
            className="box" id="box4"
            style={{ backgroundImage: "url('https://m.media-amazon.com/images/I/61n0aVXta7L._UY1000_.jpg')" }}>
            <div className="label">Elegant Watches</div>
          </div>

          <div
            className="box" id="box5"
            style={{ backgroundImage: "url('https://www.matrixbricks.com/wp-content/uploads/2024/06/img75.webp')" }} >
            <div className="label">Lady's Fashion</div>
          </div>

          <div
            className="box" id="box6"
            style={{ backgroundImage: "url('https://www.itedgenews.africa/wp-content/uploads/2021/03/Consumer-Electronics.png')" }}>
            <div className="label">Electronics</div>
          </div>

          <div
            className="box" id="box7"
            style={{ backgroundImage: "url('https://okcredit-blog-images-prod.storage.googleapis.com/2021/11/Footwear-business1--1-.jpg')" }}>
            <div className="label">Footwear</div>
          </div>
        </div>
      </div>

      <div className="container">
        <h2 className="category-heading">Shop By Category</h2>
        <div className="cat">
          {category.map((cat, index) => (
            <h3 key={index} className='cat-name' onClick={() => navigate(`/products?category=${encodeURIComponent(cat)}`)}>{cat}</h3>

          )
          )}
        </div>
      </div>
      
    </>
  )
}

export default Home