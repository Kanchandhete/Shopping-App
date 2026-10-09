import { useEffect, useState } from "react";
import { ProductCard } from "./ProductCard";
import "../css/Home.css";

const API_URL = "http://localhost:8080/api";

export function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_URL}/products`);

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await response.json();

        setProducts(data);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError(
          "Unable to load products. Please check whether the backend is running.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = (product) => {
    // This is only a temporary demonstration.
    // It does not save a cart to the database.
    alert(`${product.name} added to cart`);
  };

  if (loading) {
    return (
      <div className="product-container">
        <h2>Loading products...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="product-container">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="product-container">
      <h1>Products</h1>

      {products.length === 0 ? (
        <p>No products found. Add your first product!</p>
      ) : (
        <div className="product-list">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
      )}
    </div>
  );
}
