import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ProductCard } from "./ProductCard";
import "../css/Home.css";

const API_URL = "http://localhost:8080/api";

export function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchParams] = useSearchParams();

  const keyword = searchParams.get("search") || "";

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const url = keyword.trim()
          ? `${API_URL}/products/search?keyword=${encodeURIComponent(keyword)}`
          : `${API_URL}/products`;

        const response = await fetch(url);

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
  }, [keyword]);

  const handleAddToCart = (product) => {
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
      {products.length === 0 ? (
        <p>
          {keyword
            ? "No matching products found."
            : "No products found. Add your first product!"}
        </p>
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
