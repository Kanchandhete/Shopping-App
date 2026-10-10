import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../css/ProductDetails.css";

const API_URL = "http://localhost:8080/api";

export function ProductDetails() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let imageUrl = "";
    let cancelled = false;

    const fetchProduct = async () => {
      setLoading(true);
      setError("");
      setProduct(null);
      setImage("");

      try {
        const response = await fetch(`${API_URL}/products/${id}`);

        if (!response.ok) {
          throw new Error(
            response.status === 404
              ? "Product not found."
              : "Failed to fetch product.",
          );
        }

        const data = await response.json();

        if (cancelled) return;

        setProduct(data);

        try {
          const imageResponse = await axios.get(
            `${API_URL}/products/${id}/image`,
            { responseType: "blob" },
          );

          if (cancelled) return;

          imageUrl = URL.createObjectURL(imageResponse.data);
          setImage(imageUrl);
        } catch (imageError) {
          console.error("Error loading product image:", imageError);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Unable to load product.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchProduct();

    return () => {
      cancelled = true;

      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [id]);

  if (loading) {
    return <h2>Loading product...</h2>;
  }

  if (error) {
    return <p role="alert">{error}</p>;
  }

  if (!product) {
    return <p>Product not found.</p>;
  }

  return (
    <div className="product-details">
      <h1>{product.name}</h1>

      {image && (
        <div className="product-image">
          <img src={image} alt={product.name} />
        </div>
      )}

      <p>
        <strong>Brand:</strong> {product.brand}
      </p>
      <p>
        <strong>Description:</strong> {product.description}
      </p>
      <p>
        <strong>Price:</strong> ₹{product.price}
      </p>
      <p>
        <strong>Category:</strong> {product.category}
      </p>
      <p>
        <strong>Release Date:</strong> {product.releaseDate}
      </p>
      <p>
        <strong>Available:</strong> {product.available ? "Yes" : "No"}
      </p>
      <p>
        <strong>Quantity:</strong> {product.quantity}
      </p>

      <button
        disabled={!product.available || product.quantity <= 0}
        onClick={() => alert(`${product.name} added to cart`)}
      >
        Add to Cart
      </button>
    </div>
  );
}
