import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = "http://localhost:8080/api";

export function ProductCard({ product, onAddToCart }) {
  const navigate = useNavigate();

  const [image, setImage] = useState("");
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    let imageUrl = "";

    const fetchImage = async () => {
      try {
        setImage("");
        setImageError(false);

        const response = await axios.get(
          `${API_URL}/products/${product.id}/image`,
          { responseType: "blob" },
        );

        imageUrl = URL.createObjectURL(response.data);
        setImage(imageUrl);
      } catch (error) {
        console.error(`Error loading image for product ${product.id}:`, error);
        setImageError(true);
      }
    };

    fetchImage();

    return () => {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [product.id]);

  return (
    <div className="product-card">
      <div className="product-image">
        {image ? (
          <img src={image} alt={product.name} />
        ) : (
          <p>{imageError ? "Image unavailable" : "Loading image..."}</p>
        )}
      </div>

      <h2>{product.name}</h2>

      <p>
        <strong>Brand:</strong> {product.brand}
      </p>

      <p>
        <strong>Price:</strong> ₹{product.price}
      </p>

      <p>
        <strong>Available:</strong> {product.available ? "Yes" : "No"}
      </p>

      <p>
        <strong>Stock:</strong> {product.quantity}
      </p>

      <div className="product-buttons">
        <button onClick={() => navigate(`/product/${product.id}`)}>
          View Details
        </button>

        <button
          onClick={() => onAddToCart(product)}
          disabled={!product.available || product.quantity <= 0}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
