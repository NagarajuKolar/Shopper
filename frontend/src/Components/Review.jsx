import { useState } from "react";
import { FaStar, FaCamera } from "react-icons/fa";
import '../CSS/Review.css'
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import API from "../utils/api";
const ratingLabels = {
    1: "Very Bad",
    2: "Bad",
    3: "Average",
    4: "Good",
    5: "Excellent",
};

function Review() {
    const { productId } = useParams();
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [review, setReview] = useState("");
    const [images, setImages] = useState([]);
    const [imageError, setImageError] = useState("");
    const [hasReviewed, setHasReviewed] = useState(false);
    const MAX_IMAGES = 5;


    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);

        setImageError("");

        setImages((prev) => {
            if (prev.length + files.length > MAX_IMAGES) {
                setImageError(`You can upload maximum ${MAX_IMAGES} images`);
                return prev;
            }

            return [...prev, ...files];
        });
    };

    const AddReview = async (id) => {
        try {
            const formData = new FormData();

            formData.append("rating", rating);
            formData.append("review", review);

            images.forEach((img) => {
                formData.append("images", img); // must match multer field name
            });

            const res = await fetch(
                `${API}/api/product/${id}/write-review`,
                {
                    method: "POST",
                    credentials: "include",
                    body: formData, 
                }
            );

            const data = await res.json();

            if (!res.ok) {
                toast.error(data.message || "Failed to review product");
                return;
            }

            toast.success("Review Added Successfully");
            setHasReviewed(true);

        } catch (error) {
            console.error(error);
            toast.error("Something went wrong");
        }
    };



    const removeImage = (index) => {
        setImages((prev) => prev.filter((_, i) => i !== index));
    };
    return (
        <div className="review-box">
            {/* Rating Section */}
            <h3>Rate this product</h3>

            <div className="stars-row">
                {[1, 2, 3, 4, 5].map((num) => (
                    <FaStar key={num} size={28}
                        className={(hover || rating) >= num ? "star active" : "star"}
                        onClick={() => setRating(num)}
                        onMouseEnter={() => setHover(num)}
                        onMouseLeave={() => setHover(0)}
                    />
                ))}

                {rating > 0 && (
                    <span className="rating-text">{ratingLabels[rating]}</span>
                )}
            </div>

            <h3>Review this product</h3>

            <textarea
                placeholder="Description..."
                value={review}
                disabled={hasReviewed}
                onChange={(e) => setReview(e.target.value)}
            />


            <label className="upload-box">
                <FaCamera size={22} />
                <span>Add photos</span>
                <input type="file"
                    multiple
                    hidden
                    disabled={hasReviewed}
                    onChange={handleImageChange}
                />
            </label>
            {imageError && <p className="img-error">{imageError}</p>}


            {images.length > 0 && (
                <div className="preview-grid">
                    {images.map((img, idx) => (
                        <div key={idx} className="preview-box">
                            <img src={URL.createObjectURL(img)} alt="preview" />
                            <span className="remove-img" onClick={() => removeImage(idx)}> ✕ </span>
                        </div>
                    ))}
                </div>
            )}


            <button className="submit-btn" onClick={() => AddReview(productId)}>SUBMIT</button>
        </div>
    )
}

export default Review