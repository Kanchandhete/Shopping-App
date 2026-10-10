import { NavLink } from "react-router-dom";
import { useState } from "react";

export function Header() {
  const [search, setSearch] = useState("");

  const handleSearch = () => {
    console.log("Searching for:", search);
  };
  return (
    <>
      <nav>
        <NavLink to="/">Home</NavLink>
        <NavLink to="/addProduct">Add Product</NavLink>
        <NavLink to="/productCard">ProductCard</NavLink>
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button onClick={handleSearch}> Search 🔍 </button>
        <NavLink to="/cart">Cart 🛒 </NavLink>
      </nav>
    </>
  );
}
