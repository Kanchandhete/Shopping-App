import { useState } from "react";
import { Routes, Route } from "react-router";
import { Layout } from "./layout/layout";
import { Home } from "./pages/Home";
import { AddProduct } from "./pages/AddProducts";
import "./App.css";
import { ProductDetails } from "./pages/ProductDetails";
import UpdateProduct from "./pages/UpdateProduct";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/addProduct" element={<AddProduct />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/products/update/:id" element={<UpdateProduct />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
