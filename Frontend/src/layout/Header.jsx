import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import "../css/Header.css";

export function Header() {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();

    if (keyword.trim()) {
      navigate(`/?search=${encodeURIComponent(keyword.trim())}`);
    }
  };

  return (
    <nav className="header">
      <div className="nav-left">
        <NavLink to="/">Home</NavLink>
        <NavLink to="/addProduct">Add Product</NavLink>
        <NavLink to="/updateProduct">Update Product</NavLink>
      </div>

      <div className="nav-right">
        <form className="search-form" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search products..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <button type="submit">Search 🔍</button>
        </form>

        <NavLink to="/cart">Cart 🛒</NavLink>
      </div>
    </nav>
  );
}
