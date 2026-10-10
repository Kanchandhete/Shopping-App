import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "../css/ProductDetails.css";

const API_URL = "http://localhost:8080/api";

export function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    let imageUrl = "";

    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await axios.get(`${API_URL}/products/${id}`);

        if (cancelled) return;

        setProduct(response.data);

        try {
          const imageResponse = await axios.get(
            `${API_URL}/products/${id}/image`,
            { responseType: "blob" },
          );

          if (cancelled) return;

          imageUrl = URL.createObjectURL(imageResponse.data);
          setImage(imageUrl);
        } catch (imageError) {
          console.error("Error loading image:", imageError);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err.response?.status === 404
              ? "Product not found."
              : "Failed to fetch product.",
          );
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

  const handleEditClick = () => {
    navigate(`/products/update/${id}`);
  };

  const deleteProduct = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?",
    );

    if (!confirmed) return;

    try {
      await axios.delete(`${API_URL}/products/${id}`);

      alert("Product deleted successfully!");
      navigate("/");
    } catch (error) {
      console.error("Error deleting product:", error);

      alert(
        error.response?.data?.message ||
          "Failed to delete product. Please try again.",
      );
    }
  };

  if (loading) return <h2>Loading product...</h2>;
  if (error) return <p role="alert">{error}</p>;
  if (!product) return <p>Product not found.</p>;

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
        onClick={() => onAddToCart(product)}
        disabled={!product.available || product.quantity <= 0}
      >
        Add to Cart
      </button>

      <button onClick={handleEditClick}>Update</button>

      <button onClick={deleteProduct}>Delete</button>
    </div>
  );
}
