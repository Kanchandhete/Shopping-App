import { useState } from "react";
import "../css/AddProduct.css";

const API_URL = "http://localhost:8080/api";

const initialProduct = {
  name: "",
  brand: "",
  description: "",
  price: "",
  category: "",
  quantity: "",
  releaseDate: "",
  available: true,
};

export function AddProduct() {
  const [product, setProduct] = useState(initialProduct);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setProduct((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    setImage(e.target.files?.[0] ?? null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!image) {
      setError("Please select a product image.");
      return;
    }

    const form = e.currentTarget;

    try {
      setLoading(true);

      const formData = new FormData();

      const productData = {
        ...product,
        price: Number(product.price),
        quantity: Number(product.quantity),
      };

      formData.append(
        "product",
        new Blob([JSON.stringify(productData)], {
          type: "application/json",
        }),
      );

      formData.append("imageFile", image);

      const response = await fetch(`${API_URL}/products`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const message = await response.text();

        throw new Error(
          message || `Failed to add product (${response.status})`,
        );
      }

      const savedProduct = await response.json();

      console.log("Product saved to database:", savedProduct);

      alert("Product added successfully!");

      setProduct(initialProduct);
      setImage(null);
      form.reset();
    } catch (err) {
      console.error("Error adding product:", err);
      setError(err.message || "Failed to add product.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-product-container">
      <div className="add-product-card">
        <h1>Add Product</h1>

        {error && <p role="alert">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Product Name</label>
            <input
              id="name"
              type="text"
              name="name"
              value={product.name}
              onChange={handleChange}
              placeholder="Enter product name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="brand">Brand</label>
            <input
              id="brand"
              type="text"
              name="brand"
              value={product.brand}
              onChange={handleChange}
              placeholder="Enter brand"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={product.description}
              onChange={handleChange}
              placeholder="Enter product description"
              rows={4}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="price">Price</label>
            <input
              id="price"
              type="number"
              name="price"
              value={product.price}
              onChange={handleChange}
              placeholder="Enter price"
              min="0"
              step="0.01"
              required
            />
          </div>

          {/* <div className="form-group">
            <label htmlFor="category">Category</label>
            <input
              id="category"
              type="text"
              name="category"
              value={product.category}
              onChange={handleChange}
              placeholder="Enter category"
              required
            />
          </div> */}

          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              name="category"
              value={product.category}
              onChange={handleChange}
              required
            >
              <option value="">Select category</option>
              <option value="Laptop">Laptop</option>
              <option value="Smartphone">Smartphone</option>
              <option value="Headphone">Headphone</option>
              <option value="Electronics">Electronics</option>
              <option value="Fashion">Fashion</option>
              <option value="Toys">Toys</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="quantity">Stock Quantity</label>
            <input
              id="quantity"
              type="number"
              name="quantity"
              value={product.quantity}
              onChange={handleChange}
              placeholder="Enter stock quantity"
              min="0"
              step="1"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="releaseDate">Release Date</label>
            <input
              id="releaseDate"
              type="date"
              name="releaseDate"
              value={product.releaseDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="imageFile">Product Image</label>
            <input
              id="imageFile"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              required
            />
          </div>

          <div className="available-checkbox">
            <input
              id="available"
              type="checkbox"
              name="available"
              checked={product.available}
              onChange={handleChange}
            />

            <label htmlFor="available">Product Available</label>
          </div>

          <button
            type="submit"
            className="add-product-button"
            disabled={loading}
          >
            {loading ? "Saving Product..." : "Add Product"}
          </button>
        </form>
      </div>
    </div>
  );
}
