import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/UpdateProduct.css";

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

const UpdateProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [existingImageFile, setExistingImageFile] = useState(null);
  const [product, setProduct] = useState(initialProduct);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch existing product data
  useEffect(() => {
    let cancelled = false;
    let previewUrl = "";

    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await axios.get(`${API_URL}/products/${id}`);

        if (cancelled) return;

        const data = response.data;

        // Fill form with previously saved data
        setProduct({
          name: data.name ?? "",
          brand: data.brand ?? "",
          description: data.description ?? "",
          price: data.price ?? "",
          category: data.category ?? "",
          quantity: data.quantity ?? data.stockQuantity ?? "",
          releaseDate: data.releaseDate
            ? String(data.releaseDate).slice(0, 10)
            : "",
          available: data.available ?? data.productAvailable ?? false,
        });

        // Load existing product image
        try {
          const imageResponse = await axios.get(
            `${API_URL}/products/${id}/image`,
            { responseType: "blob" },
          );

          if (cancelled) return;

          const imageBlob = imageResponse.data;

          const imageFile = new File(
            [imageBlob],
            data.imageName || "product-image.jpg",
            { type: imageBlob.type || "image/jpeg" },
          );
          setExistingImageFile(imageFile);
          previewUrl = URL.createObjectURL(imageBlob);
          setImagePreview(previewUrl);
        } catch (imageError) {
          console.error("Could not load product image:", imageError);
        }
      } catch (err) {
        if (!cancelled) {
          console.error("Error fetching product:", err);
          setError("Failed to load product details.");
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
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setProduct((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (file) {
      setImage(file);

      const previewUrl = URL.createObjectURL(file);
      setImagePreview((previous) => {
        if (previous) URL.revokeObjectURL(previous);
        return previewUrl;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const formData = new FormData();

      const productData = {
        ...product,
        id: Number(id),
        price: Number(product.price),
        quantity: Number(product.quantity),
      };

      formData.append(
        "product",
        new Blob([JSON.stringify(productData)], {
          type: "application/json",
        }),
      );

      // Only attach an image if the user selects a new one.
      formData.append("imageFile", image || existingImageFile);

      await axios.put(`${API_URL}/products/${id}`, formData);

      alert("Product updated successfully!");
      navigate(`/product/${id}`);
    } catch (err) {
      console.error("Error updating product:", err);
      console.error("Backend response:", err.response?.data);
      setError("Failed to update product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <h2>Loading product...</h2>;
  }

  if (error && !product.name) {
    return <p role="alert">{error}</p>;
  }

  return (
    <div className="update-product-container">
      <div className="center-container">
        <h1>Update Product</h1>

        {error && <p role="alert">{error}</p>}

        <form className="row g-3 pt-3" onSubmit={handleSubmit}>
          <div className="col-md-6">
            <label className="form-label">Product Name</label>
            <input
              className="form-control"
              type="text"
              name="name"
              value={product.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Brand</label>
            <input
              className="form-control"
              type="text"
              name="brand"
              value={product.brand}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-12">
            <label className="form-label">Description</label>
            <textarea
              className="form-control"
              name="description"
              value={product.description}
              onChange={handleChange}
              rows={4}
              required
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Price</label>
            <input
              className="form-control"
              type="number"
              name="price"
              value={product.price}
              onChange={handleChange}
              min="0"
              step="0.01"
              required
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Category</label>
            <select
              className="form-select"
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

          <div className="col-md-6">
            <label className="form-label">Stock Quantity</label>
            <input
              className="form-control"
              type="number"
              name="quantity"
              value={product.quantity}
              onChange={handleChange}
              min="0"
              step="1"
              required
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Release Date</label>
            <input
              className="form-control"
              type="date"
              name="releaseDate"
              value={product.releaseDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-12">
            <label className="form-label">Product Image</label>

            {imagePreview && (
              <img
                className="product-image-preview"
                src={imagePreview}
                alt="Product preview"
              />
            )}

            <input
              className="form-control"
              type="file"
              name="imageFile"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>

          <div className="col-12">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                name="available"
                id="available"
                checked={product.available}
                onChange={handleChange}
              />
              <label className="form-check-label" htmlFor="available">
                Product Available
              </label>
            </div>
          </div>

          <div className="col-12">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              Update Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateProduct;
